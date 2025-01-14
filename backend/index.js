import express from "express"
import cors from "cors"
import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import fs from "fs"
import {exec} from "child_process" // watch out
import { stderr, stdout } from "process"

const app = express()

const PORT = 8000;
const BASE_URL = `http://localhost:${PORT}`;
const COURSES_DIR = path.join('uploads/courses');

//multer middleware

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    
    cb(null, "./uploads")
  },
  filename: function(req, file, cb){
    
    console.log("file details",file);
    
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
  }
})

// multer configuration
const upload = multer({storage: storage})


app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true
  })
)

app.use((req, res, next) => {
    
  res.header("Access-Control-Allow-Origin", "http://localhost:5173") // watch it
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  
  next()
})

app.use((error, req, res, next) => {
    console.log('This is the rejected field ->', error.field);
  });

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/uploads", express.static("uploads"))

app.get('/', function(req, res){
  res.json({message: "Hello chai aur code"})
})

app.get('/uploaded-videos', (req, res) => {
  try {
    // Scan the courses directory
    const folders = fs.readdirSync(COURSES_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

      // console.log("folders",folders);
      

    // Build the list of URLs
    const indexFiles = folders.map(folder => {
      const indexPath = path.join(COURSES_DIR, folder, 'index.m3u8');
      if (fs.existsSync(indexPath)) {
        return `${BASE_URL}/uploads/courses/${folder}/index.m3u8`;
      }
      return null;
    }).filter(Boolean); // Remove null entries

    console.log("indesfiles",indexFiles);
    
    res.json(indexFiles);
  } catch (error) {
    console.error('Error reading courses directory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/upload", upload.single('videoFile'), function(req, res){
  const lessonId = uuidv4()
  const videoPath = req.file.path
  const outputPath = `./uploads/courses/${lessonId}`
  const hlsPath = `${outputPath}/index.m3u8`
  console.log("hlsPath", hlsPath)
  console.log("req", req)

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, {recursive: true})
  }

  // ffmpeg
  const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}

`;

  // no queue because of POC, not to be used in production
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`exec error: ${error}`)
    }
    // console.log(`stdout: ${stdout}`)
    // console.log(`stderr: ${stderr}`)
    const videoUrl = `http://localhost:8000/uploads/courses/${lessonId}/index.m3u8`;

    res.json({
      message: "Video converted to HLS format",
      videoUrl: videoUrl,
      lessonId: lessonId
    })
  })

})

app.listen(8000, function(){
  console.log("App is listening at port 3000...")
})
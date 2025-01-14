import { useLayoutEffect, useState } from "react";
import "./App.css";
import FileUpload from "./fileUpload";
import Playlist from "./playlist";
import { VideoPlayer } from "./videoPlayer";
import axios from "axios";

function App() {
  const [videoList, setVideoList] = useState<string[]>(["http://localhost:8000/uploads/courses/6c738e6b-e664-4622-b544-3e4d8c9b077c/index.m3u8"]);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  
  useLayoutEffect(() => {
    doRefresh();
    console.log("useLayoutEffect");
    
  }, []);

  const doRefresh = async () => {

    try {
      const response = await axios.get("http://localhost:8000/uploaded-videos");
      setVideoList(response.data);
    } catch (error) {
      console.error("Error fetching video list:", error);
      alert("Error fetching video list:");
    }
  };

  const changeSelection = (video: string) => {
    console.log("Selected video:", video);
    setSelectedVideo(video);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="video-player-section">
        <VideoPlayer
          hlsSrc={selectedVideo}
        />
        </div>
        <div className="playlist-section">
          <Playlist videoList={videoList} setSelectedVideo={changeSelection}/>
        </div>
      </div>
      <div className="upload-section">
        <FileUpload doRefresh={doRefresh}/>
      </div>
    </div>
  );
}

export default App;

import React, { FC, useState } from "react";
import lang from "./lang/en_US";

interface FileUploadProps {
  doRefresh: () => void;
}

const FileUpload: FC<FileUploadProps> = ({doRefresh}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      console.log(URL.createObjectURL(file));
      
      setVideoPreview(URL.createObjectURL(file)); // Generate a preview URL for the video
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      alert("Please select a video file to upload.");
      return;
    }

    // Example: Simulate upload using FormData
    const formData = new FormData();
    formData.append("videoFile", videoFile);
    
    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Video uploaded successfully!");
        doRefresh();
      } else {
        alert("Failed to upload video.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("An error occurred during the upload.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <label htmlFor="videoFile">{lang.UPLOAD_FILE}</label>
      <input
        type="file"
        accept="video/*"
        name="videoFile"
        onChange={handleFileChange}
        style={{ marginBottom: "10px" }}
      />
      {videoPreview && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Video Preview:</h3>
          <video
            src={videoPreview}
            controls
            width="400"
            style={{ margin: "10px 0" }}
          />
        </div>
      )}
      <button
        onClick={handleUpload}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upload Video
      </button>
    </div>
  );
};

export default FileUpload;

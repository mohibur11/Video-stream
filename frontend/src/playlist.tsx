import React, { FC } from "react";

interface Props {
  videoList: string []; 
  setSelectedVideo: (video: string) => void;
}

const Playlist: FC<Props> = ({videoList, setSelectedVideo }) => {
  // const videos = [
  //   "Video 1",
  //   "Video 2",
  //   "Video 3",
  //   "Video 4",
  //   "Video 5",
  // ];

  return (
    <div className="playlist">
      <h2>Playlist</h2>
      <ul>
        {videoList.map((video) => (
          <li key={video}>
            <button onClick={() => setSelectedVideo(video)}>{video}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;

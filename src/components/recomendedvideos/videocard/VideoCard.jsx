import React from "react";
import "./VideoCard.css";
import LensIcon from "@mui/icons-material/Lens";
import { Avatar } from "@mui/material";
function VideoCard({ image, title, channel, views, timestamp, channelImage }) {
  return (
    <div className="videoCard">
      <img className="videoCard__tumbnail" src={image} alt="" />
      <div className="videoCard__info">
        <Avatar
          className="videoCard__avatar"
          alt={channel}
          src={channelImage}
        />
        <div className="videoCard__text">
          <h4>{title}</h4>
          <p>{channel}</p>
          <p>
            {views} <LensIcon className="fullstop" /> {timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;

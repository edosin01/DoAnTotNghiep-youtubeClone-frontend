import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import videojs from "video.js";
import { client } from "../utils";
import "video.js/dist/video-js.css";

const Player = ({ previewUrl, isViewed }) => {
  const videoRef = useRef(null);

  const dispatch = useDispatch();
  const {
    id: videoId,
    url: src,
    thumb: poster,
  } = useSelector((state) => state.video.data);

  useEffect(() => {
    const vjsPlayer = videojs(videoRef.current, {
      autoplay: "play",
      fluid: true,
    });

    if (!previewUrl) {
      vjsPlayer.poster(poster);
      vjsPlayer.src(src);
    }

    if (previewUrl) {
      vjsPlayer.src({ type: "video/mp4", src: previewUrl });
    }

    vjsPlayer.on("ended", () => {
      if (!previewUrl) {
        isViewed
          ? client(
              `${process.env.REACT_APP_BACKEND_URL}/videos/${videoId}/view`,
              {
                body: {
                  videoId: videoId,
                },
                method: "PUT",
              }
            )
          : client(
              `${process.env.REACT_APP_BACKEND_URL}/videos/${videoId}/view`
            );
      }
    });

    return () => {
      if (vjsPlayer) {
        vjsPlayer.dispose();
      }
    };
  }, [videoId, dispatch, src, previewUrl, poster, isViewed]);

  return (
    <div data-vjs-player>
      <video
        controls
        ref={videoRef}
        className="video-js vjs-fluid vjs-big-play-centered"
        data-setup='{ "playbackRates": [0.5, 1, 1.5, 2] }'
      ></video>
    </div>
  );
};

export default Player;

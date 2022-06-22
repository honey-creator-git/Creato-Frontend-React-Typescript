import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import Button from "../general/button";
import { PlayIcon } from "../../assets/svg";
import "../../assets/styles/dareme/components/videoCardDesktopStyle.scss";

const VideoCardDesktop = (props: any) => {
    const { url, sizeType, coverImage } = props;
    const playerRef = useRef<ReactPlayer | null>(null);
    const [play, setPlay] = useState(false);

    return (
        <div className="videoCard-desktop-wrapper">
            <div className="videoCard-desktop-main" onClick={() => {
                if (play) { 
                    setPlay(false); 
                    playerRef.current?.seekTo(0);
                }
            }}>
                {(!play && coverImage !== "") &&
                    <div className="cover-image">
                        <img
                            src={coverImage}
                            alt="cover Image"
                            style={sizeType ? { width: 'auto', height: '100%' } : { width: '100%', height: 'auto' }} />
                    </div>
                }
                {(play || coverImage === "" || coverImage === undefined) &&
                    <ReactPlayer
                        className={sizeType ? "react-player-height" : "react-player-width"}
                        url={url}
                        playing={play}
                        ref={playerRef}
                        onProgress={(progress) => {
                            if (progress.playedSeconds >= progress.loadedSeconds) playerRef.current?.seekTo(0);
                            if (progress.playedSeconds > 20) playerRef.current?.seekTo(0);
                        }}
                    />
                }
            </div>
            {!play &&
                <div className="play-icon">
                    <Button
                        fillStyle="fill"
                        color="primary"
                        icon={[
                            <PlayIcon color="white" />,
                            <PlayIcon color="white" />,
                            <PlayIcon color="white" />
                        ]}
                        handleSubmit={() => { setPlay(true); }}
                    />
                </div>
            }
        </div>
    );
}

export default VideoCardDesktop;
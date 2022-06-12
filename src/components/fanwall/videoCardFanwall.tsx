import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import Button from "../general/button";
import { PlayIcon, LockedIcon } from "../../assets/svg";
import Linkify from "react-linkify";
import "../../assets/styles/fanwall/components/videoCardFanwallStyle.scss";

const VideoCardFanwall = (props: any) => {
    const { url, letters, lock, handleUnlock, coverImage, sizeType } = props;
    const [play, setPlay] = useState(false);
    const playerRef = useRef<ReactPlayer | null>(null);

    return (
        <div className="fanwall-videoCard-wrapper">
            <div className="fanwall-videoCard" onClick={() => { if (play) setPlay(false); }}>
                {(coverImage && !play && coverImage !== "") &&
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
                        }}
                    />
                }
                {!play &&
                    <div className="play-icon" onClick={e => e.stopPropagation()}>
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
            <div className="fanwall-letters">
                {lock ?
                    letters.substring(0, 70) + " ... ... ... ..." :
                    <Linkify
                        componentDecorator={(decoratedHref: any, decoratedText: any, key: any) => (
                            <a target="blank" href={decoratedHref} key={key}>
                                {decoratedText}
                            </a>
                        )}
                    >{letters ? letters.split("\n").map((line: any, index: any) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    )) : "" }</Linkify>
                }
            </div>
            {lock &&
                <>
                    <div className="fanwall-lock"></div>
                    <div className="lock-icon">
                        <Button
                            text="Unlock"
                            fillStyle="outline"
                            color="primary"
                            shape="rounded"
                            icon={[
                                <LockedIcon color="#EFA058" />,
                                <LockedIcon color="white" />,
                                <LockedIcon color="white" />
                            ]}
                            handleSubmit={handleUnlock}
                        />
                    </div>
                </>
            }
        </div>
    );
};

export default VideoCardFanwall;
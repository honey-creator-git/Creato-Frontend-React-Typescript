import { useContext, useRef, useState } from 'react';
import ReactPlayer from "react-player";
import CategoryBtn from "../general/categoryBtn";
import ContainerBtn from '../general/containerBtn';
import Button from '../general/button';
import { LanguageContext } from '../../routes/authRoute';
import { CreatoCoinIcon, PlayIcon, LockedIcon, MuteVolumeIcon, UnMuteVolumeIcon } from "../../assets/svg";
import { useSelector } from 'react-redux';
import "../../assets/styles/dareme/components/videoCardMobileStyle.scss";

const VideoCardMobile = (props: any) => {
    const { url, title, time, donuts, category, handleSubmit, finished, posted, sizeType, coverImage, fanwallData, goal } = props;
    const playerRef = useRef<ReactPlayer | null>(null);
    const [play, setPlay] = useState(false);
    const userState = useSelector((state: any) => state.auth);
    const [muted, setMouted] = useState(true);
    const user = userState.user;
    const contexts = useContext(LanguageContext);
    const interval = goal ? (Number(goal) / 20).toFixed(1) : 0;
    const count = goal ? Number(Math.floor(Number(donuts) / Number(interval))) : 0;
    const width = donuts < interval ? Math.floor(Number(interval) / Number(goal) * 262) : Math.floor(Number(interval) * count / Number(goal) * 262);

    const calcTime = (time: any) => {
        if (finished) return contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.ENDED;
        if (time > 1) return Math.ceil(time) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.DAYS;
        if ((time * 24) > 1) return Math.ceil(time * 24) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.HOURS;
        if ((time * 24 * 60) > 1) return Math.ceil(time * 24 * 60) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.HOURS;
        if (time > 0) return "1" + contexts.GERNAL_COMPONENT.MOBILE_VIDEO_CARD.MIN;
        else return contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.ENDED;
    }

    const checkLock = () => {
        if (user) {
            if (user.role === "ADMIN") return false;
            if (user.id + "" === fanwallData.writer._id + "") return false;
            if (fanwallData.dareme && fanwallData.dareme.options) {
                const options = fanwallData.dareme.options.filter((option: any) => option.option.win === true);
                for (let i = 0; i < options[0].option.voteInfo.length; i++) {
                    const voteInfo = options[0].option.voteInfo[i];
                    if ((voteInfo.voter + "" === user.id + "") && voteInfo.donuts >= 50) return false;
                }
            } else if (fanwallData.dareme && fanwallData.dareme.options === null) {
                for (let i = 0; i < fanwallData.dareme.voteInfo.length; i++) {
                    const voteInfo = fanwallData.dareme.voteInfo[i];
                    if ((voteInfo.voter + "" === user.id + "") && voteInfo.donuts >= fanwallData.dareme.reward) return false;
                }
            }
            for (let i = 0; i < fanwallData.unlocks.length; i++) if (user.id + "" === fanwallData.unlocks[i].unlocker + "") return false;
            return true;
        } else return true;
    }

    return (
        <div className="videoCard-mobile-wrapper">
            <div className="videoCard-main" onClick={() => {
                if (play) {
                    setPlay(false);
                    setMouted(true);
                    playerRef.current?.seekTo(0);
                }
            }}>
                {(coverImage && !play && coverImage !== "") &&
                    <div className="cover-image">
                        <img
                            src={coverImage}
                            alt="cover Image"
                            style={sizeType ? { width: 'auto', height: '100%' } : { width: '100%', height: 'auto' }} />
                    </div>
                }
                {(play || coverImage === "" || coverImage === undefined) &&
                    <>
                        <ReactPlayer
                            className={sizeType ? "react-player-height" : "react-player-width"}
                            ref={playerRef}
                            url={url}
                            muted={muted}
                            playing={play}
                            playsinline={true}
                            onProgress={(progress) => {
                                if (progress.playedSeconds >= progress.loadedSeconds) playerRef.current?.seekTo(0);
                                if (posted !== true) if (progress.playedSeconds > 20) playerRef.current?.seekTo(0);
                            }}
                        />
                        <div className="mute-icon" onClick={(e) => {
                            e.stopPropagation();
                            setMouted(!muted);
                        }}>
                            {muted === true ?
                                <MuteVolumeIcon color="white" />
                                :
                                <UnMuteVolumeIcon color="white" />
                            }

                        </div>
                    </>
                }
                <div className="information">
                    <div className="time-info">
                        <div className="left-time">
                            {calcTime(time)} {!finished && contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.LEFT}
                        </div>
                        <div className="vote-info">
                            <CreatoCoinIcon color="white" />
                            <span>{donuts !== null ? donuts.toLocaleString() : ''}</span>
                        </div>
                    </div>
                    <div className="dare-title">
                        {title}
                    </div>
                    <div className="category-btn">
                        <CategoryBtn text={category} color="primary" disable={true} />
                    </div>
                </div>
                {goal &&
                    <div className="process-bar">
                        <div className="goal-bar">
                            <div className="value-bar" style={{ width: donuts < goal ? `${width}px` : '262px' }}>
                            </div>
                        </div>
                    </div>
                }
                {!play &&
                    <>
                        {(fanwallData && checkLock()) ?
                            <div className="lock-icon">
                                <Button
                                    fillStyle="fill"
                                    color="primary"
                                    shape="rounded"
                                    icon={[
                                        <LockedIcon color="white" />,
                                        <LockedIcon color="white" />,
                                        <LockedIcon color="white" />
                                    ]}
                                />
                            </div>
                            :
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
                    </>

                }
            </div>
            {handleSubmit &&
                <div className="submit-button" onClick={handleSubmit}>
                    <ContainerBtn
                        styleType='fill'
                        text={posted ? contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.VIEW_POST : finished ? contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.SEE_RESULTS : contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.SEE_MORE}
                    />
                </div>
            }
        </div>
    );
}

export default VideoCardMobile;
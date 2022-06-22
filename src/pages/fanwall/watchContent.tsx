import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ReactPlayer from "react-player";
import YouTubePlayer from "react-player/youtube";
import { useSelector } from "react-redux";
import Title from "../../components/general/title";
import Button from "../../components/general/button";
import Dialog from "../../components/general/dialog";
import { fanwallAction } from "../../redux/actions/fanwallActions";
import { SET_PREVIOUS_ROUTE } from "../../redux/types";
import "../../assets/styles/fanwall/watchContentStyle.scss";

const WatchContent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fanwallId } = useParams();
    const fanwallState = useSelector((state: any) => state.fanwall)
    const fanwall = fanwallState.fanwall;
    const userState = useSelector((state: any) => state.auth);
    const user = userState.user;
    const [isSignIn, setIsSignIn] = useState(false);
    const [isUnLock, setIsUnLock] = useState(false);
    const [isTopUp, setIsTopUp] = useState(false);
    const playerRef = useRef<ReactPlayer | null>(null);

    const checkLock = () => {
        if (user && fanwall.dareme && fanwall.dareme.options) {
            if (user.id + "" === fanwall.writer._id + "") return false;
            const options = fanwall.dareme.options.filter((option: any) => option.option.win === true);
            for (let i = 0; i < options[0].option.voteInfo.length; i++) {
                const voteInfo = options[0].option.voteInfo[i];
                if ((voteInfo.voter + "" === user.id + "") && voteInfo.donuts >= 50) return false;
            }
            for (let i = 0; i < fanwall.unlocks.length; i++) if (user.id + "" === fanwall.unlocks[i].unlocker + "") return false;
            return true;
        } else return true;
    }
    const transUrl = (channel: string) => {
        let url = new URL(channel);
        return url.origin + url.pathname.replace('shorts', 'embed');
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <div className="title-header">
                <Title title="Watch Content" back={() => { navigate("/dareme/fanwall/detail/" + fanwallId) }} />
            </div>
            <div className="watch-content-wrapper">
                <Dialog
                    display={isSignIn}
                    exit={() => { setIsSignIn(false) }}
                    wrapExit={() => { setIsSignIn(false) }}
                    title="Sign in now"
                    context={"Support your favourite creators!"}
                    buttons={[
                        {
                            text: "Sign in",
                            handleClick: () => {
                                dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/fanwall/detail/${fanwallId}` });
                                navigate('/auth/signin');
                            }
                        }
                    ]}
                />
                <Dialog
                    display={isUnLock}
                    exit={() => { setIsUnLock(false) }}
                    wrapExit={() => { setIsUnLock(false) }}
                    title="Unlock Rewaards?"
                    context={"500 Donuts is required"}
                    buttons={[
                        {
                            text: "Cancel",
                            handleClick: () => { setIsUnLock(false) }
                        },
                        {
                            text: "Confirm",
                            handleClick: () => {
                                if (user.wallet >= 500) {
                                    dispatch(fanwallAction.unlockFanwall(fanwallId));
                                    setIsUnLock(false);
                                } else setIsTopUp(true);
                            }
                        }
                    ]}
                />
                <Dialog
                    display={isTopUp}
                    title="Top up now"
                    exit={() => { setIsTopUp(false) }}
                    wrapExit={() => { setIsTopUp(false) }}
                    context={`You need more donuts to\nsupport creators!`}
                    buttons={[
                        {
                            text: "Top up",
                            handleClick: () => {
                                dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/fanwall/detail/${fanwallId}` });
                                navigate(`/${user.personalisedUrl}/shop`);
                            }
                        }
                    ]}
                />
                <div className="watch-content-letter">
                    <span>Let's have a look at what you voted For!</span>
                </div>
                {/* <ReactPlayer                  
                    className="react-player"
                    url={fanwall.embedUrl}
                    playing
                /> */}
                {/* <div className="react-player">
                    <video controls autoPlay onAbort={() => console.log('video tag is aborted')}>
                        <source src={fanwall.embedUrl}></source>
                    </video>
                </div> */}
                <iframe src={transUrl(fanwall.embedUrl)} 
                    width={300}
                    height={200}
                    allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" >
                </iframe>
                <div className="watch-content-btn">
                    <Button
                        handleSubmit={() => {
                            if (checkLock()) {
                                if (user) setIsUnLock(true);
                                else setIsSignIn(true);
                            }
                        }}
                        color="primary"
                        fillStyle={"fill"}
                        width="300px"
                        shape="rounded"
                        text="Unlock Exclusive Rewards!"
                    />
                </div>
            </div>
        </div>
    );
}

export default WatchContent;
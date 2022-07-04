import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fundmeAction } from "../../../redux/actions/fundmeActions";
import VideoCardDesktop from "../../../components/fundme/videoCardDesktop";
import AvatarLink from "../../../components/fundme/avatarLink";
import VideoCardMobile from "../../../components/fundme/videoCardMobile";

import Title from "../../../components/general/title";
import ContainerBtn from "../../../components/general/containerBtn";
// import DareOption from "../../../components/general/dareOption";
import CategoryBtn from "../../../components/general/categoryBtn";
import Dialog from "../../../components/general/dialog";
import CONSTANT from "../../../constants/constant";
import { LanguageContext } from "../../../routes/authRoute";
import { CreatoCoinIcon, RewardIcon, HotIcon } from "../../../assets/svg";
import { SET_FANWALL_INITIAL } from "../../../redux/types";
import "../../../assets/styles/fundme/fund/fundmeResultStyle.scss";
import { findSourceMap } from "module";

const FundmeResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const contexts = useContext(LanguageContext);

    const { fundmeId } = useParams();
    const fundmeState = useSelector((state: any) => state.fundme);
    const loadState = useSelector((state: any) => state.load);
    const fanwallState = useSelector((state: any) => state.fanwall);
    const userState = useSelector((state: any) => state.auth);

    const fundme = fundmeState.fundme;
    const fanwall = fanwallState.fanwall;

    const [totalDonuts, setTotalDonuts] = useState(0);
    const [resultOptions, setResultOptions] = useState<Array<any>>([]);
    const [maxOption, setMaxOption] = useState<any>(null);
    const [isWin, setIsWin] = useState(false);
    const [isStay, setIsStay] = useState(false);
    const [isWinOptionDlg, setIsWinOptionDlg] = useState(false);
    const [winOptionId, setWinOptionId] = useState(false);
    const [optionTitle, setOptionTitle] = useState("");
    const [isCopyLinkDlg, setIsCopyLinkDlg] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isSignIn, setIsSignIn] = useState(false);
    const [isCopyLink, setIsCopyLink] = useState(false);
    const [isTopUp, setIsTopUp] = useState(false);
    const [type, setType] = useState(0);
    const [isFree, setIsFree] = useState(false);
    const [isSuperFan, setIsSuperFan] = useState(false);
    const [isReward, setIsReward] = useState(false);
    const [isOneFree, setIsOneFree] = useState(false);

    const user = userState.user;
    const interval = fundme.goal ? (Number(fundme.goal) / 20).toFixed(1) : 0;
    const count = fundme.goal ? Number(Math.floor(Number(fundme.wallet) / Number(interval))) : 0;
    const width = fundme.wallet <= interval ? Math.floor(Number(interval) / Number(fundme.goal) * 330) : Math.floor(Number(interval) * count / Number(fundme.goal) * 330);

    const calcTime = (time: any) => {
        if (time > 1) return Math.ceil(time) + " days";
        if ((time * 24) > 1) return Math.ceil(time * 24) + " hours";
        if ((time * 24 * 60) > 1) return Math.ceil(time * 24 * 60) + " mins";
        if (time > 0) return "1 min";
        else return "Finished";
    }
    const fund = (donuts: any) => {
        if (user) {
            if (user.id === fundme.owner._id) {
                setIsCopied(false);
                setIsCopyLink(true);
            }
            else {
                if (user.wallet < donuts) setIsTopUp(true);
                else {
                    if (donuts === 1) {
                        setIsFree(true);
                        setType(0);
                    } else {
                        setIsSuperFan(true);
                        setType(1);
                    }
                }
            }
        }
        else setIsSignIn(true);
    }
    const checkCanFree = () => {
        if (fundme.owner && user) {
            for (let i = 0; i < fundme.voteInfo.length; i++)
                if (user.id === fundme.voteInfo[i].voter) {
                    if (fundme.voteInfo[i].canFree === false) return false;
                }
        }
        return true;
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fundmeAction.getFundmeResult(fundmeId));
    }, [location]);

    useEffect(() => {

    }, [fundme]);

    useEffect(() => {
        if (resultOptions.length) {
            setMaxOption(resultOptions.reduce((prev: any, current: any) => (prev.option.donuts > current.option.donuts) ? prev : current));
            setIsWin(resultOptions.filter((option: any) => option.option.win === true).length ? true : false);
        }
    }, [resultOptions]);

    return (
        <>
            <div className="title-header">
                <Title
                    title={contexts.HEADER_TITLE.FUNDME_RESULT}
                    back={() => { navigate('/'); }}
                    voters={() => { navigate(`/fundme/${fundmeId}/voters`) }}
                    ownerId={fundme?.owner?._id}
                />
            </div>
            {fundme.owner &&
                <div className="fundme-details">
                    <div className="fundme-details-videoCardDesktop">
                        <VideoCardDesktop
                            url={CONSTANT.SERVER_URL + "/" + fundme.teaser}
                            sizeType={fundme.sizeType}
                            coverImage={fundme.cover ? `${CONSTANT.SERVER_URL}/${fundme.cover}` : ""}
                        />
                        <AvatarLink
                            avatar={fundme.owner.avatar}
                            username={fundme.owner.name}
                            ownerId={fundme.owner._id}
                            handleAvatar={() => { dispatch(fundmeAction.getFundmesByPersonalisedUrl(fundme.owner.personalisedUrl, navigate)); }}
                            daremeId={fundme._id}
                            isFundme={true}
                        />
                    </div>
                    <div className="fundme-details-information">
                        <div className="fundme-details-videoCardMobile">
                            <VideoCardMobile
                                url={CONSTANT.SERVER_URL + "/" + fundme.teaser}
                                title={fundme.title}
                                time={fundme.time}
                                isFinished={fundme.finished}
                                donuts={fundme.wallet}
                                category={contexts.FUNDME_CATEGORY_LIST[fundme.category - 1]}
                                sizeType={fundme.sizeType}
                                coverImage={fundme.cover ? `${CONSTANT.SERVER_URL}/${fundme.cover}` : ""}
                            />
                            <AvatarLink
                                avatar={fundme.owner.avatar}
                                username={fundme.owner.name}
                                ownerId={fundme.owner._id}
                                handleAvatar={() => { dispatch(fundmeAction.getFundmesByPersonalisedUrl(fundme.owner.personalisedUrl, navigate)); }}
                                daremeId={fundme._id}
                                isFundme={true}
                            />
                        </div>
                        <div className="desktop-header-info">
                            <div className="time-info">
                                <div className="left-time">
                                    {contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.ENDED}
                                </div>
                                <div className="vote-info">
                                    <CreatoCoinIcon color="black" />
                                    <span>{fundme.wallet}</span>
                                </div>
                            </div>
                            <div className="dare-title">{fundme.title}</div>
                            <div className="dare-category">
                                <CategoryBtn text={contexts.FUNDME_CATEGORY_LIST[fundme.category - 1]} color="primary" />
                            </div>
                        </div>
                        <div className="funding-goal">
                            <div className="title">
                                <CreatoCoinIcon color="#EFA058" />
                                <label>{fundme.wallet < fundme.goal ? "Goal" : "Goal Reached!"}</label>
                            </div>
                            <div className="process-bar">
                                <div className="process-value" style={{ width: fundme.wallet < fundme.goal ? `${width}px` : '330px' }}></div>
                            </div>
                            <div className="donuts-count">
                                <span><span className={fundme.wallet >= fundme.goal ? "over-donuts" : ""}>{fundme.wallet.toLocaleString()}</span> / {fundme.goal.toLocaleString()} Donuts</span>
                            </div>
                        </div>
                        <div className="result-button">
                            {user && fundme.owner._id === user.id ?
                                <>
                                    {fanwall && fanwall.writer && fanwall.posted === false ?
                                        <>
                                            <div className="dare-btn" onClick={() => {
                                                dispatch({ type: SET_FANWALL_INITIAL });
                                                navigate(`/dareme/fanwall/detail/${fanwall._id}`);
                                            }} >
                                                <ContainerBtn text={contexts.DAREME_FINISHED.VIEW_ON_FANWALL} styleType="fill" />
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="dare-btn" onClick={() => { dispatch(fundmeAction.postFanwall(fundme._id, navigate)); }}>
                                                <ContainerBtn text="Post on Fanwall" styleType="fill" />
                                            </div>
                                        </>
                                    }
                                </> : 
                                <>
                                    <div className="dare-btn" onClick={() => {
                                        if (fanwall.fanwall === null || fanwall.fanwall.posted === null || (fanwall.writer && fanwall.posted === false)) setIsStay(true);
                                        else {
                                            dispatch({ type: SET_FANWALL_INITIAL });
                                            navigate(`/dareme/fanwall/detail/${fanwall.fanwall._id}`);
                                        }
                                    }}>
                                        <ContainerBtn text={contexts.DAREME_FINISHED.VIEW_ON_FANWALL} styleType="fill" />
                                    </div>
                                </>
                            }
                        </div>
                        <div className="dare-btn" onClick={() => { fund(fundme.reward) }}>
                            <ContainerBtn
                                disabled={true}
                                styleType="fill"
                                text={`${fundme.reward} Donuts (SuperFan!)`}
                                icon={[<HotIcon color="white" />, <HotIcon color="white" />]}
                            />
                        </div>
                        <div className="below-text" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ marginRight: '20px' }}>
                                <div className="reward-btn" onClick={() => { setIsReward(true) }}>
                                    <RewardIcon color="white" width="25" height="25" />
                                </div>
                            </div>
                            <label>Supporting the creator as SuperFan will get you entitled for the reward!</label>
                        </div>
                        <div className="dare-btn" onClick={() => {
                            if (checkCanFree()) fund(1);
                            else setIsOneFree(true);
                        }}>
                            <ContainerBtn
                                // disabled={!checkCanFree()}
                                disabled={true}
                                styleType="outline"
                                text="1 Donut (Free!)"
                            />
                        </div>
                        <div className="below-text">
                            Supporting the creator for Free!<br />
                            This 1 Donut will be donated by Creato!
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default FundmeResult;

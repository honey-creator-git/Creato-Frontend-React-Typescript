import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fundmeAction } from "../../../redux/actions/fundmeActions";
import { daremeAction } from "../../../redux/actions/daremeActions";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
import AvatarLink from "../../../components/dareme/avatarLink";
import VideoCardMobile from "../../../components/dareme/videoCardMobile";
import Title from "../../../components/general/title";
import ContainerBtn from "../../../components/general/containerBtn";
import CategoryBtn from "../../../components/general/categoryBtn";
import Dialog from "../../../components/general/dialog";
import CONSTANT from "../../../constants/constant";
import { LanguageContext } from "../../../routes/authRoute";
import { CreatoCoinIcon, RewardIcon, HotIcon, SpreadIcon } from "../../../assets/svg";
import { SET_FANWALL_INITIAL } from "../../../redux/types";
import "../../../assets/styles/fundme/fund/fundmeResultStyle.scss";

const FundmeResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const contexts = useContext(LanguageContext);

    const { fundmeId } = useParams();
    const fundmeState = useSelector((state: any) => state.fundme);
    const fanwallState = useSelector((state: any) => state.fanwall);
    const userState = useSelector((state: any) => state.auth);
    const [isStay, setIsStay] = useState(false);
    const [isReward, setIsReward] = useState(false);

    const fundme = fundmeState.fundme;
    const fanwall = fanwallState.fanwall;

    const user = userState.user;
    const interval = fundme.goal ? (Number(fundme.goal) / 20).toFixed(1) : 0;
    const count = fundme.goal ? Number(Math.floor(Number(fundme.wallet) / Number(interval))) : 0;
    const width = fundme.wallet <= interval ? Math.floor(Number(interval) / Number(fundme.goal) * 330) : Math.floor(Number(interval) * count / Number(fundme.goal) * 330);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fundmeAction.getFundmeResult(fundmeId));
    }, [location]);

    const calcTime = (time: any) => {
        if (time > 1) return Math.ceil(time) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.DAYS;
        if ((time * 24) > 1) return Math.ceil(time * 24) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.HOURS;
        if ((time * 24 * 60) > 1) return Math.ceil(time * 24 * 60) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.MINS;
        if (time > 0) return "1" + contexts.GERNAL_COMPONENT.MOBILE_VIDEO_CARD.MIN;

        const passTime = Math.abs(time);
        if ((passTime / 7) > 1) return Math.ceil((passTime / 7)) + (Math.ceil((passTime / 7)) === 1 ? contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.WEEK : contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.WEEKS) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.AGO;
        if (passTime > 1) return Math.ceil(passTime) + (Math.ceil(passTime) === 1 ? contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.DAY : contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.DAYS) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.AGO;
        if ((passTime * 24) > 1) return Math.ceil(passTime * 24) + (Math.ceil(passTime * 24) === 1 ? contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.HOUR : contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.HOURS) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.AGO;
        if ((passTime * 24 * 60) > 1) return Math.ceil(passTime * 24 * 60) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.MINS + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.AGO;
        if (passTime > 0) return "1" + contexts.GERNAL_COMPONENT.MOBILE_VIDEO_CARD.MIN + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.AGO;
    }

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
                <>
                    <Dialog
                        display={isReward}
                        exit={() => { setIsReward(false) }}
                        wrapExit={() => { setIsReward(false) }}
                        subTitle={"SuperFans Only 🎊"}
                        icon={
                            {
                                pos: 1,
                                icon: <RewardIcon color="#EFA058" width="60px" height="60px" />
                            }
                        }
                        context={`${fundme?.rewardText}\n\n`}
                    />
                    <Dialog
                        display={isStay}
                        wrapExit={() => { setIsStay(false); }}
                        title={contexts.DIALOG.HEADER_TITLE.STAY_TUNED}
                        context={contexts.DIALOG.BODY_LETTER.BEFORE_FANWALL}
                        icon={{
                            pos: 0,
                            icon: <SpreadIcon color="#EFA058" width="60px" height="60px" />
                        }}
                    />
                    <div className="fundme-result">
                        <div className="fundme-result-videoCardDesktop">
                            <VideoCardDesktop
                                url={CONSTANT.SERVER_URL + "/" + fundme.teaser}
                                sizeType={fundme.sizeType}
                                coverImage={fundme.cover ? `${CONSTANT.SERVER_URL}/${fundme.cover}` : ""}
                            />
                            <AvatarLink
                                avatar={fundme.owner.avatar}
                                username={fundme.owner.name}
                                ownerId={fundme.owner._id}
                                handleAvatar={() => { navigate(`/${fundme.owner.personalisedUrl}`) }}
                                daremeId={fundme._id}
                                isFundme={true}
                            />
                        </div>
                        <div className="fundme-result-information">
                            <div className="fundme-result-videoCardMobile">
                                <VideoCardMobile
                                    url={CONSTANT.SERVER_URL + "/" + fundme.teaser}
                                    title={fundme.title}
                                    time={fundme.time}
                                    finished={fundme.finished}
                                    donuts={fundme.wallet}
                                    category={contexts.FUNDME_CATEGORY_LIST[fundme.category - 1]}
                                    sizeType={fundme.sizeType}
                                    coverImage={fundme.cover ? `${CONSTANT.SERVER_URL}/${fundme.cover}` : ""}
                                />
                                <AvatarLink
                                    avatar={fundme.owner.avatar}
                                    username={fundme.owner.name}
                                    ownerId={fundme.owner._id}
                                    handleAvatar={() => { navigate(`/${fundme.owner.personalisedUrl}`) }}
                                    daremeId={fundme._id}
                                    isFundme={true}
                                />
                            </div>
                            <div className="desktop-header-info">
                                <div className="time-info">
                                    <div className="left-time">
                                    {fundme.finished && contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.ENDED} {calcTime(fundme.time)} {!fundme.finished && contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.LEFT}
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
                                    <label>{fundme.wallet < fundme.goal ? contexts.CREATE_FUNDME_LETTER.FUNDING_GOAL : contexts.CREATE_FUNDME_LETTER.GOAL_REACHED}</label>
                                </div>
                                <div className="process-bar">
                                    <div className="process-value" style={{ width: fundme.wallet < fundme.goal ? `${width}px` : '330px' }}></div>
                                </div>
                                <div className="donuts-count">
                                    <span><span className={fundme.wallet >= fundme.goal ? "over-donuts" : ""}>{fundme.wallet.toLocaleString()}</span> / {fundme.goal.toLocaleString()} {contexts.GENERAL_LETTER.DONUTS}</span>
                                </div>
                            </div>
                            <div className="result-button">
                                {user && fundme.owner._id === user.id ?
                                    <>
                                        {(fanwall && fanwall.writer && fanwall.posted === true) ?
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
                                                    <ContainerBtn text={contexts.DAREME_FINISHED.POST_ON_FANWALL} styleType="fill" />
                                                </div>
                                            </>
                                        }
                                    </> :
                                    <>
                                        <div className="dare-btn" onClick={() => {
                                            if (fanwall === null || fanwall.posted === null || (fanwall.writer && fanwall.posted === false)) setIsStay(true);
                                            else {
                                                dispatch({ type: SET_FANWALL_INITIAL });
                                                navigate(`/dareme/fanwall/detail/${fanwall._id}`);
                                            }
                                        }}>
                                            <ContainerBtn text={contexts.DAREME_FINISHED.VIEW_ON_FANWALL} styleType="fill" />
                                        </div>
                                    </>
                                }
                                <div className="dare-btn" style={{ marginTop: '30px' }} onClick={() => { setIsReward(true) }}>
                                    <ContainerBtn
                                        disabled={false}
                                        styleType="outline"
                                        text={'See SuperFan Reward'}
                                        icon={[<RewardIcon color="#EFA058" />, <RewardIcon color="white" />]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default FundmeResult;

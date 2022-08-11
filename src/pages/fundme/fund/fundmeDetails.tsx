import { useEffect, useState, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { daremeAction } from "../../../redux/actions/daremeActions";
import { fundmeAction } from "../../../redux/actions/fundmeActions";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
import VideoCardMobile from "../../../components/dareme/videoCardMobile";
import AvatarLink from "../../../components/dareme/avatarLink";
import Title from "../../../components/general/title";
import CategoryBtn from "../../../components/general/categoryBtn";
import ContainerBtn from "../../../components/general/containerBtn";
import Dialog from "../../../components/general/dialog";
import Gif from "../../../components/general/gif";
import { LanguageContext } from "../../../routes/authRoute";
import CONSTANT from "../../../constants/constant";
import { CreatoCoinIcon, RewardIcon, HotIcon, LightbulbIcon } from "../../../assets/svg";
import { SET_CURRENT_FUNDME, SET_PREVIOUS_ROUTE, SET_DIALOG_STATE } from "../../../redux/types";
import VoteNonSuperfanGif from '../../../assets/img/vote_non_superfan.gif';
import VoteSuperfanGif from '../../../assets/img/vote_superfan.gif';
import "../../../assets/styles/fundme/fund/fundmeDetailsStyle.scss";

const FundmeDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { fundmeId } = useParams();
  const contexts = useContext(LanguageContext);
  const fundmeState = useSelector((state: any) => state.fundme);
  const loadState = useSelector((state: any) => state.load);
  const userState = useSelector((state: any) => state.auth);
  const dlgState = useSelector((state: any) => state.load.dlgState);
  const fundme = fundmeState.fundme;
  const [isSignIn, setIsSignIn] = useState(false);
  const [isCopyLink, setIsCopyLink] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isReward, setIsReward] = useState(false);
  const [isTopUp, setIsTopUp] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [isSuperFan, setIsSuperFan] = useState(false);
  const [isFundCopyLink, setIsFundCopyLink] = useState(false);
  const [type, setType] = useState(0);
  const [isOneFree, setIsOneFree] = useState(false);
  const [voteNonSuperfanGif, setVoteNonSuperfanGif] = useState(false);
  const [voteSuperfanGif, setVoteSuperfanGif] = useState(false);
  const user = userState.user;
  const interval = fundme.goal ? (Number(fundme.goal) / 20).toFixed(1) : 0;
  const count = fundme.goal ? Number(Math.floor(Number(fundme.wallet) / Number(interval))) : 0;
  const width = fundme.wallet <= interval ? Math.floor(Number(interval) / Number(fundme.goal) * 330) : Math.floor(Number(interval) * count / Number(fundme.goal) * 330);

  const calcTime = (time: any) => {
    if (fundme.finished) return contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.ENDED;
    if (time > 1) return Math.ceil(time) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.DAYS;
    if ((time * 24) > 1) return Math.ceil(time * 24) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.HOURS;
    if ((time * 24 * 60) > 1) return Math.ceil(time * 24 * 60) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.MINS;
    if (time > 0) return "1" + contexts.GERNAL_COMPONENT.MOBILE_VIDEO_CARD.MIN;
    else if (fundme.finished) return contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.ENDED;
  }

  const fund = (donuts: any) => {
    if (user) {
      if (user.id === fundme.owner._id) {
        setIsCopied(false);
        setIsCopyLink(true);
      }
      else {
        if (donuts === 1) {
          setIsFree(true);
          setType(0);
        }
        else {
          if (user.wallet < donuts) setIsTopUp(true);
          else {
            setIsSuperFan(true);
            setType(1);
          }
        }
      }
    }
    else setIsSignIn(true);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fundmeAction.getFundmeDetails(fundmeId));
    dispatch({ type: SET_CURRENT_FUNDME, payload: null });
    dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
  }, [location]);

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
    if (dlgState.type === 'vote_non_superfan' && dlgState.state === true) {
      setIsFundCopyLink(true);
      setVoteNonSuperfanGif(true)
    } else if (dlgState.type === 'vote_superfan' && dlgState.state === true) {
      setIsFundCopyLink(true);
      setVoteSuperfanGif(true)
    }
  }, [dlgState]);

  useEffect(() => {
    if (voteNonSuperfanGif) setTimeout(() => { setVoteNonSuperfanGif(false) }, 4000);
  }, [voteNonSuperfanGif]);

  useEffect(() => {
    if (voteSuperfanGif) setTimeout(() => { setVoteSuperfanGif(false) }, 3500);
  }, [voteSuperfanGif]);

  return (
    <div>
      {voteNonSuperfanGif &&
        <Gif gif={VoteNonSuperfanGif} />
      }
      {voteSuperfanGif &&
        <Gif gif={VoteSuperfanGif} />
      }
      <div className="title-header">
        <Title
          title={contexts.HEADER_TITLE.FUNDME_DETAIL}
          back={() => { navigate(loadState.prevRoute); }}
          voters={() => { navigate(`/fundme/${fundmeId}/voters`) }}
          ownerId={fundme?.owner?._id}
        />
      </div>
      {(fundme.owner && fundme.owner.avatar) &&
        <>
          <Dialog
            display={isFree}
            title={"Free🍩"}
            exit={() => { setIsFree(false) }}
            wrapExit={() => { setIsFree(false) }}
            context={`1 Free Donut for\n${fundme?.title}`}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                handleClick: () => {
                  setIsFree(false);
                  dispatch(fundmeAction.checkFundAndResults(fundmeId, 1, navigate));
                  setIsCopied(false);
                }
              }
            ]}
          />
          <Dialog
            display={isSuperFan}
            title={"SuperFan😍"}
            avatars={[
              fundme.owner.avatar.indexOf('uploads') === -1 ? fundme.owner.avatar : `${CONSTANT.SERVER_URL}/${fundme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}` : ""
            ]}
            exit={() => { setIsSuperFan(false) }}
            wrapExit={() => { setIsSuperFan(false) }}
            context={`${fundme.reward} Donuts for\n${fundme.title}`}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                handleClick: () => {
                  setIsSuperFan(false);
                  dispatch(fundmeAction.checkFundAndResults(fundmeId, fundme.reward, navigate));
                  setIsCopied(false);
                }
              }
            ]}
          />
          <Dialog
            display={isFundCopyLink}
            title={contexts.DIALOG.HEADER_TITLE.HAVE_FUNDED}
            avatars={type === 1 ? [
              fundme.owner.avatar.indexOf('uploads') === -1 ? fundme.owner.avatar : `${CONSTANT.SERVER_URL}/${fundme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}` : ""
            ] : []}
            exit={() => {
              setIsFundCopyLink(false);
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
              setVoteNonSuperfanGif(false);
              setVoteSuperfanGif(false);
            }}
            wrapExit={() => {
              setIsFundCopyLink(false);
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
              setVoteNonSuperfanGif(false);
              setVoteSuperfanGif(false);
            }}
            context={`Congrats!\n${fundme.owner.name} received your Donut support!`}
            buttons={[
              {
                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/fundme/details/${fundmeId}`);
                  setIsCopied(true);
                }
              }
            ]}
            social
            isFundme={true}
            ownerName={fundme.owner.name}
            daremeId={fundmeId}
            daremeTitle={fundme.title}
          />
          <Dialog
            display={isSignIn}
            exit={() => { setIsSignIn(false) }}
            wrapExit={() => { setIsSignIn(false) }}
            title={contexts.DIALOG.HEADER_TITLE.SIGN_IN_NOW}
            context={contexts.DIALOG.BODY_LETTER.SIGN_IN_NOW}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.SIGN_IN,
                handleClick: () => {
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/fundme/details/${fundmeId}` });
                  navigate('/auth/signin');
                }
              }
            ]}
          />
          <Dialog
            display={isTopUp}
            title={contexts.DIALOG.HEADER_TITLE.TOP_UP_NOW}
            exit={() => { setIsTopUp(false) }}
            wrapExit={() => { setIsTopUp(false) }}
            context={contexts.DIALOG.BODY_LETTER.TOP_UP_NOW}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.TOP_UP,
                handleClick: () => {
                  dispatch({ type: SET_CURRENT_FUNDME, payload: fundmeId });
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/fundme/details/${fundmeId}` });
                  navigate(`/myaccount/shop`);
                }
              }
            ]}
          />
          <Dialog
            display={isCopyLink}
            title="Oops!"
            exit={() => { setIsCopyLink(false) }}
            wrapExit={() => { setIsCopyLink(false) }}
            context={"Tell your fans about\nyour FundMe 📣"}
            buttons={[
              {
                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/fundme/details/${fundmeId}`);
                  setIsCopied(true);
                }
              }
            ]}
            social
            daremeId={fundmeId}
            ownerName={fundme.owner.name}
            daremeTitle={fundme.title}
          />
          <Dialog
            display={isOneFree}
            title="Oops❗"
            exit={() => { setIsOneFree(false) }}
            wrapExit={() => { setIsOneFree(false) }}
            context={"Only 1 free Donut\nin each FundMe.\n\nSupport with your Donuts!"}
            buttons={[
              {
                text: "Let's Go",
                handleClick: () => { setIsOneFree(false); }
              }
            ]}
          />
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
          <div className="fundme-details">
            <div className="desktop-header-info">
              <div className="time-info">
                <div className="left-time">
                  {calcTime(fundme.time)} {!fundme.finished && contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.LEFT}
                </div>
                <div className="vote-info">
                  <CreatoCoinIcon color="black" />
                  <span>{fundme.wallet}</span>
                </div>
              </div>
              <div className="title-category">
                <div className="dare-title">{fundme.title}</div>
                <div className="dare-category">
                  <CategoryBtn text={contexts.FUNDME_CATEGORY_LIST[fundme.category - 1]} color="primary" />
                </div>
              </div>
            </div>
            <div className="main-body">
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
                  handleAvatar={() => { navigate(`/${fundme.owner.personalisedUrl}`) }}
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
                    handleAvatar={() => { navigate(`/${fundme.owner.personalisedUrl}`) }}
                    daremeId={fundme._id}
                    isFundme={true}
                  />
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
                <div className="dareme-support-fun">
                  <div className="see-superfan-reward" onClick={() => { setIsReward(true) }}>
                    <ContainerBtn
                      disabled={false}
                      styleType="outline"
                      text={'See SuperFan Reward'}
                      icon={[<RewardIcon color="#EFA058" />, <RewardIcon color="white" />]}
                    />
                  </div>
                  <div className="number-of-donuts">
                    <span></span>Number of Donuts<span></span>
                  </div>
                  <div className="support-fun" onClick={() => {
                    if (checkCanFree()) fund(1);
                    else setIsOneFree(true);
                  }}>
                    <ContainerBtn text={contexts.SUPPORT_CREATOR.FREE_SUPPORT} styleType="outline" disabled={!checkCanFree()} />
                  </div>
                  <div className="support-letter">
                    <span>Donut x1:</span>
                  </div>
                  <div className="support-explain">
                    <span>
                      Supporting the creator for Free! This 1 Donut will be donated by Creato!
                    </span>
                  </div>
                  <div className="support-fun" onClick={() => {
                    fund(fundme.reward)
                  }}>
                    <ContainerBtn text={`Donut x${fundme.reward} (SuperFan!)`} styleType="fill"
                      icon={[<HotIcon color="white" />, <HotIcon color="white" />]}
                    />
                  </div>
                  <div className="support-letter">
                    <span>SuperFans:</span>
                  </div>
                  <div className="support-explain">
                    <span>
                      Support creators by giving specific amount of donut and get exclusive content.
                    </span>
                  </div>
                  <div className="support-fun" onClick={() => {
                    if (user) {
                      if (user.id === fundme.owner._id) {
                        setIsCopied(false);
                        setIsCopyLink(true);
                      } else navigate('/fundme/details/' + fundmeId + '/wish')
                    } else setIsSignIn(true)
                  }}>
                    <ContainerBtn text={'Donuts as you like!'} styleType="fill" bgColor="#DE5A67"
                      icon={[<LightbulbIcon color="white" />, <LightbulbIcon color="white" />]}
                    />
                  </div>
                  <div className="support-letter">
                    <span></span>
                  </div>
                  <div className="support-explain">
                    <span>
                      Support any number of Donuts as you wish!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default FundmeDetails;
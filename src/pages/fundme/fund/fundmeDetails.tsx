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
import Button from "../../../components/general/button";
import { LanguageContext } from "../../../routes/authRoute";
import CONSTANT from "../../../constants/constant";
import { CreatoCoinIcon, RewardIcon, HotIcon } from "../../../assets/svg";
import { SET_CURRENT_FUNDME, SET_PREVIOUS_ROUTE } from "../../../redux/types";
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

  return (
    <>
      <div className="title-header">
        <Title
          title={"FundMe Details"}
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
                  setIsFundCopyLink(true);
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
                  setIsFundCopyLink(true);
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
            exit={() => { setIsFundCopyLink(false) }}
            wrapExit={() => { setIsFundCopyLink(false) }}
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
                  navigate(`/${user.personalisedUrl}/shop`);
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
                handleAvatar={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(fundme.owner.personalisedUrl, navigate)); }}
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
                  handleAvatar={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(fundme.owner.personalisedUrl, navigate)); }}
                  daremeId={fundme._id}
                  isFundme={true}
                />
              </div>
              <div className="desktop-header-info">
                <div className="time-info">
                  <div className="left-time">
                    {calcTime(fundme.time)} {fundme.time > 0 && "left"}
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
              <div className="dare-btn" onClick={() => { fund(fundme.reward) }}>
                <ContainerBtn
                  disabled={false}
                  styleType="fill"
                  text={`${fundme.reward} Donuts (SuperFan!)`}
                  icon={[<HotIcon color="white" />, <HotIcon color="white" />]}
                />
              </div>
              <div className="below-text" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ marginRight: '20px' }}>
                  <div>
                    <Button
                      fillStyle="fill"
                      color="primary"
                      icon={[
                        <RewardIcon color="white" width="25" height="25" />,
                        <RewardIcon color="white" width="25" height="25" />,
                        <RewardIcon color="white" width="25" height="25" />
                      ]}
                      handleSubmit={() => { setIsReward(true) }}
                    />
                  </div>
                </div>
                <label>Supporting the creator as SuperFan will get you entitled for the reward!</label>
              </div>
              <div className="dare-btn" onClick={() => {
                if (checkCanFree()) fund(1);
                else setIsOneFree(true);
              }}>
                <ContainerBtn
                  disabled={!checkCanFree()}
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
        </>
      }
    </>
  );
};

export default FundmeDetails;
import { useEffect, useState, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { daremeAction } from "../../../redux/actions/daremeActions";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
import VideoCardMobile from "../../../components/dareme/videoCardMobile";
import AvatarLink from "../../../components/dareme/avatarLink";
import Title from "../../../components/general/title";
import CategoryBtn from "../../../components/general/categoryBtn";
import ContainerBtn from "../../../components/general/containerBtn";
import DareOption from "../../../components/general/dareOption";
import Dialog from "../../../components/general/dialog";
import SignDialog from "../../../components/general/signDialog"
import WelcomeDlg from "../../../components/general/welcomeDlg"
import { LanguageContext } from "../../../routes/authRoute";
import CONSTANT from "../../../constants/constant";
import { CreatoCoinIcon, NotificationwithCircleIcon, RewardIcon } from "../../../assets/svg";
import { SET_CURRENT_DAREME, SET_PREVIOUS_ROUTE, SET_DIALOG_STATE } from "../../../redux/types";
import "../../../assets/styles/dareme/dare/daremeDetailsStyle.scss";

const DaremeDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { daremeId } = useParams();
  const contexts = useContext(LanguageContext);
  const daremeState = useSelector((state: any) => state.dareme);
  const loadState = useSelector((state: any) => state.load);
  const userState = useSelector((state: any) => state.auth);
  const dareme = daremeState.dareme;
  const dlgState = loadState.dlgState
  const [canShow, setCanShow] = useState<any>(null);
  const [resultOptions, setResultOptions] = useState<Array<any>>([]);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isCopyLink, setIsCopyLink] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDareDisable, setIsDareDisable] = useState(false);
  const [isReward, setIsReward] = useState(false);
  const [openWelcomeDlg, setOpenWelcomeDlg] = useState(false)
  const [openWelcomeDlg2, setOpenWelcomeDlg2] = useState(false)
  const user = userState.user

  const calcTime = (time: any) => {
    if (dareme.finished) return contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.ENDED;
    if (time > 1) return Math.ceil(time) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.DAYS;
    if ((time * 24) > 1) return Math.ceil(time * 24) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.HOURS;
    if ((time * 24 * 60) > 1) return Math.ceil(time * 24 * 60) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.MINS;
    if (time > 0) return "1" + contexts.GERNAL_COMPONENT.MOBILE_VIDEO_CARD.MIN;
    else if (dareme.finished) return contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.ENDED;
  }

  const canShowResult = (dareme: any, user: any) => {
    if (user) {
      if (user.id === dareme.owner._id) return true
      for (var i = 0; i < dareme.options.length; i++) {
        if (dareme.options[i].option.writer._id === user.id) return true
        for (var j = 0; j < dareme.options[i].option.voteInfo.length; j++) {
          if (dareme.options[i].option.voteInfo[j].voter === user.id && dareme.options[i].option.voteInfo[j].donuts >= 50) return true
          if (dareme.options[i].option.voteInfo[j].voter === user.id && dareme.options[i].option.voteInfo[j].canFree === false) return true
        }
      }
      return false;
    } else return false;
  }

  const dareCreator = (user: any) => {
    // if (user) dispatch(daremeAction.checkDareCreatorAndResults(daremeId, navigate));
    // else setIsSignIn(true);
  }

  const supportCreator = (user: any, daremeId: any, optionId: any) => {
    if (user && user.id === dareme.owner._id) {
      setIsCopied(false);
      setIsCopyLink(true);
    }
    // else dispatch(daremeAction.checkSupportAndResults(daremeId, optionId, navigate));
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(daremeAction.getDareMeDetails(daremeId));
    dispatch({ type: SET_CURRENT_DAREME, payload: null });
  }, [location]);

  useEffect(() => {
    if (dareme.owner) {
      if (dareme.finished) navigate(`/dareme/result/${daremeId}`)
      setCanShow(canShowResult(dareme, user))
    }
  }, [dareme])

  useEffect(() => {
    if (dlgState.type === 'welcome') {
      if (dlgState.state) {
        setOpenWelcomeDlg(true);
      }
    } else if (dlgState.type === 'welcome2') {
      if (dlgState.state) {
        setOpenWelcomeDlg2(true)
      }
    }
  }, [dlgState])

  useEffect(() => {
    if (dareme.owner) {
      setResultOptions(dareme.options.sort((first: any, second: any) => {
        if (canShow) return first.option.donuts > second.option.donuts ? -1 : first.option.donuts < second.option.donuts ? 1 :
          first.option.date < second.option.date ? 1 : first.option.date > second.option.date ? -1 : 0;
        else return 0;
      }));
    }
  }, [canShow]);

  return (
    <>
      <div className="title-header">
        <Title
          title={contexts.HEADER_TITLE.DAREME_DETAILS}
          back={() => { navigate(loadState.prevRoute); }}
          voters={() => { navigate(`/dareme/${daremeId}/voters`) }}
          ownerId={dareme?.owner?._id}
        />
      </div>
      {(resultOptions.length > 0 && dareme.owner) &&
        <>
          <Dialog
            display={openWelcomeDlg}
            title="Welcome to Creato"
            exit={() => {
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
              setOpenWelcomeDlg(false);
            }}
            wrapExit={() => {
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
              setOpenWelcomeDlg(false);
            }}
            subcontext={true}
            icon={
              {
                pos: 1,
                icon: <RewardIcon color="#EFA058" width="60px" height="60px" />
              }
            }
            buttons={[
              {
                text: "Go",
                handleClick: () => {
                  setOpenWelcomeDlg(false);
                  dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
                  navigate('/')
                }
              }
            ]}
          />
          <WelcomeDlg
            display={openWelcomeDlg2}
            exit={() => {
              setOpenWelcomeDlg2(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
            }}
            wrapExit={() => {
              setOpenWelcomeDlg2(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
            }}
            buttons={[{
              text: contexts.WELCOME_DLG.OK,
              handleClick: () => {
                setOpenWelcomeDlg2(false)
                dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
                navigate('/')
              }
            }]}
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
            context={`${dareme?.rewardText}\n\n`}
          />
          <SignDialog
            display={isSignIn}
            exit={() => { setIsSignIn(false) }}
            wrapExit={() => { setIsSignIn(false) }}
          />
          <Dialog
            display={isCopyLink}
            title="Oops!"
            exit={() => { setIsCopyLink(false) }}
            wrapExit={() => { setIsCopyLink(false) }}
            context={contexts.DIALOG.BODY_LETTER.OWNER_VOTE}
            buttons={[
              {
                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}`);
                  setIsCopied(true);
                }
              }
            ]}
            social
            daremeId={daremeId}
            ownerName={dareme.owner.name}
          />
          <Dialog
            display={isDareDisable}
            title="Oops!"
            exit={() => { setIsDareDisable(false) }}
            wrapExit={() => { setIsDareDisable(false) }}
            context={contexts.DAREME_DETAILS.DARE_DISABLE}
            buttons={[
              {
                text: contexts.DAREME_DETAILS.VOTE_NOW,
                handleClick: () => { setIsDareDisable(false); }
              }
            ]}
          />
          <div className="dareme-details">
            <div className="desktop-header-info">
              <div className="time-info">
                <div className="left-time">
                  {calcTime(dareme.time)} {!dareme.finished && contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.LEFT}
                </div>
                <div className="vote-info">
                  <CreatoCoinIcon color="black" />
                  <span>{dareme.donuts}</span>
                </div>
              </div>
              <div className="title-category">
                <div className="dare-title">{dareme.title}</div>
                <div className="dare-category">
                  <CategoryBtn text={contexts.DAREME_CATEGORY_LIST[dareme.category - 1]} color="primary" />
                </div>
              </div>
            </div>
            <div className="main-body">
              <div className="dareme-details-videoCardDesktop">
                <VideoCardDesktop
                  url={CONSTANT.SERVER_URL + "/" + dareme.teaser}
                  sizeType={dareme.sizeType}
                  coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                />
                <AvatarLink
                  avatar={dareme.owner.avatar}
                  username={dareme.owner.name}
                  ownerId={dareme.owner._id}
                  handleAvatar={() => { navigate(`/${dareme.owner.personalisedUrl}`) }}
                  daremeId={dareme._id}
                />
              </div>
              <div className="dareme-details-information">
                <div className="dareme-details-videoCardMobile">
                  <VideoCardMobile
                    url={CONSTANT.SERVER_URL + "/" + dareme.teaser}
                    title={dareme.title}
                    time={dareme.time}
                    isFinished={dareme.finished}
                    donuts={dareme.donuts}
                    category={contexts.DAREME_CATEGORY_LIST[dareme.category - 1]}
                    sizeType={dareme.sizeType}
                    coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                  />
                  <AvatarLink
                    avatar={dareme.owner.avatar}
                    username={dareme.owner.name}
                    ownerId={dareme.owner._id}
                    handleAvatar={() => { navigate(`/${dareme.owner.personalisedUrl}`) }}
                    daremeId={dareme._id}
                  />
                </div>
                <div className="dare-btn" style={{ marginTop: '20px' }} onClick={() => { setIsReward(true) }}>
                  <ContainerBtn
                    disabled={false}
                    styleType="outline"
                    text={'See SuperFan Reward'}
                    icon={[<RewardIcon color="#EFA058" />, <RewardIcon color="white" />]}
                  />
                </div>
                <div className="select-dare-option">
                  <span></span>Select dare option<span></span>
                </div>
                <div className="dare-btn">
                  {(user && user.id === dareme.owner._id) ?
                    <div onClick={() => { dispatch(daremeAction.checkDareMeRequests(dareme._id, navigate)); }}>
                      <ContainerBtn
                        styleType="fill"
                        text={contexts.DAREME_DETAILS.SEE_REQUESTS}
                        icon={[<NotificationwithCircleIcon color="white" circleColor="white" />, <NotificationwithCircleIcon color="white" circleColor="white" />]}
                      />
                    </div>
                    :
                    <div onClick={() => { dareCreator(user); }}>
                      <ContainerBtn
                        // disabled={dareme.time < 1 ? true : false}
                        styleType="fill"
                        text={contexts.DAREME_DETAILS.HAVE_IDEA}
                      />
                    </div>
                  }
                </div>
                <div className="or-style">or</div>
                <div className="dare-options scroll-bar">
                  {
                    resultOptions.filter((option: any) => option.option.status === 1).map((option: any, index: any) => (
                      <div className="dare-option" key={index}>
                        <DareOption
                          dareTitle={option.option.title}
                          donuts={option.option.donuts}
                          voters={canShow ? option.option.voters : undefined}
                          canVote={true}
                          disabled={false}
                          username={option.option.writer.name}
                          leading={index !== 0 ? false : canShow}
                          handleSubmit={() => { supportCreator(user, dareme._id, option.option._id); }}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
};

export default DaremeDetails;
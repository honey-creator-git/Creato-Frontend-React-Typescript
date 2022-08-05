import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fanwallAction } from "../../redux/actions/fanwallActions";
import { daremeAction } from "../../redux/actions/daremeActions";
import { fundmeAction } from "../../redux/actions/fundmeActions";
import VideoCardMobile from "../../components/dareme/videoCardMobile";
import ProfileHeader from "../../components/profile/profileHeader";
import ProfileMenu from "../../components/profileMenu";
import ContainerBtn from "../../components/general/containerBtn";
import Dialog from "../../components/general/dialog";
import AvatarLink from "../../components/dareme/avatarLink";
import TipCard from "../../components/profile/tipCard";
import TipMessageDlg from "../../components/profile/tipMessageDlg";
import { Dare2Icon, HotIcon, RewardIcon, AddIcon, TipIcon, ExpandIcon, RetrieveIcon } from "../../assets/svg";
import CONSTANT from "../../constants/constant";
import { SET_FANWALL_INITIAL, SET_PREVIOUS_ROUTE } from "../../redux/types";
import { LanguageContext } from "../../routes/authRoute";
import visitorImg from "../../assets/img/visitor_avatar.png";
import "../../assets/styles/profile/profileStyle.scss";

const Profile = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const contexts = useContext(LanguageContext);
  const daremeStore = useSelector((state: any) => state.dareme);
  const fanwallState = useSelector((state: any) => state.fanwall);
  const userStore = useSelector((state: any) => state.auth);
  const daremes = daremeStore.daremes;
  const tips = fanwallState.tips;
  const fanwalls = fanwallState.fanwalls;
  const authuser = userStore.users.length ? userStore.users[0] : null;
  const [isSame, setIsSame] = useState(false);
  const [viewType, setViewType] = useState(0);
  const [openDelPostDlg, setOpenDelPostDlg] = useState(false);
  const [fanwallId, setFanwallId] = useState("");
  const user = userStore.user;
  const [expandState, setExpandState] = useState(false);
  const [tipIndex, setTipIndex] = useState(2);
  const [hoverState, setHoverState] = useState(false);
  const [selectedTipData, setSelectedTipData] = useState<any>(null);
  const [openTipMessageDlg, setOpenTipMessageDlg] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [timerId, setTimerId] = useState<any>(0);

  const handleCreateDareMe = () => {
    dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname });
    navigate("/create");
  };

  const openDlg = (index: any) => {
    if (user) {
      setSelectedTipData({
        username: tips[index].tipper ? tips[index].tipper.name : tips[index].nickname,
        tip: tips[index].tip,
        message: tips[index].message,
        avatars: [
          authuser.avatar.indexOf('uploads') === -1 ? authuser.avatar : `${CONSTANT.SERVER_URL}/${authuser.avatar}`,
          tips[index].tipper ? tips[index].tipper.avatar.indexOf('uploads') === -1 ? tips[index].tipper.avatar : `${CONSTANT.SERVER_URL}/${tips[index].tipper.avatar}` : visitorImg
        ],
        ownername: authuser?.name,
        ownerURL: `${CONSTANT.SERVER_URL}/${authuser?.personalisedUrl}`
      });
      setOpenTipMessageDlg(true);
    }
    else setOpenSignin(true);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    setViewType(0);
  }, [location]);

  useEffect(() => {
    if (expandState) {
      if (tipIndex === 2 && tips.length > 2) {
        const tId = setInterval(() => {
          setTipIndex((tipIndex) => tipIndex + 1);
        }, 80);
        setTimerId(tId);
      }
    } else {
      if (tipIndex > 2 && tips.length > 2) {
        const tId = setInterval(() => {
          setTipIndex((tipIndex) => tipIndex - 1);
        }, 80);
        setTimerId(tId);
      }
    }
  }, [expandState]);

  useEffect(() => {
    if (tips.length > 2 && tipIndex === tips.length && timerId) clearInterval(timerId);
    if (tips.length > 2 && tipIndex === 2 && timerId) {
      window.scrollTo(0, 0);
      clearInterval(timerId);
    }
  }, [tipIndex]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const personalisedUrl = pathname.substring(1);
    if (viewType === 0) dispatch(daremeAction.getDaremesByPersonalisedUrl(personalisedUrl, navigate));
    else {
      setTipIndex(2);
      setExpandState(false);
      setTimerId(0);
      dispatch(fanwallAction.getFanwallsByPersonalUrl(personalisedUrl));
    }
  }, [viewType]);

  useEffect(() => {
    if (authuser) {
      if (user) {
        if (user.id === authuser._id) setIsSame(true);
        else setIsSame(false);
      } else setIsSame(false);
    }
  }, [authuser, user]);

  return (
    <div className="profile-wrapper">
      {authuser !== null &&
        <>
          <TipMessageDlg
            display={openTipMessageDlg}
            wrapExit={() => { setOpenTipMessageDlg(false) }}
            exit={() => { setOpenTipMessageDlg(false) }}
            tipData={selectedTipData}
          />
          <Dialog
            display={openSignin}
            exit={() => { setOpenSignin(false) }}
            wrapExit={() => { setOpenSignin(false) }}
            title={contexts.DIALOG.HEADER_TITLE.SIGN_IN_NOW}
            context={contexts.DIALOG.BODY_LETTER.SIGN_IN_NOW}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.SIGN_IN,
                handleClick: () => {
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/${authuser.personalisedUrl}` });
                  navigate('/auth/signin');
                }
              }
            ]}
          />
          <Dialog
            display={openDelPostDlg}
            exit={() => { setOpenDelPostDlg(false) }}
            wrapExit={() => { setOpenDelPostDlg(false) }}
            title="Confirm"
            context={"Deleting the post"}
            buttons={[
              {
                text: "Cancel",
                handleClick: () => { setOpenDelPostDlg(false); }
              },
              {
                text: "Delete",
                handleClick: () => {
                  setOpenDelPostDlg(false);
                  dispatch(fanwallAction.deleteFanwall(fanwallId, navigate, `/${user.personalisedUrl}`));
                }
              }
            ]}
          />
          <div className="profile">
            <div className="profile-header">
              <ProfileHeader
                size="mobile"
                property={isSame ? 'edit' : 'view'}
                handleCreateDareMe={handleCreateDareMe}
              />
            </div>
            <div className="profile-menu">
              <ProfileMenu menu={viewType === 0 ? "dareme" : "fanwall"} setViewType={setViewType} />
            </div>
            {viewType === 0 ? (
              <div className="dare-cards">
                <div className="my-dareMe">
                  <div className="title">
                    <Dare2Icon color="#EFA058" />
                    {authuser &&
                      <p>
                        {(user && user.personalisedUrl === authuser.personalisedUrl) ? contexts.PROFILE_LETTER.MY_DAREME : `${authuser.name} ${contexts.PROFILE_LETTER.OTHER_DAREME}`}
                      </p>
                    }
                  </div>
                  {daremes.length > 0 && daremes.filter((dareme: any) => dareme.isUser === true).length > 0 ?
                    <div className="dare-card">
                      {
                        daremes.filter((dareme: any) => dareme.isUser === true)
                          .map((dareme: any, index: any) => (
                            <div className="profile-dareme" key={index}>
                              <VideoCardMobile
                                donuts={dareme.donuts}
                                goal={dareme.goal ? dareme.goal : null}
                                reward={dareme.reward ? dareme.reward : null}
                                url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
                                time={dareme.time}
                                title={dareme.title}
                                category={dareme.goal ? contexts.FUNDME_CATEGORY_LIST[dareme.category - 1] : contexts.DAREME_CATEGORY_LIST[dareme.category - 1]}
                                finished={dareme.finished}
                                sizeType={dareme.sizeType}
                                coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                                handleSubmit={() => {
                                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: user ? `/${user.personalisedUrl}` : `/${authuser.personalisedUrl}` });
                                  if (dareme.goal) dispatch(fundmeAction.checkDetailsAndResults(dareme._id, navigate));
                                  else dispatch(daremeAction.checkDetailsAndResults(dareme._id, navigate));
                                }}
                              />
                              <AvatarLink
                                username={dareme.owner.name}
                                avatar={dareme.owner.avatar}
                                handleAvatar={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(dareme.owner.personalisedUrl, navigate)); }}
                                ownerId={dareme.owner._id}
                                daremeId={dareme._id}
                              />
                            </div>
                          ))
                      }
                    </div> :
                    <div className="no-data">
                      {(authuser && user && user.personalisedUrl === authuser.personalisedUrl) ?
                        <div style={{ width: '330px', margin: '0px auto' }} onClick={() => { navigate("/create") }}>
                          <ContainerBtn text="Create" styleType="fill" icon={[<AddIcon color="white" />, <AddIcon color="white" />]} />
                        </div> :
                        <span>No DareMe/FundMe Yet...</span>
                      }
                    </div>
                  }
                </div>
                <div className="i-dared">
                  <div className="title">
                    <HotIcon color="#EFA058" />
                    {authuser &&
                      <p>
                        {(authuser && user && user.personalisedUrl === authuser.personalisedUrl) ? contexts.PROFILE_LETTER.I_DARED : `${authuser.name} ${contexts.PROFILE_LETTER.OTHER_DARED}`}
                      </p>
                    }
                  </div>
                  {daremes.length > 0 && daremes.filter((dareme: any) => dareme.isUser === false).length > 0 ?
                    <div className="dare-card">
                      {
                        daremes.filter((dareme: any) => dareme.isUser === false)
                          .map((dareme: any, index: any) => (
                            <div className="profile-dareme" key={index}>
                              <VideoCardMobile
                                donuts={dareme.donuts}
                                goal={dareme.goal ? dareme.goal : null}
                                reward={dareme.reward ? dareme.reward : null}
                                url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
                                time={dareme.time}
                                title={dareme.title}
                                category={dareme.goal ? contexts.FUNDME_CATEGORY_LIST[dareme.category - 1] : contexts.DAREME_CATEGORY_LIST[dareme.category - 1]}
                                finished={dareme.finished}
                                sizeType={dareme.sizeType}
                                coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                                handleSubmit={() => {
                                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: user ? `/${user.personalisedUrl}` : `/${authuser.personalisedUrl}` });
                                  if (dareme.goal) dispatch(fundmeAction.checkDetailsAndResults(dareme._id, navigate));
                                  else dispatch(daremeAction.checkDetailsAndResults(dareme._id, navigate));
                                }}
                              />
                              <AvatarLink
                                username={dareme.owner.name}
                                avatar={dareme.owner.avatar}
                                handleAvatar={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(dareme.owner.personalisedUrl, navigate)); }}
                                ownerId={dareme.owner._id}
                                daremeId={dareme._id}
                              />
                            </div>
                          ))
                      }
                    </div> :
                    <div className="no-data">
                      {(authuser && user && user.personalisedUrl === authuser.personalisedUrl) ?
                        <div style={{ width: '330px', margin: '0px auto' }} onClick={() => { navigate('/') }}>
                          <ContainerBtn text="Create with Creator" styleType="fill" icon={[<Dare2Icon color="white" />, <Dare2Icon color="white" />]} />
                        </div> :
                        <span>No Activities Yet...</span>
                      }
                    </div>
                  }
                </div>
              </div>
            ) : (
              <div className="fanWall">
                <div className="dare-cards">
                  {tips.length > 0 &&
                    <div className="tips">
                      <div className="title">
                        <TipIcon color="#EFA058" />
                        <p>{contexts.DONUTS_RECEIVED}</p>
                      </div>
                      <div className="tip-card">
                        {tips.map((tip: any, index: any) => {
                          if (index < tipIndex) {
                            return <div className="card-detail" key={index}>
                              <TipCard
                                avatar={tip.tipper ? tip.tipper.avatar.indexOf('uploads') === -1 ? tip.tipper.avatar : `${CONSTANT.SERVER_URL}/${tip.tipper.avatar}` : visitorImg}
                                username={tip.tipper ? tip.tipper.name : tip.nickname}
                                tip={tip.tip}
                                message={tip.message}
                                handleClick={() => { openDlg(index) }}
                              />
                            </div>
                          }
                        }
                        )}
                      </div>
                      {tips.length > 2 &&
                        <div className="arrow"
                          onClick={() => { setExpandState(!expandState) }}
                          onMouseOver={() => { setHoverState(true) }}
                          onMouseLeave={() => { setHoverState(false) }}
                        >
                          {expandState ?
                            <RetrieveIcon color="#000000" width={hoverState ? 30 : 24} height={hoverState ? 30 : 24} />
                            :
                            <ExpandIcon color="#000000" width={hoverState ? 30 : 24} height={hoverState ? 30 : 24} />}
                        </div>
                      }
                    </div>
                  }
                  <div className="my-dareMe">
                    <div className="title">
                      <RewardIcon color="#EFA058" />
                      {authuser &&
                        <p>
                          {(user && user.personalisedUrl === authuser.personalisedUrl) ? contexts.PROFILE_LETTER.MY_POSTS : `${authuser.name} ${contexts.PROFILE_LETTER.OTHER_POSTS}`}
                        </p>
                      }
                    </div>
                    {fanwalls.length > 0 ?
                      <div className="dare-card">
                        {fanwalls.filter((option: any) => option.userFanwall === true).map((fanwall: any, index: any) => (
                          <div className="profile-dareme" key={index}>
                            <VideoCardMobile
                              donuts={fanwall.dareme.donuts}
                              url={`${CONSTANT.SERVER_URL}/${fanwall.video}`}
                              sizeType={fanwall.sizeType}
                              coverImage={fanwall.cover ? `${CONSTANT.SERVER_URL}/${fanwall.cover}` : ""}
                              title={fanwall.dareme.title}
                              goal={fanwall.dareme.goal ? fanwall.dareme.goal : null}
                              category={fanwall.dareme.goal ? contexts.FUNDME_CATEGORY_LIST[fanwall.dareme.category - 1] : contexts.DAREME_CATEGORY_LIST[fanwall.dareme.category - 1]}
                              posted={true}
                              finished={true}
                              fanwallData={fanwall}
                              handleSubmit={() => {
                                dispatch({ type: SET_PREVIOUS_ROUTE, payload: user ? `/${user.personalisedUrl}` : `/${authuser.personalisedUrl}` });
                                dispatch({ type: SET_FANWALL_INITIAL });
                                if (fanwall.dareme.goal) navigate(`/fundme/fanwall/detail/${fanwall.id}`)
                                else navigate(`/dareme/fanwall/detail/${fanwall.id}`)
                              }}
                            />
                            <AvatarLink
                              username={fanwall.writer.name}
                              avatar={fanwall.writer.avatar}
                              handleAvatar={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(fanwall.writer.personalisedUrl, navigate)); }}
                              ownerId={fanwall.writer._id}
                              delData={() => {
                                setFanwallId(fanwall.id);
                                setOpenDelPostDlg(true);
                              }}
                              isFanwall={true}
                              daremeId={fanwall.id}
                            />
                          </div>
                        ))
                        }
                      </div> :
                      <div className="no-data">No Posts Yet...</div>
                    }
                  </div>
                  <div className="i-dared">
                    <div className="title">
                      <RewardIcon color="#EFA058" />
                      {authuser &&
                        <p>
                          {(user && user.personalisedUrl === authuser.personalisedUrl) ? contexts.PROFILE_LETTER.MY_EXCLUSIVE_REWARDS : `${authuser.name} ${contexts.PROFILE_LETTER.OTHER_EXCLUSIVE_REWARDS}`}
                        </p>
                      }
                    </div>
                    {fanwalls.length > 0 ?
                      <div className="dare-card">
                        {fanwalls.filter((option: any) => option.userFanwall === false).map((fanwall: any, index: any) => (
                          <div className="profile-dareme" key={index}>
                            <VideoCardMobile
                              donuts={fanwall.dareme.donuts}
                              url={`${CONSTANT.SERVER_URL}/${fanwall.video}`}
                              sizeType={fanwall.sizeType}
                              coverImage={fanwall.cover ? `${CONSTANT.SERVER_URL}/${fanwall.cover}` : ""}
                              title={fanwall.dareme.title}
                              goal={fanwall.dareme.goal ? fanwall.dareme.goal : null}
                              category={fanwall.dareme.goal ? contexts.FUNDME_CATEGORY_LIST[fanwall.dareme.category - 1] : contexts.DAREME_CATEGORY_LIST[fanwall.dareme.category - 1]}
                              posted={true}
                              finished={true}
                              fanwallData={fanwall}
                              handleSubmit={() => {
                                dispatch({ type: SET_PREVIOUS_ROUTE, payload: user ? `/${user.personalisedUrl}` : `/${authuser.personalisedUrl}` });
                                dispatch({ type: SET_FANWALL_INITIAL });
                                if (fanwall.dareme.goal) navigate(`/fundme/fanwall/detail/${fanwall.id}`)
                                else navigate(`/dareme/fanwall/detail/${fanwall.id}`)
                              }}
                            />
                            <AvatarLink
                              username={fanwall.writer.name}
                              avatar={fanwall.writer.avatar}
                              handleAvatar={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(fanwall.writer.personalisedUrl, navigate)); }}
                              ownerId={fanwall.writer._id}
                              url={`/${fanwall.writer.personalisedUrl}`}
                              isFanwall={true}
                              daremeId={fanwall.id}
                            />
                          </div>
                        ))
                        }
                      </div> :
                      <div className="no-data">No Rewards Yet...</div>
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </>}
    </div>
  );
};

export default Profile;
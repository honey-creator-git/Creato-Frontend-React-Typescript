import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fanwallAction } from "../../redux/actions/fanwallActions";
import VideoCardMobile from "../../components/dareme/videoCardMobile";
import ProfileHeader from "../../components/profile/profileHeader";
import ProfileMenu from "../../components/profileMenu";
import Dialog from "../../components/general/dialog";
import AvatarLink from "../../components/dareme/avatarLink";
import TipCard from "../../components/profile/tipCard";
import TipMessageDlg from "../../components/profile/tipMessageDlg";
import { RewardIcon, TipIcon, ExpandIcon, RetrieveIcon } from "../../assets/svg";
import CONSTANT from "../../constants/constant";
import { SET_FANWALL_INITIAL, SET_PREVIOUS_ROUTE, SET_TIPID } from "../../redux/types";
import { LanguageContext } from "../../routes/authRoute";
import visitorImg from "../../assets/img/visitor_avatar.png";
import "../../assets/styles/profile/profileStyle.scss";

const ProfileFanwall = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const contexts = useContext(LanguageContext);
  const fanwallState = useSelector((state: any) => state.fanwall);
  const userStore = useSelector((state: any) => state.auth);
  const tips = fanwallState.tips;
  const tipId = fanwallState.tipId
  const fanwalls = fanwallState.fanwalls;
  const authuser = userStore.users.length ? userStore.users[0] : null;
  const [isSame, setIsSame] = useState(false);
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
    window.scrollTo(0, 0)
    let personalisedUrl = pathname.substring(1)
    personalisedUrl = personalisedUrl.replace('/fanwall', '')
    setTipIndex(2);
    setExpandState(false);
    setTimerId(0);
    dispatch(fanwallAction.getFanwallsByPersonalUrl(personalisedUrl))
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
    if (authuser) {
      if (user) {
        if (user.id === authuser._id) setIsSame(true);
        else setIsSame(false);
      } else setIsSame(false);
    }
  }, [authuser, user]);

  useEffect(() => {
    if (tipId && tips.length > 0) {
      const tip = tips.filter((t: any) => t._id === tipId)
      setSelectedTipData({
        username: tip[0].tipper ? tip[0].tipper.name : tip[0].nickname,
        tip: tip[0].tip,
        message: tip[0].message,
        avatars: [
          authuser.avatar.indexOf('uploads') === -1 ? authuser.avatar : `${CONSTANT.SERVER_URL}/${authuser.avatar}`,
          tip[0].tipper ? tip[0].tipper.avatar.indexOf('uploads') === -1 ? tip[0].tipper.avatar : `${CONSTANT.SERVER_URL}/${tip[0].tipper.avatar}` : visitorImg
        ],
        ownername: authuser?.name,
        ownerURL: `${CONSTANT.SERVER_URL}/${authuser?.personalisedUrl}`
      })
      setOpenTipMessageDlg(true);
    }
  }, [tipId, tips])

  return (
    <div className="profile-wrapper">
      {authuser !== null &&
        <>
          <TipMessageDlg
            display={openTipMessageDlg}
            wrapExit={() => {
              setOpenTipMessageDlg(false)
              dispatch({ type: SET_TIPID, payload: null })
            }}
            exit={() => {
              setOpenTipMessageDlg(false)
              dispatch({ type: SET_TIPID, payload: null })
            }}
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
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/${authuser.personalisedUrl}/fanwall` });
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
                  dispatch(fanwallAction.deleteFanwall(fanwallId, navigate, `/${user.personalisedUrl}/fanwall`));
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
              <ProfileMenu menu={"fanwall"} url={authuser.personalisedUrl} />
            </div>
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
                              dispatch({ type: SET_PREVIOUS_ROUTE, payload: user ? `/${user.personalisedUrl}/fanwall` : `/${authuser.personalisedUrl}/fanwall` });
                              dispatch({ type: SET_FANWALL_INITIAL });
                              if (fanwall.dareme.goal) navigate(`/fundme/fanwall/detail/${fanwall.id}`)
                              else navigate(`/dareme/fanwall/detail/${fanwall.id}`)
                            }}
                          />
                          <AvatarLink
                            username={fanwall.writer.name}
                            avatar={fanwall.writer.avatar}
                            handleAvatar={() => { navigate(`/${fanwall.writer.personalisedUrl}`) }}
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
                              dispatch({ type: SET_PREVIOUS_ROUTE, payload: user ? `/${user.personalisedUrl}/fanwall` : `/${authuser.personalisedUrl}/fanwall` });
                              dispatch({ type: SET_FANWALL_INITIAL });
                              if (fanwall.dareme.goal) navigate(`/fundme/fanwall/detail/${fanwall.id}`)
                              else navigate(`/dareme/fanwall/detail/${fanwall.id}`)
                            }}
                          />
                          <AvatarLink
                            username={fanwall.writer.name}
                            avatar={fanwall.writer.avatar}
                            handleAvatar={() => { navigate(`/${fanwall.writer.personalisedUrl}`) }}
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
          </div>
        </>}
    </div>
  );
};

export default ProfileFanwall;
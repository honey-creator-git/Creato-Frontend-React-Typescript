import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { daremeAction } from "../../redux/actions/daremeActions";
import { fundmeAction } from "../../redux/actions/fundmeActions";
import VideoCardMobile from "../../components/dareme/videoCardMobile";
import ProfileHeader from "../../components/profile/profileHeader";
import ProfileMenu from "../../components/profileMenu";
import ContainerBtn from "../../components/general/containerBtn";
import Dialog from "../../components/general/dialog";
import WelcomeDlg from "../../components/general/welcomeDlg";
import AvatarLink from "../../components/dareme/avatarLink";
import { Dare2Icon, HotIcon, AddIcon, RewardIcon } from "../../assets/svg";
import CONSTANT from "../../constants/constant";
import { SET_PREVIOUS_ROUTE, SET_DIALOG_STATE } from "../../redux/types";
import { LanguageContext } from "../../routes/authRoute";
import "../../assets/styles/profile/profileStyle.scss";

const Profile = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const contexts = useContext(LanguageContext);
  const daremeStore = useSelector((state: any) => state.dareme);
  const userStore = useSelector((state: any) => state.auth);
  const dlgState = useSelector((state: any) => state.load.dlgState)
  const daremes = daremeStore.daremes;
  const authuser = userStore.users.length ? userStore.users[0] : null;
  const [openWelcomeDlg, setOpenWelcomeDlg] = useState(false)
  const [openWelcomeDlg2, setOpenWelcomeDlg2] = useState(false)
  const [isSame, setIsSame] = useState(false);
  const user = userStore.user;
  const [openSignin, setOpenSignin] = useState(false);

  const handleCreateDareMe = () => {
    dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname });
    navigate("/create");
  };

  useEffect(() => {
    window.scrollTo(0, 0)
    const personalisedUrl = pathname.substring(1);
    dispatch(daremeAction.getDaremesByPersonalisedUrl(personalisedUrl))
  }, [location, dispatch, pathname]);

  useEffect(() => {
    if (authuser) {
      if (user) {
        if (user.id === authuser._id) setIsSame(true);
        else setIsSame(false);
      } else setIsSame(false);
    }
  }, [authuser, user]);

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

  return (
    <div className="profile-wrapper">
      {authuser !== null &&
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
          <div className="profile">
            <div className="profile-header">
              <ProfileHeader
                size="mobile"
                property={isSame ? 'edit' : 'view'}
                handleCreateDareMe={handleCreateDareMe}
              />
            </div>
            <div className="profile-menu">
              <ProfileMenu menu={"dareme"} url={authuser.personalisedUrl} />
            </div>
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
                              handleAvatar={() => { navigate(`/${dareme.owner.personalisedUrl}`) }}
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
                              handleAvatar={() => { navigate(`/${dareme.owner.personalisedUrl}`) }}
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
          </div>
        </>}
    </div>
  );
};

export default Profile;
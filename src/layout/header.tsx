import { useEffect, useState, useLayoutEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import decode from "jwt-decode";
import ContainerBtn from "../components/general/containerBtn";
import Button from "../components/general/button";
import SideMenu from "../components/sideMenu";
import Avatar from "../components/general/avatar";
import Dialog from "../components/general/dialog";
import { authAction } from "../redux/actions/authActions";
import { CreatoColorIcon, CreatoCoinIcon, AddIcon, LanguageIcon } from "../assets/svg";
import { LanguageContext } from "../routes/authRoute";
import CONSTANT from "../constants/constant";
import { SET_DAREMES, SET_DIALOG_STATE, SET_PREVIOUS_ROUTE, SET_USERS } from "../redux/types";
import "../assets/styles/headerStyle.scss";


const useWindowSize = () => {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    function updateSize() { setSize(window.innerWidth); }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const Header = () => {
  const width = useWindowSize();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userState = useSelector((state: any) => state.auth);
  const daremeState = useSelector((state: any) => state.dareme);
  const dareme = daremeState.dareme;
  const contexts = useContext(LanguageContext);
  const [openSideMenu, setOpenSideMenu] = useState<boolean>(false);
  const [openLangSelect, setOpenLangSelect] = useState(false);
  const sideMenuRightPosition = openSideMenu === true ? "0px" : "-300px";
  const user = userState.user;
  const lang = userState.lang;

  const handleSubmit = () => { navigate("/auth/signin") }
  const handleLogout = () => {
    setOpenSideMenu(false);
    dispatch({ type: SET_DAREMES, payload: [] });
    dispatch({ type: SET_PREVIOUS_ROUTE, payload: "/" });
    dispatch(authAction.logout(navigate));
  };

  const showSideMenu = () => { setOpenSideMenu(!openSideMenu) }
  const isDaremeData = () => {
    if ((dareme.teaser === null && daremeState.teaserFile === null) && dareme.deadline === null && dareme.category === null && dareme.title === null
      && (dareme.options.length === 0 || (dareme.options.length > 0 && dareme.options[0].option.title === null && dareme.options[1].option.title === null)))
      return false;
    return true;
  }

  const gotoHome = () => {
    if (location.pathname === '/dareme/create' && isDaremeData()) dispatch({ type: SET_DIALOG_STATE, payload: { type: "createDareMe", state: true } });
    else {
      dispatch({ type: SET_USERS, payload: [] });
      dispatch({ type: SET_DAREMES, payload: [] });
      navigate("/");
    }
  }

  const gotoAdminHome = () => {
    if (location.pathname === '/dareme/create' && isDaremeData()) dispatch({ type: SET_DIALOG_STATE, payload: { type: "createDareMe", state: true } });
    else {
      dispatch({ type: SET_DAREMES, payload: [] });
      navigate('/admin');
    }
  }

  const gotoCreate = () => {
    if (location.pathname === '/dareme/create' && isDaremeData()) dispatch({ type: SET_DIALOG_STATE, payload: { type: "createDareMe", state: true } });
    else {
      dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname });
      navigate("/create");
    }
  }

  const setLang = () => {
    setOpenLangSelect(true);
  }

  useEffect(() => {
    const token = localStorage.getItem("dareme_token");
    if (token) {
      dispatch(authAction.getAuthData());
      const decodedToken: any = decode(JSON.parse(token));
      if (decodedToken.exp * 1000 < new Date().getTime()) handleLogout();
    }
  }, [location]);

  return (
    <div className="header-padding" style={user ? user.role === "ADMIN" ? width > 1010 ? {} : { padding: '87px' } : width > 1010 ? {} : { padding: '60px' } : {}}>
      <div className="header-wrapper">
        <Dialog
          display={openLangSelect}
          wrapExit={() => { setOpenLangSelect(false) }}
          exit={() => { setOpenLangSelect(false) }}
          title="語言/Language"
          langauge={lang}
          buttons={[
            {
              text: contexts.EDIT_PROFILE_LETTER.SAVE,
              handleClick: () => { }
            }
          ]}
        />
        <div className="header">
          <div className="user-header">
            <div className="dare-creator" onClick={gotoHome}>
              <div className="header-logo"><CreatoColorIcon /></div>
              <h2>Dare a Creator</h2>
            </div>
            {user ? (
              <div className="user-info">
                {user &&
                  <>
                    {user.role === "ADMIN" &&
                      <div className="desktop-admin-btn" onClick={gotoAdminHome}>
                        <ContainerBtn styleType="fill" text={"Admin"} />
                      </div>
                    }
                    <div className="desktop-create-btn" onClick={gotoCreate}>
                      <ContainerBtn
                        icon={[<AddIcon color="white" />, <AddIcon color="white" />]}
                        styleType="fill"
                        text={contexts.GENERAL_LETTER.CREATE}
                      />
                    </div>
                  </>
                }
                <CreatoCoinIcon color="black" />
                <p>{user.wallet.toLocaleString()}</p>
                <div className="avatar" onClick={showSideMenu}>
                  {user.new_notification && <div className="red-dot"></div>}
                  <Avatar
                    size="small"
                    style="horizontal"
                    username=""
                    avatar={user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}`}
                  />
                </div>
                <div
                  className="sideMeun"
                  style={{
                    right: sideMenuRightPosition,
                    top: user.role === "ADMIN" ? width > 1010 ? '70px' : '175px' : width > 1010 ? '70px' : '119px'
                  }}
                >
                  <SideMenu
                    setOpen={setOpenSideMenu}
                    handleLogout={handleLogout}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="sign-lang-btn">
                  <div className="lang-btn">
                    <Button
                      text={lang === 'EN' ?
                        width > 880 ? ' 繁體中文' : '中文' :
                        width > 880 ? 'English' : 'Eng'
                      }
                      fillStyle="fill"
                      color="primary"
                      shape="rounded"
                      icon={width > 880 ? [
                        <LanguageIcon color="white" />,
                        <LanguageIcon color="white" />,
                        <LanguageIcon color="white" />
                      ]
                        : undefined}
                      handleSubmit={setLang}
                    />
                  </div>
                  <div>
                    <Button
                      text={contexts.DIALOG.BUTTON_LETTER.SIGN_IN}
                      fillStyle="fill"
                      color="primary"
                      shape="rounded"
                      handleSubmit={handleSubmit}
                    />
                  </div>
                </div>
              </>
            )}
            {user &&
              <div
                className="transparent-bg"
                style={{
                  visibility: `${openSideMenu === true ? "visible" : "hidden"}`,
                  opacity: `${openSideMenu === true ? "0.2" : "0.0"}`,
                  top: user.role === "ADMIN" ? width > 1010 ? '70px' : '175px' : width > 1010 ? '70px' : '119px'
                }}
                onClick={() => setOpenSideMenu(false)}
              ></div>
            }
          </div>
          {user &&
            <>
              {user.role === "ADMIN" &&
                <div className="mobile-admin-btn" onClick={gotoAdminHome}>
                  <ContainerBtn styleType="fill" text={"Admin"} />
                </div>
              }
              <div className="mobile-create-btn" onClick={gotoCreate}>
                <ContainerBtn
                  icon={[<AddIcon color="white" />, <AddIcon color="white" />]}
                  styleType="fill"
                  text={contexts.GENERAL_LETTER.CREATE}
                />
              </div>
            </>
          }
        </div>
      </div>
    </div >
  );
};

export default Header;

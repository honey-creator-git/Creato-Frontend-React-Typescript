import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { daremeAction } from "../redux/actions/daremeActions";
import { SET_DAREMES, SET_DIALOG_STATE, SET_PREVIOUS_ROUTE } from "../redux/types";
import {
  BalanceIcon,
  CreatoCoinIcon,
  NotificationfillIcon,
  NotificationwithCircleIcon,
  ProfileIcon,
  SettingIcon,
  LanguageIcon,
  ListViewIcon
} from "../assets/svg";
import { LanguageContext } from "../routes/authRoute";
import { LogoutIcon } from "../constants/awesomeIcons";
import "../assets/styles/sideMenuStyle.scss";

const SideMenu = (props: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const contexts = useContext(LanguageContext);
  const daremeState = useSelector((state: any) => state.dareme);
  const userState = useSelector((state: any) => state.auth);
  const user = userState.user;
  const dareme = daremeState.dareme;

  const isDaremeData = () => {
    if ((dareme.teaser === null && daremeState.teaserFile === null)
      && dareme.deadline === null
      && dareme.category === null
      && dareme.title === null
      && (dareme.options.length === 0 || (dareme.options.length > 0 && dareme.options[0].option.title === null && dareme.options[1].option.title === null)))
      return false;
    return true;
  }

  const handleAdminPanel = () => {
    if (location.pathname === '/dareme/create' && isDaremeData()) dispatch({ type: SET_DIALOG_STATE, payload: { type: 'createDareMe', state: true } });
    else {
      dispatch({ type: SET_DAREMES, payload: [] });
      navigate("/admin");
    }
    props.setOpen(false);
  }

  const handleProfile = () => {
    if (location.pathname === '/dareme/create' && isDaremeData()) dispatch({ type: SET_DIALOG_STATE, payload: { type: 'createDareMe', state: true } });
    else navigate(`/${user.personalisedUrl}`)
    props.setOpen(false);
  };
  const handleWallet = () => {
    if (location.pathname === '/dareme/create' && isDaremeData()) dispatch({ type: SET_DIALOG_STATE, payload: { type: 'createDareMe', state: true } });
    else navigate(`/myaccount/wallet`);
    props.setOpen(false);
  };
  const handleCreators = () => {
    if (location.pathname === '/dareme/create' && isDaremeData()) dispatch({ type: SET_DIALOG_STATE, payload: { type: 'createDareMe', state: true } });
    else navigate(`/creators`);
    props.setOpen(false);
  }
  const handleShop = () => {
    if (location.pathname === '/dareme/create' && isDaremeData()) dispatch({ type: SET_DIALOG_STATE, payload: { type: 'createDareMe', state: true } });
    else navigate(`/myaccount/shop`);
    props.setOpen(false);
  };
  const handleNotifications = () => {
    if (location.pathname === '/dareme/create' && isDaremeData()) dispatch({ type: SET_DIALOG_STATE, payload: { type: 'createDareMe', state: true } });
    else navigate(`/notifications`);
    props.setOpen(false);
  };
  const handleSetting = () => {
    if (location.pathname === '/dareme/create' && isDaremeData()) dispatch({ type: SET_DIALOG_STATE, payload: { type: 'createDareMe', state: true } });
    else navigate(`/myaccount/setting`);
    props.setOpen(false);
  };
  const handleLanguage = () => {
    if (location.pathname === '/dareme/create' && isDaremeData()) dispatch({ type: SET_DIALOG_STATE, payload: { type: 'createDareMe', state: true } });
    else {
      dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname });
      navigate(`/myaccount/setting/language`);
    }
    props.setOpen(false);
  };

  return (
    <div className="side-menu-wrapper">
      <div className="side-menu">
        {(user && user.role === "ADMIN") &&
          <div className="list" onClick={handleAdminPanel}>
            <div className="icon">
              <ProfileIcon color="black" />
            </div>
            <p>Admin Panel</p>
          </div>
        }
        <div className="list" onClick={handleProfile}>
          <div className="icon">
            <ProfileIcon color="black" />
          </div>
          <p>{contexts.SIDE_MENU.PROFILE}</p>
        </div>
        <div className="list" onClick={handleWallet}>
          <div className="icon">
            <BalanceIcon color="black" />
          </div>
          <p>{contexts.SIDE_MENU.DONUTS}</p>
        </div>
        <div className="list" onClick={handleCreators}>
          <div className="icon">
            <ListViewIcon color="black" />
          </div>
          <p>{'List of Creators'}</p>
        </div>
        <div className="list" onClick={handleShop}>
          <div className="icon">
            <CreatoCoinIcon color="black" />
          </div>
          <p>{contexts.SIDE_MENU.SHOP}</p>
        </div>
        <div className="list" onClick={handleNotifications} >
          <div className="icon" style={{ paddingLeft: '4px' }}>
            {user?.new_notification ? <NotificationwithCircleIcon color="black" />
              : <NotificationfillIcon color="black" />}
          </div>
          <p>{contexts.SIDE_MENU.NOTIFICATION}</p>
        </div>
        <div className="list" onClick={handleLanguage} >
          <div className="icon">
            <LanguageIcon color="black" />
          </div>
          <p>Language / 語言</p>
        </div>
        <div className="list" onClick={handleSetting}>
          <div className="icon">
            <SettingIcon color="black" />
          </div>
          <p>{contexts.SIDE_MENU.SETTING}</p>
        </div>
        <div className="logout list" onClick={props.handleLogout} >
          <div className="icon" style={{ paddingLeft: '2px' }}>
            <LogoutIcon color="black" />
          </div>
          <p>{contexts.SIDE_MENU.LOG_OUT}</p>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;

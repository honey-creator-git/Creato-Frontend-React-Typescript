import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LanguageContext } from "../../routes/authRoute";
import Button from "../general/button";
import Avatar from "../general/avatar";
import {
  AddIcon,
  EditIcon,
  FacebookIcon,
  InstagramIcon,
  MoreIcon,
  NotificationOutlineIcon,
  NotificationSubscribedIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../../assets/svg";
import CONSTANT from "../../constants/constant";
import { SET_PROFILE_DATA } from "../../redux/types";
import { subscribeUser } from '../../api'
import Dialog from "../general/dialog";
import { SET_PREVIOUS_ROUTE } from "../../redux/types";
import { notificationAction } from "../../redux/actions/notificationAction";
import "../../assets/styles/profile/components/profileHeaderStyle.scss";

const useOutsideAlerter = (ref: any, moreInfo: any) => {
  const [more, setMore] = useState(moreInfo);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      setMore(moreInfo);
      if (ref.current && !ref.current.contains(event.target)) {
        if (moreInfo) setMore(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, moreInfo]);
  return more;
}

interface profileProps {
  property?: string; //edit view
  size?: string; // mobile web
  handleCreateDareMe?: any;
}

const ProfileHeader = (props: profileProps) => {
  const navigate = useNavigate();
  const userStore = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const authuser = userStore.users[0];
  const user = userStore.user;
  const contexts = useContext(LanguageContext);
  const [categoryText, setCategoryText] = useState("");
  const [moreInfo, setMoreInfo] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const wrapRef = useRef<any>(null);
  const res = useOutsideAlerter(wrapRef, moreInfo);

  useEffect(() => {
    if (authuser && authuser.categories.length) {
      let categories = authuser.categories;
      let texts = ""
      categories.sort((a: any, b: any) => { return a > b ? 1 : a < b ? -1 : 0 });
      categories.forEach((categoryIndex: any, index: any) => {
        texts += contexts.CREATOR_CATEGORY_LIST[categoryIndex];
        if (index < categories.length - 1) texts += "/";
      });
      setCategoryText(texts);
    }
  }, [authuser]);

  useEffect(() => {
    if (user && authuser) {
      authuser.subscribed_users.forEach((item: any) => {
        if (item + "" === user.id + "") setSubscribed(true)
      })
    }
  }, [user, authuser]);

  const subscribedUser = async () => {
    try {
      if (user) {
        const result = await subscribeUser(authuser._id);
        if (result.data.success) setSubscribed(!subscribed);
      } else setIsSignIn(true);
    } catch (err) {
      console.log({ err })
    }
  }

  useEffect(() => {
    if (!res) setMoreInfo(res);
  }, [res]);

  return (
    <div
      className="profile-header"
      style={{ height: `${props.size === "mobile" ? "129px" : "204px"}` }}
    >
      <Dialog
        display={isSignIn}
        exit={() => { setIsSignIn(false) }}
        wrapExit={() => { setIsSignIn(false) }}
        title="Sign in now"
        context={"Support your favourite creators!"}
        buttons={[
          {
            text: "Sign in",
            handleClick: () => {
              dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/${authuser.personalisedUrl}` });
              navigate('/auth/signin');
            }
          }
        ]}
      />
      <div className="avatar">
        <Avatar
          size={props.size}
          avatarStyle="horizontal"
          category={categoryText}
          username={authuser ? authuser.name : ''}
          avatar={authuser ? authuser.avatar.indexOf('uploads') === -1 ? authuser.avatar : `${CONSTANT.SERVER_URL}/${authuser.avatar}` : ''}
        />
      </div>
      <div className="ellipsis-icon" onClick={() => { setMoreInfo(true); }}>
        <MoreIcon color="black" />
      </div>
      <div className="icons">
        {props.property === "view" ? (
          <div className="bell-icon" onClick={subscribedUser}>
            {subscribed ? <NotificationSubscribedIcon color="#EFA058" /> : <NotificationOutlineIcon color="#EFA058" />}
          </div>
        ) : (
          <div className="pen-icon" onClick={() => {
            if (user) {
              dispatch({
                type: SET_PROFILE_DATA, payload: {
                  category: user?.category,
                  avatarFile: null,
                  displayName: user?.name,
                  creatoUrl: `www.creatogether.io/${user?.personalisedUrl}`
                }
              });
              navigate(`/users/${user.id}/edit`);
            }
          }}>
            <EditIcon color="#E17253" />
          </div>
        )}
        {/* <div className="youtube-icon">
          <YoutubeIcon color="#E17253" />
        </div>
        <div className="instagram-icon">
          <InstagramIcon color="#E17253" />
        </div>
        {props.property === "view" && (
          <div className="facebook-icon">
            <FacebookIcon color="#E17253" />
          </div>
        )} */}
        {/* {props.property === "view" && (
          <div className="twitter-icon">
            <TwitterIcon color="#E17253" />
          </div>
        )} */}
      </div>
      {(user && authuser && user.id === authuser._id) &&
        <div className="create-btn">
          <Button
            handleSubmit={props.handleCreateDareMe}
            color="primary"
            shape="pill"
            fillStyle="fill"
            icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
          />
        </div>
      }
      <div className="drop-down-list" style={moreInfo === true ? { visibility: 'visible', opacity: 1 } : {}} ref={wrapRef}>
        <div className="list" onClick={() => {
          navigator.clipboard.writeText(`www.creatogether.io/${authuser.personalisedUrl}`);
          setMoreInfo(false);
        }}>{contexts.PROFILE_LETTER.COPY_PROFILE_LINK}</div>
        <div className="list" onClick={() => { setMoreInfo(false) }}>{contexts.PROFILE_LETTER.CANCEL}</div>
      </div>
    </div>
  );
};

export default ProfileHeader;

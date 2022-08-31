import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LanguageContext } from "../../routes/authRoute";
import Button from "../general/button";
import Avatar from "../general/avatar";
import {
  AddIcon,
  EditIcon,
  // FacebookIcon,
  HotIcon,
  InstagramIcon,
  MoreIcon,
  NotificationOutlineIcon,
  NotificationSubscribedIcon,
  // TwitterIcon,
  YoutubeIcon,
  TipIcon,
  CreatoCoinIcon,
  InviteIcon
} from "../../assets/svg";
import CONSTANT from "../../constants/constant";
import { SET_PROFILE_DATA } from "../../redux/types";
import { subscribeUser } from '../../api'
import Dialog from "../general/dialog";
import { SET_PREVIOUS_ROUTE } from "../../redux/types";
// import { notificationAction } from "../../redux/actions/notificationAction";
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
  const daremeStore = useSelector((state: any) => state.dareme);
  const daremes = daremeStore.daremes;
  const voterCount = daremeStore.voterCount;
  const [categoryText, setCategoryText] = useState("");
  const [moreInfo, setMoreInfo] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [totalDonuts, setTotalDonuts] = useState(0);
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
    if (daremes.length !== 0) {
      let donutSum = 0;
      for (let i = 0; i < daremes.length; i++)
        if (daremes[i].finished === true && daremes[i].isUser === true)
          donutSum += daremes[i].donuts;
      setTotalDonuts(donutSum);
    }
  }, [authuser, contexts.CREATOR_CATEGORY_LIST, daremes]);

  useEffect(() => {
    if (user && authuser) {
      authuser.subscribed_users.forEach((item: any) => {
        if (item + "" === user.id + "") setSubscribed(true)
      })
    }
  }, [user, authuser]);

  const formalNumber = (num: Number) => {
    if (num <= 999) return num;
    const s_reverseNum = num.toString().split("").reverse().join("");
    let s_buffer = "";
    let cnt = 0;
    for (let i = 0; i < s_reverseNum.length; i++) {
      s_buffer += s_reverseNum[i];
      if (cnt === 2) {
        cnt = 0;
        s_buffer += ',';
      }
      cnt++;
    }
    return s_buffer.split("").reverse().join("");
  }

  const roundNumber = (num: number) => {
    if (num <= 9999)
      return formalNumber(num);
    else if (num <= 99999) {
      return (Math.round(num / 100) / 10).toString() + "K";
    }
    else if (num <= 999999) {
      return (Math.round(num / 1000)).toString() + "K";
    }
    else {
      return (Math.round(num / 100000) / 10).toString() + "M";
    }
  }

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

  const tipping = () => {
    if (user) navigate(`/${authuser.personalisedUrl}/tip`);
    else navigate('/tipmethod');
  }

  useEffect(() => {
    if (!res) setMoreInfo(res);
  }, [res]);

  return (
    <div
      className="profile-header"
      style={{ height: `${props.size === "mobile" ? "150px" : "200px"}` }}
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
          avatar={authuser ? authuser.avatar.indexOf('uploads') === -1 ? authuser.avatar : `${CONSTANT.SERVER_URL}/${authuser.avatar}` : ''}
        />
        <div className="name-category">
          <span className="name">{authuser ? authuser.name : ''}</span>
          <span className="cetegory">{categoryText}</span>
          <span className="social-icons">
            <div className="youtube-icon">
              <YoutubeIcon color="#E17253" />
            </div>
            <div className="instagram-icon">
              <InstagramIcon color="#E17253" />
            </div>
            {/* {props.property === "view" && (
            <div className="facebook-icon">
              <FacebookIcon color="#E17253" />
            </div>
            )} */}
            {/* {props.property === "view" && (
              <div className="twitter-icon">
                <TwitterIcon color="#E17253" />
              </div>
            )} */}
          </span>
        </div>
      </div>
      <div className="ellipsis-icon" onClick={() => { setMoreInfo(true); }}>
        <MoreIcon color="black" />
      </div>
      {voterCount || totalDonuts ?
        <div className="rating-container">
          <span className="Voting-value"><b>{roundNumber(voterCount)} </b></span>
          <HotIcon className="rating-icons" color="#EFA058" width="18" />
          <span><b>SuperFans</b></span>
          <span className="Voting-value"> <b>&nbsp; {roundNumber(totalDonuts)}</b></span>
          <CreatoCoinIcon className="rating-icons" color="#EFA058" width="18" />
        </div> :
        <></>
      }
      <div className="icons">
        {props.property === "view" ? (
          <div className="bell-icon" onClick={subscribedUser}>
            {subscribed ? <NotificationSubscribedIcon color="#EFA058" /> : <NotificationOutlineIcon color="#EFA058" />}
          </div>
        ) : (
          <>
            <div className="pen-icon" onClick={() => {
              if (user) {
                dispatch({
                  type: SET_PROFILE_DATA, payload: {
                    category: user.category,
                    avatarFile: null,
                    displayName: user.name,
                    creatoUrl: `www.creatogether.io/${user.personalisedUrl}`
                  }
                });
                navigate(`/myaccount/edit`);
              }
            }}>
              <EditIcon color="white" /><span>&nbsp;Edit</span>
            </div>
            <div className="pen-icon" onClick={() => { if (user) navigate(`/myaccount/setting/invitefriends`) }}>
              <InviteIcon color="white" width={25} height={15}/><span>&nbsp;Invite</span>
            </div>
          </>
        )}
      </div>
      <div className="create-btn">
        {(user && authuser && user.id === authuser._id) ?
          <Button
            handleSubmit={props.handleCreateDareMe}
            color="primary"
            shape="pill"
            fillStyle="fill"
            icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
          />
          :
          <>
            {(authuser && authuser.tipFunction) &&
              <Button
                handleSubmit={tipping}
                color="primary"
                shape="pill"
                fillStyle="fill"
                icon={[<TipIcon color="white" />, <TipIcon color="white" />, <TipIcon color="white" />]}
              />
            }
          </>
        }
      </div>
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

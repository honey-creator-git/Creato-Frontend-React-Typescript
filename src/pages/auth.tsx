import React, { useEffect, useState, useContext } from "react";
import { GoogleLogin } from "react-google-login";
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import AppleLogin from 'react-apple-login'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import CONSTANT from "../constants/constant";
import Dialog from "../components/general/dialog";
import { LanguageContext } from "../routes/authRoute";
import { AppleIcon, FacebookIcon, GoogleIcon } from "../constants/awesomeIcons";
import { authAction } from "../redux/actions/authActions";
import "../assets/styles/signupStyle.scss";
const InApp = require("detect-inapp");

declare global {
  interface Window {
    FB: any;
  }
}

const Auth = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const loadState = useSelector((state: any) => state.load);
  const inapp = new InApp(navigator.userAgent || navigator.vendor || window.FB);
  const [openWith, setOpenWith] = useState(inapp.browser === 'instagram' || inapp.browser === 'facebook' || navigator.userAgent.toLowerCase().indexOf('line') !== -1 ? true : false);
  const [isHover, setIsHover] = useState(false);
  const [isHover1, setIsHover1] = useState(false);
  const lang = useSelector((state: any) => state.auth.lang);
  const prevRoute = loadState.prevRoute;
  const contexts = useContext(LanguageContext);

  const signupStyle = {
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: isHover === true ? "black" : "#BCB6A9",
    textDecoration: isHover === true ? "underline" : "none",
  };

  const aStyle = {
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    alignItems: "center",
    color: isHover === true ? "black" : "#BCB6A9",
    textDecoration: isHover === true ? "underline" : "none",
  };

  const aStyle1 = {
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    alignItems: "center",
    color: isHover1 === true ? "black" : "#BCB6A9",
    textDecoration: isHover1 === true ? "underline" : "none",
  };

  const responseGoogleSuccess = async (response: any) => {
    const result: any = response?.profileObj;
    let browser = "";
    if (navigator.userAgent.indexOf("Chrome") !== -1) browser = 'Chrome';
    else if (navigator.userAgent.indexOf("Safari") !== -1) browser = "Safari";
    else if (navigator.userAgent.indexOf("Firefox") !== -1) browser = 'Firefox';

    const userData = ({
      name: result.name,
      avatar: result.imageUrl,
      email: result.email,
      googleId: result.googleId,
      browser: browser,
      lang: lang
    });
    if (props.isSignin) dispatch(authAction.googleSigninUser(userData, navigate, prevRoute))
    else dispatch(authAction.googleSignupUser(userData, navigate, prevRoute))
  };

  const responseGoogleError = (error: any) => {

  };

  // const responseFacebook = (response: any) => {
  //   console.log(response)
  //   let browser = "";
  //   if (navigator.userAgent.indexOf("Chrome") !== -1) browser = 'Chrome';
  //   else if (navigator.userAgent.indexOf("Safari") !== -1) browser = "Safari";
  //   else if (navigator.userAgent.indexOf("Firefox") !== -1) browser = 'Firefox';

  //   const userData = ({
  //     name: response.name,
  //     avatar: response.picture.data.url,
  //     email: response.email,
  //     facebookId: response.id,
  //     browser: browser
  //   });
  //   if (props.isSignin) dispatch(authAction.facebookSigninUser(userData, navigate, prevRoute));
  //   else dispatch(authAction.facebookSignupUser(userData, navigate, prevRoute));
  // }

  const responseApple = (response: any) => {
    if (!response.error) {
      let browser = "";
      if (navigator.userAgent.indexOf("Chrome") !== -1) browser = 'Chrome';
      else if (navigator.userAgent.indexOf("Safari") !== -1) browser = "Safari";
      else if (navigator.userAgent.indexOf("Firefox") !== -1) browser = 'Firefox';

      const userData = ({
        token: response.authorization.id_token,
        user: response.user ? response.user : null,
        browser: browser,
        lang: lang
      })

      if (props.isSignin) dispatch(authAction.appleSigninUser(userData, navigate, prevRoute))
      else dispatch(authAction.appleSignupUser(userData, navigate, prevRoute))
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <React.Fragment>
      <Dialog
        display={openWith}
        title="Open In Browser 🌐"
        context={"Open in browser\nfor a better experience.\n\n開啓瀏覽器\n獲得更好的用戶體驗"}
        exit={() => { setOpenWith(false); }}
        wrapExit={() => { setOpenWith(false); }}
        buttons={[
          {
            text: 'Open / 開啓',
            handleClick: () => {
              if (navigator.userAgent.indexOf('like Mac') !== -1) {
                if (navigator.userAgent.toLowerCase().indexOf('line') !== -1) {
                  window.open(`googlechrome://${CONSTANT.SERVER_URL.substring(8)}/auth/signin`);
                } else {
                  window.open(`googlechrome://${CONSTANT.SERVER_URL.substring(8)}/auth/signin`);
                }
              } else if (navigator.userAgent.indexOf('Android') !== -1) {
                if (navigator.userAgent.toLowerCase().indexOf('line') !== -1) {
                  let link = document.createElement('a');
                  link.setAttribute("href", `intent:${CONSTANT.SERVER_URL}/auth/signin#Intent;end`);
                  link.setAttribute("target", "_blank");
                  link.click();
                } else {
                  window.open(`googlechrome://${CONSTANT.SERVER_URL.substring(8)}/auth/signin`);
                }
              }
            }
          }
        ]}
      />
      <div className="signup-wrapper">
        {props.isSignin === false ? (
          <div>
            <h4>{contexts.AUTH_LETTER.SIGN_UP_TO_ENJOY}</h4>
            <br />
            <ul>
              <li>{contexts.AUTH_LETTER.SIGN_UP_LETTER1}</li>
              <li>{contexts.AUTH_LETTER.SIGN_UP_LETTER2}</li>
              <li>{contexts.AUTH_LETTER.SIGN_UP_LETTER3}</li>
            </ul>
            <br />
            <h2>{contexts.AUTH_LETTER.SIGN_UP_WITH}</h2>
          </div>
        ) : (
          <h2>
            {contexts.AUTH_LETTER.WELCOME_BACK}
            <br />
            <br />
            {contexts.AUTH_LETTER.LOGIN_WITH}
          </h2>
        )}
        <div className="icons">
          <GoogleLogin
            clientId={CONSTANT.GOOGLE_CLIENT_ID}
            render={(renderProps) => (
              <div className="icon" onClick={renderProps.onClick}>
                <GoogleIcon color="#EFA058" />
              </div>
            )}
            onSuccess={responseGoogleSuccess}
            onFailure={responseGoogleError}
            cookiePolicy={"single_host_origin"}
          />
          {/* <FacebookLogin
            appId={CONSTANT.FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,email,picture"
            scope="public_profile,email,user_link"
            callback={responseFacebook}
            render={(renderProps) => (
              <div className="icon" onClick={renderProps.onClick}>
                <FacebookIcon color="#EFA058" />
              </div>
            )}
          /> */}
          <AppleLogin
            clientId="dev.apple.service.creato"
            redirectURI="https://dev8.creatogether.io/auth"
            callback={responseApple} // Catch the response
            scope="email name"
            responseMode="query"
            usePopup={true}
            render={(renderProps) => (
              <div className="icon" onClick={renderProps.onClick}>
                <AppleIcon color="#EFA058" />
              </div>
            )}
          />
        </div>
        {props.isSignin === false ? (
          <p>{contexts.AUTH_LETTER.BY_SIGN_UP}
            <a
              onMouseOver={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              style={aStyle}
              href="https://www.notion.so/Terms-Conditions-of-Use-4e807f509cf54d569031fe254afbf713" target="_blank"> {contexts.AUTH_LETTER.TERMS}</a>{contexts.AUTH_LETTER.AND}<a onMouseOver={() => setIsHover1(true)}
                onMouseLeave={() => setIsHover1(false)}
                style={aStyle1} href="https://www.notion.so/Privacy-Policy-f718ec335447402a8bb863cb72d3ee33" target="_blank">{contexts.AUTH_LETTER.PRIVACY_POLICY}</a></p>
        ) : (
          <div
            style={{
              display: "flex",
            }}
          >
            <p>{contexts.AUTH_LETTER.NEW_CREATO}</p>
            <p
              onMouseOver={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              onClick={() => navigate('/auth/signup')}
              style={signupStyle}
            >
              {contexts.AUTH_LETTER.SIGN_UP}
            </p>
            <p>{contexts.AUTH_LETTER.NOW}</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Auth;

import { useContext, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { GoogleLogin } from "react-google-login";
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import AppleLogin from 'react-apple-login'
import { CloseIcon } from "../../assets/svg"
import SignImage from "../../assets/img/sign.jpg"
import { LanguageContext } from "../../routes/authRoute"
import { authAction } from "../../redux/actions/authActions"
import { AppleIcon, FacebookIcon, GoogleIcon } from "../../constants/awesomeIcons"
import CONSTANT from "../../constants/constant";
import "../../assets/styles/signDialogStyle.scss"

const SignDialog = (props: any) => {
  const { display, exit, wrapExit } = props
  const contexts = useContext(LanguageContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const lang = useSelector((state: any) => state.auth.lang)
  const referralInfo = JSON.parse(localStorage.getItem("referral_info") || '{}')
  const prevRoute = location.pathname
  const [isHover, setIsHover] = useState(false)
  const [isHover1, setIsHover1] = useState(false)

  const aStyle = {
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    alignItems: "center",
    color: isHover === true ? "black" : "#BCB6A9",
    textDecoration: isHover === true ? "underline" : "none",
  }

  const aStyle1 = {
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    alignItems: "center",
    color: isHover1 === true ? "black" : "#BCB6A9",
    textDecoration: isHover1 === true ? "underline" : "none",
  }

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
      lang: lang,
      referral: referralInfo
    })

    if (props.isSignin) dispatch(authAction.googleSigninUser(userData, navigate, prevRoute))
    else dispatch(authAction.googleSignupUser(userData, navigate, prevRoute))
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
        lang: lang,
        referral: referralInfo
      })

      if (props.isSignin) dispatch(authAction.appleSigninUser(userData, navigate, prevRoute))
      else dispatch(authAction.appleSignupUser(userData, navigate, prevRoute))
    }
  };

  return (
    <div className="sign-dialog-wrapper" style={display ? { visibility: 'visible', opacity: 1 } : {}} onClick={wrapExit}>
      <div className="sign-dialog-main">
        <div className="dialog-header" style={exit ? { marginBottom: '16px' } : { justifyContent: 'center', marginBottom: '8px' }}>
          <div className="dialog-title">
            {contexts.SIGN_IN_DLG.WELCOME}
          </div>
          {exit &&
            <div onClick={exit}>
              <CloseIcon color="black" />
            </div>
          }
        </div>
        <div className="main-body">
          <div>
            <div className="dialog-context">
              {contexts.SIGN_IN_DLG.WELCOME_LETTER}
            </div>
            <div className="sign-image">
              <img src={SignImage} alt="Sign" width="100%" />
            </div>
            <div className="dialog-context-desktop">
              {contexts.SIGN_IN_DLG.WELCOME_LETTER}
            </div>
          </div>
          <div className="sign-body">
            <div className="sign-body-header">
              <span>{contexts.SIGN_IN_DLG.SIGN_IN_AND_UP}</span>
            </div>
            <div className="icons">
              <GoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                render={(renderProps) => (
                  <div className="icon" onClick={renderProps.onClick}>
                    <GoogleIcon color="#EFA058" />
                  </div>
                )}
                onSuccess={responseGoogleSuccess}
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
                clientId="creatogether.io.apple.login.service"
                redirectURI="https://creatogether.io/auth"
                // clientId="dev.creatogether.io.apple.login.service"
                // redirectURI="https://dev8.creatogether.io/auth"
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
            <div className="free-letter">
              <span>{contexts.SIGN_IN_DLG.FREE_DONUTS_LETTER}</span>
            </div>
            <div>
              <p>{contexts.AUTH_LETTER.BY_SIGN_UP}
                <a
                  onMouseOver={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  style={aStyle}
                  href="https://www.notion.so/Terms-Conditions-of-Use-4e807f509cf54d569031fe254afbf713" target="_blank"> {contexts.AUTH_LETTER.TERMS}</a>{contexts.AUTH_LETTER.AND}<a onMouseOver={() => setIsHover1(true)}
                    onMouseLeave={() => setIsHover1(false)}
                    style={aStyle1} href="https://www.notion.so/Privacy-Policy-f718ec335447402a8bb863cb72d3ee33" target="_blank">{contexts.AUTH_LETTER.PRIVACY_POLICY}</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignDialog
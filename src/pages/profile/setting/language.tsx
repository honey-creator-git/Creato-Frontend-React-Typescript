import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckIcon } from "../../../assets/svg";
import Title from "../../../components/general/title";
import { useSelector } from "react-redux";
import { authAction } from "../../../redux/actions/authActions";
import { LanguageContext } from "../../../routes/authRoute";
import "../../../assets/styles/profile/languageStyle.scss";

const Language = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userState = useSelector((state: any) => state.auth);
  const contexts = useContext(LanguageContext);
  const prevRoute = useSelector((state: any) => state.load.prevRoute);
  const user = userState.user;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.LANGUAGE} back={() => { navigate(prevRoute); }} />
      </div>
      <div className="language-wrapper">
        <div className="languages">
          <div className="language" onClick={() => { dispatch(authAction.setLanguage('EN', user)); }}>
            <div>English</div>
            <CheckIcon
              color={user?.language === "EN" ? "black" : "rgba(0,0,0,0)"}
            />
          </div>
          <div className="language" onClick={() => { dispatch(authAction.setLanguage('CH', user)); }}>
            <div>繁體中文</div>
            <CheckIcon
              color={user?.language === "CH" ? "black" : "rgba(0,0,0,0)"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Language;

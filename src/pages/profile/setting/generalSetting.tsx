import { useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AlertIcon,
  CreatoCoinIcon,
  ForwardIcon,
  LanguageIcon,
  NoOfPeopleIcon,
} from "../../../assets/svg";
import Title from "../../../components/general/title";
import { WalletIcon } from "../../../constants/awesomeIcons";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_PREVIOUS_ROUTE } from "../../../redux/types";
import "../../../assets/styles/profile/generalSettingStyle.scss";

const GeneralSetting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userState = useSelector((state: any) => state.auth);
  const contexts = useContext(LanguageContext);
  const user = userState.user;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <>
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.SETTINGS} back={() => { navigate(`/${user.personalisedUrl}`) }} />
      </div>
      <div className="setting-general">
        <div className="settings">
          <div
            className="setting"
            onClick={() => navigate(`/users/${user.id}/setting/invitefriends`)}
          >
            <div className="part">
              <NoOfPeopleIcon color="black" />
              <div className="title">{contexts.SETTINGS_LETTER.INVITE_FRIENDS}</div>
            </div>
            <ForwardIcon color="black" />
          </div>
          <div
            className="setting"
            onClick={() => navigate(`/users/${user.id}/setting/payment`)}
          >
            <div className="part">
              <WalletIcon color="black" />
              <div className="title">{contexts.SETTINGS_LETTER.PAYOUT}</div>
            </div>
            <ForwardIcon color="black" />
          </div>
          <div
            className="setting"
            onClick={() => {
              dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/users/${user.id}/setting` });
              navigate(`/users/${user.id}/setting/language`)
            }}
          >
            <div className="part">
              <LanguageIcon color="black" />
              <div className="title">{contexts.SETTINGS_LETTER.LANGUAGE}</div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '20px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '19px',
                  letterSpacing: '0.05em',
                  color: '#BCB6A9'
                }}
              >{user?.language === 'EN' ? 'English' : '繁體中文'}</span>
              <ForwardIcon color="black" />
            </div>
          </div>
          <a href="https://www.creatogether.app/" target="_blank">
            <div className="setting">
              <div className="part">
                <CreatoCoinIcon color="black" />
                <div className="title">{contexts.SETTINGS_LETTER.ABOUT_US}</div>
              </div>
            </div>
          </a>
          <a href="https://www.notion.so/Terms-Conditions-of-Use-4e807f509cf54d569031fe254afbf713" target='_blank'>
            <div className="setting">
              <div className="part">
                <NoOfPeopleIcon color="" />
                <div className="title">{contexts.SETTINGS_LETTER.TERMS_CONDITIONS}</div>
              </div>
            </div>
          </a>
          <a href="https://www.notion.so/Privacy-Policy-f718ec335447402a8bb863cb72d3ee33" target="_blank">
            <div className="setting">
              <div className="part">
                <NoOfPeopleIcon color="" />
                <div className="title">{contexts.SETTINGS_LETTER.PRIVACY_POLICIES}</div>
              </div>
            </div>
          </a>
          <a href="https://www.creatogether.app/contact-us" target="_blank">
            <div className="setting">
              <div className="part">
                <AlertIcon color="black" />
                <div className="title">{contexts.SETTINGS_LETTER.CONTACT_US}</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default GeneralSetting;

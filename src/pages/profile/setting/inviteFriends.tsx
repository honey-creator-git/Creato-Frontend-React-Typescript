import { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Title from "../../../components/general/title";
import Button from "../../../components/general/button";
import {
  CreatoCoinIcon,
  FacebookIcon,
  NoOfPeopleIcon,
  SpreadIcon,
  WhatsappIcon,
} from "../../../assets/svg";
import { LanguageContext } from "../../../routes/authRoute";
import "../../../assets/styles/profile/invitefriendsStyle.scss";

const Invitefriends = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const contexts = useContext(LanguageContext);

  return (
    <>
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.INVITE_FRIENDS} back={() => navigate(`/users/${user.id}/setting`)} />
      </div>
      <div className="invite-friends">
        <div className="title">
          {contexts.INVITE_FRIEND_LETTER.HEADER_TITLE}
        </div>
        <div className="content">
          <div className="icon">
            <SpreadIcon color="#EFA058" width="50" height="50" />
          </div>
          <div className="part">
            <div className="title1">{contexts.INVITE_FRIEND_LETTER.SHARING}</div>
            <div className="subtitle">
              {contexts.INVITE_FRIEND_LETTER.SHARING_LETTER}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="icon">
            <NoOfPeopleIcon color="#EFA058" width="50" height="50" />
          </div>
          <div className="part">
            <div className="title1">{contexts.INVITE_FRIEND_LETTER.GET_FREE_DONUTS}</div>
            <div className="subtitle">
              {contexts.INVITE_FRIEND_LETTER.GET_FREE_DONUTS_LETTER}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="icon">
            <CreatoCoinIcon color="#EFA058" width="50" height="50" />
          </div>
          <div className="part">
            <div className="title1">{contexts.INVITE_FRIEND_LETTER.DARE_CREATORS}</div>
            <div className="subtitle">
              {contexts.INVITE_FRIEND_LETTER.DARE_CREATORS_LETTER}
            </div>
          </div>
        </div>
        <div className="copy-field">
          <div className="text">creatogether.app/lamsailong</div>
          <Button
            color="primary"
            shape="rounded"
            fillStyle="fill"
            text={contexts.INVITE_FRIEND_LETTER.COPY}
            handleSubmit={() => { }}
          />
        </div>
        <div className="social-link">
          <Button
            color="primary"
            shape="pill"
            fillStyle="outline"
            text="Whatsapps"
            icon={[<WhatsappIcon color="#EFA058" />, <WhatsappIcon color="white" />, <WhatsappIcon color="white" />]}
            handleSubmit={() => { }}
          />
          <Button
            color="primary"
            shape="pill"
            fillStyle="outline"
            text="Facebook"
            icon={[<FacebookIcon color="#EFA058" />, <FacebookIcon color="white" />, <FacebookIcon color="white" />]}
            handleSubmit={() => { }}
          />
        </div>
      </div>
    </>
  );
};

export default Invitefriends;

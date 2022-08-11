import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authAction } from "../../../redux/actions/authActions";
import Title from "../../../components/general/title";
import ContainerBtn from "../../../components/general/containerBtn";
import Button from "../../../components/general/button";
import Input from "../../../components/general/input";
import CONSTANT from "../../../constants/constant";
import { SET_NAME_EXIST, SET_PROFILE_DATA, SET_URL_EXIST } from "../../../redux/types";
import { AddIcon, SpreadIcon } from "../../../assets/svg";
import Dialog from "../../../components/general/dialog";
import { LanguageContext } from "../../../routes/authRoute";
import "../../../assets/styles/profile/profileEditStyle.scss";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state: any) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = userState.user;
  const existName = userState.nameExist;
  const existURL = userState.urlExist;
  const profile = userState.profileData;
  const [displayName, setDisplayName] = useState<string>(profile.displayName ? profile.displayName : '');
  const [creatoURL, setCreatoURL] = useState<string>(profile.creatoUrl ? profile.creatoUrl : 'www.creatogether.io/');
  const [openLinkSocial, setOpenLinkSocial] = useState(false);
  const contexts = useContext(LanguageContext);

  const handleSave = () => {
    if (existName === false && existURL === false) {
      const url = creatoURL.substring(0, 20);
      if (url !== 'www.creatogether.io/') alert("Wrong Url");
      else {
        const creato = creatoURL.substring(20);
        dispatch(authAction.saveProfileInfo(displayName, creato, profile.category, profile.avatarFile, navigate));
      }
    }
  };

  const handleFileUpload = (e: any) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = Object.assign(files[0], { preview: URL.createObjectURL(files[0]) });
      const state = { ...profile, avatarFile: file };
      dispatch({ type: SET_PROFILE_DATA, payload: state });
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({ type: SET_NAME_EXIST, payload: false });
    dispatch({ type: SET_URL_EXIST, payload: false });
  }, []);

  useEffect(() => {
    if (displayName !== "") dispatch(authAction.getExistName(displayName));
  }, [displayName]);

  useEffect(() => {
    if (creatoURL !== "") {
      const creato = creatoURL.substring(20);
      dispatch(authAction.getExistURL(creato));
    }
  }, [creatoURL]);

  return (
    <>
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.EDIT_PROFILE} back={() => { if (user) navigate(`/${user.personalisedUrl}`) }} />
      </div>
      <div className="profile-edit-wrapper">
        <Dialog
          display={openLinkSocial}
          wrapExit={() => { setOpenLinkSocial(false) }}
          title="Stay tuned..."
          icon={
            {
              pos: 0,
              icon: <SpreadIcon color="#EFA058" width="50px" height="50px" />
            }
          }
          context={'We will be launching this soon.'}
        />
        <div className="avatar-info">
          <div className="avatar">
            {user &&
              <img
                src={profile.avatarFile ? profile.avatarFile.preview : user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}`}
                alt="avatar"
              />
            }
          </div>
          <div className="description" onClick={() => fileInputRef.current?.click()}>{contexts.EDIT_PROFILE_LETTER.EDIT}</div>
          <input
            hidden
            ref={fileInputRef}
            type="file"
            accept="image/*"
            value={""}
            onChange={handleFileUpload}
          />
        </div>
        <div className="display-name">
          <Input
            type="input"
            placeholder={contexts.EDIT_PROFILE_LETTER.EDIT_HERE}
            size="small"
            label={contexts.EDIT_PROFILE_LETTER.DISPLAY_NAME}
            wordCount={20}
            title={displayName}
            setTitle={setDisplayName}
            setFocus={() => { }}
          />
        </div>
        {existName === true ?
          <span className="display-name-error">
            {contexts.EDIT_PROFILE_LETTER.DISPLAY_NAME_ERROR}
          </span> : ""
        }
        <div className="url">
          <Input
            type="input"
            placeholder="www.creatogether.io/jackychan"
            label={contexts.EDIT_PROFILE_LETTER.PERSONALISED_URL}
            wordCount={40}
            size="small"
            title={creatoURL}
            isUrl={true}
            setTitle={setCreatoURL}
            setFocus={() => { }}
          />
        </div>
        {existURL === true ?
          <span className="display-name-error">
            {contexts.EDIT_PROFILE_LETTER.URL_ERROR}
          </span> : ""
        }
        <div
          className="social-link"
          onClick={() => {
            // navigate("/profile/edit/socialaccount")
            setOpenLinkSocial(true);
          }}
        >
          <ContainerBtn
            styleType="outline"
            icon={[<AddIcon color="#efa058" />, <AddIcon color="white" />, <AddIcon color="white" />]}
            text={contexts.EDIT_PROFILE_LETTER.LINK_SOCIAL_ACCOUNT}
          />
        </div>
        <div
          className="categories"
          onClick={() => {
            const state = { ...profile, displayName: displayName, creatoUrl: creatoURL };
            dispatch({ type: SET_PROFILE_DATA, payload: state });
            navigate(`/myaccount/edit/categories`);
          }}
        >
          <ContainerBtn styleType="outline" text={contexts.EDIT_PROFILE_LETTER.CATEGORIES} />
        </div>
        <div className="save-btn">
          <Button
            fillStyle="fill"
            text={contexts.EDIT_PROFILE_LETTER.SAVE}
            color="primary"
            shape="rounded"
            width="100px"
            handleSubmit={handleSave}
          />
        </div>
        <div className="description">
          {/* Please select Categories of your content, choosing a maximum 3
          categories will increase search rate & create more accurate suggestions. */}
        </div>
      </div>
    </>
  );
};

export default ProfileEdit;

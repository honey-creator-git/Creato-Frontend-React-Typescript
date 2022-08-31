import { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AvatarEditor from 'react-avatar-editor'
import { authAction } from "../../../redux/actions/authActions";
import Title from "../../../components/general/title";
import ContainerBtn from "../../../components/general/containerBtn";
import Button from "../../../components/general/button";
import Input from "../../../components/general/input";
import CONSTANT from "../../../constants/constant";
import { SET_NAME_EXIST, SET_PROFILE_DATA, SET_URL_EXIST } from "../../../redux/types";
import { AddIcon, SpreadIcon } from "../../../assets/svg";
import Dialog from "../../../components/general/dialog";
import ToggleButton from "../../../components/admin/ToggleButton";
import { LanguageContext } from "../../../routes/authRoute";
import { tipAction } from "../../../redux/actions/tipActions";
import "../../../assets/styles/profile/profileEditStyle.scss"

const ProfileEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()
  let imageEditor: any = null
  const userState = useSelector((state: any) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = userState.user
  const tipAvailable = userState.tipAvailable
  const tipFunction = userState.tipFunction
  const existName = userState.nameExist;
  const existURL = userState.urlExist;
  const profile = userState.profileData;
  const [displayName, setDisplayName] = useState<string>("");
  const [creatoURL, setCreatoURL] = useState<string>('www.creatogether.io/');
  const [openLinkSocial, setOpenLinkSocial] = useState(false);
  const contexts = useContext(LanguageContext);

  const handleSave = async () => {
    if (existName === false && existURL === false) {
      let imageFile: any = null
      if (profile.avatarFile && imageEditor) {
        const canvas = imageEditor.getImage()
        let url = canvas.toDataURL('image/png')
        const res = await fetch(url)
        const blob = await res.blob()
        imageFile = new File([blob], 'avatar.png', blob)
      }
      const url = creatoURL.substring(0, 20);
      if (url !== 'www.creatogether.io/') alert("Wrong Url");
      else {
        const creato = creatoURL.substring(20);
        dispatch(authAction.saveProfileInfo(displayName, creato, profile.category, imageFile, navigate));
      }
    }
  };

  const setEditorRef = (editor: any) => (imageEditor = editor)

  const handleFileUpload = (e: any) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = Object.assign(files[0], { preview: URL.createObjectURL(files[0]) });
      const state = { ...profile, avatarFile: file };
      dispatch({ type: SET_PROFILE_DATA, payload: state });
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch({ type: SET_NAME_EXIST, payload: false })
    dispatch({ type: SET_URL_EXIST, payload: false })
    dispatch(authAction.getTipState())
  }, [location, dispatch]);

  useEffect(() => {
    if (displayName !== "") dispatch(authAction.getExistName(displayName));
  }, [displayName, dispatch]);

  useEffect(() => {
    if (creatoURL) {
      const creato = creatoURL.substring(20);
      dispatch(authAction.getExistURL(creato));
    }
  }, [creatoURL, dispatch]);

  useEffect(() => {
    if (profile.category) {
      setDisplayName(profile.displayName)
      setCreatoURL(profile.creatoUrl)
    }
  }, [profile])

  return (
    <>
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.EDIT_PROFILE} back={() => { if (user) navigate(`/${user.personalisedUrl}`) }} />
      </div>
      <div className="profile-edit-wrapper">
        <Dialog
          display={openLinkSocial}
          wrapExit={() => { setOpenLinkSocial(false) }}
          title={contexts.DIALOG.HEADER_TITLE.STAY_TUNED}
          icon={
            {
              pos: 0,
              icon: <SpreadIcon color="#EFA058" width="50px" height="50px" />
            }
          }
          context={contexts.DIALOG.BODY_LETTER.LAUNCHING_SOON}
        />
        <div className="avatar-info">
          <div className="avatar">
            {user &&
              <AvatarEditor
                ref={setEditorRef}
                image={profile.avatarFile ? profile.avatarFile.preview : user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}`}
                width={150}
                height={150}
                border={30}
                color={[0, 0, 0, 0.6]} // RGBA
                scale={1.0}
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
            title={displayName ? displayName : ''}
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
            title={creatoURL ? creatoURL : ''}
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
        {tipAvailable &&
          <div className="tipping-mode">
            <div><span>Tipping Mode: &nbsp;{tipFunction ? 'Enable' : 'Disable'}</span></div>
            <div>
              <ToggleButton toggle={tipFunction} setToggle={() => { dispatch(tipAction.setTipFunctionByUser(!tipFunction)) }} />
            </div>
          </div>}
        <div
          className="social-link"
          onClick={() => {
            navigate("/myaccount/edit/connect_social")
            // setOpenLinkSocial(true);
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
            text={contexts.GENERAL_LETTER.SAVE}
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

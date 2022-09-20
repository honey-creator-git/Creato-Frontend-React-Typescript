import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { daremeAction } from "../../../redux/actions/daremeActions";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
import AvatarLink from "../../../components/dareme/avatarLink";
import Title from "../../../components/general/title";
import ContainerBtn from "../../../components/general/containerBtn";
import Avatar from "../../../components/general/avatar";
import Hint from "../../../components/general/hint";
import Dialog from "../../../components/general/dialog";
import Input from "../../../components/general/input";
import CONSTANT from "../../../constants/constant";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_CURRENT_DAREME, SET_PREVIOUS_ROUTE } from "../../../redux/types";
import { CreatoCoinIcon, BackIcon, HelpIcon } from "../../../assets/svg";
import '../../../assets/styles/dareme/dare/dareCreatorStyle.scss';

const hints = {
  title: "What is Dare Creator?",
  context: "Dare Creator is for you to propose new Dares to your favourite creators.\n\nIt can be a video or a series of photos that you like them to create with your ideas. Just let them know :)\n\nDonuts will be refunded if creators do not accept your proposed Dare.\n\nDare creators now! 💪🏻😃",
}

const DareCreator = () => {
  const { daremeId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [optionTitle, setOptionTitle] = useState("");
  const [amount, setAmount] = useState('');
  const daremeState = useSelector((state: any) => state.dareme);
  const userState = useSelector((state: any) => state.auth);
  const { dareme } = daremeState
  const { user } = userState
  const [openTopup, setOpenTopup] = useState(false);
  const [openHint, setOpenHint] = useState<boolean>(false);
  const [openDare, setOpenDare] = useState<boolean>(false);
  const contexts = useContext(LanguageContext);

  const dareCreator = () => {
    if (amount !== "" && optionTitle !== "") {
      if (Number(amount) > user.wallet) setOpenTopup(true)
      else if (Number(amount) < 10) alert("You need at least 10 donuts.")
      else setOpenDare(true)
    }
  }

  const checkInputs = () => {
    if (amount !== '' && optionTitle !== '') return true
    return false
  }

  useEffect(() => { 
    if(dareme.owner && user) {
      if(dareme.finished) navigate(`/dareme/result/${daremeId}`) 
      if(dareme.owner._id === user.id) navigate(`/dareme/details/${daremeId}`) 
    }
  }, [dareme, user, navigate])
  useEffect(() => { 
    window.scrollTo(0, 0)
    dispatch(daremeAction.getDareMeDetails(daremeId))
  }, [location, daremeId, dispatch])

  return (
    <div className="dareme-creator-wrapper">
      <div className="header-part">
        <div onClick={() => { navigate(`/dareme/details/${daremeId}`) }}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.DARE_CREATOR}</span></div>
        <div onClick={() => setOpenHint(!openHint)}><HelpIcon /></div>
      </div>
      <Hint
        style={{ left: "calc(100% - 336px)" }}
        open={openHint}
        exit={() => { setOpenHint(false); }}
        color="#059669"
        title={hints.title}
        context={hints.context}
      />
      {(dareme.owner && user) &&
        <>
          <Dialog
            display={openTopup}
            title={contexts.DIALOG.HEADER_TITLE.TOP_UP_NOW}
            exit={() => { setOpenTopup(false) }}
            wrapExit={() => { setOpenTopup(false) }}
            context={contexts.DIALOG.BODY_LETTER.TOP_UP_NOW}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.TOP_UP,
                handleClick: () => {
                  dispatch({ type: SET_CURRENT_DAREME, payload: daremeId });
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/dare/${daremeId}` });
                  navigate(`/myaccount/shop`);
                }
              }
            ]}
          />
          <Dialog
            title={contexts.DIALOG.HEADER_TITLE.I_DARE}
            display={openDare}
            exit={() => { setOpenDare(false) }}
            wrapExit={() => { setOpenDare(false) }}
            avatars={[
              dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}`,
              user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}`
            ]}
            context={`${dareme.title}\n\n${Number(amount)} ${contexts.DIALOG.BODY_LETTER.DONUTS_FOR} ${optionTitle}`}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                handleClick: () => { dispatch(daremeAction.dareCreator(dareme._id, optionTitle, Number(amount), navigate)) }
              }
            ]}
          />
          <div className='dare-creator-wrapper'>
            <div className="dare-creator-videoCardDesktop">
              <VideoCardDesktop
                url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
                sizeType={dareme.sizeType}
                coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
              />
              <AvatarLink
                avatar={dareme.owner.avatar}
                username={dareme.owner.name}
                ownerId={dareme.owner._id}
                handleAvatar={() => { navigate(`/${dareme.owner.personalisedUrl}`) }}
                daremeId={dareme._id}
              />
            </div>
            <div className="dare-creator-info">
              <div className="dare-creator-details">
                <div className="avatars">
                  <div className="owner-avatar">
                    <Avatar
                      avatar={dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}`}
                      size="web"
                    />
                  </div>
                  <div className="user-avatar">
                    <Avatar
                      avatar={user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}`}
                      size="web"
                    />
                  </div>
                </div>
                <div className="dare-option-title">
                  <Input
                    placeholder={contexts.DARE_CREATOR.WHAT_DO_YOU_PROPOSE}
                    label={contexts.DARE_CREATOR.TELL_ABOUT_IDEA}
                    setTitle={setOptionTitle}
                    type="input"
                    title={optionTitle}
                    wordCount={60}
                    setFocus={() => { }}
                  />
                </div>
                <div className="dare-donut-amount">
                  <CreatoCoinIcon color="#EFA058" />
                  &nbsp;{contexts.DARE_CREATOR.SUPPORT_WITH_DONUTS}
                </div>
                <div className="dare-donuts-count">
                  <Input
                    placeholder={contexts.DARE_CREATOR.EX_50DONUTS}
                    isNumber={true}
                    setTitle={setAmount}
                    type="input"
                    title={amount}
                    setFocus={() => { }}
                  />
                </div>
                <div className="dare-creator-description">
                  {contexts.DARE_CREATOR.DARE_LETTER}
                </div>
                <div className="dare-category-btn" onClick={() => { dareCreator() }}>
                  <ContainerBtn
                    text={contexts.DARE_CREATOR.DARE_CREATOR_BTN}
                    styleType="fill"
                    disabled={!checkInputs()}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default DareCreator
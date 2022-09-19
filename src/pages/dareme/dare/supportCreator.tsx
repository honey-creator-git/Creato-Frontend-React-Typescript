import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { daremeAction } from "../../../redux/actions/daremeActions";
import { SET_CURRENT_DAREME, SET_DIALOG_STATE, SET_PREVIOUS_ROUTE } from "../../../redux/types";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
import AvatarLink from "../../../components/dareme/avatarLink";
import Title from "../../../components/general/title";
import DareOption from "../../../components/general/dareOption";
import Dialog from "../../../components/general/dialog";
import ContainerBtn from "../../../components/general/containerBtn";
import Gif from "../../../components/general/gif";
import CONSTANT from "../../../constants/constant";
import { LanguageContext } from "../../../routes/authRoute";
import { HotIcon, LightbulbIcon } from "../../../assets/svg";
import SignDialog from "../../../components/general/signDialog";
import VoteSuperfanGif from '../../../assets/img/vote_superfan.gif';
import '../../../assets/styles/dareme/dare/supportCreatorStyle.scss';

const SupportCreator = () => {
  const { daremeId, optionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const daremeState = useSelector((state: any) => state.dareme)
  const userState = useSelector((state: any) => state.auth)
  const dlgState = useSelector((state: any) => state.load.dlgState)
  const { dareme } = daremeState
  const { user } = userState
  const [option, setOption] = useState<any>(null)

  const [isTopUp, setIsTopUp] = useState(false)
  const [isSuperFan, setIsSuperFan] = useState(false)
  const [isCopyLink, setIsCopyLink] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isSignIn, setIsSignIn] = useState(false)

  const [voteSuperfanGif, setVoteSuperfanGif] = useState(false)
  const [voted, setVoted] = useState(false)
  const contexts = useContext(LanguageContext)

  const voteDonuts = (user: any, reward: any) => {
    if (user) {
      const amount = reward ? reward : 50
      if (amount > user.wallet) setIsTopUp(true)
      else setIsSuperFan(true)
    } else setIsSignIn(true)
  }

  const checkVoted = () => {
    if (dareme.owner && user) {
      for (let i = 0; i < dareme.options.length; i++) {
        if (dareme.options[i].option.writer._id === user.id) return true
        for (let j = 0; j < dareme.options[i].option.voteInfo.length; j++)
          if (user.id === dareme.options[i].option.voteInfo[j].voter)
            if (dareme.options[i].option.voteInfo[j].donuts > 0) return true
      }
      return false
    } else return false
  }

  useEffect(() => {
    if (dareme.owner) {
      const filters = dareme.options.filter((option: any) => option.option._id === optionId)
      if (filters.length) setOption(filters[0].option)
      setVoted(checkVoted())
    }
  }, [dareme, optionId])
  useEffect(() => {
    dispatch(daremeAction.getDareMeDetails(daremeId))
    dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
  }, [dispatch, daremeId])

  useEffect(() => {
    if (dlgState.type === 'vote_superfan' && dlgState.state === true) {
      setIsCopyLink(true)
      setVoteSuperfanGif(true)
    }
  }, [dlgState])
  useEffect(() => {
    if (dareme.owner && dareme.finished) navigate(`/dareme/result/${daremeId}`)
    if (dareme.owner && user && dareme.owner._id === user.id) navigate(`/${user.personalisedUrl}`)
  }, [dareme, user, navigate, daremeId])
  useEffect(() => { if (voteSuperfanGif) setTimeout(() => { setVoteSuperfanGif(false) }, 3500) }, [voteSuperfanGif])
  useEffect(() => { window.scrollTo(0, 0) }, [location])

  return (
    <div>
      {voteSuperfanGif && <Gif gif={VoteSuperfanGif} />}
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.DAREME_OPTION} back={() => { navigate(`/dareme/details/${daremeId}`) }} />
      </div>
      {(option && dareme.owner) &&
        <>
          <SignDialog
            display={isSignIn}
            exit={() => { setIsSignIn(false) }}
            wrapExit={() => { setIsSignIn(false) }}
          />
          <Dialog
            display={isTopUp}
            title={contexts.DIALOG.HEADER_TITLE.TOP_UP_NOW}
            exit={() => { setIsTopUp(false) }}
            wrapExit={() => { setIsTopUp(false) }}
            context={contexts.DIALOG.BODY_LETTER.TOP_UP_NOW}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.TOP_UP,
                handleClick: () => {
                  dispatch({ type: SET_CURRENT_DAREME, payload: daremeId });
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/${daremeId}/support/${optionId}` });
                  navigate(`/myaccount/shop`);
                }
              }
            ]}
          />
          <Dialog
            display={isSuperFan}
            title={contexts.DIALOG.HEADER_TITLE.VOTE_SUPER}
            avatars={[
              dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}` : ""
            ]}
            exit={() => { setIsSuperFan(false) }}
            wrapExit={() => { setIsSuperFan(false) }}
            context={dareme.reward + contexts.DIALOG.BODY_LETTER.VOTE_SUPER + option.title}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                handleClick: () => {
                  dispatch(daremeAction.supportCreator(daremeId, optionId, dareme.reward, dareme.reward))
                  setIsSuperFan(false)
                  setIsCopied(false)
                }
              }
            ]}
          />
          <Dialog
            display={isCopyLink}
            title={contexts.DIALOG.HEADER_TITLE.HAVE_DARED}
            avatars={[
              dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}` : ""
            ]}
            exit={() => {
              setIsCopyLink(false);
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
              setVoteSuperfanGif(false)
            }}
            wrapExit={() => {
              setIsCopyLink(false);
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
              setVoteSuperfanGif(false)
            }}
            context={contexts.DIALOG.BODY_LETTER.HAVE_DARED + dareme.owner.name + contexts.DIALOG.BODY_LETTER.ON_PART + dareme.title}
            buttons={[
              {
                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}`)
                  setIsCopied(true)
                  setTimeout(() => { setIsCopied(false) }, 2500)
                }
              }
            ]}
            social
            ownerName={dareme.owner.name}
            daremeId={daremeId}
            shareType={"vote"}
            daremeTitle={dareme.title}
          />
          <div className="dareme-support">
            <div className="dareme-support-videoCardDesktop">
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
            <div>
              <div className="dareme-support-information">
                <div className="dareme-support-fun">
                  <div className="header-choosen">
                    You have chosen:
                  </div>
                  <div className="support-option">
                    <DareOption
                      donuts={option.donuts}
                      voters={voted ? option.voters : undefined}
                      dareTitle={option.title}
                      username={option.writer.name}
                      disabled={false}
                      handleSubmit={() => { }}
                      canVote={true}
                      leading={false}
                    />
                  </div>
                  <div className="number-of-donuts">
                    <span></span>Pick One Below<span></span>
                  </div>
                  <div className="support-fun" onClick={() => { voteDonuts(user, dareme.reward) }}>
                    <ContainerBtn text={`Donut x${dareme.reward} (SuperFan!)`} styleType="fill"
                      icon={[<HotIcon color="white" />, <HotIcon color="white" />]}
                    />
                  </div>
                  <div className="support-letter">
                    <span>SuperFans:</span>
                  </div>
                  <div className="support-explain">
                    <span>
                      Support creators by giving specific amount of donut and get exclusive content.
                    </span>
                  </div>
                  <div className="support-fun" onClick={() => {
                    if (user) navigate('/dareme/' + daremeId + '/support/' + optionId + '/wish')
                    else setIsSignIn(true)
                  }}>
                    <ContainerBtn text={'Donuts as you like!'} styleType="fill" color="error"
                      icon={[<LightbulbIcon color="white" />, <LightbulbIcon color="white" />]}
                    />
                  </div>
                  <div className="support-letter">
                    <span></span>
                  </div>
                  <div className="support-explain">
                    <span>
                      Support any number of Donuts as you wish!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default SupportCreator;
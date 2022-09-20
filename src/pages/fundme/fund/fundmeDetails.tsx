import { useEffect, useState, useContext, useLayoutEffect } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Avatar from "../../../components/general/avatar"
import Dialog from "../../../components/general/dialog"
import SignDialog from "../../../components/general/signDialog"
import Gif from "../../../components/general/gif"
import ContainerBtn from "../../../components/general/containerBtn"
import TeaserCard from "../../../components/general/TeaserCard"
import TeaserCardPopUp from "../../../components/general/TeaserCardPopUp"
import { fundmeAction } from "../../../redux/actions/fundmeActions"
import { LanguageContext } from "../../../routes/authRoute"
import { BackIcon, ShareIcon, ClockIcon, CreatoCoinIcon, NoOfPeopleIcon, RewardIcon, PlayIcon, HotIcon, LightbulbIcon } from "../../../assets/svg"
import { SET_PREVIOUS_ROUTE, SET_DIALOG_STATE } from "../../../redux/types"
import CONSTANT from "../../../constants/constant"
import VoteSuperfanGif from '../../../assets/img/vote_superfan.gif'
import "../../../assets/styles/fundme/fund/FundMeDetailsStyle.scss"


const useWindowSize = () => {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    const updateSize = () => setSize(window.innerWidth)
    window.addEventListener("resize", updateSize)
    updateSize()
    return () => window.removeEventListener("resize", updateSize)
  }, [])
  return size
}

const FundMeDetails = (props: any) => {
  const width = useWindowSize()
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const contexts = useContext(LanguageContext)
  const { fundmeId } = useParams()
  const fundmeState = useSelector((state: any) => state.fundme)
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)
  const { fundme } = fundmeState
  const { user } = userState
  const { prevRoute, dlgState } = loadState
  const [time, setTime] = useState(0)
  const [flag, setFlag] = useState(false)
  const [timerId, setTimerId] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [voteSuperfanGif, setVoteSuperfanGif] = useState(false)

  /// Dialog
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openTeaserPopup, setOpenTeaserPopup] = useState(false)
  const [openCopyLink, setOpenCopyLink] = useState(false)
  const [openSuperFan, setOpenSuperFan] = useState(false)
  const [openTopUp, setOpenTopUp] = useState(false)
  const [openFundCopyLink, setOpenFundCopyLink] = useState(false)

  const displayTime = (left: any) => {
    let res: any
    if (left <= 0) {
      const passTime = Math.abs(left)
      res = contexts.ITEM_CARD.ENDED
      if (Math.floor(passTime / (3600 * 24 * 30)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24 * 30)) + '' + (Math.floor(passTime / (3600 * 24 * 30)) === 1 ? contexts.ITEM_CARD.MONTH : contexts.ITEM_CARD.MONTHS)
      else if (Math.floor(passTime / (3600 * 24 * 7)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24 * 7)) + '' + (Math.floor(passTime / (3600 * 24 * 7)) === 1 ? contexts.ITEM_CARD.WEEK : contexts.ITEM_CARD.WEEKS)
      else if (Math.floor(passTime / (3600 * 24)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24)) + '' + (Math.floor(passTime / (3600 * 24)) === 1 ? contexts.ITEM_CARD.DAY : contexts.ITEM_CARD.DAYS)
      else if (Math.floor(passTime / 3600) >= 1) res = res + ' ' + Math.floor(passTime / 3600) + '' + (Math.floor(passTime / 3600) === 1 ? contexts.ITEM_CARD.HOUR : contexts.ITEM_CARD.HOURS)
      else if (Math.floor(passTime / 60) > 0) res = res + ' ' + Math.floor(passTime / 60) + '' + (Math.floor(passTime / 60) === 1 ? contexts.ITEM_CARD.MIN : contexts.ITEM_CARD.MINS)
      if (Math.floor(passTime / 60) > 0) res = res + contexts.ITEM_CARD.AGO
    } else {
      let hours: any = Math.floor(left / 3600)
      let mins = Math.floor((left % 3600) / 60)
      let secs = Math.floor((left % 3600) % 60)
      res = (hours < 10 ? `0${hours}` : hours) + ' : ' + (mins < 10 ? `0${mins}` : mins) + ' : ' + (secs < 10 ? `0${secs}` : secs)
    }
    return res
  }

  const displayProcess = (length: any) => {
    const interval = fundme.goal ? (Number(fundme.goal) / 20).toFixed(1) : 0
    const count = fundme.goal ? Number(Math.floor(Number(fundme.wallet) / Number(interval))) : 0
    const width = fundme.wallet < interval ? Math.floor(Number(interval) / Number(fundme.goal) * length) : Math.floor(Number(interval) * count / Number(fundme.goal) * length)
    return width
  }

  const fund = (donuts: any) => {
    if (user) {
      if (user.id === fundme.owner._id) {
        setCopied(false)
        setOpenCopyLink(true)
      } else {
        if (user.wallet < donuts) setOpenTopUp(true)
        else setOpenSuperFan(true)
      }
    } else setOpenSignIn(true)
  }

  useEffect(() => {
    if (dlgState.type === 'vote_superfan' && dlgState.state === true) {
      setOpenFundCopyLink(true)
      setVoteSuperfanGif(true)
    }
  }, [dlgState])

  useEffect(() => {
    if (fundme.owner) {
      setTime(fundme.time)
      setFlag(true)
    }
  }, [fundme])
  useEffect(() => {
    if (time < -10) navigate(`/fundme/result/${fundmeId}`)
    if (flag) {
      if (timerId) clearInterval(timerId)
      let id = setInterval(() => { setTime((time: any) => time - 1) }, 1000)
      setTimerId(id)
    }
  }, [time, flag])
  useEffect(() => {
    dispatch(fundmeAction.getFundMeDetails(fundmeId))
    window.scrollTo(0, 0)
  }, [location, fundmeId, dispatch])
  useEffect(() => { if (voteSuperfanGif) setTimeout(() => { setVoteSuperfanGif(false) }, 3500) }, [voteSuperfanGif])

  return (
    <div className="fundme-details-wrapper">
      <div className="header-part">
        <div onClick={() => { navigate(prevRoute) }}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.FUNDME_DETAIL}</span></div>
        <div><ShareIcon color="black" /></div>
      </div>
      {voteSuperfanGif && <Gif gif={VoteSuperfanGif} />}
      {fundme.owner &&
        <div>
          <TeaserCardPopUp
            display={openTeaserPopup}
            teaser={`${CONSTANT.SERVER_URL}/${fundme.teaser}`}
            size={fundme.sizeType}
            exit={() => { setOpenTeaserPopup(false) }}
          />
          <SignDialog
            display={openSignIn}
            exit={() => { setOpenSignIn(false) }}
            wrapExit={() => { setOpenSignIn(false) }}
          />
          <Dialog
            display={openSuperFan}
            title={"SuperFan😍"}
            avatars={[
              fundme.owner.avatar.indexOf('uploads') === -1 ? fundme.owner.avatar : `${CONSTANT.SERVER_URL}/${fundme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}` : ""
            ]}
            exit={() => { setOpenSuperFan(false) }}
            wrapExit={() => { setOpenSuperFan(false) }}
            context={`${fundme.reward} ${contexts.FUNDME_LETTER.DONUTS_FOR}\n${fundme.title}`}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                handleClick: () => {
                  setOpenSuperFan(false)
                  dispatch(fundmeAction.fundCreator(fundmeId, fundme.reward, fundme.reward))
                  setCopied(false)
                }
              }
            ]}
          />
          <Dialog
            display={openFundCopyLink}
            title={contexts.DIALOG.HEADER_TITLE.HAVE_FUNDED}
            avatars={[
              fundme.owner.avatar.indexOf('uploads') === -1 ? fundme.owner.avatar : `${CONSTANT.SERVER_URL}/${fundme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}` : ""
            ]}
            exit={() => {
              setOpenFundCopyLink(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
              setVoteSuperfanGif(false)
            }}
            wrapExit={() => {
              setOpenFundCopyLink(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
              setVoteSuperfanGif(false)
            }}
            context={`Congrats!\n${fundme.owner.name} received your Donut support!`}
            buttons={[
              {
                text: copied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/fundme/details/${fundmeId}`);
                  setCopied(true)
                  setTimeout(() => { setCopied(false) }, 2500)
                }
              }
            ]}
            social
            isFundme={true}
            ownerName={fundme.owner.name}
            daremeId={fundmeId}
            daremeTitle={fundme.title}
          />
          <Dialog
            display={openTopUp}
            title={contexts.DIALOG.HEADER_TITLE.TOP_UP_NOW}
            exit={() => { setOpenTopUp(false) }}
            wrapExit={() => { setOpenTopUp(false) }}
            context={contexts.DIALOG.BODY_LETTER.TOP_UP_NOW}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.TOP_UP,
                handleClick: () => {
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/fundme/details/${fundmeId}` })
                  navigate(`/myaccount/shop`)
                }
              }
            ]}
          />
          <Dialog
            display={openCopyLink}
            title="Oops!"
            exit={() => { setOpenCopyLink(false) }}
            wrapExit={() => { setOpenCopyLink(false) }}
            context={"Tell your fans about\nyour FundMe 📣"}
            buttons={[
              {
                text: copied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/fundme/details/${fundmeId}`)
                  setCopied(true)
                  setTimeout(() => { setCopied(false) }, 2500)
                }
              }
            ]}
            social
            daremeId={fundmeId}
            ownerName={fundme.owner.name}
            daremeTitle={fundme.title}
            isFundme={true}
          />
          <div className="details-part">
            <div className="fundme-info">
              <div className="fundme-detail">
                <div className="basic-info">
                  <div className="profile-name">
                    <div className="profile">
                      <Avatar
                        size="mobile"
                        avatar={fundme.owner.avatar.indexOf('uploads') === -1 ? fundme.owner.avatar : `${CONSTANT.SERVER_URL}/${fundme.owner.avatar}`}
                        handleClick={() => { navigate(`/${fundme.owner.personalisedUrl}`) }}
                      />
                    </div>
                    <div className="name">
                      <span>{fundme.owner.name}</span>
                    </div>
                  </div>
                  <div className="title-result">
                    <div className="type-lefttime">
                      <div className="item-type">
                        <CreatoCoinIcon color={'#14BDC7'} width={25} />
                        <span>FundMe</span>
                      </div>
                      <div className="left-time">
                        <ClockIcon color="#DE5A67" width={18} height={18} />&nbsp;&nbsp;<span>{displayTime(time)}</span>
                      </div>
                    </div>
                    <div className="title">
                      <span>{fundme.title}</span>
                      <div className="play-icon" onClick={() => { setOpenTeaserPopup(true) }}>
                        <PlayIcon color="white" />
                      </div>
                    </div>
                    <div className="result">
                      <CreatoCoinIcon color={'#7E7875'} width={20} />
                      <span>{fundme.wallet.toLocaleString()}</span>&nbsp;&nbsp;
                      <NoOfPeopleIcon color={'#7E7875'} width={20} />
                      <span>{fundme.voteInfo.length.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="reward-info">
                  <div className="reward-title">
                    <RewardIcon color="white" />&nbsp;&nbsp;<span>Reward for SuperFans</span>
                  </div>
                  <div className="divider"></div>
                  <div className="reward-text">
                    <span>{fundme.rewardText}</span>
                  </div>
                </div>
              </div>
              <div className="teaser-part">
                <TeaserCard cover={`${CONSTANT.SERVER_URL}/${fundme.cover}`} teaser={`${CONSTANT.SERVER_URL}/${fundme.teaser}`} size={fundme.sizeType} type="fundme" border={"10px"} />
              </div>
            </div>
            <div className="funding-goal">
              <div className="title">
                <CreatoCoinIcon color="#EFA058" />
                <label>{fundme.wallet < fundme.goal ? contexts.CREATE_FUNDME_LETTER.FUNDING_GOAL : contexts.CREATE_FUNDME_LETTER.GOAL_REACHED}</label>
              </div>
              <div className="process-bar">
                <div className="process-value" style={{ width: fundme.wallet < fundme.goal ? `${displayProcess(width > 680 ? 540 : 270)}px` : `${width > 680 ? 540 : 270}px` }}></div>
              </div>
              <div className="donuts-count">
                <span><span className={fundme.wallet >= fundme.goal ? "over-donuts" : ""}>{fundme.wallet.toLocaleString()}</span> / {fundme.goal.toLocaleString()} {contexts.GENERAL_LETTER.DONUTS}</span>
              </div>
            </div>

            <div className="support-options">
              <div className="support-header-part">
                <div className="support-divider"></div>
                <div className="support-header">
                  Pick One Below
                </div>
                <div className="support-divider"></div>
              </div>
              <div className="support-buttons">
                <div className="support-button">
                  <div className="support-fun" onClick={() => { fund(fundme.reward) }}>
                    <ContainerBtn text={`Donut x${fundme.reward} (SuperFan!)`} styleType="fill"
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
                </div>
                <div className="support-button">
                  <div className="support-fun" onClick={() => {
                    if (user) {
                      if (user.id === fundme.owner._id) {
                        setCopied(false)
                        setOpenCopyLink(true)
                      } else navigate('/fundme/details/' + fundmeId + '/wish')
                    } else setOpenSignIn(true)
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
        </div>
      }
    </div>
  )
}

export default FundMeDetails
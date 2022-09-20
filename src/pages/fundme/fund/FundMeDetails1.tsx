import { useEffect, useState, useContext } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Avatar from "../../../components/general/avatar"
import Dialog from "../../../components/general/dialog"
import SignDialog from "../../../components/general/signDialog"
import ContainerBtn from "../../../components/general/containerBtn"
import TeaserCard from "../../../components/general/TeaserCard"
import TeaserCardPopUp from "../../../components/general/TeaserCardPopUp"
import { fundmeAction } from "../../../redux/actions/fundmeActions"
import { LanguageContext } from "../../../routes/authRoute"
import { BackIcon, ShareIcon, ClockIcon, CreatoCoinIcon, NoOfPeopleIcon, RewardIcon, PlayIcon, HotIcon, LightbulbIcon } from "../../../assets/svg"
import CONSTANT from "../../../constants/constant"
import "../../../assets/styles/fundme/fund/FundMeDetailsStyle1.scss"

const FundMeDetails = (props: any) => {
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
  const { prevRoute } = loadState
  const [time, setTime] = useState(0)
  const [flag, setFlag] = useState(false)
  const [timerId, setTimerId] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  /// Dialog
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openTeaserPopup, setOpenTeaserPopup] = useState(false)
  const [openCopyLink, setOpenCopyLink] = useState(false)
  const [openRequest, setOpenRequest] = useState(false)
  const [openAccept, setOpenAccept] = useState(false)
  const [openDecline, setOpenDecline] = useState(false)

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

  const supportCreator = (optionId: any) => {
    if (user && user.id === fundme.owner._id) {
      setCopied(false)
      setOpenCopyLink(true)
    }
    // } else navigate(`/dareme/${fundmeid}/support/${optionId}`)
  }

  useEffect(() => {
    if (fundme.owner) {
      setTime(fundme.time)
      setFlag(true)
    }
  }, [fundme])
  useEffect(() => {
    if (time < -10) navigate(`/dareme/result/${fundmeId}`)
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

  return (
    <div className="fundme-details-wrapper">
      <div className="header-part">
        <div onClick={() => { navigate(prevRoute) }}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.FUNDME_DETAIL}</span></div>
        <div><ShareIcon color="black" /></div>
      </div>
      {fundme.owner &&
        <div>
          <TeaserCardPopUp
            display={openTeaserPopup}
            teaser={`${CONSTANT.SERVER_URL}/${fundme.teaser}`}
            size={fundme.sizeType}
            exit={() => { setOpenTeaserPopup(false) }}
          />
          <Dialog
            display={openCopyLink}
            title="Oops!"
            exit={() => { setOpenCopyLink(false) }}
            wrapExit={() => { setOpenCopyLink(false) }}
            context={contexts.DIALOG.BODY_LETTER.OWNER_VOTE}
            buttons={[
              {
                text: copied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/details/${fundmeId}`)
                  setCopied(true)
                  setTimeout(() => { setCopied(false) }, 2500)
                }
              }
            ]}
            social
            daremeId={fundmeId}
            ownerName={fundme.owner.name}
          />
          <SignDialog
            display={openSignIn}
            exit={() => { setOpenSignIn(false) }}
            wrapExit={() => { setOpenSignIn(false) }}
          />
          <Dialog
            title={contexts.DIALOG.HEADER_TITLE.ACCEPT_REQUEST}
            display={openRequest}
            exit={() => { setOpenRequest(false) }}
            wrapExit={() => { setOpenRequest(false) }}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.DECLINE,
                handleClick: () => {
                  setOpenRequest(false)
                  setOpenDecline(true)
                  setTimeout(() => setOpenDecline(false), 2000)
                  // dispatch(daremeAction.declineDareOption(daremeId, optionId))
                }
              },
              {
                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                handleClick: () => {
                  setOpenRequest(false)
                  setOpenAccept(true)
                  setCopied(false)
                  // dispatch(daremeAction.acceptDareOption(daremeId, optionId))
                }
              }
            ]}
            context={contexts.DIALOG.BODY_LETTER.ACCEPT_REQUEST}
          />
          <Dialog
            display={openDecline}
            wrapExit={() => { setOpenDecline(false) }}
            title={contexts.DIALOG.HEADER_TITLE.DARE_DECLIEND}
            context={contexts.DIALOG.BODY_LETTER.DARE_DECLINED}
          />
          <Dialog
            display={openAccept}
            wrapExit={() => { setOpenAccept(false); }}
            title={contexts.DIALOG.HEADER_TITLE.DARE_ACCEPTED}
            context={contexts.DIALOG.BODY_LETTER.DARE_ACCEPTED}
            buttons={[
              {
                text: copied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  // navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}`)
                  setCopied(true)
                  setTimeout(() => { setCopied(false) }, 2500)
                }
              }
            ]}
            social
            ownerName={fundme.owner.name}
          // daremeId={daremeId}
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
                <div className="process-value" style={{ width: fundme.wallet < fundme.goal ? `${30}px` : '330px' }}></div>
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
                  <div className="support-fun" onClick={() => { }}>
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
                    // if (user) navigate('/dareme/' + daremeId + '/support/' + optionId + '/wish')
                    // else setIsSignIn(true)
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
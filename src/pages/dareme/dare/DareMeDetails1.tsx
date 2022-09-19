import { useEffect, useState, useContext } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import DareOption from "../../../components/general/dareOption"
import Avatar from "../../../components/general/avatar"
import Dialog from "../../../components/general/dialog"
import SignDialog from "../../../components/general/signDialog"
import TeaserCard from "../../../components/general/TeaserCard"
import TeaserCardPopUp from "../../../components/general/TeaserCardPopUp"
import { daremeAction } from "../../../redux/actions/daremeActions"
import { LanguageContext } from "../../../routes/authRoute"
import { BackIcon, ShareIcon, ClockIcon, CreatoCoinIcon, NoOfPeopleIcon, RewardIcon, PlayIcon, LightbulbIcon } from "../../../assets/svg"
import CONSTANT from "../../../constants/constant"
import "../../../assets/styles/dareme/dare/DareMeDetailsStyle1.scss"

const DareMeDetails = (props: any) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const contexts = useContext(LanguageContext)
  const { daremeId } = useParams()
  const daremeState = useSelector((state: any) => state.dareme)
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)
  const { dareme } = daremeState
  const { user } = userState
  const { prevRoute } = loadState
  const [time, setTime] = useState(0)
  const [flag, setFlag] = useState(false)
  const [timerId, setTimerId] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [optionId, setOptionId] = useState<any>(null)

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

  const canSeeResult = () => {
    if (user && dareme.owner) {
      if (user.id === dareme.owner._id || user.role === "ADMIN") return true
      for (var i = 0; i < dareme.options.length; i++) {
        if (dareme.options[i].option.writer._id === user.id) return true
        for (var j = 0; j < dareme.options[i].option.voteInfo.length; j++)
          if (dareme.options[i].option.voteInfo[j].voter === user.id) return true
      }
      return false
    } else return false
  }

  const supportCreator = (optionId: any) => {
    if (user && user.id === dareme.owner._id) {
      setCopied(false)
      setOpenCopyLink(true)
    } else navigate(`/dareme/${daremeId}/support/${optionId}`)
  }

  useEffect(() => {
    if (dareme.owner) {
      setTime(dareme.time)
      setFlag(true)
      setShowResult(canSeeResult())
    }
  }, [dareme])
  useEffect(() => {
    if (time < -10) navigate(`/dareme/result/${daremeId}`)
    if (flag) {
      if (timerId) clearInterval(timerId)
      let id = setInterval(() => { setTime((time: any) => time - 1) }, 1000)
      setTimerId(id)
    }
  }, [time, flag])
  useEffect(() => { 
    dispatch(daremeAction.getDareMeDetails(daremeId))
    window.scrollTo(0, 0)
  }, [location, daremeId, dispatch])

  return (
    <div className="dareme-details-wrapper">
      <div className="header-part">
        <div onClick={() => { navigate(prevRoute) }}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.DAREME_DETAILS}</span></div>
        <div><ShareIcon color="black" /></div>
      </div>
      {dareme.owner &&
        <div>
          <TeaserCardPopUp
            display={openTeaserPopup}
            teaser={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
            size={dareme.sizeType}
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
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}`)
                  setCopied(true)
                  setTimeout(() => { setCopied(false) }, 2500)
                }
              }
            ]}
            social
            daremeId={daremeId}
            ownerName={dareme.owner.name}
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
                    dispatch(daremeAction.declineDareOption(daremeId, optionId))
                  }
                },
                {
                  text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                  handleClick: () => {
                    setOpenRequest(false)
                    setOpenAccept(true)
                    setCopied(false)
                    dispatch(daremeAction.acceptDareOption(daremeId, optionId))
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
                    navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}`)
                    setCopied(true)
                    setTimeout(() => { setCopied(false) }, 2500)
                  }
                }
              ]}
              social
              ownerName={dareme.owner.name}
              daremeId={daremeId}
            />
          <div className="details-part">
            <div className="dareme-info">
              <div className="dareme-detail">
                <div className="basic-info">
                  <div className="profile-name">
                    <div className="profile">
                      <Avatar
                        size="mobile"
                        avatar={dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}`}
                        handleClick={() => { navigate(`/${dareme.owner.personalisedUrl}`) }}
                      />
                    </div>
                    <div className="name">
                      <span>{dareme.owner.name}</span>
                    </div>
                  </div>
                  <div className="title-result">
                    <div className="type-lefttime">
                      <div className="item-type">
                        <CreatoCoinIcon color={'#EA8426'} width={25} />
                        <span>DareMe</span>
                      </div>
                      <div className="left-time">
                        <ClockIcon color="#DE5A67" width={18} height={18} />&nbsp;&nbsp;<span>{displayTime(time)}</span>
                      </div>
                    </div>
                    <div className="title">
                      <span>{dareme.title}</span>
                      <div className="play-icon" onClick={() => { setOpenTeaserPopup(true) }}>
                        <PlayIcon color="white" />
                      </div>
                    </div>
                    <div className="result">
                      <CreatoCoinIcon color={'#7E7875'} width={20} />
                      <span>{dareme.donuts.toLocaleString()}</span>&nbsp;&nbsp;
                      <NoOfPeopleIcon color={'#7E7875'} width={20} />
                      <span>{dareme.voteInfo.length.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="reward-info">
                  <div className="reward-title">
                    <RewardIcon color="white" />&nbsp;&nbsp;<span>Reward for SuperFans</span>
                  </div>
                  <div className="divider"></div>
                  <div className="reward-text">
                    <span>{dareme.rewardText}</span>
                  </div>
                </div>
              </div>
              <div className="teaser-part">
                <TeaserCard cover={`${CONSTANT.SERVER_URL}/${dareme.cover}`} teaser={`${CONSTANT.SERVER_URL}/${dareme.teaser}`} size={dareme.sizeType} type="dareme" border={"10px"} />
              </div>
            </div>
            <div className="option-info">
              <div className="option-header-part">
                <div className="option-divider"></div>
                <div className="option-header">
                  Manage Dare Option
                </div>
                <div className="option-divider"></div>
              </div>
              <div className="option-type-header">
                <span style={{ color: '#EFA058' }}>Available Dare Option</span>
              </div>
              <div className="options">
                <div className="options-container">
                  {dareme.options.filter((option: any) => option.option.status === 1).sort((first: any, second: any) => {
                    if (showResult) return first.option.donuts > second.option.donuts ? -1 : first.option.donuts < second.option.donuts ? 1 :
                      first.option.date < second.option.date ? 1 : first.option.date > second.option.date ? -1 : 0
                    else return 0
                  }).map((option: any, index: any) => (
                    <div className="option" key={index}>
                      <DareOption
                        dareTitle={option.option.title}
                        donuts={showResult ? option.option.donuts : undefined}
                        voters={showResult ? option.option.voters : undefined}
                        canVote={true}
                        disabled={false}
                        username={option.option.writer.name}
                        leading={index !== 0 ? false : showResult}
                        handleSubmit={() => { supportCreator(option.option._id) }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="idea-button" onClick={() => {
                if (user) navigate(`/dareme/dare/${daremeId}`)
                else setOpenSignIn(true)
              }}>
                <LightbulbIcon color="white" />&nbsp;&nbsp;<span>{contexts.DAREME_DETAILS.HAVE_IDEA}</span>
              </div>
              {(user && dareme.owner._id === user.id) &&
                <div>
                  <div className="option-type-header">
                    <span style={{ color: '#E17253' }}>New Dare request</span>
                  </div>
                  <div className="sub-text">
                    <span style={{ color: '#D94E27' }}>Tap to accept or reject Dare requests.</span>
                    <span style={{ color: 'black' }}>You can accept up to request(s) in total.</span>
                  </div>
                  <div className="options">
                    {dareme.options.filter((option: any) => option.option.status === 0).length > 0 ?
                      <div className="options-container">
                        {dareme.options.filter((option: any) => option.option.status === 0).sort((first: any, second: any) => {
                          return first.option.date < second.option.date ? 1 : first.option.date > second.option.date ? -1 : 0
                        }).map((option: any, index: any) => (
                          <div className="option" key={index}>
                            <DareOption
                              dareTitle={option.option.title}
                              donuts={option.option.donuts}
                              canVote={false}
                              disabled={false}
                              username={option.option.writer.name}
                              leading={true}
                              handleSubmit={() => { 
                                setOptionId(option.option._id)
                                setOpenRequest(true)
                              }}
                            />
                          </div>
                        ))}
                      </div> :
                      <div className="empty-letter">
                        <span>No dare requests yet.</span>
                      </div>
                    }
                  </div>
                  {dareme.options.filter((option: any) => option.option.status === -1).length > 0 &&
                    <>
                      <div className="option-type-header">
                        <span style={{ color: '#D6D5CC' }}>Declined Dare request</span>
                      </div>
                      <div className="options">
                        <div className="options-container">
                          {dareme.options.filter((option: any) => option.option.status === -1).map((option: any, index: any) => (
                            <div className="option" key={index}>
                              <DareOption
                                dareTitle={option.option.title}
                                donuts={option.option.donuts}
                                canVote={false}
                                disabled={true}
                                username={option.option.writer.name}
                                leading={false}
                                handleSubmit={() => { }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div >
  )
}

export default DareMeDetails
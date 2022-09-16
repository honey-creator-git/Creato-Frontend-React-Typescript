import { useEffect, useState, useContext } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import DareOption from "../../../components/general/dareOption"
import Avatar from "../../../components/general/avatar"
import TeaserCard from "../../../components/general/TeaserCard"
import { daremeAction } from "../../../redux/actions/daremeActions"
import { LanguageContext } from "../../../routes/authRoute"
import { BackIcon, ShareIcon, ClockIcon, CreatoCoinIcon, NoOfPeopleIcon, RewardIcon, PlayIcon } from "../../../assets/svg"
import CONSTANT from "../../../constants/constant"
import "../../../assets/styles/dareme/dare/DareMeDetailsStyle1.scss"

const DareMeDetails = (props: any) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const contexts = useContext(LanguageContext)
  const { daremeId } = useParams()
  const daremeState = useSelector((state: any) => state.dareme)
  const { dareme } = daremeState
  const [time, setTime] = useState(0)
  const [flag, setFlag] = useState(false)
  const [timerId, setTimerId] = useState<any>(null)

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

  useEffect(() => {
    if (dareme.owner) {
      setTime(dareme.time)
      setFlag(true)
    }
  }, [dareme])
  useEffect(() => {
    if (flag) {
      if (timerId) clearInterval(timerId)
      let id = setInterval(() => { setTime((time: any) => time - 1) }, 1000)
      setTimerId(id)
    }
  }, [time, flag])
  useEffect(() => { dispatch(daremeAction.getDareMeDetails(daremeId)) }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [location])

  return (
    <div className="dareme-details-wrapper">
      <div className="header-part">
        <div><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.DAREME_DETAILS}</span></div>
        <div><ShareIcon color="black" /></div>
      </div>
      {dareme.owner &&
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
                      <ClockIcon color="#DE5A67" width={18} height={18} />&nbsp;<span>{displayTime(time)}</span>
                    </div>
                  </div>
                  <div className="title">
                    <span>{dareme.title}</span> <div className="play-icon"><PlayIcon color="white"/></div>
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

          </div>
        </div>
      }
    </div>
  )
}

export default DareMeDetails
import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../general/button"
import TeaserCard from "../general/TeaserCard"
import { ClockIcon, CreatoCoinIcon, NoOfPeopleIcon, Dare1Icon } from "../../assets/svg"
import { LanguageContext } from "../../routes/authRoute"
import "../../assets/styles/profile/components/daremeProfileCardStyle.scss"

const DareMeProfileCard = (props: any) => {
  const { item, handleSubmit } = props
  const [time, setTime] = useState(item.leftTime)
  const [timerId, setTimerId] = useState<any>(null)
  const contexts = useContext(LanguageContext)
  const navigate = useNavigate()

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

  const navigation = (time: any) => {
    if (handleSubmit) handleSubmit()
    if (time > 0) navigate(`/dareme/details/${item.id}`)
    else navigate(`/dareme/result/${item.id}`)
  }

  useEffect(() => {
    if (timerId) clearInterval(timerId)
    let id = setInterval(() => { setTime((time: any) => time - 1) }, 1000)
    setTimerId(id)
  }, [item.leftTime])

  return (
    <div className="dareme-profile-card-wrapper"
      style={{ background: time > 0 ? 'linear-gradient(136.21deg, #FFDD94 0%, #FFC38D 27.6%, #FEB389 53.35%, #FDA384 74.31%, #F68B77 100%)' : 'white' }}
    >
      <div className="teaser-video">
        <TeaserCard cover={item.cover} teaser={item.teaser} size={item.size} type="dareme" border={"5px 5px 0px 0px"} />
      </div>
      <div className="time-info">
        <div className="item-type">
          <CreatoCoinIcon color={'#EA8426'} width={25} />
          <span>DareMe</span>
        </div>
        <div className="left-time">
          <ClockIcon color="#DE5A67" width={18} height={18} />&nbsp;<span>{displayTime(time)}</span>
        </div>
      </div>
      <div className="item-detail">
        <div className="item-title" style={time > 0 ? { color: 'white' } : { color: '#EFA058' }}>
          <span>{item.title}</span>
        </div>
        <div className="item-info">
          <div className="vote-info" style={time > 0 ? { color: 'white' } : { color: '#EFA058' }}>
            <CreatoCoinIcon color={time > 0 ? 'white' : '#EFA058'} width={20} />
            <span>{item.donuts.toLocaleString()}</span>&nbsp;&nbsp;&nbsp;
            <NoOfPeopleIcon color={time > 0 ? 'white' : '#EFA058'} width={20} />
            <span>{item.voters.toLocaleString()}</span>
          </div>
        </div>
        <Button
          color="primary"
          fillStyle={time > 0 ? "outline" : "fill"}
          shape="rounded"
          text={time > 0 ? contexts.ITEM_CARD.VOTE_NOW : contexts.ITEM_CARD.SEE_MORE}
          width={190}
          icon={time > 0 ? [<Dare1Icon color="#EFA058" />, <Dare1Icon color="white" />, <Dare1Icon color="white" />] : undefined}
          handleSubmit={() => { navigation(time) }}
        />
      </div>
    </div>
  )
}

export default DareMeProfileCard
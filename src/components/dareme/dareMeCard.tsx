import { useEffect, useState } from "react"
import Avatar from "../general/avatar"
import Button from "../general/button"
import { TipIcon, ClockIcon, CreatoCoinIcon, NoOfPeopleIcon, Dare1Icon } from "../../assets/svg"
import "../../assets/styles/dareme/components/dareMeCardStyle.scss"

const DareMeCard = (props: any) => {
  const { owner, item } = props
  const [time, setTime] = useState(item.lefTime)
  let timerId: any = null

  const displayTime = (left: any) => {
    if (left <= 0) {
      return 'Finished'
    } else {
      let hours: any = Math.floor(left / 3600)
      let mins = Math.floor((left % 3600) / 60)
      let secs = Math.floor((left % 3600) % 60)
      let res: any = (hours < 10 ? `0${hours}` : hours) + ' : ' + (mins < 10 ? `0${mins}` : mins) + ' : ' + (secs < 10 ? `0${secs}` : secs)
      return res
    }
  }

  useEffect(() => {
    if (item.lefTime > 0) {
      if (timerId) clearInterval(timerId)
      timerId = setInterval(() => { setTime((time: any) => time - 1) }, 1000)
    }
  }, [item.lefTime])

  useEffect(() => {
    if (time <= 0) if (timerId) clearInterval(timerId)
  }, [time])

  return (
    <div className="dareme-card-wrapper">
      <div className="top-info">
        <div className="owner-avatar">
          <Avatar
            size="mobile"
            avatar={owner.avatar}
          />
        </div>
        <div className="ownername-lefttime-tip" style={owner.tip ? { width: '220px' } : { width: '200px' }}>
          <div className="ownername-lefttime">
            <div className="owner-name">
              <span>{owner.name}</span>
            </div>
            <div className="left-time">
              <ClockIcon color="#DE5A67" width={18} height={18} />&nbsp;<span>{displayTime(time)}</span>
            </div>
          </div>
          {owner.tip ? <div className="tip-button"><TipIcon color="white" /></div> : <></>}
        </div>
      </div>
      <div className="teaser-video">

      </div>
      <div className="item-detail">
        <div className="item-title">
          <span>{item.title}</span>
        </div>
        <div className="item-info">
          <div className="item-type">
            <CreatoCoinIcon color="#EFA058" width={25} /><span>DareMe</span>
          </div>
          <div className="vote-info">
            <CreatoCoinIcon color="white" width={20} /><span>{item.donuts.toLocaleString()}</span>
            <NoOfPeopleIcon color="white" width={20} /><span>{item.voters.toLocaleString()}</span>
          </div>
        </div>
        <Button
          color="primary"
          fillStyle="outline"
          shape="rounded"
          text="Vote Now"
          width={190}
          icon={[<Dare1Icon color="#EFA058" />, <Dare1Icon color="white" />, <Dare1Icon color="white" />]}
          handleSubmit={() => { alert("ABC") }}
        />
      </div>
    </div>
  )
}

export default DareMeCard
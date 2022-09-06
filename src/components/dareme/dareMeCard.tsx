import { useEffect, useState, useRef, useContext } from "react"
import ReactPlayer from "react-player"
import Avatar from "../general/avatar"
import Button from "../general/button"
import {
  TipIcon,
  ClockIcon,
  CreatoCoinIcon,
  NoOfPeopleIcon,
  Dare1Icon,
  MuteVolumeIcon,
  UnMuteVolumeIcon,
  PlayIcon
} from "../../assets/svg"
import { LanguageContext } from "../../routes/authRoute"
import "../../assets/styles/dareme/components/dareMeCardStyle.scss"

const DareMeCard = (props: any) => {
  const { owner, item } = props
  const [time, setTime] = useState(item.lefTime)
  const [timerId, setTimerId] = useState<any>(null)
  const playerRef = useRef<ReactPlayer | null>(null)
  const [play, setPlay] = useState(false)
  const [muted, setMouted] = useState(true)
  const contexts = useContext(LanguageContext)

  const displayTime = (left: any) => {
    let res: any
    if (left <= 0) {
      const passTime = Math.abs(left)
      res = contexts.ITEM_CARD.ENDED
      if ((passTime / (3600 * 24 * 30)) > 0) res = res + ' ' + Math.ceil(passTime / (3600 * 24 * 30)) + '' + (Math.ceil(passTime / (3600 * 24 * 30)) === 1 ? contexts.ITEM_CARD.MONTH : contexts.ITEM_CARD.MONTHS) + contexts.ITEM_CARD.AGO
      // else if((passTime / (3600 * 24 * 7)) > 0) res = res + ' ' + Mat
      //   if ((passTime / 7) > 1) return Math.ceil((passTime / 7)) + (Math.ceil((passTime / 7)) === 1 ? contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.WEEK : contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.WEEKS) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.AGO;
      // if (passTime > 1) return Math.ceil(passTime) + (Math.ceil(passTime) === 1 ? contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.DAY : contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.DAYS) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.AGO;
      // if ((passTime * 24) > 1) return Math.ceil(passTime * 24) + (Math.ceil(passTime * 24) === 1 ? contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.HOUR : contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.HOURS) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.AGO;
      // if ((passTime * 24 * 60) > 1) return Math.ceil(passTime * 24 * 60) + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.MINS + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.AGO;
      // if (passTime >= 0) return "1" + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.MIN + contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.AGO;
      
    } else {
      let hours: any = Math.floor(left / 3600)
      let mins = Math.floor((left % 3600) / 60)
      let secs = Math.floor((left % 3600) % 60)
      res = (hours < 10 ? `0${hours}` : hours) + ' : ' + (mins < 10 ? `0${mins}` : mins) + ' : ' + (secs < 10 ? `0${secs}` : secs)
    }
    return res
  }

  useEffect(() => {
    if (item.lefTime > 0) {
      if (timerId) clearInterval(timerId)
      let id = setInterval(() => { setTime((time: any) => time - 1) }, 1000)
      setTimerId(id)
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
        <div className="ownername-lefttime-tip" style={owner.tip ? { width: '225px' } : { width: '205px' }}>
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
      <div className="teaser-video" onClick={() => {
        if (play) {
          setPlay(false)
          setMouted(true)
          playerRef.current?.seekTo(0)
        }
      }}>
        {(item.cover && !play) &&
          <div className="cover-image">
            <img
              src={item.cover}
              alt="cover Image"
              style={item.size ? { width: 'auto', height: '100%' } : { width: '100%', height: 'auto' }} />
          </div>
        }
        {play &&
          <>
            <ReactPlayer
              className={item.size ? "react-player-height" : "react-player-width"}
              ref={playerRef}
              url={item.teaser}
              muted={muted}
              playing={play}
              playsinline={true}
              onProgress={(progress) => {
                if (progress.playedSeconds >= progress.loadedSeconds) playerRef.current?.seekTo(0);
              }}
            />
            <div className="mute-icon" onClick={(e) => {
              e.stopPropagation()
              setMouted(!muted)
            }}>
              {muted === true ? <MuteVolumeIcon color="white" /> : <UnMuteVolumeIcon color="white" />}
            </div>
          </>
        }
        {!play &&
          <div className="play-icon" onClick={() => { setPlay(true) }}>
            <PlayIcon color="white" />
          </div>
        }
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
          text={time > 0 ? contexts.ITEM_CARD.VOTE_NOW : contexts.ITEM_CARD.SEE_MORE}
          width={190}
          icon={[<Dare1Icon color="#EFA058" />, <Dare1Icon color="white" />, <Dare1Icon color="white" />]}
          handleSubmit={() => { alert("ABC") }}
        />
      </div>
    </div>
  )
}

export default DareMeCard
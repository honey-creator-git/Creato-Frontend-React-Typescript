import { useEffect, useState, useRef, useContext } from "react"
import { useNavigate } from "react-router-dom"
import ReactPlayer from "react-player"
import Avatar from "../general/avatar"
import Button from "../general/button"
import {
  TipIcon,
  ClockIcon,
  CreatoCoinIcon,
  NoOfPeopleIcon,
  MuteVolumeIcon,
  UnMuteVolumeIcon,
  PlayIcon,
  Dare2Icon
} from "../../assets/svg"
import { LanguageContext } from "../../routes/authRoute"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/fundme/components/fundmeCardStyle.scss"

const FundMeCard = (props: any) => {
  const { owner, item } = props
  const [time, setTime] = useState(item.leftTime)
  const [timerId, setTimerId] = useState<any>(null)
  const playerRef = useRef<ReactPlayer | null>(null)
  const [play, setPlay] = useState(false)
  const [muted, setMouted] = useState(true)
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

  const displayProcess = () => {
    const interval = item.goal ? (Number(item.goal) / 20).toFixed(1) : 0;
    const count = item.goal ? Number(Math.floor(Number(item.donuts) / Number(interval))) : 0;
    const width = item.donuts < interval ? Math.floor(Number(interval) / Number(item.goal) * 250) : Math.floor(Number(interval) * count / Number(item.goal) * 250);
    return width
  }

  const navigation = (time: any, goal: any) => {
    if (time > 0) navigate(`/fundme/details/${item.id}`)
    else navigate(`/fundme/result/${item.id}`)
  }

  useEffect(() => {
    if (timerId) clearInterval(timerId)
    let id = setInterval(() => { setTime((time: any) => time - 1) }, 1000)
    setTimerId(id)
  }, [item.leftTime])

  return (
    <div className="fundme-card-wrapper">
      <div className="top-info">
        <div className="owner-avatar">
          <Avatar
            size="mobile"
            avatar={owner.avatar.indexOf('uploads') === -1 ? owner.avatar : `${CONSTANT.SERVER_URL}/${owner.avatar}`}
            handleClick={() => { navigate(`/${owner.profile}`) }}
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
          {owner.tip ? <div className="tip-button" onClick={() => { navigate(`/${owner.profile}/tip`) }}><TipIcon color="white" /></div> : <></>}
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
      <div className="item-detail" style={time < 0 ? { background: 'white' } : { background: "linear-gradient(121.78deg, #14C3C9 0%, #14AFC9 29.13%, #14A5C9 54.17%, #1490C9 97.1%)" }}>
        <div className="item-title" style={time > 0 ? { color: 'white' } : { color: '#14BDC7' }}>
          <span>{item.title}</span>
        </div>
        <div className="item-info">
          <div className="item-type">
            <CreatoCoinIcon color={'#14BDC7'} width={25} />
            <span>FundMe</span>
          </div>
          <div className="vote-info" style={time > 0 ? { color: 'white' } : { color: '#14BDC7' }}>
            <CreatoCoinIcon color={time > 0 ? 'white' : '#14BDC7'} width={20} /><span>{item.donuts.toLocaleString()}</span>
            <NoOfPeopleIcon color={time > 0 ? 'white' : '#14BDC7'} width={20} /><span>{item.voters.toLocaleString()}</span>
          </div>
        </div>
        <div className="process-bar">
          <div className="goal-bar"
            style={{ backgroundColor: time > 0 ? 'white' : '#BAB6B5' }}>
            <div className="value-bar"
              style={{
                width: item.donuts < item.goal ? `${displayProcess()}px` : '250px',
                height: time < 0 ? '13px' : '11px',
                margin: time < 0 ? '0px' : '1px 0px',
                background: time < 0 ? "linear-gradient(121.78deg, #14C3C9 0%, #14AFC9 29.13%, #14A5C9 54.17%, #1490C9 97.1%)" : "#34D399"
              }}>
            </div>
          </div>
        </div>
        <div className="goal-donuts" style={time > 0 ? { color: 'white' } : { color: '#14BDC7' }}>
          <span>{item.donuts.toLocaleString()} / {item.goal.toLocaleString()} Donuts</span>
        </div>
        <Button
          color="fundme"
          fillStyle={time > 0 ? "outline" : "fill"}
          shape="rounded"
          text={time > 0 ? contexts.ITEM_CARD.FUND_NOW : contexts.ITEM_CARD.SEE_MORE}
          width={190}
          icon={time > 0 ? [<Dare2Icon color="#14BDC7" />, <Dare2Icon color="white" />, <Dare2Icon color="white" />] : undefined}
          handleSubmit={() => { navigation(time, item.goal) }}
        />
      </div>
    </div>
  )
}

export default FundMeCard
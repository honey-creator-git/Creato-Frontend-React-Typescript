import { useState, useRef, useLayoutEffect, useEffect } from "react"
import ReactPlayer from "react-player"
import { MuteVolumeIcon, UnMuteVolumeIcon, StopIcon, CloseIcon } from "../../assets/svg"
import "../../assets/styles/TeaserCardPopUpStyle.scss"

const useWindowSize = () => {
  const [size, setSize] = useState(0)
  useLayoutEffect(() => {
    const updateSize = () => { setSize(window.innerWidth) }
    window.addEventListener("resize", updateSize)
    updateSize()
    return () => window.removeEventListener("resize", updateSize)
  }, [])
  return size
}

const TeaserCardPopUp = (props: any) => {
  const width = useWindowSize()
  const { teaser, size, display, exit } = props
  const [play, setPlay] = useState(true)
  const [muted, setMuted] = useState(true)
  const playerRef = useRef<ReactPlayer | null>(null)

  useEffect(() => { 
    if(display) {
      setPlay(true)
      setMuted(true)
      if(playerRef) playerRef.current?.seekTo(0)
    }
  }, [display])

  return (
    <div className="teaser-pop-up-wrapper" style={display ? { visibility: 'visible', opacity: 1 } : {}}>
      <div className="teaser-main-wrapper"
        style={{ width: `${width}px`, height: `${width * 1.71}px` }}
        onClick={() => { setPlay(!play) }}>
        <>
          <ReactPlayer
            className={size ? "react-player-height" : "react-player-width"}
            ref={playerRef}
            url={teaser}
            muted={muted}
            playing={play}
            playsinline={true}
            onProgress={(progress) => {
              if (progress.playedSeconds >= progress.loadedSeconds) playerRef.current?.seekTo(0);
            }}
          />
          <div className="mute-icon" onClick={(e) => {
            e.stopPropagation()
            setMuted(!muted)
          }}>
            {muted === true ? <MuteVolumeIcon color="white" /> : <UnMuteVolumeIcon color="white" />}
          </div>
        </>
        {!play &&
          <div className="play-icon">
            <StopIcon color="white" width={40} height={40} />
          </div>
        }
        <div className="exit-icon" onClick={(e) => { 
          e.stopPropagation()
          exit()
        }}>
          <CloseIcon color="white" />
        </div>
      </div>
    </div>
  )
}

export default TeaserCardPopUp
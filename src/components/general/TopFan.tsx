import { CreatoCoinIcon, WinningIcon } from "../../assets/svg"
import Avatar from "./avatar"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/TopFanStyle.scss"

const TopFan = (props: any) => {
  const { topfans } = props

  return (
    <div className="topfan-result-wrapper">
      <div className="header-title">
        <WinningIcon color="#EFA058" />&nbsp;Top Fans
      </div>
      <div className="topfan-info">
        <div className="topfan-card">
          <div className="topfan-avatar">
            <Avatar
              size="mobile"
              avatar={topfans[1] ? topfans[1].voter.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${topfans[1].voter.avatar}` : topfans[1].voter.avatar : ""}
            />
          </div>
          <div className="topfan-bar" style={{
            backgroundColor: '#EFA058',
            height: '175px',
            fontSize: '64px'
          }}>
            <span>2nd</span>
          </div>
          <div className="topfan-donuts">
            <CreatoCoinIcon color="#696462" />
            <span>{topfans[1] ? topfans[1].donuts.toLocaleString() : 0}</span>
          </div>
        </div>
        <div className="topfan-card">
          <div className="topfan-avatar">
            <Avatar
              size="mobile"
              avatar={topfans[0] ? topfans[0].voter.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${topfans[0].voter.avatar}` : topfans[0].voter.avatar : ""}
            />
          </div>
          <div className="topfan-bar" style={{
            backgroundColor: '#EA8426',
            height: '275px',
            fontSize: '94px'
          }}>
            <span>1st</span>
          </div>
          <div className="topfan-donuts">
            <CreatoCoinIcon color="#696462" />
            <span>{topfans[0] ? topfans[0].donuts.toLocaleString() : 0}</span>
          </div>
        </div>
        <div className="topfan-card">
          <div className="topfan-avatar">
            <Avatar
              size="mobile"
              avatar={topfans[2] ? topfans[2].voter.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${topfans[2].voter.avatar}` : topfans[2].voter.avatar : ""}
            />
          </div>
          <div className="topfan-bar" style={{
            backgroundColor: '#F0B9A9',
            height: '115px',
            fontSize: '54px'
          }}>
            <span>3rd</span>
          </div>
          <div className="topfan-donuts">
            <CreatoCoinIcon color="#696462" />
            <span>{topfans[2] ? topfans[2].donuts.toLocaleString() : 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopFan
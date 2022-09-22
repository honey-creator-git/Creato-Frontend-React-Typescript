import Avatar from "./avatar"
import { CreatoCoinIcon, WinningIcon } from "../../assets/svg"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/ListSuperFansStyle.scss"

const ListSuperFans = (props: any) => {
  const { voters } = props

  return (
    <div className="list-superfans-wrapper">
      <div className="header-title">
        <WinningIcon color="#EFA058" />&nbsp;List of SuperFans
      </div>
      <div className="superfan-list scroll-bar">
        <table>
          <thead>
            <tr>
              <th>Place</th>
              <th>From</th>
              <th>Donuts</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter: any, index: any) => (
              <tr key={index}>
                <td><span className="place">{index + 1}</span></td>
                <td>
                  <div className="voter-avatar">
                    <Avatar
                      size="small"
                      avatar={voter.voter.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${voter.voter.avatar}` : voter.voter.avatar}
                      username={voter.voter.name}
                      avatarStyle="horizontal"
                    />
                  </div>
                </td>
                <td>
                  <div className="donuts-number">
                    <CreatoCoinIcon color="#27AE60" />&nbsp;{voter.donuts.toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListSuperFans
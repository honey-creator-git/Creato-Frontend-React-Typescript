import { useNavigate } from "react-router-dom"
import Button from "../general/button"
import Avatar from "../general/avatar"
import { 
  CloseIcon,
  TwitterIcon,
  WhatsappIcon,
  FacebookIcon
} from "../../assets/svg"
import CONSTANT from "../../constants/constant"
import "../../assets/styles/dialogStyle.scss"

const TipDialog = (props: any) => {
  const { display, title, exit, avatars, ownerName, donuts, wrapExit, personalisedUrl } = props
  const navigate = useNavigate()

  return (
    <div className="dialog-wrapper" style={display ? { visibility: 'visible', opacity: 1 } : {}} onClick={wrapExit}>
      <div className="dialog-main" onClick={e => e.stopPropagation()}>
        {(title || exit) &&
          <div className="dialog-header" style={exit ? { marginBottom: '16px' } : { justifyContent: 'center', marginBottom: '8px' }}>
            <div className="dialog-title">
              {title}
            </div>
            {exit &&
              <div onClick={exit}>
                <CloseIcon color="black" />
              </div>
            }
          </div>
        }
        {avatars &&
          <div className="avatars-wrapper">
            <div className="dialog-avatars">
              <div className="owner-avatar">
                <Avatar
                  avatar={avatars[0]}
                  size="web"
                />
              </div>
              <div className="user-avatar">
                <Avatar
                  avatar={avatars[1]}
                  size="web"
                />
              </div>
            </div>
          </div>
        }
        <div className="dialog-context">
          <span style={{ whiteSpace: 'pre-line' }}>{`You have successfully tipped ${donuts} Donuts to ${ownerName}!`}</span>
        </div>
        <div className="dialog-social">
            <div className="link" onClick={() => {
                let text = `I have tipped ${donuts} Donuts to ${ownerName} on Creato😀. Come join me at`;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${CONSTANT.CLIENT_URL}/${personalisedUrl}/fanwall&quote=${text}`, 'sharer');
            }}>
                <FacebookIcon color="#EFA058" />
            </div>
            <div className="link" onClick={() => {
                let text = `I have tipped ${donuts} Donuts to ${ownerName} on Creato😀. Come join me at %0a${CONSTANT.CLIENT_URL}/${personalisedUrl}/fanwall`;
                window.open(`https://wa.me/?text=${text}`);
            }}>
                <WhatsappIcon color="#EFA058" />
            </div>
            <div className="link" onClick={() => {
                let text = `I have tipped ${donuts} Donuts to ${ownerName} on Creato😀. Come join me at`;
                window.open(`https://twitter.com/share?url=${CONSTANT.CLIENT_URL}/${personalisedUrl}/fanwall&text=${text}`, 'sharer');
            }}>
                <TwitterIcon color="#EFA058" />
            </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'center' }}>
            <Button 
              text={'Explore Fan Wall'}
              color="primary"
              fillStyle="fill"
              shape="rounded"
              width={220}
              handleSubmit={() => { navigate(`/${personalisedUrl}/fanwall`) }}
            />
          </div>
          <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'center' }}>
            <Button
              text={'Explore Other Creators'}
              color="primary"
              fillStyle="fill"
              shape="rounded"
              width={220}
              handleSubmit={() => { navigate('/creators') }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TipDialog
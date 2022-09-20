import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { SET_DAREME_INITIAL } from "../../../redux/types"
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop"
import AvatarLink from "../../../components/dareme/avatarLink"
import ContainerBtn from "../../../components/general/containerBtn"
import Avatar from "../../../components/general/avatar"
import DareOption from "../../../components/general/dareOption"
import { LanguageContext } from "../../../routes/authRoute"
import CONSTANT from "../../../constants/constant"
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "../../../assets/svg";
import '../../../assets/styles/dareme/dare/gameOnStyle.scss'

const GameOn = () => {
  const { daremeId, optionId } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const daremeState = useSelector((state: any) => state.dareme)
  const userState = useSelector((state: any) => state.auth)
  const { dareme } = daremeState
  const { user } = userState
  const [isCopied, setIsCopied] = useState(false)
  const [option, setOption] = useState<any>(null)
  const contexts = useContext(LanguageContext)

  useEffect(() => {
    if (dareme.owner) {
      const filters = dareme.options.filter((option: any) => option.option._id === optionId)
      if (filters.length) setOption(filters[0].option)
    }
  }, [dareme, dispatch])
  useEffect(() => { window.scrollTo(0, 0) }, [location])

  return (
    <div className="game-on-main-wrapper">
      <div className="header-part">
        <div></div>
        <div className="page-title"><span>Game On 👏🏻</span></div>
        <div></div>
      </div>
      {(dareme.owner && option) &&
        <>
          <div className='game-on-wrapper'>
            <div className="game-on-videoCardDesktop">
              <VideoCardDesktop
                url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
                sizeType={dareme.sizeType}
                coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
              />
              <AvatarLink
                avatar={dareme.owner.avatar}
                username={dareme.owner.name}
                ownerId={dareme.owner._id}
                handleAvatar={() => { navigate(`/${dareme.owner.personalisedUrl}`) }}
                daremeId={dareme._id}
              />
            </div>
            <div className="game-on-info">
              <div className="game-on-details">
                <div className="avatars">
                  <div className="owner-avatar">
                    <Avatar
                      avatar={dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}`}
                      size="web"
                    />
                  </div>
                  <div className="user-avatar">
                    <Avatar
                      avatar={user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}`}
                      size="web"
                    />
                  </div>
                </div>
                <div className="dare-option-detail">
                  <DareOption
                    dareTitle={option.title}
                    donuts={option.donuts}
                    disabled={false}
                    username={option.writer.name}
                    handleSubmit={() => { }}
                  />
                </div>
                <div className="game-on-description">
                  <span>{contexts.GAME_ON.GAME_ON_LETTER}</span>
                </div>
                <div className="dare-copylink-btn" onClick={() => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}`);
                  setIsCopied(true);
                }}>
                  <ContainerBtn
                    text={isCopied ? contexts.GAME_ON.COPIED : contexts.GAME_ON.COPY_SHARE_LINK}
                    styleType="fill"
                  />
                </div>
                <div className="social-icon">
                  <div className="link" onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}`)
                  }}>
                    <FacebookIcon color="#EFA058" />
                  </div>
                  <div className="link" onClick={() => {
                    let text = `I have dared ${dareme.owner.name} in ${dareme.title} on Creato! Join me now!%0a${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}`
                    window.open(`whatsapp://send?text=${text}`);
                  }}>
                    <WhatsappIcon color="#EFA058" />
                  </div>
                  <div className="link" onClick={() => {
                    let text = `I have dared ${dareme.owner.name} in ${dareme.title} on Creato! Join me now!`;
                    window.open(`https://twitter.com/share?url=${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}&text=${text}`, 'sharer')
                  }}>
                    <TwitterIcon color="#EFA058" />
                  </div>
                </div>
                <div className="dare-category-btn" onClick={() => {
                  dispatch({ type: SET_DAREME_INITIAL })
                  navigate(`/dareme/details/${daremeId}`)
                }}>
                  <ContainerBtn
                    text={contexts.GAME_ON.BACK_TO_DAREME}
                    styleType="fill"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default GameOn
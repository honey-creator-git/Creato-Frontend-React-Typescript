import { useEffect, useState, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { fundmeAction } from "../../../redux/actions/fundmeActions"
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop"
import AvatarLink from "../../../components/dareme/avatarLink"
import VideoCardMobile from "../../../components/dareme/videoCardMobile"
import ContainerBtn from "../../../components/general/containerBtn"
import CategoryBtn from "../../../components/general/categoryBtn"
import Dialog from "../../../components/general/dialog"
import WelcomeDlg from "../../../components/general/welcomeDlg"
import CONSTANT from "../../../constants/constant"
import { LanguageContext } from "../../../routes/authRoute"
import { CreatoCoinIcon, RewardIcon, SpreadIcon, BackIcon, NoOfPeopleIcon } from "../../../assets/svg"
import { SET_FANWALL_INITIAL, SET_DIALOG_STATE } from "../../../redux/types"
import "../../../assets/styles/fundme/fund/fundmeResultStyle.scss"

const FundmeResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const contexts = useContext(LanguageContext);

  const { fundmeId } = useParams();
  const fundmeState = useSelector((state: any) => state.fundme)
  const fanwallState = useSelector((state: any) => state.fanwall)
  const userState = useSelector((state: any) => state.auth)
  const dlgState = useSelector((state: any) => state.load.dlgState)
  const prevRoute = useSelector((state: any) => state.load.prevRoute)
  const [isStay, setIsStay] = useState(false);
  const [isReward, setIsReward] = useState(false);
  const [openWelcomeDlg, setOpenWelcomeDlg] = useState(false)
  const [openWelcomeDlg2, setOpenWelcomeDlg2] = useState(false)

  const { fundme } = fundmeState
  const { fanwall } = fanwallState
  const { user } = userState

  const displayProcess = (length: any) => {
    const interval = fundme.goal ? (Number(fundme.goal) / 20).toFixed(1) : 0
    const count = fundme.goal ? Number(Math.floor(Number(fundme.wallet) / Number(interval))) : 0
    const width = fundme.wallet < interval ? Math.floor(Number(interval) / Number(fundme.goal) * length) : Math.floor(Number(interval) * count / Number(fundme.goal) * length)
    return width
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fundmeAction.getFundmeResult(fundmeId))
  }, [location, dispatch, fundmeId]);

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
    if (dlgState.type === 'welcome') {
      if (dlgState.state) setOpenWelcomeDlg(true)
    } else if (dlgState.type === 'welcome2') {
      if (dlgState.state) setOpenWelcomeDlg2(true)
    }
  }, [dlgState])

  return (
    <div className="fundme-result-wrapper">
      <div className="header-part">
        <div onClick={() => { navigate(prevRoute) }}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.FUNDME_RESULT}</span></div>
        <div onClick={() => { if (fundme.owner && user && (fundme.owner._id === user.id || user.role === "ADMIN")) navigate(`/fundme/${fundmeId}/voters`) }}>
          {(fundme.owner && user && (fundme.owner._id === user.id || user.role === "ADMIN")) && <NoOfPeopleIcon color="#938D8A" />}
        </div>
      </div>
      {fundme.owner &&
        <>
          <Dialog
            display={openWelcomeDlg}
            title="Welcome to Creato"
            exit={() => {
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
              setOpenWelcomeDlg(false);
            }}
            wrapExit={() => {
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
              setOpenWelcomeDlg(false);
            }}
            subcontext={true}
            icon={
              {
                pos: 1,
                icon: <RewardIcon color="#EFA058" width="60px" height="60px" />
              }
            }
            buttons={[
              {
                text: "Go",
                handleClick: () => {
                  setOpenWelcomeDlg(false);
                  dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
                  navigate('/')
                }
              }
            ]}
          />
          <WelcomeDlg
            display={openWelcomeDlg2}
            exit={() => {
              setOpenWelcomeDlg2(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
            }}
            wrapExit={() => {
              setOpenWelcomeDlg2(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
            }}
            buttons={[{
              text: contexts.WELCOME_DLG.OK,
              handleClick: () => {
                setOpenWelcomeDlg2(false)
                dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
                navigate('/')
              }
            }]}
          />
          <Dialog
            display={isReward}
            exit={() => { setIsReward(false) }}
            wrapExit={() => { setIsReward(false) }}
            subTitle={"SuperFans Only 🎊"}
            icon={
              {
                pos: 1,
                icon: <RewardIcon color="#EFA058" width="60px" height="60px" />
              }
            }
            context={`${fundme?.rewardText}\n\n`}
          />
          <Dialog
            display={isStay}
            wrapExit={() => { setIsStay(false); }}
            title={contexts.DIALOG.HEADER_TITLE.STAY_TUNED}
            context={contexts.DIALOG.BODY_LETTER.BEFORE_FANWALL}
            icon={{
              pos: 0,
              icon: <SpreadIcon color="#EFA058" width="60px" height="60px" />
            }}
          />
          <div className="fundme-result">
            <div className="fundme-result-videoCardDesktop">
              <VideoCardDesktop
                url={process.env.REACT_APP_SERVER_URL + "/" + fundme.teaser}
                sizeType={fundme.sizeType}
                coverImage={fundme.cover ? `${process.env.REACT_APP_SERVER_URL}/${fundme.cover}` : ""}
              />
              <AvatarLink
                avatar={fundme.owner.avatar}
                username={fundme.owner.name}
                ownerId={fundme.owner._id}
                handleAvatar={() => { navigate(`/${fundme.owner.personalisedUrl}`) }}
                daremeId={fundme._id}
                isFundme={true}
              />
            </div>
            <div className="fundme-result-information">
              <div className="fundme-result-videoCardMobile">
                <VideoCardMobile
                  url={process.env.REACT_APP_SERVER_URL + "/" + fundme.teaser}
                  title={fundme.title}
                  time={fundme.time}
                  finished={fundme.finished}
                  donuts={fundme.wallet}
                  category={contexts.FUNDME_CATEGORY_LIST[fundme.category - 1]}
                  sizeType={fundme.sizeType}
                  coverImage={fundme.cover ? `${process.env.REACT_APP_SERVER_URL}/${fundme.cover}` : ""}
                />
                <AvatarLink
                  avatar={fundme.owner.avatar}
                  username={fundme.owner.name}
                  ownerId={fundme.owner._id}
                  handleAvatar={() => { navigate(`/${fundme.owner.personalisedUrl}`) }}
                  daremeId={fundme._id}
                  isFundme={true}
                />
              </div>
              <div className="desktop-header-info">
                <div className="time-info">
                  <div className="left-time">
                    {displayTime(fundme.time)}
                  </div>
                  <div className="vote-info">
                    <CreatoCoinIcon color="black" />
                    <span>{fundme.wallet}</span>
                  </div>
                </div>
                <div className="dare-title">{fundme.title}</div>
                <div className="dare-category">
                  <CategoryBtn text={contexts.FUNDME_CATEGORY_LIST[fundme.category - 1]} color="primary" />
                </div>
              </div>
              <div className="funding-goal">
                <div className="title">
                  <CreatoCoinIcon color="#EFA058" />
                  <label>{fundme.wallet < fundme.goal ? contexts.CREATE_FUNDME_LETTER.FUNDING_GOAL : contexts.CREATE_FUNDME_LETTER.GOAL_REACHED}</label>
                </div>
                <div className="process-bar">
                  <div className="process-value" style={{ width: fundme.wallet < fundme.goal ? `${displayProcess(330)}px` : '330px' }}></div>
                </div>
                <div className="donuts-count">
                  <span><span className={fundme.wallet >= fundme.goal ? "over-donuts" : ""}>{fundme.wallet.toLocaleString()}</span> / {fundme.goal.toLocaleString()} {contexts.GENERAL_LETTER.DONUTS}</span>
                </div>
              </div>
              <div className="result-button">
                {user && fundme.owner._id === user.id ?
                  <>
                    {(fanwall && fanwall.writer && fanwall.posted === true) ?
                      <>
                        <div className="dare-btn" onClick={() => {
                          dispatch({ type: SET_FANWALL_INITIAL });
                          navigate(`/dareme/fanwall/detail/${fanwall._id}`);
                        }} >
                          <ContainerBtn text={contexts.DAREME_FINISHED.VIEW_ON_FANWALL} styleType="fill" />
                        </div>
                      </>
                      :
                      <>
                        <div className="dare-btn" onClick={() => { dispatch(fundmeAction.postFanwall(fundme._id, navigate)); }}>
                          <ContainerBtn text={contexts.DAREME_FINISHED.POST_ON_FANWALL} styleType="fill" />
                        </div>
                      </>
                    }
                  </> :
                  <>
                    <div className="dare-btn" onClick={() => {
                      if (fanwall === null || fanwall.posted === null || (fanwall.writer && fanwall.posted === false)) setIsStay(true);
                      else {
                        dispatch({ type: SET_FANWALL_INITIAL });
                        navigate(`/dareme/fanwall/detail/${fanwall._id}`);
                      }
                    }}>
                      <ContainerBtn text={contexts.DAREME_FINISHED.VIEW_ON_FANWALL} styleType="fill" />
                    </div>
                  </>
                }
                <div className="dare-btn" style={{ marginTop: '30px' }} onClick={() => { setIsReward(true) }}>
                  <ContainerBtn
                    disabled={false}
                    styleType="outline"
                    text={'See SuperFan Reward'}
                    icon={[<RewardIcon color="#EFA058" />, <RewardIcon color="white" />]}
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

export default FundmeResult
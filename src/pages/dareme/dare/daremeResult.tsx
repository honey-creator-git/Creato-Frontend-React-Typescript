import { useEffect, useState, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { daremeAction } from "../../../redux/actions/daremeActions"
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop"
import VideoCardMobile from "../../../components/dareme/videoCardMobile"
import AvatarLink from "../../../components/dareme/avatarLink"
import ContainerBtn from "../../../components/general/containerBtn"
import DareOption from "../../../components/general/dareOption"
import CategoryBtn from "../../../components/general/categoryBtn"
import Dialog from "../../../components/general/dialog"
import VoteResult from "../../../components/general/VoteResult"
import TopFan from "../../../components/general/TopFan"
import ListSuperFans from "../../../components/general/ListSuperFans"
import RefundDlg from "../../../components/dareme/refundDlg"
import WelcomeDlg from "../../../components/general/welcomeDlg"
import CONSTANT from "../../../constants/constant"
import { LanguageContext } from "../../../routes/authRoute"
import { CreatoCoinIcon, SpreadIcon, RewardIcon, BackIcon, NoOfPeopleIcon } from "../../../assets/svg"
import { SET_FANWALL_INITIAL, SET_DIALOG_STATE } from "../../../redux/types"
import "../../../assets/styles/dareme/dare/daremeResultStyle.scss"

const DaremeResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const contexts = useContext(LanguageContext);
  const { daremeId } = useParams();
  const daremeState = useSelector((state: any) => state.dareme);
  const loadState = useSelector((state: any) => state.load);
  const fanwallState = useSelector((state: any) => state.fanwall);
  const userState = useSelector((state: any) => state.auth);
  const dlgState = useSelector((state: any) => state.load.dlgState)
  const dareme = daremeState.dareme;
  const refundDonuts = daremeState.refundDonuts
  const fanwall = fanwallState.fanwall;
  const [totalDonuts, setTotalDonuts] = useState(0)
  const [resultOptions, setResultOptions] = useState<Array<any>>([])
  const [maxOption, setMaxOption] = useState<any>(null)
  const [isWin, setIsWin] = useState(false)
  const [isStay, setIsStay] = useState(false)
  const [isWinOptionDlg, setIsWinOptionDlg] = useState(false)
  const [winOptionId, setWinOptionId] = useState(false)
  const [optionTitle, setOptionTitle] = useState("")
  const [isCopyLinkDlg, setIsCopyLinkDlg] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [refund, setRefund] = useState(false)
  const [isRefund, setIsRefund] = useState(false)
  const [isMyDonuts, setIsMyDonuts] = useState(false)
  const [isSupport, setIsSupport] = useState(false)
  const [isCopyLink, setIsCopyLink] = useState(false)
  const [openWelcomeDlg, setOpenWelcomeDlg] = useState(false)
  const [openWelcomeDlg2, setOpenWelcomeDlg2] = useState(false)
  const user = userState.user;

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(daremeAction.getDaremeResult(daremeId))
  }, [location, dispatch, daremeId])

  useEffect(() => {
    if (dareme.title) {
      let total = 0;
      dareme.options.forEach((option: any) => { total += option.option.donuts; });
      setTotalDonuts(total);
      setResultOptions(dareme.options.sort((first: any, second: any) => {
        return first.option.donuts > second.option.donuts ? -1 : first.option.donuts < second.option.donuts ? 1 :
          first.option.date < second.option.date ? 1 : first.option.date > second.option.date ? -1 : 0
      }))
    }
  }, [dareme])

  useEffect(() => {
    if (resultOptions.length) {
      setMaxOption(resultOptions.reduce((prev: any, current: any) => (prev.option.donuts > current.option.donuts) ? prev : current))
      setIsWin(resultOptions.filter((option: any) => option.option.win === true).length ? true : false)
    }
  }, [resultOptions])

  useEffect(() => {
    if (dlgState.state) {
      if (dlgState.type === 'refund_donuts') setRefund(true)
    } else if (dlgState.type === 'welcome') {
      if (dlgState.state) {
        setOpenWelcomeDlg(true);
      }
    } else if (dlgState.type === 'welcome2') {
      if (dlgState.state) {
        setOpenWelcomeDlg2(true)
      }
    }
  }, [dlgState])

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

  return (
    <div className="dareme-result-wrapper">
      <div className="header-part">
        <div onClick={() => { navigate(loadState.prevRoute) }}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.DAREME_RESULT}</span></div>
        <div onClick={() => { if (dareme.owner && user && (dareme.owner._id === user.id || user.role === "ADMIN")) navigate(`/dareme/${daremeId}/voters`) }}>
          {(dareme.owner && user && (dareme.owner._id === user.id || user.role === "ADMIN")) && <NoOfPeopleIcon color="#938D8A" />}
        </div>
      </div>
      {(maxOption && dareme.owner) &&
        <div className="dareme-result">
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
          <RefundDlg
            confirm={true}
            display={isSupport}
            wrapExit={() => { setIsSupport(false) }}
            exit={() => { setIsSupport(false) }}
            title={'Confirm:'}
            dareme={dareme}
            refund={refundDonuts ? refundDonuts : 0}
            buttons={[
              {
                text: 'Back',
                handleClick: () => {
                  setIsSupport(false)
                  setRefund(true)
                }
              },
              {
                text: 'Send',
                handleClick: () => {
                  setIsCopied(false)
                  setIsSupport(false)
                  setIsCopyLink(true)
                  dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
                  dispatch(daremeAction.supportRefund(daremeId))
                }
              }
            ]}
          />
          <RefundDlg
            display={refund}
            wrapExit={() => {
              setRefund(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
            }}
            exit={() => {
              setRefund(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
            }}
            title={'Winning Dare:'}
            dareme={dareme}
            refund={refundDonuts ? refundDonuts : 0}
            buttons={[
              {
                text: 'No',
                handleClick: () => {
                  setRefund(false)
                  setIsRefund(true)
                }
              },
              {
                text: 'Yes',
                handleClick: () => {
                  setRefund(false)
                  setIsSupport(true)
                }
              }
            ]}
          />
          <Dialog
            display={isRefund}
            wrapExit={() => { setIsRefund(false); }}
            exit={() => { setIsRefund(false); }}
            title={'Confirm:'}
            context={'Donuts will be refunded to you.'}
            buttons={[
              {
                text: 'No',
                handleClick: () => {
                  setIsRefund(false)
                }
              },
              {
                text: 'Yes',
                handleClick: () => {
                  setIsRefund(false)
                  setIsMyDonuts(true)
                  dispatch(daremeAction.refundDonuts(refundDonuts, daremeId))
                }
              }
            ]}
          />
          <Dialog
            display={isCopyLink}
            title={'I supported:'}
            avatars={[
              dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}` : ""
            ]}
            exit={() => { setIsCopyLink(false) }}
            wrapExit={() => { setIsCopyLink(false) }}
            context={`Congratulations! You have supported ${dareme.owner.name} on ${dareme.title}`}
            buttons={[
              {
                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/result/${daremeId}`);
                  setIsCopied(true);
                }
              }
            ]}
            social
            ownerName={dareme.owner.name}
            daremeId={daremeId}
            shareType={"vote"}
            daremeTitle={dareme.title}
          />
          <Dialog
            display={isMyDonuts}
            wrapExit={() => { setIsMyDonuts(false); }}
            exit={() => { setIsMyDonuts(false); }}
            title={'Confirm:'}
            context={`${refundDonuts} Donuts has been returned to you.`}
            buttons={[
              {
                text: 'Check My Donuts',
                handleClick: () => {
                  setIsMyDonuts(false)
                  navigate(`/${user.personalisedUrl}/wallet`)
                }
              }
            ]}
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
          <Dialog
            display={isWinOptionDlg}
            exit={() => { setIsWinOptionDlg(false) }}
            wrapExit={() => { setIsWinOptionDlg(false) }}
            title="DareMe"
            context={contexts.DIALOG.BODY_LETTER.CONFIRM_WIN_BEFORE + " " + optionTitle + " " + contexts.DIALOG.BODY_LETTER.CONFIRM_WIN_OPTION_AFTER}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                handleClick: () => {
                  setIsCopied(false);
                  setIsWinOptionDlg(false);
                  dispatch(daremeAction.winDareOption(winOptionId, daremeId));
                  setIsCopyLinkDlg(true);
                }
              }
            ]}
          />
          <Dialog
            display={isCopyLinkDlg}
            title={contexts.DIALOG.HEADER_TITLE.CONGRAT}
            wrapExit={() => { setIsCopyLinkDlg(false) }}
            context={optionTitle + " " + contexts.DIALOG.BODY_LETTER.WIN_CONG}
            buttons={[
              {
                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}`);
                  setIsCopied(true);
                }
              }
            ]}
            social
            ownerName={dareme.owner.name}
            daremeId={daremeId}
            shareType={"win"}
            daremeTitle={dareme.title}
          />
          <div className="dareme-result-header">
            <div className="left-time-vote-info">
              <div className="left-time">
                <span>{displayTime(dareme.time)}</span>
              </div>
              <div className="vote-info">
                <CreatoCoinIcon color="black" />
                <span>{dareme.donuts.toLocaleString()}</span>
              </div>
            </div>
            <div className="dareme-title">
              <span>{dareme.title}</span>
            </div>
          </div>
          <div className="dareme-result-detail">
            <div className="detail-card">
              <VoteResult options={dareme.options} />
            </div>
            <div className="detail-card">
              <ListSuperFans voters={dareme.voteInfo.filter((vote: any) => vote.superfan === true).sort((first: any, second: any) => first.donuts < second.donuts ? 1 : first.donuts > second.donuts ? -1 : 0)} />
            </div>
            <div className="detail-card">
              <TopFan topfans={dareme.voteInfo.sort((first: any, second: any) => first.donuts < second.donuts ? 1 : first.donuts > second.donuts ? -1 : 0)} />
            </div>
          </div>
          {/* <div className="dareme-result-videoCardDesktop">
            <VideoCardDesktop
              url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
              sizeType={dareme.sizeType}
              coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
            />
            <AvatarLink
              username={dareme.owner.name}
              avatar={dareme.owner.avatar}
              ownerId={dareme.owner._id}
              handleAvatar={() => { navigate(`/${dareme.owner.personalisedUrl}`) }}
              daremeId={dareme._id}
            />
          </div>
          <div className="dareme-result-information">
            <div className="dareme-result-videoCardMobile">
              <VideoCardMobile
                url={CONSTANT.SERVER_URL + "/" + dareme.teaser}
                title={dareme.title}
                time={dareme.time}
                finished={dareme.finished}
                donuts={totalDonuts}
                category={contexts.DAREME_CATEGORY_LIST[dareme.category - 1]}
                sizeType={dareme.sizeType}
                coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
              />
              <AvatarLink
                avatar={dareme.owner.avatar}
                username={dareme.owner.name}
                ownerId={dareme.owner._id}
                handleAvatar={() => { navigate(`/${dareme.owner.personalisedUrl}`) }}
                daremeId={dareme._id}
                isFundme={true}
              />
            </div>
            <div className="desktop-header-info">
              <div className="time-info">
                <div className="left-time">
                  {displayTime(dareme.time)}
                </div>
                <div className="vote-info">
                  <CreatoCoinIcon color="black" />
                  <span>{totalDonuts !== null ? totalDonuts.toLocaleString() : ''}</span>
                </div>
              </div>
              <div className="dare-title">{dareme.title}</div>
              <div className="dare-category">
                <CategoryBtn text={contexts.DAREME_CATEGORY_LIST[dareme.category - 1]} color="primary" />
              </div>
            </div>
            <div className="result-info">
              <div className="result-win-options">
                {resultOptions.length > 0 &&
                  <>
                    {isWin ?
                      resultOptions.filter((option: any) => option.option.win === true).map((option: any, i: any) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <DareOption
                            dareTitle={option.option.title}
                            donuts={option.option.donuts}
                            voters={option.option.voters}
                            canVote={false}
                            disabled={false}
                            username={option.option.writer.name}
                            leading={true}
                            handleSubmit={() => { }}
                          />
                        </div>
                      ))
                      :
                      resultOptions.filter((option: any) => option.option.donuts === maxOption.option.donuts).map((option: any, i: any) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <DareOption
                            dareTitle={option.option.title}
                            donuts={option.option.donuts}
                            voters={option.option.voters}
                            canVote={false}
                            disabled={false}
                            username={option.option.writer.name}
                            leading={true}
                            handleSubmit={() => {
                              if (dareme.owner._id === user.id && user) {
                                setWinOptionId(option.option._id);
                                setOptionTitle(option.option.title);
                                setIsWinOptionDlg(true);
                              }
                            }}
                          />
                        </div>
                      ))
                    }
                  </>
                }
              </div>
              {!isWin ?
                <div className="tie-letter">
                  {(user && dareme.owner._id === user.id) ?
                    <span>
                      Please decide which Dare option wins!<br /><br />
                    </span>
                    :
                    <span>
                      {contexts.DAREME_FINISHED.BEFORE_CREATOR_NAME + " " + dareme.owner.name + " " + contexts.DAREME_FINISHED.AFTER_CREATOR_NAME}
                    </span>
                  }
                </div>
                :
                <div className="result-button">
                  {user && dareme.owner._id === user.id ?
                    <>
                      {fanwall && fanwall.writer && fanwall.posted === true ?
                        <>
                          <div onClick={() => {
                            dispatch({ type: SET_FANWALL_INITIAL });
                            navigate(`/dareme/fanwall/detail/${fanwall._id}`);
                          }} >
                            <ContainerBtn text={contexts.DAREME_FINISHED.VIEW_ON_FANWALL} styleType="fill" />
                          </div>
                        </>
                        :
                        <>
                          <div onClick={() => { dispatch(daremeAction.postFanwall(dareme._id, navigate)); }}>
                            <ContainerBtn text="Post on Fanwall" styleType="fill" />
                          </div>
                        </>
                      }
                    </> :
                    <>
                      <div onClick={() => {
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
                </div>
              }
              <div className="dare-options scroll-bar" style={!isWin ? { maxHeight: '130px' } : {}}>
                {isWin ?
                  resultOptions.filter((option: any) => option.option.win !== true).map((option: any, i: any) => (
                    <div key={i} className="dare-option">
                      <DareOption
                        dareTitle={option.option.title}
                        donuts={option.option.donuts}
                        voters={option.option.voters}
                        canVote={false}
                        disabled={false}
                        username={option.option.writer.name}
                        leading={false}
                        handleSubmit={() => { }}
                      />
                    </div>
                  ))
                  :
                  resultOptions.filter((option: any) => option.option.donuts !== maxOption.option.donuts).map((option: any, i: any) => (
                    <div key={i} className="dare-option">
                      <DareOption
                        dareTitle={option.option.title}
                        donuts={option.option.donuts}
                        voters={option.option.voters}
                        canVote={false}
                        disabled={false}
                        username={option.option.writer.name}
                        leading={false}
                        handleSubmit={() => { }}
                      />
                    </div>
                  ))
                }
              </div>
            </div> */}
          {/* </div> */}
        </div>
      }
    </div>
  )
}

export default DaremeResult
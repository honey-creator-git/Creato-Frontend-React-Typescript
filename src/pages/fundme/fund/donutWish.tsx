import { useEffect, useState, useContext } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fundmeAction } from "../../../redux/actions/fundmeActions"
import Avatar from "../../../components/general/avatar"
import Input from "../../../components/general/input"
import Button from "../../../components/general/button"
import Dialog from "../../../components/general/dialog"
import { LanguageContext } from "../../../routes/authRoute"
import Gif from "../../../components/general/gif"
import { SET_DIALOG_STATE, SET_PREVIOUS_ROUTE } from "../../../redux/types"
import CONSTANT from "../../../constants/constant"
import VoteNonSuperfanGif from '../../../assets/img/vote_non_superfan.gif'
import VoteSuperfanGif from '../../../assets/img/vote_superfan.gif'
import { CreatoCoinIcon, BackIcon } from "../../../assets/svg"
import "../../../assets/styles/dareme/dare/donutWishStyle.scss"

const DonutWish = () => {
  const { fundmeId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fundmeState = useSelector((state: any) => state.fundme)
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)
  const { fundme } = fundmeState
  const { user } = userState
  const { dlgState } = loadState
  const [donuts, setDonuts] = useState('')
  const [isTopUp, setIsTopUp] = useState(false)
  const [isCopyLink, setIsCopyLink] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isNonSuperfan, setIsNonSuperfan] = useState(false)
  const [isSuperFan, setIsSuperFan] = useState(false)
  const [voteNonSuperfanGif, setVoteNonSuperfanGif] = useState(false)
  const [voteSuperfanGif, setVoteSuperfanGif] = useState(false)
  const [openSet, setOpenSet] = useState(false)
  const contexts = useContext(LanguageContext)

  const displayProcess = (length: any) => {
    const interval = fundme.goal ? (Number(fundme.goal) / 20).toFixed(1) : 0
    const count = fundme.goal ? Number(Math.floor(Number(fundme.wallet) / Number(interval))) : 0
    const width = fundme.wallet < interval ? Math.floor(Number(interval) / Number(fundme.goal) * length) : Math.floor(Number(interval) * count / Number(fundme.goal) * length)
    return width
  }

  const supportCreator = () => {
    const amount = Number(donuts)
    if (user) {
      if (amount > user.wallet) setIsTopUp(true)
      else {
        if (amount < fundme.reward) setIsNonSuperfan(true)
        else setIsSuperFan(true)
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(fundmeAction.getFundMeDetails(fundmeId))
  }, [location, dispatch, fundmeId])

  useEffect(() => {
    if (dlgState.type === 'vote_non_superfan' && dlgState.state === true) {
      setIsCopyLink(true)
      setVoteNonSuperfanGif(true)
    } else if (dlgState.type === 'vote_superfan' && dlgState.state === true) {
      setIsCopyLink(true)
      setVoteSuperfanGif(true)
    }
  }, [dlgState])

  useEffect(() => { if (fundme.owner && fundme.finished) navigate(`/fundme/result/${fundme}`) }, [fundme, navigate])
  useEffect(() => { if (voteNonSuperfanGif) setTimeout(() => { setVoteNonSuperfanGif(false) }, 4000) }, [voteNonSuperfanGif])
  useEffect(() => { if (voteSuperfanGif) setTimeout(() => { setVoteSuperfanGif(false) }, 3500) }, [voteSuperfanGif])

  return (
    <div className="donut-wish-main-wrapper">
      {voteNonSuperfanGif && <Gif gif={VoteNonSuperfanGif} />}
      {voteSuperfanGif && <Gif gif={VoteSuperfanGif} />}
      <div className="header-part">
        <div onClick={() => { navigate(`/fundme/details/${fundmeId}`) }}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.DONUTS_YOU_LIKE}</span></div>
        <div></div>
      </div>
      {fundme.owner &&
        <div className="donut-wish-wrapper">
          <Dialog
            display={isTopUp}
            title={contexts.DIALOG.HEADER_TITLE.TOP_UP_NOW}
            exit={() => { setIsTopUp(false) }}
            wrapExit={() => { setIsTopUp(false) }}
            context={contexts.DIALOG.BODY_LETTER.TOP_UP_NOW}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.TOP_UP,
                handleClick: () => {
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/fundme/details/${fundmeId}/wish` });
                  navigate(`/myaccount/shop`);
                }
              }
            ]}
          />
          <Dialog
            display={openSet}
            title="Oops!"
            exit={() => { setOpenSet(false) }}
            wrapExit={() => { setOpenSet(false) }}
            context={"Minimum is 2 Donuts to support them!🍩"}
          />
          <Dialog
            display={isNonSuperfan}
            exit={() => { setIsNonSuperfan(false) }}
            wrapExit={() => { setIsNonSuperfan(false) }}
            title={'Confirm:'}
            context={`You can become SuperFans by giving\n ${fundme.reward - Number(donuts)} more Donut\nAre you sure to proceed?`}
            buttons={[
              {
                text: 'Yes',
                handleClick: () => {
                  dispatch(fundmeAction.fundCreator(fundmeId, Number(donuts), fundme.reward))
                  setIsNonSuperfan(false)
                  setIsCopied(false)
                }
              },
              {
                text: 'No',
                handleClick: () => { setIsNonSuperfan(false) }
              }
            ]}
          />
          <Dialog
            display={isSuperFan}
            title={contexts.DIALOG.HEADER_TITLE.VOTE_SUPER}
            avatars={[
              fundme.owner.avatar.indexOf('uploads') === -1 ? fundme.owner.avatar : `${process.env.REACT_APP_SERVER_URL}/${fundme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${process.env.REACT_APP_SERVER_URL}/${user.avatar}` : ""
            ]}
            exit={() => { setIsSuperFan(false) }}
            wrapExit={() => { setIsSuperFan(false) }}
            context={Number(donuts) + contexts.DIALOG.BODY_LETTER.VOTE_SUPER + fundme.title}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                handleClick: () => {
                  dispatch(fundmeAction.fundCreator(fundmeId, Number(donuts), fundme.reward))
                  setIsSuperFan(false)
                  setIsCopied(false)
                }
              }
            ]}
          />
          <Dialog
            display={isCopyLink}
            title={contexts.DIALOG.HEADER_TITLE.HAVE_DARED}
            avatars={[
              fundme.owner.avatar.indexOf('uploads') === -1 ? fundme.owner.avatar : `${process.env.REACT_APP_SERVER_URL}/${fundme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${process.env.REACT_APP_SERVER_URL}/${user.avatar}` : ""
            ]}
            exit={() => {
              setIsCopyLink(false);
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
              setVoteNonSuperfanGif(false);
              setVoteSuperfanGif(false);
            }}
            wrapExit={() => {
              setIsCopyLink(false);
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
              setVoteNonSuperfanGif(false);
              setVoteSuperfanGif(false);
            }}
            context={contexts.DIALOG.BODY_LETTER.HAVE_DARED + fundme.owner.name + ' ' + contexts.DIALOG.BODY_LETTER.ON_PART + ' ' + fundme.title}
            buttons={[
              {
                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${process.env.REACT_APP_CLIENT_URL}/fundme/details/${fundmeId}`);
                  setIsCopied(true);
                }
              }
            ]}
            social
            ownerName={fundme.owner.name}
            daremeId={fundmeId}
            shareType={"vote"}
            daremeTitle={fundme.title}
            isFundme={true}
          />
          <div className="avatar-option">
            <div className="avatar">
              <Avatar
                size="web"
                avatar={fundme.owner.avatar.indexOf('uploads') === -1 ? fundme.owner.avatar : `${process.env.REACT_APP_SERVER_URL}/${fundme.owner.avatar}`}
                username={fundme.owner.name}
              />
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
          </div>
          <div className="donuts-send">
            <div className="top-letter">
              <span>{contexts.GENERAL_LETTER.GIVE_DONUTS_AS_YOU_LIKE}</span>
            </div>
            <div className="donuts-number">
              <label className="letter">{contexts.REVIEW_LETTER.DONUTS_NUMBER}</label>
              <Input
                type="input"
                placeholder={'e.g. 50'}
                isNumber={true}
                title={donuts}
                width={150}
                minnum={1}
                maxnum={99999999}
                step={1}
                setTitle={setDonuts}
                setFocus={() => { }}
              />
            </div>
            <div style={{ marginTop: '5px' }}>
              <Button
                text={contexts.GENERAL_LETTER.SEND}
                width="316px"
                shape="rounded"
                color="primary"
                fillStyle={donuts !== '' ? 'fill' : undefined}
                handleSubmit={() => { supportCreator() }}
              />
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default DonutWish
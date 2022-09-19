import { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { daremeAction } from "../../../redux/actions/daremeActions";
import Title from "../../../components/general/title";
import Avatar from "../../../components/general/avatar";
import Input from "../../../components/general/input";
import Button from "../../../components/general/button";
import Dialog from "../../../components/general/dialog";
import DareOption from "../../../components/general/dareOption";
import Gif from "../../../components/general/gif";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_CURRENT_DAREME, SET_DIALOG_STATE, SET_PREVIOUS_ROUTE } from "../../../redux/types";
import CONSTANT from "../../../constants/constant";
import VoteNonSuperfanGif from '../../../assets/img/vote_non_superfan.gif';
import VoteSuperfanGif from '../../../assets/img/vote_superfan.gif';
import "../../../assets/styles/dareme/dare/donutWishStyle.scss";

const DonutWish = () => {
  const { daremeId, optionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const daremeState = useSelector((state: any) => state.dareme)
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)
  const { dareme } = daremeState
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
  const contexts = useContext(LanguageContext)

  const [option, setOption] = useState<any>(null)
  const [voted, setVoted] = useState(false)

  const checkVoted = () => {
    if (dareme.owner && user) {
      for (let i = 0; i < dareme.options.length; i++) {
        if (dareme.options[i].option.writer._id === user.id) return true
        for (let j = 0; j < dareme.options[i].option.voteInfo.length; j++)
          if (user.id === dareme.options[i].option.voteInfo[j].voter)
            if (dareme.options[i].option.voteInfo[j].donuts > 0) return true
      }
      return false
    } else return false
  }

  const supportCreator = () => {
    const amount = Number(donuts)
    if (user) {
      if (amount > user.wallet) setIsTopUp(true)
      else {
        if (amount < dareme.reward) setIsNonSuperfan(true)
        else setIsSuperFan(true)
      }
    }
  }

  useEffect(() => {
    if (dlgState.type === 'vote_non_superfan' && dlgState.state === true) {
      setIsCopyLink(true)
      setVoteNonSuperfanGif(true)
    } else if (dlgState.type === 'vote_superfan' && dlgState.state === true) {
      setIsCopyLink(true)
      setVoteSuperfanGif(true)
    }
  }, [dlgState])

  useEffect(() => {
    if (dareme.owner) {
      const filters = dareme.options.filter((option: any) => option.option._id === optionId)
      if (filters.length) setOption(filters[0].option)
      setVoted(checkVoted())
    }
  }, [dareme])

  useEffect(() => {
    dispatch(daremeAction.getDareMeDetails(daremeId))
    dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
  }, [daremeId])
  useEffect(() => { if (voteNonSuperfanGif) setTimeout(() => { setVoteNonSuperfanGif(false) }, 4000) }, [voteNonSuperfanGif])
  useEffect(() => { if (voteSuperfanGif) setTimeout(() => { setVoteSuperfanGif(false) }, 3500) }, [voteSuperfanGif])
  useEffect(() => { window.scrollTo(0, 0) }, [location])

  return (
    <>
      {voteNonSuperfanGif && <Gif gif={VoteNonSuperfanGif} />}
      {voteSuperfanGif && <Gif gif={VoteSuperfanGif} />}
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.DONUTS_YOU_LIKE} back={() => { navigate(`/dareme/${daremeId}/support/${optionId}`) }} />
      </div>
      {(dareme.owner && option) &&
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
                  // dispatch({ type: SET_CURRENT_DAREME, payload: daremeId })
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/${daremeId}/support/${optionId}/wish` })
                  navigate(`/myaccount/shop`)
                }
              }
            ]}
          />
          <Dialog
            display={isNonSuperfan}
            exit={() => { setIsNonSuperfan(false) }}
            wrapExit={() => { setIsNonSuperfan(false) }}
            title={'Confirm:'}
            context={`You can become SuperFans by giving\n ${dareme.reward - Number(donuts)} more Donut\nAre you sure to proceed?`}
            buttons={[
              {
                text: 'Yes',
                handleClick: () => {
                  dispatch(daremeAction.supportCreator(daremeId, optionId, dareme.reward, Number(donuts)))
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
              dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}` : ""
            ]}
            exit={() => { setIsSuperFan(false) }}
            wrapExit={() => { setIsSuperFan(false) }}
            context={Number(donuts) + contexts.DIALOG.BODY_LETTER.VOTE_SUPER + option.title}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                handleClick: () => {
                  dispatch(daremeAction.supportCreator(daremeId, optionId, dareme.reward, Number(donuts)))
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
              dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}` : ""
            ]}
            exit={() => {
              setIsCopyLink(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
              setVoteNonSuperfanGif(false)
              setVoteSuperfanGif(false)
              navigate(`/dareme/details/${daremeId}`)
            }}
            wrapExit={() => {
              setIsCopyLink(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
              setVoteNonSuperfanGif(false)
              setVoteSuperfanGif(false)
              navigate(`/dareme/details/${daremeId}`)
            }}
            context={contexts.DIALOG.BODY_LETTER.HAVE_DARED + dareme.owner.name + ' ' + contexts.DIALOG.BODY_LETTER.ON_PART + ' ' + dareme.title}
            buttons={[
              {
                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}`)
                  setIsCopied(true)
                  setTimeout(() => { setIsCopied(false) }, 2500)
                }
              }
            ]}
            social
            ownerName={dareme.owner.name}
            daremeId={daremeId}
            shareType={"vote"}
            daremeTitle={dareme.title}
          />
          <div className="avatar-option">
            <div className="avatar">
              <Avatar
                size="web"
                avatar={dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}`}
                username={dareme.owner.name}
              />
            </div>
            <div className="option">
              <DareOption
                donuts={option.donuts}
                voters={voted ? option.voters : undefined}
                dareTitle={option.title}
                username={option.writer.name}
                disabled={false}
                handleSubmit={() => { }}
                canVote={true}
                leading={false}
              />
            </div>
          </div>
          <div className="donuts-send">
            <div className="top-letter">
              <span>Give Donuts as you like:</span>
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
                text="Send"
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
    </>
  )
}

export default DonutWish;
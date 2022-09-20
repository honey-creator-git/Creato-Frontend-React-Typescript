import { useEffect, useState, useContext } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fundmeAction } from "../../../redux/actions/fundmeActions"
import { LanguageContext } from "../../../routes/authRoute"
import Avatar from "../../../components/general/avatar"
import CONSTANT from "../../../constants/constant"
import { CreatoCoinIcon, BackIcon } from "../../../assets/svg"
import "../../../assets/styles/dareme/dare/daremeVotersStyle.scss"

const FundmeVoters = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { fundmeId } = useParams()
  const contexts = useContext(LanguageContext)
  const fundmeState = useSelector((state: any) => state.fundme)
  const { fundme } = fundmeState
  const [resultVotes, setResultVotes] = useState<Array<any>>([])


  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(fundmeAction.getFundMeDetails(fundmeId))
  }, [location, dispatch, fundmeId])

  useEffect(() => { if (fundme.owner) setResultVotes(fundme.voteInfo.sort((first: any, second: any) => { return first.donuts < second.donuts ? 1 : first.donuts > second.donuts ? -1 : 0 })) }, [fundme])

  return (
    <div className="dareme-voters-wrapper">
      <div className="header-part">
        <div onClick={() => { navigate(`/fundme/details/${fundmeId}`) }}><BackIcon color="black" /></div>
        <div className="page-title"><span>Voters</span></div>
        <div></div>
      </div>
      <div className="dareme-voters">
        <div className="dareme-voters-information">
          <div className="dare-options">
            <div className="vote-details">
              {resultVotes.length > 0 &&
                resultVotes.map((vote: any, vIndex: any) => (
                  <div key={vIndex} className="vote-info">
                    {vote.voter.name &&
                      <Avatar
                        avatar={vote.voter.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${vote.voter.avatar}` : vote.voter.avatar}
                        username={vote.voter.name}
                        avatarStyle="horizontal"
                      />
                    }
                    <div className="donuts-count">
                      <CreatoCoinIcon color="#54504E" />
                      <span>{vote.donuts + (vote.canFree === false ? 1 : 0)}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FundmeVoters
import { useEffect, useState, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fundmeAction } from "../../../redux/actions/fundmeActions";
import Title from "../../../components/general/title";
import { LanguageContext } from "../../../routes/authRoute";
import Avatar from "../../../components/general/avatar";
import CONSTANT from "../../../constants/constant";
import { CreatoCoinIcon } from "../../../assets/svg";
import "../../../assets/styles/dareme/dare/daremeVotersStyle.scss";

const FundmeVoters = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { fundmeId } = useParams();
    const contexts = useContext(LanguageContext);
    const fundmeState = useSelector((state: any) => state.fundme);
    
    const votes = fundmeState.votes;
    
    const [resultVotes, setResultVotes] = useState<Array<any>>([]);


    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fundmeAction.getFundmeVoters(fundmeId));
    }, [location]);
    
    useEffect(() => {
        if(votes && votes.length > 0) {
            setResultVotes(votes)
        }
    }, [votes]);
    return (
        <>
            <div className="title-header">
                <Title
                    title={"Voters"}
                    back={() => { dispatch(fundmeAction.checkDetailsAndResults(fundmeId, navigate)) }}
                    // back={() => { navigate(`/fundme/details/${fundmeId}`) }}
                />
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
        </>
    );
};

export default FundmeVoters;
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
    const daremeState = useSelector((state: any) => state.dareme);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fundmeAction.getFundmeVoters(fundmeId));
    }, [location]);

    return (
        <>
            <div className="title-header">
                <Title
                    title={"Voters"}
                    back={() => { dispatch(fundmeAction.checkDetailsAndResults(fundmeId, navigate)) }}
                />
            </div>
            {/* {resultOptions.length > 0 &&
                <>
                    <div className="dareme-voters">
                        <div className="dareme-voters-information">
                            <div className="dare-options">
                                {
                                    resultOptions.filter((option: any) => option.option.status === 1).map((option: any, index: any) => (
                                        <div key={index}>
                                            <div className="vote-details">
                                                {option.option.voteInfo.sort((first: any, second: any) => {
                                                    const firstDonuts = first.donuts + (first.canFree === false ? 1 : 0);
                                                    const secondDonuts = second.donuts + (second.canFree === false ? 1 : 0);
                                                    if (firstDonuts >= secondDonuts) return -1;
                                                    else return 1;
                                                }).map((vote: any, vIndex: any) => (
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
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </>
            } */}
        </>
    );
};

export default FundmeVoters;
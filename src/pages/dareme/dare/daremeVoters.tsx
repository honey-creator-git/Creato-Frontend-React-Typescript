import { useEffect, useState, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { daremeAction } from "../../../redux/actions/daremeActions";
import Title from "../../../components/general/title";
import DareOption from "../../../components/general/dareOption";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_ADMIN_OPTIONS } from "../../../redux/types";
import Avatar from "../../../components/general/avatar";
import CONSTANT from "../../../constants/constant";
import "../../../assets/styles/dareme/dare/daremeVotersStyle.scss";
import { CreatoCoinIcon } from "../../../assets/svg";

const DaremeVoters = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { daremeId } = useParams();
    const contexts = useContext(LanguageContext);
    const daremeState = useSelector((state: any) => state.dareme);
    const options = daremeState.options;
    const [resultOptions, setResultOptions] = useState<Array<any>>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(daremeAction.getDaremeOptions(daremeId));
        dispatch({ type: SET_ADMIN_OPTIONS, payload: null });
    }, [location]);

    useEffect(() => {
        if (options && options.length > 0) {
            setResultOptions(options.sort((first: any, second: any) => {
                if (second.option.win === true) return 1;
                return first.option.donuts > second.option.donuts ? -1 : first.option.donuts < second.option.donuts ? 1 :
                    first.option.date < second.option.date ? 1 : first.option.date > second.option.date ? -1 : 0;
            }));
        }
    }, [options]);

    return (
        <>
            <div className="title-header">
                <Title
                    title={"Voters"}
                    back={() => { dispatch(daremeAction.checkDetailsAndResults(daremeId, navigate)) }}
                />
            </div>
            {resultOptions.length > 0 &&
                <>
                    <div className="dareme-voters">
                        <div className="dareme-voters-information">
                            <div className="dare-options">
                                {
                                    resultOptions.filter((option: any) => option.option.status === 1).map((option: any, index: any) => (
                                        <div key={index}>
                                            <div className="dare-option" >
                                                <DareOption
                                                    dareTitle={option.option.title}
                                                    donuts={option.option.donuts}
                                                    voters={option.option.voters}
                                                    canVote={true}
                                                    disabled={false}
                                                    username={option.option.writer.name}
                                                    leading={false}
                                                    handleSubmit={() => { }}
                                                />
                                            </div>
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
            }
        </>
    );
};

export default DaremeVoters;
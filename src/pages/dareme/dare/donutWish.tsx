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
    const { daremeId, optionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const daremeState = useSelector((state: any) => state.dareme);
    const user = useSelector((state: any) => state.auth.user);
    const dlgState = useSelector((state: any) => state.load.dlgState);
    const option = daremeState.option;
    const dareme = daremeState.dareme;
    const [voters, setVoters] = useState(0);
    const [donuts, setDonuts] = useState('');
    const [isTopUp, setIsTopUp] = useState(false);
    const [isCopyLink, setIsCopyLink] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isNonSuperfan, setIsNonSuperfan] = useState(false);
    const [isSuperFan, setIsSuperFan] = useState(false);
    const [voteNonSuperfanGif, setVoteNonSuperfanGif] = useState(false);
    const [voteSuperfanGif, setVoteSuperfanGif] = useState(false);
    const contexts = useContext(LanguageContext);

    const checkVoted = () => {
        if (dareme.options && user) {
            for (let i = 0; i < dareme.options.length; i++)
                for (let j = 0; j < dareme.options[i].option.voteInfo.length; j++) {
                    if (user.id === dareme.options[i].option.voteInfo[j].voter) {
                        if (dareme.options[i].option.voteInfo[j].donuts === 50) return true;
                        if (dareme.options[i].option.voteInfo[j].canFree === false) return true;
                    }
                }
            return false;
        }
        return false;
    }

    const supportCreator = () => {
        const amount = Number(donuts);
        if (user) {
            if (amount > user.wallet) setIsTopUp(true);
            else {
                if (amount < dareme.reward) setIsNonSuperfan(true);
                else setIsSuperFan(true);
            }
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(daremeAction.getOptionDetails(optionId, daremeId));
    }, [daremeId, optionId, location]);

    useEffect(() => {
        if (dlgState.type === 'vote_non_superfan' && dlgState.state === true) {
            setIsCopyLink(true)
            setVoteNonSuperfanGif(true)
        } else if (dlgState.type === 'vote_superfan' && dlgState.state === true) {
            setIsCopyLink(true)
            setVoteSuperfanGif(true)
        }
    }, [dlgState]);

    useEffect(() => {
        if (dareme && option)
            for (let i = 0; i < dareme.options.length; i++)
                if (dareme.options[i].option._id == option._id)
                    setVoters(dareme.options[i].option.voters)
    }, [dareme, option]);

    useEffect(() => {
        if (voteNonSuperfanGif) setTimeout(() => { setVoteNonSuperfanGif(false) }, 4000);
    }, [voteNonSuperfanGif]);

    useEffect(() => {
        if (voteSuperfanGif) setTimeout(() => { setVoteSuperfanGif(false) }, 3500);
    }, [voteSuperfanGif]);

    return (
        <>
            {voteNonSuperfanGif &&
                <Gif gif={VoteNonSuperfanGif} />
            }
            {voteSuperfanGif &&
                <Gif gif={VoteSuperfanGif} />
            }
            <div className="title-header">
                <Title title={contexts.HEADER_TITLE.DONUTS_YOU_LIKE} back={() => {
                    dispatch(daremeAction.checkSupportAndResults(daremeId, optionId, navigate))
                }} />
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
                                    dispatch({ type: SET_CURRENT_DAREME, payload: daremeId });
                                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/${daremeId}/support/${optionId}` });
                                    navigate(`/${user.personalisedUrl}/shop`);
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
                                    dispatch(daremeAction.supportCreator(daremeId, optionId, Number(donuts), navigate));
                                    setIsNonSuperfan(false);
                                    setIsCopied(false);
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
                                    dispatch(daremeAction.supportCreator(daremeId, optionId, Number(donuts), navigate));
                                    setIsSuperFan(false);
                                    setIsCopied(false);
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
                        context={contexts.DIALOG.BODY_LETTER.HAVE_DARED + dareme.owner.name + contexts.DIALOG.BODY_LETTER.ON_PART + dareme.title}
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
                                voters={checkVoted() ? voters : undefined}
                                dareTitle={option.title}
                                username={option.writer.name}
                                disabled={false}
                                canVote={true}
                                leading={false}
                                handleSubmit={() => { }}
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
                                minnum={2}
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
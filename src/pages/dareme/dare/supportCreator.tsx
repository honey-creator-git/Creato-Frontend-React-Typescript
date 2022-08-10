import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { daremeAction } from "../../../redux/actions/daremeActions";
import { SET_DAREME_INITIAL, SET_CURRENT_DAREME, SET_DIALOG_STATE, SET_PREVIOUS_ROUTE } from "../../../redux/types";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
import AvatarLink from "../../../components/dareme/avatarLink";
import Title from "../../../components/general/title";
import DareOption from "../../../components/general/dareOption";
import Dialog from "../../../components/general/dialog";
import ContainerBtn from "../../../components/general/containerBtn";
import Gif from "../../../components/general/gif";
import CONSTANT from "../../../constants/constant";
import { LanguageContext } from "../../../routes/authRoute";
import { HotIcon, LightbulbIcon } from "../../../assets/svg";
import VoteNonSuperfanGif from '../../../assets/img/vote_non_superfan.gif';
import VoteSuperfanGif from '../../../assets/img/vote_superfan.gif';
import '../../../assets/styles/dareme/dare/supportCreatorStyle.scss';

const SupportCreator = () => {
    const { daremeId, optionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const daremeState = useSelector((state: any) => state.dareme);
    const userState = useSelector((state: any) => state.auth);
    const dlgState = useSelector((state: any) => state.load.dlgState);
    const [isTopUp, setIsTopUp] = useState(false);
    const [isFree, setIsFree] = useState(false);
    const [isSuperFan, setIsSuperFan] = useState(false);
    const [isCopyLink, setIsCopyLink] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [openFreeDlg, setOpenFreeDlg] = useState(false);
    const [isSignIn, setIsSignIn] = useState(false);
    const [type, setType] = useState(0);
    const [voters, setVoters] = useState(0);
    const [voteNonSuperfanGif, setVoteNonSuperfanGif] = useState(false);
    const [voteSuperfanGif, setVoteSuperfanGif] = useState(false);
    const option = daremeState.option;
    const dareme = daremeState.dareme;
    const user = userState.user;
    const contexts = useContext(LanguageContext);

    const showDlg = (amount: any) => {
        if (amount === 1) {
            setIsFree(true);
            setType(0);
        }
        else {
            if (amount > user.wallet) setIsTopUp(true);
            else {
                if (dareme.reward) {
                    if (amount === dareme.reward) {
                        setIsSuperFan(true);
                        setType(1);
                    }
                } else {
                    if (amount === 50) {
                        setIsSuperFan(true);
                        setType(1);
                    }
                }
            }
        }
    }

    const checkCanFree = () => {
        if (dareme.options && user) {
            for (let i = 0; i < dareme.options.length; i++)
                for (let j = 0; j < dareme.options[i].option.voteInfo.length; j++) {
                    if (user.id === dareme.options[i].option.voteInfo[j].voter) {
                        if (dareme.options[i].option.voteInfo[j].canFree === false) return false;
                    }
                }
            return true;
        }
        return true;
    }

    const checkVoted = () => {
        if (dareme.options && user) {
            for (let i = 0; i < dareme.options.length; i++) {
                if (dareme.options[i].option.writer._id === user.id) return true
                for (let j = 0; j < dareme.options[i].option.voteInfo.length; j++) {
                    if (user.id === dareme.options[i].option.voteInfo[j].voter)
                        if (dareme.options[i].option.voteInfo[j].donuts > 0) return true;
                }
            }
            return false;
        }
        return false;
    }

    useEffect(() => {
        if (dareme && option)
            for (let i = 0; i < dareme.options.length; i++)
                if (dareme.options[i].option._id === option._id)
                    setVoters(dareme.options[i].option.voters)
    }, [dareme, option]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(daremeAction.getOptionDetails(optionId, daremeId));
        dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
    }, [location, dispatch, optionId, daremeId]);

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
        if (voteNonSuperfanGif) setTimeout(() => { setVoteNonSuperfanGif(false) }, 4000);
    }, [voteNonSuperfanGif]);

    useEffect(() => {
        if (voteSuperfanGif) setTimeout(() => { setVoteSuperfanGif(false) }, 3500);
    }, [voteSuperfanGif]);

    return (
        <div>
            {voteNonSuperfanGif &&
                <Gif gif={VoteNonSuperfanGif} />
            }
            {voteSuperfanGif &&
                <Gif gif={VoteSuperfanGif} />
            }
            <div className="title-header">
                <Title title={contexts.HEADER_TITLE.DAREME_OPTION} back={() => {
                    dispatch({ type: SET_DAREME_INITIAL });
                    navigate(`/dareme/details/${daremeId}`);
                }} />
            </div>
            {(option && dareme.owner) &&
                <>
                    <Dialog
                        display={isSignIn}
                        exit={() => { setIsSignIn(false) }}
                        wrapExit={() => { setIsSignIn(false) }}
                        title={contexts.DIALOG.HEADER_TITLE.SIGN_IN_NOW}
                        context={contexts.DIALOG.BODY_LETTER.SIGN_IN_NOW}
                        buttons={[
                            {
                                text: contexts.DIALOG.BUTTON_LETTER.SIGN_IN,
                                handleClick: () => {
                                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/details/${daremeId}` });
                                    navigate('/auth/signin');
                                }
                            }
                        ]}
                    />
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
                        display={isFree}
                        title={contexts.DIALOG.HEADER_TITLE.VOTE_FREE}
                        exit={() => { setIsFree(false) }}
                        wrapExit={() => { setIsFree(false) }}
                        context={contexts.DIALOG.BODY_LETTER.VOTE_FREE + option.title}
                        buttons={[
                            {
                                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                                handleClick: () => {
                                    dispatch(daremeAction.supportCreator(daremeId, optionId, 1, navigate));
                                    setIsFree(false);
                                    setIsCopied(false);
                                }
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
                        context={(dareme.reward ? dareme.reward : '50') + contexts.DIALOG.BODY_LETTER.VOTE_SUPER + option.title}
                        buttons={[
                            {
                                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                                handleClick: () => {
                                    dispatch(daremeAction.supportCreator(daremeId, optionId, dareme.reward ? dareme.reward : 50, navigate));
                                    setIsSuperFan(false);
                                    setIsCopied(false);
                                }
                            }
                        ]}
                    />
                    <Dialog
                        display={isCopyLink}
                        title={contexts.DIALOG.HEADER_TITLE.HAVE_DARED}
                        avatars={type === 1 ? [
                            dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}`,
                            user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${CONSTANT.SERVER_URL}/${user.avatar}` : ""
                        ] : []}
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
                    <Dialog
                        display={openFreeDlg}
                        exit={() => { setOpenFreeDlg(false) }}
                        wrapExit={() => { setOpenFreeDlg(false) }}
                        title="Oops!"
                        context={contexts.DIALOG.BODY_LETTER.USED_FREE}
                        buttons={[
                            {
                                text: contexts.DIALOG.BUTTON_LETTER.VOTE_NOW,
                                handleClick: () => { setOpenFreeDlg(false); }
                            }
                        ]}
                    />
                    <div className="dareme-support">
                        <div className="dareme-support-videoCardDesktop">
                            <VideoCardDesktop
                                url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
                                sizeType={dareme.sizeType}
                                coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                            />
                            <AvatarLink
                                avatar={dareme.owner.avatar}
                                username={dareme.owner.name}
                                ownerId={dareme.owner._id}
                                handleAvatar={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(dareme.owner.personalisedUrl, navigate)); }}
                                daremeId={dareme._id}
                            />
                        </div>
                        <div>
                            <div className="dareme-support-information">
                                <div className="dareme-support-fun">
                                    <div className="header-choosen">
                                        You have chosen:
                                    </div>
                                    <div className="support-option">
                                        <DareOption
                                            donuts={option.donuts}
                                            voters={checkVoted() ? voters : undefined}
                                            dareTitle={option.title}
                                            username={option.writer.name}
                                            disabled={false}
                                            handleSubmit={() => { }}
                                            canVote={true}
                                            leading={false}
                                        />
                                    </div>
                                    <div className="number-of-donuts">
                                        <span></span>Number of Donuts<span></span>
                                    </div>
                                    <div className="support-fun" onClick={() => {
                                        if (user) {
                                            if (checkCanFree()) showDlg(1);
                                            else setOpenFreeDlg(true);
                                        } else setIsSignIn(true);
                                    }}>
                                        <ContainerBtn text={contexts.SUPPORT_CREATOR.FREE_SUPPORT} styleType="outline" disabled={!checkCanFree()} />
                                    </div>
                                    <div className="support-letter">
                                        <span>Donut x1:</span>
                                    </div>
                                    <div className="support-explain">
                                        <span>
                                            Supporting the creator for Free! This 1 Donut will be donated by Creato!
                                        </span>
                                    </div>
                                    <div className="support-fun" onClick={() => {
                                        if (user) showDlg(dareme.reward ? dareme.reward : 50);
                                        else setIsSignIn(true);
                                    }}>
                                        <ContainerBtn text={`Donut x${dareme.reward ? dareme.reward : 50} (SuperFan!)`} styleType="fill"
                                            icon={[<HotIcon color="white" />, <HotIcon color="white" />]}
                                        />
                                    </div>
                                    <div className="support-letter">
                                        <span>SuperFans:</span>
                                    </div>
                                    <div className="support-explain">
                                        <span>
                                            Support creators by giving specific amount of donut and get exclusive content.
                                        </span>
                                    </div>
                                    <div className="support-fun" onClick={() => {
                                        if (user) navigate('/dareme/' + daremeId + '/support/' + optionId + '/wish')
                                        else setIsSignIn(true)
                                    }}>
                                        <ContainerBtn text={'Donuts as you like!'} styleType="fill" bgColor="#DE5A67"
                                            icon={[<LightbulbIcon color="white" />, <LightbulbIcon color="white" />]}
                                        />
                                    </div>
                                    <div className="support-letter">
                                        <span></span>
                                    </div>
                                    <div className="support-explain">
                                        <span>
                                            Support any number of Donuts as you wish!
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

export default SupportCreator;
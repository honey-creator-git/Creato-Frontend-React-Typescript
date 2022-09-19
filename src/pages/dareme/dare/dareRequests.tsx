import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { daremeAction } from "../../../redux/actions/daremeActions";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
import AvatarLink from "../../../components/dareme/avatarLink";
import CONSTANT from "../../../constants/constant";
import DareOption from "../../../components/general/dareOption";
import Title from "../../../components/general/title";
import Dialog from "../../../components/general/dialog";
import { SET_DAREME_INITIAL } from "../../../redux/types";
import { LanguageContext } from "../../../routes/authRoute";
import '../../../assets/styles/dareme/dare/dareRequestStyle.scss';

const DareRequests = () => {
    const { daremeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const daremeState = useSelector((state: any) => state.dareme);
    const dareme = daremeState.dareme;
    const [isRequest, setIsRequest] = useState(false);
    const [isAccept, setIsAccept] = useState(false);
    const [isDecline, setIsDecline] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [optionId, setOptionId] = useState(null);
    const contexts = useContext(LanguageContext);

    const isDisable = (status: any, time: any) => {
        if (status === -1) return true;
        if (time < 1) return true;
        return false;
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(daremeAction.getDareMeRequests(daremeId));
    }, [location]);

    return (
        <>
            <div className="title-header">
                <Title title={contexts.HEADER_TITLE.DARE_REQUEST} back={() => {
                    dispatch({ type: SET_DAREME_INITIAL });
                    navigate(`/dareme/details/${dareme._id}`)
                }} />
            </div>
            {dareme.owner &&
                <>
                    <div className="dare-request-wrapper">
                        <Dialog
                            title={contexts.DIALOG.HEADER_TITLE.ACCEPT_REQUEST}
                            display={isRequest}
                            exit={() => { setIsRequest(false) }}
                            wrapExit={() => { setIsRequest(false) }}
                            buttons={[
                                {
                                    text: contexts.DIALOG.BUTTON_LETTER.DECLINE,
                                    handleClick: () => {
                                        setIsRequest(false);
                                        setIsDecline(true);
                                        setTimeout(() => setIsDecline(false), 2000);
                                        dispatch(daremeAction.declineDareOption(daremeId, optionId));
                                    }
                                },
                                {
                                    text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                                    handleClick: () => {
                                        setIsRequest(false);
                                        setIsAccept(true);
                                        setIsCopied(false);
                                        dispatch(daremeAction.acceptDareOption(daremeId, optionId));
                                    }
                                }
                            ]}
                            context={contexts.DIALOG.BODY_LETTER.ACCEPT_REQUEST}
                        />
                        <Dialog
                            display={isDecline}
                            wrapExit={() => { setIsDecline(false) }}
                            title={contexts.DIALOG.HEADER_TITLE.DARE_DECLIEND}
                            context={contexts.DIALOG.BODY_LETTER.DARE_DECLINED}
                        />
                        <Dialog
                            display={isAccept}
                            wrapExit={() => { setIsAccept(false); }}
                            title={contexts.DIALOG.HEADER_TITLE.DARE_ACCEPTED}
                            context={contexts.DIALOG.BODY_LETTER.DARE_ACCEPTED}
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
                        />
                        <div className="dare-request-videocCard">
                            <VideoCardDesktop
                                url={CONSTANT.SERVER_URL + "/" + dareme.teaser}
                                sizeType={dareme.sizeType}
                                coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                            />
                            <AvatarLink
                                avatar={dareme.owner.avatar}
                                username={dareme.owner.name}
                                ownerId={dareme.owner._id}
                                handleAvatar={() => { navigate(`/${dareme.owner.personalisedUrl}`) }}
                                daremeId={dareme._id}
                            />
                        </div>
                        <div className="dare-request-info">
                            <div>
                                <div className="request-info-title">{dareme.title}</div>
                                <div className="request-info-reason">
                                    <span>Tap to accept or reject Dare requests.</span>
                                </div>
                                <div className="request-info-letter">
                                    <span>
                                        You can accept up to {dareme.time > 1 ? dareme.options.filter((option: any) => option.option.status === 0).lengthL: 0 } request(s) in total.
                                    </span>
                                </div>
                                <div className="request-info-options scroll-bar">
                                    {
                                        dareme.options.map((option: any, index: any) => (
                                            <div style={{ marginTop: '20px' }} key={index}>
                                                <DareOption
                                                    donuts={option.option.donuts}
                                                    voters={1}
                                                    dareTitle={option.option.title}
                                                    username={option.option.writer.name}
                                                    disabled={isDisable(option.option.status, dareme.time)}
                                                    handleSubmit={() => {
                                                        if (!isDisable(option.option.status, dareme.time)) {
                                                            setOptionId(option.option._id);
                                                            setIsRequest(true);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default DareRequests;
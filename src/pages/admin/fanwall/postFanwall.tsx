import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fanwallAction } from "../../../redux/actions/fanwallActions";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
import VideoCardFanwall from "../../../components/fanwall/videoCardFanwall";
import Title from "../../../components/general/title";
import AvatarLink from "../../../components/dareme/avatarLink";
import ContainerBtn from "../../../components/general/containerBtn";
import Dialog from "../../../components/general/dialog";
import Input from "../../../components/general/input";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_FANWALL, SET_FANWALL_COVERFILE, SET_FANWALL_VIDEOFILE, SET_FANWALL_VIDEO_SIZETYPE } from "../../../redux/types";
import { PlusIcon } from "../../../constants/awesomeIcons";
import { DeleteIcon } from "../../../assets/svg";
import { daremeAction } from "../../../redux/actions/daremeActions";
import { fundmeAction } from "../../../redux/actions/fundmeActions";
import CONSTANT from "../../../constants/constant";
import '../../../assets/styles/fanwall/postFanwallStyle.scss';

const PostFanwall = () => {
    const { itemId } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fanwallState = useSelector((state: any) => state.fanwall);
    const fanwall = fanwallState.fanwall;
    const dareme = useSelector((state: any) => state.dareme.dareme)
    const fundme = useSelector((state: any) => state.fundme.fundme)
    const [searchParams, setSearchParams] = useSearchParams()
    const itemType = searchParams.get("type")

    const [message, setMessage] = useState(fanwall.message ? fanwall.message : "")
    const [embedUrl, setEmbedUrl] = useState(fanwall.embedUrl ? fanwall.embedUrl : "")
    const [type, setType] = useState(0)
    const [videoId, setVideoId] = useState("")
    const [item, setItem] = useState<any>(null)
    const [isPublish, setIsPublish] = useState(false)
    const contexts = useContext(LanguageContext)

    const youtube_parser = (url: any) => {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    }

    const vimeo_parser = (url: any) => {
        var regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
        var match = url.match(regExp);
        return match ? match[5] : false;
    }

    const publishFanwall = () => {
        setIsPublish(false);
        dispatch(fanwallAction.saveFanwall({
            id: null,
            video: fanwallState.videoFile,
            sizeType: fanwallState.videoSizeType,
            cover: fanwallState.coverFile,
            message: message,
            embedUrl: embedUrl,
            posted: true,
            type: itemType === 'DareMe' ? 'dareme' : 'fundme',
            admin: true,
        }, item._id, navigate));
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        if (embedUrl !== "") {
            if (embedUrl.indexOf("youtu") && youtube_parser(embedUrl)) {
                setType(1);
                setVideoId(youtube_parser(embedUrl));
            } else if (embedUrl.indexOf("vimeo") && vimeo_parser(embedUrl)) {
                setType(2);
                setVideoId(vimeo_parser(embedUrl));
            } else {
                setType(0);
            }
        }
    }, [embedUrl]);

    useEffect(() => {
        if (fundme.owner || dareme.owner) {
            if (itemType === 'DareMe') setItem(dareme)
            else setItem(fundme)
        }
    }, [dareme, fundme])

    useEffect(() => {
        if (itemType) {
            if (itemType === 'DareMe') dispatch(daremeAction.getDareMeDetails(itemId))
            else if (itemType === 'FundMe') dispatch(fundmeAction.getFundMeDetails(itemId))
        }
    }, [itemType])

    return (
        <>
            <div className="title-header">
                <Title title={contexts.HEADER_TITLE.POSTING_ON_FANWALL} back={() => navigate('/admin/fanwalls')} />
            </div>
            {item &&
                <div className="dareme-post-fanwall">
                    <Dialog
                        display={isPublish}
                        exit={() => { setIsPublish(false) }}
                        wrapExit={() => { setIsPublish(false) }}
                        title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
                        context={contexts.DIALOG.BODY_LETTER.CAN_EDIT_AFTER_POSTING}
                        buttons={[
                            {
                                text: contexts.DIALOG.BUTTON_LETTER.PUBLISH,
                                handleClick: () => { publishFanwall() }
                            }
                        ]}
                    />
                    <div className="dareme-post-fanwall-videoCardDesktop">
                        <VideoCardDesktop
                            url={item.teaser ? `${process.env.REACT_APP_SERVER_URL}/${item?.teaser}` : ""}
                            sizeType={item.sizeType}
                            coverImage={item.cover ? `${process.env.REACT_APP_SERVER_URL}/${item?.cover}` : ""}
                        />
                        <AvatarLink
                            username={item.owner?.name}
                            avatar={item.owner?.avatar ? item.owner?.avatar : ''}
                            ownerId={item.owner?._id}
                            handleAvatar={() => { navigate(`/${item.owner?.personalisedUrl}`) }}
                            itemId={item._id}
                        />
                    </div>
                    <div className="dare-post-fanwall-info scroll-bar">
                        <div className="dare-post-fanwall-main">
                            <div className="reward-name">
                                {itemType === 'DareMe' &&
                                    <span>{item?.options?.filter((option: any) => option.option.win === true)[0]?.option?.title}</span>
                                }
                                {itemType === 'FundMe' &&
                                    <span>{item.title}</span>
                                }
                            </div>
                            <div>
                                <Input
                                    type="input"
                                    placeholder={contexts.POSTING_ON_FANWALL.URL_PLACEHOLDER}
                                    setTitle={setEmbedUrl}
                                    title={embedUrl}
                                    setFocus={() => { }}
                                    size="small"
                                />
                            </div>
                            <div className="preview-video" style={{ marginTop: '5px' }}>
                                {
                                    type === 0 ?
                                        embedUrl === "" ? <></> :
                                            <div className="letter-unable">Unable to preivew</div>
                                        :
                                        type === 1 ?
                                            <>
                                                <div className="delete-icon" onClick={() => { setEmbedUrl(""); }}>
                                                    <DeleteIcon color="#BAB6B5" />
                                                </div>
                                                <img
                                                    width="100%"
                                                    height="100%"
                                                    src={"https://i.ytimg.com/vi/" + videoId + "/sddefault.jpg"}
                                                    onError={({ currentTarget }) => {
                                                        currentTarget.onerror = null;
                                                        setType(0);
                                                    }}
                                                    alt="Youtube"
                                                />
                                            </>
                                            :
                                            <>
                                                <div className="delete-icon" onClick={() => { setEmbedUrl(""); }}>
                                                    <DeleteIcon color="#BAB6B5" />
                                                </div>
                                                <img
                                                    width="100%"
                                                    height="100%"
                                                    src={"https://vumbnail.com/" + videoId + ".jpg"}
                                                    onError={({ currentTarget }) => {
                                                        currentTarget.onerror = null;
                                                        setType(0);
                                                    }}
                                                    alt="Vimeo"
                                                />
                                            </>

                                }
                            </div>
                            <div className="reward-name" style={{ marginTop: '20px' }}>
                                {contexts.POSTING_ON_FANWALL.FOR_SUPERFAN_ONLY}
                            </div>
                            {fanwallState.videoFile ?
                                <div className="post-video">
                                    <VideoCardFanwall
                                        url={fanwallState.videoFile?.preview ? fanwallState.videoFile.preview : ""}
                                        coverImage={fanwallState.coverFile?.preview ? fanwallState.coverFile.preview : ""}
                                        sizeType={fanwallState.videoSizeType ? fanwallState.videoSizeType : false}
                                    />
                                    <div className="delete-icon" onClick={() => {
                                        dispatch({ type: SET_FANWALL_COVERFILE, payload: null })
                                        dispatch({ type: SET_FANWALL_VIDEOFILE, payload: null })
                                        dispatch({ type: SET_FANWALL_VIDEO_SIZETYPE, payload: null })
                                    }}>
                                        <DeleteIcon color="#BAB6B5" />
                                    </div>
                                </div>
                                :
                                <div onClick={() => {
                                    const state = { ...fanwall, message: message, embedUrl: embedUrl };
                                    dispatch({ type: SET_FANWALL, payload: { fanwall: state } })
                                    navigate(`/admin/fanwalls/details/upload?post=true&itemId=${item._id}&type=${itemType}`)
                                }}>
                                    <ContainerBtn
                                        text={contexts.POSTING_ON_FANWALL.EXCLUSIVE_VIDEO}
                                        icon={[<PlusIcon />, <PlusIcon />]}
                                    />
                                </div>
                            }
                            <div style={{ marginTop: '15px', marginBottom: '20px' }}>
                                <Input
                                    label={contexts.POSTING_ON_FANWALL.MESSAGE_TO_FANS}
                                    placeholder={contexts.POSTING_ON_FANWALL.MESSAGE_PLACEHOLDER}
                                    setTitle={setMessage}
                                    wordCount={150}
                                    title={message}
                                    type="textarea"
                                    setFocus={() => { }}
                                />
                            </div>
                            <div
                                style={{ marginTop: '40px' }}
                                onClick={() => { if (fanwallState.videoFile && message !== "" && embedUrl !== "") setIsPublish(true) }}
                            >
                                <ContainerBtn
                                    disabled={fanwallState.videoFile && message !== "" && embedUrl !== "" ? false : true}
                                    text={contexts.POSTING_ON_FANWALL.POST_NOW}
                                    styleType="fill"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default PostFanwall;
import { useState, useEffect, useRef, useLayoutEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import Dialog from "../../../components/general/dialog";
import Title from "../../../components/general/title";
import ContainerBtn from "../../../components/general/containerBtn";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_LOADING_TRUE, SET_LOADING_FALSE, SET_COVER_FILE1, SET_FUNDME } from "../../../redux/types";
import CONSTANT from "../../../constants/constant";
import "../../../assets/styles/dareme/create/coverImageStyle.scss";

const useWindowSize = () => {
    const [size, setSize] = useState(0);
    useLayoutEffect(() => {
        function updateSize() {
            setSize(window.innerWidth);
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
};

const FundCoverImage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fundmeStore = useSelector((state: any) => state.fundme);
    const fundmeState = fundmeStore.fundme;
    const contexts = useContext(LanguageContext);
    const [open, setOpen] = useState<boolean>(false);
    const [thumbNumber, setThumbNumber] = useState(0);
    const [seekCnt, setSeekCnt] = useState(0);
    const [duration, setDuration] = useState<any>(null);
    const [teaserFileFromURL, setTeaserFileFromURL] = useState<any>(null);
    const [seletedIndex, setSelectedIndex] = useState(fundmeState.coverIndex ? fundmeState.coverIndex : -1);
    const [videoThumb, setVideoThumb] = useState("");
    const width = useWindowSize();
    const [thumbnails, setThumbnails] = useState<any>([]);
    const playerRef = useRef<ReactPlayer>(null);

    const getCoverURL = () => {
        let canvas = document.createElement("canvas") as HTMLCanvasElement;
        const video: any = document.getElementById("element")?.firstChild;
        let context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0);
        let url = canvas.toDataURL('image/png');
        return url;
    }

    useEffect(() => {
        if (duration > 0) {
            if (duration > 10) setThumbNumber(20);
            else setThumbNumber(10);
        }
    }, [duration]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (fundmeState.teaser && fundmeStore.teaserFile === null) {
            fetch(`${process.env.REACT_APP_SERVER_URL}/${fundmeState.teaser}`)
                .then(res => res.blob())
                .then(blob => {
                    const extension = fundmeState.teaser.slice(-3);
                    const file = new File([blob], `VIDEO.${extension}`, blob);
                    const teaserFile = Object.assign(file, { preview: URL.createObjectURL(file) });
                    setTeaserFileFromURL(teaserFile);
                });
        }
    }, []);

    useEffect(() => {
        if (thumbNumber > 0) {
            dispatch({ type: SET_LOADING_TRUE });
            playerRef.current?.seekTo(0);
        }
    }, [thumbNumber]);

    useEffect(() => {
        if (seekCnt > 0 && seekCnt <= thumbNumber) {
            let thumbs = thumbnails;
            let period = duration / thumbNumber;
            let url = getCoverURL();
            thumbs.push(url);
            if (seletedIndex > 0 && thumbnails.length === seletedIndex + 1) setVideoThumb(url);
            setThumbnails(thumbs);
            playerRef.current?.seekTo(period * seekCnt);
        }
        if (seekCnt === (thumbNumber + 1)) dispatch({ type: SET_LOADING_FALSE });
    }, [seekCnt]);

    return (
        <>
            <div className="title-header">
                <Title
                    title={contexts.HEADER_TITLE.CHOOSE_COVER}
                    back={() => {
                        const url = width > 880 ? "/fundme/create" : "/fundme/create/teaser";
                        if (seletedIndex === -1) navigate(url);
                        else setOpen(true);
                    }}
                />
            </div>
            <div className="cover-image-wrapper">
                <Dialog
                    title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
                    display={open}
                    wrapExit={() => { setOpen(false); }}
                    exit={() => { setOpen(false); }}
                    context={contexts.DIALOG.BODY_LETTER.SAVE_DRAFT}
                    buttons={[
                        {
                            text: `${contexts.DIALOG.BUTTON_LETTER.SAVE_DRAFT}`,
                            handleClick: () => {
                                const url = width > 880 ? "/fundme/create" : "/fundme/create/teaser";
                                if (seletedIndex === -1) alert("You should select Cover image");
                                else {
                                    if (seletedIndex !== fundmeState.coverIndex) {
                                        fetch(thumbnails[seletedIndex])
                                            .then(res => res.blob())
                                            .then(blob => {
                                                const file = new File([blob], 'dot.png', blob);
                                                const imageFile = Object.assign(file, { preview: thumbnails[seletedIndex] });
                                                const state = { ...fundmeState, coverIndex: seletedIndex, cover: null };
                                                dispatch({ type: SET_FUNDME, payload: state });
                                                dispatch({ type: SET_COVER_FILE1, payload: imageFile });
                                                navigate(url);
                                            });
                                    } else navigate(url);
                                }
                            }
                        }
                    ]}
                />
                <div className="video-wrapper">
                    <video
                        poster={videoThumb}
                        style={fundmeState.sizeType ? { width: 'auto', height: '100%' } : { width: '100%', height: 'auto' }}
                        src={fundmeStore.teaserFile ? fundmeStore.teaserFile?.preview : fundmeState.teaser ? teaserFileFromURL?.preview : ""}
                    />
                </div>
                <ReactPlayer
                    hidden
                    id="element"
                    ref={playerRef}
                    url={fundmeStore.teaserFile ? fundmeStore.teaserFile?.preview : fundmeState.teaser ? teaserFileFromURL?.preview : ""}
                    onReady={() => { setDuration(playerRef.current?.getDuration()) }}
                    onSeek={() => { if (seekCnt <= thumbNumber) setSeekCnt(seekCnt + 1); }}
                />
                <div className="thumbnail-wrapper scroll-bar">
                    {thumbnails.map((item: any, index: any) => {
                        return (
                            <div className="second-thumb-wrapper" key={index}>
                                <div className={`thumbnail-item ${(seletedIndex === index || index === fundmeState.coverIndex) ? 'active' : ''}`}>
                                    <img
                                        src={item}
                                        style={{ height: '100%', cursor: "pointer" }}
                                        alt="Item"
                                        onClick={() => {
                                            setVideoThumb(item);
                                            setSelectedIndex(index);
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="btn-done" onClick={() => {
                    if (seletedIndex !== -1) {
                        const url = width > 880 ? "/fundme/create" : "/fundme/create/teaser";
                        if (seletedIndex !== fundmeState.coverIndex) {
                            fetch(thumbnails[seletedIndex])
                                .then(res => res.blob())
                                .then(blob => {
                                    const file = new File([blob], 'dot.png', blob);
                                    const imageFile = Object.assign(file, { preview: thumbnails[seletedIndex] });
                                    const state = { ...fundmeState, coverIndex: seletedIndex, cover: null };
                                    dispatch({ type: SET_FUNDME, payload: state });
                                    dispatch({ type: SET_COVER_FILE1, payload: imageFile });
                                    navigate(url);
                                });
                        } else navigate(url);
                    } else alert("Please select Cover Image");
                }}>
                    <ContainerBtn text={contexts.CHOOSE_COVER_LETTER.DONE} styleType="fill" />
                </div>
            </div>
        </>
    );
};

export default FundCoverImage;

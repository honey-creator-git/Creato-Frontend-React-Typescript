import { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import Title from "../../../components/general/title";
import Button from "../../../components/general/button";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
// import AvatarLink from "../../../components/dareme/AvatarLink";
import DareOption from "../../../components/general/dareOption";
import CategoryBtn from "../../../components/general/categoryBtn";
import Dialog from "../../../components/general/dialog";
import CONSTANT from "../../../constants/constant";
import { daremeAction } from "../../../redux/actions/daremeActions";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_ADMIN_CATEGORY, SET_ADMIN_TEASER_SIZE_TYPE, SET_TEASER_FILE, SET_COVER_FILE } from "../../../redux/types";
import { VisibleIcon, HiddenIcon, DeleteIcon } from "../../../assets/svg";
import "../../../assets/styles/admin/dareme/adminDareMeDetailStyle.scss";

const DareMeDetails = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { daremeId } = useParams();
    const contexts = useContext(LanguageContext);
    const daremeState = useSelector((state: any) => state.dareme);
    const [isOpenDeleteDlg, setIsOpenDeleteDlg] = useState(false);
    const [openCategoryMenu, setOpenCategoryMenu] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const categoryDropDownMenuheight = openCategoryMenu === true ? contexts.DAREME_CATEGORY_LIST.length * 40 + 20 : 0;
    const dareme = daremeState.dareme;

    const handleUploadVideo = (e: any) => {
        const { files } = e.target;
        const loadFile = Object.assign(files[0], { preview: URL.createObjectURL(files[0]) });
        window.URL = window.URL || window.webkitURL;
        if (files.length) {
            if (files[0].size < CONSTANT.MAX_TEASER_FILE_SIZE) {
                const video = document.createElement('video');
                video.preload = "metadata";
                video.onloadeddata = evt => {
                    window.URL.revokeObjectURL(video.src);
                    const size = video.videoWidth / video.videoHeight;
                    const type = size >= 0.65;
                    dispatch({ type: SET_ADMIN_TEASER_SIZE_TYPE, payload: type });
                    dispatch({ type: SET_TEASER_FILE, payload: loadFile });
                }
                video.src = URL.createObjectURL(loadFile);
            } else alert("The file size is over 30M");
        }
    };

    const calc = (time: any) => {
        if (time > 1) return Math.ceil(time) + " days";
        if ((time * 24) > 1) return Math.ceil(time * 24) + " hours";
        if ((time * 24 * 60) > 1) return Math.ceil(time * 24 * 60) + " mins";
        if (time > 0) return "1 min";
        else return "Ended";
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(daremeAction.getDaremeDetails(daremeId));
    }, [location]);

    return (
        <div className="admin-dareme-detail-wrapper" onClick={() => { setOpenCategoryMenu(false); }}>
            <Title title="DareMe Details"
                back={() => { navigate('/admin/daremes') }} del={true} hint={() => { setIsOpenDeleteDlg(true) }} />
            {dareme.owner &&
                <>
                    <Dialog
                        display={isOpenDeleteDlg}
                        title="Delete"
                        exit={() => { setIsOpenDeleteDlg(false) }}
                        wrapExit={() => { setIsOpenDeleteDlg(false) }}
                        context="Delete forever?"
                        buttons={[
                            {
                                text: "Cancel",
                                handleClick: () => { setIsOpenDeleteDlg(false) }
                            },
                            {
                                text: "Delete",
                                handleClick: () => {
                                    setIsOpenDeleteDlg(false);
                                    dispatch(daremeAction.deleteDareMe(dareme._id, navigate))
                                }
                            }
                        ]}
                    />
                    <div className="dareme-detail">
                        <div className="dareme-detail-videocard">
                            <VideoCardDesktop
                                url={daremeState.teaserFile ? daremeState.teaserFile.preview : CONSTANT.SERVER_URL + "/" + dareme.teaser}
                                sizeType={daremeState.teaserSizeType !== null ? daremeState.teaserSizeType : dareme.sizeType}
                                coverImage={daremeState.coverFile ? daremeState.coverFile.preview : daremeState.teaserFile ? "" : dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                            />
                            <ReactPlayer
                                id="element"
                                hidden
                                url={daremeState.teaserFile ? daremeState.teaserFile.preview : ""}
                            />
                            <div className="change-teaser-btn">
                                <Button text="Change teaser" shape="rounded" fillStyle="fill" color="primary" width="100%" handleSubmit={() => { fileInputRef.current?.click() }} />
                            </div>
                            <input
                                type="file"
                                value={""}
                                ref={fileInputRef}
                                onChange={handleUploadVideo}
                                hidden
                                accept="video/*"
                            />
                        </div>
                        <div className="dareme-detail-info">
                            <div style={{ marginBottom: '15px' }}>
                                <Button
                                    shape="pill"
                                    color="primary"
                                    text={dareme.finished ? "Ended" : calc(dareme.time)}
                                    fillStyle="fill"
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <Button
                                    shape="pill"
                                    color="primary"
                                    text={daremeState.title ? `${daremeState.title.substring(0, 15)}${daremeState.title.length > 15 ? "..." : ""}`
                                        : `${dareme.title.substring(0, 15)}${dareme.title.length > 15 ? "..." : ""}`}
                                    fillStyle="fill"
                                    handleSubmit={() => { navigate(`${location.pathname}/title`); }}
                                />
                            </div>
                            <div className="category-btn" onClick={(e) => {
                                e.stopPropagation();
                                setOpenCategoryMenu(!openCategoryMenu);
                            }}>
                                <CategoryBtn
                                    text={contexts.DAREME_CATEGORY_LIST[daremeState.category ? daremeState.category - 1 : dareme.category - 1]}
                                    color="primary"
                                />
                                <div
                                    className="drop-down-lists"
                                    style={{ height: `${categoryDropDownMenuheight}px` }}
                                >
                                    {contexts.DAREME_CATEGORY_LIST.map((category: any, i: any) => (
                                        <div
                                            className="list"
                                            key={i}
                                            onClick={() => {
                                                dispatch({ type: SET_ADMIN_CATEGORY, payload: i + 1 });
                                                setOpenCategoryMenu(!openCategoryMenu);
                                            }}
                                        >
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="dare-options scroll-bar">
                                {
                                    dareme.options.filter((option: any) => option.option.status === 1).map((option: any, index: any) => (
                                        <div className="dare-option" key={index}>
                                            <div className="dare">
                                                <DareOption
                                                    dareTitle={index > 1 ? option.option.title : daremeState.options.length ? daremeState.options[index].option.title : option.option.title}
                                                    donuts={option.option.donuts}
                                                    voters={1}
                                                    disabled={false}
                                                    username={option.option.writer.name}
                                                    handleSubmit={() => {
                                                        if (index < 2) navigate(`/admin/daremes/details/${daremeId}/options`);
                                                    }}
                                                />
                                            </div>
                                            <div className="del-icon">
                                                {index > 1 &&
                                                    <div onClick={() => { dispatch(daremeAction.deleteOption(daremeId, option.option._id)) }}>
                                                        <DeleteIcon color="#efa058" />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="visible-icon" onClick={() => { dispatch(daremeAction.setDareMeShow(!dareme.show, dareme._id, dareme)) }}>
                        {dareme.show ? <VisibleIcon color="#EFA058" /> : <HiddenIcon color="#EFA058" />}
                    </div>
                    <div className="save-button" onClick={() => {
                        let title = daremeState.title ? daremeState.title : dareme.title;
                        let category = daremeState.category ? daremeState.category : dareme.category;
                        let options = daremeState.options.length > 0 ?
                            !(daremeState.options[0].option.title === dareme.options[0].option.title && daremeState.options[1].option.title === dareme.options[1].option.title) ?
                                daremeState.options : null : null;
                        let teaserFile = daremeState.teaserFile ? daremeState.teaserFile : null;
                        let coverFile = daremeState.coverFile ? daremeState.coverFile : null;
                        if (teaserFile) {
                            const video: any = document.getElementById("element")?.firstChild;
                            let canvas = document.createElement("canvas") as HTMLCanvasElement;
                            let context = canvas.getContext('2d');
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            context?.drawImage(video, 0, 0);
                            let url = canvas.toDataURL('image/png');
                            fetch(url)
                                .then(res => res.blob())
                                .then(blob => {
                                    const file = new File([blob], 'dot.png', blob);
                                    const imageFile = Object.assign(file, { preview: url });
                                    dispatch({ type: SET_COVER_FILE, payload: imageFile });
                                    dispatch(daremeAction.updateDareMe(daremeId, {
                                        title: title, category: category, options: options, teaserFile: teaserFile, coverFile: imageFile, teaserType: daremeState.teaserSizeType
                                    }, navigate));
                                });
                        } else {
                            dispatch(daremeAction.updateDareMe(daremeId, {
                                title: title, category: category, options: options, teaserFile: teaserFile, coverFile: coverFile, teaserType: daremeState.teaserSizeType
                            }, navigate));
                        }
                    }}>
                        <Button text="Save" color="primary" fillStyle="fill" shape="rounded" />
                    </div>
                </>
            }
        </div>
    )
}

export default DareMeDetails;
import { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import Title from "../../../components/general/title";
import Button from "../../../components/general/button";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
// import AvatarLink from "../../../components/dareme/AvatarLink";
import CategoryBtn from "../../../components/general/categoryBtn";
import Dialog from "../../../components/general/dialog";
import CONSTANT from "../../../constants/constant";
import { fundmeAction } from "../../../redux/actions/fundmeActions";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_ADMIN_CATEGORY, SET_ADMIN_TEASER_SIZE_TYPE, SET_TEASER_FILE1, SET_COVER_FILE1 } from "../../../redux/types";
import { VisibleIcon, HiddenIcon, DeleteIcon } from "../../../assets/svg";
import "../../../assets/styles/admin/dareme/adminDareMeDetailStyle.scss";

const FundMeDetails = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { fundmeId } = useParams();
    const contexts = useContext(LanguageContext);
    const fundmeState = useSelector((state: any) => state.fundme);
    const [isOpenDeleteDlg, setIsOpenDeleteDlg] = useState(false);
    const [openCategoryMenu, setOpenCategoryMenu] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const categoryDropDownMenuheight = openCategoryMenu === true ? contexts.FUNDME_CATEGORY_LIST.length * 40 + 20 : 0;
    const fundme = fundmeState.fundme;

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
                    dispatch({ type: SET_TEASER_FILE1, payload: loadFile });
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
        dispatch(fundmeAction.getFundmeDetails(fundmeId));
    }, [location]);

    return (
        <div className="admin-dareme-detail-wrapper" onClick={() => { setOpenCategoryMenu(false); }}>
            <Title title="FundMe Details"
                back={() => { navigate('/admin/fundmes') }} del={true} hint={() => { setIsOpenDeleteDlg(true) }} />
            {fundme.owner &&
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
                                    dispatch(fundmeAction.deleteFundMe(fundme._id, navigate))
                                }
                            }
                        ]}
                    />
                    <div className="dareme-detail">
                        <div className="dareme-detail-videocard">
                            <VideoCardDesktop
                                url={fundmeState.teaserFile ? fundmeState.teaserFile.preview : CONSTANT.SERVER_URL + "/" + fundme.teaser}
                                sizeType={fundmeState.teaserSizeType !== null ? fundmeState.teaserSizeType : fundme.sizeType}
                                coverImage={fundmeState.coverFile ? fundmeState.coverFile.preview : fundmeState.teaserFile ? "" : fundme.cover ? `${CONSTANT.SERVER_URL}/${fundme.cover}` : ""}
                            />
                            <ReactPlayer
                                id="element"
                                hidden
                                url={fundmeState.teaserFile ? fundmeState.teaserFile.preview : ""}
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
                                    text={fundme.finished ? "Ended" : calc(fundme.time)}
                                    fillStyle="fill"
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <Button
                                    shape="pill"
                                    color="primary"
                                    text={fundmeState.title ? `${fundmeState.title.substring(0, 15)}${fundmeState.title.length > 15 ? "..." : ""}`
                                        : `${fundme.title.substring(0, 15)}${fundme.title.length > 15 ? "..." : ""}`}
                                    fillStyle="fill"
                                    handleSubmit={() => { navigate(`${location.pathname}/title`); }}
                                />
                            </div>
                            <div className="category-btn" onClick={(e) => {
                                e.stopPropagation();
                                setOpenCategoryMenu(!openCategoryMenu);
                            }}>
                                <CategoryBtn
                                    text={contexts.FUNDME_CATEGORY_LIST[fundmeState.category ? fundmeState.category - 1 : fundme.category - 1]}
                                    color="primary"
                                />
                                <div
                                    className="drop-down-lists"
                                    style={{ height: `${categoryDropDownMenuheight}px` }}
                                >
                                    {contexts.FUNDME_CATEGORY_LIST.map((category: any, i: any) => (
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
                        </div>
                    </div>
                    <div className="visible-icon" onClick={() => { dispatch(fundmeAction.setFundMeShow(!fundme.show, fundme._id, fundme)) }}>
                        {fundme.show ? <VisibleIcon color="#EFA058" /> : <HiddenIcon color="#EFA058" />}
                    </div>
                    <div className="save-button" onClick={() => {
                        let title = fundmeState.title ? fundmeState.title : fundme.title;
                        let category = fundmeState.category ? fundmeState.category : fundme.category;
                        let teaserFile = fundmeState.teaserFile ? fundmeState.teaserFile : null;
                        let coverFile = fundmeState.coverFile ? fundmeState.coverFile : null;
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
                                    dispatch({ type: SET_COVER_FILE1, payload: imageFile });
                                    dispatch(fundmeAction.updateFundMe(fundmeId, {
                                        title: title, category: category, teaserFile: teaserFile, coverFile: imageFile, teaserType: fundmeState.teaserSizeType
                                    }, navigate));
                                });
                        } else {
                            dispatch(fundmeAction.updateFundMe(fundmeId, {
                                title: title, category: category, teaserFile: teaserFile, coverFile: coverFile, teaserType: fundmeState.teaserSizeType
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

export default FundMeDetails;
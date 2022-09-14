import { useState, useRef, useLayoutEffect, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { daremeAction } from "../../../redux/actions/daremeActions";
import Title from "../../../components/general/title";
import Button from "../../../components/general/button";
import CategoryBtn from "../../../components/general/categoryBtn";
import ContainerBtn from "../../../components/general/containerBtn";
import DareOption from "../../../components/general/dareOption";
import Dialog from "../../../components/general/dialog";
import CONSTANT from "../../../constants/constant";
import Hint from "../../../components/general/hint";
import { SET_COVER_FILE, SET_DAREME, SET_DIALOG_STATE, SET_TEASER_FILE } from "../../../redux/types";
import { LanguageContext } from "../../../routes/authRoute";
import { AddIcon, EditIcon, PlayIcon, RewardIcon } from "../../../assets/svg";
import "../../../assets/styles/dareme/create/createDaremeStyle.scss";

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

const CreateDareme = () => {
  const contexts = useContext(LanguageContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const daremeStore = useSelector((state: any) => state.dareme);
  const userState = useSelector((state: any) => state.auth);
  const loadState = useSelector((state: any) => state.load);
  const daremeState = daremeStore.dareme;
  const dlgState = loadState.dlgState;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const [openCategoryDlg, setOpenCategoryDlg] = useState<boolean>(false);
  const [titleDlgOpen, setTitleDlgOpen] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openHint, setOpenHint] = useState<boolean>(false);
  const [deadline, setDeadline] = useState(0);
  const [category, setCategory] = useState(0);
  const [openDeadlineMenu, setOpenDeadlineMenu] = useState<boolean>(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState<boolean>(false);
  const [openErase, setOpenErase] = useState<boolean>(false);
  const width = useWindowSize();
  const [play, setPlay] = useState(false);
  const [prevBtn, setPrevBtn] = useState(false);
  const user = userState.user;
  const deadelineDlgPositionTop = titleDlgOpen === false ? "100%" : "calc(100% - 195px)";
  const dareTitleDlgPositionTop = openCategoryDlg === false ? "100%" : "calc(100% - 195px)";
  const deadlineDropDownMenuheight = openDeadlineMenu === true ? contexts.DAREME_DEADLINE_LIST.length * 40 + 20 : 0;
  const categoryDropDownMenuheight = openCategoryMenu === true ? contexts.DAREME_CATEGORY_LIST.length * 40 + 20 : 0;
  const prevRoute = useSelector((state: any) => state.load.prevRoute);

  const handledeadlineDlgOpen = (e: any) => {
    setTitleDlgOpen(!titleDlgOpen);
  };
  const handleDareopenCategoryDlg = () => {
    setOpenCategoryDlg(true);
  };

  const handleUploadVideo = (e: any) => {
    const { files } = e.target;
    const loadFile = Object.assign(files[0], { preview: URL.createObjectURL(files[0]) });
    window.URL = window.URL || window.webkitURL;
    if (files.length) {
      if (files[0].size < CONSTANT.MAX_TEASER_FILE_SIZE) {
        const video = document.createElement('video');
        video.preload = "metadata";
        video.onloadedmetadata = evt => {
          const size = video.videoWidth / video.videoHeight;
          const type = size >= 0.583;
          const state = { ...daremeState, sizeType: type };
          dispatch({ type: SET_DAREME, payload: state });
          dispatch({ type: SET_TEASER_FILE, payload: loadFile });
        }
        video.src = URL.createObjectURL(loadFile);
      } else alert("The file size is over 30M");
    }
  };

  const Preview = () => {
    if (daremeState.reward === null) return false;
    if (daremeState.rewardText === null) return false;
    if (daremeState.title === null) return false;
    if (daremeState.deadline === null) return false;
    if (daremeState.category === null) return false;
    if (daremeState.teaser === null && daremeStore.teaserFile === null) return false;
    if (!daremeState.options.length) return false;
    else {
      if (
        daremeState.options[0].option.title === undefined ||
        daremeState.options[0].option.title === ""
      )
        return false;
      if (
        daremeState.options[1].option.title === undefined ||
        daremeState.options[1].option.title === ""
      )
        return false;
    }
    return true;
  };

  const getFirstFrame = (type: any) => {
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
        if (type === 0) dispatch(daremeAction.saveDareme(daremeState, daremeStore.teaserFile, daremeStore.coverFile, navigate, prevRoute));
        else dispatch(daremeAction.saveDareme(daremeState, daremeStore.teaserFile, imageFile, navigate, "/dareme/preview"));
      });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    setPrevBtn(Preview());
  }, [daremeState]);

  useEffect(() => {
    if (dlgState.type === "createDareMe" && dlgState.state === true) {
      setOpen(true);
      dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
    }
  }, [dlgState]);

  return (
    <>
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.CREATE_DAREME}
          back={() => {
            if ((daremeState.teaser === null && daremeStore.teaserFile === null)
              && daremeState.deadline === null
              && daremeState.category === null
              && daremeState.title === null
              && (daremeState.options.length === 0 || (daremeState.options.length > 0 && daremeState.options[0].option.title === null && daremeState.options[1].option.title === null)))
              navigate(prevRoute);
            else setOpen(true);
          }}
          hint={() => { setOpenHint(true); }}
        />
      </div>
      <div className="create-dareme-wrapper" onClick={() => {
        setOpenCategoryMenu(false);
        setOpenDeadlineMenu(false);
      }}>
        <Hint
          style={{ left: "calc(100% - 336px)" }}
          open={openHint}
          exit={() => { setOpenHint(false); }}
          color="#059669"
          title={contexts.HINT.TITLE.WHAT_IS_DAREME}
          context={contexts.HINT.BODY_LETTER.WHAT_IS_DAREME}
        />
        <Dialog
          title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
          display={open}
          context={contexts.DIALOG.BODY_LETTER.SAVE_DRAFT}
          exit={() => { setOpen(false); }}
          wrapExit={() => { setOpen(false); }}
          buttons={[
            {
              text: `${contexts.DIALOG.BUTTON_LETTER.SAVE_DRAFT}`,
              handleClick: () => {
                setOpen(false);
                const video: any = document.getElementById("element")?.firstChild;

                if (daremeStore.coverFile === null && daremeState.cover === null && video) getFirstFrame(0);
                else dispatch(daremeAction.saveDareme(daremeState, daremeStore.teaserFile, daremeStore.coverFile, navigate, prevRoute));
              }
            }
          ]}
        />
        <Dialog
          title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
          display={openErase}
          exit={() => { setOpenErase(false) }}
          wrapExit={() => { setOpenErase(false) }}
          context={contexts.DIALOG.BODY_LETTER.ERASE_DATA}
          buttons={[
            {
              text: `${contexts.DIALOG.BUTTON_LETTER.CONFIRM}`,
              handleClick: () => {
                dispatch(daremeAction.eraseDraft(daremeState._id));
                setOpenErase(false);
              }
            }
          ]}
        />
        {width > 880 && (
          <div className="create-dareme-desktop">
            <div className="card">
              <div className="video" onClick={() => { if (play) setPlay(false); }}>
                {(!play && (daremeStore.coverFile !== null || (daremeState.cover !== null && daremeStore.teaserFile === null))) &&
                  <div className="cover-image">
                    <img
                      src={daremeStore.coverFile ? daremeStore.coverFile.preview : daremeState.cover ? `${CONSTANT.SERVER_URL}/${daremeState.cover}` : ""}
                      alt="cover Image"
                      style={daremeState.sizeType ? { width: 'auto', height: '100%' } : { width: '100%', height: 'auto' }} />
                  </div>
                }
                {(play || (daremeStore.coverFile === null && daremeState.cover === null) || (daremeState.cover !== null && daremeStore.teaserFile !== null)) &&
                  <div className="video-wrapper">
                    <ReactPlayer
                      className={daremeState.sizeType ? "react-player-height" : "react-player-width"}
                      url={daremeStore.teaserFile ? daremeStore.teaserFile.preview : daremeState.teaser ? `${CONSTANT.SERVER_URL}/${daremeState.teaser}` : ""}
                      playing={play}
                      ref={playerRef}
                      onProgress={(progress) => {
                        if (progress.playedSeconds >= progress.loadedSeconds) playerRef.current?.seekTo(0);
                        if (progress.playedSeconds > 20) playerRef.current?.seekTo(0);
                      }}
                    />
                  </div>
                }
                <ReactPlayer
                  hidden
                  id="element"
                  url={daremeStore.teaserFile ? daremeStore.teaserFile.preview : daremeState.teaser ? `${CONSTANT.SERVER_URL}/${daremeState.teaser}` : ""}
                />
                {((daremeState.teaser || daremeStore.teaserFile) && !play) &&
                  <div className="play-icon">
                    <Button
                      fillStyle="fill"
                      color="primary"
                      icon={[
                        <PlayIcon color="white" />,
                        <PlayIcon color="white" />,
                        <PlayIcon color="white" />
                      ]}
                      handleSubmit={() => { setPlay(true); }}
                    />
                  </div>
                }
                <div
                  className="load-video-btn"
                  onClick={() => fileInputRef.current?.click()}
                  style={(daremeState.teaser || daremeStore.teaserFile) ? {} : { /*bottom: '15px'*/ }}
                >
                  {(daremeState.teaser || daremeStore.teaserFile) ? (
                    <ContainerBtn
                      text={contexts.CREATE_DAREME_LETTER.CHANGE_TEASER}
                      styleType="outline"
                      bgColor="#059669"
                    />
                  ) : (
                    <ContainerBtn text={contexts.CREATE_DAREME_LETTER.UPLOAD_TEASER_VIDEO} styleType="outline" />
                  )}
                </div>
                {(daremeState.teaser || daremeStore.teaserFile) &&
                  <div className="choose-cover"
                    onClick={() => { navigate("/dareme/create/teaser/cover") }}>
                    <span>
                      {contexts.CREATE_DAREME_LETTER.CHOOSE_COVER}
                    </span>
                  </div>
                }
                <input
                  type="file"
                  value=""
                  ref={fileInputRef}
                  onChange={handleUploadVideo}
                  hidden
                  accept="video/*"
                />
              </div>
              <div className="options">
                <div className="deadline">
                  <div style={{ width: 'fit-content' }} onClick={(e) => {
                    e.stopPropagation();
                    setOpenDeadlineMenu(!openDeadlineMenu);
                    setOpenCategoryMenu(false);
                  }}>
                    {daremeState.deadline ? (
                      <Button
                        text={contexts.DAREME_DEADLINE_LIST[daremeState.deadline - 1]}
                        icon={[
                          <EditIcon color="white" />,
                          <EditIcon color="white" />,
                          <EditIcon color="white" />,
                        ]}
                        fillStyle="outline"
                        bgColor="#059669"
                      />) : (
                      <Button
                        shape="pill"
                        color="primary"
                        text={contexts.CREATE_DAREME_LETTER.DEADLINE}
                        icon={[
                          <AddIcon color="#EFA058" />,
                          <AddIcon color="white" />,
                          <AddIcon color="white" />,
                        ]}
                        fillStyle="outline"
                      />
                    )}
                  </div>
                  <div
                    className="drop-down-lists"
                    style={{
                      height: `${deadlineDropDownMenuheight}px`,
                      zIndex: "10",
                    }}
                  >
                    {contexts.DAREME_DEADLINE_LIST.map((day: any, i: any) => (
                      <div
                        className="list"
                        key={i}
                        onClick={() => {
                          const state = { ...daremeState, deadline: i + 1 };
                          dispatch({ type: SET_DAREME, payload: state });
                          setOpenDeadlineMenu(!openDeadlineMenu);
                        }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="dareme-title">
                  {daremeState.title ? (
                    <Button
                      handleSubmit={() => { navigate("/dareme/create/title") }}
                      text={`${daremeState.title.substring(0, 15)}${daremeState.title.length > 15 ? "..." : ""}`}
                      icon={[
                        <EditIcon color="white" />,
                        <EditIcon color="white" />,
                        <EditIcon color="white" />,
                      ]}
                      fillStyle="fill"
                      color="primary"
                      bgColor="#059669"
                    />
                  ) : (
                    <Button
                      handleSubmit={() => { navigate("/dareme/create/title") }}
                      shape="pill"
                      color="primary"
                      text={contexts.CREATE_DAREME_LETTER.DAREME_TITLE}
                      icon={[
                        <AddIcon color="#EFA058" />,
                        <AddIcon color="white" />,
                        <AddIcon color="white" />,
                      ]}
                      fillStyle="outline"
                    />
                  )}
                </div>
                <div
                  className="category"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenCategoryMenu(!openCategoryMenu);
                    setOpenDeadlineMenu(false);
                  }}
                >
                  {daremeState.category ? (
                    <CategoryBtn bgColor="#059669" text={contexts.DAREME_CATEGORY_LIST[daremeState.category - 1]} />
                  ) : (
                    <CategoryBtn
                      color="primary"
                      text={contexts.CREATE_DAREME_LETTER.CATEGORY}
                      icons={[<AddIcon color="#EFA058" />, <AddIcon color="white" />]} />
                  )}
                  <div
                    className="drop-down-lists"
                    style={{
                      height: `${categoryDropDownMenuheight}px`,
                    }}
                  >
                    {contexts.DAREME_CATEGORY_LIST.map((category: any, i: any) => (
                      <div
                        className="list"
                        key={i}
                        onClick={() => {
                          const state = { ...daremeState, category: i + 1 };
                          dispatch({ type: SET_DAREME, payload: state });
                          setOpenCategoryMenu(!openCategoryMenu);
                        }}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="reward-btn"
                  style={(daremeState.reward !== null && daremeState.rewardText !== null) ? { backgroundColor: '#059669' } : { backgroundColor: 'white', border: '1px solid #EFA058' }}
                  onClick={() => { navigate('/dareme/create/rewards') }}
                >
                  <RewardIcon color={(daremeState.reward !== null && daremeState.rewardText !== null) ? "white" : "#EFA058"} width="25" height="25" />
                </div>
                <div className="dare-options">
                  <div
                    className="dare-option"
                    onClick={() => { navigate("/dareme/create/options") }}
                  >
                    <DareOption
                      leading={false}
                      canVote={
                        daremeState.options[0]?.option.title === undefined ||
                          daremeState.options[0]?.option.title === "" ||
                          daremeState.options[0]?.option.title === null
                          ? false
                          : true
                      }
                      disabled={false}
                      donuts={0}
                      dareTitle={daremeState.options[0] === undefined ||
                        daremeState.options[0].option.title === null ||
                        daremeState.options[0].option.title === '' ?
                        `${contexts.CREATE_DAREME_LETTER.FIRST_DARE_OPTION}` : daremeState.options[0]?.option.title}
                      username={user ? user.name : ''}
                      handleSubmit={() => { }}
                    />
                  </div>
                  <div
                    className="dare-option"
                    onClick={() => { navigate("/dareme/create/options") }}
                  >
                    <DareOption
                      leading={false}
                      canVote={
                        daremeState.options[1]?.option.title === undefined ||
                          daremeState.options[1]?.option.title === null ||
                          daremeState.options[1]?.option.title === ""
                          ? false
                          : true
                      }
                      disabled={false}
                      donuts={0}
                      dareTitle={
                        daremeState.options[1] === undefined ||
                          daremeState.options[1].option.title === null ||
                          daremeState.options[1].option.title === ''
                          ? `${contexts.CREATE_DAREME_LETTER.SECOND_DARE_OPTION}`
                          : daremeState.options[1]?.option.title
                      }
                      username={user ? user.name : ''}
                      handleSubmit={() => { }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="preview-clear">
              <div className="clear-btn" onClick={() => { setOpenErase(true) }}>
                <ContainerBtn text={contexts.GENERAL_LETTER.CLEAR_ALL} styleType="clear" />
              </div>
              <div
                className="prev-btn"
                onClick={() => {
                  if (prevBtn) {
                    if ((daremeStore.coverFile === null && daremeState.cover === null) || (daremeStore.coverFile === null && daremeState.cover !== null && daremeStore.teaserFile !== null)) getFirstFrame(1);
                    else dispatch(daremeAction.saveDareme(daremeState, daremeStore.teaserFile, daremeStore.coverFile, navigate, "/dareme/preview"));
                  }
                }}
              >
                <ContainerBtn text={contexts.GENERAL_LETTER.PREVIEW} disabled={!prevBtn} styleType="fill" />
              </div>
            </div>
          </div>
        )}
        {width < 880 && (
          <div className="create-dareme-mobile">
            <div className="video"
              onClick={() => { if (play) setPlay(false); }}>
              {(!play && (daremeStore.coverFile !== null || daremeState.cover !== null)) &&
                <div className="cover-image">
                  <img
                    src={daremeState.cover ? `${CONSTANT.SERVER_URL}/${daremeState.cover}` : daremeStore.coverFile.preview}
                    alt="cover Image"
                    style={daremeState.sizeType ? { width: 'auto', height: '100%' } : { width: '100%', height: 'auto' }} />
                </div>
              }
              {(play || (daremeStore.coverFile === null && daremeState.cover === null)) &&
                <ReactPlayer
                  className={daremeState.sizeType ? "react-player-height" : "react-player-width"}
                  url={daremeStore.teaserFile ? daremeStore.teaserFile.preview : daremeState.teaser ? `${CONSTANT.SERVER_URL}/${daremeState.teaser}` : ""}
                  playing={play}
                  ref={playerRef}
                  onProgress={(progress) => {
                    if (progress.playedSeconds >= progress.loadedSeconds) playerRef.current?.seekTo(0);
                    if (progress.playedSeconds > 20) playerRef.current?.seekTo(0);
                  }}
                />
              }
              {((daremeState.teaser !== null || daremeStore.teaserFile !== null) && !play) &&
                <div className="play-icon">
                  <Button
                    fillStyle="fill"
                    color="primary"
                    icon={[
                      <PlayIcon color="white" />,
                      <PlayIcon color="white" />,
                      <PlayIcon color="white" />
                    ]}
                    handleSubmit={() => { setPlay(true); }}
                  />
                </div>
              }
              <div className="deadline">
                <div>
                  {daremeState.deadline ? (
                    <Button
                      handleSubmit={handledeadlineDlgOpen}
                      text={contexts.DAREME_DEADLINE_LIST[daremeState.deadline - 1]}
                      icon={[
                        <EditIcon color="white" />,
                        <EditIcon color="white" />,
                        <EditIcon color="white" />,
                      ]}
                      fillStyle="outline"
                      bgColor="#059669"
                    />
                  ) : (
                    <Button
                      handleSubmit={handledeadlineDlgOpen}
                      shape="pill"
                      color="primary"
                      text={contexts.CREATE_DAREME_LETTER.DEADLINE}
                      icon={[
                        <AddIcon color="#EFA058" />,
                        <AddIcon color="white" />,
                        <AddIcon color="white" />,
                      ]}
                      fillStyle="outline"
                    />
                  )}
                </div>
                <div className="reward-btn"
                  style={(daremeState.reward !== null && daremeState.rewardText !== null) ? { backgroundColor: '#059669' } : { backgroundColor: 'white', border: '1px solid #EFA058' }}
                  onClick={() => { navigate('/dareme/create/rewards') }}
                >
                  <RewardIcon color={(daremeState.reward !== null && daremeState.rewardText !== null) ? "white" : "#EFA058"} width="25" height="25" />
                </div>
              </div>
              <div className="dareme-title">
                {daremeState.title ? (
                  <Button
                    handleSubmit={() => navigate("/dareme/create/title")}
                    text={`${daremeState.title.substring(0, 15)}${daremeState.title.length > 15 ? "..." : ""
                      }`}
                    icon={[
                      <EditIcon color="white" />,
                      <EditIcon color="white" />,
                      <EditIcon color="white" />,
                    ]}
                    fillStyle="outline"
                    bgColor="#059669"
                  />
                ) : (
                  <Button
                    handleSubmit={() => navigate("/dareme/create/title")}
                    shape="pill"
                    color="primary"
                    text={contexts.CREATE_DAREME_LETTER.DAREME_TITLE}
                    icon={[
                      <AddIcon color="#EFA058" />,
                      <AddIcon color="white" />,
                      <AddIcon color="white" />,
                    ]}
                    fillStyle="outline"
                  />
                )}
              </div>
              <div className="category" onClick={handleDareopenCategoryDlg}>
                {daremeState.category ? (
                  <CategoryBtn bgColor="#059669" text={contexts.DAREME_CATEGORY_LIST[daremeState.category - 1]} />
                ) : (
                  <CategoryBtn color="primary" text={contexts.CREATE_DAREME_LETTER.CATEGORY} icons={[<AddIcon color="#EFA058" />, <AddIcon color="white" />]} />
                )}
              </div>
              <div
                className="load-video-btn"
                onClick={() => navigate("/dareme/create/teaser")}
              >
                {(daremeState.teaser || daremeStore.teaserFile) ? (
                  <ContainerBtn
                    text={contexts.CREATE_DAREME_LETTER.TEASER_VIDEO_UPLOADED}
                    bgColor="#059669"
                    styleType="outline"
                  />
                ) : (
                  <ContainerBtn text={contexts.CREATE_DAREME_LETTER.UPLOAD_TEASER_VIDEO} styleType="outline" />
                )}
              </div>
            </div>
            <div className="dare-options">
              <div
                className="dare-option"
                onClick={() => navigate("/dareme/create/options")}
              >
                <DareOption
                  leading={false}
                  canVote={
                    daremeState.options[0]?.option.title === undefined ||
                      daremeState.options[0]?.option.title === ""
                      ? false
                      : true
                  }
                  disabled={false}
                  donuts={0}
                  dareTitle={
                    daremeState.options[0] === undefined || daremeState.options[0].option.title === ''
                      ? `${contexts.CREATE_DAREME_LETTER.FIRST_DARE_OPTION}`
                      : daremeState.options[0]?.option.title
                  }
                  username={user ? user.name : ''}
                  handleSubmit={() => { }}
                />
              </div>
              <div
                className="dare-option"
                onClick={() => navigate("/dareme/create/options")}
              >
                <DareOption
                  leading={false}
                  canVote={
                    daremeState.options[1]?.option.title === undefined ||
                      daremeState.options[1]?.option.title === ""
                      ? false
                      : true
                  }
                  disabled={false}
                  donuts={0}
                  dareTitle={
                    daremeState.options[1] === undefined || daremeState.options[1].option.title === ''
                      ? `${contexts.CREATE_DAREME_LETTER.SECOND_DARE_OPTION}`
                      : daremeState.options[1]?.option.title
                  }
                  username={user ? user.name : ''}
                  handleSubmit={() => { }}
                />
              </div>
            </div>
            <div className="prev-btn" onClick={() => { setOpenErase(true) }}>
              <ContainerBtn text={contexts.GENERAL_LETTER.CLEAR_ALL} styleType="clear" />
            </div>
            <div
              className="prev-btn"
              onClick={() => {
                if (prevBtn) {
                  dispatch(daremeAction.saveDareme(daremeState, daremeStore.teaserFile, daremeStore.coverFile, navigate, "/dareme/preview"));
                }
              }}
            >
              <ContainerBtn text={contexts.GENERAL_LETTER.PREVIEW} disabled={!prevBtn} styleType="fill" />
            </div>
          </div>
        )}
        <div className="dlg" style={{ top: `${deadelineDlgPositionTop}` }}>
          <div className="done">
            <div
              className="btn"
              onClick={() => {
                if (deadline > 0) {
                  const state = { ...daremeState, deadline: deadline };
                  dispatch({ type: SET_DAREME, payload: state });
                }
                setTitleDlgOpen(false);
              }}
            >
              Done
            </div>
          </div>
          <div className="lists">
            {contexts.DAREME_DEADLINE_LIST.map((day: any, i: any) => (
              <div key={i} className="list" onClick={() => setDeadline(i + 1)}>
                {day}
              </div>
            ))}
          </div>
        </div>
        <div className="dlg" style={{ top: `${dareTitleDlgPositionTop}` }}>
          <div className="done">
            <div
              className="btn"
              onClick={() => {
                const state = { ...daremeState, category: category === 0 ? null : category };
                dispatch({ type: SET_DAREME, payload: state });
                setOpenCategoryDlg(false);
              }}
            >
              Done
            </div>
          </div>
          <div className="lists">
            {contexts.DAREME_CATEGORY_LIST.map((category: any, i: any) => (
              <div key={i} className="list" onClick={() => setCategory(i + 1)}>
                {category}
              </div>
            ))}
          </div>
        </div>
        <div
          className="transparent-dlg"
          style={{
            display: `${(titleDlgOpen || openCategoryDlg) === true ? "block" : "none"
              }`,
          }}
        ></div>
      </div>
    </>
  );
};

export default CreateDareme;

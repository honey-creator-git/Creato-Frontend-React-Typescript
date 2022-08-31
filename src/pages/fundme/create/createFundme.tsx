import { useState, useRef, useLayoutEffect, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fundmeAction } from "../../../redux/actions/fundmeActions";
import ReactPlayer from "react-player";
import Title from "../../../components/general/title";
import Button from "../../../components/general/button";
import CategoryBtn from "../../../components/general/categoryBtn";
import ContainerBtn from "../../../components/general/containerBtn";
import Dialog from "../../../components/general/dialog";
import Input from "../../../components/general/input";
import CONSTANT from "../../../constants/constant";
import Hint from "../../../components/general/hint";
import { SET_COVER_FILE1, SET_FUNDME, SET_DIALOG_STATE, SET_TEASER_FILE1 } from "../../../redux/types";
import { LanguageContext } from "../../../routes/authRoute";
import { AddIcon, EditIcon, PlayIcon, CreatoCoinIcon, LightbulbIcon, RewardIcon } from "../../../assets/svg";
import "../../../assets/styles/fundme/create/createFundmeStyle.scss";

const useWindowSize = () => {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    function updateSize() { setSize(window.innerWidth) }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const CreateFundme = () => {
  const contexts = useContext(LanguageContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const fundmeStore = useSelector((state: any) => state.fundme);
  const userState = useSelector((state: any) => state.auth);
  const loadState = useSelector((state: any) => state.load);
  const prevRoute = useSelector((state: any) => state.load.prevRoute);
  const fundmeState = fundmeStore.fundme;
  const dlgState = loadState.dlgState;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const [openCategoryDlg, setOpenCategoryDlg] = useState<boolean>(false);
  const [titleDlgOpen, setTitleDlgOpen] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openHint, setOpenHint] = useState<boolean>(false);
  const [openSubHint, setOpenSubHint] = useState<boolean>(false);
  const [goal, setGoal] = useState(fundmeState.goal ? fundmeState.goal : "");
  const [deadline, setDeadline] = useState(3);
  const [category, setCategory] = useState(0);
  const [openDeadlineMenu, setOpenDeadlineMenu] = useState<boolean>(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState<boolean>(false);
  const [openErase, setOpenErase] = useState<boolean>(false);
  const width = useWindowSize();
  const [play, setPlay] = useState(false);
  const [prevBtn, setPrevBtn] = useState(false);
  const user = userState.user;
  const deadelineDlgPositionTop = titleDlgOpen === false ? "100%" : "calc(100% - 195px)";
  const fundTitleDlgPositionTop = openCategoryDlg === false ? "100%" : "calc(100% - 195px)";
  const deadlineDropDownMenuheight = openDeadlineMenu === true ? contexts.FUNDME_DEADLINE_LIST.length * 40 + 20 : 0;
  const categoryDropDownMenuheight = openCategoryMenu === true ? contexts.FUNDME_CATEGORY_LIST.length * 40 + 20 : 0;

  const handledeadlineDlgOpen = (e: any) => { setTitleDlgOpen(!titleDlgOpen) }
  const handleFundopenCategoryDlg = () => { setOpenCategoryDlg(true) }
  const handleHintClick = () => {
    setOpenHint(true);
    setOpenSubHint(false);
  }
  const handleSubHintClick = () => {
    setOpenSubHint(true);
    setOpenHint(false);
  }

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
          const type = size >= 0.65;
          const state = { ...fundmeState, sizeType: type };
          dispatch({ type: SET_FUNDME, payload: state });
          dispatch({ type: SET_TEASER_FILE1, payload: loadFile });
        }
        video.src = URL.createObjectURL(loadFile);
      } else alert("The file size is over 35M");
    }
  };

  const Preview = () => {
    if (fundmeState.reward === null || fundmeState.rewardText === null) return false;
    if (fundmeState.title === null) return false;
    if (fundmeState.deadline === null) return false;
    if (fundmeState.category === null) return false;
    if (fundmeState.teaser === null && fundmeStore.teaserFile === null) return false;
    if (fundmeState.goal === null) return false;
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
        dispatch({ type: SET_COVER_FILE1, payload: imageFile });
        if (type === 0) dispatch(fundmeAction.saveFundme(fundmeState, fundmeStore.teaserFile, fundmeStore.coverFile, navigate, `/${user.personalisedUrl}`));
        else dispatch(fundmeAction.saveFundme(fundmeState, fundmeStore.teaserFile, imageFile, navigate, "/fundme/preview"));
      });
  }

  useEffect(() => { window.scrollTo(0, 0) }, [location])
  useEffect(() => { setPrevBtn(Preview()); }, [fundmeState])

  useEffect(() => {
    if (dlgState.type === "createFundMe" && dlgState.state === true) {
      setOpen(true);
      dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
    }
  }, [dlgState]);

  useEffect(() => {
    const state = { ...fundmeState, goal: goal !== "" ? parseInt(goal) : null };
    dispatch({ type: SET_FUNDME, payload: state });
  }, [goal]);

  return (
    <>
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.CREATE_FUNDME} back={() => {
          if ((fundmeState.teaser === null && fundmeStore.teaserFile === null)
            && fundmeState.deadline === null
            && fundmeState.category === null
            && fundmeState.title === null)
            navigate(`/${user.personalisedUrl}`);
          else setOpen(true);
        }}
          hint={handleHintClick}
          erase={() => { setOpenErase(true); }}
        />
      </div>
      <div className="create-fundme-wrapper" onClick={() => {
        setOpenCategoryMenu(false);
        setOpenDeadlineMenu(false);
      }}>
        <Hint
          style={{ left: "calc(100% - 336px)" }}
          open={openHint}
          exit={() => { setOpenHint(false); }}
          color="#059669"
          title={contexts.HINT.TITLE.WHAT_IS_FUNDME}
          context={contexts.HINT.BODY_LETTER.WHAT_IS_FUNDME}
        />
        <Hint
          style={{ left: "calc(100% - 336px)" }}
          open={openSubHint}
          exit={() => { setOpenSubHint(false); }}
          color="#059669"
          title={contexts.HINT.TITLE.GOAL}
          context={contexts.HINT.BODY_LETTER.GOAL}
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
                if (fundmeStore.coverFile === null && video) getFirstFrame(0);
                else dispatch(fundmeAction.saveFundme(fundmeState, fundmeStore.teaserFile, fundmeStore.coverFile, navigate, prevRoute));
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
                dispatch(fundmeAction.eraseDraft(fundmeState._id));
                setOpenErase(false);
              }
            }
          ]}
        />
        {width > 880 && (
          <div className="create-fundme-desktop">
            <div className="card">
              <div className="video" onClick={() => { if (play) setPlay(false); }}>
                {(!play && (fundmeStore.coverFile !== null || (fundmeState.cover !== null && fundmeStore.teaserFile === null))) &&
                  <div className="cover-image">
                    <img
                      src={fundmeStore.coverFile ? fundmeStore.coverFile.preview : fundmeState.cover ? `${CONSTANT.SERVER_URL}/${fundmeState.cover}` : ""}
                      alt="cover Image"
                      style={fundmeState.sizeType ? { width: 'auto', height: '100%' } : { width: '100%', height: 'auto' }} />
                  </div>
                }
                {(play || (fundmeStore.coverFile === null && fundmeState.cover === null) || (fundmeState.cover !== null && fundmeStore.teaserFile !== null)) &&
                  <div className="video-wrapper">
                    <ReactPlayer
                      className={fundmeState.sizeType ? "react-player-height" : "react-player-width"}
                      url={fundmeStore.teaserFile ? fundmeStore.teaserFile.preview : fundmeState.teaser ? `${CONSTANT.SERVER_URL}/${fundmeState.teaser}` : ""}
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
                  url={fundmeStore.teaserFile ? fundmeStore.teaserFile.preview : fundmeState.teaser ? `${CONSTANT.SERVER_URL}/${fundmeState.teaser}` : ""}
                />
                {((fundmeState.teaser || fundmeStore.teaserFile) && !play) &&
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
                  style={(fundmeState.teaser || fundmeStore.teaserFile) ? {} : { /*bottom: '15px'*/ }}
                >
                  {(fundmeState.teaser || fundmeStore.teaserFile) ? (
                    <ContainerBtn
                      text={contexts.CREATE_FUNDME_LETTER.CHANGE_TEASER}
                      styleType="outline"
                      bgColor="#059669"
                    />
                  ) : (
                    <ContainerBtn text={contexts.CREATE_FUNDME_LETTER.UPLOAD_TEASER_VIDEO} styleType="outline" />
                  )}
                </div>
                {(fundmeState.teaser || fundmeStore.teaserFile) &&
                  <div className="choose-cover"
                    onClick={() => { navigate("/fundme/create/teaser/cover") }}>
                    <span>{contexts.CREATE_FUNDME_LETTER.CHOOSE_COVER}</span>
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
                  <div className="deadline_reward" >
                    <div style={{ width: 'fit-content', }} onClick={(e) => {
                      e.stopPropagation();
                      setOpenDeadlineMenu(!openDeadlineMenu);
                      setOpenCategoryMenu(false);
                    }}>
                      {fundmeState.deadline ?
                        <Button
                          text={contexts.FUNDME_DEADLINE_LIST[fundmeState.deadline - 3]}
                          icon={[<EditIcon color="white" />, <EditIcon color="white" />, <EditIcon color="white" />]}
                          fillStyle="outline"
                          bgColor="#059669"
                        />
                        :
                        <Button
                          shape="pill"
                          color="primary"
                          text={contexts.CREATE_FUNDME_LETTER.PERIOD}
                          icon={[<AddIcon color="#EFA058" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                          fillStyle="outline"
                        />
                      }
                    </div>
                    <div className="reward-btn"
                      style={(fundmeState.reward !== null && fundmeState.rewardText !== null) ? { backgroundColor: '#059669' } : { backgroundColor: 'white', border: '1px solid #EFA058' }}
                      onClick={() => { navigate('/fundme/create/rewards') }}
                    >
                      <RewardIcon color={(fundmeState.reward !== null && fundmeState.rewardText !== null) ? "white" : "#EFA058"} width="25" height="25" />
                    </div>
                  </div>
                  <div className="drop-down-lists" style={{ height: `${deadlineDropDownMenuheight}px`, zIndex: "10" }}>
                    {contexts.FUNDME_DEADLINE_LIST.map((day: any, i: any) => (
                      <div
                        className="list"
                        key={i}
                        onClick={() => {
                          const state = { ...fundmeState, deadline: i + 3 };
                          dispatch({ type: SET_FUNDME, payload: state });
                          setOpenDeadlineMenu(!openDeadlineMenu);
                        }}
                      >{day}</div>
                    ))}
                  </div>
                </div>
                <div className="fund-title">
                  {fundmeState.title ? (
                    <Button
                      handleSubmit={() => { navigate("/fundme/create/title") }}
                      text={`${fundmeState.title.substring(0, 15)}${fundmeState.title.length > 15 ? "..." : ""}`}
                      icon={[<EditIcon color="white" />, <EditIcon color="white" />, <EditIcon color="white" />]}
                      fillStyle="fill"
                      color="primary"
                      bgColor="#059669"
                    />
                  ) : (
                    <Button
                      handleSubmit={() => { navigate("/fundme/create/title") }}
                      shape="pill"
                      color="primary"
                      text={contexts.CREATE_FUNDME_LETTER.TITLE}
                      icon={[<AddIcon color="#EFA058" />, <AddIcon color="white" />, <AddIcon color="white" />]}
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
                  {fundmeState.category ? <CategoryBtn bgColor="#059669" text={contexts.FUNDME_CATEGORY_LIST[fundmeState.category - 1]} />
                    : <CategoryBtn
                      color="primary"
                      text={contexts.CREATE_FUNDME_LETTER.CATEGORY}
                      icons={[<AddIcon color="#EFA058" />, <AddIcon color="white" />]} />
                  }
                  <div className="drop-down-lists" style={{ height: `${categoryDropDownMenuheight}px` }}>
                    {contexts.FUNDME_CATEGORY_LIST.map((category: any, i: any) => (
                      <div
                        className="list"
                        key={i}
                        onClick={() => {
                          const state = { ...fundmeState, category: i + 1 };
                          dispatch({ type: SET_FUNDME, payload: state });
                          setOpenCategoryMenu(!openCategoryMenu);
                        }}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="funding-goal">
                  <div className="header">
                    <div className="title">
                      <CreatoCoinIcon color="#EFA058" />
                      <span>{contexts.CREATE_FUNDME_LETTER.FUNDING_GOAL}</span>
                    </div>
                    <div onClick={handleSubHintClick}><LightbulbIcon color="#10B981" /></div>
                  </div>
                  <div className="goal-letter">
                    <span>{contexts.CREATE_FUNDME_LETTER.GOAL_LETTER}</span>
                  </div>
                  <div className="goal-input">
                    <Input
                      type="input"
                      isNumber={true}
                      placeholder={contexts.CREATE_FUNDME_LETTER.GOAL_PLACEHOLDER}
                      title={fundmeState.goal ? fundmeState.goal : ""}
                      step={1}
                      setTitle={setGoal}
                      setFocus={() => { }}
                    />
                  </div>
                </div>
                <div
                  className="prev-btn"
                  onClick={() => {
                    if (prevBtn) {
                      if ((fundmeStore.coverFile === null && fundmeState.cover === null) || (fundmeStore.coverFile === null && fundmeState.cover !== null && fundmeStore.teaserFile !== null)) getFirstFrame(1);
                      else dispatch(fundmeAction.saveFundme(fundmeState, fundmeStore.teaserFile, fundmeStore.coverFile, navigate, "/fundme/preview"));
                    }
                  }}
                >
                  <ContainerBtn text={contexts.GENERAL_LETTER.PREVIEW} disabled={!prevBtn} styleType="fill" />
                </div>
              </div>
            </div>
          </div>
        )}
        {width < 880 && (
          <div className="create-fundme-mobile">
            <div className="video"
              onClick={() => { if (play) setPlay(false); }}>
              {(!play && (fundmeStore.coverFile !== null || fundmeState.cover !== null)) &&
                <div className="cover-image">
                  <img
                    src={fundmeState.cover ? `${CONSTANT.SERVER_URL}/${fundmeState.cover}` : fundmeStore.coverFile.preview}
                    alt="cover Image"
                    style={fundmeState.sizeType ? { width: 'auto', height: '100%' } : { width: '100%', height: 'auto' }} />
                </div>
              }
              {(play || (fundmeStore.coverFile === null && fundmeState.cover === null)) &&
                <ReactPlayer
                  className={fundmeState.sizeType ? "react-player-height" : "react-player-width"}
                  url={fundmeStore.teaserFile ? fundmeStore.teaserFile.preview : fundmeState.teaser ? `${CONSTANT.SERVER_URL}/${fundmeState.teaser}` : ""}
                  playing={play}
                  ref={playerRef}
                  onProgress={(progress) => {
                    if (progress.playedSeconds >= progress.loadedSeconds) playerRef.current?.seekTo(0);
                    if (progress.playedSeconds > 15) playerRef.current?.seekTo(0);
                  }}
                />
              }
              {((fundmeState.teaser !== null || fundmeStore.teaserFile !== null) && !play) &&
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
                  {fundmeState.deadline ? (
                    <Button
                      handleSubmit={handledeadlineDlgOpen}
                      text={contexts.FUNDME_DEADLINE_LIST[fundmeState.deadline - 3]}
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
                      text={contexts.CREATE_FUNDME_LETTER.PERIOD}
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
                  style={(fundmeState.reward !== null && fundmeState.rewardText !== null) ? { backgroundColor: '#EFA058' } : { backgroundColor: '#E1E0DF' }}
                  onClick={() => { navigate('/fundme/create/rewards') }}
                >
                  <RewardIcon color="white" width="25" height="25" />
                </div>
              </div>
              <div className="fundme-title">
                {fundmeState.title ? (
                  <Button
                    handleSubmit={() => navigate("/fundme/create/title")}
                    text={`${fundmeState.title.substring(0, 15)}${fundmeState.title.length > 15 ? "..." : ""
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
                    handleSubmit={() => navigate("/fundme/create/title")}
                    shape="pill"
                    color="primary"
                    text={contexts.CREATE_FUNDME_LETTER.TITLE}
                    icon={[
                      <AddIcon color="#EFA058" />,
                      <AddIcon color="white" />,
                      <AddIcon color="white" />,
                    ]}
                    fillStyle="outline"
                  />
                )}
              </div>
              <div className="category" onClick={handleFundopenCategoryDlg}>
                {fundmeState.category ? (
                  <CategoryBtn bgColor="#059669" text={contexts.FUNDME_CATEGORY_LIST[fundmeState.category - 1]} />
                ) : (
                  <CategoryBtn color="primary" text={contexts.CREATE_FUNDME_LETTER.CATEGORY} icons={[<AddIcon color="#EFA058" />, <AddIcon color="white" />]} />
                )}
              </div>
              <div
                className="load-video-btn"
                onClick={() => navigate("/fundme/create/teaser")}
              >
                {(fundmeState.teaser || fundmeStore.teaserFile) ? (
                  <ContainerBtn
                    text={contexts.CREATE_FUNDME_LETTER.TEASER_VIDEO_UPLOADED}
                    bgColor="#059669"
                    styleType="outline"
                  />
                ) : (
                  <ContainerBtn text={contexts.CREATE_FUNDME_LETTER.UPLOAD_TEASER_VIDEO} styleType="outline" />
                )}
              </div>
            </div>
            <div className="funding-goal">
              <div className="header">
                <div className="title">
                  <CreatoCoinIcon color="#EFA058" />
                  <span>{contexts.CREATE_FUNDME_LETTER.FUNDING_GOAL}</span>
                </div>
                <div onClick={handleSubHintClick}><LightbulbIcon color="#10B981" /></div>
              </div>
              <div className="goal-letter" style={{ marginTop: '10px' }}>
                <span>{contexts.CREATE_FUNDME_LETTER.GOAL_LETTER}</span>
              </div>
              <div className="goal-input" style={{ marginTop: '15px' }}>
                <Input
                  type="input"
                  isNumber={true}
                  placeholder={contexts.CREATE_FUNDME_LETTER.GOAL_PLACEHOLDER}
                  title={fundmeState.goal ? fundmeState.goal : ""}
                  step={1}
                  maxnum={100000000}
                  minnum={0}
                  setTitle={setGoal}
                  setFocus={() => { }}
                />
              </div>
            </div>
            <div
              className="prev-btn"
              onClick={() => {
                if (prevBtn) {
                  dispatch(fundmeAction.saveFundme(fundmeState, fundmeStore.teaserFile, fundmeStore.coverFile, navigate, "/fundme/preview"));
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
                  const state = { ...fundmeState, deadline: deadline };
                  dispatch({ type: SET_FUNDME, payload: state });
                }
                setTitleDlgOpen(false);
              }}
            >
              Done
            </div>
          </div>
          <div className="lists">
            {contexts.FUNDME_DEADLINE_LIST.map((day: any, i: any) => (
              <div key={i} className="list" onClick={() => setDeadline(i + 3)}>
                {day}
              </div>
            ))}
          </div>
        </div>
        <div className="dlg" style={{ top: `${fundTitleDlgPositionTop}` }}>
          <div className="done">
            <div
              className="btn"
              onClick={() => {
                const state = { ...fundmeState, category: category === 0 ? null : category };
                dispatch({ type: SET_FUNDME, payload: state });
                setOpenCategoryDlg(false);
              }}
            >
              Done
            </div>
          </div>
          <div className="lists">
            {contexts.FUNDME_CATEGORY_LIST.map((category: any, i: any) => (
              <div key={i} className="list" onClick={() => setCategory(i + 1)}>
                {category}
              </div>
            ))}
          </div>
        </div>
        <div
          className="transparent-dlg"
          style={{
            display: `${(titleDlgOpen || openCategoryDlg) === true ? "block" : "none"}`,
          }}
        ></div>
      </div>
    </>
  );
};

export default CreateFundme;

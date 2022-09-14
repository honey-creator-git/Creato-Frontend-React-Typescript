import { useEffect, useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { SET_DAREME, SET_TEASER_FILE, SET_COVER_FILE } from "../../../redux/types";
import CONSTANT from "../../../constants/constant";
import Title from "../../../components/general/title";
import Hint from "../../../components/general/hint";
import ContainerBtn from "../../../components/general/containerBtn";
import Dialog from "../../../components/general/dialog";
import Button from "../../../components/general/button";
import { LanguageContext } from "../../../routes/authRoute";
import { AlbumIcon, DeleteIcon, PlayIcon } from "../../../assets/svg";
import "../../../assets/styles/dareme/create/uploadVideoStyle.scss";

const UploadVideo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const contexts = useContext(LanguageContext);
  const daremeStore = useSelector((state: any) => state.dareme);
  const daremeState = daremeStore.dareme;
  const playerRef = useRef<ReactPlayer>(null);
  const [play, setPlay] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openHint, setOpenHint] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const selectCover = () => { navigate('/dareme/create/teaser/cover') }

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
  }

  const saveFirstFrame = (type: any) => {
    if (daremeStore.coverFile === null && daremeState.cover === null) {
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
          if (type === 0) setOpen(true);
          else navigate('/dareme/create')
        });
    } else {
      if (type === 0) setOpen(true);
      else navigate('/dareme/create')
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <div className="title-header">
        <Title
          title={contexts.HEADER_TITLE.UPLOAD_TEASER}
          back={() => {
            if (daremeStore.teaserFile === null) navigate("/dareme/create");
            else saveFirstFrame(0);
          }}
          hint={() => setOpenHint(!openHint)}
        />
      </div>
      <div className="upload-Video-wrapper">
        <Dialog
          title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
          display={open}
          exit={() => { setOpen(false); }}
          wrapExit={() => { setOpen(false); }}
          context={contexts.DIALOG.BODY_LETTER.SAVE_DRAFT}
          buttons={[
            {
              text: `${contexts.DIALOG.BUTTON_LETTER.SAVE_DRAFT}`,
              handleClick: () => { navigate("/dareme/create"); }
            }
          ]}
        />
        <Hint
          style={{ left: "calc(100% - 336px)" }}
          open={openHint}
          exit={() => { setOpenHint(false) }}
          color="#059669"
          title={contexts.HINT.TITLE.WHAT_IS_TEASER}
          context={contexts.HINT.BODY_LETTER.WHAT_IS_TEASER}
        />
        <div className="subtitle">
          <span>
            {contexts.UPLOAD_TEASER_LETTER.EXPLAIN}
          </span>
        </div>
        <div className="upload-video-fill" onClick={() => {
          if (play) {
            setPlay(false);
            playerRef.current?.seekTo(0);
          }
        }}>
          {(daremeStore.teaserFile || daremeState.teaser) ? (
            <>
              <div
                className="delete-icon"
                onClick={() => {
                  dispatch({ type: SET_TEASER_FILE, payload: null });
                  dispatch({ type: SET_COVER_FILE, payload: null });
                  const state = { ...daremeState, sizeType: null, teaser: null, cover: null };
                  dispatch({ type: SET_DAREME, payload: state });
                }}
              >
                <DeleteIcon color="#BAB6B5" />
              </div>
              {!play &&
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
                </div>}
              <ReactPlayer
                ref={playerRef}
                playsinline={true}
                playing={play}
                className={daremeState.sizeType ? "react-player-height" : "react-player-width"}
                url={daremeState.teaser ? `${CONSTANT.SERVER_URL}/${daremeState.teaser}` : daremeStore.teaserFile.preview ? daremeStore.teaserFile.preview : ""}
                onProgress={(progress) => {
                  if (progress.playedSeconds >= progress.loadedSeconds) playerRef.current?.seekTo(0);
                  if (progress.playedSeconds > 20) playerRef.current?.seekTo(0);
                }}
              />
              <ReactPlayer
                hidden
                id="element"
                url={daremeState.teaser ? `${CONSTANT.SERVER_URL}/${daremeState.teaser}` : daremeStore.teaserFile.preview ? daremeStore.teaserFile.preview : ""}
              />
            </>
          ) : (
            <div
              className="camera-icon"
              onClick={() => { fileInputRef.current?.click() }}
            >
              <AlbumIcon color="black" />
            </div>
          )}
          <input
            type="file"
            value=""
            ref={fileInputRef}
            onChange={handleUploadVideo}
            hidden
            accept="video/*"
          />
        </div>
        {(daremeStore.teaserFile || daremeState.teaser) &&
          <>
            <div className="choose-cover" onClick={selectCover}><span>{contexts.UPLOAD_TEASER_LETTER.CHOOSE_COVER}</span></div>
            <div className="save-btn" onClick={() => { saveFirstFrame(1) }}>
              <ContainerBtn disabled={false} styleType="fill" text={contexts.GENERAL_LETTER.SAVE} />
            </div>
          </>
        }
      </div>
    </>
  );
};

export default UploadVideo;

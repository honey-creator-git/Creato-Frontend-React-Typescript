import { useEffect, useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { SET_TEASER_FILE1, SET_COVER_FILE1, SET_FUNDME } from "../../../redux/types";
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
  const fundmeStore = useSelector((state: any) => state.fundme);
  const fundmeState = fundmeStore.fundme;
  const playerRef = useRef<ReactPlayer>(null);
  const [play, setPlay] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openHint, setOpenHint] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const selectCover = () => { navigate('/fundme/create/teaser/cover') }

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
          const state = { ...fundmeState, sizeType: type };
          dispatch({ type: SET_FUNDME, payload: state });//SET_fundME -> SET_FUNDME
          dispatch({ type: SET_TEASER_FILE1, payload: loadFile });
        }
        video.src = URL.createObjectURL(loadFile);
      } else alert("The file size is over 30M");
    }
  }

  const saveFirstFrame = (type: any) => {
    if (fundmeStore.coverFile === null && fundmeState.cover === null) {
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
          if (type === 0) setOpen(true);
          else navigate('/fundme/create')
        });
    } else {
      if (type === 0) setOpen(true);
      else navigate('/fundme/create')
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <div className="title-header">
        <Title
          title={contexts.HEADER_TITLE.UPLOAD_TEASER_FUNDME}
          back={() => {
            if (fundmeStore.teaserFile === null) navigate("/fundme/create");
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
              handleClick: () => { navigate("/fundme/create"); }
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
            {contexts.UPLOAD_TEASER_LETTER.FUNDME_EXPLAIN}
          </span>
        </div>
        <div className="upload-video-fill" onClick={() => {
          if (play) {
            setPlay(false);
            playerRef.current?.seekTo(0);
          }
        }}>
          {(fundmeStore.teaserFile || fundmeState.teaser) ? (
            <>
              <div
                className="delete-icon"
                onClick={() => {
                  dispatch({ type: SET_TEASER_FILE1, payload: null });
                  dispatch({ type: SET_COVER_FILE1, payload: null });
                  const state = { ...fundmeState, sizeType: null, teaser: null, cover: null };
                  dispatch({ type: SET_FUNDME, payload: state });//
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
                className={fundmeState.sizeType ? "react-player-height" : "react-player-width"}
                url={fundmeState.teaser ? `${CONSTANT.SERVER_URL}/${fundmeState.teaser}` : fundmeStore.teaserFile.preview ? fundmeStore.teaserFile.preview : ""}
                onProgress={(progress) => {
                  if (progress.playedSeconds >= progress.loadedSeconds) playerRef.current?.seekTo(0);
                  if (progress.playedSeconds > 20) playerRef.current?.seekTo(0);
                }}
              />
              <ReactPlayer
                hidden
                id="element"
                url={fundmeState.teaser ? `${CONSTANT.SERVER_URL}/${fundmeState.teaser}` : fundmeStore.teaserFile.preview ? fundmeStore.teaserFile.preview : ""}
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
        {(fundmeStore.teaserFile || fundmeState.teaser) &&
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

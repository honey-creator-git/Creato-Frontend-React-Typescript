import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fundmeAction } from "../../../redux/actions/fundmeActions";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
import VideoCardMobile from "../../../components/dareme/videoCardMobile";
import AvatarLink from "../../../components/dareme/avatarLink";
import ContainerBtn from "../../../components/general/containerBtn";
import Dialog from "../../../components/general/dialog";
import Title from "../../../components/general/title";
import CategoryBtn from "../../../components/general/categoryBtn";
import Gif from "../../../components/general/gif";
import { LanguageContext } from "../../../routes/authRoute";
import CONSTANT from "../../../constants/constant";
import { CreatoCoinIcon, HotIcon, RewardIcon } from '../../../assets/svg';
import { SET_TEASER_FILE1, SET_COVER_FILE1, SET_DIALOG_STATE } from "../../../redux/types";
import CreateFundMeGif from '../../../assets/img/create_fundme.gif';
import "../../../assets/styles/fundme/create/previewStyle.scss";

const FundmePreview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const contexts = useContext(LanguageContext);
  const fundmeStore = useSelector((state: any) => state.fundme);
  const userState = useSelector((state: any) => state.auth);
  const dlgState = useSelector((state: any) => state.load.dlgState);
  const fundState = fundmeStore.fundme;
  const [openPublishDlg, setOpenPublishDlg] = useState<boolean>(false);
  const [openCopyLink, setOpenCopyLink] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [createFundmeGif, setCreateFundmeGif] = useState(false);
  const user = userState.user;

  const SaveFundInfo = () => {
    dispatch(fundmeAction.publishFundme());
  };

  const onPublish = () => {
    setOpenPublishDlg(false);
    setIsCopied(false);
    SaveFundInfo();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } });
  }, [location]);

  useEffect(() => {
    if (dlgState.type === 'create_fundme' && dlgState.state === true) {
      setOpenCopyLink(true);
      setCreateFundmeGif(true);
    }
  }, [dlgState]);

  useEffect(() => {
    if (createFundmeGif) setTimeout(() => { setCreateFundmeGif(false) }, 3000);
  }, [createFundmeGif]);

  return (
    <>
      <div className="title-header">
        {createFundmeGif &&
          <Gif gif={CreateFundMeGif} />
        }
        <Title
          title={contexts.GENERAL_LETTER.PREVIEW}
          back={() => {
            dispatch({ type: SET_TEASER_FILE1, payload: null });
            dispatch({ type: SET_COVER_FILE1, payload: null });
            navigate("/fundme/create");
          }}
        />
      </div>
      <Dialog
        title="Confirm:"
        display={openPublishDlg}
        context={"No edits after publishing"}
        exit={() => { setOpenPublishDlg(false) }}
        wrapExit={() => { setOpenPublishDlg(false) }}
        buttons={[
          {
            text: "Publish",
            handleClick: () => { onPublish() }
          }
        ]}
      />
      <Dialog
        display={openCopyLink}
        title="Congratulations!"
        exit={() => {
          setOpenCopyLink(false);
          navigate(`/${user.personalisedUrl}`);
        }}
        wrapExit={() => {
          setOpenCopyLink(false);
          navigate(`/${user.personalisedUrl}`);
        }}
        context={"Game on!\nSpread the words now."}
        buttons={[
          {
            text: isCopied ? "Copied" : "Copy link",
            handleClick: () => {
              navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/fundme/details/${fundState._id}`);
              setIsCopied(true);
              dispatch({ type: SET_COVER_FILE1, payload: null });
            }
          }
        ]}
        avatars={fundState.cover ? [`${CONSTANT.SERVER_URL}/${fundState.cover}`] : []}
        sizeType={fundState.sizeType}
        social
        shareType={"create"}
        fundmeTitle={fundState.title}
        fundmeId={fundState._id}
        ownerName={user.name}
      />
      <div className="preview-wrapper">
        <div className="preview-desktop-videoCardDesktop">
          <VideoCardDesktop
            url={fundState.teaser ? `${CONSTANT.SERVER_URL}/${fundState.teaser}` : ""}
            sizeType={fundState.sizeType}
            coverImage={fundState.cover ? `${CONSTANT.SERVER_URL}/${fundState.cover}` : ""}
          />
          <AvatarLink
            username={user.name}
            avatar={user.avatar}
            ownerId={user.id}
            handleAvatar={() => { navigate(`/${user.personalisedUrl}`) }}
            fundmeId={fundState._id}
          />
        </div>
        <div className="preview-information">
          <div className="desktop-header-info">
            <div className="time-info">
              <div className="left-time">
                {fundState.deadline} {contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.DAYS} {contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.LEFT}
              </div>
              <div className="vote-info">
                <CreatoCoinIcon color="black" />
                <span>0</span>
              </div>
            </div>
            <div className="dare-title">
              <span>{fundState.title}</span>
            </div>
            <div className="dare-category">
              <CategoryBtn text={contexts.FUNDME_CATEGORY_LIST[fundState.category - 1]} color="primary" />
            </div>
          </div>
          <div className="preview-videoCardMobile">
            <VideoCardMobile
              url={fundState.teaser ? `${CONSTANT.SERVER_URL}/${fundState.teaser}` : ""}
              donuts={0}
              category={contexts.FUNDME_CATEGORY_LIST[fundState.category - 1]}
              time={fundState.deadline}
              title={fundState.title}
              sizeType={fundState.sizeType}
              coverImage={fundState.cover ? `${CONSTANT.SERVER_URL}/${fundState.cover}` : ""}
              handleSubmit={() => { }}
            />
            <AvatarLink
              username={user.name}
              avatar={user.avatar}
              ownerId={user.id}
              handleAvatar={() => { navigate(`/${user.personalisedUrl}`) }}
            />
          </div>
          <div className="funding-goal">
            <div className="title">
              <CreatoCoinIcon color="#EFA058" />
              <label>{contexts.CREATE_FUNDME_LETTER.FUNDING_GOAL}</label>
            </div>
            <div className="process-bar">
              <div className="process-value" style={{ width: '16.5px' }}></div>
            </div>
            <div className="donuts-count">
              <span>0 / {fundState.goal.toLocaleString()} {contexts.GENERAL_LETTER.DONUTS}</span>
            </div>
          </div>
          <div className="dare-btn">
            <ContainerBtn
              disabled={false}
              styleType="fill"
              text={`${fundState.reward} Donuts (SuperFan!)`}
              icon={[<HotIcon color="white" />, <HotIcon color="white" />]}
            />
          </div>
          <div className="below-text" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: '20px' }}>
            <div style={{ marginRight: '20px' }}>
              <div className="reward-btn">
                <RewardIcon color="white" width="25" height="25" />
              </div>
            </div>
            <label>{contexts.FUNDME_LETTER.DETAIL_SUPERFAN_LETTER}</label>
          </div>
          <div className="dare-btn">
            <ContainerBtn
              disabled={false}
              styleType="outline"
              text="1 Donut (Free!)"
            />
          </div>
          <div className="below-text">
            {contexts.FUNDME_LETTER.DETAIL_FREE_LETTER}<br />
            {contexts.FUNDME_LETTER.DONUTED_BY_CREATOR}
          </div>
          <div className="dare-btn" style={{ marginTop: '30px' }} onClick={() => { setOpenPublishDlg(true) }}>
            <ContainerBtn text={contexts.GENERAL_LETTER.PUBLISH} styleType="fill" />
          </div>
        </div>
      </div>
    </>
  );
};

export default FundmePreview;

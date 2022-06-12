import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fundmeAction } from "../../../redux/actions/fundmeActions";
import { notificationAction } from "../../../redux/actions/notificationAction"
import VideoCardDesktop from "../../../components/fundme/videoCardDesktop";
import VideoCardMobile from "../../../components/fundme/videoCardMobile";
import AvatarLink from "../../../components/fundme/avatarLink";
import ContainerBtn from "../../../components/general/containerBtn";
import Dialog from "../../../components/general/dialog";
import Title from "../../../components/general/title";
import CategoryBtn from "../../../components/general/categoryBtn";
import { LanguageContext } from "../../../routes/authRoute";
import CONSTANT from "../../../constants/constant";
import { CreatoCoinIcon, LightbulbIcon } from '../../../assets/svg';
import "../../../assets/styles/dareme/create/previewStyle.scss";
import "../../../assets/styles/dareme/create/createDaremeStyle.scss";
import { SET_TEASER_FILE1, SET_COVER_FILE1 } from "../../../redux/types";
// import Input from "../../../components/general/input";

const FundmePreview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contexts = useContext(LanguageContext);
  const fundmeStore = useSelector((state: any) => state.fundme);
  const userState = useSelector((state: any) => state.auth);
  const fundState = fundmeStore.fundme;
  const [openPublishDlg, setOpenPublishDlg] = useState<boolean>(false);
  const [openCopyLink, setOpenCopyLink] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const user = userState.user;
  const [openHint, setOpenHint] = useState<boolean>(false);
  const [openSubHint, setOpenSubHint] = useState<boolean>(false);
  // const [goal, setGoal] = useState("");
  const handleSubHintClick = () => {
    setOpenSubHint(true);
    setOpenHint(false);
  }

  const SaveFundInfo = () => {
    // dispatch(fundmeAction.publishFundme());
    setOpenCopyLink(true);
  };

  const onPublish = () => {
    setOpenPublishDlg(false);
    setIsCopied(false);
    SaveFundInfo();
    dispatch(notificationAction.getNotification());
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="title-header">
        <Title
          title="Preview Fundme"
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
      // ownerName={user.name}
      />
      <div className="preview-wrapper">
        <div className="preview-desktop-videoCardDesktop">
          <VideoCardDesktop
            url={fundState.teaser ? `${CONSTANT.SERVER_URL}/${fundState.teaser}` : ""}
            sizeType={fundState.sizeType}
            coverImage={fundState.cover ? `${CONSTANT.SERVER_URL}/${fundState.cover}` : ""}
          />
          <AvatarLink
            // username={user.name}
            avatar={user.avatar}
            ownerId={user.id}
            handleAvatar={() => { 
              // dispatch(fundmeAction.getFundmesByPersonalisedUrl(user.personalisedUrl, navigate)); 
            }}
            fundmeId={fundState._id}
          />
        </div>
        <div className="preview-information">
          <div className="desktop-header-info">
            <div className="time-info">
              <div className="left-time">
                {fundState.deadline} days left
              </div>
              <div className="vote-info">
                <CreatoCoinIcon color="black" />
                <span>0</span>
              </div>
            </div>
            <div className="dare-title">
              <span>{fundState.title}</span>
            </div>
            <div className="fund-category">
              <CategoryBtn text={contexts.DAREME_CATEGORY_LIST[fundState.category - 1]} color="primary" />
            </div>
          </div>
          <div className="preview-videoCardMobile">
            <VideoCardMobile
              url={fundState.teaser ? `${CONSTANT.SERVER_URL}/${fundState.teaser}` : ""}
              donuts={0}
              category={contexts.DAREME_CATEGORY_LIST[fundState.category - 1]}
              time={fundState.deadline}
              title={fundState.title}
              sizeType={fundState.sizeType}
              coverImage={fundState.cover ? `${CONSTANT.SERVER_URL}/${fundState.cover}` : ""}
              handleSubmit={() => { }}
            />
            <AvatarLink
              // username={user.name}
              avatar={user.avatar}
              ownerId={user.id}
              handleAvatar={() => { 
                // dispatch(fundmeAction.getFundmesByPersonalisedUrl(user.personalisedUrl, navigate)); 
              }}
            />
          </div>
          <div className="dare-creator">
            <div className="dare-btn">
              <div onClick={() => SaveFundInfo()}>
                <ContainerBtn
                  disabled={false}
                  styleType="fill"
                  text="Fund Creator"
                />
              </div>
            </div>
            <div className="or-style">or</div>
          </div>
          {/* <div className="dare-options">
            {
              options.map((option: any, index: any) =>
                <FundOption
                  key={index}
                  leading={false}
                  donuts={option.donuts}
                  canVote={option.canVote}
                  fundTitle={option.option}
                  username={option.owner}
                  disabled={false}
                  handleSubmit={() => { }}
                />
              )
            }
          </div> */}
          {/* <div className="funding-goal">
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
                      title={goal}
                      step={1}
                      setTitle={setGoal}
                      setFocus={() => { }}
                  />
              </div>
          </div> */}


          <div className="dare-btn" style={{ marginTop: '30px' }} onClick={() => { setOpenPublishDlg(true) }}>
            <ContainerBtn text='Publish' styleType="fill" />
          </div>
        </div>
      </div>
    </>
  );
};

export default FundmePreview;

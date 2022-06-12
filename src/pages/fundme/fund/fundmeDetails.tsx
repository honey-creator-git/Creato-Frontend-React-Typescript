import { useEffect, useState, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { daremeAction } from "../../../redux/actions/daremeActions";
import VideoCardDesktop from "../../../components/fundme/videoCardDesktop";
import VideoCardMobile from "../../../components/fundme/videoCardMobile";
import AvatarLink from "../../../components/fundme/avatarLink";
import Title from "../../../components/general/title";
import CategoryBtn from "../../../components/general/categoryBtn";
import ContainerBtn from "../../../components/general/containerBtn";
import DareOption from "../../../components/general/dareOption";
import Dialog from "../../../components/general/dialog";
import { LanguageContext } from "../../../routes/authRoute";
import CONSTANT from "../../../constants/constant";
import { CreatoCoinIcon, NotificationwithCircleIcon } from "../../../assets/svg";
import { SET_CURRENT_DAREME, SET_PREVIOUS_ROUTE } from "../../../redux/types";
import "../../../assets/styles/dareme/dare/daremeDetailsStyle.scss";

const FundmeDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { fundmeId } = useParams();
  const contexts = useContext(LanguageContext);
  const daremeState = useSelector((state: any) => state.dareme);
  const loadState = useSelector((state: any) => state.load);
  const userState = useSelector((state: any) => state.auth);
  const dareme = daremeState.dareme;
  const [canShow, setCanShow] = useState<any>(null);
  const [resultOptions, setResultOptions] = useState<Array<any>>([]);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isCopyLink, setIsCopyLink] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDareDisable, setIsDareDisable] = useState(false);
  const user = userState.user;

  const calcTime = (time: any) => {
    if (time > 1) return Math.ceil(time) + " days";
    if ((time * 24) > 1) return Math.ceil(time * 24) + " hours";
    if ((time * 24 * 60) > 1) return Math.ceil(time * 24 * 60) + " mins";
    if (time > 0) return "1 min";
    else return "Finished";
  }

  const canShowResult = (dareme: any, user: any) => {
    if (user) {
      if (user.id === dareme.owner._id) return true;
      for (var i = 0; i < dareme.options.length; i++)
        for (var j = 0; j < dareme.options[i].option.voteInfo.length; j++) {
          if (dareme.options[i].option.voteInfo[j].voter === user.id && dareme.options[i].option.voteInfo[j].donuts >= 50) return true;
          if (dareme.options[i].option.voteInfo[j].voter === user.id && dareme.options[i].option.voteInfo[j].canFree === false) return true;
        }
      return false;
    } else return false;
  }

  const dareCreator = (user: any) => {
    if (user) {
      if (dareme.time > 1) dispatch(daremeAction.checkDareCreatorAndResults(fundmeId, navigate));
      else setIsDareDisable(true);
    } else setIsSignIn(true);
  }

  const supportCreator = (user: any, fundmeId: any, optionId: any) => {
    if (user && user.id === dareme.owner._id) {
      setIsCopied(false);
      setIsCopyLink(true);
    }
    else dispatch(daremeAction.checkSupportAndResults(fundmeId, optionId, navigate));
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(daremeAction.getDaremeDetails(fundmeId));
    dispatch({ type: SET_CURRENT_DAREME, payload: null });
  }, [location]);

  useEffect(() => {
    if (dareme.owner) setCanShow(canShowResult(dareme, user));
  }, [dareme]);

  useEffect(() => {
    if (dareme.owner) {
      setResultOptions(dareme.options.sort((first: any, second: any) => {
        if (canShow) return first.option.donuts > second.option.donuts ? -1 : first.option.donuts < second.option.donuts ? 1 :
          first.option.date < second.option.date ? 1 : first.option.date > second.option.date ? -1 : 0;
        else return 0;
      }));
    }
  }, [canShow]);

  return (
    <>
      <div className="title-header">
        <Title 
          title={contexts.HEADER_TITLE.DAREME_DETAILS} 
          back={() => { navigate(loadState.prevRoute); }} 
          voters={() => { navigate(`/dareme/${fundmeId}/voters`) }}
          ownerId={dareme?.owner?._id}
        />
      </div>
      {(resultOptions.length > 0 && dareme.owner) &&
        <>
          <Dialog
            display={isSignIn}
            exit={() => { setIsSignIn(false) }}
            wrapExit={() => { setIsSignIn(false) }}
            title={contexts.DIALOG.HEADER_TITLE.SIGN_IN_NOW}
            context={contexts.DIALOG.BODY_LETTER.SIGN_IN_NOW}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.SIGN_IN,
                handleClick: () => { 
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/fundme/details/${fundmeId}`});
                  navigate('/auth/signin'); 
                }
              }
            ]}
          />
          <Dialog
            display={isCopyLink}
            title="Oops!"
            exit={() => { setIsCopyLink(false) }}
            wrapExit={() => { setIsCopyLink(false) }}
            context={contexts.DIALOG.BODY_LETTER.OWNER_VOTE}
            buttons={[
              {
                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/fundme/details/${fundmeId}`);
                  setIsCopied(true);
                }
              }
            ]}
            social
            fundmeId={fundmeId}
            ownerName={dareme.owner.name}
          />
          <Dialog
            display={isDareDisable}
            title="Oops!"
            exit={() => { setIsDareDisable(false) }}
            wrapExit={() => { setIsDareDisable(false) }}
            context={contexts.DAREME_DETAILS.DARE_DISABLE}
            buttons={[
              {
                text: contexts.DAREME_DETAILS.VOTE_NOW,
                handleClick: () => { setIsDareDisable(false); }
              }
            ]}
          />
          <div className="dareme-details">
            <div className="dareme-details-videoCardDesktop">
              <VideoCardDesktop
                url={CONSTANT.SERVER_URL + "/" + dareme.teaser}
                sizeType={dareme.sizeType}
                coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
              />
              <AvatarLink
                avatar={dareme.owner.avatar}
                username={dareme.owner.name}
                ownerId={dareme.owner._id}
                handleAvatar={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(dareme.owner.personalisedUrl, navigate)); }}
                fundmeId={dareme._id}
              />
            </div>
            <div className="dareme-details-information">
              <div className="dareme-details-videoCardMobile">
                <VideoCardMobile
                  url={CONSTANT.SERVER_URL + "/" + dareme.teaser}
                  title={dareme.title}
                  time={dareme.time}
                  isFinished={dareme.finished}
                  donuts={dareme.donuts}
                  category={contexts.DAREME_CATEGORY_LIST[dareme.category - 1]}
                  sizeType={dareme.sizeType}
                  coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                />
                <AvatarLink
                  avatar={dareme.owner.avatar}
                  username={dareme.owner.name}
                  ownerId={dareme.owner._id}
                  handleAvatar={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(dareme.owner.personalisedUrl, navigate)); }}
                  fundmeId={dareme._id}
                />
              </div>
              <div className="desktop-header-info">
                <div className="time-info">
                  <div className="left-time">
                    {calcTime(dareme.time)} {dareme.time > 0 && "left"}
                  </div>
                  <div className="vote-info">
                    <CreatoCoinIcon color="black" />
                    <span>{dareme.donuts}</span>
                  </div>
                </div>
                <div className="dare-title">{dareme.title}</div>
                <div className="dare-category">
                  <CategoryBtn text={contexts.DAREME_CATEGORY_LIST[dareme.category - 1]} color="primary" />
                </div>
              </div>
              <div className="dare-btn">
                {(user && user.id === dareme.owner._id) ?
                  <div onClick={() => { dispatch(daremeAction.checkDareMeRequests(dareme._id, navigate)); }}>
                    <ContainerBtn
                      styleType="fill"
                      text={contexts.DAREME_DETAILS.SEE_REQUESTS}
                      icon={[<NotificationwithCircleIcon color="white" circleColor="white" />, <NotificationwithCircleIcon color="white" circleColor="white" />]}
                    />
                  </div>
                  :
                  <div onClick={() => { dareCreator(user); }}>
                    <ContainerBtn
                      disabled={dareme.time < 1 ? true : false}
                      styleType="fill"
                      text={contexts.DAREME_DETAILS.HAVE_IDEA}
                    />
                  </div>
                }
              </div>
              <div className="or-style">or</div>
              <div className="dare-options scroll-bar">
                {
                  resultOptions.filter((option: any) => option.option.status === 1).map((option: any, index: any) => (
                    <div className="dare-option" key={index}>
                      <DareOption
                        dareTitle={option.option.title}
                        donuts={option.option.donuts}
                        voters={canShow ? option.option.voters : undefined}
                        canVote={true}
                        disabled={false}
                        username={option.option.writer.name}
                        leading={index !== 0 ? false : canShow}
                        handleSubmit={() => { supportCreator(user, dareme._id, option.option._id); }}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
};

export default FundmeDetails;
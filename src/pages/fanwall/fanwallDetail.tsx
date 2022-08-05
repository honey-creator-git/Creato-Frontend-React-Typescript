import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fanwallAction } from "../../redux/actions/fanwallActions";
import { daremeAction } from "../../redux/actions/daremeActions";
import FanwallVideoCard from "../../components/fanwall/videoCardFanwall";
import FawnallLike from "../../components/fanwall/fanwallLike";
import DareOption from "../../components/general/dareOption";
import Avatar from "../../components/general/avatar";
import Button from "../../components/general/button";
import Title from "../../components/general/title";
import Dialog from "../../components/general/dialog";
import CategoryBtn from "../../components/general/categoryBtn";
import CONSTANT from "../../constants/constant";
import { LanguageContext } from "../../routes/authRoute";
import { CreatoCoinIcon, MoreIcon, WinningIcon } from "../../assets/svg";
import { SET_PREVIOUS_ROUTE, SET_FANWALL_TYPE } from "../../redux/types";
import "../../assets/styles/fanwall/fanwallDetailsStyle.scss";

const FanwallDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fanwallId } = useParams();

  const fanwallState = useSelector((state: any) => state.fanwall);
  const userState = useSelector((state: any) => state.auth);

  const fanwall = fanwallState.fanwall;
  const winOption = fanwallState.winOption;
  const topFuns = fanwallState.topFuns;

  const contexts = useContext(LanguageContext);

  const [totalDonuts, setTotalDonuts] = useState<any>(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(0);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isUnLock, setIsUnLock] = useState(false);
  const [isTopUp, setIsTopUp] = useState(false);
  const [moreInfo, setMoreInfo] = useState(false);
  const [openDelPostDlg, setOpenDelPostDlg] = useState(false);

  let width;
  if (fanwall.fundme) {
    const interval = fanwall.fundme.goal ? (Number(fanwall.fundme.goal) / 20).toFixed(1) : 0;
    const count = fanwall.fundme.goal ? Number(Math.floor(Number(fanwall.fundme.wallet) / Number(interval))) : 0;
    width = fanwall.fundme.wallet <= interval ? Math.floor(Number(interval) / Number(fanwall.fundme.goal) * 330) : Math.floor(Number(interval) * count / Number(fanwall.fundme.goal) * 330);
  }
  const user = userState.user;

  const handleUnlock = () => {
    if (user) setIsUnLock(true);
    else setIsSignIn(true);
  }
  const handleLike = () => {
    if (user) {
      const likes = fanwall.likes.filter((like: any) => (like.liker + "" === user.id + ""));
      if (likes.length === 0) dispatch(fanwallAction.likeFanwall(fanwallId));
    } else setIsSignIn(true);
  }

  const checkLock = () => {
    if (user) {
      if (user.role === "ADMIN") return false;
      if (user.id + "" === fanwall.writer._id + "") return false;
      if (fanwall.dareme && fanwall.dareme.options) {
        const options = fanwall.dareme.options.filter((option: any) => option.option.win === true);
        for (let i = 0; i < options[0].option.voteInfo.length; i++) {
          const voteInfo = options[0].option.voteInfo[i];
          if ((voteInfo.voter + "" === user.id + "") && voteInfo?.superfan === true) return false;
          if (fanwall.dareme.reward) { }
          else {
            if ((voteInfo.voter + "" === user.id + "") && voteInfo.donuts >= 50) return false;
          }
        }
      } else if (fanwall.fundme) {
        for (let i = 0; i < fanwall.fundme.voteInfo.length; i++) {
          const voteInfo = fanwall.fundme.voteInfo[i];
          if ((voteInfo.voter + "" === user.id + "") && voteInfo?.superfan === true) return false;
        }
      }
      for (let i = 0; i < fanwall.unlocks.length; i++) if (user.id + "" === fanwall.unlocks[i].unlocker + "") return false;
      return true;
    } else return true;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fanwallAction.getPostDetail(fanwallId));
  }, [fanwallId, dispatch]);

  useEffect(() => {
    if (fanwall && fanwall.writer) {
      if (fanwall.dareme) {
        if (fanwall.dareme.options) {
          setTotalDonuts(fanwall.dareme.options.filter((option: any) => option.option.status === 1).reduce((sum: any, option: any) => sum + option.option.donuts, 0));
          setTitle(fanwall.dareme.title);
          setCategory(fanwall.dareme.category);
        }
      } else {
        setTitle(fanwall.fundme.title);
        setCategory(fanwall.fundme.category);
      }
    }
  }, [fanwall]);

  return (
    <>
      {(fanwall.writer) &&
        <div>
          <div className="title-header">
            <Title title={contexts.HEADER_TITLE.POST_DETAILS} back={() => {
              navigate('/');
            }} />
          </div>
          <div className="fanwall-detail-wrapper">
            <Dialog
              display={openDelPostDlg}
              exit={() => { setOpenDelPostDlg(false) }}
              wrapExit={() => { setOpenDelPostDlg(false) }}
              title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
              context={contexts.DIALOG.BODY_LETTER.DELETE_POST}
              buttons={[
                {
                  text: contexts.DIALOG.BUTTON_LETTER.CANCEL,
                  handleClick: () => { setOpenDelPostDlg(false); }
                },
                {
                  text: contexts.DIALOG.BUTTON_LETTER.DELETE,
                  handleClick: () => {
                    setOpenDelPostDlg(false);
                    dispatch(fanwallAction.deleteFanwall(fanwallId, navigate, `/${user.personalisedUrl}`));
                  }
                }
              ]}
            />
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
                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/fanwall/detail/${fanwallId}` });
                    navigate('/auth/signin');
                  }
                }
              ]}
            />
            <Dialog
              display={isUnLock}
              exit={() => { setIsUnLock(false) }}
              wrapExit={() => { setIsUnLock(false) }}
              title={contexts.DIALOG.HEADER_TITLE.UNLOCK_REWARDS}
              context={contexts.DIALOG.BODY_LETTER.UNLOCK_FANWALL}
              buttons={[
                {
                  text: contexts.DIALOG.BUTTON_LETTER.CANCEL,
                  handleClick: () => { setIsUnLock(false) }
                },
                {
                  text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                  handleClick: () => {
                    if (user.wallet >= 500) {
                      setIsUnLock(false);
                      dispatch(fanwallAction.unlockFanwall(fanwallId));
                    } else {
                      setIsUnLock(false);
                      setIsTopUp(true);
                    }
                  }
                }
              ]}
            />
            <Dialog
              display={isTopUp}
              title={contexts.DIALOG.HEADER_TITLE.TOP_UP_NOW}
              exit={() => { setIsTopUp(false) }}
              wrapExit={() => { setIsTopUp(false) }}
              context={contexts.DIALOG.BODY_LETTER.TOP_UP_NOW}
              buttons={[
                {
                  text: contexts.DIALOG.BUTTON_LETTER.TOP_UP,
                  handleClick: () => {
                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/fanwall/detail/${fanwallId}` });
                    navigate(`/${user.personalisedUrl}/shop`);
                  }
                }
              ]}
            />
            <div className="fanwall-desktop-card">
              <div className="card-main-body">
                <FanwallVideoCard
                  letters={fanwall.message}
                  url={CONSTANT.SERVER_URL + "/" + fanwall.video}
                  sizeType={fanwall.sizeType}
                  coverImage={fanwall.cover ? `${CONSTANT.SERVER_URL}/${fanwall.cover}` : ""}
                  lock={checkLock()}
                  handleUnlock={handleUnlock}
                />
                <FawnallLike
                  avatar={fanwall.writer.avatar.indexOf('uploads') === -1 ? fanwall.writer.avatar : `${CONSTANT.SERVER_URL}/${fanwall.writer.avatar}`}
                  likes={fanwall.likes ? fanwall.likes.length : 0}
                  username={fanwall.writer.name}
                  handleLike={handleLike}
                  isLiked={(user && fanwall.likes.filter((like: any) => (like.liker + "" === user.id + "")).length > 0) ? true : false}
                  handleAvatar={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(fanwall.writer.personalisedUrl, navigate)); }}
                />
              </div>
            </div>
            <div className="fanwall-info">
              <div className="dareme-vote-info">
                <div className="dareme-deadline">Ended</div>
                <div className="dareme-donuts">
                  <CreatoCoinIcon color="black" />
                  <div style={{ width: 'fit-content', marginLeft: '5px', marginRight: '5px' }}>{fanwall.dareme ? totalDonuts.toLocaleString() : fanwall.fundme.wallet.toLocaleString()}</div>
                </div>
              </div>
              <div className="dareme-title">
                <div className="title">{title}</div>
                <div className="more-info">
                  <div onClick={() => { setMoreInfo(true) }} ><MoreIcon color="#EFA058" /></div>
                  <div className="drop-down-list" style={moreInfo === true ? { visibility: 'visible', opacity: 1 } : {}}>
                    <div className="list" onClick={() => {
                      navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/fanwall/detail/${fanwallId}`);
                      setMoreInfo(false);
                    }}>
                      Copy link
                    </div>
                    {(user && user.id === fanwall.writer._id) &&
                      <>
                        <div className="list" onClick={() => {
                          if (fanwall.dareme) dispatch({ type: SET_FANWALL_TYPE, payload: 'dareme' });
                          else dispatch({ type: SET_FANWALL_TYPE, payload: 'fundme' });
                          navigate(`/dareme/fanwall/post/${fanwallId}`);
                        }}>
                          Edit
                        </div>
                        <div className="list" onClick={() => {
                          setMoreInfo(false);
                          setOpenDelPostDlg(true);
                        }}>
                          Delete
                        </div>
                      </>
                    }
                    <div className="list" onClick={() => { setMoreInfo(false) }}>Cancel</div>
                  </div>
                </div>
              </div>
              <div className="dareme-category">
                <CategoryBtn text={contexts.DAREME_CATEGORY_LIST[category]} />
              </div>
              <div className="fanwall-mobile-card">
                <FanwallVideoCard
                  letters={fanwall.message}
                  url={CONSTANT.SERVER_URL + "/" + fanwall.video}
                  lock={checkLock()}
                  sizeType={fanwall.sizeType}
                  coverImage={fanwall.cover ? `${CONSTANT.SERVER_URL}/${fanwall.cover}` : ""}
                  handleUnlock={handleUnlock}
                />
              </div>
              {(fanwall.writer && fanwall.fundme) &&
                <div className="funding-goal">
                  <div className="title">
                    <CreatoCoinIcon color="#EFA058" />
                    <label>{fanwall.fundme.wallet < fanwall.fundme.goal ? "Goal" : "Goal Reached!"}</label>
                  </div>
                  <div className="process-bar">
                    <div className="process-value" style={{ width: fanwall.fundme.wallet < fanwall.fundme.goal ? `${width}px` : '330px' }}></div>
                  </div>
                  <div className="donuts-count">
                    <span><span className={fanwall.fundme.wallet >= fanwall.fundme.goal ? "over-donuts" : ""}>{fanwall.fundme.wallet.toLocaleString()}</span> / {fanwall.fundme.goal.toLocaleString()} Donuts</span>
                  </div>
                </div>
              }
              {(fanwall.writer && winOption) &&
                <div className="win-option">
                  <DareOption
                    canVote={false}
                    donuts={winOption.donuts}
                    voters={winOption.voters}
                    disabled={false}
                    leading={true}
                    dareTitle={winOption.title}
                    handleSubmit={() => { }}
                    username={winOption.writer.name}
                  />
                </div>
              }
              <div className="fanwall-like-mobile">
                <FawnallLike
                  avatar={fanwall.writer.avatar.indexOf('uploads') === -1 ? fanwall.writer.avatar : `${CONSTANT.SERVER_URL}/${fanwall.writer.avatar}`}
                  likes={fanwall.likes ? fanwall.likes.length : 0}
                  username={fanwall.writer.name}
                  handleLike={handleLike}
                  isLiked={(user && fanwall.likes.filter((like: any) => (like.liker + "" === user.id + "")).length > 0) ? true : false}
                />
              </div>
              <div className="line-vector"></div>
              <div className="top-fans">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <WinningIcon color="black" />
                  <div className="letter">Top Fans</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
                  {topFuns && topFuns.length > 0 &&
                    topFuns.map((fan: any, index: any) => (
                      <div className="top-fan-avatar" key={index} onClick={() => { navigate(`/${fan.personalisedUrl}`); }}>
                        <Avatar
                          avatar={fan.avatar.indexOf('uploads') === -1 ? fan.avatar : `${CONSTANT.SERVER_URL}/${fan.avatar}`}
                          size="mobile"
                          hover={true}
                          username={fan.name}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="line-vector"></div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                <Button
                  fillStyle="fill"
                  width="290px"
                  text="Watch Content"
                  color="primary"
                  shape="rounded"
                  handleSubmit={() => {
                    if (fanwall.dareme) navigate('/dareme/fanwall/detail/' + fanwallId + '/content');
                    else navigate('/fundme/fanwall/detail/' + fanwallId + '/content');
                  }}
                />
              </div>
              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                <Button
                  fillStyle="outline"
                  shape="rounded"
                  width="290px"
                  text={fanwall.dareme ? "See DareMe" : "See FundMe"}
                  color="primary"
                  handleSubmit={() => {
                    if (fanwall.dareme) navigate(`/dareme/result/${fanwall.dareme._id}`)
                    else navigate(`/fundme/result/${fanwall.fundme._id}`)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default FanwallDetails;
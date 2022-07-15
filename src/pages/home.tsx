import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { daremeAction } from "../redux/actions/daremeActions";
import { LanguageContext } from "../routes/authRoute";
import VideoCardMobile from "../components/dareme/videoCardMobile";
import AvatarLink from "../components/dareme/avatarLink";
import FirstBanner from "../components/banner/firstBanner";
import SecondBanner from "../components/banner/secondBanner";
import Dialog from "../components/general/dialog";
import CategoryBtn from "../components/general/categoryBtn";
// import Avatar from "../components/Avatar";
import Creato from "../components/general/creato";
import DisplayDonutsPlan from "../components/stripe/displayDonutsPlan";
import PaymentForm from "../components/stripe/paymentForm";
import { fanwallAction } from "../redux/actions/fanwallActions";
import CONSTANT from "../constants/constant";
import { SET_PREVIOUS_ROUTE, SET_DIALOG_STATE, SET_FANWALL_INITIAL } from "../redux/types";
import { RewardIcon } from "../assets/svg";
import { fundmeAction } from "../redux/actions/fundmeActions";
import "../assets/styles/homeStyle.scss";

const creatoList = [
  {
    property: "popular",
    donutCount: 300,
    discountedPercent: 10
  },
  {
    property: "popular",
    donutCount: 200,
    discountedPercent: 8
  },
  {
    property: "discountedPrice",
    donutCount: 100,
    discountedPercent: 5
  },
  {
    property: "normal",
    donutCount: 50,
    discountedPercent: 0
  },
  {
    property: "normal",
    donutCount: 100,
    discountedPercent: 0
  },
  {
    property: "normal",
    donutCount: 200,
    discountedPercent: 0
  },
  {
    property: "normal",
    donutCount: 300,
    discountedPercent: 0
  }
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const daremeState = useSelector((state: any) => state.dareme);
  const userState = useSelector((state: any) => state.auth);
  const loadState = useSelector((state: any) => state.load);
  const fanwallState = useSelector((state: any) => state.fanwall);
  const location = useLocation();
  const contexts = useContext(LanguageContext);
  const { daremes } = daremeState;
  const { fanwalls } = fanwallState;
  const [openSigninDlg, setOpenSigninDlg] = useState(false);
  const [openDonutsPlanDlg, setOpenDonutsPlanDlg] = useState(false);
  const [openPaymentDlg, setOpenPaymentDlg] = useState(false);
  const [openTopupDlg, setOpenTopupDlg] = useState(false);
  const [openErrorDlg, setOpenErrorDlg] = useState(false);
  const [openWelcomeDlg, setOpenWelcomeDlg] = useState(false);
  const [donutPlan, setDonutPlan] = useState<any>(null);
  const [openDelPostDlg, setOpenDelPostDlg] = useState(false);
  const [fanwallId, setFanwallId] = useState("");
  const [errorText, setErrorText] = useState("")
  const user = userState.user;
  const dlgState = loadState.dlgState;

  const buyDonuts = async (creato: any) => {
    if (user) { await setDonutPlan(creato); }
    else setOpenSigninDlg(true);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(daremeAction.getDarmesOngoing());
  }, [location, dispatch]);

  useEffect(() => {
    setOpenDonutsPlanDlg(donutPlan);
  }, [donutPlan]);

  useEffect(() => {
    if (dlgState.type === "buyDonut") {
      if (dlgState.state) {
        setOpenPaymentDlg(false);
        setOpenTopupDlg(true);
      }
    } else if (dlgState.type === 'welcome') {
      if (dlgState.state) {
        setOpenWelcomeDlg(true);
      }
    } else if (dlgState.type === 'error') {
      if (dlgState.state) {
        setOpenErrorDlg(true);
        setErrorText(dlgState.msg);
      }
    }
  }, [dlgState]);

  return (
    <div className="home-wrapper">
      <PaymentForm
        display={openPaymentDlg}
        exit={() => {
          setOpenPaymentDlg(false);
          setDonutPlan(null);
        }}
        donutPlan={donutPlan}
      />
      <Dialog
        display={openSigninDlg}
        exit={() => { setOpenSigninDlg(false) }}
        wrapExit={() => { setOpenSigninDlg(false) }}
        title={contexts.DIALOG.HEADER_TITLE.SIGN_IN_NOW}
        context={contexts.DIALOG.BODY_LETTER.SIGN_IN_NOW}
        buttons={[
          {
            text: contexts.DIALOG.BUTTON_LETTER.SIGN_IN,
            handleClick: () => { navigate('/auth/signin'); }
          }
        ]}
      />
      <Dialog
        display={openTopupDlg}
        exit={() => {
          setOpenTopupDlg(false);
          setDonutPlan(null);
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
        }}
        wrapExit={() => {
          setOpenTopupDlg(false);
          setDonutPlan(null);
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
        }}
        title="Congratulations!"
        context={`You have topped up ${donutPlan ? donutPlan.donutCount : 'xxx'} Donuts\nDonuts balance: ${user ? user.wallet : 'xxx'}`}
        buttons={[
          {
            text: 'Dare now',
            handleClick: () => {
              setOpenTopupDlg(false);
              setDonutPlan(null);
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
              navigate("/");
            }
          }
        ]}
      />
      <Dialog
        display={openErrorDlg}
        exit={() => {
          setOpenErrorDlg(false);
          setDonutPlan(null);
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
        }}
        wrapExit={() => {
          setOpenErrorDlg(false);
          setDonutPlan(null);
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
        }}
        title="Error!"
        context={errorText}
      // buttons={[
      //   {
      //     text: 'Dare now',
      //     handleClick: () => {
      //       setOpenErrorDlg(false);
      //       setDonutPlan(null);
      //       dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
      //       navigate("/");
      //     }
      //   }
      // ]}
      />
      <Dialog
        display={openWelcomeDlg}
        title="Welcome to Creato"
        exit={() => {
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
          setOpenWelcomeDlg(false);
        }}
        wrapExit={() => {
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
          setOpenWelcomeDlg(false);
        }}
        subcontext={true}
        icon={
          {
            pos: 1,
            icon: <RewardIcon color="#EFA058" width="60px" height="60px" />
          }
        }
        buttons={[
          {
            text: "Go",
            handleClick: () => {
              setOpenWelcomeDlg(false);
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
              if (loadState.prevRoute !== "") navigate(loadState.prevRoute);
            }
          }
        ]}
      />
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
              dispatch(fanwallAction.deleteFanwall(fanwallId, navigate, `/`));
            }
          }
        ]}
      />
      <DisplayDonutsPlan
        display={openDonutsPlanDlg}
        exit={() => {
          setOpenDonutsPlanDlg(false);
          setTimeout(() => { setDonutPlan(null); }, 200);
        }}
        creato={donutPlan}
        handleSubmit={() => {
          setOpenDonutsPlanDlg(false);
          setOpenPaymentDlg(true);
        }}
      />
      <div className="section">
        <div className="banner">
          <SecondBanner />
        </div>
      </div>
      {(daremes.length > 0) &&
        <div className="section">
          <div className="title">{contexts.HOME_LETTER.DAREME_WITH_MOST_DONUTS}</div>
          <div className="daremes scroll-bar">
            {daremes.sort((first: any, second: any) => {
              return first.donuts < second.donuts ? 1 : first.donuts > second.donuts ? -1 : first.date > second.date ? 1 : first.date < second.date ? -1 : 0;
            }).map((dareme: any, i: any) => (
              <div className="dareme" key={i}>
                <VideoCardMobile
                  url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
                  goal={dareme.goal ? dareme.goal : null}
                  category={dareme.goal ? contexts.FUNDME_CATEGORY_LIST[dareme.category - 1] : contexts.DAREME_CATEGORY_LIST[dareme.category - 1]}
                  title={dareme.title}
                  donuts={dareme.donuts}
                  time={dareme.time}
                  finished={dareme.finished}
                  sizeType={dareme.sizeType}
                  coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                  handleSubmit={() => {
                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: '/' });
                    if (dareme.type === 'dareme')
                      dispatch(daremeAction.checkDetailsAndResults(dareme.id, navigate));
                    else if (dareme.type === 'fundme')
                      dispatch(fundmeAction.checkDetailsAndResults(dareme.id, navigate));
                  }}
                />
                <AvatarLink
                  username={dareme.owner.name}
                  avatar={dareme.owner.avatar}
                  ownerId={dareme.owner._id}
                  isFundme={dareme.type === 'fundme' ? true : false}
                  handleAvatar={() => {
                    dispatch(daremeAction.getDaremesByPersonalisedUrl(dareme.owner.personalisedUrl, navigate));
                  }}
                  daremeId={dareme.id}
                />
              </div>
            ))
            }
          </div>
        </div>
      }
      <div className="section">
        <div className="title">{contexts.HOME_LETTER.GET_DONUTS_TO_DARE}</div>
        <div className="donuts-list scroll-bar">
          {creatoList.map((creato, i) => (
            <div className="donuts" key={i} onClick={() => {
              dispatch({ type: SET_PREVIOUS_ROUTE, payload: "/" });
              buyDonuts(creato);
            }}>
              <Creato
                discountedPercent={creato.discountedPercent}
                donutCount={creato.donutCount}
                property={creato.property}
              />
            </div>
          ))}
        </div>
      </div>
      {(daremes.length > 0 && daremes.filter((dareme: any) => dareme.finished === false).length > 0) &&
        <div className="section">
          <div className="title">{contexts.HOME_LETTER.EVERY_TALKING}</div>
          <div className="daremes scroll-bar">
            {daremes.filter((dareme: any) => dareme.finished === false).sort((first: any, second: any) => {
              return first.donuts < second.donuts ? 1 : first.donuts > second.donuts ? -1 : first.date > second.date ? 1 : first.date < second.date ? -1 : 0;
            }).map((dareme: any, i: any) => (
              <div className="dareme" key={i}>
                <VideoCardMobile
                  url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
                  title={dareme.title}
                  goal={dareme.goal ? dareme.goal : null}
                  category={dareme.goal ? contexts.FUNDME_CATEGORY_LIST[dareme.category - 1] : contexts.DAREME_CATEGORY_LIST[dareme.category - 1]}
                  donuts={dareme.donuts}
                  time={dareme.time}
                  finished={dareme.finished}
                  sizeType={dareme.sizeType}
                  coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                  handleSubmit={() => {
                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: '/' });
                    if (dareme.type === 'dareme')
                      dispatch(daremeAction.checkDetailsAndResults(dareme.id, navigate));
                    else if (dareme.type === 'fundme')
                      dispatch(fundmeAction.checkDetailsAndResults(dareme.id, navigate));
                  }}
                />
                <AvatarLink
                  username={dareme.owner.name}
                  avatar={dareme.owner.avatar}
                  ownerId={dareme.owner._id}
                  isFundme={dareme.type === 'fundme' ? true : false}
                  handleAvatar={() => {
                    dispatch(daremeAction.getDaremesByPersonalisedUrl(dareme.owner.personalisedUrl, navigate));
                  }}
                  daremeId={dareme.id}
                />
              </div>
            ))
            }
          </div>
        </div>
      }
      {(daremes.length > 0 && daremes.filter((dareme: any) => dareme.finished === false).length > 0) &&
        <div className="section">
          <div className="title">{contexts.HOME_LETTER.NEW_RELEASE}</div>
          <div className="categories scroll-bar">
            {contexts.DAREME_CATEGORY_LIST.map((category: any, i: any) => (
              <div className="category" key={i}>
                <CategoryBtn text={category} color="primary" />
              </div>
            ))}
          </div>
          <div className="daremes scroll-bar">
            {daremes.filter((dareme: any) => dareme.finished === false).sort((first: any, second: any) => {
              return first.date < second.date ? 1 : first.date > second.date ? -1 : 0;
            }).map((dareme: any, i: any) => (
              <div className="dareme" key={i}>
                <VideoCardMobile
                  url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
                  title={dareme.title}
                  goal={dareme.goal ? dareme.goal : null}
                  category={dareme.goal ? contexts.FUNDME_CATEGORY_LIST[dareme.category - 1] : contexts.DAREME_CATEGORY_LIST[dareme.category - 1]}
                  donuts={dareme.donuts}
                  time={dareme.time}
                  finished={dareme.finished}
                  sizeType={dareme.sizeType}
                  coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                  handleSubmit={() => {
                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: '/' });
                    if (dareme.type === 'dareme')
                      dispatch(daremeAction.checkDetailsAndResults(dareme.id, navigate));
                    else if (dareme.type === 'fundme')
                      dispatch(fundmeAction.checkDetailsAndResults(dareme.id, navigate));
                  }}
                />
                <AvatarLink
                  username={dareme.owner.name}
                  avatar={dareme.owner.avatar}
                  ownerId={dareme.owner._id}
                  isFundme={dareme.type === 'fundme' ? true : false}
                  handleAvatar={() => {
                    dispatch(daremeAction.getDaremesByPersonalisedUrl(dareme.owner.personalisedUrl, navigate));
                  }}
                  daremeId={dareme.id}
                />
              </div>
            ))
            }
          </div>
        </div>
      }
      <div className="section">
        <div className="banner">
          <FirstBanner />
        </div>
      </div>
      {(daremes.length > 0 && daremes.filter((dareme: any) => dareme.finished === false).length > 0) &&
        <div className="section">
          <div className="title">{contexts.HOME_LETTER.ONGOING_DAREME}</div>
          <div className="categories scroll-bar">
            {contexts.DAREME_CATEGORY_LIST.map((category: any, i: any) => (
              <div className="category" key={i}>
                <CategoryBtn text={category} color="primary" />
              </div>
            ))}
          </div>
          <div className="daremes scroll-bar">
            {daremes.filter((dareme: any) => dareme.finished === false).sort((first: any, second: any) => {
              let firstDiff = new Date(first.date).getTime() - new Date().getTime() + 24 * 1000 * 3600 * first.deadline;
              let secondDiff = new Date(second.date).getTime() - new Date().getTime() + 24 * 1000 * 3600 * second.deadline;
              return firstDiff > secondDiff ? 1 : firstDiff < secondDiff ? -1 : 0;
            }).map((dareme: any, i: any) => (
              <div className="dareme" key={i}>
                <VideoCardMobile
                  url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
                  title={dareme.title}
                  goal={dareme.goal ? dareme.goal : null}
                  category={dareme.goal ? contexts.FUNDME_CATEGORY_LIST[dareme.category - 1] : contexts.DAREME_CATEGORY_LIST[dareme.category - 1]}
                  donuts={dareme.donuts}
                  time={dareme.time}
                  finished={dareme.finished}
                  sizeType={dareme.sizeType}
                  coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                  handleSubmit={() => {
                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: '/' });
                    if (dareme.type === 'dareme')
                      dispatch(daremeAction.checkDetailsAndResults(dareme.id, navigate));
                    else if (dareme.type === 'fundme')
                      dispatch(fundmeAction.checkDetailsAndResults(dareme.id, navigate));
                  }}
                />
                <AvatarLink
                  username={dareme.owner.name}
                  avatar={dareme.owner.avatar}
                  ownerId={dareme.owner._id}
                  isFundme={dareme.type === 'fundme' ? true : false}
                  handleAvatar={() => {
                    dispatch(daremeAction.getDaremesByPersonalisedUrl(dareme.owner.personalisedUrl, navigate));
                  }}
                  daremeId={dareme.id}
                />
              </div>
            ))
            }
          </div>
        </div>
      }
      {/* <div className="section">
        <div className="title">
          Creators you might like<span>see more</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div className="search-icon">
            <SearchIcon color="#EFA058" width="30px" height="30px" />
          </div>
          <div className="categories scroll-bar" style={{ paddingLeft: "60px" }}>
            {contexts.CREATOR_CATEGORY_LIST.map((category: any, i: any) => (
              <div className="category" key={i}>
                <CategoryBtn text={category} color="primary" />
              </div>
            ))}
          </div>
        </div>
        <div className="users scroll-bar"> */}
      {/* { users.length ? users.map((user: any, i: any) => (
            <div className="user" key={i} onClick={() => {
              dispatch({type: SET_USER_INITIAL});
              dispatch({type: SET_DAREME_INITIAL});
              navigate(`/${user.personalisedUrl}`);
            }}>
              <Avatar
                avatar={user.avatar}
                size="web"
                style="vertical"
                category="travel/lifestyle/fitness"
                username={user.name}
              />
            </div>
          )): '' } */}
      {/* </div> */}
      {/*  </div> */}
      {(daremes.length > 0 && daremes.filter((dareme: any) => (dareme.finished === true && dareme.fanwall === false)).length > 0) &&
        <div className="section">
          <div className="title">{contexts.HOME_LETTER.FINISHED_DAREME}</div>
          <div className="categories scroll-bar">
            {contexts.DAREME_CATEGORY_LIST.map((category: any, i: any) => (
              <div className="category" key={i}>
                <CategoryBtn text={category} color="primary" />
              </div>
            ))}
          </div>
          <div className="daremes scroll-bar">
            {daremes.filter((dareme: any) => (dareme.finished === true && dareme.fanwall === false)).sort((first: any, second: any) => {
              let firstDiff = new Date(first.date).getTime() - new Date().getTime() + 24 * 1000 * 3600 * first.deadline;
              let secondDiff = new Date(second.date).getTime() - new Date().getTime() + 24 * 1000 * 3600 * second.deadline;
              return firstDiff < secondDiff ? 1 : firstDiff > secondDiff ? -1 : 0;
            }).map((dareme: any, i: any) => (
              <div className="dareme" key={i}>
                <VideoCardMobile
                  url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
                  title={dareme.title}
                  goal={dareme.goal ? dareme.goal : null}
                  category={dareme.goal ? contexts.FUNDME_CATEGORY_LIST[dareme.category - 1] : contexts.DAREME_CATEGORY_LIST[dareme.category - 1]}
                  donuts={dareme.donuts}
                  time={dareme.time}
                  sizeType={dareme.sizeType}
                  coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                  finished={dareme.finished}
                  handleSubmit={() => {
                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: '/' });
                    if (dareme.type === 'dareme')
                      dispatch(daremeAction.checkDetailsAndResults(dareme.id, navigate));
                    else if (dareme.type === 'fundme')
                      dispatch(fundmeAction.checkDetailsAndResults(dareme.id, navigate));
                  }}
                />
                <AvatarLink
                  username={dareme.owner.name}
                  avatar={dareme.owner.avatar}
                  ownerId={dareme.owner._id}
                  isFundme={dareme.type === 'fundme' ? true : false}
                  handleAvatar={() => {
                    dispatch(daremeAction.getDaremesByPersonalisedUrl(dareme.owner.personalisedUrl, navigate));
                  }}
                  daremeId={dareme.id}
                />
              </div>
            ))
            }
          </div>
        </div>
      }
      {fanwalls.length > 0 &&
        <div className="section">
          <div className="title">{contexts.HOME_LETTER.POST_ON_FANWALL}</div>
          <div className="categories scroll-bar">
            {contexts.DAREME_CATEGORY_LIST.map((category: any, i: any) => (
              <div className="category" key={i}>
                <CategoryBtn text={category} color="primary" />
              </div>
            ))}
          </div>
          <div className="daremes scroll-bar">
            {fanwalls.map((fanwall: any, index: any) => (
              <div className="dareme" key={index}>
                <VideoCardMobile
                  donuts={fanwall.dareme.donuts}
                  url={`${CONSTANT.SERVER_URL}/${fanwall.video}`}
                  title={fanwall.dareme.title}
                  sizeType={fanwall.sizeType}
                  coverImage={fanwall.cover ? `${CONSTANT.SERVER_URL}/${fanwall.cover}` : ""}
                  goal={fanwall.dareme.goal ? fanwall.dareme.goal : null}
                  category={fanwall.dareme.goal ? contexts.FUNDME_CATEGORY_LIST[fanwall.dareme.category - 1] : contexts.DAREME_CATEGORY_LIST[fanwall.dareme.category - 1]}
                  posted={true}
                  fanwallData={fanwall}
                  handleSubmit={() => {
                    dispatch({ type: SET_FANWALL_INITIAL });
                    navigate(`/dareme/fanwall/detail/${fanwall.id}`)
                    // if (fanwall.dareme.goal)
                    //   navigate(`/fundme/fanwall/detail/${fanwall.id}`)
                    // else
                    //   navigate(`/dareme/fanwall/detail/${fanwall.id}`)
                  }}
                />
                <AvatarLink
                  username={fanwall.writer.name}
                  avatar={fanwall.writer.avatar}
                  handleAvatar={() => {
                    dispatch(daremeAction.getDaremesByPersonalisedUrl(fanwall.writer.personalisedUrl, navigate));
                  }}
                  ownerId={fanwall.writer._id}
                  url={"/"}
                  delData={() => {
                    setFanwallId(fanwall.id);
                    setOpenDelPostDlg(true);
                  }}
                  isFanwall={true}
                  daremeId={fanwall.id}
                />
              </div>
            ))
            }
          </div>
        </div>
      }
    </div>
  );
};

export default Home;
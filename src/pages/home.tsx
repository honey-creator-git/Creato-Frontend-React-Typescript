import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useContext, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { daremeAction } from "../redux/actions/daremeActions"
import { LanguageContext } from "../routes/authRoute"
import VideoCardMobile from "../components/dareme/videoCardMobile"
import AvatarLink from "../components/dareme/avatarLink"
import FirstBanner from "../components/banner/firstBanner"
// import SecondBanner from "../components/banner/secondBanner"
import Dialog from "../components/general/dialog"
import CategoryBtn from "../components/general/categoryBtn"
import Avatar from "../components/general/avatar"
import Creato from "../components/general/creato"
import SignDialog from "../components/general/signDialog"
import ItemCard from "../components/dareme/itemCard"
import LetStarted from "../components/letStarted"
import DisplayDonutsPlan from "../components/stripe/displayDonutsPlan"
import PaymentForm from "../components/stripe/paymentForm"
import { fanwallAction } from "../redux/actions/fanwallActions"
import CONSTANT from "../constants/constant"
import { SET_PREVIOUS_ROUTE, SET_DIALOG_STATE, SET_LOADING_TRUE, SET_USERS } from "../redux/types"
import { RewardIcon } from "../assets/svg"
import { paymentAction } from "../redux/actions/paymentActions"
import { authAction } from "../redux/actions/authActions"
import WelcomeDlg from "../components/general/welcomeDlg"
import "../assets/styles/homeStyle.scss"

const creatoList = [
  {
    property: "popular",
    donutCount: 500,
    discountedPercent: 13
  },
  {
    property: "popular",
    donutCount: 800,
    discountedPercent: 17
  },
  {
    property: "popular",
    donutCount: 1000,
    discountedPercent: 20
  },
  {
    property: "discountedPrice",
    donutCount: 300,
    discountedPercent: 10
  },
  {
    property: "normal",
    donutCount: 30,
    discountedPercent: 0
  },
  {
    property: "normal",
    donutCount: 100,
    discountedPercent: 0
  },
  {
    property: "normal",
    donutCount: 180,
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
  const [openWelcomeDlg, setOpenWelcomeDlg] = useState(false)
  const [openWelcomeDlg2, setOpenWelcomeDlg2] = useState(false)
  const [donutPlan, setDonutPlan] = useState<any>(null);
  const [openDelPostDlg, setOpenDelPostDlg] = useState(false);
  const [openPayVia, setOpenPayVia] = useState(false);
  const [fanwallId, setFanwallId] = useState("")
  const [errorText, setErrorText] = useState("")
  const [type, setType] = useState(0)
  const user = userState.user;
  const users = userState.users;
  const stripeID = userState.stripeID;
  const cardNum = userState.cardNum;
  const dlgState = loadState.dlgState;
  const [searchParams, setSearchParams] = useSearchParams()
  const code = searchParams.get("invitedBy")

  const buyDonuts = async (creato: any) => {
    if (user) { await setDonutPlan(creato); }
    else setOpenSigninDlg(true);
  }

  const showCategories = (categories: any) => {
    let category = '';
    categories.forEach((cate: any, index: any) => {
      category += contexts.CREATOR_CATEGORY_LIST[cate];
      if (index !== categories.length - 1) category += '/'
    })
    return category
  }

  useEffect(() => {
    if (code) dispatch(authAction.inviteFriend(code, navigate))
  }, [code, dispatch, navigate])

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(daremeAction.getDarmesOngoing());
  }, [location, dispatch]);

  useEffect(() => {
    if (user) dispatch(paymentAction.getStripeID());
  }, [user, dispatch]);

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
    } else if (dlgState.type === 'welcome2') {
      if (dlgState.state) {
        setOpenWelcomeDlg2(true)
      }
    }
  }, [dlgState]);

  return (
    <div className="home-wrapper">
      <WelcomeDlg
        display={openWelcomeDlg2}
        exit={() => {
          setOpenWelcomeDlg2(false)
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
        }}
        wrapExit={() => {
          setOpenWelcomeDlg2(false)
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
        }}
        buttons={[{
          text: contexts.WELCOME_DLG.OK,
          handleClick: () => {
            setOpenWelcomeDlg2(false)
            dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
          }
        }]}
      />
      <PaymentForm
        display={openPaymentDlg}
        exit={() => {
          setOpenPaymentDlg(false);
          setDonutPlan(null);
        }}
        donutPlan={donutPlan}
      />
      <SignDialog
        display={openSigninDlg}
        exit={() => { setOpenSigninDlg(false) }}
        wrapExit={() => { setOpenSigninDlg(false) }}
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
      <Dialog
        display={openPayVia}
        exit={() => {
          setOpenPayVia(false);
          setDonutPlan(null);
        }}
        wrapExit={() => {
          setOpenPayVia(false);
          setDonutPlan(null);
        }}
        title={contexts.PAYMENT.CONFIRM}
        context={`${contexts.PAYMENT.PAY_WITH_SAVED_CARD}:\n\n**** **** **** ${cardNum}`}
        buttons={[
          {
            text: contexts.PAYMENT.NO,
            handleClick: () => {
              setOpenPayVia(false);
              setOpenPaymentDlg(true);
            }
          },
          {
            text: contexts.PAYMENT.YES,
            handleClick: () => {
              setOpenPayVia(false);
              dispatch({ type: SET_LOADING_TRUE });
              dispatch(paymentAction.buyDonuts(null, donutPlan, stripeID, false));
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
          if (stripeID) setOpenPayVia(true);
          else setOpenPaymentDlg(true);
        }}
      />
      <div className="section">
      <div className="title">Let's get started</div>
      <div>
        <LetStarted type={type} setType={setType} user={user}/>
      </div>
        {/* <div className="banner">
          <SecondBanner />
        </div> */}
      </div>
      {(daremes.length > 0) &&
        <div className="section">
          <div className="title">{contexts.HOME_LETTER.DAREME_WITH_MOST_DONUTS}</div>
          <div className="daremes scroll-bar">
            {daremes.map((dareme: any, i: any) => (
              <div className="dareme" key={i}>
                <ItemCard
                  owner={{
                    name: dareme.owner.name,
                    avatar: dareme.owner.avatar,
                    profile: dareme.owner.personalisedUrl,
                    tip: dareme.owner.tipFunction
                  }}
                  item={{
                    id: dareme._id,
                    title: dareme.title,
                    teaser: `${CONSTANT.SERVER_URL}/${dareme.teaser}`,
                    cover: `${CONSTANT.SERVER_URL}/${dareme.cover}`,
                    size: dareme.sizeType,
                    leftTime: dareme.time,
                    voters: dareme.voteInfo.length,
                    donuts: dareme.donuts,
                    goal: dareme.goal
                  }}
                />
              </div>
            ))
            }
          </div>
        </div>
      }
      <div className="section">
        <div className="title">{contexts.HOME_LETTER.GET_DONUTS_TO_DARE}</div>
        <div className="see-more" onClick={() => { navigate(`/myaccount/shop`); }}>See More</div>
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
                <ItemCard
                  owner={{
                    name: dareme.owner.name,
                    avatar: dareme.owner.avatar,
                    profile: dareme.owner.personalisedUrl,
                    tip: dareme.owner.tipFunction
                  }}
                  item={{
                    id: dareme._id,
                    title: dareme.title,
                    teaser: `${CONSTANT.SERVER_URL}/${dareme.teaser}`,
                    cover: `${CONSTANT.SERVER_URL}/${dareme.cover}`,
                    size: dareme.sizeType,
                    leftTime: dareme.time,
                    voters: dareme.voteInfo.length,
                    donuts: dareme.donuts,
                    goal: dareme.goal
                  }}
                  handleSubmit={() => { 

                  }}
                />
              </div>
            ))
            }
          </div>
        </div>
      }
      {users.length > 0 &&
        <div className="section">
          <div className="title">
            {contexts.HOME_LETTER.CREATORS_YOU_LIKE}<span></span>
          </div>
          {/* <div
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
        </div> */}
          <div className="users scroll-bar">
            {users.map((user: any, i: any) => (
              <div key={i}>
                {user.avatar &&
                  <div className="user" onClick={() => {
                    dispatch({ type: SET_USERS, payload: [] })
                    navigate(`/${user?.personalisedUrl}`)
                  }}>
                    <Avatar
                      avatar={user?.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${user?.avatar}` : user?.avatar}
                      size="web"
                      avatarStyle="vertical"
                      category={showCategories(user?.categories)}
                      username={user?.name}
                    />
                  </div>
                }
              </div>
            ))}
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
                <ItemCard
                  owner={{
                    name: dareme.owner.name,
                    avatar: dareme.owner.avatar,
                    profile: dareme.owner.personalisedUrl,
                    tip: dareme.owner.tipFunction
                  }}
                  item={{
                    id: dareme._id,
                    title: dareme.title,
                    teaser: `${CONSTANT.SERVER_URL}/${dareme.teaser}`,
                    cover: `${CONSTANT.SERVER_URL}/${dareme.cover}`,
                    size: dareme.sizeType,
                    leftTime: dareme.time,
                    voters: dareme.voteInfo.length,
                    donuts: dareme.donuts,
                    goal: dareme.goal
                  }}
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
                <ItemCard
                  owner={{
                    name: dareme.owner.name,
                    avatar: dareme.owner.avatar,
                    profile: dareme.owner.personalisedUrl,
                    tip: dareme.owner.tipFunction
                  }}
                  item={{
                    id: dareme._id,
                    title: dareme.title,
                    teaser: `${CONSTANT.SERVER_URL}/${dareme.teaser}`,
                    cover: `${CONSTANT.SERVER_URL}/${dareme.cover}`,
                    size: dareme.sizeType,
                    leftTime: dareme.time,
                    voters: dareme.voteInfo.length,
                    donuts: dareme.donuts,
                    goal: dareme.goal
                  }}
                />
              </div>
            ))
            }
          </div>
        </div>
      }
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
                <ItemCard
                  owner={{
                    name: dareme.owner.name,
                    avatar: dareme.owner.avatar,
                    profile: dareme.owner.personalisedUrl,
                    tip: dareme.owner.tipFunction
                  }}
                  item={{
                    id: dareme._id,
                    title: dareme.title,
                    teaser: `${CONSTANT.SERVER_URL}/${dareme.teaser}`,
                    cover: `${CONSTANT.SERVER_URL}/${dareme.cover}`,
                    size: dareme.sizeType,
                    leftTime: dareme.time,
                    voters: dareme.voteInfo.length,
                    donuts: dareme.donuts,
                    goal: dareme.goal
                  }}
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
                  donuts={fanwall?.dareme?.donuts ? fanwall?.dareme?.donuts : 0}
                  url={`${CONSTANT.SERVER_URL}/${fanwall?.video}`}
                  title={fanwall?.dareme?.title}
                  sizeType={fanwall?.sizeType}
                  coverImage={fanwall?.cover ? `${CONSTANT.SERVER_URL}/${fanwall?.cover}` : ""}
                  goal={fanwall?.dareme?.goal ? fanwall?.dareme?.goal : null}
                  category={fanwall?.dareme?.goal ? contexts.FUNDME_CATEGORY_LIST[fanwall?.dareme?.category - 1] : contexts.DAREME_CATEGORY_LIST[fanwall?.dareme?.category - 1]}
                  posted={true}
                  finished={true}
                  fanwallData={fanwall}
                  handleSubmit={() => {
                    if (fanwall?.dareme?.goal) navigate(`/fundme/fanwall/detail/${fanwall?.id}`)
                    else navigate(`/dareme/fanwall/detail/${fanwall?.id}`)
                  }}
                />
                <AvatarLink
                  username={fanwall?.writer?.name}
                  avatar={fanwall?.writer?.avatar ? fanwall?.writer?.avatar : ''}
                  handleAvatar={() => { navigate(`/${fanwall?.writer?.personalisedUrl}`) }}
                  ownerId={fanwall?.writer?._id}
                  url={"/"}
                  delData={() => {
                    setFanwallId(fanwall?.id);
                    setOpenDelPostDlg(true);
                  }}
                  isFanwall={true}
                  daremeId={fanwall?.id}
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
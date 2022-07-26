import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Title from "../../components/general/title";
import Avatar from "../../components/general/avatar";
import Input from "../../components/general/input";
import Dialog from "../../components/general/dialog";
import ContainerBtn from "../../components/general/containerBtn";
import Creato from "../../components/general/creato";
import DisplayDonutsPlan from "../../components/stripe/displayDonutsPlan";
import PaymentForm from "../../components/stripe/paymentForm";
import { LanguageContext } from "../../routes/authRoute";
import { SET_DIALOG_STATE, SET_PREVIOUS_ROUTE } from "../../redux/types";
import { tipAction } from "../../redux/actions/tipActions";
import { authAction } from "../../redux/actions/authActions";
import CONSTANT from "../../constants/constant";
import TippingGif from '../../assets/img/tipping-gif.gif';
import "../../assets/styles/tip/tipDonutStyle.scss";

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
  },
];

const TipDonut = () => {
  const { creatorLink } = useParams();
  const userState = useSelector((state: any) => state.auth);
  const authuser = useSelector((state: any) => state.auth.users[0]);
  const dlgState = useSelector((state: any) => state.load.dlgState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contexts = useContext(LanguageContext);
  const [tip, setTip] = useState<any>("");
  const [nickname, setNickName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [openEmptyMsg, setOpenEmptyMsg] = useState(false);
  const [openTopUp, setOpenTopUp] = useState(false);
  const [openTipSuccess, setOpenTipSuccess] = useState(false);
  const [openDonutsPlan, setOpenDonutsPlan] = useState(false);
  const [openPaymentDlg, setOpenPaymentDlg] = useState(false);
  const [tippingGif, setTippingGif] = useState(false);
  const location = useLocation();
  const user = userState.user;

  const tipDonuts = () => {
    if (message === "") setOpenEmptyMsg(true);
    else tipUser();
  }

  const tipUser = () => {
    if (user) {
      if (user.wallet < tip) setOpenTopUp(true);
      else dispatch(tipAction.tipUser(1, user.id, authuser?._id, tip, message));
    } else setOpenDonutsPlan(true);
  }

  const check = () => {
    if (tip === "" || tip === 0 || tip === null) return false;
    if (!user && nickname === "") return false;
    return true;
  }

  useEffect(() => {
    if (dlgState.type === "tipSuccess" && dlgState.state === true) {
      setOpenTipSuccess(true);
      setOpenPaymentDlg(false);
      setTippingGif(true);
    }
  }, [dlgState]);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
    dispatch(authAction.getUserFromUrl(creatorLink));
    setOpenTipSuccess(false);
    setTippingGif(false);
  }, [location]);

  return (
    <div className="tip-donuts">
      <Title title="Tip Donuts" back={() => { navigate(`/${authuser?.personalisedUrl}`) }} />
      {authuser &&
        <div className="tip-donuts-body">
          <DisplayDonutsPlan
            display={openDonutsPlan}
            exit={() => { setOpenDonutsPlan(false) }}
            creato={creatoList[selectedIndex]}
            handleSubmit={() => {
              setOpenDonutsPlan(false);
              setOpenPaymentDlg(true);
            }}
          />
          {tippingGif &&
            <div className="tipping-gif">
              <img src={TippingGif} />
            </div>
          }
          <PaymentForm
            tipData={{ nickname: nickname, message: message, user: authuser?._id }}
            display={openPaymentDlg}
            exit={() => { setOpenPaymentDlg(false) }}
            donutPlan={creatoList[selectedIndex]}
          />
          <Dialog
            display={openEmptyMsg}
            exit={() => { setOpenEmptyMsg(false); }}
            wrapExit={() => { setOpenEmptyMsg(false); }}
            title={`${contexts.CONFIRM}:`}
            context={contexts.PROCEED_WITHOUT_MESSAGE_TO_CREATOR}
            buttons={[
              {
                text: contexts.YES,
                handleClick: () => {
                  setOpenEmptyMsg(false);
                  tipUser();
                }
              },
              {
                text: contexts.NO,
                handleClick: () => { setOpenEmptyMsg(false) }
              }
            ]}
          />
          <Dialog
            display={openTipSuccess}
            exit={() => { navigate(`/${authuser?.personalisedUrl}`) }}
            wrapExit={() => { navigate(`/${authuser?.personalisedUrl}`) }}
            title={contexts.CONGRATS}
            context={contexts.DONUTS_HAVE_BEEN_TIPPED}
            buttons={[
              {
                text: contexts.BACK_TO_PROFILE,
                handleClick: () => { navigate(`/${authuser?.personalisedUrl}`) }
              }
            ]}
            social
          />
          <Dialog
            display={openTopUp}
            exit={() => { setOpenTopUp(false); }}
            wrapExit={() => { setOpenTopUp(false); }}
            title={contexts.DIALOG.HEADER_TITLE.TOP_UP_NOW}
            context={contexts.DIALOG.BODY_LETTER.TOP_UP_NOW}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.TOP_UP,
                handleClick: () => {
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/${authuser?.personalisedUrl}/tip` });
                  navigate(`/${user.personalisedUrl}/shop`);
                }
              }
            ]}
          />
          <div className="user-avatar">
            <Avatar
              size="web"
              username={authuser?.name}
              avatar={authuser?.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${authuser?.avatar}` : authuser?.avatar}
            />
          </div>
          {!user &&
            <div className="nickname">
              <Input
                type="input"
                placeholder={contexts.LET_THEM_KNOW_WHO_YOU_ARE}
                label={contexts.NICKNAME}
                wordCount={30}
                title={nickname}
                setTitle={setNickName}
                setFocus={() => { }}
              />
            </div>
          }
          {user &&
            <div className="donuts-number">
              <label className="letter">{contexts.REVIEW_LETTER.DONUTS_NUMBER}</label>
              <Input
                type="input"
                placeholder={contexts.EG_30_100}
                isNumber={true}
                title={tip}
                width={150}
                minnum={0}
                maxnum={99999999}
                step={1}
                setTitle={setTip}
                setFocus={() => { }}
              />
            </div>
          }
          <div className="message">
            <Input
              type="textarea"
              label={contexts.SAY_SOMETHING_TO_SUPPORT}
              placeholder={contexts.MESSAGE_TO_CREATORS}
              wordCount={150}
              title={message}
              setTitle={setMessage}
              setFocus={() => { }}
            />
          </div>
          {!user &&
            <div className="donut-package">
              <span className="package-title">{contexts.PICK_DONUT_PACKAGE}</span>
              <div className="donuts-plan">
                {creatoList.map((creato, i) => (
                  <div className="donuts" key={i} onClick={() => {
                    setTip(creato.donutCount);
                    setSelectedIndex(i);
                  }}>
                    <Creato
                      discountedPercent={creato.discountedPercent}
                      donutCount={creato.donutCount}
                      property={creato.property}
                      selected={selectedIndex === i ? true : false}
                    />
                  </div>
                ))}
              </div>
            </div>
          }
          <div className="send-btn" onClick={() => { if (check()) tipDonuts() }}>
            <ContainerBtn
              text={user ? contexts.SEND : contexts.NEXT}
              disabled={!check()}
              styleType="fill"
            />
          </div>
        </div>
      }
    </div>
  )
}

export default TipDonut;
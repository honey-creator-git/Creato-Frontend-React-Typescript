import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
import "../../assets/styles/tip/tipDonutStyle.scss";

const creatoList = [
  {
    property: "discountedPrice",
    donutCount: 100,
    discountedPercent: 5
  },
  {
    property: "discountedPrice",
    donutCount: 200,
    discountedPercent: 8
  },
  {
    property: "discountedPrice",
    donutCount: 300,
    discountedPercent: 10
  },
  {
    property: "popular",
    donutCount: 100,
    discountedPercent: 5
  },
  {
    property: "popular",
    donutCount: 200,
    discountedPercent: 8
  },
  {
    property: "popular",
    donutCount: 300,
    discountedPercent: 10
  }
];

const TipDonut = () => {
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
    }
  }, [dlgState]);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
    setOpenTipSuccess(false);
  }, [location]);

  return (
    <div className="tip-donuts">
      <Title title="Tip Donuts" back={() => { navigate(`/${authuser?.personalisedUrl}`) }} />
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
          title="Confirm:"
          context="Proceed without a message to creator?"
          buttons={[
            {
              text: "Yes",
              handleClick: () => {
                setOpenEmptyMsg(false);
                tipUser();
              }
            },
            {
              text: "No",
              handleClick: () => { setOpenEmptyMsg(false) }
            }
          ]}
        />
        <Dialog
          display={openTipSuccess}
          exit={() => { setOpenTipSuccess(false); }}
          wrapExit={() => { setOpenTipSuccess(false); }}
          title="Congrats!"
          context="Donuts have been tipped!"
          buttons={[
            {
              text: "Back to profile",
              handleClick: () => {
                setOpenTipSuccess(false);
                navigate(`/${authuser?.personalisedUrl}`);
              }
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
            avatar={authuser?.avatar}
          />
        </div>
        {!user &&
          <div className="nickname">
            <Input
              type="input"
              placeholder="Let them know who you are :)"
              label="Nickname"
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
              placeholder="e.g. 30, 100"
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
            label={"Say something to support!"}
            placeholder={"Message to Creators"}
            wordCount={150}
            title={message}
            setTitle={setMessage}
            setFocus={() => { }}
          />
        </div>
        {!user &&
          <div className="donut-package">
            <span className="package-title">Pick a Donut package 🍩</span>
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
      </div>
      <div className="send-btn" onClick={() => { if (check()) tipDonuts() }}>
        <ContainerBtn
          text={user ? "Send" : "Next"}
          disabled={!check()}
          styleType="fill"
        />
      </div>
    </div>
  )
}

export default TipDonut;
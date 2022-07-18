import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Title from "../../components/general/title";
import Creato from "../../components/general/creato";
import DisplayDonutsPlan from "../../components/stripe/displayDonutsPlan";
import PaymentForm from "../../components/stripe/paymentForm";
import Dialog from "../../components/general/dialog";
import { LanguageContext } from "../../routes/authRoute";
import { SET_DIALOG_STATE, SET_LOADING_TRUE } from "../../redux/types";
import { paymentAction } from "../../redux/actions/paymentActions";
import "../../assets/styles/profile/shopDonutsStyle.scss";

const creatos = [
  {
    property: "popular",
    discountedPercent: 5,
    donutCount: 100,
  },
  {
    property: "popular",
    discountedPercent: 8,
    donutCount: 200,
  },
  {
    property: "popular",
    discountedPercent: 10,
    donutCount: 300,
  },
  {
    property: "discountedPrice",
    discountedPercent: 5,
    donutCount: 100,
  },
  {
    property: "discountedPrice",
    discountedPercent: 8,
    donutCount: 200,
  },
  {
    property: 'discountedPrice',
    discountedPercent: 10,
    donutCount: 300,
  },
  {
    property: "normal",
    discountedPercent: 0,
    donutCount: 50,
  },
  {
    property: 'normal',
    discountedPercent: 0,
    donutCount: 200,
  },
  {
    property: "normal",
    discountedPercent: 0,
    donutCount: 300,
  }
];

const ShopDonuts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state: any) => state.auth);
  const loadState = useSelector((state: any) => state.load);
  const [openDonutsPlanDlg, setOpenDonutsPlanDlg] = useState(false);
  const [openPaymentDlg, setOpenPaymentDlg] = useState(false);
  const [openTopupDlg, setOpenTopupDlg] = useState(false);
  const [donutPlan, setDonutPlan] = useState<any>(null);
  const [openPayVia, setOpenPayVia] = useState(false);
  const contexts = useContext(LanguageContext);
  const user = userState.user;
  const stripeID = userState.stripeID;
  const cardNum = userState.cardNum;
  const dlgState = loadState.dlgState;
  const prevRoute = loadState.prevRoute;


  useEffect(() => {
    if (dlgState.type === "buyDonut" && dlgState.state === true) {
      setOpenPaymentDlg(false);
      setOpenTopupDlg(true);
    }
  }, [dlgState]);

  useEffect(() => {
    setOpenDonutsPlanDlg(donutPlan);
  }, [donutPlan]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) dispatch(paymentAction.getStripeID());
  }, [user]);

  return (
    <div className="shop-donuts">
      <Title title={contexts.HEADER_TITLE.SHOP_DONUTS} back={() => { navigate(prevRoute); }} />
      <PaymentForm
        display={openPaymentDlg}
        exit={() => {
          setOpenPaymentDlg(false);
          setDonutPlan(null);
        }}
        donutPlan={donutPlan}
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
        title={"Confirm"}
        context={`Pay with saved Card Details:\n\n**** **** **** ${cardNum}`}
        buttons={[
          {
            text: "No",
            handleClick: () => {
              setOpenPayVia(false);
              setOpenPaymentDlg(true);
            }
          },
          {
            text: "Yes",
            handleClick: () => {
              setOpenPayVia(false);
              dispatch({ type: SET_LOADING_TRUE });
              dispatch(paymentAction.buyDonuts(null, donutPlan, stripeID, false));
            }
          }
        ]}
      />
      <Dialog
        display={openTopupDlg}
        exit={() => {
          setOpenTopupDlg(false);
          setDonutPlan(null);
          dispatch({ type: SET_DIALOG_STATE, payload: false });
        }}
        wrapExit={() => {
          setOpenTopupDlg(false);
          setDonutPlan(null);
          dispatch({ type: SET_DIALOG_STATE, payload: false });
        }}
        title={contexts.DIALOG.HEADER_TITLE.CONGRAT}
        context={`You have topped up ${donutPlan ? donutPlan.donutCount : 'xxx'} Donuts\nDonuts balance: ${user ? user.wallet : 'xxx'}`}
        buttons={[
          {
            text: loadState.prevRoute.indexOf("tip") !== -1 ? 'Tip now' : 'Dare now',
            handleClick: () => {
              setOpenTopupDlg(false);
              setDonutPlan(null);
              dispatch({ type: SET_DIALOG_STATE, payload: false });
              navigate(prevRoute);
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
      <div className="part">
        <div className="title">{contexts.SHOP_DONUTS.HOT_DEALS}</div>
        <div className="creatos">
          {creatos.filter((creato) => creato.property === "popular").map((creato, i) => (
            <div className="creato" key={i} onClick={() => { setDonutPlan(creato); }}>
              <Creato
                discountedPercent={creato.discountedPercent}
                donutCount={creato.donutCount}
                property={creato.property}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="part">
        <div className="title">{contexts.SHOP_DONUTS.DISCOUNT}</div>
        <div className="creatos">
          {creatos.filter((creato) => creato.property === "discountedPrice").map((creato, i) => (
            <div className="creato" key={i} onClick={() => { setDonutPlan(creato); }}>
              <Creato
                discountedPercent={creato.discountedPercent}
                donutCount={creato.donutCount}
                property={creato.property}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="part">
        <div className="title">{contexts.SHOP_DONUTS.STANDARDS}</div>
        <div className="creatos">
          {creatos.filter((creato) => creato.property === "normal").map((creato, i) => (
            <div className="creato" key={i} onClick={() => { setDonutPlan(creato); }}>
              <Creato
                discountedPercent={creato.discountedPercent}
                donutCount={creato.donutCount}
                property={creato.property}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDonuts;

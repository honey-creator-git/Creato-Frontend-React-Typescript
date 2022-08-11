import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { MoreIcon, PayoneerIcon, StripeIcon } from "../../../assets/svg";
import { LanguageContext } from "../../../routes/authRoute";
import { useContext } from 'react';
import ContainerBtn from "../../../components/general/containerBtn";
import Title from "../../../components/general/title";
import Dialog from "../../../components/general/dialog";
import { SpreadIcon } from "../../../assets/svg";
import CONSTANT from "../../../constants/constant";
import { paymentAction } from "../../../redux/actions/paymentActions";
import "../../../assets/styles/profile/paymentStyle.scss";

const Payment = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const payment = useSelector((state: any) => state.auth.payment)
  const [searchParams, setSearchParams] = useSearchParams()
  const code = searchParams.get("code")
  const [openSoon, setOpenSoon] = useState(false)
  const contexts = useContext(LanguageContext)

  const connectStripe = () => {
    window.open(`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${CONSTANT.CLIENT_ID}&scope=read_write`, '_self')
  }

  const disConnectStripe = () => {
    dispatch(paymentAction.disconnectStripe(CONSTANT.CLIENT_ID, navigate))
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(paymentAction.getPaymentInfo())
  }, [location])

  useEffect(() => {
    if (code) {
      dispatch(paymentAction.connectStripe(code, navigate))
    }
  }, [code])

  return (
    <>
      <div className="title-header">
        <Title title={contexts.PAYMENT.PAYMENT_TITLE} back={() => navigate(`/myaccount/setting`)} />
      </div>
      <div className="payment-wrapper">
        <Dialog
          display={openSoon}
          wrapExit={() => { setOpenSoon(false); }}
          title="Stay tuned!"
          context={"We will be launching this\nfeature soon."}
          icon={{
            pos: 0,
            icon: <SpreadIcon color="#EFA058" width="60px" height="60px" />
          }}
        />
        <div className="content">
          <div className="top">
            <div className="part">
              <StripeIcon />
              <div className="title">{contexts.PAYMENT.STRIPE_ACCOUNT}</div>
            </div>
            <div>
              <MoreIcon color="black" />
            </div>
          </div>
          <div className="subtitle">
            {contexts.PAYMENT.STRIPE_CONTENT}
          </div>
          <div style={{ width: '100%' }} onClick={() => {
            if (payment?.stripe) disConnectStripe()
            else connectStripe()
          }}>
            <ContainerBtn styleType="fill" text={payment?.stripe ? 'Disconnect' : contexts.PAYMENT.BUTTON_CONNECT} />
          </div>
        </div>
        <div className="content">
          <div className="top">
            <div className="part">
              <PayoneerIcon />
              <div className="title">{contexts.PAYMENT.PAYONEER}</div>
            </div>
            <div>
              <MoreIcon color="black" />
            </div>
          </div>
          <div className="subtitle">
            {contexts.PAYMENT.COMING_SOON + "..."}
          </div>
          <div style={{ width: '100%' }} onClick={() => { setOpenSoon(true) }}><ContainerBtn styleType="fill" text={contexts.PAYMENT.BUTTON_CONNECT} /></div>
        </div>
      </div>
    </>
  );
};

export default Payment;

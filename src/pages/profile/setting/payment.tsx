import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MoreIcon, PayoneerIcon, StripeIcon } from "../../../assets/svg";
import { LanguageContext } from "../../../routes/authRoute";
import { useContext } from 'react';
import ContainerBtn from "../../../components/general/containerBtn";
import Title from "../../../components/general/title";
import Dialog from "../../../components/general/dialog";
import { SpreadIcon } from "../../../assets/svg";
import "../../../assets/styles/profile/paymentStyle.scss";

const Payment = () => {
  const navigate = useNavigate();
  const [openSoon, setOpenSoon] = useState(false)
  const user = useSelector((state: any) => state.auth.user);
  const contexts = useContext(LanguageContext);

  return (
    <>
      <div className="title-header">
        <Title title={contexts.PAYMENT.PAYMENT_TITLE} back={() => navigate(`/users/${user.id}/setting`)} />
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
          <div style={{ width: '100%' }} onClick={() => { setOpenSoon(true) }}><ContainerBtn styleType="fill" text={contexts.PAYMENT.BUTTON_CONNECT} /></div>
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

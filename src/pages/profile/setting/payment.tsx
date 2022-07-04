import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MoreIcon, PayoneerIcon, StripeIcon } from "../../../assets/svg";
import { LanguageContext } from "../../../routes/authRoute";
import {useContext} from 'react';
import ContainerBtn from "../../../components/general/containerBtn";
import Title from "../../../components/general/title";
import "../../../assets/styles/profile/paymentStyle.scss";

const Payment = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const contexts = useContext(LanguageContext);

  return (
    <>
      <div className="title-header">
        <Title title={contexts.PAYMENT.PAYMENT_TITLE} back={() => navigate(`/users/${user.id}/setting`)} />
      </div>
      <div className="payment-wrapper">
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
          <ContainerBtn styleType="fill" text={contexts.PAYMENT.BUTTON_CONNECT} />
        </div>
        <div className="content">
          <div className="top">
            <div className="part">
              <PayoneerIcon />
              <div className="title">{contexts.PAYMENT.STRIPE_ACCOUNT}</div>
            </div>
            <div>
              <MoreIcon color="black" />
            </div>
          </div>
          <div className="subtitle">
            {contexts.PAYMENT.COMING_SOON + "..."}
          </div>
          <ContainerBtn styleType="fill" text={contexts.PAYMENT.BUTTON_CONNECT} disabled />
        </div>
      </div>
    </>
  );
};

export default Payment;

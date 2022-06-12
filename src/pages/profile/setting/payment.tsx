import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MoreIcon, PayoneerIcon, StripeIcon } from "../../../assets/svg";
import ContainerBtn from "../../../components/general/containerBtn";
import Title from "../../../components/general/title";
import "../../../assets/styles/profile/paymentStyle.scss";

const Payment = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);

  return (
    <>
      <div className="title-header">
        <Title title="Payment" back={() => navigate(`/users/${user.id}/setting`)} />
      </div>
      <div className="payment-wrapper">
        <div className="content">
          <div className="top">
            <div className="part">
              <StripeIcon />
              <div className="title">Stripe account</div>
            </div>
            <div>
              <MoreIcon color="black" />
            </div>
          </div>
          <div className="subtitle">
            Get paid direcly to local bank account <br />No min. charge
          </div>
          <ContainerBtn styleType="fill" text="Connect" />
        </div>
        <div className="content">
          <div className="top">
            <div className="part">
              <PayoneerIcon />
              <div className="title">Stripe account</div>
            </div>
            <div>
              <MoreIcon color="black" />
            </div>
          </div>
          <div className="subtitle">
            Coming soon...
          </div>
          <ContainerBtn styleType="fill" text="Connect" disabled />
        </div>
      </div>
    </>
  );
};

export default Payment;

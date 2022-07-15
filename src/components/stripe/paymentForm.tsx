import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    useStripe,
    useElements,
    CardElement
} from "@stripe/react-stripe-js";
import ContainerBtn from "../general/containerBtn";
import CONSTANT from "../../constants/constant";
import { CloseIcon } from "../../assets/svg";
import { paymentAction } from "../../redux/actions/paymentActions";
import '../../assets/styles/payment/stripe/checkoutFormStyle.scss';
import { tipAction } from "../../redux/actions/tipActions";

const stripePromise = loadStripe(CONSTANT.STRIPE_PUBLIC_KEY);

const CheckoutForm = (props: any) => {
    const dispatch = useDispatch();
    const formRef = useRef<any>(null);
    const stripe = useStripe();
    const elements = useElements();

    const [errorToDisplay, setErrorToDisplay] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        const cardElement: any = elements.getElement(CardElement);
        if (!cardElement) return setErrorToDisplay('No exit card!');
        const token = await stripe.createToken(cardElement);
        if (token.error) return setErrorToDisplay('' + token.error.message);
        if (props.tipData !== undefined) dispatch(tipAction.tipDonutAsVistor(token.token, props.donutPlan, props.tipData));
        else dispatch(paymentAction.buyDonuts(token.token, props.donutPlan));
        setErrorToDisplay('');
    }

    useEffect(() => {
        const cardElement: any = elements?.getElement(CardElement);
        if (cardElement) cardElement.clear();
        setErrorToDisplay("");
    }, [props.display]);

    return (
        <div className="stripe-checkout-wrapper" style={props.display ? { visibility: 'visible', opacity: 1 } : {}} onClick={props.exit}>
            <div className="stripe-checkout" onClick={e => e.stopPropagation()}>
                <div className="stripe-header">
                    <div className="header-title">
                        Buy Donuts
                    </div>
                    <div onClick={props.exit}>
                        <CloseIcon color="black" />
                    </div>
                </div>
                <div className="stripe-letter">
                    <span>Enter your card details.</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card-element">
                        <CardElement />
                    </div>
                    <div className="error-letter">
                        <span>{errorToDisplay ? errorToDisplay : null}</span>
                    </div>
                    <div className="pay-button">
                        <div style={{ width: '200px' }} onClick={() => { formRef.current.click(); }}>
                            <ContainerBtn text="Pay" styleType="fill" />
                            <input type="submit" hidden ref={formRef} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

const PaymentForm = (props: any) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm {...props} />
        </Elements>
    )
}

export default PaymentForm;
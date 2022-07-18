import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
import ContainerBtn from "../general/containerBtn";
import CONSTANT from "../../constants/constant";
import { CloseIcon, VisaCardIcon, VisaCardActiveIcon, MasterCardIcon, MasterCardActiveIcon, AECardIcon, AECardActiveIcon, UnionPayCardIcon, UnionPayCardActiveIcon } from "../../assets/svg";
import { paymentAction } from "../../redux/actions/paymentActions";
import { tipAction } from "../../redux/actions/tipActions";
import '../../assets/styles/payment/stripe/checkoutFormStyle.scss';
import { SET_LOADING_FALSE, SET_LOADING_TRUE } from "../../redux/types";

const stripePromise = loadStripe(CONSTANT.STRIPE_PUBLIC_KEY);

const CheckoutForm = (props: any) => {
    const [numberInfo, setNumberInfo] = useState<any>(null);
    const [holder, setHolder] = useState("");
    const dispatch = useDispatch();
    const formRef = useRef<any>(null);
    const stripe = useStripe();
    const elements = useElements();
    const checkBoxRef = useRef(null);
    const [saveCheck, setSaveCheck] = useState(false);

    const elementStyle = {
        lineHeight: '42px',
        color: '#54504E'
    }
    //type 
    //visa 4242 4242 4242 4242
    //american-express 3742 4545 5400 126
    //unionpay 6250 9410 0652 8599
    //mastercard 5425 2334 3010 9903
    const [errorToDisplay, setErrorToDisplay] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const cardNumberElement = elements?.getElement(CardNumberElement);
        if (!cardNumberElement) return setErrorToDisplay('No exit card!');
        dispatch({ type: SET_LOADING_TRUE });
        const token = await stripe.createToken(cardNumberElement, { name: holder });
        if (token.error) {
            dispatch({ type: SET_LOADING_FALSE });
            return setErrorToDisplay('' + token.error.message);
        }
        if (props.tipData !== undefined) dispatch(tipAction.tipDonutAsVistor(token.token, props.donutPlan, props.tipData));
        else dispatch(paymentAction.buyDonuts(token.token, props.donutPlan, null, saveCheck));
        setErrorToDisplay('');
    }

    useEffect(() => {
        const cardNumberElement: any = elements?.getElement(CardNumberElement);
        if (cardNumberElement) cardNumberElement.clear();
        const expiryElement: any = elements?.getElement(CardExpiryElement);
        if (expiryElement) expiryElement.clear();
        const cvcElement: any = elements?.getElement(CardCvcElement);
        if (cvcElement) cvcElement.clear();
        setHolder("");
        setSaveCheck(false);
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
                    <div className="card-types">
                        <div className="letter">
                            <span>Card Number</span>
                        </div>
                        <div className="card-type">
                            <div className="card">{numberInfo && numberInfo.brand === "visa" ? numberInfo.error?.code !== "invalid_number" ? <VisaCardActiveIcon /> : <VisaCardIcon /> : <VisaCardIcon />}</div>
                            <div className="card">{numberInfo && numberInfo.brand === "mastercard" ? numberInfo?.error?.code !== "invalid_number" ? <MasterCardActiveIcon /> : <MasterCardIcon /> : <MasterCardIcon />}</div>
                            <div className="card">{numberInfo && numberInfo.brand === "amex" ? numberInfo.error?.code !== "invalid_number" ? <AECardActiveIcon /> : <AECardIcon /> : <AECardIcon />}</div>
                            <div className="card">{numberInfo && numberInfo.brand === "unionpay" ? numberInfo.error?.code !== "invalid_number" ? <UnionPayCardActiveIcon /> : <UnionPayCardIcon /> : <UnionPayCardIcon />}</div>
                        </div>
                    </div >
                    <div className="card-number">
                        <CardNumberElement
                            onChange={(e) => { setNumberInfo(e) }}
                            options={{
                                style: {
                                    base: elementStyle,
                                },
                            }}
                        />
                    </div>
                    <div className="card-holder-name">
                        <div className="letter">
                            <span>Card holder name</span>
                        </div>
                        <div className="holder-name">
                            <input
                                value={holder}
                                onChange={(e: any) => { setHolder(e.target.value) }}
                                placeholder="Card holder name"
                            />
                        </div>
                    </div>
                    <div className="expire-cvv">
                        <div className="expire">
                            <div className="letter">
                                Exp date
                            </div>
                            <div className="expire-ele">
                                <CardExpiryElement
                                    options={{
                                        style: {
                                            base: elementStyle,
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <div className="cvv">
                            <div className="letter">
                                CVC
                            </div>
                            <div className="cvv-ele">
                                <CardCvcElement
                                    options={{
                                        style: {
                                            base: elementStyle,
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {props.tipData === undefined &&
                        <div className="check-box">
                            <label className="checkbox">
                                <input type="checkbox" id="save_card" ref={checkBoxRef} checked={saveCheck} onChange={(e) => { setSaveCheck(e.target.checked) }} />
                                <span className="letter">&nbsp;Save this card for future purchases</span>
                            </label>
                        </div>
                    }
                    <div className="error-letter">
                        <span>{errorToDisplay ? errorToDisplay : null}</span>
                    </div>
                    <div className="pay-button">
                        <div style={{ width: '240px' }} onClick={() => { formRef.current.click(); }}>
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
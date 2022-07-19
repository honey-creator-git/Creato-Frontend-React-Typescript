import { useEffect, useState, useContext } from "react";
import Creato from "../general/creato";
import { CloseIcon } from "../../assets/svg";
import ContainerBtn from "../general/containerBtn";
import { LanguageContext } from "../../routes/authRoute";
import "../../assets/styles/payment/stripe/displayDonutsPlanStyle.scss";

interface donutsPlan {
    display: boolean,
    creato: any;
    exit: any,
    handleSubmit: any
};

const DisplayDonutsPlan = (props: donutsPlan) => {
    const context = useContext(LanguageContext);
    const [price, setPrice] = useState<Number>(0.0);

    useEffect(() => {
        if (props.creato) {
            let money = props.creato.donutCount / 10 * (100 - props.creato.discountedPercent) / 100;
            money += money * 0.034 + 0.3;
            setPrice(Number(money.toFixed(2)));
        }
    }, [props.creato]);

    return (
        <div className="display-donuts-plan-wrapper" style={props.display ? { visibility: 'visible', opacity: 1 } : {}} onClick={props.exit}>
            <div className="display-donuts-plan" onClick={e => e.stopPropagation()}>
                <div className="header-part">
                    <div className="confirm-btn">{context.PAYMENT.CONFIRM}</div>
                    <div onClick={props.exit}><CloseIcon color="black" /></div>
                </div>
                <div className="creato">
                    <Creato
                        hoverDisable={true}
                        property={props.creato?.property}
                        donutCount={props.creato?.donutCount}
                        discountedPercent={props.creato?.discountedPercent}
                    />
                </div>
                <div className="money-to-charge">
                    <span>{context.PAYMENT.CHARGE_FIRST_PART}<strong>${price}{context.PAYMENT.CHARGE_USD}</strong></span>
                    <span>{context.PAYMENT.CHARGE_SECOND_PART}</span>
                </div>
                <div className="privacy-policy">
                    <span>
                        {context.PAYMENT.TERM_PRIVACY_FIRST_PART}
                        <span className="link" onClick={() => {
                            window.open("https://www.notion.so/Terms-Conditions-of-Use-4e807f509cf54d569031fe254afbf713")
                        }}>{context.PAYMENT.TERMS_CONDITIONS}</span>{context.PAYMENT.TERM_AND}
                        <span className="link" onClick={() => { window.open("https://www.notion.so/Privacy-Policy-f718ec335447402a8bb863cb72d3ee33") }}>
                            {context.PAYMENT.PRIVACY_POLICY}</span>{context.PAYMENT.TERM_PRIVACY_LAST_PART}
                    </span>
                </div>
                <div className="checkout-btn" onClick={props.handleSubmit}>
                    <ContainerBtn
                        styleType="fill"
                        text={context.PAYMENT.CHECKOUT}
                    />
                </div>
            </div>
        </div>
    );
}

export default DisplayDonutsPlan;
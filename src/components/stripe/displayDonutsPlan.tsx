import Creato from "../general/creato";
import { CloseIcon } from "../../assets/svg";
import ContainerBtn from "../general/containerBtn";
import "../../assets/styles/payment/stripe/displayDonutsPlanStyle.scss";

interface donutsPlan {
    display: boolean,
    creato: any;
    exit: any,
    handleSubmit: any
};

const DisplayDonutsPlan = (props: donutsPlan) => {

    return (
        <div className="display-donuts-plan-wrapper" style={props.display ? { visibility: 'visible', opacity: 1 } : {}} onClick={props.exit}>
            <div className="display-donuts-plan" onClick={e => e.stopPropagation()}>
                <div className="header-part">
                    <div></div>
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
                <div className="checkout-btn" onClick={props.handleSubmit}>
                    <ContainerBtn 
                        styleType="fill"
                        text="Checkout"
                    />
                </div>
            </div>
        </div>
    );
}

export default DisplayDonutsPlan;
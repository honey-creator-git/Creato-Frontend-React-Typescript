import Button from "../general/button";
import { CloseIcon } from "../../assets/svg";
import InputDonuts from "../general/inputDonuts";
import "../../assets/styles/dialogStyle.scss";

const PayoutDonuts = (props: any) => {
    const { display, exit, buttons, icon, wrapExit, setAmount, amount, maxnum } = props;

    return (
        <div className="dialog-wrapper" style={display ? { visibility: 'visible', opacity: 1 } : {}} onClick={wrapExit}>
            <div className="dialog-main" onClick={e => e.stopPropagation()}>
                {icon && icon.pos === 0 && <div className="big-icon">{icon.icon}</div>}
                {exit &&
                    <div className="dialog-header" style={exit ? { marginBottom: '16px' } : { justifyContent: 'center', marginBottom: '8px' }}>
                        <div className="dialog-title">
                            Confirm:
                        </div>
                        {exit &&
                            <div onClick={exit}>
                                <CloseIcon color="black" />
                            </div>
                        }
                    </div>
                }
                <div>
                    You can payout maximum {maxnum} donuts.
                </div>
                <div className="add-donuts">
                    <InputDonuts
                        setAmount={setAmount}
                        amount={amount}
                    />
                </div>
                {buttons &&
                    <div className="dialog-buttons" style={buttons.length === 2 ? { justifyContent: 'space-between' } : {}}>
                        {
                            buttons.map((button: any, index: any) => (
                                <div key={index}>
                                    <Button
                                        color="primary"
                                        shape="rounded"
                                        fillStyle={index === 0 ? buttons.length === 1 ? "fill" : "outline" : "fill"}
                                        width={buttons.length === 2 ? "75px" : "190px"}
                                        text={button.text}
                                        handleSubmit={button.handleClick}
                                    />
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default PayoutDonuts;
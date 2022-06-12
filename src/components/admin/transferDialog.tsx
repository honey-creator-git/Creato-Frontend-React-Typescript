import Button from "../general/button";
import { useSelector } from "react-redux";
import { CloseIcon } from "../../assets/svg";
import InputDonuts from "../general/inputDonuts";
import Select from "../general/select";
import "../../assets/styles/dialogStyle.scss";

const TransferDialog = (props: any) => {
    const { display, title, exit, buttons, icon, wrapExit, type, setAmount, amount, setFrom, setTo, from, to } = props;
    const users = useSelector((state: any) => state.auth.users);

    return (
        <div className="dialog-wrapper" style={display ? { visibility: 'visible', opacity: 1 } : {}} onClick={wrapExit}>
            <div className="dialog-main" onClick={e => e.stopPropagation()}>
                {icon && icon.pos === 0 && <div className="big-icon">{icon.icon}</div>}
                {(title || exit) &&
                    <div className="dialog-header" style={exit ? { marginBottom: '16px' } : { justifyContent: 'center', marginBottom: '8px' }}>
                        <div className="dialog-title">
                            {title}
                        </div>
                        {exit &&
                            <div onClick={exit}>
                                <CloseIcon color="black" />
                            </div>
                        }
                    </div>
                }
                {type === "transfer" &&
                    <>
                        <Select label="From" users={users} setOption={setFrom} option={from}/>
                        <br/>
                        <Select label="To" users={users} setOption={setTo} option={to}/>
                    </>
                }

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

export default TransferDialog;
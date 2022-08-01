import Button from "../general/button";
import Input from "../general/input";
import { CloseIcon } from "../../assets/svg";
import "../../assets/styles/dialogStyle.scss";

const NotificationSettingDialog = (props: any) => {
    const { display, title, exit, buttons, wrapExit, type, newOne, setNewOne } = props;

    return (
        <div className="dialog-wrapper" style={display ? { visibility: 'visible', opacity: 1 } : {}} onClick={wrapExit}>
            <div className="dialog-main" onClick={e => e.stopPropagation()}>
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
                <div className="notification-new-one"> Add a new one </div>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <Input 
                        width={240}
                        type="textarea"
                        title={newOne}
                        setTitle={setNewOne}
                        placeholder={
                            type === 0 ? 'Please input a new section...' : 
                            type === 1 ? 'Plese input a new sender...' :
                            type === 2 ? 'Please input a new recipient...' :
                            'Please input a new trigger...'
                        }
                        setFocus={() => { }}
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

export default NotificationSettingDialog;
import DareOption from "../general/dareOption";
import Button from "../general/button";
import { CloseIcon } from "../../assets/svg";
import "../../assets/styles/dialogStyle.scss";

const RefundDlg = (props: any) => {
    const { display, wrapExit, exit, title } = props
    return (
        <div className="dialog-wrapper" style={display ? { visibility: 'visible', opacity: 1 } : {}} onClick={wrapExit}>
            <div className="dialog-main" onClick={e => e.stopPropagation()}>
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
                {/* {avatars &&
                    <>
                        {avatars.length === 2 ?
                            <div className="avatars-wrapper">
                                <div className="dialog-avatars">
                                    <div className="owner-avatar">
                                        <Avatar
                                            avatar={avatars[0]}
                                            size="web"
                                        />
                                    </div>
                                    <div className="user-avatar">
                                        <Avatar
                                            avatar={avatars[1]}
                                            size="web"
                                        />
                                    </div>
                                </div>
                            </div>
                            :
                            <>
                                {avatars.length === 1 &&
                                    <div className="cover-image">
                                        <img src={avatars[0]} style={sizeType ? { width: 'auto', height: '100%' } : { width: '100%', height: 'auto' }} />
                                    </div>
                                }
                            </>

                        }
                    </>
                }
                {subTitle &&
                    <div className="dialog-subcontext-top-header">
                        <span style={{ whiteSpace: 'pre-line' }}>{subTitle}</span>
                    </div>
                }
                <div className="dialog-context">
                    <span style={{ whiteSpace: 'pre-line' }}>{context}</span>
                </div>
                {subcontext &&
                    <>
                        <div className="dialog-subcontext-top-header">
                            <span style={{ whiteSpace: 'pre-line' }}>🎉 You’ve earned 10 Donuts!</span>
                        </div>
                        <div className="dialog-subcontext-header">
                            <span style={{ whiteSpace: 'pre-line' }}>You can now:</span>
                        </div>
                        <div className="dialog-subcontext">
                            <li>Support Creators with Donuts</li>
                            <li>Take part in their content curation</li>
                            <li>Get exclusive rewards from Creators</li>
                        </div>
                    </>
                }
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
                                    handleSubmit={langauge ? () => {
                                        dispatch({ type: SET_LANGUAGE, payload: lang });
                                        exit();
                                        navigate("/");
                                    } : button.handleClick}
                                />
                            </div>
                        ))
                    }
                </div>*/}
            </div> 
        </div>
    )
}

export default RefundDlg
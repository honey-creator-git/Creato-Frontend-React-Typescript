import Avatar from "../general/avatar";
import Button from "../general/button";
import { CreatoCoinIcon, WhatsappIcon, FacebookIcon, TwitterIcon, CloseIcon } from "../../assets/svg";
import "../../assets/styles/tip/tipMessageDlgStyle.scss";

const TipMessageDlg = (props: any) => {
    const { display, wrapExit, tipData, exit } = props;

    return (
        <div className="tip-dialog-wrapper" style={display ? { visibility: 'visible', opacity: 1 } : {}} onClick={wrapExit}>
            <div className="dialog-main" onClick={e => e.stopPropagation()}>
                {tipData &&
                    <>
                        <div className="avatars-wrapper">
                            <div className="dialog-avatars">
                                <div className="owner-avatar">
                                    <Avatar
                                        avatar={tipData.avatars[0]}
                                        size="web"
                                    />
                                </div>
                                <div className="user-avatar">
                                    <Avatar
                                        avatar={tipData.avatars[1]}
                                        size="web"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="donuts-count">
                            <div className="donuts-icon">
                                <CreatoCoinIcon color="#EFA058" width={60} height={60} />
                            </div>
                            <div className="count">
                                <span>
                                    {tipData.tip < 10000 ? tipData.tip.toLocaleString() :
                                        tipData.tip < 100000 ? `${Math.round(tipData.tip / 100) / 10}K` :
                                            tipData.tip < 1000000 ? `${Math.round(tipData.tip / 1000)}K` :
                                                tipData.tip < 10000000 ? `${Math.round(tipData.tip / 100000) / 10}M` : ''}
                                </span>
                            </div>
                        </div>
                        <div className="dialog-social">
                            <div className="link" onClick={() => {
                                let text = `I have tipped xxx Donuts to [owner's name] on Creato! Check it out`;
                                window.open(`https://www.facebook.com/sharer/sharer.php?quote=${text}`, 'sharer');

                            }}>
                                <FacebookIcon color="#EFA058" />
                            </div>
                            <div className="link" onClick={() => {
                                let text = `I have tipped xxx Donuts to [owner's name] on Creato! Check it out`;
                                window.open(`https://wa.me/?text=${text}`);
                            }}>
                                <WhatsappIcon color="#EFA058" />
                            </div>
                            <div className="link" onClick={() => {
                                let text = `I have tipped xxx Donuts to [owner's name] on Creato! Check it out`;
                                window.open(`https://twitter.com/share?text=${text}`, 'sharer');
                            }}>
                                <TwitterIcon color="#EFA058" />
                            </div>
                        </div>
                        {tipData.message !== "" &&
                            <div className="message-wrapper">
                                <div className="text">
                                    <span>
                                        {tipData.message}
                                    </span>
                                </div>
                            </div>
                        }
                        <div className="username">
                            {tipData.message !== "" && <span></span>}
                            <span className="name-text">{tipData.username}</span>
                        </div>
                        <div className="exit-btn">
                            <Button
                                fillStyle="fill"
                                color="primary"
                                icon={[
                                    <CloseIcon color="white" />,
                                    <CloseIcon color="white" />,
                                    <CloseIcon color="white" />
                                ]}
                                handleSubmit={exit}
                            />
                        </div>
                    </>
                }
            </div>
        </div>
    )
};

export default TipMessageDlg;
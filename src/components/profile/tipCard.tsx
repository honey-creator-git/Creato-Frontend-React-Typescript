import { useState } from "react";
import Avatar from "../general/avatar";
import { CreatoCoinIcon } from "../../assets/svg";
import "../../assets/styles/profile/components/tipCardStyle.scss";

const TipCard = (props: any) => {
    const [clickState, setClickState] = useState(false);

    return (
        <div className="tipcard-wrapper"
            onMouseOver={() => { setClickState(true) }}
            onMouseLeave={() => { setClickState(false) }}
            onClick={props.handleClick}
        >
            <div className="avatar">
                <Avatar
                    size="mobile"
                    avatar={props.avatar}
                />
            </div>
            <div className="tip-info">
                <div className="top-info">
                    <span className="username">{props.username}</span>
                    <div className="donuts-info">
                        <div className="donuts-icon">
                            <CreatoCoinIcon color={clickState ? "#FFFFFF" : "#EFA058"} width={20} height={20} />
                        </div>
                        <span className="donuts-number">{
                            props.tip < 10000 ? props.tip.toLocaleString() :
                                props.tip < 100000 ? `${Math.round(props.tip / 100) / 10}K` :
                                    props.tip < 1000000 ? `${Math.round(props.tip / 1000)}K` :
                                        props.tip < 10000000 ? `${Math.round(props.tip / 100000) / 10}M` : ''}
                        </span>
                    </div>
                </div>
                <div className="bottom-info">
                    <div>
                        <span className="message">{props.message.length > 20 ? props.message.substring(0, 20) : props.message}</span>
                    </div>
                    <div>{props.message === "" ? <></> : <span className="see-more">...see more</span>}</div>
                </div>
            </div>
        </div>
    );
}

export default TipCard;
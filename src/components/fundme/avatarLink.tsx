import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Avatar from "../general/avatar";
import CONSTANT from "../../constants/constant";
import { MoreIcon } from "../../assets/svg";
import "../../assets/styles/dareme/components/avatarLinkStyle.scss";

const useOutsideAlerter = (ref: any, moreInfo: any) => {
    const [more, setMore] = useState(moreInfo);
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            setMore(moreInfo);
            if (ref.current && !ref.current.contains(event.target)) {
                if (moreInfo) setMore(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, moreInfo]);
    return more;
}

const AvatarLink = (props: any) => {
    const { avatar, username, ownerId, handleAvatar, fundmeId, isFanwall, delData } = props;
    const [moreInfo, setMoreInfo] = useState(false);
    const userState = useSelector((state: any) => state.auth);
    const user = userState.user;
    const wrapRef = useRef<any>(null);
    const res = useOutsideAlerter(wrapRef, moreInfo);

    useEffect(() => {
        if (!res) setMoreInfo(res);
    }, [res]);

    return (
        <>
            <div className="avatar-link-wrapper">
                <Avatar
                    avatar={avatar.indexOf('uploads') === -1 ? avatar : `${CONSTANT.SERVER_URL}/${avatar}`}
                    username={username}
                    avatarStyle="horizontal"
                    size="small"
                    handleClick={handleAvatar}
                />
                <div onClick={() => { setMoreInfo(true) }}>
                    <MoreIcon color="#EFA058" />
                </div>
                <div className="drop-down-list" style={moreInfo === true ? { visibility: 'visible', opacity: 1 } : {}} ref={wrapRef}>
                    <div className="list" onClick={() => {
                        if (isFanwall) navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/fundme/fanwall/detail/${fundmeId}`);
                        else navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/fundme/details/${fundmeId}`);
                        setMoreInfo(false);
                    }}>
                        Copy link
                    </div>
                    {isFanwall ?
                        <>
                            {(user && user.id === ownerId) &&
                                <div className="list" onClick={() => {

                                }}>
                                    Edit
                                </div>
                            }
                        </> :
                        <div className="list">
                            <a href="https://www.creatogether.app/contact-us" target="_blank" style={{ textDecoration: 'none' }} >Report</a>
                        </div>
                    }
                    {(user && user.id === ownerId) &&
                        <div className="list" onClick={() => {
                            setMoreInfo(false);
                            if (isFanwall) delData();
                        }}>
                            Delete
                        </div>
                    }
                    <div className="list" onClick={() => { setMoreInfo(false) }}>
                        Cancel
                    </div>
                </div>
            </div >
        </>
    );
}

export default AvatarLink;
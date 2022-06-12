import Avatar from "../general/avatar";
import { LikeIcon, LikedIcon } from "../../assets/svg";
import "../../assets/styles/fanwall/components/fanwallLikeStyle.scss";

const FanwallLike = (props: any) => {
    const { avatar, username, likes, handleLike, handleAvatar, isLiked } = props;

    return (
        <div className="fanwall-like">
            <Avatar
                username={username}
                avatar={avatar}
                size="small"
                avatarStyle="horizontal"
                handleClick={handleAvatar}
            />
            <div className="fanwall-like-info">
                <div className="like-count">
                    {likes}
                </div>
                {isLiked === true ?
                    <div className="like-icon">
                        <LikedIcon color="#EBA18C" />
                    </div> :
                    <div className="like-icon" onClick={handleLike}>
                        <LikeIcon color="#7E7875" />
                    </div>
                }

            </div>
        </div>
    );
}

export default FanwallLike;
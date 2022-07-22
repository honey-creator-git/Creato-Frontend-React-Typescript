import { useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { tipAction } from "../../../redux/actions/tipActions";
import Title from "../../../components/general/title";
import Button from "../../../components/general/button";
import Avatar from "../../../components/general/avatar";
import TipCard from "../../../components/profile/tipCard";
import TipMessageDlg from "../../../components/profile/tipMessageDlg";
import { LanguageContext } from "../../../routes/authRoute";
import { TipIcon, RetrieveIcon, ExpandIcon } from "../../../assets/svg";
import CONSTANT from "../../../constants/constant";
import visitorImg from "../../../assets/img/visitor_avatar.png";
import '../../../assets/styles/admin/tip/adminTipProfileStyle.scss';
import "../../../assets/styles/profile/components/profileHeaderStyle.scss";

const ProfileHeader = (props: any) => {
    const navigate = useNavigate();
    const userStore = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const contexts = useContext(LanguageContext);
    const authuser = userStore.users[0];
    const [categoryText, setCategoryText] = useState("");

    useEffect(() => {
        if (authuser && authuser.categories.length) {
            let categories = authuser.categories;
            let texts = ""
            categories.sort((a: any, b: any) => { return a > b ? 1 : a < b ? -1 : 0 });
            categories.forEach((categoryIndex: any, index: any) => {
                texts += contexts.CREATOR_CATEGORY_LIST[categoryIndex];
                if (index < categories.length - 1) texts += "/";
            });
            setCategoryText(texts);
        }
    }, [authuser, contexts.CREATOR_CATEGORY_LIST]);

    const tipping = () => {
        dispatch(tipAction.setTipFunction(authuser.tipFunction ? !authuser.tipFunction : true, authuser?._id));
    }

    return (
        <div
            className="profile-header"
            style={{ height: `${props.size === "mobile" ? "169px" : "254px"}` }}
        >
            <div className="avatar">
                <Avatar
                    size={props.size}
                    avatarStyle="horizontal"
                    category={categoryText}
                    username={authuser ? authuser.name : ''}
                    avatar={authuser ? authuser.avatar.indexOf('uploads') === -1 ? authuser.avatar : `${CONSTANT.SERVER_URL}/${authuser.avatar}` : ''}
                />
            </div>
            <div className="create-btn">
                {authuser &&
                    <>
                        {
                            (authuser.tipFunction === false) ?
                                <Button
                                    handleSubmit={tipping}
                                    color="primary"
                                    shape="pill"
                                    bgColor="#BAB6B5"
                                    fillStyle="fill"
                                    icon={[<TipIcon color="white" />, <TipIcon color="white" />, <TipIcon color="white" />]}
                                />
                                :
                                <Button
                                    handleSubmit={tipping}
                                    color="primary"
                                    shape="pill"
                                    fillStyle="fill"
                                    icon={[<TipIcon color="white" />, <TipIcon color="white" />, <TipIcon color="white" />]}
                                />
                        }
                    </>
                }
            </div>
        </div>
    );
};

const TipProfile = () => {
    const { url } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const tips = useSelector((state: any) => state.fanwall.tips);
    const authuser = useSelector((state: any) => state.auth.users[0])
    const [expandState, setExpandState] = useState(false);
    const [tipIndex, setTipIndex] = useState(3);
    const [hoverState, setHoverState] = useState(false);
    const [selectedTipData, setSelectedTipData] = useState<any>(null);
    const [openTipMessageDlg, setOpenTipMessageDlg] = useState(false);
    const [timerId, setTimerId] = useState<any>(0);


    const openDlg = (index: any) => {
        setSelectedTipData({
            id: tips[index]._id,
            username: tips[index].tipper ? tips[index].tipper.name : tips[index].nickname,
            tip: tips[index].tip,
            message: tips[index].message,
            avatars: [
                authuser.avatar.indexOf('uploads') === -1 ? authuser.avatar : `${CONSTANT.SERVER_URL}/${authuser.avatar}`,
                tips[index].tipper ? tips[index].tipper.avatar.indexOf('uploads') === -1 ? tips[index].tipper.avatar : `${CONSTANT.SERVER_URL}/${tips[index].tipper.avatar}` : visitorImg
            ],
            ownername: authuser?.name,
            ownerURL: `${CONSTANT.SERVER_URL}/${authuser?.personalisedUrl}`
        });
        setOpenTipMessageDlg(true);
    }

    useEffect(() => {
        if (expandState) {
            if (tipIndex === 3 && tips.length > 3) {
                const tId = setInterval(() => {
                    setTipIndex((tipIndex) => tipIndex + 1);
                }, 80);
                setTimerId(tId);
            }
        } else {
            if (tipIndex > 3 && tips.length > 3) {
                const tId = setInterval(() => {
                    setTipIndex((tipIndex) => tipIndex - 1);
                }, 80);
                setTimerId(tId);
            }
        }
    }, [expandState]);

    useEffect(() => {
        if (tips.length > 3 && tipIndex === tips.length && timerId) clearInterval(timerId);
        if (tips.length > 3 && tipIndex === 3 && timerId) {
            window.scrollTo(0, 0);
            clearInterval(timerId);
        }
    }, [tipIndex]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(tipAction.getTipProfile(url));
    }, [location]);

    return (
        <div className="admin-tip-profile-wrapper">
            <Title title="Tipping on fanwall" back={() => { navigate('/admin/tipping') }} />
            <TipMessageDlg
                display={openTipMessageDlg}
                wrapExit={() => { setOpenTipMessageDlg(false) }}
                exit={() => { setOpenTipMessageDlg(false) }}
                tipData={selectedTipData}
                editTip={() => { navigate(`/admin/tipping/profile/${url}/${selectedTipData.id}/edit`) }}
                admin={true}
            />
            <div className="tip-profile-header">
                <ProfileHeader
                    size="mobile"
                />
            </div>
            <div className="tip-list">
                <div className="tip-list-header">
                    <TipIcon color="#EFA058" />
                    <span>&nbsp;&nbsp;Creator’s Tipping</span>
                </div>
                <div className="tips">
                    {tips.map((tip: any, index: any) => {
                        if (index < tipIndex) {
                            return <div className="card-detail" key={index}>
                                <TipCard
                                    avatar={tip.tipper ? tip.tipper.avatar.indexOf('uploads') === -1 ? tip.tipper.avatar : `${CONSTANT.SERVER_URL}/${tip.tipper.avatar}` : visitorImg}
                                    username={tip.tipper ? tip.tipper.name : tip.nickname}
                                    tip={tip.tip}
                                    message={tip.message}
                                    show={tip.show}
                                    handleClick={() => { }}
                                    admin={true}
                                    openDlg={() => { openDlg(index) }}
                                    changeVisible={() => { dispatch(tipAction.changeVisible(!tip.show, tip._id)) }}
                                />
                            </div>
                        }
                    }
                    )}
                </div>
                <div className="arrow-wrapper">
                    {tips.length > 3 &&
                        <div className="arrow"
                            onClick={() => { setExpandState(!expandState) }}
                            onMouseOver={() => { setHoverState(true) }}
                            onMouseLeave={() => { setHoverState(false) }}
                        >
                            {expandState ?
                                <RetrieveIcon color="#000000" width={hoverState ? 30 : 24} height={hoverState ? 30 : 24} />
                                :
                                <ExpandIcon color="#000000" width={hoverState ? 30 : 24} height={hoverState ? 30 : 24} />}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default TipProfile;
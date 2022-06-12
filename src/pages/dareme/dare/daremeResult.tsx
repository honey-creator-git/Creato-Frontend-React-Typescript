import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { daremeAction } from "../../../redux/actions/daremeActions";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
import AvatarLink from "../../../components/dareme/avatarLink";
import Title from "../../../components/general/title";
import ContainerBtn from "../../../components/general/containerBtn";
import DareOption from "../../../components/general/dareOption";
import CategoryBtn from "../../../components/general/categoryBtn";
import Dialog from "../../../components/general/dialog";
import CONSTANT from "../../../constants/constant";
import { LanguageContext } from "../../../routes/authRoute";
import { CreatoCoinIcon, SpreadIcon } from "../../../assets/svg";
import { SET_FANWALL_INITIAL } from "../../../redux/types";
import "../../../assets/styles/dareme/dare/daremeResultStyle.scss";

const DaremeResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const contexts = useContext(LanguageContext);
    const { daremeId } = useParams();
    const daremeState = useSelector((state: any) => state.dareme);
    const loadState = useSelector((state: any) => state.load);
    const fanwallState = useSelector((state: any) => state.fanwall);
    const userState = useSelector((state: any) => state.auth);
    const dareme = daremeState.dareme;
    const fanwall = fanwallState.fanwall;
    const [totalDonuts, setTotalDonuts] = useState(0);
    const [resultOptions, setResultOptions] = useState<Array<any>>([]);
    const [maxOption, setMaxOption] = useState<any>(null);
    const [isWin, setIsWin] = useState(false);
    const [isStay, setIsStay] = useState(false);
    const [isWinOptionDlg, setIsWinOptionDlg] = useState(false);
    const [winOptionId, setWinOptionId] = useState(false);
    const [optionTitle, setOptionTitle] = useState("");
    const [isCopyLinkDlg, setIsCopyLinkDlg] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const user = userState.user;

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(daremeAction.getDaremeResult(daremeId));
    }, [location]);

    useEffect(() => {
        if (dareme.title) {
            let total = 0;
            dareme.options.forEach((option: any) => { total += option.option.donuts; });
            setTotalDonuts(total);
            setResultOptions(dareme.options.sort((first: any, second: any) => {
                return first.option.donuts > second.option.donuts ? -1 : first.option.donuts < second.option.donuts ? 1 :
                    first.option.date < second.option.date ? 1 : first.option.date > second.option.date ? -1 : 0;
            }));
        }
    }, [dareme]);

    useEffect(() => {
        if (resultOptions.length) {
            setMaxOption(resultOptions.reduce((prev: any, current: any) => (prev.option.donuts > current.option.donuts) ? prev : current));
            setIsWin(resultOptions.filter((option: any) => option.option.win === true).length ? true : false);
        }
    }, [resultOptions]);

    return (
        <>
            <div className="title-header">
                <Title
                    title={contexts.HEADER_TITLE.DAREME_RESULT}
                    back={() => { navigate(loadState.prevRoute); }}
                    voters={() => { navigate(`/dareme/${daremeId}/voters`) }}
                    ownerId={dareme?.owner?._id}
                />
            </div>
            {(maxOption && dareme.owner) &&
                <div className="dareme-result">
                    <Dialog
                        display={isStay}
                        wrapExit={() => { setIsStay(false); }}
                        title={contexts.DIALOG.HEADER_TITLE.STAY_TUNED}
                        context={contexts.DIALOG.BODY_LETTER.BEFORE_FANWALL}
                        icon={{
                            pos: 0,
                            icon: <SpreadIcon color="#EFA058" width="60px" height="60px" />
                        }}
                    />
                    <Dialog
                        display={isWinOptionDlg}
                        exit={() => { setIsWinOptionDlg(false) }}
                        wrapExit={() => { setIsWinOptionDlg(false) }}
                        title="DareMe"
                        context={contexts.DIALOG.BODY_LETTER.CONFIRM_WIN_BEFORE + " " + optionTitle + " " + contexts.DIALOG.BODY_LETTER.CONFIRM_WIN_OPTION_AFTER}
                        buttons={[
                            {
                                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                                handleClick: () => {
                                    setIsCopied(false);
                                    setIsWinOptionDlg(false);
                                    dispatch(daremeAction.winDareOption(winOptionId, daremeId));
                                    setIsCopyLinkDlg(true);
                                }
                            }
                        ]}
                    />
                    <Dialog
                        display={isCopyLinkDlg}
                        title={contexts.DIALOG.HEADER_TITLE.CONGRAT}
                        wrapExit={() => { setIsCopyLinkDlg(false) }}
                        context={optionTitle + " " + contexts.DIALOG.BODY_LETTER.WIN_CONG}
                        buttons={[
                            {
                                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                                handleClick: () => {
                                    navigator.clipboard.writeText(`${CONSTANT.CLIENT_URL}/dareme/details/${daremeId}`);
                                    setIsCopied(true);
                                }
                            }
                        ]}
                        social
                        ownerName={dareme.owner.name}
                        daremeId={daremeId}
                        shareType={"win"}
                        daremeTitle={dareme.title}
                    />
                    <div className="dareme-result-videoCardDesktop">
                        <VideoCardDesktop
                            url={`${CONSTANT.SERVER_URL}/${dareme.teaser}`}
                            sizeType={dareme.sizeType}
                            coverImage={dareme.cover ? `${CONSTANT.SERVER_URL}/${dareme.cover}` : ""}
                        />
                        <AvatarLink
                            username={dareme.owner.name}
                            avatar={dareme.owner.avatar}
                            ownerId={dareme.owner._id}
                            handleAvatar={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(dareme.owner.personalisedUrl, navigate)); }}
                            daremeId={dareme._id}
                        />
                    </div>
                    <div className="dareme-result-information">
                        <div className="desktop-header-info">
                            <div className="time-info">
                                <div className="left-time">{contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.ENDED}</div>
                                <div className="vote-info">
                                    <CreatoCoinIcon color="black" />
                                    <span>{totalDonuts !== null ? totalDonuts.toLocaleString() : ''}</span>
                                </div>
                            </div>
                            <div className="dare-title">{dareme.title}</div>
                            <div className="dare-category">
                                <CategoryBtn text={contexts.DAREME_CATEGORY_LIST[dareme.category - 1]} color="primary" />
                            </div>
                        </div>
                        <div className="result-info">
                            <div className="result-win-options">
                                {resultOptions.length > 0 &&
                                    <>
                                        {isWin ?
                                            resultOptions.filter((option: any) => option.option.win === true).map((option: any, i: any) => (
                                                <div key={i} style={{ marginBottom: '8px' }}>
                                                    <DareOption
                                                        dareTitle={option.option.title}
                                                        donuts={option.option.donuts}
                                                        voters={option.option.voters}
                                                        canVote={false}
                                                        disabled={false}
                                                        username={option.option.writer.name}
                                                        leading={true}
                                                        handleSubmit={() => { }}
                                                    />
                                                </div>
                                            ))
                                            :
                                            resultOptions.filter((option: any) => option.option.donuts === maxOption.option.donuts).map((option: any, i: any) => (
                                                <div key={i} style={{ marginBottom: '8px' }}>
                                                    <DareOption
                                                        dareTitle={option.option.title}
                                                        donuts={option.option.donuts}
                                                        voters={option.option.voters}
                                                        canVote={false}
                                                        disabled={false}
                                                        username={option.option.writer.name}
                                                        leading={true}
                                                        handleSubmit={() => {
                                                            if (dareme.owner._id === user.id && user) {
                                                                setWinOptionId(option.option._id);
                                                                setOptionTitle(option.option.title);
                                                                setIsWinOptionDlg(true);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </>
                                }
                            </div>
                            {!isWin ?
                                <div className="tie-letter">
                                    {(user && dareme.owner._id === user.id) ?
                                        <span>
                                            Please decide which Dare option wins!<br /><br />
                                        </span>
                                        :
                                        <span>
                                            {contexts.DAREME_FINISHED.BEFORE_CREATOR_NAME + " " + dareme.owner.name + " " + contexts.DAREME_FINISHED.AFTER_CREATOR_NAME}
                                        </span>
                                    }
                                </div>
                                :
                                <div className="result-button">
                                    {user && dareme.owner._id === user.id ?
                                        <>
                                            {fanwall && fanwall.writer && fanwall.posted === false ?
                                                <>
                                                    <div onClick={() => {
                                                        dispatch({ type: SET_FANWALL_INITIAL });
                                                        navigate(`/dareme/fanwall/detail/${fanwall._id}`);
                                                    }} >
                                                        <ContainerBtn text={contexts.DAREME_FINISHED.VIEW_ON_FANWALL} styleType="fill" />
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div onClick={() => { dispatch(daremeAction.postFanwall(dareme._id, navigate)); }}>
                                                        <ContainerBtn text="Post on Fanwall" styleType="fill" />
                                                    </div>
                                                </>
                                            }
                                        </> :
                                        <>
                                            <div onClick={() => {
                                                if (fanwall === null || (fanwall.writer && fanwall.posted === false)) setIsStay(true);
                                                else {
                                                    dispatch({ type: SET_FANWALL_INITIAL });
                                                    navigate(`/dareme/fanwall/detail/${fanwall._id}`);
                                                }
                                            }}>
                                                <ContainerBtn text={contexts.DAREME_FINISHED.VIEW_ON_FANWALL} styleType="fill" />
                                            </div>
                                        </>
                                    }
                                </div>
                            }
                            <div className="dare-options scroll-bar" style={!isWin ? { maxHeight: '130px' } : {}}>
                                {isWin ?
                                    resultOptions.filter((option: any) => option.option.win !== true).map((option: any, i: any) => (
                                        <div key={i} className="dare-option">
                                            <DareOption
                                                dareTitle={option.option.title}
                                                donuts={option.option.donuts}
                                                voters={option.option.voters}
                                                canVote={false}
                                                disabled={false}
                                                username={option.option.writer.name}
                                                leading={false}
                                                handleSubmit={() => { }}
                                            />
                                        </div>
                                    ))
                                    :
                                    resultOptions.filter((option: any) => option.option.donuts !== maxOption.option.donuts).map((option: any, i: any) => (
                                        <div key={i} className="dare-option">
                                            <DareOption
                                                dareTitle={option.option.title}
                                                donuts={option.option.donuts}
                                                voters={option.option.voters}
                                                canVote={false}
                                                disabled={false}
                                                username={option.option.writer.name}
                                                leading={false}
                                                handleSubmit={() => { }}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default DaremeResult;

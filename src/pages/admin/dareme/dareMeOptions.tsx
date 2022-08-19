import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CategoryBtn from "../../../components/general/categoryBtn";
import ContainerBtn from "../../../components/general/containerBtn";
import Hint from "../../../components/general/hint";
import Input from "../../../components/general/input";
import Title from "../../../components/general/title";
import Dialog from "../../../components/general/dialog";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_ADMIN_OPTIONS } from "../../../redux/types";
import CONSTANT from "../../../constants/constant";
import "../../../assets/styles/admin/dareme/adminDareMeOptionsStyle.scss";

const suggestions = CONSTANT.DARE_OPTION_SUGGESTIONS;

const DareMeOptions = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { daremeId } = useParams();
    const daremeStore = useSelector((state: any) => state.dareme);
    const options = daremeStore.dareme.options;
    const newOptions = daremeStore.options;
    const contexts = useContext(LanguageContext);
    const [open, setOpen] = useState<boolean>(false)
    const [openHint, setOpenHint] = useState<boolean>(false);
    const [option1, setOption1] = useState<string>(
        newOptions[0] ? newOptions[0].option.title : options[0] ? options[0].option ? options[0].option.title : "" : ""
    );
    const [option2, setOption2] = useState<string>(
        newOptions[1] ? newOptions[1].option.title : options[1] ? options[1].option ? options[1].option.title : "" : ""
    );
    const [focusType, setFocusType] = useState(0);
    const onConfirm = () => {
        handleSave();
    };

    const handleSave = () => {
        const res = [
            {
                option: {
                    _id: options[0] ? options[0].option ? options[0].option._id : null : null,
                    title: option1
                }
            },
            {
                option: {
                    _id: options[1] ? options[1].option ? options[1].option._id : null : null,
                    title: option2
                }
            }
        ];
        dispatch({ type: SET_ADMIN_OPTIONS, payload: res });
        navigate(`/admin/daremes/details/${daremeId}`);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="admin-dare-option-wrapper">
            <Title
                title={contexts.HEADER_TITLE.DARE_OPTIONS}
                back={() => {
                    if ((option1 === "" && option2 === "") || (option1 !== "" && option2 !== "")) {
                        if ((option1 === "" && option2 === "" && options.length === 0) ||
                            (option1 === "" && option2 === "" && options.length && options[0].option.title === "" && options[1].option.title === "") ||
                            (options.length && options[0].option.title === option1 && options[1].option.title === option2))
                            navigate(`/admin/daremes/details/${daremeId}`);
                        else setOpen(true);
                    }
                    else alert("You should input 2 dare options");
                }}
                hint={() => setOpenHint(!openHint)}
            />
            <div className="main-option-body">
                <Dialog
                    title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
                    display={open}
                    exit={() => { setOpen(false); }}
                    wrapExit={() => { setOpen(false); }}
                    context={contexts.DIALOG.BODY_LETTER.SAVE_DRAFT}
                    buttons={[
                        {
                            text: `${contexts.DIALOG.BUTTON_LETTER.SAVE_DRAFT}`,
                            handleClick: () => { onConfirm() }
                        }
                    ]}
                />
                <Hint
                    style={{ left: "calc(100% - 336px)" }}
                    open={openHint}
                    exit={() => { setOpenHint(false); }}
                    color="#059669"
                    title={contexts.HINT.TITLE.DARE_OPTIONS}
                    context={contexts.HINT.BODY_LETTER.DARE_OPTIONS}
                />
                <div className="options">
                    <div className="title">
                        {contexts.DARE_OPTIONS_LETTER.EXPLAIN}
                    </div>
                    <div className="option-input">
                        <Input
                            type="input"
                            placeholder={contexts.DARE_OPTIONS_LETTER.FIRST_DARE}
                            wordCount={60}
                            label=""
                            title={option1}
                            setTitle={setOption1}
                            setFocus={() => setFocusType(0)}
                        />
                    </div>
                    <div className="option-input">
                        <Input
                            type="input"
                            placeholder={contexts.DARE_OPTIONS_LETTER.SECOND_DARE}
                            wordCount={60}
                            label=""
                            title={option2}
                            setTitle={setOption2}
                            setFocus={() => setFocusType(1)}
                        />
                    </div>
                </div>
                <div className="suggestions">
                    <div className="title">{contexts.DARE_OPTIONS_LETTER.RECENT_DARES}</div>
                    {suggestions.map((suggestion, i) => (
                        <div
                            key={i}
                            className="suggestion"
                            onClick={() => {
                                if (focusType === 0) setOption1(suggestion);
                                else setOption2(suggestion);
                            }}
                        >
                            <CategoryBtn color="primary" text={suggestion} />
                        </div>
                    ))}
                </div>
                <div className="save-btn" onClick={handleSave}>
                    <ContainerBtn disabled={false} styleType="fill" text={contexts.GENERAL_LETTER.SAVE} />
                </div>
            </div>
        </div>
    );
};

export default DareMeOptions;
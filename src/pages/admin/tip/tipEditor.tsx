import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BackIcon, DeleteIcon } from "../../../assets/svg";
import ContainerBtn from "../../../components/general/containerBtn";
import Dialog from "../../../components/general/dialog";
import { tipAction } from "../../../redux/actions/tipActions";
import "../../../assets/styles/admin/tip/adminTipEditorStyle.scss";

const TipEditor = () => {
    const { id, url } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const tip = useSelector((state: any) => state.fanwall.tip);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [donuts, setDonuts] = useState('');
    const [openSaveDlg, setOpenSaveDlg] = useState(false);
    const [openDeleteDlg, setOpenDeleteDlg] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(tipAction.getTipData(id));
    }, [location]);

    useEffect(() => {
        if (tip) {
            setUsername(tip.nickname ? tip.nickname : tip.tipper.name);
            setMessage(tip.message);
            setDonuts(tip.tip);
        }
    }, [tip]);

    return (
        <div className="tip-editor-wrapper">
            <div className="tip-editor-header">
                <div className="tip-editor-back" onClick={() => { navigate(`/admin/tipping/profile/${url}`) }}>
                    <BackIcon color="black" />
                </div>
                <div className="tip-editor-title">
                    Edit Tipping card
                </div>
                <div className="tip-editor-delete" onClick={() => { setOpenDeleteDlg(true) }}>
                    <DeleteIcon color="#D94E27" width={40} height={40} />
                </div>
            </div>
            <Dialog
                display={openSaveDlg}
                wrapExit={() => { setOpenSaveDlg(false) }}
                exit={() => { setOpenSaveDlg(false) }}
                title="Confirm:"
                context={"Edit the content of tipping card.\nThis cannot be undone."}
                buttons={[
                    {
                        text: 'No',
                        handleClick: () => { setOpenSaveDlg(false) }
                    },
                    {
                        text: 'Yes',
                        handleClick: () => {
                            setOpenSaveDlg(false);
                            dispatch(tipAction.updateTip(id, tip.nickname ? username : null, message, donuts));
                        }
                    }
                ]}
            />
            <Dialog
                display={openDeleteDlg}
                wrapExit={() => { setOpenDeleteDlg(false) }}
                exit={() => { setOpenDeleteDlg(false) }}
                title="Confirm:"
                context={"Delete the whole tipping card.\nThis cannot be undone"}
                buttons={[
                    {
                        text: 'No',
                        handleClick: () => { setOpenDeleteDlg(false) }
                    },
                    {
                        text: 'Yes',
                        handleClick: () => { dispatch(tipAction.deleteTip(id, url, navigate)); }
                    }
                ]}
            />
            {tip &&
                <div className="tip-info">
                    <div className="tip-name">
                        <label>{tip.nickname ? "Nickname" : "Username"}</label>
                        <div className="input-container" style={tip.nickname ? {} : { backgroundColor: '#E1E0DF' }}>
                            <input
                                className={tip.nickname ? "input" : "input-readonly"}
                                placeholder="Let them know who you are :)"
                                readOnly={tip.nickname ? false : true}
                                value={username}
                                onChange={(e) => { setUsername(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="tip-name">
                        <label>Say something to support</label>
                        <div className="input-container">
                            <textarea
                                className="textarea"
                                placeholder="Message to Creators..."
                                value={message}
                                onChange={(e) => { setMessage(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="tip-name">
                        <label>Donut number</label>
                        <div className="input-container">
                            <input
                                className="input"
                                placeholder="Integer only"
                                value={donuts}
                                type="number"
                                onChange={(e) => { setDonuts(e.target.value) }}
                            />
                        </div>
                    </div>
                </div>
            }
            <div>
                <div style={{ width: '320px', margin: '0px auto' }} onClick={() => { setOpenSaveDlg(true) }}>
                    <ContainerBtn text="Save" styleType="fill" />
                </div>
            </div>
        </div>
    )
};

export default TipEditor;
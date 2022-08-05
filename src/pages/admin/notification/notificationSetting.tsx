import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryBtn from '../../../components/general/categoryBtn';
import Button from '../../../components/general/button';
import { AddIcon } from '../../../assets/svg';
import { SET_NOTIFICATION_LIST } from '../../../redux/types';
import { notificationAction } from '../../../redux/actions/notificationAction';
import NotificationSettingDialog from '../../../components/admin/notificationSettingDialog';
import '../../../assets/styles/admin/notification/notificationSettingStyle.scss';

const NotificationSetting = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [newOne, setNewOne] = useState("");
    const [type, setType] = useState(0);
    const [openDlg, setOpenDlg] = useState(false);
    const setting = useSelector((state: any) => state.notification.setting);

    const openDialog = (type: any) => {
        setType(type)
        setNewOne('')
        setOpenDlg(true)
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(notificationAction.getNotificationSetting())
    }, [location]);

    return (
        <div className="notification-setting-wrapper">
            <NotificationSettingDialog
                display={openDlg}
                wrapExit={() => { setOpenDlg(false) }}
                exit={() => { setOpenDlg(false) }}
                title="Confirm"
                newOne={newOne}
                setNewOne={setNewOne}
                type={type}
                buttons={[
                    {
                        text: 'Cancel',
                        handleClick: () => { setOpenDlg(false) }
                    },
                    {
                        text: 'Add',
                        handleClick: () => {
                            setOpenDlg(false);
                            dispatch(notificationAction.addNotificationSetting(newOne, type))
                        }
                    }
                ]}
            />
            <div className="navigation-button">
                <div style={{ marginRight: '5px' }}>
                    <Button text="Notification" fillStyle="outline" color="primary" handleSubmit={() => { navigate('/admin/notifications') }} />
                </div>
                <div style={{ marginRight: '5px' }}>
                    <Button text="Notification History" fillStyle="outline" color="primary" handleSubmit={() => {
                        navigate('/admin/notifications/history');
                        dispatch({ type: SET_NOTIFICATION_LIST, payload: [] });
                    }} />
                </div>
                <div style={{ marginRight: '5px' }}>
                    <Button text="Setting" fillStyle="fill" color="primary" handleSubmit={() => { navigate('/admin/notifications/setting') }} />
                </div>
            </div>
            <div className="add-new-button">
                <Button fillStyle="fill" color="primary"
                    icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                    handleSubmit={() => { navigate('/admin/notifications/new') }}
                />
            </div>
            <div className="setting-header">
                Notification Setting
            </div>
            <div className="setting-body">
                <div className="setting-section">
                    <div className="title">
                        <span>Section</span>
                    </div>
                    <div className="categories">
                        {setting &&
                            <>
                                {setting.section.map((section: any, index: any) => (
                                    <div className="category" key={index}>
                                        <CategoryBtn color='primary' text={section.title} />
                                    </div>
                                ))}
                            </>
                        }
                        <div className="add-button" onClick={() => openDialog(0)}>
                            <AddIcon color="#EFA058" width="40" height="40" />
                        </div>
                    </div>
                </div>
                <div className="setting-section">
                    <div className="title">
                        <span>Sender</span>
                    </div>
                    <div className="categories">
                        {setting &&
                            <>
                                {setting.sender.map((sender: any, index: any) => (
                                    <div className="category" key={index}>
                                        <CategoryBtn color='primary' text={sender.title} />
                                    </div>
                                ))}
                            </>
                        }
                        <div className="add-button" onClick={() => openDialog(1)}>
                            <AddIcon color="#EFA058" width="40" height="40" />
                        </div>
                    </div>
                </div>
                <div className="setting-section">
                    <div className="title">
                        <span>Recipient</span>
                    </div>
                    <div className="categories">
                        {setting &&
                            <>
                                {setting.recipient.map((recipient: any, index: any) => (
                                    <div className="category" key={index}>
                                        <CategoryBtn color='primary' text={recipient.title} />
                                    </div>
                                ))}
                            </>
                        }
                        <div className="add-button" onClick={() => openDialog(2)}>
                            <AddIcon color="#EFA058" width="40" height="40" />
                        </div>
                    </div>
                </div>
                <div className="setting-section">
                    <div className="title">
                        <span>Trigger</span>
                    </div>
                    <div className="categories">
                        {setting &&
                            <>
                                {setting.trigger.map((trigger: any, index: any) => (
                                    <div className="category" key={index}>
                                        <CategoryBtn color='primary' text={trigger.title} />
                                    </div>
                                ))}
                            </>
                        }
                        <div className="add-button" onClick={() => openDialog(3)}>
                            <AddIcon color="#EFA058" width="40" height="40" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationSetting;
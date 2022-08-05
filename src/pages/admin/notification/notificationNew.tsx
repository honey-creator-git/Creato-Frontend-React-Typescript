import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/general/button';
import Input from '../../../components/general/input';
import ToggleButton from '../../../components/admin/ToggleButton';
import { SET_NOTIFICATION_LIST } from '../../../redux/types';
import { notificationAction } from '../../../redux/actions/notificationAction';
import '../../../assets/styles/admin/notification/notificationNewStyle.scss';

const NotificationNew = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [section, setSection] = useState<any>('');
    const [sender, setSender] = useState<any>('');
    const [receiver, setReceiver] = useState<any>('');
    const [trigger, setTrigger] = useState<any>('');
    const [toggle, setToggle] = useState(false);
    const [contentEn, setContentEn] = useState('');
    const setting = useSelector((state: any) => state.notification.setting);

    const addTransactionType = () => {
        dispatch(notificationAction.addNotificationType(section, sender, receiver, trigger, toggle, contentEn, navigate))
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(notificationAction.getNotificationSetting());
    }, [location]);

    useEffect(() => {
        if (setting) {
            setSection(setting.section[0].title);
            setSender(setting.sender[0].title);
            setReceiver(setting.recipient[0].title);
            setTrigger(setting.trigger[0].title);
        }
    }, [setting]);

    return (
        <div className="notification-new-wrapper">
            <div className="navigation-button">
                <div style={{ marginRight: '5px' }}>
                    <Button text="Notification" fillStyle="outline" color="primary" handleSubmit={() => { navigate('/admin/notifications') }} />
                </div>
                <div style={{ marginRight: '5px' }}>
                    <Button text="Notification History" fillStyle="outline" color="primary" handleSubmit={() => { 
                        navigate('/admin/notifications/history') 
                        dispatch({ type: SET_NOTIFICATION_LIST, payload: [] });
                    }} />
                </div>
                <div style={{ marginRight: '5px' }}>
                    <Button text="Setting" fillStyle="outline" color="primary" handleSubmit={() => { navigate('/admin/notifications/setting') }} />
                </div>
            </div>
            <div className="new-header">
                Add New Notification
            </div>
            <div className="new-body">
                <div style={{ display: 'flex' }}>
                    <div>
                        <div className="select-option-wrapper">
                            <div className="input">
                                <span className="label">Section</span>
                                <div className="input-field">
                                    <select onChange={(e) => { setSection(e.target.value); }} value={section}>
                                        {setting?.section.map((section: any, index: any) => (
                                            <option key={index} value={section.title}>{section.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="select-option-wrapper">
                            <div className="input">
                                <span className="label">Sender</span>
                                <div className="input-field">
                                    <select onChange={(e) => { setSender(e.target.value); }} value={sender}>
                                        {setting?.sender.map((sender: any, index: any) => (
                                            <option key={index} value={sender.title}>{sender.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="select-option-wrapper">
                            <div className="input">
                                <span className="label">Recipient</span>
                                <div className="input-field">
                                    <select onChange={(e) => { setReceiver(e.target.value); }} value={receiver}>
                                        {setting?.recipient.map((receiver: any, index: any) => (
                                            <option key={index} value={receiver.title}>{receiver.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="select-option-wrapper">
                            <div className="input">
                                <span className="label">Trigger</span>
                                <div className="input-field">
                                    <select onChange={(e) => { setTrigger(e.target.value); }} value={trigger}>
                                        {setting?.trigger.map((trigger: any, index: any) => (
                                            <option key={index} value={trigger.title}>{trigger.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '160px', marginLeft: '20px' }}>
                        <ToggleButton toggle={toggle} setToggle={setToggle} />
                    </div>
                </div>
                <div className="select-option-wrapper">
                    <Input
                        label="Notification Message (English)"
                        placeholder="Text here..."
                        width={500}
                        type="textarea"
                        title={contentEn}
                        setTitle={setContentEn}
                    />
                </div>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Button text="Add" fillStyle="fill" color="primary" shape="rounded" handleSubmit={addTransactionType} />
                </div>
            </div>
        </div>
    )
}

export default NotificationNew;
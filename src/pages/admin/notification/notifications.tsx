import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../../components/general/button';
import { AddIcon, EditIcon } from '../../../assets/svg';
import { notificationAction } from '../../../redux/actions/notificationAction';
import ToggleButton from '../../../components/admin/ToggleButton';
import '../../../assets/styles/admin/notification/notificationsStyle.scss';

const Notifications = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const types = useSelector((state: any) => state.notification.types);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(notificationAction.getNotificationType())
    }, [location]);

    return (
        <div className="notifications-wrapper">
            <div className="navigation-button">
                <div style={{ marginRight: '5px' }}>
                    <Button text="Notification" fillStyle="fill" color="primary" handleSubmit={() => { navigate('/admin/notifications') }} />
                </div>
                <div style={{ marginRight: '5px' }}>
                    <Button text="Notification History" fillStyle="outline" color="primary" handleSubmit={() => { navigate('/admin/notifications/history') }} />
                </div>
                <div style={{ marginRight: '5px' }}>
                    <Button text="Setting" fillStyle="outline" color="primary" handleSubmit={() => { navigate('/admin/notifications/setting') }} />
                </div>
            </div>
            <div className="add-new-button">
                <Button fillStyle="fill" color="primary"
                    icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                    handleSubmit={() => { navigate('/admin/notifications/new') }}
                />
            </div>
            <div className="type-header">
                Notifications
            </div>
            <div className="type-body">
                {types.map((type: any, index: any) => (
                    <div key={type._id}>
                        <div className="section-title">
                            <span>{type.section}</span>
                        </div>
                        <div className="types-data">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>On/Off</th>
                                        <th>Sender</th>
                                        <th>Recipient</th>
                                        <th>Trigger</th>
                                        <th>Content</th>
                                        <th>Edit</th>
                                        <th>Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {type.info.map((info: any, i: any) => (
                                        <tr key={i}>
                                            <td><ToggleButton toggle={info.auto} setToggle={() => { dispatch(notificationAction.setNotificationAuto(type._id, i, !info.auto, navigate)) }} /></td>
                                            <td>{info.sender}</td>
                                            <td>{info.recipient}</td>
                                            <td>{info.trigger}</td>
                                            <td>{info.contentEn}</td>
                                            <td><EditIcon color="grey" /></td>
                                            <td>{info.auto ? 'Auto' : 'Manual'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Notifications;
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../../../components/general/button'
import { AddIcon, EditIcon } from '../../../assets/svg'
import { notificationAction } from '../../../redux/actions/notificationAction'
import '../../../assets/styles/admin/notification/notificationHistoryStyle.scss'

const NotificationHistory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const notifcations = useSelector((state: any) => state.notification.list)

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(notificationAction.getNotificationHistory());
    }, [location]);

    return (
        <div className="notification-history-wrapper">
            <div className="navigation-button">
                <div style={{ marginRight: '5px' }}>
                    <Button text="Notification" fillStyle="outline" color="primary" handleSubmit={() => { navigate('/admin/notifications') }} />
                </div>
                <div style={{ marginRight: '5px' }}>
                    <Button text="Notification History" fillStyle="fill" color="primary" handleSubmit={() => { navigate('/admin/notifications/history') }} />
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
            <div className="history-header">
                Notification History
            </div>
            <div className="history-body">
                <div className="history-data">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Section</th>
                                <th>Sender</th>
                                <th>Recipient</th>
                                <th>Condition</th>
                                <th>Notification Message</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifcations.map((notification: any, index: any) => (
                                <tr key={index}>
                                    <td>{new Date(notification?.date).toUTCString().slice(5, 11)} {new Date(notification?.date).toUTCString().slice(14, 16)}</td>
                                    <td>{new Date(notification?.date).toUTCString().slice(17, 26)}</td>
                                    <td>{notification.section}</td>
                                    <td>{notification.condition.sender === 'Admin' ? 'Admin' : notification.sender.name}</td>
                                    <td>{notification.receiver.name}</td>
                                    <td>{notification.condition.trigger}</td>
                                    <td dangerouslySetInnerHTML={{ __html: notification.msg }}></td>
                                    <td><EditIcon color="grey" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default NotificationHistory;

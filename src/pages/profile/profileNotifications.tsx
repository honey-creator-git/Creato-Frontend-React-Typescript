import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { daremeAction } from "../../redux/actions/daremeActions";
import Title from "../../components/general/title";
import { CreatoColorIcon, ForwardIcon } from "../../assets/svg";
import { notificationAction } from "../../redux/actions/notificationAction";
import Avatar from "../../components/general/avatar";
import { SET_NEW_NOTIFICATION } from "../../redux/types";
import CONSTANT from "../../constants/constant";
import { LanguageContext } from "../../routes/authRoute";
import '../../assets/styles/profile/profileNotificationsStyle.scss';

const ProfileNotifications = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state: any) => state.auth);
  const user = userState.user;
  const notifications = useSelector((state: any) => state.notification.list);
  const contexts = useContext(LanguageContext);

  const handleClick = (id: any, type: String, notificationId: any, read: Boolean) => {
    if (!read) {
      let unread = 0;
      notifications.forEach((notification: any) => {
        if (notification.read === false) {
          unread++;
        }
      })
      if (unread - 1 === 0) {
        dispatch({ type: SET_NEW_NOTIFICATION, payload: false });
      }
      dispatch(notificationAction.readNotification(notificationId));
      dispatch(notificationAction.getNotification());
    }
    if (type === "create_dareme" || type === "ongoing_dareme")
      navigate(`/dareme/details/${id}`)
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(notificationAction.getNotification());
  }, [location]);

  return (
    <>
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.NOTIFICATIONS} back={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(user.personalisedUrl, navigate)); }} />
      </div>
      <div className="profile-notifications">
        {notifications.filter((notification: any) => notification.read === false).length !== 0 &&
          <div className="part">
            <div className="title">{contexts.NOTIFICATIONS_LETTER.UNREAD}</div>
            <div className="notifications">
              {notifications.map((notification: any, index: any) => {
                if (notification.read === false) {
                  return (
                    <div className="notification" key={index} onClick={() => { handleClick(notification.dareme, notification.type, notification._id, false) }}>
                      <div className="content">
                        {notification.sender?.avatar && notification.sender.role === "USER" ?
                          <Avatar
                            size="small"
                            style="horizontal"
                            username=""
                            avatar={notification.sender ? notification.sender.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${notification.sender.avatar}` : notification.sender.avatar : ""}
                          /> : <CreatoColorIcon />}
                        <div className="message" dangerouslySetInnerHTML={{ __html: notification.message }}></div>
                      </div>
                      <div><ForwardIcon color="black" /></div>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        }
        <div className="part">
          <div className="title">{contexts.NOTIFICATIONS_LETTER.READ}</div>
          <div className="notifications">
            {notifications.map((notification: any, index: any) => {
              if (notification.read === true) {
                return (
                  <div className="notification" key={index} onClick={() => { handleClick(notification.dareme, notification.type, notification._id, true) }}>
                    <div className="content">
                      {notification.sender.avatar && notification.sender.role === "USER" ?
                        <Avatar
                          size="small"
                          style="horizontal"
                          username=""
                          avatar={notification.sender ? notification.sender.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${notification.sender.avatar}` : notification.sender.avatar : ""}
                        /> : <CreatoColorIcon />}
                      <div className="message" dangerouslySetInnerHTML={{ __html: notification.message }}></div>
                    </div>
                    <div><ForwardIcon color="black" /></div>
                  </div>
                )
              }
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileNotifications
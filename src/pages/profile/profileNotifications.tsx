import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { daremeAction } from "../../redux/actions/daremeActions";
import Title from "../../components/general/title";
import { ClockIcon, CreatoColorIcon, ForwardIcon } from "../../assets/svg";
import { notificationAction } from "../../redux/actions/notificationAction";
import Avatar from "../../components/general/avatar";
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

  const handleClick = (itemId: any, notificationId: any, sectionInfo: any, read: any, readCount: any, index: any, donuts: any) => {
    const section = sectionInfo.section
    if (!read) dispatch(notificationAction.readNotification(notificationId, readCount - 1));
    if (section === "Create DareMe" || section === 'Ongoing DareMe') navigate(`/dareme/details/${itemId}`);
    else if (section === 'Create FundMe' || section === 'Ongoing FundMe') navigate(`/fundme/details/${itemId}`);
    else if (section === 'Finished DareMe') {
      if(sectionInfo.info[index].recipient === 'Voter of Non Winning Dares') {
        dispatch(daremeAction.refundOrNot(donuts,itemId))
      }
      navigate(`/dareme/result/${itemId}`)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(notificationAction.getNotifications());
  }, [location]);

  return (
    <>
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.NOTIFICATIONS} back={() => { navigate(`/${user.personalisedUrl}`) }} />
      </div>
      <div className="profile-notifications">
        {notifications.filter((notification: any) => notification.read === false).length !== 0 &&
          <div className="part">
            <div className="title">{contexts.NOTIFICATIONS_LETTER.UNREAD}</div>
            <div className="notifications">
              {notifications.filter((notification: any) => notification.read === false).map((notification: any, index: any) => {
                return (
                  <div className="notification" key={index} onClick={() => {
                    handleClick(
                      notification.dareme ? notification.dareme._id : notification.fundme ? notification.fundme._id : '',
                      notification.id, notification.section, notification.read,
                      notifications.filter((notification: any) => notification.read === false).length, notification.index, notification.donuts)
                  }}>
                    <div className="content">
                      {notification.sender?.avatar && notification.sender.role === "USER" ?
                        <Avatar
                          size="small"
                          style="horizontal"
                          username=""
                          avatar={notification.sender ? notification.sender.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${notification.sender.avatar}` : notification.sender.avatar : ""}
                        /> :
                        notification.section.info[notification.index].recipient === 'Voter of Non Winning Dares' ? <div style={{ width: '36px' }}><ClockIcon color="#DE5A67" width={35} height={35} /></div> : <CreatoColorIcon />}
                      <div className={notification.section.info[notification.index].recipient === 'Voter of Non Winning Dares' ? 'color-message' : "message"} dangerouslySetInnerHTML={{ __html: notification.msg }}></div>
                    </div>
                    <div><ForwardIcon color="black" /></div>
                  </div>
                )
              })}
            </div>
          </div>
        }
        <div className="part">
          <div className="title">{contexts.NOTIFICATIONS_LETTER.READ}</div>
          <div className="notifications">
            <div className="part">
              <div className="notifications">
                {notifications.filter((notification: any) => notification.read === true).map((notification: any, index: any) => {
                  return (
                    <div className="notification" key={index} onClick={() => {
                      handleClick(
                        notification.dareme ? notification.dareme._id : notification.fundme ? notification.fundme._id : '',
                        notification.id, notification.section, notification.read,
                        notifications.filter((notification: any) => notification.read === false).length, notification.index, notification.donuts)
                    }}>
                      <div className="content">
                        {notification.sender?.avatar && notification.sender.role === "USER" ?
                          <Avatar
                            size="small"
                            style="horizontal"
                            username=""
                            avatar={notification.sender ? notification.sender.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${notification.sender.avatar}` : notification.sender.avatar : ""}
                          /> : notification.section.info[notification.index].recipient === 'Voter of Non Winning Dares' ? <div style={{ width: '36px' }}><ClockIcon color="#DE5A67" width={35} height={35} /></div> : <CreatoColorIcon />}
                        <div className={notification.section.info[notification.index].recipient === 'Voter of Non Winning Dares' ? 'color-message' : "message"} dangerouslySetInnerHTML={{ __html: notification.msg }}></div>
                      </div>
                      <div><ForwardIcon color="black" /></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileNotifications
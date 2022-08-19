import axios from "axios";
import CONSTANT from "../constants/constant";

const API = axios.create({ baseURL: CONSTANT.SERVER_URL });

API.interceptors.request.use((req: any) => {
    const token = JSON.parse(localStorage.getItem('dareme_token') || '{}');
    if (localStorage.getItem('dareme_token')) {
        req.headers.Authorization = `Bearer ${token}`;
        req.headers.Range = 'bytes=0~';
    }
    return req;
});

export const googleSignin = (data: any) => API.post('/api/auth/googleSignin', data);
export const googleSignup = (data: any) => API.post('/api/auth/googleSignup', data);
export const facebookSignin = (data: any) => API.post('/api/auth/facebookSignin', data);
export const facebookSignup = (data: any) => API.post('/api/auth/facebookSignup', data);
export const appleSignin = (data: any) => API.post('/api/auth/appleSignin', data);
export const appleSignup = (data: any) => API.post('/api/auth/appleSignup', data);
export const getAuthData = () => API.get('/api/auth/get');
export const editAvatar = (data: any, config: any) => API.post('/api/auth/avatar/upload', data, config);
export const saveProfileInfo = (data: any) => API.post('/api/auth/profile/save', data);
export const getExistName = (data: any) => API.post('/api/auth/exist_name', data);
export const getExistURL = (data: any) => API.post('/api/auth/exist_url', data);
export const getUserFromUrl = (data: any) => API.post('/api/auth/userFromUrl', data)
export const getTipState = () => API.get('/api/auth/tip_state')
export const setLanguage = (data: any) => API.post('/api/auth/setting/lang', data);
//Dareme API
export const publishDareme = () => API.post('/api/dareme/publish');
export const getDraftDareme = () => API.post('/api/dareme/draft');
export const saveDareme = (data: any) => API.post('/api/dareme/save', data);
export const uploadFile = (data: any, config: any) => API.post('/api/dareme/save/upload', data, config);
export const deleteDraft = (daremeId: any) => API.get(`/api/dareme/delete/${daremeId}`);
export const selectCover = (data: any, config: any) => API.post('/api/dareme/save/cover', data, config);

export const getDaremesOngoing = () => API.get(`/api/dareme/ongoingDaremes`);
export const getDaremesByPersonalisedUrl = (data: any) => API.post('/api/dareme/personalUrl', data);
export const checkDareMeFinished = (daremeId: any) => API.get(`/api/dareme/check/finished/${daremeId}`);
export const getDareMeDetails = (daremeId: any) => API.get(`/api/dareme/details/${daremeId}`);
export const getDaremeResult = (daremeId: any) => API.get(`/api/dareme/result/${daremeId}`);
export const getOptionDetails = (optionId: any, daremeId: any) => API.get(`/api/dareme/${daremeId}/details/${optionId}`);
export const supportCreator = (data: any) => API.post("/api/dareme/support", data);
export const getDareCreatorDetails = (daremeId: any) => API.get(`/api/dareme/dare/${daremeId}`);
export const dareCreator = (data: any) => API.post('/api/dareme/dare/creator', data);
export const checkDareMeRequests = (daremeId: any) => API.get(`/api/dareme/check/requests/${daremeId}`);
export const getDaremeRequests = (daremeId: any) => API.get(`/api/dareme/requests/${daremeId}`);
export const acceptDareOption = (data: any) => API.post('/api/dareme/accept', data);
export const declineDareOption = (data: any) => API.post('/api/dareme/decline', data);
export const winDareOption = (data: any) => API.post('/api/dareme/win/option', data);
export const getDaremeOptions = (daremeId: any) => API.get(`/api/dareme/${daremeId}/options`);
export const checkRefundPossible = (daremeId: any) => API.get(`/api/dareme/${daremeId}/refund_possible`)
export const refundDonuts = (data: any, daremeId: any) => API.post(`/api/dareme/${daremeId}/refund_donuts`, data)
export const supportRefund = (daremeId: any) => API.get(`/api/dareme/${daremeId}/support_refund`)

export const getPostDetail = (data: any) => API.get(`/api/fanwall/getById/${data}`);
export const getFanwallsByPersonalisedUrl = (data: any) => API.post('/api/fanwall/personalUrl', data);
export const likeFanwall = (data: any) => API.post('/api/fanwall/like', data);
export const unlockFanwall = (data: any) => API.post('/api/fanwall/unlock', data);
export const deleteFanwall = (fanwallId: any) => API.delete(`/api/fanwall/${fanwallId}`);
export const getFanwallByDareMeId = (daremeId: any) => API.get(`/api/fanwall/dareme/${daremeId}`);
export const uploadFanwall = (data: any, config: any) => API.post('/api/fanwall/upload', data, config);
export const saveFanwall = (data: any) => API.post('/api/fanwall/save', data);

export const buyDonuts = (data: any) => API.post('/api/payment/buy', data);
export const getStripeID = () => API.get('/api/payment/stripeId');
export const connectStripe = (data: any) => API.post('/api/payment/connect_stripe', data)
export const disconnectStripe = (data: any) => API.post('/api/payment/disconnect_stripe', data)
export const getPaymentInfo = () => API.get('/api/payment/payment_info')
export const stripePayout = (data: any) => API.post('/api/payment/payout/stripe', data)

//ADMIN API
export const getUsersList = (data: any) => API.post('/api/auth/users', data);
export const getDareMeList = (data: any) => API.post('/api/dareme/daremes', data);
export const setDareMeShow = (data: any, daremeId: any) => API.post(`/api/dareme/daremes/${daremeId}`, data)
export const deleteDareMe = (daremeId: any) => API.delete(`/api/dareme/daremes/${daremeId}`);
export const updateDareMe = (daremeId: any, daremeData: any) => API.put(`/api/dareme/daremes/${daremeId}`, daremeData);
export const deleteOption = (daremeId: any, optionId: any) => API.delete(`/api/dareme/daremes/${daremeId}/options/${optionId}`);
export const getTransactions = (type: any) => API.get(`/api/transactions/${type}`);
export const addAdminDonuts = (data: any) => API.post('/api/transactions/add/adminDonuts', data);
export const transferDonuts = (data: any) => API.post('/api/transactions/transfer/donuts', data);
export const getUserLatest5Transactions = () => API.get('/api/transactions/user/latest');
export const getUserTransactionsByDays = (data: any) => API.post('/api/transactions/user/days', data);
export const getTips = () => API.get('/api/tip/list');
export const getTipProfile = (url: any) => API.get(`/api/tip/profile/${url}`);
export const setTipFunction = (data: any) => API.post('/api/tip/profile/tipsetting', data);
export const setTipFunctionByUser = (data: any) => API.post('/api/tip/profile_edit/tipsetting', data)
export const changeVisible = (data: any) => API.post('/api/tip/profile/changevisible', data);
export const getTipData = (tipId: any) => API.get(`/api/tip/${tipId}`);
export const updateTip = (tipId: any, data: any) => API.post(`/api/tip/${tipId}/update`, data);
export const deleteTip = (tipId: any) => API.delete(`/api/tip/${tipId}`);
export const getActiveTipUsers = () => API.get('/api/tip/users/tipactive')
export const getFanwallList = () => API.get('/api/fanwall/fanwalls') 

///Notification API////
export const getNotificationSetting = () => API.get('/api/notification/setting');
export const addNotificationSetting = (data: any) => API.post('/api/notification/setting', data);
export const getNotificationType = () => API.get('/api/notification/type');
export const addNotificationType = (data: any) => API.post('/api/notification/type', data);
export const setNotificationAuto = (data: any) => API.put('/api/notification/type', data);
export const subscribeUser = (id: any) => API.post(`/api/notification/subscribe_user/${id}`);
export const setNotification = () => API.get('/api/notification/set');
export const getNotifications = () => API.get('/api/notification');
export const readNotification = (data: any) => API.post('/api/notification/read', data);
export const getNotificationHistory = () => API.get('/api/notification/history');

export const getFundMeList = (data: any) => API.post('/api/fundme/fundmes', data);
export const setFundMeShow = (data: any, fundmeId: any) => API.post(`/api/fundme/fundmes/${fundmeId}`, data);
export const deleteFundMe = (fundmeId: any) => API.delete(`/api/fundme/fundmes/${fundmeId}`);
export const updateFundMe = (fundmeId: any, fundmeData: any) => API.put(`/api/fundme/fundmes/${fundmeId}`, fundmeData);
// export const deleteOption = (daremeId: any, optionId: any) => API.delete(`/api/dareme/daremes/${daremeId}/options/${optionId}`);

//Fundme API
export const publishFundme = () => API.post('/api/fundme/publish');
export const getDraftFundme = () => API.post('/api/fundme/draft');
export const saveFundme = (data: any) => API.post('/api/fundme/save', data);
export const fundmeuploadFile = (data: any, config: any) => API.post('/api/fundme/save/upload', data, config);
export const fundmedeleteDraft = (daremeId: any) => API.get(`/api/fundme/delete/${daremeId}`);
export const fundmeselectCover = (data: any, config: any) => API.post('/api/fundme/save/cover', data, config);

export const getFundmesOngoing = () => API.get(`/api/fundme/ongoingFundmes`);
export const getFundmesByPersonalisedUrl = (data: any) => API.post('/api/fundme/personalUrl', data);
export const checkFundMeFinished = (fundmeId: any) => API.get(`/api/fundme/check/finished/${fundmeId}`);
export const getFundMeDetails = (fundmeId: any) => API.get(`/api/fundme/details/${fundmeId}`);
export const fundCreator = (data: any) => API.post('/api/fundme/fund/creator', data);
export const getFundmeResult = (fundmeId: any) => API.get(`/api/fundme/result/${fundmeId}`);
export const getFundmeVoters = (fundmeId: any) => API.get(`/api/fundme/voters/${fundmeId}`);
export const getFanwallByFundMeId = (fundmeId: any) => API.get(`/api/fanwall/fundme/${fundmeId}`);

export const tipUser = (data: any) => API.post('/api/tip', data);
export const buyDonutForTip = (data: any) => API.post('/api/tip/buy', data);
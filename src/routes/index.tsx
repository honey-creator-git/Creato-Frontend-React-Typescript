import { Routes, Route, Navigate } from 'react-router-dom';

import AuthRoute from './authRoute';
import Auth from "../pages/auth";
import Home from "../pages/home";

import Create from '../pages/create';

import CreateDareme from "../pages/dareme/create/createDareme";
import UploadVideo from "../pages/dareme/create/uploadVideo";
import DaremeTitile from "../pages/dareme/create/daremeTitle";
import DareOptions from "../pages/dareme/create/dareOptions";
import Preview from '../pages/dareme/create/preview';
import CoverImage from '../pages/dareme/create/coverImage';
import DaremeRewards from '../pages/dareme/create/rewards';

import CreateFundme from '../pages/fundme/create/createFundme';
import FundUploadVideo from "../pages/fundme/create/uploadVideo";
import FundmeTitle from "../pages/fundme/create/fundmeTitle";
import FundmePreview from '../pages/fundme/create/preview';
import FundCoverImage from '../pages/fundme/create/coverImage';
import FundmeDetails from '../pages/fundme/fund/fundmeDetails';
import FundmeRewards from '../pages/fundme/create/rewards';
import FundmeVoters from '../pages/fundme/fund/fundmeVoters';
import FundmeResult from '../pages/fundme/fund/fundmeResult';
import FundmeDonutWish from '../pages/fundme/fund/donutWish';

import Profile from '../pages/profile/profile';
import ProfileFanwall from '../pages/profile/profileFanwall';
import ProfileEdit from '../pages/profile/edit/profileEdit';

import ProfileWallet from '../pages/profile/wallet/profileWallet';
import GeneralSetting from '../pages/profile/setting/generalSetting';
import ProfileNotifications from '../pages/profile/profileNotifications';
import Earning from '../pages/profile/wallet/earning';
import Balance from '../pages/profile/wallet/balance';
import Invitefriends from '../pages/profile/setting/inviteFriends';
import Payment from '../pages/profile/setting/payment';
import Language from '../pages/profile/setting/language';
import ShopDonuts from '../pages/profile/shopDonuts';
import Socialaccount from '../pages/profile/edit/socialAccount';
import Categories from '../pages/profile/edit/categories';
import Creators from '../pages/profile/creators';

import DaremeDetails from '../pages/dareme/dare/daremeDetails';
import DaremeVoters from '../pages/dareme/dare/daremeVoters';
import SupportCreator from '../pages/dareme/dare/supportCreator';
import DareCreator from '../pages/dareme/dare/dareCreator';
import GameOn from '../pages/dareme/dare/gameOn';
import DareRequests from '../pages/dareme/dare/dareRequests';
import DaremeResult from '../pages/dareme/dare/daremeResult';
import DaremeDonutWish from '../pages/dareme/dare/donutWish';

import PostFanwall from '../pages/fanwall/postFanwall';
import UploadFanWallVideo from '../pages/fanwall/uploadVideo';
import FanwallDetails from "../pages/fanwall/fanwallDetail";
import WatchContent from '../pages/fanwall/watchContent';

import AdminHome from '../pages/admin/home';
import UserList from '../pages/admin/userList';
import DareMeList from '../pages/admin/dareme/dareMeList';
import AdminDaremeDetail from '../pages/admin/dareme/AdminDaremeDetail';
import DareMeTitile from '../pages/admin/dareme/dareMeTitle';
import DareMeOptions from '../pages/admin/dareme/dareMeOptions';
import FundMeList from '../pages/admin/fundme/fundMeList';
import AdminFundmeDetail from '../pages/admin/fundme/AdminFundmeDetail';
import FundMeTitle from '../pages/admin/fundme/fundMeTitle';
import Tipping from '../pages/admin/tip/tipping';
import TipProfile from '../pages/admin/tip/tipProfile';
import FanwallList from '../pages/admin/fanwall/fanwallList';
import FanwallDetail from '../pages/admin/fanwall/fanwallDetail';
import PostAdminFanwall from '../pages/admin/fanwall/postFanwall';
import UploadAdminVideo from '../pages/admin/fanwall/uploadVideo';

import AdminTransactions from '../pages/admin/transactions/adminTransactions';
import UserTransactions from '../pages/admin/transactions/userTransactions';
import ReferralLinks from '../pages/admin/referral/referralLinks'
import ReferralLinkDetail from '../pages/admin/referral/referralLinkDetail'
import Error404 from '../pages/error/error404';

import TipDonut from '../pages/tip/tipDonut';
import TipMethod from '../pages/tip/tipMethod';
import TipEditor from '../pages/admin/tip/tipEditor';

////// ADMIN NOTIFICATIONS /////////
import Notifications from '../pages/admin/notification/notifications';
import NotificationSetting from '../pages/admin/notification/notificationSetting';
import NotificationNew from '../pages/admin/notification/notificationNew';
import NotificationHistory from '../pages/admin/notification/notificationHistory';

import CoverImageSelect from '../components/coverImage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute child={<Home />} />} />
      <Route path="auth/signin" element={<AuthRoute child={<Auth isSignin={true} />} />} />
      <Route path="auth/signup" element={<AuthRoute child={<Auth isSignin={false} />} />} />
      <Route path="create" element={<AuthRoute child={<Create />} routeType="private" />} />
      <Route path="dareme/create" element={<AuthRoute child={<CreateDareme />} routeType="private" />} />
      <Route path="/:creatorLink/tip" element={<AuthRoute child={<TipDonut />} />} />
      <Route path="/tipmethod" element={<AuthRoute child={<TipMethod />} />} />

      <Route path="dareme/create/teaser" element={<AuthRoute child={<UploadVideo />} routeType="private" />} />
      <Route path="dareme/create/teaser/cover" element={<AuthRoute child={<CoverImage />} routeType="private" />} />
      <Route path="dareme/create/title" element={<AuthRoute child={<DaremeTitile />} routeType="private" />} />
      <Route path="dareme/create/options" element={<AuthRoute child={<DareOptions />} routeType="private" />} />
      <Route path="dareme/create/rewards" element={<AuthRoute child={<DaremeRewards />} routeType="private" />} />
      <Route path="dareme/preview" element={<AuthRoute child={<Preview />} routeType="private" />} />

      <Route path="fundme/create" element={<AuthRoute child={<CreateFundme />} routeType="private" />} />
      <Route path="fundme/create/title" element={<AuthRoute child={<FundmeTitle />} routeType="private" />} />
      <Route path="fundme/create/teaser/cover" element={<AuthRoute child={<FundCoverImage />} routeType="private" />} />
      <Route path="fundme/create/rewards" element={<AuthRoute child={<FundmeRewards />} routeType="private" />} />
      <Route path="fundme/preview" element={<AuthRoute child={<FundmePreview />} routeType="private" />} />
      <Route path="fundme/create/teaser" element={<AuthRoute child={<FundUploadVideo />} routeType="private" />} />
      <Route path="fundme/details/:fundmeId" element={<AuthRoute child={<FundmeDetails />} />} />
      <Route path="fundme/details/:fundmeId/wish" element={<AuthRoute child={<FundmeDonutWish />} routeType="private" />} />
      <Route path="fundme/:fundmeId/voters" element={<AuthRoute child={<FundmeVoters />} routeType="private" />} />
      <Route path="fundme/:fundmeId/voters" element={<AuthRoute child={<FundmeVoters />} routeType="private" />} />
      <Route path="fundme/result/:fundmeId" element={<AuthRoute child={<FundmeResult />} />} />

      <Route path="/:creatorLink" element={<AuthRoute child={<Profile />} />} />
      <Route path="/:creatorLink/fanwall" element={<AuthRoute child={<ProfileFanwall />} />} />

      <Route path="creators" element={<AuthRoute child={<Creators />} routeType="private" />} />
      <Route path="myaccount/edit" element={<AuthRoute child={<ProfileEdit />} routeType="private" />} />
      <Route path="myaccount/edit/categories" element={<AuthRoute child={<Categories />} routeType="private" />} />
      <Route path="myaccount/edit/connect_social" element={<AuthRoute child={<Socialaccount />} routeType="private" />} />
      <Route path="myaccount/wallet" element={<AuthRoute child={<ProfileWallet />} routeType="private" />} />
      <Route path="myaccount/wallet/donuts-transactions" element={<AuthRoute child={<Balance />} routeType="private" />} />
      <Route path="myaccount/wallet/earning" element={<AuthRoute child={<Earning />} routeType="private" />} />
      <Route path="myaccount/shop" element={<AuthRoute child={<ShopDonuts />} routeType="private" />} />
      <Route path="myaccount/setting" element={<AuthRoute child={<GeneralSetting />} routeType="private" />} />
      <Route path="myaccount/setting/language" element={<AuthRoute child={<Language />} routeType="private" />} />
      <Route path="myaccount/setting/invitefriends" element={<AuthRoute child={<Invitefriends />} routeType="private" />} />
      <Route path="myaccount/setting/payment" element={<AuthRoute child={<Payment />} routeType="private" />} />
      <Route path="notifications" element={<AuthRoute child={<ProfileNotifications />} routeType="private" />} />

      <Route path="dareme/details/:daremeId" element={<AuthRoute child={<DaremeDetails />} />} />
      <Route path="dareme/:daremeId/voters" element={<AuthRoute child={<DaremeVoters />} routeType="private" />} />
      <Route path="dareme/:daremeId/support/:optionId" element={<AuthRoute child={<SupportCreator />} />} />
      <Route path="dareme/:daremeId/support/:optionId/wish" element={<AuthRoute child={<DaremeDonutWish />} routeType="private" />} />
      <Route path="dareme/result/:daremeId" element={<AuthRoute child={<DaremeResult />} />} />
      <Route path="dareme/dare/:daremeId" element={<AuthRoute child={<DareCreator />} routeType="private" />} />
      <Route path="dareme/dare/:daremeId/gameon/:optionId" element={<AuthRoute child={<GameOn />} routeType="private" />} />
      <Route path="dareme/requests/:daremeId" element={<AuthRoute child={<DareRequests />} routeType="private" />} />

      <Route path="admin" element={<AuthRoute child={<AdminHome />} routeType="private" />} />
      <Route path="admin/users" element={<AuthRoute child={<UserList />} routeType="private" />} />
      <Route path="admin/daremes" element={<AuthRoute child={<DareMeList />} routeType="private" />} />
      <Route path="admin/daremes/details/:daremeId" element={<AuthRoute child={<AdminDaremeDetail />} routeType="private" />} />
      <Route path="admin/daremes/details/:daremeId/title" element={<AuthRoute child={<DareMeTitile />} routeType="private" />} />
      <Route path="admin/daremes/details/:daremeId/options" element={<AuthRoute child={<DareMeOptions />} routeType="private" />} />
      <Route path="admin/daremes/details/:daremeId/cover" element={<AuthRoute child={<CoverImageSelect />} routeType="private" />} />
      <Route path="admin/fundmes" element={<AuthRoute child={<FundMeList />} routeType="private" />} />
      <Route path="admin/fundmes/details/:fundmeId" element={<AuthRoute child={<AdminFundmeDetail />} routeType="private" />} />
      <Route path="admin/fundmes/details/:fundmeId/title" element={<AuthRoute child={<FundMeTitle />} routeType="private" />} />
      <Route path="admin/fundmes/details/:fundmeId/options" element={<AuthRoute child={<DareMeOptions />} routeType="private" />} />
      <Route path="admin/fundmes/details/:fundmeId/cover" element={<AuthRoute child={<CoverImageSelect />} routeType="private" />} />
      <Route path="admin/transactions" element={<AuthRoute child={<AdminTransactions />} routeType="private" />} />
      <Route path="admin/transactions/user" element={<AuthRoute child={<UserTransactions />} routeType="private" />} />
      <Route path="admin/tipping" element={<AuthRoute child={<Tipping />} routeType="private" />} />
      <Route path="admin/tipping/profile/:url" element={<AuthRoute child={<TipProfile />} routeType="private" />} />
      <Route path="admin/tipping/profile/:url/:id/edit" element={<AuthRoute child={<TipEditor />} routeType="private" />} />
      <Route path="admin/notifications" element={<AuthRoute child={<Notifications />} routeType="private" />} />
      <Route path="admin/notifications/new" element={<AuthRoute child={<NotificationNew />} routeType="private" />} />
      <Route path="admin/notifications/setting" element={<AuthRoute child={<NotificationSetting />} routeType="private" />} />
      <Route path="admin/notifications/history" element={<AuthRoute child={<NotificationHistory />} routeType="private" />} />
      <Route path="admin/fanwalls" element={<AuthRoute child={<FanwallList />} routeType="private" />} />
      <Route path="admin/fanwalls/details/:fanwallId" element={<AuthRoute child={<FanwallDetail />} routeType="private" />} />
      <Route path="admin/fanwalls/details/post/:itemId" element={<AuthRoute child={<PostAdminFanwall />} routeType="private" />} />
      <Route path="admin/fanwalls/details/upload" element={<AuthRoute child={<UploadAdminVideo />} routeType="private" />} />
      <Route path="admin/referral_links" element={<AuthRoute child={<ReferralLinks />} routeType="private" />} />
      <Route path="admin/referral_links/:userId" element={<AuthRoute child={<ReferralLinkDetail />} routeType="private" />} />

      <Route path="dareme/fanwall/post/:itemId" element={<AuthRoute child={<PostFanwall />} routeType="private" />} />
      <Route path="dareme/fanwall/post/:itemId/upload" element={<AuthRoute child={<UploadFanWallVideo />} routeType="private" />} />
      <Route path="dareme/fanwall/detail/:fanwallId" element={<AuthRoute child={<FanwallDetails />} />} />
      <Route path="dareme/fanwall/detail/:fanwallId/content" element={<AuthRoute child={<WatchContent />} />} />

      <Route path="fundme/fanwall/post/:itemId" element={<AuthRoute child={<PostFanwall />} routeType="private" />} />
      <Route path="fundme/fanwall/post/:itemId/upload" element={<AuthRoute child={<UploadFanWallVideo />} routeType="private" />} />
      <Route path="fundme/fanwall/detail/:fanwallId" element={<AuthRoute child={<FanwallDetails />} />} />
      <Route path="fundme/fanwall/detail/:fanwallId/content" element={<AuthRoute child={<WatchContent />} />} />

      <Route path="/not-founder-cover" element={<Error404 />} />
      <Route path="*" element={<Navigate to="/not-founder-cover" replace />} />
    </Routes>
  );
}

export default AppRoutes;
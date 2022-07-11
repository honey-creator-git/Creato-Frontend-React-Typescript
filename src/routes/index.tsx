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

import CreateFundme from '../pages/fundme/create/createFundme';
import FundUploadVideo from "../pages/fundme/create/uploadVideo";
import FundmeTitle from "../pages/fundme/create/fundmeTitle";
import FundmePreview from '../pages/fundme/create/preview';
import FundCoverImage from '../pages/fundme/create/coverImage';
import FundCreator from '../pages/fundme/fund/fundCreator';
import FundmeDetails from '../pages/fundme/fund/fundmeDetails';
import FundmeRewards from '../pages/fundme/create/rewards';
import FundmeVoters from '../pages/fundme/fund/fundmeVoters';
import FundmeResult from '../pages/fundme/fund/fundmeResult';


import Profile from '../pages/profile/profile';
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

import DaremeDetails from '../pages/dareme/dare/daremeDetails';
import DaremeVoters from '../pages/dareme/dare/daremeVoters';
import SupportCreator from '../pages/dareme/dare/supportCreator';
import DareCreator from '../pages/dareme/dare/dareCreator';
import GameOn from '../pages/dareme/dare/gameOn';
import DareRequests from '../pages/dareme/dare/dareRequests';
import DaremeResult from '../pages/dareme/dare/daremeResult';
import PostFanwall from '../pages/fanwall/postFanwall';
import UploadFanWallVideo from '../pages/fanwall/uploadVideo';
import FanwallDetail from "../pages/fanwall/fanwallDetail";
import WatchContent from '../pages/fanwall/watchContent';

import AdminHome from '../pages/admin/home';
import UserList from '../pages/admin/userList';
import DareMeList from '../pages/admin/dareme/dareMeList';
import DaremeDetail from '../pages/admin/dareme/dareMeDetails';
import DareMeTitile from '../pages/admin/dareme/dareMeTitle';
import DareMeOptions from '../pages/admin/dareme/dareMeOptions';
import FundMeList from '../pages/admin/fundme/fundMeList';
import FundMeDetail from '../pages/admin/fundme/fundMeDetail';
import FundMeTitle from '../pages/admin/fundme/fundMeTitle';

import AdminTransactions from '../pages/admin/transactions/transactions';
import Error404 from '../pages/error/error404';
// import PostFanwallFundme from '../pages/fanwall/postFanwallFundme';
import UploadVideoFundme from '../pages/fanwall/uploadVideoFundme';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AuthRoute child={<Home />} />} />
            <Route path="auth/signin" element={<AuthRoute child={<Auth isSignin={true} />} />} />
            <Route path="auth/signup" element={<AuthRoute child={<Auth isSignin={false} />} />} />
            <Route path="create" element={<AuthRoute child={<Create />} />} />
            <Route path="dareme/create" element={<AuthRoute child={<CreateDareme />} routeType="private" />} />
           
            <Route path="dareme/create/teaser" element={<AuthRoute child={<UploadVideo />} routeType="private" />} />
            <Route path="dareme/create/teaser/cover" element={<AuthRoute child={<CoverImage />} routeType="private" />} />
            <Route path="dareme/create/title" element={<AuthRoute child={<DaremeTitile />} routeType="private" />} />
            <Route path="dareme/create/options" element={<AuthRoute child={<DareOptions />} routeType="private" />} />
            <Route path="dareme/preview" element={<AuthRoute child={<Preview />} routeType="private" />} />

            <Route path="fundme/create" element={<AuthRoute child={<CreateFundme />} routeType="private" />} />
            <Route path="fundme/create/title" element={<AuthRoute child={<FundmeTitle />} routeType="private" />} />
            <Route path="fundme/create/teaser/cover" element={<AuthRoute child={<FundCoverImage />} routeType="private" />} />
            <Route path="fundme/create/rewards" element={<AuthRoute child={<FundmeRewards />} routeType="private" />} />
            <Route path="fundme/preview" element={<AuthRoute child={<FundmePreview />} routeType="private" />} />
            <Route path="fundme/create/teaser" element={<AuthRoute child={<FundUploadVideo />} routeType="private" />} />
            <Route path="fundme/details/:fundmeId" element={<AuthRoute child={<FundmeDetails />} />} />
            <Route path="fundme/:fundmeId/voters" element={<AuthRoute child={<FundmeVoters />} routeType="private" />} />
            <Route path="fundme/fund/:fundmeId" element={<AuthRoute child={<FundCreator />} routeType="private" />} />
            <Route path="fundme/:fundmeId/voters" element={<AuthRoute child={<FundmeVoters />} routeType="private" />} />
            <Route path="fundme/result/:fundmeId" element={<AuthRoute child={<FundmeResult />} />} />
            

            <Route path="/:creatorLink" element={<AuthRoute child={<Profile />} />} />
            <Route path="users/:userId/edit" element={<AuthRoute child={<ProfileEdit />} routeType="private" />} />
            <Route path="users/:userId/edit/categories" element={<AuthRoute child={<Categories />} routeType="private" />} />

            <Route path="/:creatorLink/edit/socialaccount" element={<AuthRoute child={<Socialaccount />} routeType="private" />} />
            <Route path="/:creatorLink/wallet" element={<AuthRoute child={<ProfileWallet />} routeType="private" />} />
            <Route path="/:creatorLink/wallet/donuts-transactions" element={<AuthRoute child={<Balance />} routeType="private" />} />
            <Route path="/:creatoLink/shop" element={<AuthRoute child={<ShopDonuts />} routeType="private" />} />
            <Route path="/:creatoLink/notifications" element={<AuthRoute child={<ProfileNotifications />} routeType="private" />} />

            <Route path="users/:userId/setting" element={<AuthRoute child={<GeneralSetting />} routeType="private" />} />
            <Route path="users/:userId/setting/language" element={<AuthRoute child={<Language />} routeType="private" />} />

            <Route path="profile/wallet/earning" element={<AuthRoute child={<Earning />} routeType="private" />} />

            <Route path="users/:userId/setting/invitefriends" element={<AuthRoute child={<Invitefriends />} routeType="private" />} />
            <Route path="users/:userId/setting/payment" element={<AuthRoute child={<Payment />} routeType="private" />} />

            <Route path="dareme/details/:daremeId" element={<AuthRoute child={<DaremeDetails />} />} />
            <Route path="dareme/:daremeId/voters" element={<AuthRoute child={<DaremeVoters />} routeType="private" />} />
            <Route path="dareme/:daremeId/support/:optionId" element={<AuthRoute child={<SupportCreator />} />} />
            <Route path="dareme/result/:daremeId" element={<AuthRoute child={<DaremeResult />} />} />
            <Route path="dareme/dare/:daremeId" element={<AuthRoute child={<DareCreator />} routeType="private" />} />
            <Route path="dareme/dare/:daremeId/gameon/:optionId" element={<AuthRoute child={<GameOn />} routeType="private" />} />
            <Route path="dareme/requests/:daremeId" element={<AuthRoute child={<DareRequests />} routeType="private" />} />
            
            <Route path="admin" element={<AuthRoute child={<AdminHome />} routeType="private" />} />
            <Route path="admin/users" element={<AuthRoute child={<UserList />} routeType="private" />} />
            <Route path="admin/daremes" element={<AuthRoute child={<DareMeList />} routeType="private" />} />
            <Route path="admin/daremes/details/:daremeId" element={<AuthRoute child={<DaremeDetail />} routeType="private" />} />
            <Route path="admin/daremes/details/:daremeId/title" element={<AuthRoute child={<DareMeTitile />} routeType="private" />} />
            <Route path="admin/daremes/details/:daremeId/options" element={<AuthRoute child={<DareMeOptions />} routeType="private" />} />
            <Route path="admin/fundmes" element={<AuthRoute child={<FundMeList />} routeType="private" />} />
            <Route path="admin/fundmes/details/:fundmeId" element={<AuthRoute child={<FundMeDetail />} routeType="private" />} />
            <Route path="admin/fundmes/details/:fundmeId/title" element={<AuthRoute child={<FundMeTitle />} routeType="private" />} />
            <Route path="admin/fundmes/details/:fundmeId/options" element={<AuthRoute child={<DareMeOptions />} routeType="private" />} />
            <Route path="admin/transactions" element={<AuthRoute child={<AdminTransactions />} routeType="private" />} />
            <Route path="/not-founder-cover" element={<Error404 />} />
            <Route path="*" element={<Navigate to="/not-founder-cover" replace />} />

            <Route path="dareme/fanwall/post/:itemId" element={<AuthRoute child={<PostFanwall />} routeType="private" />} />
            <Route path="dareme/fanwall/post/:daremeId/upload" element={<AuthRoute child={<UploadFanWallVideo />} routeType="private" />} />
            <Route path="dareme/fanwall/detail/:fanwallId" element={<AuthRoute child={<FanwallDetail />} />} />
            <Route path="dareme/fanwall/detail/:fanwallId/content" element={<AuthRoute child={<WatchContent />} />} />

            {/* <Route path="fanwall/post/:fundmeId" element={<AuthRoute child={<PostFanwallFundme />} routeType="private" />} /> */}
            <Route path="fundme/fanwall/post/:fundmeId/upload" element={<AuthRoute child={<UploadVideoFundme/>} routeType="private" />} />
            {/* <Route path="dareme/fanwall/detail/:fanwallId" element={<AuthRoute child={<FanwallDetail />} />} /> */}
            {/* <Route path="dareme/fanwall/detail/:fanwallId/content" element={<AuthRoute child={<WatchContent />} />} /> */}

        </Routes>
    );
}

export default AppRoutes;
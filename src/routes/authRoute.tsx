import { useEffect, useState, createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import decode from "jwt-decode"
import { authAction } from "../redux/actions/authActions";
import { notificationAction } from '../redux/actions/notificationAction';
import { EN, CH } from "../constants/language";
import { SET_LANGUAGE, SET_USER } from '../redux/types';
import Layout from '../layout/layout';
import Layout1 from "../layout/layout1";
import socketIOClient from "socket.io-client";
import CONSTANT from '../constants/constant';
import { setLanguage } from '../api';

interface routeProps {
    child: any;
    routeType?: string;
}

var socket = socketIOClient(CONSTANT.SERVER_URL);
export const LanguageContext = createContext<any>(null);

const AuthRoute = (props: routeProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [contexts, setContexts] = useState(CH);
    const authState = useSelector((state: any) => state.auth);
    const user = authState.user;
    const language = authState.lang;
    const location = useLocation();
    const token: any = JSON.parse(localStorage.getItem('dareme_token') || '{}');

    const walletChange = (wallet: any) => {
        const state = { ...user, wallet: wallet };
        dispatch({ type: SET_USER, payload: state });
    }

    useEffect(() => {
        if (user) {
            const lang: any = user.language === 'EN' ? EN : CH;
            setContexts(lang);
            socket.emit('connected', user.email, user.role);
            socket.on("wallet_change", (donuts: any) => walletChange(donuts));
            socket.on("create_notification", () => dispatch(notificationAction.setNotification()));
        }
    }, [user]);

    useEffect(() => {
        if (user === null) {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            let lang: any = EN
            let langLetter: any = 'EN'
            if (timezone === 'Asia/Shanghai' || timezone === 'Asia/Urumqi' || timezone === 'Asia/Hong_Kong' || timezone === 'Asia/Chongqing') {
                lang = CH
                langLetter = 'CH'
            }
            dispatch({ type: SET_LANGUAGE, payload: langLetter })
            setContexts(lang)
        }
    }, []);

    useEffect(() => {
        if (user === null) {
            const lang: any = language === 'EN' ? EN : CH;
            setContexts(lang)
        }
    }, [language])

    useEffect(() => {
        if (props.routeType === 'private') {
            if (localStorage.getItem('dareme_token')) {
                const decoded: any = decode(token);
                if (decoded.exp * 1000 < new Date().getTime()) dispatch(authAction.logout(navigate));
            } else navigate("/");
        }
    }, [navigate, props.routeType]);

    return (
        <LanguageContext.Provider value={contexts}>
            {location.pathname.indexOf('admin') !== -1 ? <Layout1 child={props.child} /> : <Layout child={props.child} />}
        </LanguageContext.Provider>
    );
}

export default AuthRoute;
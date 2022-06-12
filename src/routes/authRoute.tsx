import { useEffect, useState, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import decode from "jwt-decode";
import { authAction } from "../redux/actions/authActions";
import { EN, CH } from "../constants/language";
import { SET_USER } from '../redux/types';
import Layout from '../layout/layout';
import Layout1 from "../layout/layout1";
import socketIOClient from "socket.io-client";
import CONSTANT from '../constants/constant'
import { notificationAction } from '../redux/actions/notificationAction';

interface routeProps {
    child: any;
    routeType?: string;
}

var socket = socketIOClient(CONSTANT.SERVER_URL);
export const LanguageContext = createContext<any>(null);

const AuthRoute = (props: routeProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [contexts, setContexts] = useState(EN);
    const authState = useSelector((state: any) => state.auth);
    const user = authState.user;
    const location = useLocation();
    const token: any = JSON.parse(localStorage.getItem('dareme_token') || '{}');

    const walletChange = (wallet: any) => {
        const state = { ...user, wallet: wallet };
        dispatch({ type: SET_USER, payload: state });
    }

    useEffect(() => {
        if (user) {
            // setContexts(user.language === 'EN' ? EN : CH);
            socket.emit('connected', user.email, user.role);
            socket.on("wallet_change", (donuts: any) => walletChange(donuts));
            socket.on("create_notification", () => {
                dispatch(notificationAction.getNotification())
            });
            dispatch(notificationAction.getNotification());
        }
    }, [user]);

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
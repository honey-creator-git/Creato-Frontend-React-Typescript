import { Dispatch } from "redux";
import * as api from "../../api";
import { SET_DIALOG_STATE, SET_LOADING_FALSE, SET_LOADING_TRUE, SET_TIP, SET_TIPS, SET_USER, SET_USERS } from "../types";

export const tipAction = {
    tipUser: (type: any, tipper: any, user: any, tip: any, message: any) => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.tipUser({ type: type, tipper: tipper, user: user, tip: tip, message: message })
            .then((result: any) => {
                const { data } = result;
                dispatch({ type: SET_LOADING_FALSE });
                if (data.success) {
                    dispatch({ type: SET_USER, payload: data.user });
                    dispatch({ type: SET_DIALOG_STATE, payload: { type: "tipSuccess", state: true } });
                }
            }).catch((err: any) => console.log(err));
    },

    tipDonutAsVistor: (token: any, donutPlan: any, tipData: any) => async (dispatch: Dispatch<any>) => {
        api.buyDonutForTip({ token: token, item: donutPlan, nickname: tipData.nickname })
            .then((result: any) => {
                const { data } = result;
                if (data.success) {
                    api.tipUser({ type: 0, tipper: tipData.nickname, user: tipData.user, tip: donutPlan.donutCount, message: tipData.message })
                        .then((result: any) => {
                            const { data } = result;
                            dispatch({ type: SET_LOADING_FALSE });
                            if (data.success) dispatch({ type: SET_DIALOG_STATE, payload: { type: "tipSuccess", state: true } });
                        }).catch((err: any) => console.log(err));
                } else dispatch({ type: SET_DIALOG_STATE, payload: { type: "error", state: true, msg: data.msg } });
            }).catch((err: any) => {
                dispatch({ type: SET_LOADING_FALSE });
                dispatch({ type: SET_DIALOG_STATE, payload: { type: "error", state: true, msg: 'Pay processing failed!' } });
            });
    },

    getTips: () => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.getTips()
            .then((result: any) => {
                const { data } = result;
                if (data.success) {
                    dispatch({ type: SET_LOADING_FALSE });
                    dispatch({ type: SET_TIPS, payload: data.tips });
                }
            }).catch((err: any) => {
                console.log(err);
            });
    },

    getTipProfile: (url: any) => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.getTipProfile(url)
            .then((result) => {
                const { data } = result;
                dispatch({ type: SET_LOADING_FALSE });
                if (data.success) {
                    dispatch({ type: SET_TIPS, payload: data.tips });
                    dispatch({ type: SET_USERS, payload: [data.user] });
                }
            }).catch(err => console.log(err));
    },

    setTipFunction: (tipValue: any, id: any) => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.setTipFunction({ tipValue: tipValue, id: id })
            .then((result) => {
                const { data } = result;
                dispatch({ type: SET_LOADING_FALSE });
                if (data.success) {
                    dispatch({ type: SET_USERS, payload: [data.user] });
                }
            }).catch(err => console.log(err));
    },

    changeVisible: (show: any, tipId: any) => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.changeVisible({ show: show, tipId: tipId })
            .then((result) => {
                const { data } = result;
                dispatch({ type: SET_LOADING_FALSE });
                if (data.success) {
                    dispatch({ type: SET_TIPS, payload: data.tips });
                }
            }).catch(err => console.log(err));
    },

    getTipData: (tipId: any) => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        dispatch({ type: SET_TIP, payload: null });
        api.getTipData(tipId)
            .then((result) => {
                const { data } = result;
                dispatch({ type: SET_LOADING_FALSE });
                if (data.success) {
                    dispatch({ type: SET_TIP, payload: data.tip });
                }
            }).catch(err => console.log(err));
    },

    updateTip: (tipId: any, nickname: any, message: any, donuts: any) => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.updateTip(tipId, { nickname: nickname, message: message, donuts: donuts })
            .then((result) => {
                dispatch({ type: SET_LOADING_FALSE });
                const { data } = result;
                if (data.success) dispatch({ type: SET_TIP, payload: data.tip });
            }).catch(err => console.log(err));
    },

    deleteTip: (tipId: any, url: any, navigate: any) => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.deleteTip(tipId)
            .then((result) => {
                const { data } = result;
                dispatch({ type: SET_LOADING_FALSE });
                if (data.success) navigate(`/admin/tipping/profile/${url}`);
            }).catch(err => console.log(err));
    }
}

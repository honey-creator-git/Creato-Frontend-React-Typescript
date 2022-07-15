import { Dispatch } from "redux";
import * as api from "../../api";
import { SET_DIALOG_STATE, SET_LOADING_FALSE, SET_LOADING_TRUE, SET_USER } from "../types";

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
        dispatch({ type: SET_LOADING_TRUE });
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
                }
            }).catch((err: any) => console.log(err));
    }
}

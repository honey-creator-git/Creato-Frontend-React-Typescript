import { Dispatch } from "redux";
import * as api from "../../api";
import {
  SET_DIALOG_STATE,
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  SET_USER
} from "../types";

export const paymentACtion = {
  buyDonuts: (token: any, donutPlan: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.buyDonuts({ token: token, item: donutPlan })
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_LOADING_FALSE });
        if (data.success) {
          dispatch({ type: SET_USER, payload: data.user });
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "buyDonut", state: true } });
        }
      }).catch((err) => {
        console.log(err);
        dispatch({ type: SET_LOADING_FALSE });
      });
  },
}
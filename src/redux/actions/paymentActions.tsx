// import { dataIndexAttribute } from "react-horizontal-scrolling-menu/dist/types/constants";
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
        } else {
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "error", state: true , msg: data.msg} });
        }        
      }).catch((err) => {        
        dispatch({ type: SET_LOADING_FALSE });        
        dispatch({ type: SET_DIALOG_STATE, payload: { type: "error", state: true ,msg: 'Pay processing failed!'} });
      });
  },
}

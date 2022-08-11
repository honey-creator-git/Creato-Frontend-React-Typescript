import { Dispatch } from "redux";
import * as api from "../../api";
import {
  SET_DIALOG_STATE,
  SET_LOADING_FALSE,
  SET_USER,
  SET_STRIPEID,
  SET_PAYMENT,
  SET_LOADING_TRUE
} from "../types";

export const paymentAction = {
  buyDonuts: (token: any, donutPlan: any, stripeId: any, check: any) => async (dispatch: Dispatch<any>) => {
    api.buyDonuts({ token: token, item: donutPlan, stripeId: stripeId, check: check })
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_LOADING_FALSE });
        if (data.success) {
          dispatch({ type: SET_USER, payload: data.user });
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "buyDonut", state: true } });
        } else dispatch({ type: SET_DIALOG_STATE, payload: { type: "error", state: true, msg: data.msg } });
      }).catch((err) => {
        dispatch({ type: SET_LOADING_FALSE });
        dispatch({ type: SET_DIALOG_STATE, payload: { type: "error", state: true, msg: 'Pay processing failed!' } });
      });
  },

  getStripeID: () => async (dispatch: Dispatch<any>) => {
    api.getStripeID()
      .then((result) => {
        const { data } = result;
        if (data.success) dispatch({ type: SET_STRIPEID, payload: { stripeID: data.stripeID, cardNum: data.cardNum } });
      }).catch((err) => console.log(err));
  },

  connectStripe: (code: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    api.connectStripe({ auth: code })
      .then((result) => {
        const { data } = result
        if (data.success) {
          dispatch({ type: SET_LOADING_FALSE })
          navigate('/myaccount/setting/payment')
        }
      }).catch((err) => console.log(err))
  },

  disconnectStripe: (clientId: any,navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    api.disconnectStripe({ clientId: clientId })
      .then((result) => {
        const { data } = result
        if (data.success) {
          dispatch({ type: SET_LOADING_FALSE })
          navigate('/myaccount/setting/payment')
        }
      }).catch((err) => console.log(err))
  },

  getPaymentInfo: () => async (dispatch: Dispatch<any>) => {
    api.getPaymentInfo()
      .then((result) => {
        const { data } = result
        if (data.success) dispatch({ type: SET_PAYMENT, payload: data.payment })
      }).catch((err) => console.log(err))
  }
}

import { Dispatch } from "redux";
import * as api from "../../api";
import {
  SET_LOADING_FALSE,
  SET_LOADING_TRUE,
  SET_REFERRALLINK,
  SET_REFERRALLINKS,
  SET_REFERRAL_REWARD,
  UPDATE_REFERRAL_LINKS
} from "../types";

export const referralAction = {
  getReferralLinks: () => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.getReferralLinks()
      .then((result: any) => {
        const { data } = result
        dispatch({ type: SET_LOADING_FALSE })
        if (data.success) {
          dispatch({ type: SET_REFERRALLINKS, payload: data.referrals })
          dispatch({ type: SET_REFERRAL_REWARD, payload: data.reward })
        }
      }).catch((err: any) => console.log(err))
  },

  changeRewardDonuts: (donuts: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    api.changeRewardDonuts({ donuts: donuts })
      .then((result: any) => {
        const { data } = result
        dispatch({ type: SET_LOADING_FALSE })
        if (data.success) dispatch({ type: SET_REFERRAL_REWARD, payload: donuts })
      }).catch((err: any) => console.log(err))
  },

  transferDonuts: (donuts: any, userId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    api.transferDonutsForReferral({ donuts: donuts, Id: userId })
      .then((result: any) => {
        const { data } = result
        dispatch({ type: SET_LOADING_FALSE })
        if (data.success) dispatch({ type: UPDATE_REFERRAL_LINKS, payload: data.referral })
      }).catch((err: any) => console.log(err))
  },

  getReferralLinkDetail: (userId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    dispatch({ type: SET_REFERRALLINK, payload: null })
    api.getReferralLinkDetail(userId)
      .then((result: any) => {
        const { data } = result
        dispatch({ type: SET_LOADING_FALSE })
        if (data.success) dispatch({ type: SET_REFERRALLINK, payload: data.referral })
      }).catch((err: any) => console.log(err))
  }
}

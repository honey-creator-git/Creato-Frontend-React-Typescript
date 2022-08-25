import * as actionTypes from '../types';

const INITIAL_STATE: any = {
  referralLinks: [],
  referralLink: null,
  reward: null,
}

const referralReducer = (state: any = INITIAL_STATE, action: any) => {
  const { payload = null } = action;
  switch (action.type) {
    case actionTypes.SET_REFERRALLINKS:
      return {
        ...state,
        referralLinks: payload
      }
    case actionTypes.SET_REFERRALLINK:
      return {
        ...state,
        referralLink: payload
      }
    case actionTypes.SET_REFERRAL_REWARD:
      return {
        ...state,
        reward: payload
      }
    case actionTypes.UPDATE_REFERRAL_LINKS:
      const index = state.referralLinks.findIndex((referral: any) => referral._id === payload._id)
      const newArray = [...state.referralLinks]
      newArray[index] = payload
      return {
        ...state,
        referralLinks: newArray
      }
    default:
      return state
  }
};

export default referralReducer;
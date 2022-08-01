import * as actionTypes from '../types';

const INITIAL_STATE: any = {
  list: [],
  setting: null,
  types: [],
}

const notificationReducer = (state: any = INITIAL_STATE, action: any) => {
  const { payload = null } = action;
  switch (action.type) {
    case actionTypes.SET_NOTIFICATION_LIST:
      return { ...state, list: payload };
    case actionTypes.SET_NOTIFICATION_SETTING:
      return { ...state, setting: payload };
    case actionTypes.SET_NOTIFICATION_TYPES:
      state.types = payload;
      return state;
    default:
      return state;
  }
};

export default notificationReducer;
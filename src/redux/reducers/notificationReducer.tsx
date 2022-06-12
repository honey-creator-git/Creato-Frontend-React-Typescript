import * as actionTypes from '../types';

const INITIAL_STATE: any = {
  new_notification: false,
  list: [
    {
      sender: null,
      read: false,
      created_at: null,
      _id: null,
      message: null
    },
  ],
  notification: {
    sender: null,
    read: false,
    created_at: null,
    _id: null,
    message: null
  }
}

const notificationReducer = (state: any = INITIAL_STATE, action: any) => {
  const { payload = null } = action;
  switch (action.type) {
    case actionTypes.SET_NOTIFICATION_LIST:
      return { ...state, list: payload };
    case actionTypes.SET_NOTIFICATION_LIST:
      return {...state};
    case actionTypes.SET_NEW_NOTIFICATION:
      return {...state, newNotification: payload}
    default: 
      return state;
  }
};

export default notificationReducer;
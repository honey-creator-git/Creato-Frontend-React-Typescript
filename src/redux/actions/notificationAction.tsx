import { Dispatch } from "redux";

import {
  SET_NOTIFICATION_LIST,
  READ_NOTIFICATION,
  SET_LOADING_FALSE,
  SET_LOADING_TRUE,
  SET_NEW_NOTIFICATION
} from '../types'

import * as api from "../../api";

export const notificationAction = {
  getNotification: () => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE });
      const result = await api.getNotifications();
      dispatch({type: SET_NOTIFICATION_LIST, payload: result.data.notifications});
      dispatch({type: SET_NEW_NOTIFICATION, payload: result.data.new_notification});
      dispatch({ type: SET_LOADING_FALSE });
    } catch (err) {
      console.log({ err })
    }
  },

  readNotification: (notificationId: any) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE });
      const result = await api.readNotification({ notificationId: notificationId});
      dispatch({ type: SET_LOADING_FALSE });
    } catch (err) {
      console.log({ err })
    }
  }
}
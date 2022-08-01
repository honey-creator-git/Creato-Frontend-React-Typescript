import { Dispatch } from "redux";
import {
  SET_NOTIFICATION_LIST,
  SET_LOADING_FALSE,
  SET_LOADING_TRUE,
  SET_NOTIFICATION_SETTING,
  SET_NOTIFICATION_TYPES,
  SET_USER
} from '../types'
import * as api from "../../api";
import { authAction } from "./authActions";

export const notificationAction = {
  readNotification: (notificationId: any, readCount: any) => async (dispatch: Dispatch<any>) => {
    try {
      api.readNotification({ notificationId: notificationId, readCount: readCount })
        .then((result: any) => {
          const { data } = result;
          if (data.success) dispatch(authAction.getAuthData())
        }).catch(err => console.log(err));
    } catch (err) {
      console.log({ err })
    }
  },

  getNotificationHistory: () => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE });
      api.getNotificationHistory()
        .then((result) => {
          const { data } = result;
          dispatch({ type: SET_LOADING_FALSE });
          if (data.success) dispatch({ type: SET_NOTIFICATION_LIST, payload: data.list });
        }).catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  },

  getNotifications: () => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE });
      api.getNotifications()
        .then((result) => {
          const { data } = result;
          dispatch({ type: SET_LOADING_FALSE });
          if (data.success) dispatch({ type: SET_NOTIFICATION_LIST, payload: data.list });
        }).catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  },

  setNotification: () => async (dispatch: Dispatch<any>) => {
    try {
      api.setNotification()
        .then((result) => {
          const { data } = result;
          if (data.success) dispatch({ type: SET_USER, payload: data.user });
        }).catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  },

  addNotificationSetting: (newValue: any, type: any) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE });
      api.addNotificationSetting({ value: newValue, type: type })
        .then((result) => {
          const { data } = result;
          dispatch({ type: SET_LOADING_FALSE });
          if (data.success) dispatch(notificationAction.getNotificationSetting());
        }).catch(err => console.log(err));
    } catch (err) {
      console.log(err)
    }
  },

  getNotificationSetting: () => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE });
      api.getNotificationSetting()
        .then((result) => {
          const { data } = result;
          dispatch({ type: SET_LOADING_FALSE });
          if (data.success) dispatch({ type: SET_NOTIFICATION_SETTING, payload: data.setting });
        }).catch(err => console.log(err));
    } catch (err) {
      console.log(err)
    }
  },

  addNotificationType: (section: any, sender: any, receiver: any, trigger: any, mode: any, contentEn: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE });
      api.addNotificationType({ section: section, sender: sender, receiver: receiver, trigger: trigger, mode: mode, contentEn: contentEn })
        .then((result) => {
          const { data } = result;
          dispatch({ type: SET_LOADING_FALSE });
          if (data.success) navigate('/admin/notifications');
        }).catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  },

  getNotificationType: () => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE });
      api.getNotificationType()
        .then((result) => {
          const { data } = result;
          dispatch({ type: SET_LOADING_FALSE });
          if (data.success) dispatch({ type: SET_NOTIFICATION_TYPES, payload: data.types });
        }).catch(err => console.log(err));
    } catch (err) {
      console.log(err)
    }
  },

  setNotificationAuto: (id: any, no: any, auto: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE });
      api.setNotificationAuto({ id: id, no: no, auto: auto })
        .then((result) => {
          const { data } = result;
          dispatch({ type: SET_LOADING_FALSE });
          if (data.success) navigate('/admin/notifications');
        }).catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }
}
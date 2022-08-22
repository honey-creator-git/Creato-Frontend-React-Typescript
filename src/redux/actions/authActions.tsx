import { Dispatch } from "redux"
import { SET_DIALOG_STATE, SET_LOADING_FALSE, SET_LOADING_TRUE, SET_NAME_EXIST, SET_USER, SET_USERS, SET_URL_EXIST, SET_TIPAVAILABLE, SET_TIPFUNCTION } from "../types";
import * as api from '../../api'

export const authAction = {
  logout: (navigate: any) => async (dispatch: Dispatch<any>) => {
    localStorage.clear();
    dispatch({ type: SET_USER, payload: null });
    navigate("/");
  },

  googleSignupUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
    api.googleSignup(userData)
      .then((result) => {
        const { data } = result;
        localStorage.clear();
        localStorage.setItem('dareme_token', JSON.stringify(data.token));
        dispatch({ type: SET_USER, payload: data.user });
        if (data.firstLogin === false) dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome2", state: true } })
        if (data.new) dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome", state: true } })
        navigate(prevRoute === '' ? '/' : prevRoute)
      }).catch(err => console.log(err))
  },

  googleSigninUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
    api.googleSignin(userData)
      .then((result) => {
        const { data } = result;
        localStorage.clear();
        localStorage.setItem('dareme_token', JSON.stringify(data.token));
        dispatch({ type: SET_USER, payload: data.user });
        if (data.firstLogin === false) dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome2", state: true } })
        if (data.new) dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome", state: true } })
        navigate(prevRoute === '' ? '/' : prevRoute)
      }).catch(err => {
        const { data } = err.response
        if (data.error === 'sing-up methods error') dispatch({ type: SET_DIALOG_STATE, payload: { type: 'error_signup_method', state: true } })
      });
  },

  appleSignupUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
    api.appleSignup(userData)
      .then((result) => {
        const { data } = result;
        localStorage.clear();
        localStorage.setItem('dareme_token', JSON.stringify(data.token));
        dispatch({ type: SET_USER, payload: data.user });
        if (data.firstLogin === false) dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome2", state: true } })
        if (data.new) dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome", state: true } })
        navigate(prevRoute === '' ? '/' : prevRoute)
      }).catch(err => console.log(err))
  },

  appleSigninUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
    api.appleSignin(userData)
      .then((result) => {
        const { data } = result;
        localStorage.clear();
        localStorage.setItem('dareme_token', JSON.stringify(data.token));
        dispatch({ type: SET_USER, payload: data.user });
        if (data.firstLogin === false) dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome2", state: true } })
        if (data.new) dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome", state: true } })
        navigate(prevRoute === '' ? '/' : prevRoute)
      }).catch(err => {
        const { data } = err.response
        if (data.error === 'sing-up methods error') dispatch({ type: SET_DIALOG_STATE, payload: { type: 'error_signup_method', state: true } })
      });
  },

  facebookSignupUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
    api.facebookSignup(userData)
      .then((result) => {
        const { data } = result;
        localStorage.clear();
        localStorage.setItem('dareme_token', JSON.stringify(data.token));
        dispatch({ type: SET_USER, payload: data.user });
        if (data.new) {
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome", state: true } });
          navigate("/");
        } else navigate(prevRoute);
      }).catch(err => console.log(err));
  },

  facebookSigninUser: (userData: any, navigate: any, prevRoute: any) => async (dispatch: Dispatch<any>) => {
    api.facebookSignin(userData)
      .then((result) => {
        const { data } = result;
        localStorage.clear();
        localStorage.setItem('dareme_token', JSON.stringify(data.token));
        dispatch({ type: SET_USER, payload: data.user });
        if (data.new) {
          dispatch({ type: SET_DIALOG_STATE, payload: { type: "welcome", state: true } });
          navigate("/");
        } else navigate(prevRoute);
      }).catch(err => console.log(err));
  },

  getAuthData: () => async (dispatch: Dispatch<any>) => {
    api.getAuthData()
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_USER, payload: data.user });
      }).catch(err => console.log(err));
  },

  saveProfileInfo: (name: any, creatoUrl: any, category: any, avatar: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    let resultAvatar = null;
    if (avatar) {
      const formData = new FormData();
      formData.append("file", avatar);
      const config = { headers: { "content-type": "multipart/form-data" } };
      resultAvatar = await api.editAvatar(formData, config);
    }
    let path = null;
    if (resultAvatar?.data) path = resultAvatar.data.path;
    api.saveProfileInfo({ name: name, creatoUrl: creatoUrl, category: category, path: path })
      .then((res) => {
        const { data } = res;
        if (data.success) {
          dispatch({ type: SET_LOADING_FALSE });
          dispatch({ type: SET_USER, payload: data.user });
          navigate(`/${creatoUrl}`);
        }
      }).catch(err => console.log(err));
  },

  setLanguage: (lang: any, userData: any) => async (dispatch: Dispatch<any>) => {
    api.setLanguage({ lang: lang })
      .then((result) => {
        const { data } = result;
        if (data.success) {
          const state = { ...userData, language: lang };
          dispatch({ type: SET_USER, payload: state });
        }
      }).catch(err => console.log(err));
  },

  getUsersList: (search: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_USERS, payload: [] });
    api.getUsersList({ search: search })
      .then((result) => {
        const { data } = result;
        if (data.success) dispatch({ type: SET_USERS, payload: data.users });
        dispatch({ type: SET_LOADING_FALSE });
      }).catch(err => console.log(err));
  },

  getExistName: (name: any) => async (dispatch: Dispatch<any>) => {
    api.getExistName({ name: name })
      .then((result) => {
        const { data } = result;
        if (data.success) dispatch({ type: SET_NAME_EXIST, payload: data.isExist });
      }).catch(err => console.log(err));
  },

  getExistURL: (url: any) => async (dispatch: Dispatch<any>) => {
    api.getExistURL({ url: url })
      .then((result) => {
        const { data } = result;
        if (data.success) dispatch({ type: SET_URL_EXIST, payload: data.isExist });
      }).catch(err => console.log(err));
  },

  setTipFunction: (tipValue: any, userId: any, users: any, index: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.setTipFunction({ tipValue: tipValue, id: userId })
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_LOADING_FALSE });
        if (data.success) {
          users[index].tipFunction = tipValue;
          dispatch({ type: SET_USERS, payload: users });
        }
      }).catch(err => console.log(err));
  },

  getUserFromUrl: (url: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_USERS, payload: [] });
    api.getUserFromUrl({ url: url })
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_LOADING_FALSE });
        if (data.success) dispatch({ type: SET_USERS, payload: data.user });
      }).catch(err => console.log(err));
  },

  getTipState: () => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    api.getTipState()
      .then((result) => {
        const { data } = result
        dispatch({ type: SET_LOADING_FALSE })
        if (data.success) {
          if (data.cnt > 0) {
            dispatch({ type: SET_TIPAVAILABLE, payload: true })
            dispatch({ type: SET_TIPFUNCTION, payload: data.tipFunction })
          }
        }
      }).catch(err => console.log(err))
  },
}
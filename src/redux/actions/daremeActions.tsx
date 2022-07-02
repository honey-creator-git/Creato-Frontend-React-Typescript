import { Dispatch } from "redux";
import {
  SET_DAREME_INITIAL,
  SET_DAREMES,
  SET_DAREME,
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  SET_FANWALL,
  SET_FANWALL_INITIAL,
  SET_OPTION,
  SET_USERS,
  SET_USER,
  SET_FANWALLS,
  SET_DAREME_DETAIL_INITIAL,
  SET_ADMIN_OPTIONS,
  SET_FUNDMES
} from "../types";
import * as api from "../../api";

export const daremeAction = {
  getDraftDareme: (navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.getDraftDareme()
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_DAREME_INITIAL });
        if (data.isDraft) dispatch({ type: SET_DAREME, payload: data.dareme });
        navigate('/dareme/create');
        dispatch({ type: SET_LOADING_FALSE });
      })
      .catch((err) => console.log(err));
  },

  saveDareme: (dareme: any, teaser: any, cover: any, navigate: any, url: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    let resultTeaser = null;
    let resultCover = null;
    if (dareme.title === null && dareme.deadline === null && dareme.category === null && (dareme.teaser === null && teaser === null)
      && (dareme.options.length === 0 || (dareme.options.length !== 0 && dareme.options[0].option.title === "" && dareme.options[1].option.title === ""))) {
      navigate('/');
    } else {
      if (teaser && teaser.preview.indexOf('uploads') === -1) {
        const formData = new FormData();
        formData.append("file", teaser);
        const config = { headers: { "content-type": "multipart/form-data" } };
        resultTeaser = await api.uploadFile(formData, config);
      }
      if (cover) {
        const formData = new FormData();
        formData.append("file", cover);
        const config = { headers: { "content-type": "multipart/form-data" } };
        resultCover = await api.selectCover(formData, config);
      }

      if (resultTeaser?.data.success) dareme.teaser = resultTeaser.data.path;
      if (resultCover?.data.success) dareme.cover = resultCover.data.path;
      api.saveDareme({ dareme: dareme })
        .then((res) => {
          const { data } = res;
          if (data.success) {
            dispatch({ type: SET_DAREME, payload: data.dareme });
            navigate('/');
          }
          dispatch({ type: SET_LOADING_FALSE });
        }).catch((err) => console.log(err));
    }
  },

  publishDareme: () => async (dispatch: Dispatch<any>) => {
    api.publishDareme()
      .then((result) => {
        // const { data } = result;
      }).catch((err) => console.log(err));
  },

  eraseDraft: (daremeId: any) => async (dispatch: Dispatch<any>) => {
    if (daremeId) {
      dispatch({ type: SET_LOADING_TRUE });
      api.deleteDraft(daremeId)
        .then((result: any) => {
          const { data } = result;
          if (data.success) {
            dispatch({ type: SET_DAREME_INITIAL });
            dispatch({ type: SET_LOADING_FALSE })
          }
        }).catch(err => console.log(err));
    }
    else dispatch({ type: SET_DAREME_INITIAL });
  },

  //-------------------------------------
  getDarmesOngoing: () => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_DAREME_INITIAL });
    api.getDaremesOngoing()
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_DAREMES, payload: data.daremes });
        dispatch({ type: SET_FANWALLS, payload: data.fanwalls });
        dispatch({ type: SET_LOADING_FALSE });
      }).catch((err) => console.log(err));
  },

  checkDetailsAndResults: (daremeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.checkDareMeFinished(daremeId)
      .then((result: any) => {
        console.log('check ponst 2')
        const { data } = result;
        dispatch({ type: SET_DAREME_INITIAL });
        if (data.finished) navigate(`/dareme/result/${daremeId}`);
        else navigate(`/dareme/details/${daremeId}`);
      }).catch((err: any) => console.log(err));
  },

  getDaremeDetails: (daremeId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_DAREME_DETAIL_INITIAL });
    api.getDareMeDetails(daremeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_DAREME, payload: data.dareme });
          dispatch({ type: SET_LOADING_FALSE });
        }
      }).catch((err) => console.log(err));
  },

  getDaremeResult: (daremeId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_DAREME_INITIAL });
    api.getDaremeResult(daremeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_FANWALL, payload: { fanwall: data.fanwall, itemType: 'dareme' } });
          dispatch({ type: SET_DAREME, payload: data.dareme });
          dispatch({ type: SET_LOADING_FALSE });
        }
      }).catch((err) => console.log(err));
  },

  checkSupportAndResults: (daremeId: any, optionId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    api.checkDareMeFinished(daremeId)
      .then((result: any) => {
        const { data } = result;
        if (data.finished) navigate(`/dareme/result/${daremeId}`);
        else navigate(`/dareme/${daremeId}/support/${optionId}`);
      }).catch((err: any) => console.log(err));
  },

  getOptionDetails: (optionId: any, daremeId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_DAREME_INITIAL });
    api.getOptionDetails(optionId, daremeId)
      .then((result: any) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_OPTION, payload: data.option });
          dispatch({ type: SET_DAREME, payload: data.dareme });
          dispatch({ type: SET_LOADING_FALSE });
        }
      }).catch((err: any) => console.log(err));
  },

  supportCreator: (daremeId: any, optionId: any, donuts: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    api.checkDareMeFinished(daremeId)
      .then((result: any) => {
        const { data } = result;
        if (data.finished) navigate(`/dareme/result/${daremeId}`);
        else {
          api.supportCreator({ daremeId: daremeId, optionId: optionId, amount: donuts })
            .then((result) => {
              const { data } = result;
              if (data.success) {
                dispatch({ type: SET_DAREME, payload: data.dareme });
                dispatch({ type: SET_OPTION, payload: data.option });
                if (data.user) dispatch({ type: SET_USER, payload: data.user });
              }
            }).catch((err) => console.log(err));
        }
      }).catch((err: any) => console.log(err));
  },

  checkDareCreatorAndResults: (daremeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    api.checkDareMeFinished(daremeId)
      .then((result: any) => {
        const { data } = result;
        if (data.finished) navigate(`/dareme/result/${daremeId}`);
        else navigate(`/dareme/dare/${daremeId}`);
      }).catch((err: any) => console.log(err));
  },

  getDareCreatorDetails: (daremeId: any) => async (dispatch: Dispatch<any>) => {
    api.getDareCreatorDetails(daremeId)
      .then((result: any) => {
        const { data } = result;
        if (data.success) dispatch({ type: SET_DAREME, payload: data.dareme });
      }).catch((err: any) => console.log(err));
  },

  getDaremesByPersonalisedUrl: (url: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.getDaremesByPersonalisedUrl({ url: url })
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_DAREMES, payload: data.daremes });
        dispatch({ type: SET_USERS, payload: [data.user] });
        dispatch({ type: SET_LOADING_FALSE });
        navigate(`/${url}`);
      }).catch((err) => console.log(err));
  },

  dareCreator: (daremeId: any, title: any, amount: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    api.checkDareMeFinished(daremeId)
      .then((result: any) => {
        const { data } = result;
        if (data.finished) navigate(`/dareme/result/${daremeId}`);
        else {
          api.dareCreator({ daremeId: daremeId, title: title, amount: amount })
            .then((result) => {
              const { data } = result;
              if (data.success) {
                const optionId = data.option._id;
                dispatch({ type: SET_USER, payload: data.user });
                dispatch({ type: SET_OPTION, payload: data.option });
                navigate(`/dareme/dare/${daremeId}/gameon/${optionId}`);
              }
            }).catch((err) => console.log(err));
        }
      }).catch((err: any) => console.log(err));
  },

  checkDareMeRequests: (daremeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    api.checkDareMeRequests(daremeId)
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_DAREME_INITIAL });
        if (data.request) navigate(`/dareme/requests/${daremeId}`);
        else navigate(`/dareme/details/${daremeId}`);
      }).catch(err => console.log(err));
  },

  getDaremeRequests: (daremeId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_DAREME_INITIAL });
    api.getDaremeRequests(daremeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_DAREME, payload: data.dareme });
          dispatch({ type: SET_LOADING_FALSE });
        }
      }).catch(err => console.log(err));
  },

  acceptDareOption: (daremeId: any, optionId: any) => async (dispatch: Dispatch<any>) => {
    api.acceptDareOption({ optionId: optionId })
      .then((result: any) => {
        const { data } = result;
        if (data.success) {
          api.getDaremeRequests(daremeId)
            .then((result) => {
              const { data } = result;
              if (data.success) {
                dispatch({ type: SET_DAREME, payload: data.dareme });
                dispatch({ type: SET_LOADING_FALSE });
              }
            }).catch(err => console.log(err));
        }
      }).catch((err: any) => console.log(err));
  },

  declineDareOption: (daremeId: any, optionId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.declineDareOption({ optionId: optionId, daremeId: daremeId })
      .then((result: any) => {
        const { data } = result;
        if (data.success) {
          api.getDaremeRequests(daremeId)
            .then((result) => {
              const { data } = result;
              if (data.success) {
                dispatch({ type: SET_DAREME, payload: data.dareme });
                dispatch({ type: SET_LOADING_FALSE });
              }
            }).catch(err => console.log(err));
        }
      }).catch((err: any) => console.log(err));
  },

  postFanwall: (daremeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.getFanwallByDareMeId(daremeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_DAREME, payload: data.dareme });
          dispatch({ type: SET_FANWALL_INITIAL, payload: 'dareme' });
          if (data.fanwall) dispatch({ type: SET_FANWALL, payload: data.fanwall });
          dispatch({ type: SET_LOADING_FALSE });
          navigate(`/dareme/fanwall/post/${daremeId}`);
        }
      }).catch(err => console.log(err));
  },

  winDareOption: (optionId: any, daremeId: any) => async (dispatch: Dispatch<any>) => {
    api.winDareOption({ optionId: optionId, daremeId: daremeId })
      .then((result: any) => {
        const { data } = result;
        if (data.success) {
          api.getDaremeResult(daremeId)
            .then((result) => {
              const { data } = result;
              if (data.success) {
                dispatch({ type: SET_FANWALL, payload: data.fanwall });
                dispatch({ type: SET_DAREME, payload: data.dareme });
              }
            }).catch((err) => console.log(err));
        }
      }).catch((err: any) => console.log(err));
  },

  //ADMIN
  getDareMeList: (search: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_DAREME_INITIAL });
    api.getDareMeList({ search: search })
      .then((result) => {
        const { data } = result;
        if (data.success) dispatch({ type: SET_DAREMES, payload: data.daremes });
        dispatch({ type: SET_LOADING_FALSE });
      }).catch(err => console.log(err));
  },

  setDareMeShow: (show: any, daremeId: any, dareme: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.setDareMeShow({ show: show }, daremeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          const state = { ...dareme, show: show };
          dispatch({ type: SET_DAREME, payload: state });
        }
        dispatch({ type: SET_LOADING_FALSE });
      }).catch(err => console.log(err))
  },

  deleteDareMe: (daremeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.deleteDareMe(daremeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_DAREMES, payload: [] });
          navigate('/admin/daremes');
        }
      }).catch(err => console.log(err));
  },

  updateDareMe: (daremeId: any, daremeData: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    let resultTeaser = null;
    let resultCover = null;
    if (daremeData.teaserFile) {
      const formData = new FormData();
      formData.append("file", daremeData.teaserFile);
      const config = { headers: { "content-type": "multipart/form-data" } };
      resultTeaser = await api.uploadFile(formData, config);
    }
    if (daremeData.coverFile) {
      const formData = new FormData();
      formData.append("file", daremeData.coverFile);
      const config = { headers: { "content-type": "multipart/form-data" } };
      resultCover = await api.selectCover(formData, config);
    }
    if (resultTeaser?.data.success) daremeData.teaserFile = resultTeaser.data.path;
    if (resultCover?.data.success) daremeData.coverFile = resultCover.data.path;
    api.updateDareMe(daremeId, { dareme: daremeData })
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_LOADING_FALSE });
          navigate(`/admin/daremes`);
        }
      }).catch(err => console.log(err));
  },

  deleteOption: (daremeId: any, optionId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.deleteOption(daremeId, optionId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_DAREME, payload: data.dareme });
          dispatch({ type: SET_LOADING_FALSE });
        }
      }).catch(err => console.log(err));
  },

  getDaremeOptions: (daremeId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.getDaremeOptions(daremeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_ADMIN_OPTIONS, payload: data.options });
          dispatch({ type: SET_LOADING_FALSE });
        }
      }).catch(err => console.log(err));
  }
}

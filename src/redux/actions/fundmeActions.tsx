import { Dispatch } from "redux";
import {
  SET_FUNDME_INITIAL,
  SET_FUNDMES,
  SET_FUNDME,
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  SET_FANWALL,
  SET_FANWALL_INITIAL,
  // SET_OPTION,
  SET_USERS,
  SET_USER,
  // SET_FANWALLS,
  SET_FUNDME_DETAIL_INITIAL,
  SET_FUNDME_VOTES,
  // SET_ADMIN_OPTIONS
} from "../types";
import * as api from "../../api";

export const fundmeAction = {
  getDraftFundme: (navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.getDraftFundme()
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_FUNDME_INITIAL });
        if (data.isDraft) dispatch({ type: SET_FUNDME, payload: data.fundme });
        navigate('/fundme/create');
        dispatch({ type: SET_LOADING_FALSE });
      })
      .catch((err) => console.log(err));
  },

  saveFundme: (fundme: any, teaser: any, cover: any, navigate: any, url: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    let resultTeaser = null;
    let resultCover = null;
    if (fundme.title === null && fundme.deadline === null && fundme.category === null && (fundme.teaser === null && teaser === null) && fundme.goal === null) {
      navigate(url);
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

      if (resultTeaser?.data.success) fundme.teaser = resultTeaser.data.path;
      if (resultCover?.data.success) fundme.cover = resultCover.data.path;
      api.saveFundme({ fundme: fundme })
        .then((res) => {
          const { data } = res;
          if (data.success) {
            dispatch({ type: SET_FUNDME, payload: data.fundme });
            navigate(url);
          }
          dispatch({ type: SET_LOADING_FALSE });
        }).catch((err) => console.log(err));
    }
  },

  eraseDraft: (fundmeId: any) => async (dispatch: Dispatch<any>) => {
    if (fundmeId) {
      dispatch({ type: SET_LOADING_TRUE });
      api.fundmedeleteDraft(fundmeId)
        .then((result: any) => {
          const { data } = result;
          if (data.success) {
            dispatch({ type: SET_FUNDME_INITIAL });
            dispatch({ type: SET_LOADING_FALSE })
          }
        }).catch(err => console.log(err));
    }
    else dispatch({ type: SET_FUNDME_INITIAL });
  },

  publishFundme: () => async (dispatch: Dispatch<any>) => {
    api.publishFundme()
      .then((result) => {
        const { data } = result;
      }).catch((err) => console.log(err));
  },

  checkDetailsAndResults: (fundmeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.checkFundMeFinished(fundmeId)
      .then((result: any) => {
        const { data } = result;
        dispatch({ type: SET_FUNDME_INITIAL });
        if (data.finished) navigate(`/fundme/result/${fundmeId}`);
        else navigate(`/fundme/details/${fundmeId}`);
      }).catch((err: any) => console.log(err));
  },

  getFundmeDetails: (fundmeId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_FUNDME_DETAIL_INITIAL });
    api.getFundMeDetails(fundmeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_FUNDME, payload: data.fundme });
          dispatch({ type: SET_LOADING_FALSE });
        }
      }).catch((err) => console.log(err));
  },

  checkFundAndResults: (fundmeId: any, donuts: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.checkFundMeFinished(fundmeId)
      .then((result: any) => {
        const { data } = result;
        if (data.finished) navigate(`/fundme/result/${fundmeId}`);
        else {
          api.fundCreator({ fundmeId: fundmeId, amount: donuts })
            .then((result: any) => {
              const { data } = result;
              if (data.success) {
                dispatch({ type: SET_LOADING_FALSE });
                dispatch({ type: SET_FUNDME, payload: data.fundme });
                if (data.user) dispatch({ type: SET_USER, payload: data.user });
              }
            }).catch((err: any) => console.log(err));
        }
      }).catch((err: any) => console.log(err));
  },

  getFundmeVoters: (fundmeId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.getFundmeVoters(fundmeId)
      .then((result: any) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_FUNDME_VOTES, payload: data.votes });
          dispatch({ type: SET_LOADING_FALSE });
        }
      }).catch((err) => console.log(err));
  },

  //   //-------------------------------------
  //   getFundmesOngoing: () => async (dispatch: Dispatch<any>) => {
  //     dispatch({ type: SET_LOADING_TRUE });
  //     dispatch({ type: SET_FUNDME_INITIAL });
  //     api.getFundmesOngoing()
  //       .then((result) => {
  //         const { data } = result;
  //         dispatch({ type: SET_FUNDMES, payload: data.fundmes });
  //         dispatch({ type: SET_FANWALLS, payload: data.fanwalls });
  //         dispatch({ type: SET_LOADING_FALSE });
  //       }).catch((err) => console.log(err));
  //   },

  getFundmeResult: (fundmeId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_FUNDME_INITIAL });
    api.getFundmeResult(fundmeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_FANWALL, payload: { fanwall: data.fanwall, itemType: 'fundme' } });
          dispatch({ type: SET_FUNDME, payload: data.fundme });
          dispatch({ type: SET_LOADING_FALSE });
        }
      }).catch((err) => console.log(err));
  },

  //   getOptionDetails: (optionId: any, fundmeId: any) => async (dispatch: Dispatch<any>) => {
  //     dispatch({ type: SET_LOADING_TRUE });
  //     dispatch({ type: SET_FUNDME_INITIAL });
  //     api.getOptionDetails(optionId, fundmeId)
  //       .then((result: any) => {
  //         const { data } = result;
  //         if (data.success) {
  //           dispatch({ type: SET_OPTION, payload: data.option });
  //           dispatch({ type: SET_FUNDME, payload: data.fundme });
  //           dispatch({ type: SET_LOADING_FALSE });
  //         }
  //       }).catch((err: any) => console.log(err));
  //   },

  //   supportCreator: (fundmeId: any, optionId: any, donuts: any, navigate: any) => async (dispatch: Dispatch<any>) => {
  //     api.checkFundMeFinished(fundmeId)
  //       .then((result: any) => {
  //         const { data } = result;
  //         if (data.finished) navigate(`/fundme/result/${fundmeId}`);
  //         else {
  //           api.supportCreator({ fundmeId: fundmeId, optionId: optionId, amount: donuts })
  //             .then((result) => {
  //               const { data } = result;
  //               if (data.success) {
  //                 dispatch({ type: SET_FUNDME, payload: data.fundme });
  //                 dispatch({ type: SET_OPTION, payload: data.option });
  //                 if (data.user) dispatch({ type: SET_USER, payload: data.user });
  //               }
  //             }).catch((err) => console.log(err));
  //         }
  //       }).catch((err: any) => console.log(err));
  //   },

  //   checkFundCreatorAndResults: (fundmeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
  //     api.checkFundMeFinished(fundmeId)
  //       .then((result: any) => {
  //         const { data } = result;
  //         if (data.finished) navigate(`/fundme/result/${fundmeId}`);
  //         else navigate(`/fundme/fund/${fundmeId}`);
  //       }).catch((err: any) => console.log(err));
  //   },

  //   getFundCreatorDetails: (fundmeId: any) => async (dispatch: Dispatch<any>) => {
  //     api.getFundCreatorDetails(fundmeId)
  //       .then((result: any) => {
  //         const { data } = result;
  //         if (data.success) dispatch({ type: SET_FUNDME, payload: data.fundme });
  //       }).catch((err: any) => console.log(err));
  //   },

  getFundmesByPersonalisedUrl: (url: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.getFundmesByPersonalisedUrl({ url: url })
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_FUNDMES, payload: data.fundmes });
        dispatch({ type: SET_USERS, payload: [data.user] });
        dispatch({ type: SET_LOADING_FALSE });
        navigate(`/${url}`);
      }).catch((err) => console.log(err));
  },

  //   fundCreator: (fundmeId: any, title: any, amount: any, navigate: any) => async (dispatch: Dispatch<any>) => {
  //     api.checkFundMeFinished(fundmeId)
  //       .then((result: any) => {
  //         const { data } = result;
  //         if (data.finished) navigate(`/fundme/result/${fundmeId}`);
  //         else {
  //           api.fundCreator({ fundmeId: fundmeId, title: title, amount: amount })
  //             .then((result) => {
  //               const { data } = result;
  //               if (data.success) {
  //                 const optionId = data.option._id;
  //                 dispatch({ type: SET_USER, payload: data.user });
  //                 dispatch({ type: SET_OPTION, payload: data.option });
  //                 navigate(`/fundme/fund/${fundmeId}/gameon/${optionId}`);
  //               }
  //             }).catch((err) => console.log(err));
  //         }
  //       }).catch((err: any) => console.log(err));
  //   },

  //   checkFundMeRequests: (fundmeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
  //     api.checkFundMeRequests(fundmeId)
  //       .then((result) => {
  //         const { data } = result;
  //         dispatch({ type: SET_FUNDME_INITIAL });
  //         if (data.request) navigate(`/fundme/requests/${fundmeId}`);
  //         else navigate(`/fundme/details/${fundmeId}`);
  //       }).catch(err => console.log(err));
  //   },

  //   getFundmeRequests: (fundmeId: any) => async (dispatch: Dispatch<any>) => {
  //     dispatch({ type: SET_LOADING_TRUE });
  //     dispatch({ type: SET_FUNDME_INITIAL });
  //     api.getFundmeRequests(fundmeId)
  //       .then((result) => {
  //         const { data } = result;
  //         if (data.success) {
  //           dispatch({ type: SET_FUNDME, payload: data.fundme });
  //           dispatch({ type: SET_LOADING_FALSE });
  //         }
  //       }).catch(err => console.log(err));
  //   },

  //   acceptFundOption: (fundmeId: any, optionId: any) => async (dispatch: Dispatch<any>) => {
  //     api.acceptFundOption({ optionId: optionId })
  //       .then((result: any) => {
  //         const { data } = result;
  //         if (data.success) {
  //           api.getFundmeRequests(fundmeId)
  //             .then((result) => {
  //               const { data } = result;
  //               if (data.success) {
  //                 dispatch({ type: SET_FUNDME, payload: data.fundme });
  //                 dispatch({ type: SET_LOADING_FALSE });
  //               }
  //             }).catch(err => console.log(err));
  //         }
  //       }).catch((err: any) => console.log(err));
  //   },

  //   // declineFundOption: (fundmeId: any, optionId: any) => async (dispatch: Dispatch<any>) => {
  //   //   dispatch({ type: SET_LOADING_TRUE });
  //   //   api.declineFundOption({ optionId: optionId, fundmeId: fundmeId })
  //   //     .then((result: any) => {
  //   //       const { data } = result;
  //   //       if (data.success) {
  //   //         api.getFundmeRequests(fundmeId)
  //   //           .then((result) => {
  //   //             const { data } = result;
  //   //             if (data.success) {
  //   //               dispatch({ type: SET_FUNDME, payload: data.fundme });
  //   //               dispatch({ type: SET_LOADING_FALSE });
  //   //             }
  //   //           }).catch(err => console.log(err));
  //   //       }
  //   //     }).catch((err: any) => console.log(err));
  //   // },

  postFanwall: (fundmeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.getFanwallByFundMeId(fundmeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_FUNDME, payload: data.fundme });
          dispatch({ type: SET_FANWALL_INITIAL, payload: 'fundme'});
          if (data.fanwall) dispatch({ type: SET_FANWALL, payload: data.fanwall});
          dispatch({ type: SET_LOADING_FALSE });
          navigate(`/dareme/fanwall/post/${fundmeId}`);
        }
      }).catch(err => console.log(err));
  },

  //   winFundOption: (optionId: any, fundmeId: any) => async (dispatch: Dispatch<any>) => {
  //     api.winFundOption({ optionId: optionId, fundmeId: fundmeId })
  //       .then((result: any) => {
  //         const { data } = result;
  //         if (data.success) {
  //           api.getFundmeResult(fundmeId)
  //             .then((result) => {
  //               const { data } = result;
  //               if (data.success) {
  //                 dispatch({ type: SET_FANWALL, payload: data.fanwall });
  //                 dispatch({ type: SET_FUNDME, payload: data.fundme });
  //               }
  //             }).catch((err) => console.log(err));
  //         }
  //       }).catch((err: any) => console.log(err));
  //   },

  //   //ADMIN
  //   // getFundMeList: (search: any) => async (dispatch: Dispatch<any>) => {
  //   //   dispatch({ type: SET_LOADING_TRUE });
  //   //   dispatch({ type: SET_FUNDME_INITIAL });
  //   //   api.getFundMeList({ search: search })
  //   //     .then((result) => {
  //   //       const { data } = result;
  //   //       if (data.success) dispatch({ type: SET_FUNDMES, payload: data.fundmes });
  //   //       dispatch({ type: SET_LOADING_FALSE });
  //   //     }).catch(err => console.log(err));
  //   // },

  //   setFundMeShow: (show: any, fundmeId: any, fundme: any) => async (dispatch: Dispatch<any>) => {
  //     dispatch({ type: SET_LOADING_TRUE });
  //     api.setFundMeShow({ show: show }, fundmeId)
  //       .then((result) => {
  //         const { data } = result;
  //         if (data.success) {
  //           const state = { ...fundme, show: show };
  //           dispatch({ type: SET_FUNDME, payload: state });
  //         }
  //         dispatch({ type: SET_LOADING_FALSE });
  //       }).catch(err => console.log(err))
  //   },

  //   deleteFundMe: (fundmeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
  //     dispatch({ type: SET_LOADING_TRUE });
  //     api.deleteFundMe(fundmeId)
  //       .then((result) => {
  //         const { data } = result;
  //         if (data.success) {
  //           dispatch({ type: SET_FUNDMES, payload: [] });
  //           navigate('/admin/fundmes');
  //         }
  //       }).catch(err => console.log(err));
  //   },

  //   updateFundMe: (fundmeId: any, fundmeData: any, navigate: any) => async (dispatch: Dispatch<any>) => {
  //     dispatch({ type: SET_LOADING_TRUE });
  //     let resultTeaser = null;
  //     let resultCover = null;
  //     if (fundmeData.teaserFile) {
  //       const formData = new FormData();
  //       formData.append("file", fundmeData.teaserFile);
  //       const config = { headers: { "content-type": "multipart/form-data" } };
  //       resultTeaser = await api.uploadFile(formData, config);
  //     }
  //     if (fundmeData.coverFile) {
  //       const formData = new FormData();
  //       formData.append("file", fundmeData.coverFile);
  //       const config = { headers: { "content-type": "multipart/form-data" } };
  //       resultCover = await api.selectCover(formData, config);
  //     }
  //     if (resultTeaser?.data.success) fundmeData.teaserFile = resultTeaser.data.path;
  //     if (resultCover?.data.success) fundmeData.coverFile = resultCover.data.path;
  //     api.updateFundMe(fundmeId, { fundme: fundmeData })
  //       .then((result) => {
  //         const { data } = result;
  //         if (data.success) {
  //           dispatch({ type: SET_LOADING_FALSE });
  //           navigate(`/admin/fundmes`);
  //         }
  //       }).catch(err => console.log(err));
  //   },

  //   // deleteOption: (fundmeId: any, optionId: any) => async (dispatch: Dispatch<any>) => {
  //   //   dispatch({ type: SET_LOADING_TRUE });
  //   //   api.deleteOption(fundmeId, optionId)
  //   //     .then((result) => {
  //   //       const { data } = result;
  //   //       if (data.success) {
  //   //         dispatch({ type: SET_FUNDME, payload: data.fundme });
  //   //         dispatch({ type: SET_LOADING_FALSE });
  //   //       }
  //   //     }).catch(err => console.log(err));
  //   // },

  //   getFundmeOptions: (fundmeId: any) => async (dispatch: Dispatch<any>) => {
  //     dispatch({ type: SET_LOADING_TRUE });
  //     api.getFundmeOptions(fundmeId)
  //       .then((result) => {
  //         const { data } = result;
  //         if(data.success) {
  //           dispatch({ type: SET_ADMIN_OPTIONS, payload: data.options });
  //           dispatch({ type: SET_LOADING_FALSE });
  //         }
  //       }).catch(err => console.log(err));
  //   }
}
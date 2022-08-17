import * as actionTypes from '../types';

const INITIAL_STATE: any = {
    loading: false,
    prevRoute: "/",
    nextRoute: "/",
    dlgState: {
        type: "",
        state: false
    },
    currentDareMe: null,
    currentFundMe: null,
    //// UPLOAD VIDEO AND CoverLetterImage ///
    videoFile: null,
    coverFile: null,
    sizeType: null,
    coverIndex: -1,
    ///////////////////////////////////
}

const loadRedcuer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action;
    switch (action.type) {
        case actionTypes.SET_LOADING_TRUE:
            return { 
                ...state, 
                loading: true 
            }
        case actionTypes.SET_LOADING_FALSE:
            return { 
                ...state, 
                loading: false 
            }
        case actionTypes.SET_PREVIOUS_ROUTE:
            return { 
                ...state, 
                prevRoute: payload 
            }
        case actionTypes.SET_NEXT_ROUTE:
            return { 
                ...state, 
                nextRoute: payload 
            }
        case actionTypes.SET_DIALOG_STATE:
            return { 
                ...state, 
                dlgState: payload 
            }
        case actionTypes.SET_CURRENT_DAREME:
            return { 
                ...state, 
                currentDareMe: payload 
            }
        case actionTypes.SET_CURRENT_FUNDME:
            return { 
                ...state, 
                currentFundMe: payload 
            }
        /////// UPLOAD FILE AND SELECT COVERLETTERIMAGE //////
        case actionTypes.SET_VIDEOFILE:
            return {
                ...state,
                videoFile: payload
            }
        case actionTypes.SET_COVERFILE:
            return {
                ...state,
                coverFile: payload
            }
        case actionTypes.SET_SIZETYPE:
            return {
                ...state,
                sizeType: payload
            }
        case actionTypes.SET_COVERINDEX:
            return {
                ...state,
                coverIndex: payload
            }
        ///////////////////////////////////////////////////////////
        default:
            return state;
    }
};

export default loadRedcuer;
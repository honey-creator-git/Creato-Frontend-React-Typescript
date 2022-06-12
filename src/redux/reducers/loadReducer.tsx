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
}

const loadRedcuer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action;
    switch (action.type) {
        case actionTypes.SET_LOADING_TRUE:
            return { ...state, loading: true };
        case actionTypes.SET_LOADING_FALSE:
            return { ...state, loading: false };
        case actionTypes.SET_PREVIOUS_ROUTE:
            return { ...state, prevRoute: payload };
        case actionTypes.SET_NEXT_ROUTE:
            return { ...state, nextRoute: payload };
        case actionTypes.SET_DIALOG_STATE:
            return { ...state, dlgState: payload };
        case actionTypes.SET_CURRENT_DAREME:
            return { ...state, currentDareMe: payload };
        default:
            return state;
    }
};

export default loadRedcuer;
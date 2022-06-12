import * as actionTypes from '../types';

const INITIAL_STATE: any = {
    fanwall: {
        fundme: null,
        writer: null,
        video: null,
        embedUrl: null,
        sizeType: null,
        message: null,
        cover: null,
        posted: null,
    },
    winOption: null, 
    topFuns: [],
    fanwalls: []
}

const fanwallReducer = ( state: any = INITIAL_STATE, action: any ) => {
    const { payload = null } = action;
    switch(action.type) {
        case actionTypes.SET_FANWALL: 
            return { ...state, fanwall: payload };
        case actionTypes.SET_FANWALL_WINOPTION:
            return { ...state, winOption: payload };
        case actionTypes.SET_FANWALL_TOPFANS: 
            return { ...state, topFuns: payload };
        case actionTypes.SET_FANWALL_INITIAL:
            return {
                fanwall: {
                    fundme: null,
                    wirter: null,
                    video: null,
                    embedUrl: null,
                    message: null,
                    sizeType: null,
                    posted: null,
                    cover: null,
                },
                winOption: null,
                fanwalls: [],
                topFuns: [],
            };
        case actionTypes.SET_FANWALLS:
            state.fanwalls = payload;
            return { ...state };
        default:
            return state;
    }
};

export default fanwallReducer;
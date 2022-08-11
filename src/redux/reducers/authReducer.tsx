import * as actionTypes from '../types';

const INITIAL_STATE: any = {
    user: null,
    users: [],
    nameExist: false,
    urlExist: false,
    stripeID: null,
    cardNum: null,
    lang: 'CH',
    payment: null,
    profileData: {
        category: [],
        avatarFile: null,
        displayName: null,
        creatoUrl: null
    }
}

const authReducer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action;
    switch (action.type) {
        case actionTypes.SET_USER:
            state.user = payload;
            return { ...state };
        case actionTypes.SET_USERS:
            state.users = payload;
            return { ...state };
        case actionTypes.SET_PROFILE_DATA:
            state.profileData = payload;
            return { ...state };
        case actionTypes.SET_NAME_EXIST:
            state.nameExist = payload;
            return { ...state };
        case actionTypes.SET_URL_EXIST:
            state.urlExist = payload;
            return { ...state };
        case actionTypes.SET_STRIPEID:
            state.stripeID = payload.stripeID;
            state.cardNum = payload.cardNum;
            return { ...state };
        case actionTypes.SET_LANGUAGE:
            state.lang = payload;
            return { ...state };
        case actionTypes.SET_PAYMENT:
            state.payment = payload
            return { ...state }
        case actionTypes.SET_USER_INITIAL: {
            return {
                user: null,
                users: [],
                nameExist: false,
                urlExist: false,
                stripeID: null,
                cardNum: null,
                payment: null,
                lang: 'EN',
                profileData: {
                    category: [],
                    avatarFile: null,
                    displayName: null,
                    creatoUrl: null
                }
            }
        }
        default:
            return state;
    }
};

export default authReducer;
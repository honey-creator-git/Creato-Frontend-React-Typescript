import * as actionTypes from '../types';

const INITIAL_STATE: any = {
    transactions: [],
    adminDonuts: null,
    userDonuts: null,
    daremeDonuts: null
}

const notificationReducer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action;
    switch (action.type) {
        case actionTypes.SET_DONUTS_INFO:
            const resState = { ...state, adminDonuts: payload.adminDonuts, userDonuts: payload.userDonuts, daremeDonuts: payload.daremeDonuts };
            return resState;
        case actionTypes.SET_ADMIN_DONUTS:
            return { ...state, adminDonuts: payload };
        case actionTypes.SET_TRANSACTIONS:
            return { ...state, transactions: payload };
        default:
            return state;
    }
};

export default notificationReducer;
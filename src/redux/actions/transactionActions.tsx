import { Dispatch } from "redux";
import * as api from "../../api";
import {
    SET_LOADING_TRUE,
    SET_LOADING_FALSE,
    SET_DONUTS_INFO,
    SET_ADMIN_DONUTS,
    SET_USERS,
    SET_TRANSACTIONS
} from "../types";

//Transaction Types
/*
Description 1: Added Donuts
Description 2: Purchase Donuts
Description 3: Vote Donuts Free
Description 4: Earnings From DareMe/FudnMe
Description 5: Vote as SupeFan
Description 6: Dare Request
Description 7: Refund of Donuts
Description 8: Tipping Donuts User - Admin
Description 9: Tipping Donuts User - User
Description 10: Unlock Exclusive Content
*/

export const transactionActions = {
    getAdminTransactions: (type: any) => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.getTransactions(type)
            .then((result) => {
                const { data } = result;
                if (data.success) {
                    dispatch({ type: SET_TRANSACTIONS, payload: [] });
                    dispatch({
                        type: SET_DONUTS_INFO, payload: {
                            adminDonuts: data.adminDonuts,
                            userDonuts: data.userDonuts,
                            daremeDonuts: data.daremeDonuts,
                            fundmeDonuts: data.fundmeDonuts
                        }
                    });
                    dispatch({ type: SET_USERS, payload: data.users });
                    dispatch({ type: SET_TRANSACTIONS, payload: data.transactions });
                    dispatch({ type: SET_LOADING_FALSE });
                }
            }).catch(err => console.log(err));
    },

    addAdminDonuts: (donuts: any) => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.addAdminDonuts({ donuts: donuts })
            .then((result) => {
                const { data } = result;
                if (data.success) {
                    dispatch({ type: SET_ADMIN_DONUTS, payload: data.donuts });
                    dispatch({ type: SET_LOADING_FALSE });
                }
            }).catch(err => console.log(err));
    },

    transferDonuts: (from: any, to: any, amount: any, type: any) => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.transferDonuts({ from: from, to: to, amount: amount })
            .then((result) => {
                const { data } = result;
                if (data.success) {
                    api.getTransactions(type)
                        .then((result) => {
                            const { data } = result;
                            if (data.success) {
                                dispatch({
                                    type: SET_DONUTS_INFO, payload: {
                                        adminDonuts: data.adminDonuts,
                                        userDonuts: data.userDonuts,
                                        daremeDonuts: data.daremeDonuts
                                    }
                                });
                                dispatch({ type: SET_USERS, payload: data.users });
                                dispatch({ type: SET_LOADING_FALSE });
                            }
                        }).catch(err => console.log(err));
                } else dispatch({ type: SET_LOADING_FALSE });
            }).catch(err => console.log(err));
    },

    getUserLatest5Transactions: () => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.getUserLatest5Transactions()
            .then((result) => {
                const { data } = result;
                if (data.success) {
                    dispatch({ type: SET_TRANSACTIONS, payload: data.transactions });
                    dispatch({ type: SET_LOADING_FALSE });
                }
            }).catch(err => console.log(err));
    },

    getUserTransactionsByDays: (days: any) => async (dispatch: Dispatch<any>) => {
        dispatch({ type: SET_LOADING_TRUE });
        api.getUserTransactionsByDays({ days: days })
            .then((result) => {
                const { data } = result;
                if (data.success) {
                    dispatch({ type: SET_TRANSACTIONS, payload: data.transactions });
                    dispatch({ type: SET_LOADING_FALSE });
                }
            }).catch(err => console.log(err));
    }
}
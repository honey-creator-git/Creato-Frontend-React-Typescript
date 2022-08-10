import * as actionTypes from '../types';

const INITIAL_STATE: any = {
    dareme: {
        owner: null,
        title: null,
        deadline: null,
        category: null,
        teaser: null,
        cover: null,
        options: [],
        reward: null,
        rewardText: null,
        published: null,
        sizeType: null,
        coverIndex: -1
    },
    teaserFile: null,
    teaserSizeType: null,
    coverFile: null,
    option: null,
    category: null,
    title: null,
    options: [],
    daremes: [],
    voterCount: 0,
    refundDonuts: null,
}

const daremeReducer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action;
    switch (action.type) {
        case actionTypes.SET_DAREME:
            return { ...state, dareme: payload };
        case actionTypes.SET_DAREME_INITIAL:
            return {
                dareme: {
                    owner: null,
                    title: null,
                    deadline: null,
                    category: null,
                    teaser: null,
                    options: [],
                    reward: null,
                    rewardText: null,
                    published: false,
                    cover: null,
                    sizeType: null,
                    coverIndex: -1
                },
                teaserFile: null,
                teaserSizeType: null,
                coverFile: null,
                option: null,
                category: null,
                title: null,
                options: [],
                daremes: []
            };
        case actionTypes.SET_DAREME_DETAIL_INITIAL:
            state.dareme = {
                owner: null,
                title: null,
                deadline: null,
                category: null,
                teaser: null,
                options: [],
                reward: null,
                rewardText: null,
                published: false,
                cover: null,
                sizeType: null,
                coverIndex: -1
            };
            return { ...state };
        case actionTypes.SET_DAREMES:
            state.daremes = payload;
            return { ...state };
        case actionTypes.SET_OPTION:
            state.option = payload;
            return { ...state };
        case actionTypes.SET_TEASER_FILE:
            state.teaserFile = payload;
            return { ...state };
        case actionTypes.SET_COVER_FILE:
            state.coverFile = payload;
            return { ...state };
        case actionTypes.SET_ADMIN_TITLE:
            state.title = payload;
            return { ...state };
        case actionTypes.SET_ADMIN_CATEGORY:
            state.category = payload;
            return { ...state };
        case actionTypes.SET_ADMIN_OPTIONS:
            state.options = payload;
            return { ...state };
        case actionTypes.SET_ADMIN_TEASER_SIZE_TYPE:
            state.teaserSizeType = payload;
            return { ...state };
        case actionTypes.SET_VOTER_COUNT:
            state.voterCount = payload;
            return { ...state };
        case actionTypes.SET_REFUND_DONUTS:
            state.refundDonuts = payload;
            return { ...state };
        default:
            return state;
    }
};

export default daremeReducer;
import * as actionTypes from '../types';

const INITIAL_STATE: any = {
    fundme: {
        owner: null,
        title: null,
        deadline: null,
        category: null,
        teaser: null,
        cover: null,
        goal: null,
        reward: null,
        rewardText: null,
        published: null,
        sizeType: null,
        coverIndex: -1
    },
    teaserFile: null,
    teaserSizeType: null,
    coverFile: null,
    category: null,
    title: null,
    fundmes: [],
    votes: [],
}

const fundmeReducer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action;
    switch (action.type) {
        case actionTypes.SET_FUNDME:
            return { ...state, fundme: payload };
        case actionTypes.SET_FUNDME_INITIAL:
            return {
                fundme: {
                    owner: null,
                    title: null,
                    deadline: null,
                    category: null,
                    teaser: null,
                    goal: null,
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
                category: null,
                title: null,
                fundmes: []
            };
        case actionTypes.SET_FUNDME_DETAIL_INITIAL:
            state.fundme = {
                owner: null,
                title: null,
                deadline: null,
                category: null,
                teaser: null,
                goal: null,
                reward: null,
                rewardText: null,
                published: false,
                cover: null,
                sizeType: null,
                coverIndex: -1
            };
            return { ...state };
        case actionTypes.SET_FUNDMES:
            state.fundmes = payload;
            return { ...state };
        case actionTypes.SET_TEASER_FILE1:
            state.teaserFile = payload;
            return { ...state };
        case actionTypes.SET_COVER_FILE1:
            state.coverFile = payload;
            return { ...state };
        case actionTypes.SET_FUNDME_VOTES:
            state.votes = payload;
            return { ...state };
        // case actionTypes.SET_ADMIN_TITLE:
        //     state.title = payload;
        //     return { ...state };
        // case actionTypes.SET_ADMIN_CATEGORY:
        //     state.category = payload;
        //     return { ...state };
        // case actionTypes.SET_ADMIN_OPTIONS:
        //     state.options = payload;
        //     return { ...state };
        // case actionTypes.SET_ADMIN_TEASER_SIZE_TYPE:
        //     state.teaserSizeType = payload;
        //     return { ...state };
        default:
            return state;
    }
};

export default fundmeReducer;
import * as actionTypes from '../types';

const INITIAL_STATE: any = {
    fundme: {
        owner: null,
        title: null,
        deadline: null,
        category: null,
        teaser: null,
        cover: null,
        options: [],
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
    fundmes: []
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
                    options: [],
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
                fundmes: []
            };
        case actionTypes.SET_FUNDME_DETAIL_INITIAL: 
            state.fundme = {
                owner: null,
                title: null,
                deadline: null,
                category: null,
                teaser: null,
                options: [],
                published: false,
                cover: null,
                sizeType: null,
                coverIndex: -1
            };
            return { ...state };
        case actionTypes.SET_FUNDMES:
            state.fundmes = payload;
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
        default:
            return state;
    }
};

export default fundmeReducer;
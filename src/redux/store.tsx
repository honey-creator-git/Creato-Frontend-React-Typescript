import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

let middleware: Array<any> =[thunk];

let configStore: any =  composeWithDevTools( applyMiddleware(...middleware));

const initialState: any = {};

const store = createStore( rootReducer, initialState, configStore);

export type RootStore = ReturnType<typeof rootReducer>;

export default store;
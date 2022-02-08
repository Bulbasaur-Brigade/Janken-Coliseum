import { createStore, combineReducers } from 'redux';
import { hpReducer } from './hpReducer';
import { npcBoardReducer } from './npcBoard';

const reducer = combineReducers({ hpReducer, npcBoardReducer });

const store = createStore(reducer);

export default store;

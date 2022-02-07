import { createStore, combineReducers } from "redux";
import { hpReducer } from "./hpReducer";

const reducer = combineReducers({ hpReducer });

const store = createStore(reducer);

export default store;

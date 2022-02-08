import { createStore, combineReducers } from "redux";
import { hpReducer } from "./hpReducer";
import { inventoryReducer } from "./inventoryReducer";
import { charReducer } from "./charReducer";
const reducer = combineReducers({ hpReducer, inventoryReducer, charReducer });

const store = createStore(reducer);

export default store;

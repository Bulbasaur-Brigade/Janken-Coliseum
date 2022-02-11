import { createStore, combineReducers } from "redux";
import { hpReducer } from "./hpReducer";
import { inventoryReducer } from "./inventoryReducer";
import { charReducer } from "./charReducer";
import { npcBoardReducer } from "./npcBoard";
const reducer = combineReducers({
  hpReducer,
  inventoryReducer,
  charReducer,
  npcBoardReducer,
});

const store = createStore(reducer);


export default store;

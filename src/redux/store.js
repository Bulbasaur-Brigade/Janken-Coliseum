import { createStore, combineReducers } from "redux";
import { hpReducer } from "./hpReducer";
import { inventoryReducer } from "./inventoryReducer";
import { charReducer } from "./charReducer";
import { npcBoardReducer } from "./npcBoard";
import { sceneReducer } from "./sceneReducer";
const reducer = combineReducers({
  hpReducer,
  inventoryReducer,
  charReducer,
  npcBoardReducer,
  sceneReducer,
});

const store = createStore(reducer);

export default store;

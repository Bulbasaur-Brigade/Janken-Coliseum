
const DEFEATED = "DEFEATED";
const ADD_NPC = "ADD_NPC";
const CURRENT_NPC = "CURRENT_NPC";
const RESET_NPC = "RESET_NPC";
const IS_OPEN = "IS_OPEN";


export const isDefeated = (name) => {
  return {
    type: DEFEATED,
    name,
  };
};

export const addNPC = (npc) => {
  return {
    type: ADD_NPC,
    npc,
  };
};

export const getNPC = (npc) => {
  return {
    type: CURRENT_NPC,
    npc,
  };
};
export const resetNPC = () => {
  return {
    type: RESET_NPC,
  };
};
export const doorOpen = () => {
  return {
    type: IS_OPEN,
  };
};


const initialState = { npcs: [], singleNPC: "", doorOpen: false };


export const npcBoardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEFEATED: {
      const defeatedNPC = state.npcs.filter((npc) => npc.name === action.name);
      const deleted = state.npcs.filter((npc) => npc.name !== action.name);

      defeatedNPC[0].defeated = true;
      return { ...state, npcs: [...deleted, defeatedNPC[0]] };
    }
    case ADD_NPC:
      return { ...state, npcs: [...state.npcs, action.npc] };
    case CURRENT_NPC:
      return { ...state, singleNPC: action.npc };
    case RESET_NPC:
      return { npcs: [], singleNPC: "", doorOpen: false };
    case IS_OPEN:
      return { ...state, doorOpen: true };
    default:
      return state;
  }
};

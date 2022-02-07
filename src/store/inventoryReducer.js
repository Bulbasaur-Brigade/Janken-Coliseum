const ADD_ITEM = "ADD_ITEM";
const LOSE_ITEM = "LOSE_ITEM";

export const addItem = (name, amount) => {
  return {
    type: ADD_ITEM,
    name,
    amount,
  };
};
export const loseItem = (name, amount) => {
  return {
    type: LOSE_ITEM,
    name,
    amount,
  };
};
const initialState = [
  { name: "rock", amount: 0 },
  { name: "paper", amount: 0 },
  { name: "scissors", amount: 0 },
];
export const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      return [...state, { name: action.name, amount: action.amount }];
    // case LOSE_HP:
    //   return { hp: state.hp - action.amount };
    default:
      return state;
  }
};

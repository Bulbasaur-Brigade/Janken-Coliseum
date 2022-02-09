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
const initialState = {
  itemArray: [
    { name: "rock", amount: 0 },
    { name: "paper", amount: 0 },
    { name: "scissors", amount: 0 },
  ],
};
export const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM: {
      const index = state.itemArray.findIndex(
        (item) => item.name === action.name
      );

      const newArray = [...state.itemArray];
      newArray[index].amount += 1;
      return { ...state, itemArray: newArray };
    }

    case LOSE_ITEM: {
      const index = state.itemArray.findIndex(
        (item) => item.name === action.name
      );
    
      const newArray = [...state.itemArray];
      newArray[index].amount -= 1;
      return { ...state, itemArray: newArray };
    }

    default:
      return state;
  }
};

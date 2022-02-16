const ADD_HP = "ADD_HP";
const LOSE_HP = "LOSE_HP";
const RESET_HP = "RESET_HP";
export const addHp = (amount) => {
  return {
    type: ADD_HP,
    amount,
  };
};
export const loseHp = (amount) => {
  return {
    type: LOSE_HP,
    amount,
  };
};
export const resetHp = () => {
  return {
    type: RESET_HP,
  };
};

export const hpReducer = (state = 5, action) => {
  switch (action.type) {
    case ADD_HP:
      return state + action.amount;
    case LOSE_HP:
      return state - action.amount;
    case RESET_HP:
      return 5;
    default:
      return state;
  }
};

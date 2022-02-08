const ADD_HP = "ADD_HP";
const LOSE_HP = "LOSE_HP";

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
export const hpReducer = (state = 3, action) => {
  switch (action.type) {
    case ADD_HP:
      return state + action.amount;
    case LOSE_HP:
      return state - action.amount;
    default:
      return state;
  }
};

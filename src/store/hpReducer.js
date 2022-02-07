const ADD_HP = "ADD_HP";
const LOSE_HP = "LOSE_HP";

export const addHp = (amount) => {
  console.log("HP!!@!@#12312312312312");
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
      console.log("HP!!@!@#");

      console.log("action", action);
      return state + action.amount;
    // case LOSE_HP:
    //   return { hp: state.hp - action.amount };
    default:
      return state;
  }
};

const CHAR_CODE = "CHAR_CODE";
const RESET_CHAR = "RESET_CHAR";
export const pickChar = (char) => {
  return {
    type: CHAR_CODE,
    char,
  };
};
export const resetChar = () => {
  return {
    type: RESET_CHAR,
  };
};

export const charReducer = (state = "dave", action) => {
  switch (action.type) {
    case CHAR_CODE:
      return action.char;
    case RESET_CHAR:
      return "dave";
    default:
      return state;
  }
};

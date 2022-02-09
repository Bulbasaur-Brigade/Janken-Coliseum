const CHAR_CODE = "CHAR_CODE";

export const pickChar = (char) => {
  return {
    type: CHAR_CODE,
    char,
  };
};

export const charReducer = (state = 'dave', action) => {
  switch (action.type) {
    case CHAR_CODE:
      return action.char;
    default:
      return state;
  }
};

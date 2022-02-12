const SCENE_CODE = "SCENE_CODE";
const RESET_SCENE_CODE = "RESET_SCENE_CODE";
export const setScene = (scene) => {
  return {
    type: SCENE_CODE,
    scene,
  };
};
export const resetScene = () => {
  return {
    type: RESET_SCENE_CODE,
  };
};

export const sceneReducer = (state = "", action) => {
  switch (action.type) {
    case SCENE_CODE:
      return action.scene;
    case RESET_SCENE_CODE:
      return "";
    default:
      return state;
  }
};

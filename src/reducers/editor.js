import { SET_STYLE } from "../actions/types";

const INITIAL_STATE = {
  currStyle: null
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    default:
      return state;

    case SET_STYLE:
      return {
        ...state,
        currStyle: payload
      };
  }
};

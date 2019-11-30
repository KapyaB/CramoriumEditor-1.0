import { SET_EVENT } from "../actions/types";

const INITIAL_STATE = {
  currEvent: null
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    default:
      return state;

    case SET_EVENT:
      return {
        ...state,
        currEvent: payload
      };
  }
};

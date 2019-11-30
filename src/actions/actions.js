import { SET_EVENT } from "./types";

export const setEvent = event => dispatch => {
  dispatch({
    type: SET_EVENT,
    payload: event
  });
};

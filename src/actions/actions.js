import { SET_STYLE } from "./types";

export const setStyle = style => dispatch => {
  dispatch({
    type: SET_STYLE,
    payload: style
  });
};

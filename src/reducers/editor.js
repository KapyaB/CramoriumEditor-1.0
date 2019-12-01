import {
  SET_STYLE,
  SET_INLINE_STYLES,
  SET_EDITOR_STATE
} from "../actions/types";

const INITIAL_STATE = {
  editorState: null,
  currStyle: null,
  inlineStyles: null
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    default:
      return state;

    case SET_EDITOR_STATE:
      return {
        ...state,
        editorState: payload
      };

    case SET_STYLE:
      return {
        ...state,
        currStyle: payload
      };

    case SET_INLINE_STYLES:
      return {
        ...state,
        inlineStyles: payload
      };
  }
};

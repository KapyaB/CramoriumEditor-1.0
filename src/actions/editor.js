import { SET_STYLE, SET_INLINE_STYLES, SET_EDITOR_STATE } from "./types";

export const setEditorState = editorState => dispatch => {
  dispatch({
    type: SET_EDITOR_STATE,
    payload: editorState
  });
};

export const setStyle = style => dispatch => {
  dispatch({
    type: SET_STYLE,
    payload: style
  });
};

// set inline styles (keep a record)
export const setInlineStyles = styles => dispatch => {
  dispatch({
    type: SET_INLINE_STYLES,
    payload: styles
  });
};

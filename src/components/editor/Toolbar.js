import React from "react";
import PropTypes from "prop-types";
import { RichUtils } from "draft-js";

import styleBtns from "./styleBtns";

const Toolbar = ({
  toggleInlineStyle,
  toggleBlockType,
  editorState,
  setImagePrompt,
  imagePrompt,
  setLinkPrompt,
  linkPrompt,
  notePrompt,
  setNotePrompt
}) => {
  const { basicInlineBtns, advInlineBtns, basicBlockBtns } = styleBtns;

  // Create inline buttons
  const createInlineBtn = (value, style) => {
    // check if the style is active
    const activeStyle = editorState.getCurrentInlineStyle();
    let className = "";
    if (activeStyle.has(style)) {
      className = "active-style";
    }
    return (
      <button
        key={style}
        data-style={style}
        onMouseDown={toggleInlineStyle}
        className={`style-btn ${className}`}
      >
        {value}
      </button>
    );
  };

  // create block type button
  const createBlockBtn = (value, block) => {
    // check currently active block type
    const activeBlockType = RichUtils.getCurrentBlockType(editorState);
    let className = "";
    if (activeBlockType === block) {
      className = "active-style";
    }
    return (
      <button
        key={block}
        data-block={block}
        onMouseDown={toggleBlockType}
        className={`style-btn ${className}`}
      >
        {value}
      </button>
    );
  };
  return (
    <div className="editor-styles">
      <div className="inline-styles">
        <div className="basic-inline">
          {basicInlineBtns.map(btn => createInlineBtn(btn.value, btn.style))}
        </div>
        <div className="advanced-inline">
          {advInlineBtns.map(btn => createInlineBtn(btn.value, btn.style))}
        </div>
      </div>
      <div className="block-styles">
        <div className="basic-blocks">
          {basicBlockBtns.map(btn => createBlockBtn(btn.value, btn.block))}
        </div>
        <div className="advanced-btns">
          <button
            className="style-btn"
            onMouseDown={() => setImagePrompt(!imagePrompt)}
          >
            Image
          </button>
          <button
            className="style-btn"
            onMouseDown={() => setLinkPrompt(!linkPrompt)}
          >
            Link
          </button>
          <button
            className="style-btn"
            onMouseDown={() => setNotePrompt(!notePrompt)}
          >
            Note
          </button>
        </div>
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  toggleInlineStyle: PropTypes.func.isRequired,
  toggleBlockType: PropTypes.func.isRequired,
  editorState: PropTypes.object.isRequired,
  setImagePrompt: PropTypes.func.isRequired,
  imagePrompt: PropTypes.bool.isRequired,
  linkPrompt: PropTypes.bool.isRequired,
  setLinkPrompt: PropTypes.func.isRequired,
  notePrompt: PropTypes.bool.isRequired,
  setNotePrompt: PropTypes.func.isRequired
};

export default Toolbar;

import React, { useState } from "react";
import PropTypes from "prop-types";
import { RichUtils, Modifier } from "draft-js";

import styleBtns from "./styleBtns";
import styleMap from "./inlineStyles";

const Toolbar = ({
  EditorState,
  setEditorState,
  toggleInlineStyle,
  toggleBlockType,
  editorState,
  setImagePrompt,
  imagePrompt,
  setLinkPrompt,
  linkPrompt,
  notePrompt,
  setNotePrompt,
  styles,
  hasSelection
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
  const colors = [
    // bw
    "#000",
    "#333",
    "#888",
    "#bbb",
    "#fff",

    //  red
    "#C3160C",
    "#800000",
    "#FE2400",
    "#E0115F",
    "#8F001F",
    "#B70E09",

    //  green
    "#0B6623",
    "#507843",
    "#29AB87",
    "#679267",
    "#C7EA46",

    //  blue
    "#111E6C",
    "#0E4D92",
    "#008DCB",
    "#4682B4",
    "#D4D4D4",

    //  pink
    "#E0115E",
    "#F71794",
    "#FF0090",
    "#FA67CB",
    "#FD5AAB",

    //  yellow
    "#F8DE7F",
    "#EFCE33",
    "#FFC30B",
    "#CD7722",
    "#FFDDAF",

    //  orange
    "#FC6701",
    "#8B4000",
    "#F7A702",
    "#FDBE00",
    "#F05E23"
  ];

  const [showColors, setShowColors] = useState(false);

  const createFontColorBtn = () => {
    const activeStyle = editorState.getCurrentInlineStyle();
    // set font color btn color
    const currFontColor = Array.from(activeStyle).find(
      style => style && style.charAt(0) === "#"
    );
    return (
      <button
        className="font-color-btn style-btn"
        style={{ borderBottom: `${currFontColor || "#000"} 3px solid` }}
        onMouseDown={() => setShowColors(!showColors)}
        disabled={!hasSelection}
      >
        A
      </button>
    );
  };

  // handle color click. remove previous color
  const onColorClick = toggledColor => {
    const selection = editorState.getSelection();
    // remove any previuosly active colors
    const colorStyles = Object.keys(styleMap).filter(
      style => style && style.charAt(0) === "#"
    );

    const nextContentState = colorStyles.reduce((contentState, color) => {
      return Modifier.removeInlineStyle(contentState, selection, color);
    }, editorState.getCurrentContent());

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      "change-inline-style"
    );

    const currentStyle = editorState.getCurrentInlineStyle();
    const currentColor = currentStyle.find(
      style => style && style.charAt(0) === "#"
    );

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = RichUtils.toggleInlineStyle(editorState, currentColor);
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }

    setEditorState(nextEditorState);

    setShowColors(false);
  };

  // font size
  const [fontSize, setFontSize] = useState(12);
  const [fontSizeForm, setFontSizeForm] = useState(false);

  const handleFontSizeChange = e => {
    const newSize = e.target.value;
    setFontSize(newSize);
    const newEditorState = styles.fontSize.toggle(editorState, `${newSize}px`);
    setEditorState(newEditorState);
  };

  // create the font size input
  const createFontSizeBtn = () => {
    const activeStyle = editorState.getCurrentInlineStyle();
    // set font color btn color
    const currFontSize = Array.from(activeStyle).find(
      // the custom font size style starts with '_'
      style => style && style.charAt(0) === "_"
    );
    if (currFontSize) {
      var fSize = parseInt(currFontSize.slice(12).replace("px", "")) || 12;
    }

    return (
      <input
        disabled={!hasSelection}
        className="font-size"
        onClick={() => setFontSizeForm(!fontSizeForm)}
        value={fSize || 12}
      />
    );
  };

  // fonts
  const fonts = [
    "Sans_Serif",
    "Open_Sans",
    "Times_New_Roman",
    "Georgia",
    "Arial",
    "Verdana",
    "Courier_New",
    "Lucida_Console",
    "Caveat ",
    "Cookie ",
    "Great_Vibes ",
    "Italianno ",
    "Marck_Script ",
    "Merienda ",
    "Parisienne ",
    "Pinyon_Script ",
    "Sacramento ",
    "Satisfy ",
    "Tangerine ",
    "Barlow ",
    "Dancing_Script ",
    "Inconsolata ",
    "Lato ",
    "Libre_Baskerville ",
    "Lobster ",
    "Montserrat ",
    "Open_Sans ",
    "Pacifico ",
    "Raleway ",
    "Roboto ",
    "Roboto_Mono ",
    "Source_Sans_Pro ",
    "Abel ",
    "Cabin ",
    "Calistoga ",
    "Josefin_Sans ",
    "Mukta ",
    "Nunito ",
    "Questrial ",
    "Quicksand ",
    "Rubik ",
    "Ubuntu ",
    "Cinzel ",
    "Cormorant_Garamond ",
    "Crimson_Text ",
    "Domine ",
    "Playfair_Display_SC ",
    "Roboto_Slab"
  ];

  const [showFonts, setShowFonts] = useState(false);
  // create the font select tag
  const createFontBtn = () => {
    const activeStyle = editorState.getCurrentInlineStyle();
    // set font color btn color
    const currFont = Array.from(activeStyle).find(
      // font styles start with 'font_'
      style => style && style.slice(0, 5) === "font_"
    );

    return (
      <button
        disabled={!hasSelection}
        className=" current-font style-btn"
        onMouseDown={() => setShowFonts(!showFonts)}
        style={{
          fontFamily: currFont
            ? currFont.replace("font_", "").replace(/_/g, " ")
            : "Arial"
        }}
      >
        {currFont ? currFont.replace("font_", "").replace(/_/g, " ") : "Arial"}
      </button>
    );
  };

  // handle font click. remove previous font
  const onFontClick = toggledFont => {
    const selection = editorState.getSelection();
    // remove any previuosly active colors
    const fontStyles = Object.keys(styleMap).filter(
      style => style && style.slice(0, 5) === "font_"
    );

    const nextContentState = fontStyles.reduce((contentState, font) => {
      return Modifier.removeInlineStyle(contentState, selection, font);
    }, editorState.getCurrentContent());
    console.log(nextContentState.toString());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      "change-inline-style"
    );

    const currentStyle = editorState.getCurrentInlineStyle();
    const currentFont = currentStyle.find(
      style => style && style.slice(0, 5) === "font_"
    );

    // Unset style override for current font.
    if (selection.isCollapsed()) {
      nextEditorState = RichUtils.toggleInlineStyle(editorState, currentFont);
    }

    // If the font is being toggled on, apply it.
    if (!currentStyle.has(toggledFont)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledFont
      );
    }

    setEditorState(nextEditorState);

    setShowFonts(false);
  };

  return (
    <div className="editor-styles">
      <div className="inline-styles">
        <div className="basic-inline">
          <div className="font-color">
            {showColors && (
              <div className="color-picker">
                {colors.map(clr => (
                  <button
                    className="color-btn"
                    style={{
                      background: clr,
                      height: "1rem",
                      width: "1rem"
                    }}
                    onMouseDown={() => onColorClick(clr)}
                    onClick={toggleInlineStyle}
                    key={clr}
                    data-style={clr}
                  />
                ))}
              </div>
            )}
            {createFontColorBtn()}
            <div className="font-selector">
              {createFontBtn()}
              {showFonts && (
                <div className="font-list">
                  {fonts.sort().map(font => (
                    <button
                      className="font-option"
                      style={{
                        fontFamily: font.replace(/_/g, " ")
                      }}
                      onMouseDown={() => onFontClick(`font_${font}`)}
                      onClick={toggleInlineStyle}
                      key={font}
                      data-style={`font_${font}`}
                    >
                      {font.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {fontSizeForm ? (
              <input
                onMouseOut={() => setFontSizeForm(false)}
                type="number"
                min="1"
                step="1"
                placeholder="font size"
                className="font-size-input"
                onChange={e => handleFontSizeChange(e)}
                name="fontSize"
                value={fontSize}
              />
            ) : (
              createFontSizeBtn()
            )}
          </div>

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
            disabled={!hasSelection}
          >
            Link
          </button>
          <button
            className="style-btn"
            onMouseDown={() => setNotePrompt(!notePrompt)}
            disabled={!hasSelection}
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
  setNotePrompt: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  hasSelection: PropTypes.bool.isRequired
};

export default Toolbar;

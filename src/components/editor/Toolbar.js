import React, { useState, createRef } from "react";
import PropTypes from "prop-types";
import { RichUtils } from "draft-js";
import { connect } from "react-redux";

import styleBtns from "./styleBtns";
import { setStyle, setInlineStyles } from "../../actions/editor";

const fSizeRef = createRef();

const Toolbar = ({
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
  hasSelection,
  onAlignClick,
  setRef,
  editorRef,
  focus,
  simulateSelection,
  setStyle,
  editor: { currStyle },
  setInlineStyles
}) => {
  const {
    basicInlineBtns,
    advInlineBtns,
    basicBlockBtns,
    alignBts,
    headers,
    fontSizes
  } = styleBtns;
  const activeStyles = editorState.getCurrentInlineStyle().toArray();

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

  // COLORS
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
    const activeColors = activeStyles.filter(
      style => style && style.charAt(0) === "#"
    );
    // set font color btn color
    const currFontColor = activeColors[activeColors.length - 1];
    return (
      <button
        className="font-color-btn style-btn"
        style={{ borderBottom: `${currFontColor || "#000"} 3px solid` }}
        onMouseOver={() => setShowColors(true)}
        onMouseDown={() => setShowColors(!showColors)}
        /* disabled={!hasSelection} */
      >
        <i className="fas fa-font" />
      </button>
    );
  };

  // FONT SIZE
  // const [fontSize, setFontSize] = useState(8);
  // const handleFontSizeChange = e => {
  //   setFontSize(e.target.value);
  // };

  // create the font size input
  // const createFontSizeBtn = () => {
  //   // set font color btn color
  //   const currFontSize = activeStyles.find(
  //     // the custom font size style form '__FONT_SIZE_12px'
  //     style => style && style.slice(13) === "px"
  //   );

  //   if (currFontSize) {
  //     setFontSize(currFontSize);
  //   }

  //   return (
  //     <input
  //       /* disabled={!hasSelection} */
  //       className="font-size style-btn"
  //       value={fontSize}
  //       type="number"
  //       /* step="1" */
  //       placeholder="font size"
  //       data-style={`__FONT_SIZE_${fontSize}px`}
  //       onChange={e => {
  //         setRef(fSizeRef);
  //         handleFontSizeChange(e);
  //       }}
  //       onKeyDown={handleInputEnter}
  //       onBlur={handleFontSizeSubmit}
  //       name="fontSize"
  //       ref={fSizeRef}
  //     />
  //   );
  // };

  // headers
  const [showHeaders, setShowHeaders] = useState(false);
  const createHeaderBtn = (value, block) => {
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
        onClick={() => setShowHeaders(false)}
        onMouseDown={toggleBlockType}
        className={`style-btn ${className}`}
      >
        {value}
      </button>
    );
  };

  // FONT FAMILY
  const fonts = [
    "Sans_Serif",
    "Serif",
    "Times_New_Roman",
    "Georgia",
    "Arial",
    "Verdana",
    "Courier_New",
    "Lucida_Console",
    "Caveat",
    "Cookie",
    "Great_Vibes",
    "Italianno",
    "Marck_Script",
    "Merienda",
    "Parisienne",
    "Pinyon_Script",
    "Sacramento",
    "Satisfy",
    "Tangerine",
    "Barlow",
    "Dancing_Script",
    "Inconsolata",
    "Lato",
    "Libre_Baskerville",
    "Lobster",
    "Montserrat",
    "Open_Sans",
    "Pacifico",
    "Raleway",
    "Roboto",
    "Roboto_Mono",
    "Source_Sans_Pro",
    "Abel",
    "Cabin",
    "Calistoga",
    "Josefin_Sans",
    "Mukta",
    "Nunito",
    "Questrial",
    "Quicksand",
    "Rubik",
    "Ubuntu",
    "Cinzel",
    "Cormorant_Garamond",
    "Crimson_Text",
    "Domine",
    "Playfair_Display_SC",
    "Roboto_Slab"
  ];

  const [showFonts, setShowFonts] = useState(false);
  // create the font btn
  const createFontBtn = () => {
    /**
     * WORKAROUND ALERT!!
     * When selection is uncollapsed, the new font is not a replacement, but simply an addition. Same is true for slecting text with a previously applied font. The font in the editor will change, but the array of inline styles still contains the other fonts. WORK ON IT!!!
     */
    const fontStyles = activeStyles.filter(
      style => style && style.slice(0, 5) === "font_"
    );
    const currFont = fontStyles[fontStyles.length - 1];

    return (
      <button
        /* disabled={!hasSelection} */
        className=" current-font style-btn"
        onMouseDown={() => {
          setShowFonts(!showFonts);
        }}
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

  // create alignment btn
  const createAlignBtn = (value, style, alignment) => {
    // check if is current alignment
    const activeStyle = editorState.getCurrentInlineStyle();
    let className = "";
    if (activeStyle.has(style)) {
      className = "active-style";
    }
    return (
      <button
        key={style}
        data-style={style}
        alignment={alignment}
        onClick={() => onAlignClick(alignment)}
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
                    onMouseDown={e => {
                      toggleInlineStyle(e);
                      setShowFonts(false);
                    }}
                    key={font}
                    data-style={`font_${font}`}
                  >
                    {font.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* <div className="font-sizes">
            <button
              className="style-btn"
              onMouseDown={() => setShowFontSizes(!showFontSizes)}
            >
              Font Size
            </button>
            {showFontSizes &&
              fontSizes.map(btn => createFsizeBtn(btn.value, btn.style))}
          </div> */}
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
                    onMouseDown={e => {
                      toggleInlineStyle(e);
                      setShowColors(false);
                    }}
                    key={clr}
                    data-style={clr}
                  />
                ))}
              </div>
            )}
            {createFontColorBtn()}
          </div>
          {basicInlineBtns.map(btn => createInlineBtn(btn.value, btn.style))}
        </div>
        <div className="advanced-inline">
          {advInlineBtns.map(btn => createInlineBtn(btn.value, btn.style))}
        </div>
      </div>
      <div className="block-styles">
        <div className="basic-blocks">
          <div className="headers">
            <button
              className="headers-btn style-btn"
              onMouseDown={() => setShowHeaders(!showHeaders)}
            >
              Headers
            </button>
            {showHeaders && headers.map(h => createHeaderBtn(h.value, h.block))}
          </div>
          {basicBlockBtns.map(btn => createBlockBtn(btn.value, btn.block))}
        </div>
        <div className="advanced-btns">
          <div className="alignment-btns">
            {alignBts.map(btn =>
              createAlignBtn(btn.value, btn.style, btn.alignment)
            )}
          </div>
          <button
            className="style-btn"
            onClick={() => setImagePrompt(!imagePrompt)}
          >
            <i className="far fa-image" />
          </button>
          <button
            className="style-btn"
            onMouseDown={() => setLinkPrompt(!linkPrompt)}
            disabled={!hasSelection}
          >
            <i className="fas fa-link" />
          </button>
          <button
            className="style-btn"
            onMouseDown={() => setNotePrompt(!notePrompt)}
            disabled={!hasSelection}
          >
            <i className="far fa-sticky-note" />
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
  hasSelection: PropTypes.bool.isRequired,
  onAlignClick: PropTypes.func.isRequired,
  setInlineStyles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  editor: state.editor
});

export default connect(mapStateToProps, { setStyle, setInlineStyles })(Toolbar);

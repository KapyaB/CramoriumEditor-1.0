import React, { useState, useEffect, createRef } from "react";
import {
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  SelectionState
} from "draft-js";
import Editor from "draft-js-plugins-editor";
import createStyles from "draft-js-custom-styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import styleMap from "./inlineStyles";
import Toolbar from "./Toolbar";
import { mediaBlockRenderer } from "./entities/MediaBlock";
import linkPlugin from "./plugins/LinkPlugin";
import functions from "./functions";
import ImageEmbed from "./embeds/ImageEmbed";
import LinkEmbed from "./embeds/LinkEmbed";
import NoteEmbed from "./embeds/NoteEmbed";
import notePlugin from "./plugins/NotePlugin";

// editor ref
const editorRef = createRef();

const RichTEditor = ({ editor: { currStyle } }) => {
  const [ref, setRef] = useState(editorRef);

  const focus = () => {
    ref && ref.current && ref.current.focus();
  };

  // Simulate a selection
  const simulateSelection = e => {
    e.preventDefault();
    e.persist();
    const selection = editorState.getSelection();
    if (!selection) {
      /**
       * WORKAROUND ALERT!!
       * we are using the inline styles array to keey a record of the applied aligments. Hence we are only using the last applied alignment (every new alignment is appended not a replacement).abs
       *
       * simulate a selection on the entire block and toggle the alignment;
       * 1. get all the inline tyle ranges on the block
       * 2. get the offset of the first range and offset+length (lenth of block = this value-offset of first) of the last.
       * 3. create a new selection state with the block's key as the anchor and focus key, the achor offset is the offset of the first range (aka start of block) and the focus offset is the length of the last block
       *  4. update editor state with selection
       */
      const anchorKey = editorState.getSelection().getAnchorKey();
      const block = allBlocks.find(block => block.key === anchorKey);
      const blockInlineStyles = block.inlineStyleRanges;
      if (blockInlineStyles.length > 0) {
        const blockOffset = blockInlineStyles[0].offset;
        const lastRange = blockInlineStyles[blockInlineStyles.length - 1];
        const lengthOfBlock = lastRange.length + lastRange.offset - blockOffset;
        // selection
        const selection = new SelectionState({
          anchorKey: block.key,
          anchorOffset: blockOffset,
          focusKey: block.key,
          focusOffset: lengthOfBlock
        });
        // update editor state with selection
        return setEditorState(
          EditorState.acceptSelection(editorState, selection)
        );
      }
    }
  };

  // the EditorState state. Creates an empty editor initially
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // inline styles. use a single method by setting a 'data-style attribute on th ebuttons
  const toggleInlineStyle = e => {
    // don't blur the editor
    e.preventDefault();

    // grab the style to toggle from the clicked element/btn
    let style = currStyle || e.currentTarget.getAttribute("data-style");

    // remove previous font/color/alignment
    const selection = editorState.getSelection();

    if (
      style.slice(0, 5) === "font_" ||
      style.slice(0, 12) === "__TEXT_ALIGN" ||
      style.charAt(0) === "#"
    ) {
      // find the styles currently active
      var styles;
      if (style.slice(0, 5) === "font_") {
        styles = editorState
          .getCurrentInlineStyle()
          .toArray()
          .filter(style => style && style.slice(0, 5) === "font_");
      } else if (style.charAt(0) === "#") {
        styles = editorState
          .getCurrentInlineStyle()
          .toArray()
          .filter(style => style && style.charAt(0) === "#");
      } else if (style.slice(0, 12) === "__TEXT_ALIGN") {
        styles = editorState
          .getCurrentInlineStyle()
          .toArray()
          .filter(style => style && style.slice(0, 12) === "__TEXT_ALIGN");
      }
      // remove previous font/color/alignment
      const nextContentState = styles.reduce((contentState, style) => {
        return Modifier.removeInlineStyle(contentState, selection, style);
      }, editorState.getCurrentContent());

      // define next editor state
      let nextEditorState = EditorState.push(
        editorState,
        nextContentState,
        "change-inline-style"
      );

      nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style);

      return setEditorState(nextEditorState);
    }

    if (style.slice(13) === "px") {
      const newEditorState = styles.fontSize.toggle(editorState, style);
      return setEditorState(newEditorState);
    }

    // toggle the style. returns a new editor state
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    setRef(editorRef);
  };

  // blockstyles
  const toggleBlockType = e => {
    // don't blur editor
    e.preventDefault();

    let block = e.currentTarget.getAttribute("data-block");
    setEditorState(RichUtils.toggleBlockType(editorState, block));
    setRef(editorRef);
  };

  // handle keyboard shortcuts
  const handleKeyCommand = command => {
    // 1. Defaults
    // returns a new instance of editorState
    var newEditorState = RichUtils.handleKeyCommand(editorState, command);
    // there are some out-of-the-box draft command string like bold ctrl+b

    // 2. Custom.
    // If RichUtils.handleKeyCommand didn't find anything, check for our custom strikethrough command
    if (!newEditorState && command === "strikethrough") {
      newEditorState = RichUtils.toggleInlineStyle(
        editorState,
        "STRIKETHROUGH"
      );
    }

    // highlight
    if (!newEditorState && command === "highlight") {
      newEditorState = RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT");
    }

    // tab
    if (
      typeof command === "object" &&
      !newEditorState &&
      command.cmd === "tab"
    ) {
      // Tab level
      const maxDepth = 5;
      newEditorState = RichUtils.onTab(command.e, editorState, maxDepth);
    }

    // link
    if (!newEditorState && command === "add-link") {
      setLinkPrompt(!linkPrompt);
    }

    // note
    if (!newEditorState && command === "add-note") {
      setNotePrompt(!notePrompt);
    }

    if (newEditorState) {
      setEditorState(newEditorState);
      return "handled";
    }

    return "not-handled";
  };

  //  for handling custom keyboard shortcuts
  const { keyBindingFn } = functions;

  // image handling
  const [imagePrompt, setImagePrompt] = useState(false);

  // link handling
  const [linkPrompt, setLinkPrompt] = useState(false);

  // note handling
  const [notePrompt, setNotePrompt] = useState(false);

  // font size
  const customStylesToManage = ["font-size", "text-align"];
  const { styles, customStyleFn } = createStyles(customStylesToManage, "_");

  const plugins = [linkPlugin, notePlugin];

  // whether there is a selection or not
  let hasSelection = false;
  const cursorPosition = editorState.getSelection().getAnchorOffset(); // or start of selection
  const endOfSelction = editorState.getSelection().getFocusOffset();
  if (cursorPosition !== endOfSelction) {
    hasSelection = true;
  }

  // text alignment
  // All Blocks in editor
  const allBlocks = convertToRaw(editorState.getCurrentContent()).blocks;
  // TEXT ALIGNMENT
  const allBlockNodes = document.getElementsByClassName(
    "public-DraftStyleDefault-block"
  );

  /*
      get selected or new block using anchor key and the "data-offset-key" attribute(from draft) 
      the first set of chars in the data offset key is the same as the block's anchor key.
    */
  // apply alignment
  const applyAlignment = () => {
    allBlocks.map(block => {
      const blockInlineStyles = block.inlineStyleRanges;
      // check if it contains alignment
      var alignPosition;
      console.log(blockInlineStyles);

      // the alignments in the whole block
      const alignments = blockInlineStyles.filter(
        styleRange => styleRange.style.slice(0, 12) === "__TEXT_ALIGN"
      );

      // // check
      // var alingment = alignments[alignments.length - 1];
      // // console.log(alignments);

      // // if there are blocks with alignment
      if (alignments.length > 0) {
        // replace alignment
        switch (alignments[0].style.slice(19)) {
          default:
            return "align-left";
          case "left":
            alignPosition = "align-left";
            break;
          case "center":
            alignPosition = "align-center";
            break;
          case "right":
            alignPosition = "align-right";
            break;
          case "justify":
            alignPosition = "align-justify";
            break;
        }

        const blockNode = [...allBlockNodes].find(
          blockNode =>
            blockNode.getAttribute("data-offset-key").split("-")[0] ===
            block.key
        );
        // const classes = blockNode.classList;
        // classes.add(alignPosition);

        if (blockNode) {
          const classes = blockNode.classList;

          // remove previously added (default has only two classes, so remove 3rd)
          if (classes.length > 2) {
            // console.log(classes, alignPosition);
            classes.remove(classes[2]);
          }
          classes.add(alignPosition);

          // console.log(blockNode.classList);
        }
      }
    });
  };

  // alignment
  const onAlignClick = alignment => {
    // don't blur the editor
    // e.preventDefault();
    // const selection = editorState.getSelection();
    // if (!selection) {
    //   /**
    //    * WORKAROUND ALERT!!
    //    * we are using the inline styles array to keey a record of the applied aligments. Hence we are only using the last applied alignment (every new alignment is appended not a replacement).abs
    //    *
    //    * simulate a selection on the entire block and toggle the alignment;
    //    * 1. get all the inline tyle ranges on the block
    //    * 2. get the offset of the first range and offset+length (lenth of block = this value-offset of first) of the last.
    //    * 3. create a new selection state with the block's key as the anchor and focus key, the achor offset is the offset of the first range (aka start of block) and the focus offset is the length of the last block
    //    *  4. update editor state with selection
    //    */

    //   // const anchorKey = editorState.getSelection().getAnchorKey();
    //   // const block = allBlocks.find(block => block.key === anchorKey);
    //   // const blockInlineStyles = block.inlineStyleRanges;

    //   // if (blockInlineStyles.length > 0) {
    //   //   const blockOffset = blockInlineStyles[0].offset;
    //   //   const lastRange = blockInlineStyles[blockInlineStyles.length - 1];
    //   //   const lengthOfBlock = lastRange.length + lastRange.offset - blockOffset;

    //   //   // selection
    //   //   const selection = new SelectionState({
    //   //     anchorKey: block.key,
    //   //     anchorOffset: blockOffset,
    //   //     focusKey: block.key,
    //   //     focusOffset: lengthOfBlock
    //   //   });

    //     // update editor state with selection
    //     setEditorState(EditorState.acceptSelection(editorState, selection));
    //   }
    // }

    // grab the style to toggle from the clicked element/btn
    // let alignment = e.currentTarget.getAttribute("alignment");

    // toggleInlineStyle(e);

    const newEditorState = styles.textAlign.toggle(editorState, `${alignment}`);
    setEditorState(newEditorState);
  };

  useEffect(() => {
    setTimeout(() => focus(), 0);

    return () => setRef(null);
  }, []);

  // useEffect(() => {
  //   applyAlignment();
  // });

  console.log(editorState.getCurrentInlineStyle().toArray());

  return (
    <div className="editor-wrapper">
      <Toolbar
        EditorState={EditorState}
        setEditorState={setEditorState}
        toggleInlineStyle={toggleInlineStyle}
        toggleBlockType={toggleBlockType}
        editorState={editorState}
        setImagePrompt={setImagePrompt}
        imagePrompt={imagePrompt}
        setLinkPrompt={setLinkPrompt}
        linkPrompt={linkPrompt}
        notePrompt={notePrompt}
        setNotePrompt={setNotePrompt}
        styles={styles}
        hasSelection={hasSelection}
        onAlignClick={onAlignClick}
        setRef={setRef}
        editorRef={editorRef}
        focus={focus}
        simulateSelection={simulateSelection}
      />
      <Editor
        placeholder="Start..."
        editorState={editorState}
        onChange={setEditorState}
        customStyleMap={styleMap}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFn}
        blockRendererFn={mediaBlockRenderer}
        plugins={plugins}
        customStyleFn={customStyleFn}
        ref={editorRef}
      />
      {imagePrompt && (
        <ImageEmbed
          editorState={editorState}
          setEditorState={setEditorState}
          EditorState={EditorState}
          setImagePrompt={setImagePrompt}
        />
      )}
      {linkPrompt && (
        <LinkEmbed
          editorState={editorState}
          EditorState={EditorState}
          setEditorState={setEditorState}
          linkPrompt={linkPrompt}
          setLinkPrompt={setLinkPrompt}
        />
      )}

      {notePrompt && (
        <NoteEmbed
          editorState={editorState}
          EditorState={EditorState}
          setEditorState={setEditorState}
          notePrompt={notePrompt}
          setNotePrompt={setNotePrompt}
        />
      )}
    </div>
  );
};

RichTEditor.propTypes = { editor: PropTypes.object.isRequired };

const mapStateToProps = state => ({
  editor: state.editor
});

export default connect(mapStateToProps, {})(RichTEditor);

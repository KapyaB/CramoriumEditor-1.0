import React, { useState, useEffect, createRef } from "react";
import { EditorState, RichUtils, Modifier, convertToRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createStyles from "draft-js-custom-styles";

import styleMap from "./inlineStyles";
import Toolbar from "./Toolbar";
import { mediaBlockRenderer } from "./entities/MediaBlock";
import linkPlugin from "./plugins/LinkPlugin";
import functions from "./functions";
import ImageEmbed from "./embeds/ImageEmbed";
import LinkEmbed from "./embeds/LinkEmbed";
import NoteEmbed from "./embeds/NoteEmbed";
import notePlugin from "./plugins/NotePlugin";

// plugins

const RichTEditor = () => {
  // the EditorState state. Creates an empty editor initially
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // inline styles. use a single method by setting a 'data-style attribute on th ebuttons
  const toggleInlineStyle = e => {
    // don't blur the editor
    e.preventDefault();

    // grab the style to toggle from the clicked element/btn
    let style = e.currentTarget.getAttribute("data-style");

    // remove previous font/color
    const selection = editorState.getSelection();

    if (style.slice(0, 5) === "font_" || style.charAt(0) === "#") {
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
      }
      // remove previous font/color
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

    // toggle the style. returns a new editor state
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  // blockstyles
  const toggleBlockType = e => {
    // don't blur editor
    e.preventDefault();

    let block = e.currentTarget.getAttribute("data-block");
    setEditorState(RichUtils.toggleBlockType(editorState, block));
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

  const editorRef = createRef();
  const focus = ref => {
    ref && ref.current && ref.current.focus();
  };

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

  const onAlignClick = alignment => {
    focus(editorRef);
    const newEditorState = styles.textAlign.toggle(editorState, `${alignment}`);
    setEditorState(newEditorState);
  };

  // apply alignment
  useEffect(() => {
    allBlocks.map(block => {
      const blockInlineStyles = block.inlineStyleRanges;

      // check if it contains alignment
      var alignPosition;
      const aligned = blockInlineStyles.filter(
        styleRange => styleRange.style.slice(0, 12) === "__TEXT_ALIGN"
      );

      // if there are blocks with alignment
      if (aligned.length > 0) {
        switch (aligned[0].style.slice(19)) {
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

        if (blockNode) {
          const classes = blockNode.classList;
          // remove previously added (default has only two classes, so remove 3rd)
          console.log(classes);
          if (classes.length > 2) {
            classes.remove(classes[2]);
            classes.add(alignPosition);
          }
          // add alignment class
          classes.add(alignPosition);
        }
      }
    });
    focus(editorRef);
  });

  useEffect(() => {
    focus(editorRef);
  }, []);
  // console.log(editorState.getCurrentInlineStyle().toArray());

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

RichTEditor.propTypes = {};

export default RichTEditor;

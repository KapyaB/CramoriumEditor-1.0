import React, { useState } from "react";
import { EditorState, RichUtils } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createStyles from "draft-js-custom-styles";

import styleMap from "./inlineStyles";
import Toolbar from "./Toolbar";
import "draft-js/dist/Draft.css";
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
  const customStylesToManage = ["font-size"];
  const { styles, customStyleFn } = createStyles(customStylesToManage, "_");

  const plugins = [linkPlugin, notePlugin];

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

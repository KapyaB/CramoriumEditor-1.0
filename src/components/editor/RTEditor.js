import React, { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  AtomicBlockUtils
} from "draft-js";

import styleMap from "./inlineStyles";
import Toolbar from "./Toolbar";
import "draft-js/dist/Draft.css";
import { mediaBlockRenderer } from "./entities/MediaBlock";

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
  const handleKeyCommand = (command, e) => {
    // 1. Defaults
    // returns a new instance of editorState
    var newEditorState = RichUtils.handleKeyCommand(editorState, command);
    // there are some ou-of-the-box draft command string like bold ctrl+b

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

    if (newEditorState) {
      setEditorState(newEditorState);
      return "handled";
    }

    return "not-handled";
  };

  //  for handling custome keyboard shortcuts
  const keyBindingFn = e => {
    // a keyboard event obj is passed
    // check if a certain key is pressed
    // hasCommandModifier checks the event for ctrl/cmd
    if (
      KeyBindingUtil.hasCommandModifier(e) &&
      e.shiftKey &&
      e.keyCode === 88 /* 'x' key */
    ) {
      // return command value as a string
      return "strikethrough";
    }

    // ctrl+shift+h - highlight
    if (
      KeyBindingUtil.hasCommandModifier(e) &&
      e.shiftKey &&
      e.keyCode === 72 /* 'h'*/
    ) {
      return "highlight";
    }

    // ctrl+tab change level
    if (e.keyCode === 9 /* 'tab' */) {
      return { cmd: "tab", e };
    }

    // to make sure we don’t break all the built-in key commands, if we don’t detect strikethrough, we want to make sure Draft.js still parses it and detects default commands.
    return getDefaultKeyBinding(e);
  };

  // image handling
  const [imagePrompt, setImagePrompt] = useState(false);
  const [imageState, setImageState] = useState({
    imageUrl: "",
    imageCaption: ""
  });

  const { imageUrl, imageCaption } = imageState;

  // convert to base64
  const getBase64 = file => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      setFileState({
        ...fileState,
        file: reader.result
      });
    };

    reader.onerror = function(error) {
      window.alert("Something went wrong with the image");
    };
  };

  // file input
  const [fileState, setFileState] = useState({
    file: null,
    fileName: "Choose file"
  });
  const { file, fileName } = fileState;

  const handleImageInputChange = e => {
    setImageState({
      ...imageState,
      [e.target.name]: e.target.value
    });
  };
  const onImageFileChange = e => {
    const newFile = e.target.files[0];
    newFile && getBase64(newFile);
    setFileState({
      ...fileState,
      fileName: newFile ? newFile.name : "Choose file"
    });
  };

  const clearForm = () => {
    setImagePrompt(false);
    setImageState({
      imageCaption: "",
      imageUrl: ""
    });
  };

  // submit image data
  const handleImageSubmit = e => {
    e.preventDefault();
    // compose form data
    const imageSrc = file || imageUrl;
    const imageData = {
      imageSrc,
      imageCaption
    };

    if (!imageData.imageSrc) {
      return window.alert("Please select an image");
    }
    clearForm();
    onAddImage(e, imageData);
  };

  // Functionality for embedding images
  const onAddImage = (e, imageData) => {
    e.preventDefault();
    const contentState = editorState.getCurrentContent();

    const { imageSrc, imageCaption } = imageData;
    // add entity to contentState
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      {
        src: imageSrc,
        caption: imageCaption
      }
    ); // these are the metadata made available to the Media component in the custom block renderer

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity },
      "create-entity"
    );
    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
    );
  };

  return (
    <div className="editor-wrapper">
      <Toolbar
        toggleInlineStyle={toggleInlineStyle}
        toggleBlockType={toggleBlockType}
        editorState={editorState}
        setImagePrompt={setImagePrompt}
        imagePrompt={imagePrompt}
      />
      <Editor
        placeholder="Start..."
        editorState={editorState}
        onChange={setEditorState}
        customStyleMap={styleMap}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFn}
        blockRendererFn={mediaBlockRenderer}
      />
      {imagePrompt && (
        <div className="image-form-container">
          <h2 className="form-head">Add image</h2>
          <form
            className="image-form"
            onSubmit={e => handleImageSubmit(e)}
            encType="multipart/form-data"
          >
            <div className="input-options-wrapper">
              <p className="input-hint">Pase a link or upload image</p>
              <div className="input-options"></div>
              <input
                name="imageUrl"
                placeholder="Image link"
                value={imageUrl}
                type="text"
                className="form-input image-url-input"
                onChange={e => handleImageInputChange(e)}
              />
              <label className="image-embed-btn" htmlFor="embed-image">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="embed-image"
                  className="btn"
                  onChange={e => {
                    onImageFileChange(e);
                  }}
                  style={{ width: "100%" }}
                />
              </label>
            </div>

            <input
              type="text"
              name="imageCaption"
              placeholder="Image caption"
              value={imageCaption}
              className="form-input image-caption-input"
              onChange={e => handleImageInputChange(e)}
            />
            <div className="form-btns">
              <button type="submit" className="green-btn">
                Add image
              </button>
              <button onClick={() => clearForm()} className="red-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

RichTEditor.propTypes = {};

export default RichTEditor;

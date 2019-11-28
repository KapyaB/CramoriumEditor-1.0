import React, { useState } from "react";
import PropTypes from "prop-types";
import { RichUtils } from "draft-js";

const LinkEmbed = ({
  editorState,
  EditorState,
  setEditorState,
  linkPrompt,
  setLinkPrompt
}) => {
  const [link, setLink] = useState("");
  const handleChange = e => {
    setLink(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onAddLink(link);
    setLinkPrompt(!linkPrompt);
  };

  const onAddLink = link => {
    const selection = editorState.getSelection();

    if (!link) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
      return "handled";
    }

    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link
    });

    // create new editorstate by pushing contentWithEntity and the command 'create-entity' to the current EditorState
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      "create-entity"
    );

    // set entity to selected range using RichUtils.toggleLink
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));
    return "handled";
  };
  return (
    <div className="link-form-wrapper">
      <button className="close-form" onClick={() => setLinkPrompt(false)}>
        x
      </button>
      <form onSubmit={e => handleSubmit(e)} className="link-form">
        <input
          type="text"
          className="form-input link-input"
          name="link"
          value={link}
          onChange={e => handleChange(e)}
          placeholder="Paste or type link..."
        />
        <input type="submit" className="submit-btn add-link" value="Add" />
      </form>
    </div>
  );
};

LinkEmbed.propTypes = {
  editorState: PropTypes.object.isRequired,
  EditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  linkPrompt: PropTypes.bool.isRequired,
  setLinkPrompt: PropTypes.func.isRequired
};

export default LinkEmbed;

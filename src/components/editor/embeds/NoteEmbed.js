import React, { useState } from "react";
import PropTypes from "prop-types";
import { RichUtils } from "draft-js";

const NoteEmbed = ({
  editorState,
  EditorState,
  setEditorState,
  notePrompt,
  setNotePrompt
}) => {
  const [note, setNote] = useState("");
  const [charRemaining, setCharRemaining] = useState(300);

  const handleChange = e => {
    setNote(e.target.value);
    setCharRemaining(300 - e.target.value.length);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onAddNote(note);
    setNotePrompt(!notePrompt);
  };

  const onAddNote = note => {
    const selection = editorState.getSelection();

    if (!note) {
      setEditorState(RichUtils.togglenote(editorState, selection, null));
      return "handled";
    }

    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity("NOTE", "MUTABLE", {
      note
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
    <div className="note-form-wrapper">
      <form onSubmit={e => handleSubmit(e)} className="note-form">
        <textarea
          name="note"
          className="note-input"
          cols="30"
          rows="5"
          maxLength="300"
          value={note}
          onChange={e => handleChange(e)}
          placeholder="Type a side note"
        />
        <input type="submit" className="submit-btn add-note" value="Add" />
        <small className="char-counter">{charRemaining}</small>
      </form>
    </div>
  );
};

NoteEmbed.propTypes = {
  editorState: PropTypes.object.isRequired,
  EditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  notePrompt: PropTypes.bool.isRequired,
  setNotePrompt: PropTypes.func.isRequired
};

export default NoteEmbed;

import React, { useState } from "react";

// strategy
export const noteStrategy = (contentBlock, callback, contentState) => {
  // find range of text noteed on
  contentBlock.findEntityRanges(char => {
    const entityKey = char.getEntity();
    // at thsi time the note entity is already defined
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "NOTE"
    );
  }, callback);
};

// component to render
export const Note = props => {
  const [showNote, setShowNote] = useState(false);
  const { contentState, entityKey } = props;
  // find entity and get the note
  const { note } = contentState.getEntity(entityKey).getData();

  // render noted on text
  return (
    <span
      className="with-note"
      title="click to view note"
      onClick={() => setShowNote(!showNote)}
      style={{ background: "#ccc" }}
    >
      {showNote && (
        <div className="note">
          <button className="close-note" onClick={() => setShowNote(false)}>
            x
          </button>
          {note}
        </div>
      )}
      {props.children}
    </span>
  );
};

const notePlugin = {
  decorators: [
    {
      strategy: noteStrategy,
      component: Note
    }
  ]
};

export default notePlugin;

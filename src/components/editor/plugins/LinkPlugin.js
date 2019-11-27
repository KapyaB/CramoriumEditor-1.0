import React from "react";

// Define a strategy that will be use to search for ranges of text that we want to make a link
export const linkStrategy = (contentBlock, callback, contentState) => {
  // find the continuous range of characters with which to associate the LINK entity
  contentBlock.findEntityRanges(char => {
    const entityKey = char.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

// Link component to render an a tag with the url as identified in the entity data
export const Link = props => {
  const { contentState, entityKey } = props;
  // find the entity in content state and get the url passed as data for that entity
  const { url } = contentState.getEntity(entityKey).getData();
  // render anchor tag
  return (
    <a
      className="link"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={url}
    >
      {props.children}
    </a>
  );
};

// create a keyBindingFn that returns 'add-link' if characters are selected and the key combination matches ctr/cmd+k
const linkPlugin = {
  // Define decorators, an array of objects defining relevant strategy and component with linkStrategy and Link, respectively.

  decorators: [
    {
      strategy: linkStrategy,
      component: Link
    }
  ]
};

export default linkPlugin;

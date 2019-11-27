import React from "react";

// rendering custom blocks relies on the blockRendererFn prop of Editor
export const mediaBlockRenderer = block => {
  if (block.getType() === "atomic") {
    return {
      component: Media,
      // props
      editable: false // customary for non-text blocks
    };
  }

  return null;
};

// the Image entity
const Image = props => {
  const { src, caption } = props;
  return src ? (
    <div className="embedded-image">
      <img src={src} alt={caption} className="image" />
      <small className="image-caption">{caption}</small>
    </div>
  ) : null;
};

// the media custom component
const Media = props => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));

  // image src and type
  const { src, caption } = entity.getData();
  const type = entity.getType();

  let media;
  if (type === "image") {
    // render image compononent
    media = <Image src={src} caption={caption} />;
  }

  return media;
};

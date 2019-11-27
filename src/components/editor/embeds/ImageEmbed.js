import React, { useState } from "react";
import { AtomicBlockUtils } from "draft-js";
import PropTypes from "prop-types";

const ImageEmbed = ({
  editorState,
  setEditorState,
  EditorState,
  setImagePrompt
}) => {
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
  const { file } = fileState;

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
  );
};

ImageEmbed.propTypes = {
  editorState: PropTypes.object.isRequired,
  setEditorState: PropTypes.func.isRequired,
  EditorState: PropTypes.func.isRequired,
  setImagePrompt: PropTypes.func.isRequired
};

export default ImageEmbed;

import React, { useState } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { connect } from "react-redux";
import * as apiCalls from "../api/apiCalls";
import ButtonWithProgress from "./ButtonWithProgress";
import Input from "./Input";

const RoastSubmit = (props) => {
  const [focused, setFocused] = useState(false);
  const [content, setContent] = useState(undefined);
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(undefined);
  const [image, setImage] = useState(undefined);

  const onChangeContent = (event) => {
    const value = event.target.value;
    setContent(value);
    setErrors({});
  };

  const onFileSelect = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setFile(file);
    };
    reader.readAsDataURL(file);
  };

  const onClickPost = () => {
    const body = {
      content: content,
    };
    setPendingApiCall(true);

    apiCalls
      .postRoast(body)
      .then((response) => {
        setFocused(false);
        setContent("");
        setPendingApiCall(false);
      })
      .catch((error) => {
        let updatedErrors = {};
        if (error.response.data && error.response.data.validationErrors) {
          updatedErrors = error.response.data.validationErrors;
        }
        setErrors(updatedErrors);
        setPendingApiCall(false);
      });
  };
  const onFocus = () => {
    setFocused(true);
  };
  const onClickCancel = () => {
    setFocused(false);
    setContent("");
    setErrors({});
    setImage(undefined);
    setFile(undefined);
  };

  let textAreaClassName = "form-control w-100";
  if (errors.content) {
    textAreaClassName += " is-invalid";
  }

  return (
    <div className="card d-flex flex-row p-1">
      <ProfileImageWithDefault
        className="rounded-circle m-1"
        width="32"
        height="32"
        image={props.loggedInUser.image}
      />
      <div className="flex-fill">
        <textarea
          className={textAreaClassName}
          rows={focused ? 3 : 1}
          onFocus={onFocus}
          value={content}
          onChange={onChangeContent}
        />
        {errors.content && (
          <span className="invalid-feedback">{errors.content}</span>
        )}
        {focused && (
          <div>
            <div className="pt-1">
              <Input type="file" onChange={onFileSelect} />
              {image && (
                <img
                  className="mt-1 img-thumbnail"
                  src={image}
                  alt="upload"
                  width="128"
                  height="64"
                />
              )}
            </div>
            <div className="text-right mt-1">
              <ButtonWithProgress
                className="btn btn-success"
                disabled={pendingApiCall}
                onClick={onClickPost}
                pendingApiCall={pendingApiCall}
                text="Post"
              />
              <button
                className="btn btn-light ml-1"
                onClick={onClickCancel}
                disabled={pendingApiCall}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// RoastSubmit.defaultProps = defaultProps;

const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};
export default connect(mapStateToProps)(RoastSubmit);

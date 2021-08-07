import React, { Component, useState } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { connect } from "react-redux";
import * as apiCalls from "../api/apiCalls";
import ButtonWithProgress from "./ButtonWithProgress";

const RoastSubmit = (props) => {
  const [focused, setFocused] = useState(false);
  const [content, setContent] = useState(undefined);
  const [pendingApiCall, setPendingApiCall] = useState(false);

  const onChangeContent = (event) => {
    const value = event.target.value;
    setContent(value);
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
        setPendingApiCall(false);
      });
  };
  const onFocus = () => {
    setFocused(true);
  };
  const onClickCancel = () => {
    setFocused(false);
    setContent("");
  };
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
          className="form-control w-100"
          rows={focused ? 3 : 1}
          onFocus={onFocus}
          value={content}
          onChange={onChangeContent}
        />
        {focused && (
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

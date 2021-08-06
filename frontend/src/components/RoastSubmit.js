import React, { Component, useState } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { connect } from "react-redux";

const RoastSubmit = (props) => {
  const [focused, setFocused] = useState(false);
  const onFocus = () => {
    setFocused(true);
  };
  const onClickCancel = () => {
    setFocused(false);
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
        />
        {focused && (
          <div className="text-right mt-1">
            <button className="btn btn-success">Post</button>
            <button
              className="btn btn-light ml-1"
              onClickCancel={onClickCancel}
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

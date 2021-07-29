import React from "react";

const ButtonWithProgess = (props) => {
  return (
    <button
      className="btn btn-primary"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.pendingApiCall && (
        <div className="spinner-border text-light spinner-border-sm mr-sm-1">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {props.text}
    </button>
  );
};

export default ButtonWithProgess;

import React from "react";
import ButtonWithProgress from "./ButtonWithProgress";

const Modal = (props) => {
  const {
    title,
    visible,
    body,
    okButtonText,
    cancelButtonText,
    onClickOk,
    onClickCancel,
    pendingApiCall,
  } = props;

  let rootClass = "modal fade";
  let rootStyle;
  if (visible) {
    rootClass += " d-block show";
    rootStyle = { backgroundColor: "#000000b0" };
  }
  return (
    <div className={rootClass} style={rootStyle} data-testid="modal-root">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">{body}</div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClickCancel}
              disabled={pendingApiCall}
            >
              {cancelButtonText}
            </button>
            <ButtonWithProgress
              className="btn btn-danger"
              onClick={onClickOk}
              disabled={pendingApiCall}
              pendingApiCall={pendingApiCall}
              text={okButtonText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.defaultProps = {
  okButtonText: "Ok",
  cancelButtonText: "Cancel",
};

export default Modal;

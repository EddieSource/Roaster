import React from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const RoastView = (props) => {
  const { roast } = props;
  const { user, date } = roast;
  const { username, displayName, image } = user;
  const relativeData = format(date);
  const attachmentImageVisible =
    roast.attachment && roast.attachment.fileType.startsWith("image");

  const ownedByLoggedinUser = user.id === props.loggedInUser.id;

  return (
    <div className="card p-1">
      <div className="d-flex">
        <Link to={`/${username}`}>
          <ProfileImageWithDefault
            className="rounded-circle"
            width="32"
            height="32"
            image={props.roast.user.image}
          />
        </Link>

        <div className="flex-fill m-auto pl-2">
          <Link to={`/${username}`} className="list-group-item-action">
            <h6 className="d-inline">
              {displayName}@{username}
            </h6>
          </Link>

          <span className="text-black-50"> - </span>
          <span>{relativeData}</span>
          {ownedByLoggedinUser && (
            <button className="btn btn-outline-danger btn-sm">Delete</button>
          )}
        </div>
      </div>
      <div className="pl-5">{props.roast.content}</div>
      {attachmentImageVisible && (
        <div className="pl-5">
          <img
            alt="attachment"
            src={`http://localhost:8080/images/attachment/${roast.attachment.name}`}
            className="img-fluid"
          />
        </div>
      )}
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};
export default connect(mapStateToProps)(RoastView);

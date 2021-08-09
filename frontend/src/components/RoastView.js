import React from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

const RoastView = (props) => {
  const { roast } = props;
  const { user, date } = roast;
  const { username, displayName, image } = user;
  const relativeData = format(date);
  const attachmentImageVisible =
    roast.attachment && roast.attachment.fileType.startsWith("image");

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
        </div>
      </div>
      <div className="pl-5">{props.roast.content}</div>
      {attachmentImageVisible && (
        <div className="pl-5">
          <img
            alt="attachment"
            src={`http://localhost:8080/images/attachments/${roast.attachment.name}`}
            className="img-fluid"
          />
        </div>
      )}
    </div>
  );
};
export default RoastView;

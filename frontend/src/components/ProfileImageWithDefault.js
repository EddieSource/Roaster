import React from "react";
import defaultPicture from "../assets/profile.png";

const ProfileImageWithDefault = (props) => {
  let imageSource = defaultPicture;
  if (props.image) {
    imageSource = `http://localhost:8080/images/profile/${props.image}`;
  }
  return (
    //eslint-disable-next-line
    <img
      {...props}
      src={props.src || imageSource}
      onError={(event) => {
        event.target.src = defaultPicture;
        // target will give us the event's component
      }}
    />
  );
};

export default ProfileImageWithDefault;

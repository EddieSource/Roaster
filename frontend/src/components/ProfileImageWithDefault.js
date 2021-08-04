import React from "react";
import defaultPicture from "../assets/profile.png";

const ProfileImageWithDefault = (props) => {
  let imageSource = defaultPicture;
  console.log("1stImageSource", imageSource);
  if (props.image) {
    imageSource = `/images/profile/${props.image}`;
  }
  console.log("2ndImageSource", imageSource);
  return (
    //eslint-disable-next-line
    <img
      {...props}
      src={props.src || imageSource}
      onError={(event) => {
        console.log("errr");
        event.target.src = defaultPicture;
        // target will give us the event's component
      }}
    />
  );
};

export default ProfileImageWithDefault;

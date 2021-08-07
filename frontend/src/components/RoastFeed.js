import React, { useEffect } from "react";
import * as apiCalls from "../api/apiCalls";

const RoastFeed = (props) => {
  useEffect(() => {
    const loadRoasts = () => {
      apiCalls.loadRoasts(props.user).then((response) => {});
    };
    loadRoasts();
  }, [props.user]);

  return (
    <div className="card card-header text-center">There are no roasts</div>
  );
};

RoastFeed.defaultProps = {};

export default RoastFeed;

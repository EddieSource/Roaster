import React, { useEffect, useState } from "react";
import * as apiCalls from "../api/apiCalls";
import Spinner from "./Spinner";

const RoastFeed = (props) => {
  const [page, setPage] = useState({ content: [] });
  const [isLoadingRoasts, setLoadingRoasts] = useState(false);

  useEffect(() => {
    const loadRoasts = () => {
      setLoadingRoasts(true);
      apiCalls.loadRoasts(props.user).then((response) => {
        setPage(response.data);
        setLoadingRoasts(false);
      });
    };
    loadRoasts();
  }, [props.user]);

  if (isLoadingRoasts) {
    return <Spinner />;
  }

  if (page.content.length === 0) {
    return (
      <div className="card card-header text-center">There are no roasts</div>
    );
  }
  return (
    <div>
      {page.content.map((roast) => {
        return <span key={roast.id}>{roast.content}</span>;
      })}
    </div>
  );
};

RoastFeed.defaultProps = {};

export default RoastFeed;

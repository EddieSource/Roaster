import React, { useEffect, useState } from "react";
import * as apiCalls from "../api/apiCalls";
import Spinner from "./Spinner";
import RoastView from "./RoastView";

const RoastFeed = (props) => {
  const [page, setPage] = useState({ content: [] });
  const [isLoadingRoasts, setLoadingRoasts] = useState(false);
  const [newRoastCount, setNewRoastCount] = useState(0);
  const [isLoadingNewRoasts, setIsLoadingNewRoasts] = useState(false);
  const [isLoadingOldRoasts, setIsLoadingOldRoasts] = useState(false);

  useEffect(() => {
    const checkCount = () => {
      const roasts = page.content;
      let topRoastId = 0;
      if (roasts.length > 0) {
        topRoastId = roasts[0].id;
      }
      apiCalls.loadNewRoastCount(topRoastId, props.user).then((response) => {
        setNewRoastCount(response.data.count);
      });
    };
    const counter = setInterval(checkCount, 3000);
    return () => {
      // clean all the listener when component unmounted
      clearInterval(counter);
    };
  }, [props.user, page.content]);

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

  const onClickLoadMore = () => {
    const roasts = page.content;
    if (roasts.length === 0) return;
    const roastAtBottom = roasts[roasts.length - 1];
    setIsLoadingOldRoasts(true);
    apiCalls
      .loadOldRoasts(roastAtBottom.id, props.user)
      .then((response) => {
        const updatedPage = { ...page };
        updatedPage.content = [
          ...updatedPage.content,
          ...response.data.content,
        ];
        updatedPage.last = response.data.last;
        setPage(updatedPage);
        setIsLoadingOldRoasts(false);
      })
      .catch((error) => {
        setIsLoadingOldRoasts(false);
      });
  };

  const onClickLoadNew = () => {
    if (isLoadingNewRoasts) {
      return;
    }
    const roasts = page.content;
    let topRoastId = 0;
    if (roasts.length > 0) {
      topRoastId = roasts[0].id;
    }
    setIsLoadingNewRoasts(true);
    apiCalls
      .loadNewRoasts(topRoastId, props.user)
      .then((response) => {
        setPage((previousPage) => ({
          ...previousPage,
          content: [...response.data, ...previousPage.content],
        }));
        setIsLoadingNewRoasts(false);
        setNewRoastCount(0);
      })
      .catch((error) => {
        setIsLoadingNewRoasts(false);
      });
  };

  if (isLoadingRoasts) {
    return <Spinner />;
  }

  if (page.content.length === 0 && newRoastCount === 0) {
    return (
      <div className="card card-header text-center">There are no roasts</div>
    );
  }

  const newRoastCountMessage =
    newRoastCount === 1
      ? "There is 1 new roast"
      : `There are ${newRoastCount} new roasts`;

  return (
    <div>
      {newRoastCount > 0 && (
        <div
          className="card card-header text-center"
          onClick={isLoadingNewRoasts ? undefined : onClickLoadNew}
          style={{ cursor: isLoadingNewRoasts ? "not-allowed" : "pointer" }}
        >
          {isLoadingNewRoasts ? <Spinner /> : newRoastCountMessage}
        </div>
      )}
      {page.content.map((roast) => {
        return <RoastView key={roast.id} roast={roast} />;
      })}
      {page.last === false && (
        <div
          className="card card-header text-content"
          onClick={isLoadingOldRoasts ? undefined : onClickLoadMore}
          style={{ cursor: isLoadingOldRoasts ? "not-allowed" : "pointer" }}
        >
          {isLoadingOldRoasts ? <Spinner /> : "Load More"}
        </div>
      )}
      {page.last === true && (
        <div className="card card-header text-center">
          There are no more roasts
        </div>
      )}
    </div>
  );
};

RoastFeed.defaultProps = {};

export default RoastFeed;

import React, { useEffect, useState } from "react";
import * as apiCalls from "../api/apiCalls";
import ProfileCard from "../components/ProfileCard";
import { connect } from "react-redux";

const UserPage = (props) => {
  const [user, setUser] = useState(undefined);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);

  console.log(user);

  useEffect(() => {
    const loadUser = () => {
      const username = props.match.params.username;
      if (!username) {
        return;
      }
      setUserNotFound(false);
      setIsLoadingUser(true);
      apiCalls
        .getUser(username)
        .then((response) => {
          setUser({ ...response.data });
          setIsLoadingUser(false);
        })
        .catch((error) => {
          setUserNotFound(true);
          setIsLoadingUser(false);
        });
    };
    loadUser();
  }, [props.match.params.username]);

  const onClickEdit = () => {
    setInEditMode(true);
  };

  const onClickCancel = () => {
    setInEditMode(false);
  };

  let pageContent;

  if (isLoadingUser) {
    pageContent = (
      <div className="d-flex">
        <div className="spinner-border text-black-50 m-auto">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  } else if (userNotFound) {
    pageContent = (
      <div className="alert alert-danger text-center">
        <h5>User not found</h5>
      </div>
    );
  } else {
    const isEditable =
      props.loggedInUser.username === props.match.params.username;
    pageContent = user && (
      <ProfileCard
        user={user}
        isEditable={isEditable}
        inEditMode={inEditMode}
        onClickEdit={onClickEdit}
        onClickCancel={onClickCancel}
      />
    );
  }
  return <div data-testid="userpage">{pageContent}</div>;
};

UserPage.defaultProps = {
  match: {
    params: {},
  },
};

const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};
export default connect(mapStateToProps)(UserPage);

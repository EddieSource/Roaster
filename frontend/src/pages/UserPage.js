import React, { useEffect, useState } from "react";
import * as apiCalls from "../api/apiCalls";
import ProfileCard from "../components/ProfileCard";
import { connect } from "react-redux";

const UserPage = (props) => {
  const [user, setUser] = useState(undefined);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [originalDisplayName, setOriginalDisplayName] = useState(undefined);
  const [pendingUpdateCall, setPendingUpdateCall] = useState(false);

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
    if (originalDisplayName !== undefined) {
      setUser({ ...user, displayName: originalDisplayName });
    }
    setInEditMode(false);
    setOriginalDisplayName(undefined);
  };

  const onClickSave = () => {
    const userId = props.loggedInUser.id;
    const userUpdate = {
      displayName: user.displayName,
    };
    setPendingUpdateCall(true);
    apiCalls
      .updateUser(userId, userUpdate)
      .then((respond) => {
        setInEditMode(false);
        setOriginalDisplayName(undefined);
        setPendingUpdateCall(false);
      })
      .catch((error) => {
        setPendingUpdateCall(false);
      });
  };

  const onChangeDisplayName = (event) => {
    if (originalDisplayName === undefined) {
      setOriginalDisplayName(user.displayName);
    }
    setUser({ ...user, displayName: event.target.value });
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
        onClickSave={onClickSave}
        onChangeDisplayName={onChangeDisplayName}
        pendingUpdateCall={pendingUpdateCall}
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

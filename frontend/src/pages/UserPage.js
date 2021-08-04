import React, { useEffect, useState } from "react";
import * as apiCalls from "../api/apiCalls";
import ProfileCard from "../components/ProfileCard";
import { connect } from "react-redux";

const UserPage = (props) => {
  const [user, setUser] = useState();
  const [userNotFound, setUserNotFound] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [originalDisplayName, setOriginalDisplayName] = useState();
  const [pendingUpdateCall, setPendingUpdateCall] = useState(false);
  const [image, setImage] = useState();

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
          setUser(response.data);
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
    const updatedUser = { ...user };
    if (originalDisplayName !== undefined) {
      updatedUser.displayName = originalDisplayName;
    }
    setUser(updatedUser);
    setOriginalDisplayName();
    setInEditMode(false);
    setImage();
  };

  const onClickSave = () => {
    const userId = props.loggedInUser.id;
    const userUpdate = {
      displayName: user.displayName,
      image: image && image.split(",")[1],
    };
    setPendingUpdateCall(true);
    apiCalls
      .updateUser(userId, userUpdate)
      .then((response) => {
        const updatedUser = { ...user };
        updatedUser.image = response.data.image;

        setUser(updatedUser);
        setInEditMode(false);
        setOriginalDisplayName();
        setImage();
        setPendingUpdateCall(false);
      })
      .catch((error) => {
        setPendingUpdateCall(false);
      });
  };

  const onChangeDisplayName = (event) => {
    const updatedUser = { ...user };
    if (originalDisplayName === undefined) {
      setOriginalDisplayName(user.displayName);
    }
    updatedUser.displayName = event.target.value;
    setUser(updatedUser);
  };

  const onFileSelect = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
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
        loadedImage={image}
        onFileSelect={onFileSelect}
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

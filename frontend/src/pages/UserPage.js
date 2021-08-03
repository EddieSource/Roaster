import React, { useEffect, useState } from "react";
import * as apiCalls from "../api/apiCalls";

const UserPage = (props) => {
  const [user, setUser] = useState(undefined);
  const [userNotFound, setUserNotFound] = useState(false);

  console.log(user);

  useEffect(() => {
    const loadUser = () => {
      setUserNotFound(false);
      const username = props.match.params.username;
      if (!username) {
        return;
      }
      apiCalls
        .getUser(username)
        .then((response) => {
          setUser({ ...response.data });
        })
        .catch((error) => {
          setUserNotFound(true);
        });
    };
    loadUser();
  }, [props.match.params.username]);

  if (userNotFound) {
    return (
      <div className="alert alert-danger text-center">
        <h5>User not found</h5>
      </div>
    );
  }
  return (
    <div data-testid="userpage">
      {user && <span>{`${user.displayName}@${user.username}`}</span>}
    </div>
  );
};

UserPage.defaultProps = {
  match: {
    params: {},
  },
};

export default UserPage;

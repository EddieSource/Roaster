import React, { useEffect, useState } from "react";
import * as apiCalls from "../api/apiCalls";

const UserPage = (props) => {
  const [user, setUser] = useState(undefined);
  console.log(user);

  useEffect(() => {
    const loadUser = () => {
      const username = props.match.params.username;
      if (!username) {
        return;
      }
      apiCalls.getUser(username).then((response) => {
        setUser({ ...response.data });
      });
    };
    loadUser();
  }, [props.match.params.username]);

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

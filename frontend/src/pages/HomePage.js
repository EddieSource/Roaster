import React from "react";
import UserList from "../components/UserList";
import RoastSubmit from "../components/RoastSubmit";

const HomePage = () => {
  return (
    <div data-testid="homepage">
      <div className="row">
        <div className="col-8">
          <RoastSubmit />
        </div>
        <div className="col-4">
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

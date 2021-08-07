import React from "react";
import UserList from "../components/UserList";
import RoastSubmit from "../components/RoastSubmit";
import { connect } from "react-redux";
import RoastFeed from "../components/RoastFeed";

const HomePage = (props) => {
  return (
    <div data-testid="homepage">
      <div className="row">
        <div className="col-8">
          {props.loggedInUser.isLoggedIn && <RoastSubmit />}
          <RoastFeed />
        </div>
        <div className="col-4">
          <UserList />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};
export default connect(mapStateToProps)(HomePage);

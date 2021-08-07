import React from "react";
import UserList from "../components/UserList";
import RoastSubmit from "../components/RoastSubmit";
import { connect } from "react-redux";

const HomePage = (props) => {
  return (
    <div data-testid="homepage">
      <div className="row">
        <div className="col-8">
          {props.loggedInUser.isLoggedIn && <RoastSubmit />}
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

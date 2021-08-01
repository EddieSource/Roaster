import React from "react";
import logo from "../assets/roaster-logo.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const TopBar = (props) => {
  const onClickLogOut = () => {
    const action = {
      type: "logout-success",
    };
    props.dispatch(action);
  };

  let links = (
    <ul className="nav navbar-nav ml-auto">
      <li className="nav-item">
        <Link to="/signup" className="nav-link">
          Sign Up
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </li>
    </ul>
  );
  if (props.user.isLoggedIn) {
    links = (
      <ul className="nav navbar-nav ml-auto">
        <li
          className="nav-item nav-link"
          onClick={onClickLogOut}
          style={{ cursor: "pointer" }}
        >
          Logout
        </li>
        <li className="nav-item">
          <Link to={`/${props.user.username}`} className="nav-link">
            My Profile
          </Link>
        </li>
      </ul>
    );
  }
  return (
    <div className="bg-white shadow-sm mb-2">
      <div className="container">
        <nav className="navbar navbar-light navbar-expand">
          <Link to="/" className="navbar-brand">
            <img src={logo} width="60" alt="Roaster" />
            Roaster
          </Link>
          {links}
        </nav>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};
export default connect(mapStateToProps)(TopBar);

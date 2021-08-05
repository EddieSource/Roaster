import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/roaster-logo.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ProfileImageWithDefault from "./ProfileImageWithDefault";

const TopBar = (props) => {
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const actionArea = useRef();

  useEffect(() => {
    // check if we click outside of the action area
    const onClickTracker = (event) => {
      if (!actionArea.current) {
        setDropDownVisible(false);
        return;
      }
      if (dropDownVisible) {
        setDropDownVisible(false);
      } else if (actionArea.current.contains(event.target)) {
        setDropDownVisible(true);
      }
    };
    document.addEventListener("click", onClickTracker);
    return function cleanup() {
      document.removeEventListener("click", onClickTracker);
    };
  }, [actionArea, dropDownVisible]);

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
    let dropDownClass = "p-0 shadow dropdown-menu";
    if (dropDownVisible) {
      dropDownClass += " show";
    }
    links = (
      <ul className="nav navbar-nav ml-auto" ref={actionArea}>
        <li className="nav-item dropdown">
          <div className="d-flex" style={{ cursor: "pointer" }}>
            <ProfileImageWithDefault
              className="rounded-circle m-auto"
              width="32"
              height="32"
              image={props.user.image}
            />
            <span className="nav-link dropdown-toggle">
              {props.user.displayName}
            </span>
          </div>
          <div className={dropDownClass} data-testid="drop-down-menu">
            <Link to={`/${props.user.username}`} className="dropdown-item">
              My Profile
            </Link>
            <span
              className="dropdown-item"
              onClick={onClickLogOut}
              style={{ cursor: "pointer" }}
            >
              Logout
            </span>
          </div>
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
            &nbsp; &nbsp; Roaster
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

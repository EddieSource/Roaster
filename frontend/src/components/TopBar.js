import React from "react";
import logo from "../assets/roaster-logo.png";
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="bg-white shadow-sm mb-2">
      <div className="container">
        <nav ClassName="navbar navbar-light navbar-expand">
          <Link to="/" className="navbar-brand">
            <img src={logo} width="60" alt="Roaster" />
            Roaster
          </Link>
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
        </nav>
      </div>
    </div>
  );
};

export default TopBar;

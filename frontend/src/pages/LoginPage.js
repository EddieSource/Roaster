import React, { useState } from "react";
import Input from "../components/Input";
import ButtonWithProgess from "../components/ButtonWithProgress";
import { connect } from "react-redux";
import * as authActions from "../redux/authActions";

export const LoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState(undefined);
  const [pendingApiCall, setPendingApiCall] = useState(false);

  const onChangeUsernmae = (e) => {
    setApiError(undefined);
    setUsername(e.target.value);
  };
  const onChangePassword = (e) => {
    setApiError(undefined);
    setPassword(e.target.value);
  };
  const onClickLogin = () => {
    const body = {
      username: username,
      password: password,
    };
    setPendingApiCall(true);
    props.actions
      .postLogin(body)
      .then((response) => {
        setPendingApiCall(false);
        props.history.push("/");
      })
      .catch((error) => {
        if (error.response) {
          setApiError(error.response.data.message);
          setPendingApiCall(false);
        }
      });
  };

  return (
    <div className="container">
      <h1 className="text-center">Login</h1>
      <div className="col-12 mb-3">
        <Input
          label="Username"
          placeholder="Your username"
          value={username}
          onChange={onChangeUsernmae}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="Password"
          placeholder="Your password"
          type="password"
          value={password}
          onChange={onChangePassword}
        />
      </div>
      {apiError && (
        <div className="col-12 mb-3">
          <div className="alert alert-danger">{apiError}</div>
        </div>
      )}
      <div className="text-center">
        <ButtonWithProgess
          className="btn btn-primary"
          onClick={onClickLogin}
          disabled={username === "" || password === "" || pendingApiCall}
          text="login"
          pendingApiCall={pendingApiCall}
        />
      </div>
    </div>
  );
};

LoginPage.defaultProps = {
  actions: {
    postLogin: () => new Promise((resolve, reject) => resolve({})),
  },
  dispatch: () => {},
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      postLogin: (body) => dispatch(authActions.loginHandler(body)),
    },
  };
};

export default connect(null, mapDispatchToProps)(LoginPage);

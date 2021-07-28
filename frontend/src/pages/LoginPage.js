import React, { useState } from "react";
import Input from "../components/Input";

const defaultProps = {
  actions: {
    postLogin: () => new Promise((resolve, reject) => resolve({})),
  },
};

const LoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState(undefined);

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
    props.actions.postLogin(body).catch((error) => {
      if (error.response) {
        setApiError(error.response.data.message);
      }
    });
  };

  let disableSubmit = false;

  if (username === "") {
    disableSubmit = true;
  }

  if (password === "") {
    disableSubmit = true;
  }

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
        <button
          className="btn btn-primary"
          onClick={onClickLogin}
          disabled={disableSubmit}
        >
          Login
        </button>
      </div>
    </div>
  );
};

LoginPage.defaultProps = defaultProps;

export default LoginPage;

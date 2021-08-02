import React, { useState } from "react";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { connect } from "react-redux";
import * as authActions from "../redux/authActions";

export const UserSignupPage = (props) => {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordRepeatConfirmed, setPasswordRepeatConfirmed] = useState(true);

  const onClickSignup = () => {
    const user = {
      // field is align with java
      username: username,
      displayName: displayName,
      password: password,
    };
    setPendingApiCall(true);
    props.actions
      .postSignup(user)
      .then((res) => {
        setPendingApiCall(false);
        props.history.push("/");
      })
      .catch((apiError) => {
        if (apiError.response.data && apiError.response.data.validationErrors) {
          setErrors({ ...apiError.response.data.validationErrors });
        }
        setPendingApiCall(false);
      });
  };

  let passwordRepeatError;
  if (password || passwordRepeat) {
    passwordRepeatError =
      password === passwordRepeat ? "" : "Does not match to password";
  }

  return (
    <div className="container">
      <h1 className="text-center">Sign Up</h1>
      <div className="col-12 mb-3">
        <Input
          label="Display Name"
          placeholder="Your display name"
          value={displayName}
          onChange={(input) => {
            setDisplayName(input.target.value);
            setErrors({ ...errors, displayName: undefined });
          }}
          hasError={errors.displayName && true}
          error={errors.displayName}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="Username"
          placeholder="Your username"
          value={username}
          onChange={(input) => {
            setUsername(input.target.value);
            setErrors({ ...errors, username: undefined });
          }}
          hasError={errors.username && true}
          error={errors.username}
        />
      </div>
      <div>{errors.username}</div>

      <div className="col-12 mb-3">
        <Input
          label="Password"
          placeholder="Your password"
          type="password"
          value={password}
          onChange={(input) => {
            setPassword(input.target.value);
            setPasswordRepeatConfirmed(passwordRepeat === input.target.value);
            setErrors({ ...errors, password: undefined });
          }}
          hasError={errors.password && true}
          error={errors.password}
        />
      </div>
      <div>{errors.password}</div>

      <div className="col-12 mb-3">
        <Input
          label="Password Repeat"
          placeholder="Repeat Your password"
          type="password"
          value={passwordRepeat}
          onChange={(input) => {
            setPasswordRepeat(input.target.value);
            setPasswordRepeatConfirmed(password === input.target.value);
          }}
          hasError={passwordRepeatError && true}
          error={passwordRepeatError}
        />
      </div>
      <div className="text-center">
        <ButtonWithProgress
          onClick={onClickSignup}
          disabled={pendingApiCall || !passwordRepeatConfirmed}
          pendingApiCall={pendingApiCall}
          text="Sign Up"
        />
      </div>
    </div>
  );
};

UserSignupPage.defaultProps = {
  actions: {
    postSignup: () =>
      new Promise((resolve, reject) => {
        resolve({});
      }),
  },
  history: {
    push: () => {},
  },
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      postSignup: (user) => dispatch(authActions.signupHandler(user)),
    },
  };
};
export default connect(null, mapDispatchToProps)(UserSignupPage);

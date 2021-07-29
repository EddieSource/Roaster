import logo from "./logo.svg";
import "./App.css";
import UserSignupPage from "./pages/UserSignupPage";
import * as apiCalls from "./api/apiCalls";
import LoginPage from "./pages/LoginPage";

const actions = {
  postSignup: apiCalls.signup,
  postLogin: apiCalls.login,
};

function App() {
  return (
    // <UserSignupPage actions = {actions}/>
    <LoginPage actions={actions} />
  );
}

export default App;

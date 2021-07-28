import logo from "./logo.svg";
import "./App.css";
import UserSignupPage from "./pages/UserSignupPage";
import * as apiCalls from "./api/apiCalls";
import LoginPage from "./pages/LoginPage";

const actions = {
  postSignup: apiCalls.signup,
};

function App() {
  return (
    // <UserSignupPage actions = {actions}/>
    <LoginPage />
  );
}

export default App;

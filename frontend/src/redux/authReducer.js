const initialState = {
  id: 0,
  username: "",
  displayName: "",
  image: "",
  password: "",
  isLoggedIn: false,
};
const authReducer = (state = initialState, action) => {
  if (action.type === "logout-success") {
    return { ...initialState };
  }
  return state;
};

export default authReducer;

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopBar from "./TopBar";
import authReducer from "../redux/authReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import * as authActions from "../redux/authActions";

const loggedInState = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true,
};

const initialState = {
  id: 0,
  username: "",
  displayName: "",
  image: "",
  password: "",
  isLoggedIn: false,
};

let store;
const setup = (state = initialState) => {
  store = createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    </Provider>
  );
};

describe("TopBar", () => {
  describe("Layout", () => {
    it("has link to home from logo", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image.parentElement.getAttribute("href")).toBe("/");
    });
    it("has link to logout when user logged in", () => {
      const { queryByText } = setup(loggedInState);
      const logoutLink = queryByText("Logout");
      expect(logoutLink).toBeInTheDocument();
    });
  });
  describe("Interactions", () => {
    it("adds show class to drop down menu when clicking username", () => {
      const { queryByText, queryByTestId } = setup(loggedInState);
      const displayName = queryByText("display1");
      fireEvent.click(displayName);
      const dropDownMenu = queryByTestId("drop-down-menu");
      expect(dropDownMenu).toHaveClass("show");
    });
    it("removes show class to drop down menu when clicking logout", () => {
      const { queryByText, queryByTestId } = setup(loggedInState);
      const displayName = queryByText("display1");
      fireEvent.click(displayName);

      fireEvent.click(queryByText("Logout"));

      store.dispatch(authActions.loginSuccess(loggedInState));

      const dropDownMenu = queryByTestId("drop-down-menu");
      expect(dropDownMenu).not.toHaveClass("show");
    });
  });
});

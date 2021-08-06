import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RoastSubmit from "./RoastSubmit";
import { Provider } from "react-redux";
import { createStore } from "redux";
import authReducer from "../redux/authReducer";

const defaultState = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true,
};

let store;

const setup = (state = defaultState) => {
  store = createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <RoastSubmit />
    </Provider>
  );
};

describe("RoastSubmit", () => {
  describe("Layout", () => {
    it("has textarea", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      expect(textArea).toBeInTheDocument();
    });
    it("has image", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
    });
    it("displays user image", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image.src).toContain("/images/profile/" + defaultState.image);
    });
  });
  describe("Interactions", () => {
    let textArea;
    const setupFocused = () => {
      const rendered = setup();
      textArea = rendered.container.querySelector("textarea");
      fireEvent.focus(textArea);
      return rendered;
    };

    it("displays 3 rows when focused to textarea", () => {
      setupFocused();
      expect(textArea.rows).toBe(3);
    });

    it("displays Post button when focused to textarea", () => {
      const { queryByText } = setupFocused();
      const postButton = queryByText("Post");
      expect(postButton).toBeInTheDocument();
    });

    it("displays Cancel button when focused to textarea", () => {
      const { queryByText } = setupFocused();
      const cancelButton = queryByText("Cancel");
      expect(cancelButton).toBeInTheDocument();
    });

    it("does not display Post button when not focused to textarea", () => {
      const { queryByText } = setup();
      const postButton = queryByText("Post");
      expect(postButton).not.toBeInTheDocument();
    });

    it("does not display Cancel button when not focused to textarea", () => {
      const { queryByText } = setup();
      const cancelButton = queryByText("Cancel");
      expect(cancelButton).not.toBeInTheDocument();
    });
  });
});

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import RoastSubmit from "./RoastSubmit";
import { Provider } from "react-redux";
import { createStore } from "redux";
import authReducer from "../redux/authReducer";
import * as apiCalls from "../api/apiCalls";

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

    it("displays Post button when focused to textarea", () => {
      const { queryByText } = setupFocused();
      const postButton = queryByText("Post");
      expect(postButton).toBeInTheDocument();
    });

    it("does not display Post button when not focused to textarea", () => {
      const { queryByText } = setup();
      const postButton = queryByText("Post");
      expect(postButton).not.toBeInTheDocument();
    });
    it("returns back to unfocused state after clicking the cancel", () => {
      const { queryByText } = setupFocused();
      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);
      expect(queryByText("Cancel")).not.toBeInTheDocument();
    });
    it("disables Post button when there is postRoast api call", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test roast content" } });

      const postButton = queryByText("Post");

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postRoast = mockFunction;
      fireEvent.click(postButton);

      fireEvent.click(postButton);
      expect(mockFunction).toHaveBeenCalledTimes(1);
    });
    it("clears validation error after content is changed", async () => {
      const { queryByText, findByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test roast content" } });

      const postButton = queryByText("Post");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postRoast = mockFunction;
      fireEvent.click(postButton);
      const error = await findByText(
        "It must have minimum 10 and maximum 5000 characters"
      );

      fireEvent.change(textArea, {
        target: { value: "Test roast content updated" },
      });

      expect(error).not.toBeInTheDocument();
    });
    it("calls postRoast with roast with file attachment object when clicking Post", async () => {
      apiCalls.postRoastFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png",
        },
      });
      const { queryByText, container } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test roast content" } });

      const uploadInput = container.querySelector("input");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const images = container.querySelectorAll("img");
        expect(images.length).toBe(2);
      });

      const postButton = queryByText("Post");

      apiCalls.postRoast = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);

      expect(apiCalls.postRoast).toHaveBeenCalledWith({
        content: "Test roast content",
        attachment: {
          id: 1,
          name: "random-name.png",
        },
      });
    });

    it("calls postRoast without file attachment after cancelling previous file selection", async () => {
      apiCalls.postRoastFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png",
        },
      });
      const { queryByText, container } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test roast content" } });

      const uploadInput = container.querySelector("input");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const images = container.querySelectorAll("img");
        expect(images.length).toBe(2);
      });
      fireEvent.click(queryByText("Cancel"));
      fireEvent.focus(textArea);

      const postButton = queryByText("Post");

      apiCalls.postRoast = jest.fn().mockResolvedValue({});
      fireEvent.change(textArea, { target: { value: "Test roast content" } });
      fireEvent.click(postButton);

      expect(apiCalls.postRoast).toHaveBeenCalledWith({
        content: "Test roast content",
      });
    });
  });
});

console.error = () => {};

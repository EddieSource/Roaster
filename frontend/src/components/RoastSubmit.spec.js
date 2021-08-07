import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
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
    it("returns back to unfocused state after clicking the cancel", () => {
      const { queryByText } = setupFocused();
      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);
      expect(queryByText("Cancel")).not.toBeInTheDocument();
    });
    it("calls postRoast with roast request object when clicking Post", () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test roast content" } });

      const postButton = queryByText("Post");

      apiCalls.postRoast = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);

      expect(apiCalls.postRoast).toHaveBeenCalledWith({
        content: "Test roast content",
      });
    });
    it("returns back to unfocused state after successful postRoast action", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test roast content" } });

      const roastifyButton = queryByText("Post");

      apiCalls.postRoast = jest.fn().mockResolvedValue({});
      fireEvent.click(roastifyButton);

      await waitFor(() => {
        expect(queryByText("Post")).not.toBeInTheDocument();
      });
    });
    it("clear content after successful postRoast action", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test roast content" } });

      const postButton = queryByText("Post");

      apiCalls.postRoast = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);

      await waitFor(() => {
        expect(queryByText("Test roast content")).not.toBeInTheDocument();
      });
    });
    it("clears content after clicking cancel", () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test roast content" } });

      fireEvent.click(queryByText("Cancel"));

      expect(queryByText("Test roast content")).not.toBeInTheDocument();
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
    it("disables Cancel button when there is postRoast api call", async () => {
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

      const cancelButton = queryByText("Cancel");
      expect(cancelButton).toBeDisabled();
    });
    it("displays spinner when there is postRoast api call", async () => {
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

      expect(queryByText("Loading...")).toBeInTheDocument();
    });
    it("enables Post button when postRoast api call fails", async () => {
      const { queryByText } = setupFocused();
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

      await waitFor(() => {
        expect(queryByText("Post")).not.toBeDisabled();
      });
    });
    it("enables Cancel button when postRoast api call fails", async () => {
      const { queryByText } = setupFocused();
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

      await waitFor(() => {
        expect(queryByText("Cancel")).not.toBeDisabled();
      });
    });
    it("enables Post button after successful postRoast action", async () => {
      const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: "Test roast content" } });

      const postButton = queryByText("Post");

      apiCalls.postRoast = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);
      await waitForElementToBeRemoved(postButton);
      fireEvent.focus(textArea);
      await waitFor(() => {
        expect(queryByText("Post")).not.toBeDisabled();
      });
    });
    it("displays validation error for content", async () => {
      const { queryByText } = setupFocused();
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

      await waitFor(() => {
        expect(
          queryByText("It must have minimum 10 and maximum 5000 characters")
        ).toBeInTheDocument();
      });
    });
    it("clears validation error after clicking cancel", async () => {
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

      fireEvent.click(queryByText("Cancel"));

      expect(error).not.toBeInTheDocument();
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
  });
});

console.error = () => {};

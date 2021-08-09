import React from "react";
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  describe("Layout", () => {
    it("has input for username", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const usernameInput = queryByPlaceholderText("Your username");
      expect(usernameInput).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput.type).toBe("password");
    });
  });
  describe("Interactions", () => {
    const changeEvent = (content) => {
      return {
        target: {
          value: content,
        },
      };
    };

    let usernameInput, passwordInput, button;

    const setupForSubmit = (props) => {
      const rendered = render(<LoginPage {...props} />);
      const { container, queryByPlaceholderText } = rendered;
      usernameInput = queryByPlaceholderText("Your username");
      fireEvent.change(usernameInput, changeEvent("my-user-name"));
      passwordInput = queryByPlaceholderText("Your password");
      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      button = container.querySelector("button");
      return rendered;
    };

    it("sets the username value into state", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const usernameInput = queryByPlaceholderText("Your username");
      fireEvent.change(usernameInput, changeEvent("my-user-name"));
      expect(usernameInput).toHaveValue("my-user-name");
    });

    it("sets the password value into state", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      expect(passwordInput).toHaveValue("P4ssword");
    });

    it("calls postLogin when the actions are provided in props and input fields have value", () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };
      setupForSubmit({ actions });
      fireEvent.click(button);
      expect(actions.postLogin).toHaveBeenCalledTimes(1);
    });

    it("does not throw exception when clicking the button when actions not provided in props", () => {
      setupForSubmit();
      fireEvent.click(button);

      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("calls postLogin with credentials in body", () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };
      setupForSubmit({ actions });
      fireEvent.click(button);

      const expectedUserObject = {
        username: "my-user-name",
        password: "P4ssword",
      };

      expect(actions.postLogin).toHaveBeenCalledWith(expectedUserObject);
    });

    it("clears alert when user changes username", async () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };
      const { findByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const alert = await findByText("Login failed");
      fireEvent.change(usernameInput, changeEvent("updated-username"));

      expect(alert).not.toBeInTheDocument();
    });

    it("clears alert when user changes password", async () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };
      const { findByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const alert = await findByText("Login failed");
      fireEvent.change(passwordInput, changeEvent("updated-P4ssword"));

      expect(alert).not.toBeInTheDocument();
    });

    it("redirects to homePage after successful login", async () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };
      const history = {
        push: jest.fn(),
      };
      const { queryByText } = setupForSubmit({ actions, history });
      fireEvent.click(button);

      await waitForElementToBeRemoved(() => queryByText("Loading..."));

      expect(history.push).toHaveBeenCalledWith("/");
    });
  });
});
console.error = () => {};

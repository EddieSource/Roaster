import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserSignupPage from "./UserSignupPage";

describe("UserSignupPage", () => {
  describe("Layout", () => {
    it("has header of Sign up", () => {
      const { container } = render(<UserSignupPage />);
      const header = container.querySelector("h1");
      expect(header).toHaveTextContent("Sign Up");
    });
    it("has input for display name", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const displayNameInput = queryByPlaceholderText("Your display name");
      expect(displayNameInput).toBeInTheDocument();
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

    const mockAsyncDelayed = () => {
      return jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
    };
    let button, displayNameInput, usernameInput, passwordInput, passwordRepeat;

    const setupForSubmit = (props) => {
      // set up all the user field for test use
      const rendered = render(<UserSignupPage {...props} />);
      const { container, queryByPlaceholderText } = rendered;

      displayNameInput = queryByPlaceholderText("Your display name");
      usernameInput = queryByPlaceholderText("Your username");
      passwordInput = queryByPlaceholderText("Your password");
      passwordRepeat = queryByPlaceholderText("Repeat Your password");

      fireEvent.change(displayNameInput, changeEvent("test-name"));
      fireEvent.change(usernameInput, changeEvent("test-username"));
      fireEvent.change(passwordInput, changeEvent("test-password"));
      fireEvent.change(passwordRepeat, changeEvent("test-password"));

      button = container.querySelector("button");
      return rendered;
    };

    it("sets the displayName value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const displayNameInput = queryByPlaceholderText("Your display name");
      console.log("success");
      fireEvent.change(displayNameInput, changeEvent("my-display-name"));
      expect(displayNameInput).toHaveValue("my-display-name");
    });
    it("sets the username value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const usernameInput = queryByPlaceholderText("Your password");
      console.log("success");
      fireEvent.change(usernameInput, changeEvent("my-username"));
      expect(usernameInput).toHaveValue("my-username");
    });
    it("sets the password value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const passwordInput = queryByPlaceholderText("Your display name");
      console.log("success");
      fireEvent.change(passwordInput, changeEvent("my-password"));
      expect(passwordInput).toHaveValue("my-password");
    });
    it("sets the password repeat value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignupPage />);
      const cpasswordInput = queryByPlaceholderText("Repeat Your password");
      console.log("success");
      fireEvent.change(cpasswordInput, changeEvent("my-password"));
      expect(cpasswordInput).toHaveValue("my-password");
    });

    it("calls postSignup when the fields are valid and the actions are provided in props", () => {
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce({}),
      };
      setupForSubmit({ actions });

      fireEvent.click(button);
      expect(actions.postSignup).toHaveBeenCalledTimes(1);
    });

    it("it does not throw exceptions when clicking signup button", () => {
      setupForSubmit();
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it("calls post with user body when the fields are valid", () => {
      const actions = {
        postSignup: jest.fn().mockResolvedValueOnce({}),
      };
      setupForSubmit({ actions });

      fireEvent.click(button);
      const expectedUserObject = {
        username: "test-username",
        displayName: "test-name",
        password: "test-password",
      };
      expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
    });

    it("does not allow user to click the Sign Up button when there is ongoing api call", () => {
      const actions = {
        postSignup: mockAsyncDelayed(),
      };
      setupForSubmit({ actions });

      fireEvent.click(button);
      fireEvent.click(button);

      expect(actions.postSignup).toHaveBeenCalledTimes(1);
    });

    // it('displays validation error for displayName when error is received for the field', async() => {
    //     const actions = {postSignup:jest.fn().mockRejectedValue({
    //         response: {
    //             data: {
    //                 validationErrors: {
    //                     displayName: "must not be null"
    //                 }
    //             }
    //         }
    //     })}
    //     const { queryByText } = setupForSubmit({ actions })
    //     fireEvent.click(button)

    //     const errorMessage = await waitFor(() => queryByText('must not be null'))
    //     console.log(errorMessage)
    //     expect(errorMessage).toBeInTheDocument()

    // })

    it("enables the signup button when password and repeat password have same value", () => {
      setupForSubmit();
      expect(button).not.toBeDisabled();
    });

    it("disables the signup button when password repeat does not match to password", () => {
      setupForSubmit();
      fireEvent.change(passwordRepeat, changeEvent("new-pass"));
      expect(button).toBeDisabled();
    });

    it("disables the signup button when password does not match to password repeat", () => {
      setupForSubmit();
      fireEvent.change(passwordInput, changeEvent("new-pass"));
      expect(button).toBeDisabled();
    });

    it("displays error style for password repeat input when password repeat mismatch", () => {
      const { queryByText } = setupForSubmit();
      fireEvent.change(passwordRepeat, changeEvent("new-pass"));
      const mismatchWarning = queryByText("Does not match to password");
      expect(mismatchWarning).toBeInTheDocument();
    });

    it("displays error style for password repeat input when password input mismatch", () => {
      const { queryByText } = setupForSubmit();
      fireEvent.change(passwordInput, changeEvent("new-pass"));
      const mismatchWarning = queryByText("Does not match to password");
      expect(mismatchWarning).toBeInTheDocument();
    });

    it("hides the validation error when user changes the content of displayName", async () => {
      const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                displayName: "Cannot be null",
              },
            },
          },
        }),
      };
      const { findByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const errorMessage = await findByText("Cannot be null");
      fireEvent.change(displayNameInput, changeEvent("name updated"));

      expect(errorMessage).not.toBeInTheDocument();
    });

    // it("hides the validation error when user changes the content of username", async () => {
    //   const actions = {
    //     postSignup: jest.fn().mockRejectedValue({
    //       response: {
    //         data: {
    //           validationErrors: {
    //             username: "Username cannot be null",
    //           },
    //         },
    //       },
    //     }),
    //   };
    //   const { findByText } = setupForSubmit({ actions });
    //   fireEvent.click(button);

    //   const errorMessage = await findByText("Username cannot be null");
    //   fireEvent.change(usernameInput, changeEvent("name updated"));

    //   expect(errorMessage).not.toBeInTheDocument();
    // });
    // it("hides the validation error when user changes the content of password", async () => {
    //   const actions = {
    //     postSignup: jest.fn().mockRejectedValue({
    //       response: {
    //         data: {
    //           validationErrors: {
    //             password: "Cannot be null",
    //           },
    //         },
    //       },
    //     }),
    //   };
    //   const { findByText } = setupForSubmit({ actions });
    //   fireEvent.click(button);

    //   const errorMessage = await findByText("Cannot be null");
    //   fireEvent.change(passwordInput, changeEvent("updated-password"));

    //   expect(errorMessage).not.toBeInTheDocument();
    // });
  });
});

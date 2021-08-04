import React from "react";
import { render, fireEvent } from "@testing-library/react";
import UserPage from "./UserPage";
import * as apiCalls from "../api/apiCalls";
import { Provider } from "react-redux";
import configureStore from "../redux/configureStore";
import axios from "axios";

const mockSuccessGetUser = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};

const mockFailGetUser = {
  response: {
    data: {
      message: "User not found",
    },
  },
};

const mockSuccessUpdateUser = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1-update",
    image: "profile1-update.png",
  },
};

const match = {
  params: {
    username: "user1",
  },
};

const setUserOneLoggedInStorage = () => {
  localStorage.setItem(
    "roaster-auth",
    JSON.stringify({
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
      password: "P4ssword",
      isLoggedIn: true,
    })
  );
};

const setup = (props) => {
  const store = configureStore(false);
  return render(
    <Provider store={store}>
      {" "}
      <UserPage {...props} />{" "}
    </Provider>
  );
};

beforeEach(() => {
  localStorage.clear();
  delete axios.defaults.headers.common["Authorization"];
});

describe("UserPage", () => {
  describe("Layout", () => {
    it("has root page div", () => {
      const { queryByTestId } = setup();
      const userPageDiv = queryByTestId("userpage");
      expect(userPageDiv).toBeInTheDocument();
    });
    it("displays the displayName@username when user data loaded", async () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const { findByText } = setup({ match });
      const text = await findByText("display1@user1");
      expect(text).toBeInTheDocument();
    });
    it("displays not found alert when user not found", async () => {
      apiCalls.getUser = jest.fn().mockRejectedValue(mockFailGetUser);
      const { findByText } = setup({ match });
      const alert = await findByText("User not found");
      expect(alert).toBeInTheDocument();
    });
    it("displays spinner while loading user data", () => {
      const mockDelayedResponse = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetUser);
          }, 300);
        });
      });
      apiCalls.getUser = mockDelayedResponse;
      const { queryAllByText } = setup({ match });
      const spinners = queryAllByText("Loading...");
      expect(spinners.length).not.toBe(0);
    });
    it("displays the edit button when loggedInUser matches to user in url", async () => {
      setUserOneLoggedInStorage();
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const { queryByText, findByText } = setup({ match });
      await findByText("display1@user1");
      const editButton = queryByText("Edit");
      expect(editButton).toBeInTheDocument();
    });
  });
  describe("Lifecycle", () => {
    it("calls getUser when it is rendered", () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({ match });
      expect(apiCalls.getUser).toHaveBeenCalledTimes(1);
    });
    it("calls getUser for user1 when it is rendered with user1 in match", () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({ match });
      expect(apiCalls.getUser).toHaveBeenCalledWith("user1");
    });
  });

  describe("ProfileCard Interactions", () => {
    const setupForEdit = async () => {
      setUserOneLoggedInStorage();
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const rendered = setup({ match });
      const editButton = await rendered.findByText("Edit");
      fireEvent.click(editButton);
      return rendered;
    };
    const mockDelayedUpdateSuccess = () => {
      return jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessUpdateUser);
          }, 300);
        });
      });
    };
    it("displays edit layout when clicking edit button", async () => {
      const { queryByText } = await setupForEdit();
      expect(queryByText("Save")).toBeInTheDocument();
    });
    it("returns back to none edit mode after clicking cancel", async () => {
      const { queryByText } = await setupForEdit();

      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);

      expect(queryByText("Edit")).toBeInTheDocument();
    });
    it("calls updateUser api when clicking save", async () => {
      const { queryByRole } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      expect(apiCalls.updateUser).toHaveBeenCalledTimes(1);
    });
    it("calls updateUser api with user id", async () => {
      const { queryByRole } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      const userId = apiCalls.updateUser.mock.calls[0][0];

      expect(userId).toBe(1);
    });
    it("calls updateUser api with request body having changed displayName", async () => {
      const { queryByRole, container } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const displayInput = container.querySelector("input");
      fireEvent.change(displayInput, { target: { value: "display1-update" } });

      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      const requestBody = apiCalls.updateUser.mock.calls[0][1];

      expect(requestBody.displayName).toBe("display1-update");
    });

    it("returns to non edit mode after successful updateUser api call", async () => {
      const { queryByRole, findByText } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      const editButtonAfterClickingSave = await findByText("Edit");

      expect(editButtonAfterClickingSave).toBeInTheDocument();
    });
  });
});

console.error = () => {};

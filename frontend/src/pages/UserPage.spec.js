import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import UserPage from "./UserPage";
import * as apiCalls from "../api/apiCalls";
import { Provider } from "react-redux";
import configureStore from "../redux/configureStore";
import axios from "axios";

apiCalls.loadRoasts = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

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

const mockFailUpdateUser = {
  response: {
    data: {
      validationErrors: {
        displayName: "It must have minimum 4 and maximum 255 characters",
        image: "Only PNG and JPG files are allowed",
      },
    },
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

let store;
const setup = (props) => {
  store = configureStore(false);
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
    it("displays not found alert when user not found", async () => {
      apiCalls.getUser = jest.fn().mockRejectedValue(mockFailGetUser);
      const { findByText } = setup({ match });
      const alert = await findByText("User not found");
      expect(alert).toBeInTheDocument();
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
    it("calls updateUser api when clicking save", async () => {
      const { queryByRole } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      expect(apiCalls.updateUser).toHaveBeenCalledTimes(1);
    });

    it("returns to non edit mode after successful updateUser api call", async () => {
      const { queryByRole, findByText } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      const editButtonAfterClickingSave = await findByText("Edit");

      expect(editButtonAfterClickingSave).toBeInTheDocument();
    });

    it("disables save button when there is updateUser api call", async () => {
      const { queryByRole } = await setupForEdit();
      apiCalls.updateUser = mockDelayedUpdateSuccess();

      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      expect(saveButton).toBeDisabled();
    });

    it("displays the selected image in edit mode", async () => {
      const { container } = await setupForEdit();

      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const image = container.querySelector("img");
        expect(image.src).toContain("data:image/png;base64");
      });
    });
    it("does not throw error after file not selected", async () => {
      const { container } = await setupForEdit();
      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];
      expect(() =>
        fireEvent.change(uploadInput, { target: { files: [] } })
      ).not.toThrow();
    });
    it("calls updateUser api with request body having new image without data:image/png;base64", async () => {
      const { queryByRole, container } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const image = container.querySelector("img");
        expect(image.src).toContain("data:image/png;base64");
      });
      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      const requestBody = apiCalls.updateUser.mock.calls[0][1];

      expect(requestBody.image).not.toContain("data:image/png;base64");
    });

    it("returns to last updated image when image is change for another time but cancelled", async () => {
      const { queryByText, container, queryByRole, findByText } =
        await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const image = container.querySelector("img");
        expect(image.src).toContain("data:image/png;base64");
      });
      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      const editButtonAfterClickingSave = await findByText("Edit");
      fireEvent.click(editButtonAfterClickingSave);

      const newFile = new File(["another content"], "example2.png", {
        type: "image/png",
      });

      fireEvent.change(uploadInput, { target: { files: [newFile] } });

      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);
      const image = container.querySelector("img");
      expect(image.src).toContain("/images/profile/profile1-update.png");
    });
    it("shows validation error for file when update api fails", async () => {
      const { queryByRole, findByText } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser);

      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      const errorMessage = await findByText(
        "Only PNG and JPG files are allowed"
      );
      expect(errorMessage).toBeInTheDocument();
    });
    it("removes validation error for file when user changes the file", async () => {
      const { container, queryByRole, findByText } = await setupForEdit();
      apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser);

      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      const errorMessage = await findByText(
        "Only PNG and JPG files are allowed"
      );

      const fileInput = container.querySelectorAll("input")[1];

      const newFile = new File(["another content"], "example2.png", {
        type: "image/png",
      });
      fireEvent.change(fileInput, { target: { files: [newFile] } });

      await waitFor(() => {
        expect(errorMessage).not.toBeInTheDocument();
      });
    });
    it("updates redux state after updateUser api call success", async () => {
      const { queryByRole, container } = await setupForEdit();
      let displayInput = container.querySelector("input");
      fireEvent.change(displayInput, { target: { value: "display1-update" } });
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      await waitForElementToBeRemoved(saveButton);
      const storedUserData = store.getState();
      expect(storedUserData.displayName).toBe(
        mockSuccessUpdateUser.data.displayName
      );
      expect(storedUserData.image).toBe(mockSuccessUpdateUser.data.image);
    });
    it("updates localStorage after updateUser api call success", async () => {
      const { queryByRole, container } = await setupForEdit();
      let displayInput = container.querySelector("input");
      fireEvent.change(displayInput, { target: { value: "display1-update" } });
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      await waitForElementToBeRemoved(saveButton);
      const storedUserData = JSON.parse(localStorage.getItem("roaster-auth"));
      expect(storedUserData.displayName).toBe(
        mockSuccessUpdateUser.data.displayName
      );
      expect(storedUserData.image).toBe(mockSuccessUpdateUser.data.image);
    });
  });
});

console.error = () => {};

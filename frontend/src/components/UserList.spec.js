import React from "react";
import { render, fireEvent } from "@testing-library/react";
import UserList from "./UserList";
import * as apiCalls from "../api/apiCalls";
import { MemoryRouter } from "react-router-dom";

apiCalls.listUsers = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

const setup = () => {
  return render(
    <MemoryRouter>
      <UserList />
    </MemoryRouter>
  );
};

const mockedEmptySuccessResponse = {
  data: {
    content: [],
    number: 0,
    size: 3,
  },
};

const mockSuccessGetSinglePage = {
  data: {
    content: [
      {
        username: "user1",
        displayName: "display1",
        image: "",
      },
      {
        username: "user2",
        displayName: "display2",
        image: "",
      },
      {
        username: "user3",
        displayName: "display3",
        image: "",
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 3,
    totalPages: 1,
  },
};

const mockSuccessGetMultiPageFirst = {
  data: {
    content: [
      {
        username: "user1",
        displayName: "display1",
        image: "",
      },
      {
        username: "user2",
        displayName: "display2",
        image: "",
      },
      {
        username: "user3",
        displayName: "display3",
        image: "",
      },
    ],
    number: 0,
    first: true,
    last: false,
    size: 3,
    totalPages: 2,
  },
};

const mockSuccessGetMultiPageLast = {
  data: {
    content: [
      {
        username: "user4",
        displayName: "display4",
        image: "",
      },
    ],
    number: 1,
    first: false,
    last: true,
    size: 3,
    totalPages: 2,
  },
};

const mockFailGet = {
  response: {
    data: {
      message: "Load error",
    },
  },
};

describe("UserList", () => {
  describe("Layout", () => {
    it("displays the next button when response has last value as false", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetMultiPageFirst);
      const { findByText } = setup();
      const nextLink = await findByText("next >");
      expect(nextLink).toBeInTheDocument();
    });
    it("hides the previous button when response has first value as true", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetMultiPageFirst);
      const { findByText } = setup();
      const previous = await findByText("< previous");
      expect(previous).not.toBeInTheDocument();
    });
  });
  describe("Lifecycle", () => {
    it("calls listUsers api when it is rendered", () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockedEmptySuccessResponse);
      setup();
      expect(apiCalls.listUsers).toHaveBeenCalledTimes(1);
    });
    it("calls listUsers method with page zero and size three", () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockedEmptySuccessResponse);
      setup();
      expect(apiCalls.listUsers).toHaveBeenCalledWith({ page: 0, size: 3 });
    });
  });
  describe("Interactions", () => {
    it("loads next page when clicked to next button", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValueOnce(mockSuccessGetMultiPageFirst)
        .mockResolvedValueOnce(mockSuccessGetMultiPageLast);
      const { findByText } = setup();
      const nextLink = await findByText("next >");
      fireEvent.click(nextLink);

      const secondPageUser = await findByText("display4@user4");

      expect(secondPageUser).toBeInTheDocument();
    });
    it("loads previous page when clicked to previous button", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValueOnce(mockSuccessGetMultiPageLast)
        .mockResolvedValueOnce(mockSuccessGetMultiPageFirst);
      const { findByText } = setup();
      const previousLink = await findByText("< previous");
      fireEvent.click(previousLink);

      const firstPageUser = await findByText("display1@user1");
      expect(firstPageUser).toBeInTheDocument();
    });
    it("hides error message when successfully loading other page", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValueOnce(mockSuccessGetMultiPageLast)
        .mockRejectedValueOnce(mockFailGet)
        .mockResolvedValueOnce(mockSuccessGetMultiPageFirst);
      const { findByText } = setup();
      const previousLink = await findByText("< previous");
      fireEvent.click(previousLink);
      await findByText("User load failed");
      fireEvent.click(previousLink);
      const errorMessage = await findByText("User load failed");
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});

console.error = () => {};

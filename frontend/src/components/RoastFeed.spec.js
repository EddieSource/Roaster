import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import RoastFeed from "./RoastFeed";
import * as apiCalls from "../api/apiCalls";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../redux/authReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";

const loggedInStateUser1 = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true,
};

const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

let timedFunction;

const useFakeIntervals = () => {
  window.setInterval = (callback, interval) => {
    if (!callback.toString().startsWith("function")) {
      timedFunction = callback;
      return 111111;
    }
  };
  window.clearInterval = (id) => {
    if (id === 111111) {
      timedFunction = undefined;
    }
  };
};

const useRealIntervals = () => {
  window.setInterval = originalSetInterval;
  window.clearInterval = originalClearInterval;
};

const runTimer = () => {
  timedFunction && timedFunction();
};

const setup = (props, state = loggedInStateUser1) => {
  const store = createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <RoastFeed {...props} />
      </MemoryRouter>
    </Provider>
  );
};

const mockEmptyResponse = {
  data: {
    content: [],
  },
};

const mockSuccessGetNewRoastsList = {
  data: [
    {
      id: 21,
      content: "This is the latest roast",
      date: 1561294668539,
      user: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    },
  ],
};

const mockSuccessGetRoastsFirstOfMultiPage = {
  data: {
    content: [
      {
        id: 10,
        content: "This is the latest roast",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
      {
        id: 9,
        content: "This is roast 9",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: false,
    size: 5,
    totalPages: 2,
  },
};

const mockSuccessGetRoastsLastOfMultiPage = {
  data: {
    content: [
      {
        id: 1,
        content: "This is the oldest roast",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 2,
  },
};

describe("RoastFeed", () => {
  describe("Lifecycle", () => {
    it("calls loadRoasts with user parameter when it is rendered with user property", () => {
      apiCalls.loadRoasts = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup({ user: "user1" });
      expect(apiCalls.loadRoasts).toHaveBeenCalledWith("user1");
    });
    it("displays new roast count constantly", async () => {
      useFakeIntervals();
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { findByText } = setup({ user: "user1" });
      await findByText("This is the latest roast");
      runTimer();
      await findByText("There is 1 new roast");
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 2 } });
      runTimer();
      const newRoastCount = await findByText("There are 2 new roasts");
      expect(newRoastCount).toBeInTheDocument();
      useRealIntervals();
    });
  });
  describe("Layout", () => {
    it("displays no roast message when the response has empty page", async () => {
      apiCalls.loadRoasts = jest.fn().mockResolvedValue(mockEmptyResponse);
      const { findByText } = setup();
      const message = await findByText("There are no roasts");
      expect(message).toBeInTheDocument();
    });
  });
  describe("Interactions", () => {
    it("calls loadOldRoasts with roast id and username when clicking Load More when rendered with user property", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadOldRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsLastOfMultiPage);
      const { findByText } = setup({ user: "user1" });
      const loadMore = await findByText("Load More");
      fireEvent.click(loadMore);
      expect(apiCalls.loadOldRoasts).toHaveBeenCalledWith(9, "user1");
    });
    it("hides Load More when loadOldRoasts api call returns last page", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadOldRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsLastOfMultiPage);
      const { findByText } = setup();
      const loadMore = await findByText("Load More");
      fireEvent.click(loadMore);
      await waitFor(() => {
        expect(loadMore).not.toBeInTheDocument();
      });
    });
    it("calls loadNewRoasts with roast id and username when clicking New Roast Count Card", async () => {
      useFakeIntervals();
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewRoastsList);
      const { findByText } = setup({ user: "user1" });
      await findByText("This is the latest roast");
      runTimer();
      const newRoastCount = await findByText("There is 1 new roast");
      fireEvent.click(newRoastCount);
      expect(apiCalls.loadNewRoasts).toHaveBeenCalledWith(10, "user1");
      useRealIntervals();
    });
    it("displays modal with information about the action", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { container, queryByText, findByText } = setup();
      await findByText("This is the latest roast");
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);

      const message = queryByText(
        `Are you sure to delete 'This is the latest roast'?`
      );
      expect(message).toBeInTheDocument();
    });
    it("calls deleteRoast api with roast id when delete button is clicked on modal", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteRoast = jest.fn().mockResolvedValue({});
      const { container, queryByText, findByText } = setup();
      await findByText("This is the latest roast");
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteRoastButton = queryByText("Delete Roast");
      fireEvent.click(deleteRoastButton);
      expect(apiCalls.deleteRoast).toHaveBeenCalledWith(10);
    });
    it("removes the deleted roast from document after successful deleteRoast api call", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteRoast = jest.fn().mockResolvedValue({});
      const { container, queryByText, findByText } = setup();
      await findByText("This is the latest roast");
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteRoastButton = queryByText("Delete Roast");
      fireEvent.click(deleteRoastButton);
      await waitFor(() => {
        const deletedRoastContent = queryByText("This is the latest roast");
        expect(deletedRoastContent).not.toBeInTheDocument();
      });
    });
  });
});

console.error = () => {};

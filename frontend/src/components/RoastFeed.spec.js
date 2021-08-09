import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import RoastFeed from "./RoastFeed";
import * as apiCalls from "../api/apiCalls";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../redux/authReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
import * as authActions from "../redux/authActions";

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

const mockSuccessGetRoastsMiddleOfMultiPage = {
  data: {
    content: [
      {
        id: 5,
        content: "This roast is in middle page",
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
    first: false,
    last: false,
    size: 5,
    totalPages: 2,
  },
};

const mockSuccessGetRoastsSinglePage = {
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
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 1,
  },
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
    it("displays new roast count as 1 after loadNewRoastCount success when user does not have roasts initially", async () => {
      useFakeIntervals();
      apiCalls.loadRoasts = jest.fn().mockResolvedValue(mockEmptyResponse);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { findByText } = setup({ user: "user1" });
      await findByText("There are no roasts");
      runTimer();
      const newRoastCount = await findByText("There is 1 new roast");
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
    it("displays roast content", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsSinglePage);
      const { findByText } = setup();
      const roastContent = await findByText("This is the latest roast");
      expect(roastContent).toBeInTheDocument();
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
    it("displays loaded new roast when loadNewRoasts api call success", async () => {
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
      const newRoast = await findByText("This is the latest roast");

      expect(newRoast).toBeInTheDocument();
      useRealIntervals();
    });
    it("replaces Spinner with Load More after active api call for loadOldRoasts finishes error", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadOldRoasts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({ response: { data: {} } });
          }, 300);
        });
      });
      const { queryByText, findByText } = setup();
      const loadMore = await findByText("Load More");
      fireEvent.click(loadMore);
      const spinner = await findByText("Loading...");
      await waitForElementToBeRemoved(spinner);
      expect(queryByText("Loading...")).not.toBeInTheDocument();
      expect(queryByText("Load More")).toBeInTheDocument();
    });
    it("removes Spinner and There is 1 new roast after active api call for loadNewRoasts finishes with success", async () => {
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
      const { queryByText, findByText } = setup({ user: "user1" });
      await findByText("This is the latest roast");
      runTimer();
      const newRoastCount = await findByText("There is 1 new roast");
      fireEvent.click(newRoastCount);
      await findByText("This is the latest roast");
      expect(queryByText("Loading...")).not.toBeInTheDocument();
      expect(queryByText("There is 1 new roast")).not.toBeInTheDocument();
      useRealIntervals();
    });
    it("displays modal when clicking delete on roast", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByTestId, container, findByText } = setup();
      await findByText("This is the latest roast");
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);

      const modalRootDiv = queryByTestId("modal-root");
      expect(modalRootDiv).toHaveClass("modal fade d-block show");
    });
    it("hides modal when clicking cancel", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByTestId, container, queryByText, findByText } = setup();
      await findByText("This is the latest roast");
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);

      fireEvent.click(queryByText("Cancel"));

      const modalRootDiv = queryByTestId("modal-root");
      expect(modalRootDiv).not.toHaveClass("d-block show");
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
    it("hides modal after successful deleteRoast api call", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteRoast = jest.fn().mockResolvedValue({});
      const { container, queryByText, queryByTestId, findByText } = setup();
      await findByText("This is the latest roast");
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteRoastButton = queryByText("Delete Roast");
      fireEvent.click(deleteRoastButton);
      await waitFor(() => {
        const modalRootDiv = queryByTestId("modal-root");
        expect(modalRootDiv).not.toHaveClass("d-block show");
      });
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
    it("disables Modal Buttons when api call in progress", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteRoast = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      const { container, queryByText, findByText } = setup();
      await findByText("This is the latest roast");
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteRoastButton = queryByText("Delete Roast");
      fireEvent.click(deleteRoastButton);

      expect(deleteRoastButton).toBeDisabled();
      expect(queryByText("Cancel")).toBeDisabled();
    });
    it("displays spinner when api call in progress", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteRoast = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      const { container, queryByText, findByText } = setup();
      await findByText("This is the latest roast");
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteRoastButton = queryByText("Delete Roast");
      fireEvent.click(deleteRoastButton);
      const spinner = queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });
    it("hides spinner when api call finishes", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteRoast = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      const { container, queryByText, findByText } = setup();
      await findByText("This is the latest roast");
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteRoastButton = queryByText("Delete Roast");
      fireEvent.click(deleteRoastButton);
      await waitFor(() => {
        const spinner = queryByText("Loading...");
        expect(spinner).not.toBeInTheDocument();
      });
    });
  });
});

console.error = () => {};

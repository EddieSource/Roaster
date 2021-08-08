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

const setup = (props) => {
  return render(
    <MemoryRouter>
      <RoastFeed {...props} />
    </MemoryRouter>
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
    it("calls loadRoasts when it is rendered", () => {
      apiCalls.loadRoasts = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      expect(apiCalls.loadRoasts).toHaveBeenCalled();
    });
    it("calls loadRoasts with user parameter when it is rendered with user property", () => {
      apiCalls.loadRoasts = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup({ user: "user1" });
      expect(apiCalls.loadRoasts).toHaveBeenCalledWith("user1");
    });
    it("calls loadRoasts without user parameter when it is rendered without user property", () => {
      apiCalls.loadRoasts = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      const parameter = apiCalls.loadRoasts.mock.calls[0][0];
      expect(parameter).toBeUndefined();
    });
    it("displays new roast count as 1 after loadNewRoastCount success", async () => {
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
      const newRoastCount = await findByText("There is 1 new roast");
      expect(newRoastCount).toBeInTheDocument();
      useRealIntervals();
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
    it("does not call loadNewRoastCount after component is unmounted", async () => {
      useFakeIntervals();
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { findByText, unmount } = setup({ user: "user1" });
      await findByText("This is the latest roast");
      runTimer();
      await findByText("There is 1 new roast");
      unmount();
      expect(apiCalls.loadNewRoastCount).toHaveBeenCalledTimes(1);
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
    it("does not display no roast message when the response has page of roast", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsSinglePage);
      const { queryByText } = setup();
      const message = queryByText("There are no roasts");
      await waitFor(() => {
        expect(message).not.toBeInTheDocument();
      });
    });
    it("displays spinner when loading the roasts", async () => {
      apiCalls.loadRoasts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetRoastsSinglePage);
          }, 300);
        });
      });
      const { queryByText } = setup();
      expect(queryByText("Loading...")).toBeInTheDocument();
    });
    it("displays roast content", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsSinglePage);
      const { findByText } = setup();
      const roastContent = await findByText("This is the latest roast");
      expect(roastContent).toBeInTheDocument();
    });
    it("displays Load More when there are next pages", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      const { findByText } = setup();
      const loadMore = await findByText("Load More");
      expect(loadMore).toBeInTheDocument();
    });
  });
  describe("Interactions", () => {
    it("calls loadOldRoasts with roast id when clicking Load More", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadOldRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsLastOfMultiPage);
      const { findByText } = setup();
      const loadMore = await findByText("Load More");
      fireEvent.click(loadMore);
      const firstParam = apiCalls.loadOldRoasts.mock.calls[0][0];
      expect(firstParam).toBe(9);
    });
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
    it("displays loaded old roast when loadOldRoasts api call success", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadOldRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsLastOfMultiPage);
      const { findByText } = setup();
      const loadMore = await findByText("Load More");
      fireEvent.click(loadMore);
      const oldRoast = await findByText("This is the oldest roast");
      expect(oldRoast).toBeInTheDocument();
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
    // load new roasts
    it("calls loadNewRoasts with roast id when clicking New Roast Count Card", async () => {
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
      const { findByText } = setup();
      await findByText("This is the latest roast");
      runTimer();
      const newRoastCount = await findByText("There is 1 new roast");
      fireEvent.click(newRoastCount);
      const firstParam = apiCalls.loadNewRoasts.mock.calls[0][0];
      expect(firstParam).toBe(10);
      useRealIntervals();
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
    it("hides new roast count when loadNewRoasts api call success", async () => {
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
      const { findByText, queryByText } = setup({ user: "user1" });
      await findByText("This is the latest roast");
      runTimer();
      const newRoastCount = await findByText("There is 1 new roast");
      fireEvent.click(newRoastCount);
      await findByText("This is the latest roast");
      expect(queryByText("There is 1 new roast")).not.toBeInTheDocument();
      useRealIntervals();
    });
    it("replaces Load More with spinner when there is an active api call about it", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadOldRoasts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetRoastsLastOfMultiPage);
          }, 300);
        });
      });
      const { queryByText, findByText } = setup();
      const loadMore = await findByText("Load More");
      fireEvent.click(loadMore);
      const spinner = await findByText("Loading...");
      expect(spinner).toBeInTheDocument();
      expect(queryByText("Load More")).not.toBeInTheDocument();
    });
    it("replaces Spinner with Load More after active api call for loadOldRoasts finishes with middle page response", async () => {
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadOldRoasts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetRoastsMiddleOfMultiPage);
          }, 300);
        });
      });
      const { queryByText, findByText } = setup();
      const loadMore = await findByText("Load More");
      fireEvent.click(loadMore);
      await findByText("This roast is in middle page");
      expect(queryByText("Loading...")).not.toBeInTheDocument();
      expect(queryByText("Load More")).toBeInTheDocument();
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
    // loadNewRoasts
    it("replaces There is 1 new roast with spinner when there is an active api call about it", async () => {
      useFakeIntervals();
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewRoasts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetNewRoastsList);
          }, 300);
        });
      });
      const { queryByText, findByText } = setup();
      await findByText("This is the latest roast");
      runTimer();
      const newRoastCount = await findByText("There is 1 new roast");
      fireEvent.click(newRoastCount);
      const spinner = await findByText("Loading...");
      expect(spinner).toBeInTheDocument();
      expect(queryByText("There is 1 new roast")).not.toBeInTheDocument();
      useRealIntervals();
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
    it("replaces Spinner with There is 1 new roast after active api call for loadNewRoasts fails", async () => {
      useFakeIntervals();
      apiCalls.loadRoasts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetRoastsFirstOfMultiPage);
      apiCalls.loadNewRoastCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewRoasts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({ response: { data: {} } });
          }, 300);
        });
      });
      const { queryByText, findByText } = setup();
      await findByText("This is the latest roast");
      runTimer();
      const newRoastCount = await findByText("There is 1 new roast");
      fireEvent.click(newRoastCount);
      await findByText("Loading...");
      await waitFor(() => {
        expect(queryByText("Loading...")).not.toBeInTheDocument();
        expect(queryByText("There is 1 new roast")).toBeInTheDocument();
      });
      useRealIntervals();
    });
  });
});

console.error = () => {};

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

const mockEmptyResponse = {
  data: {
    content: [],
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

const setup = (props) => {
  return render(
    <MemoryRouter>
      <RoastFeed {...props} />
    </MemoryRouter>
  );
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
  });
});

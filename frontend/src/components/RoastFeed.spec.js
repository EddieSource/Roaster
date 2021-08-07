import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import RoastFeed from "./RoastFeed";
import * as apiCalls from "../api/apiCalls";

const mockEmptyResponse = {
  data: {
    content: [],
  },
};

const setup = (props) => {
  return render(<RoastFeed {...props} />);
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
  });
});

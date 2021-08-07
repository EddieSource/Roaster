import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RoastView from "./RoastView";
import { MemoryRouter } from "react-router-dom";

const loggedInStateUser1 = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true,
};

const roastWithoutAttachment = {
  id: 10,
  content: "This is the first roast",
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};

const setup = (roast = roastWithoutAttachment, state = loggedInStateUser1) => {
  const oneMinute = 60 * 1000;
  const date = new Date(new Date() - oneMinute);
  roast.date = date;
  return render(
    <MemoryRouter>
      <RoastView roast={roast} />
    </MemoryRouter>
  );
};

describe("RoastView", () => {
  describe("Layout", () => {
    it("displays roast content", () => {
      const { queryByText } = setup();
      expect(queryByText("This is the first roast")).toBeInTheDocument();
    });
    it("displays users image", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image.src).toContain("/images/profile/profile1.png");
    });
    it("displays displayName@user", () => {
      const { queryByText } = setup();
      expect(queryByText("display1@user1")).toBeInTheDocument();
    });
    it("displays relative time", () => {
      const { queryByText } = setup();
      expect(queryByText("1 minute ago")).toBeInTheDocument();
    });
    it("has link to user page", () => {
      const { container } = setup();
      const anchor = container.querySelector("a");
      expect(anchor.getAttribute("href")).toBe("/user1");
    });
  });
});

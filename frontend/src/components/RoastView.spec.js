import React from "react";
import { render } from "@testing-library/react";
import RoastView from "./RoastView";
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

const loggedInStateUser2 = {
  id: 2,
  username: "user2",
  displayName: "display2",
  image: "profile2.png",
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

const roastWithAttachment = {
  id: 10,
  content: "This is the first roast",
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
  attachment: {
    fileType: "image/png",
    name: "attached-image.png",
  },
};

const roastWithPdfAttachment = {
  id: 10,
  content: "This is the first roast",
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
  attachment: {
    fileType: "application/pdf",
    name: "attached.pdf",
  },
};

const setup = (roast = roastWithoutAttachment, state = loggedInStateUser1) => {
  const oneMinute = 60 * 1000;
  const date = new Date(new Date() - oneMinute);
  roast.date = date;
  const store = createStore(authReducer, state);

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <RoastView roast={roast} />
      </MemoryRouter>
    </Provider>
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
    it("displays relative time", () => {
      const { queryByText } = setup();
      expect(queryByText("1 minute ago")).toBeInTheDocument();
    });
    it("has link to user page", () => {
      const { container } = setup();
      const anchor = container.querySelector("a");
      expect(anchor.getAttribute("href")).toBe("/user1");
    });
    it("displays file attachment image", () => {
      const { container } = setup(roastWithAttachment);
      const images = container.querySelectorAll("img");
      expect(images.length).toBe(2);
    });
    it("does not displays file attachment when attachment type is not image", () => {
      const { container } = setup(roastWithPdfAttachment);
      const images = container.querySelectorAll("img");
      expect(images.length).toBe(1);
    });
    it("sets the attachment path as source for file attachment image", () => {
      const { container } = setup(roastWithAttachment);
      const images = container.querySelectorAll("img");
      const attachmentImage = images[1];
      expect(attachmentImage.src).toContain(
        "/images/attachment/" + roastWithAttachment.attachment.name
      );
    });
    it("does not display delete button when roast is not owned by logged in user", () => {
      const { container } = setup(roastWithoutAttachment, loggedInStateUser2);
      expect(container.querySelector("button")).not.toBeInTheDocument();
    });
  });
});

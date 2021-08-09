import React from "react";
import { render } from "@testing-library/react";
import ProfileCard from "./ProfileCard";

const user = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
};

describe("ProfileCard", () => {
  describe("Layout", () => {
    it("displays default image when user does not have one", () => {
      const userWithoutImage = {
        ...user,
        image: undefined,
      };
      const { container } = render(<ProfileCard user={userWithoutImage} />);
      const image = container.querySelector("img");
      expect(image.src).toContain("/profile.png");
    });
    it("displays the current displayName in input in edit mode", () => {
      const { container } = render(
        <ProfileCard user={user} inEditMode={true} />
      );
      const displayInput = container.querySelector("input");
      expect(displayInput.value).toBe(user.displayName);
    });
    it("displays file input when inEditMode property set as true", () => {
      const { container } = render(
        <ProfileCard user={user} inEditMode={true} />
      );
      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];
      expect(uploadInput.type).toBe("file");
    });
  });
});

console.error = () => {};

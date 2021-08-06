import React from "react";
import { render } from "@testing-library/react";
import RoastSubmit from "./RoastSubmit";

describe("RoastSubmit", () => {
  describe("Layout", () => {
    it("has textarea", () => {
      const { container } = render(<RoastSubmit />);
      const textArea = container.querySelector("textarea");
      expect(textArea).toBeInTheDocument();
    });
    it("has image", () => {
      const { container } = render(<RoastSubmit />);
      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
    });
  });
});

import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Input from "./Input";

describe("Layout", () => {
  it("displays placeholder when it is provided as prop", () => {
    const { container } = render(<Input placeholder="Test placeholder" />);
    const input = container.querySelector("input");
    expect(input.placeholder).toBe("Test placeholder");
  });

  it("has value for input when it is provided as prop", () => {
    const { container } = render(<Input value="Test value" />);
    const input = container.querySelector("input");
    expect(input.value).toBe("Test value");
  });

  it("displays the error text when it is provided", () => {
    const { queryByText } = render(
      <Input hasError={true} error="Cannot be null" />
    );
    expect(queryByText("Cannot be null")).toBeInTheDocument();
  });

  it("has form-control-file class when type is file", () => {
    const { container } = render(<Input type="file" />);
    const input = container.querySelector("input");
    expect(input.className).toBe("form-control-file");
  });
});

console.error = () => {};

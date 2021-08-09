import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import axios from "axios";
import configureStore from "../redux/configureStore";
import * as apiCalls from "../api/apiCalls";

apiCalls.listUsers = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

apiCalls.getUser = jest.fn().mockResolvedValue({
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
});

apiCalls.loadRoasts = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

const mockSuccessGetUser1 = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};

const mockSuccessGetUser2 = {
  data: {
    id: 2,
    username: "user2",
    displayName: "display2",
    image: "profile2.png",
  },
};

const mockFailGetUser = {
  response: {
    data: {
      message: "User not found",
    },
  },
};

beforeEach(() => {
  localStorage.clear();
  delete axios.defaults.headers.common["Authorization"];
});

const setup = (path) => {
  const store = configureStore(false);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

const changeEvent = (content) => {
  return {
    target: {
      value: content,
    },
  };
};

const setUserOneLoggedInStorage = () => {
  localStorage.setItem(
    "roaster-auth",
    JSON.stringify({
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
      password: "P4ssword",
      isLoggedIn: true,
    })
  );
};

describe("App", () => {
  it("shows the LoginPage when clicking login", () => {
    const { queryByText, container } = setup("/");
    const loginLink = queryByText("Login");
    fireEvent.click(loginLink);
    const header = container.querySelector("h1");
    expect(header).toHaveTextContent("Login");
  });

  it("displays My Profile on TopBar after login success", async () => {
    const { queryByPlaceholderText, container, findByText } = setup("/login");
    const usernameInput = queryByPlaceholderText("Your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = container.querySelector("button");
    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });
    fireEvent.click(button);

    const myProfileLink = await findByText("My Profile");
    expect(myProfileLink).toBeInTheDocument();
  });

  it("saves logged in user data to localStorage after login success", async () => {
    const { queryByPlaceholderText, container, findByText } = setup("/login");
    const usernameInput = queryByPlaceholderText("Your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = container.querySelector("button");
    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });
    fireEvent.click(button);

    await findByText("My Profile");
    const dataInStorage = JSON.parse(localStorage.getItem("roaster-auth"));
    expect(dataInStorage).toEqual({
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
      password: "P4ssword",
      isLoggedIn: true,
    });
  });

  it("displays logged in topBar when storage has logged in user data", () => {
    setUserOneLoggedInStorage();
    const { queryByText } = setup("/");
    const myProfileLink = queryByText("My Profile");
    expect(myProfileLink).toBeInTheDocument();
  });

  it("sets axios authorization with base64 encoded user credentials after login success", async () => {
    const { queryByPlaceholderText, container, findByText } = setup("/login");
    const usernameInput = queryByPlaceholderText("Your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = container.querySelector("button");
    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });
    fireEvent.click(button);

    await findByText("My Profile");
    const axiosAuthorization = axios.defaults.headers.common["Authorization"];

    const encoded = btoa("user1:P4ssword");
    const expectedAuthorization = `Basic ${encoded}`;
    expect(axiosAuthorization).toBe(expectedAuthorization);
  });

  it("sets axios authorization with base64 encoded user credentials when storage has logged in user data", () => {
    setUserOneLoggedInStorage();
    setup("/");
    const axiosAuthorization = axios.defaults.headers.common["Authorization"];
    const encoded = btoa("user1:P4ssword");
    const expectedAuthorization = `Basic ${encoded}`;
    expect(axiosAuthorization).toBe(expectedAuthorization);
  });

  it("removes axios authorization header when user logout", async () => {
    setUserOneLoggedInStorage();
    const { queryByText } = setup("/");
    fireEvent.click(queryByText("Logout"));

    const axiosAuthorization = axios.defaults.headers.common["Authorization"];
    expect(axiosAuthorization).toBeFalsy();
  });
});

console.error = () => {};

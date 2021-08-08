import axios from "axios";
import * as apiCalls from "./apiCalls";

describe("apiCalls", () => {
  describe("signup", () => {
    it("calls http://localhost:8080/api/1.0/users", () => {
      const mockSignup = jest.fn();
      axios.post = mockSignup;
      apiCalls.signup();

      const path = mockSignup.mock.calls[0][0];
      expect(path).toBe("http://localhost:8080/api/1.0/users");
    });
  });
  describe("login", () => {
    it("calls /api/1.0/login", () => {
      const mockLogin = jest.fn();
      axios.post = mockLogin;
      apiCalls.login({ username: "test-user", password: "P4ssword" });
      const path = mockLogin.mock.calls[0][0];
      expect(path).toBe("http://localhost:8080/api/1.0/login");
    });
  });

  describe("listUser", () => {
    it("calls /api/1.0/users?page=0&size=3 when no param provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers();
      expect(mockListUsers).toBeCalledWith(
        "http://localhost:8080/api/1.0/users?page=0&size=3"
      );
    });
    it("calls /api/1.0/users?page=5&size=10 when corresponding params provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers({ page: 5, size: 10 });
      expect(mockListUsers).toBeCalledWith(
        "http://localhost:8080/api/1.0/users?page=5&size=10"
      );
    });
    it("calls /api/1.0/users?page=5&size=3 when only page param provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers({ page: 5 });
      expect(mockListUsers).toBeCalledWith(
        "http://localhost:8080/api/1.0/users?page=5&size=3"
      );
    });
    it("calls /api/1.0/users?page=0&size=5 when only size param provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers({ size: 5 });
      expect(mockListUsers).toBeCalledWith(
        "http://localhost:8080/api/1.0/users?page=0&size=5"
      );
    });
  });

  describe("getUser", () => {
    it("calls /api/1.0/users/user5 when user5 is provided for getUser", () => {
      const mockGetUser = jest.fn();
      axios.get = mockGetUser;
      apiCalls.getUser("user5");
      expect(mockGetUser).toBeCalledWith(
        "http://localhost:8080/api/1.0/users/user5"
      );
    });
  });

  describe("updateUser", () => {
    it("calls /api/1.0/users/5 when 5 is provided for updateUser", () => {
      const mockUpdateUser = jest.fn();
      axios.put = mockUpdateUser;
      apiCalls.updateUser("5");
      const path = mockUpdateUser.mock.calls[0][0];
      expect(path).toBe("http://localhost:8080/api/1.0/users/5");
    });
  });

  describe("postRoast", () => {
    it("calls /api/1.0/roasts", () => {
      const mockPostRoast = jest.fn();
      axios.post = mockPostRoast;
      apiCalls.postRoast();
      const path = mockPostRoast.mock.calls[0][0];
      expect(path).toBe("http://localhost:8080/api/1.0/roasts");
    });
  });

  describe("loadRoasts", () => {
    it("calls /api/1.0/roasts?page=0&size=5&sort=id,desc when no param provided", () => {
      const mockGetRoasts = jest.fn();
      axios.get = mockGetRoasts;
      apiCalls.loadRoasts();
      expect(mockGetRoasts).toBeCalledWith(
        "http://localhost:8080/api/1.0/roasts?page=0&size=5&sort=id,desc"
      );
    });
    it("calls /api/1.0/users/user1/roasts?page=0&size=5&sort=id,desc when user param provided", () => {
      const mockGetRoasts = jest.fn();
      axios.get = mockGetRoasts;
      apiCalls.loadRoasts("user1");
      expect(mockGetRoasts).toBeCalledWith(
        "http://localhost:8080/api/1.0/users/user1/roasts?page=0&size=5&sort=id,desc"
      );
    });
  });
  describe("loadOldRoasts", () => {
    it("calls /api/1.0/roasts/5?direction=before&page=0&size=5&sort=id,desc when roast id param provided", () => {
      const mockGetRoasts = jest.fn();
      axios.get = mockGetRoasts;
      apiCalls.loadOldRoasts(5);
      expect(mockGetRoasts).toBeCalledWith(
        "http://localhost:8080/api/1.0/roasts/5?direction=before&page=0&size=5&sort=id,desc"
      );
    });
    it("calls /api/1.0/users/user3/roasts/5?direction=before&page=0&size=5&sort=id,desc when roast id and username param provided", () => {
      const mockGetRoasts = jest.fn();
      axios.get = mockGetRoasts;
      apiCalls.loadOldRoasts(5, "user3");
      expect(mockGetRoasts).toBeCalledWith(
        "http://localhost:8080/api/1.0/users/user3/roasts/5?direction=before&page=0&size=5&sort=id,desc"
      );
    });
  });
  describe("loadNewRoasts", () => {
    it("calls /api/1.0/roasts/5?direction=after&sort=id,desc when roast id param provided", () => {
      const mockGetRoasts = jest.fn();
      axios.get = mockGetRoasts;
      apiCalls.loadNewRoasts(5);
      expect(mockGetRoasts).toBeCalledWith(
        "http://localhost:8080/api/1.0/roasts/5?direction=after&sort=id,desc"
      );
    });
    it("calls /api/1.0/users/user3/roasts/5?direction=after&sort=id,desc when roast id and username param provided", () => {
      const mockGetRoasts = jest.fn();
      axios.get = mockGetRoasts;
      apiCalls.loadNewRoasts(5, "user3");
      expect(mockGetRoasts).toBeCalledWith(
        "http://localhost:8080/api/1.0/users/user3/roasts/5?direction=after&sort=id,desc"
      );
    });
  });
  describe("loadNewRoastCount", () => {
    it("calls /api/1.0/roasts/5?direction=after&count=true when roast id param provided", () => {
      const mockGetRoasts = jest.fn();
      axios.get = mockGetRoasts;
      apiCalls.loadNewRoastCount(5);
      expect(mockGetRoasts).toBeCalledWith(
        "http://localhost:8080/api/1.0/roasts/5?direction=after&count=true"
      );
    });
    it("calls /api/1.0/users/user3/roasts/5?direction=after&count=true when roast id and username param provided", () => {
      const mockGetRoasts = jest.fn();
      axios.get = mockGetRoasts;
      apiCalls.loadNewRoastCount(5, "user3");
      expect(mockGetRoasts).toBeCalledWith(
        "http://localhost:8080/api/1.0/users/user3/roasts/5?direction=after&count=true"
      );
    });
  });
  describe("postRoastFile", () => {
    it("calls /api/1.0/roasts/upload", () => {
      const mockPostRoastFile = jest.fn();
      axios.post = mockPostRoastFile;
      apiCalls.postRoastFile();
      const path = mockPostRoastFile.mock.calls[0][0];
      expect(path).toBe("http://localhost:8080/api/1.0/roasts/upload");
    });
  });
});

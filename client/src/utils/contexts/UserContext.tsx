import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { User } from "../types.tsx";
import { baseAPI, authAPI } from "../api/api.ts";

type UserContextType = {
  user: User | undefined;
  setUser: Function;
  login: Function;
  isSigningUp: boolean;
  setIsSigningUp: Function;
  signUp: Function;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

  useEffect(() => {
    // check if user has access_token in localstorage, if yes login without them having to

    const token = localStorage.getItem("authToken");

    if (!token) {
      console.log("No token found, user is not logged in.");
      return;
    }

    try {
      const decoded: any = jwtDecode(token); // You can inspect expiry, username, etc.\

      console.log(decoded);

      // Optional: check token expiration (optional client-side)
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        console.log("Token expired.");
        return;
      }

      authAPI
        .get("/users/me")
        .then((res) => {
          setUser(res.data);
          console.log("Auto login successful: ", res.data);
        })
        .catch((err) => {
          console.info("Token invalid or expired:", err);
        });
    } catch (err) {
      console.error("Invalid token format:", err);
    }
  }, []);

  const login = async (username: string, password: string) => {
    console.log(username, password);

    console.log("REQUEST TO /login");

    const response = await authAPI
      .post("/users/login", { username, password })
      .catch((err) => {
        console.log(err);
      });

    console.log(response);

    let token = response.data.access_token;
    localStorage.setItem("authToken", token);

    setUser(response.data);
  };

  const logout = async () => {};

  const signUp = async (username: string, password: string) => {
    console.log(username, password);

    console.log("post TO /users");

    const response = await authAPI
      .post("/users", { username, password })
      .catch((err) => {
        console.log(err);
      });

    let token = response.data.access_token;
    localStorage.setItem("authToken", token);

    setUser(response.data);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isSigningUp,
        setUser: setUser,
        login: login,
        setIsSigningUp: setIsSigningUp,
        signUp: signUp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

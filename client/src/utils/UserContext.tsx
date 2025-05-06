import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { User } from "./types.tsx";

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

  const login = async (username: string, password: string) => {
    console.log(username, password);

    console.log("REQUEST TO /login");
    
    let response = await axios
    .post("http://localhost:3001/users/login", { username, password })
    .catch((err) => {
      console.log(err);
    });

    setUser(response.data)
  };

  const logout = async () => {};

  const signUp = async (username: string, password: string) => {
    console.log(username, password);

    console.log("post TO /users");

    let response = await axios
      .post("http://localhost:3001/users", { username, password })
      .catch((err) => {
        console.log(err);
      });

      setUser(response.data)
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


import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { notifications } from "@mantine/notifications";
import getCookie from "../api/cookie";
import { baseURL } from "../App";
import UserType from "../types/UserType";
import { parseArgs } from "util";

// Define the user type without password
interface User {
  id: number;
  username: string;
  email: string;
  superuser : boolean;
  staff : boolean;
}

// Extend the User interface to include password (only for demo purposes)
interface DemoUser extends User {
  password: string;
}

// Define the authentication context type
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create a typed context with an initial empty value
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Custom hook to use authentication
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Simple in-memory "database" for demonstration purposes
const demoUsers: DemoUser[] = [
  { id: 1, username: "demo", email: "demo@example.com", password: "password", "superuser" : false, "staff" : false },
];

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token")
      console.log(storedUser)
      if (storedUser) {
        try {
          const parsedUser: UserType = JSON.parse(storedUser);
          console.log(parsedUser)
          if (parsedUser.staff !== undefined || parsedUser.superuser !== undefined){
            const userDetailResponse = await fetch(`${baseURL}/user/`, {
              method: "GET",
              headers: { "Content-Type": "application/json",
                  'Authorization': `Bearer ${token}`,
                  "X-CSRFToken": getCookie("csrftoken"),
               }
            });
            const user: UserType = (userDetailResponse as unknown) as UserType;
            parsedUser.staff = user.staff;
            parsedUser.superuser = user.staff;
            
          }
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth check error:", error);
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);



  const login = async (email: string, password: string): Promise<boolean> => {
      try {

          const response = await fetch(`${baseURL}/api/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
               },
            body: JSON.stringify({ username: email, password }),
          });
          if (!response.ok) {
              throw new Error("Invalid credentials");
          }

          const data = await response.json();
          localStorage.setItem("token", data.access); // Store the token
          const userDetailResponse = await fetch(`${baseURL}/user/`, {
            method: "GET",
            headers: { "Content-Type": "application/json",
                'Authorization': `Bearer ${data.access}`,
                "X-CSRFToken": getCookie("csrftoken"),
             }
          });
          const user: UserType = (await userDetailResponse.json() as unknown) as UserType;
          console.log(user)
          setUser({ id: Date.now(), username: email.split("@")[0], email, superuser : user.superuser, staff : user.staff });
          setIsAuthenticated(true);

          notifications.show({
              title: "Login Successful",
              message: "Welcome back!",
              color: "green",
          });

          return true;
      } catch (error) {
          console.error("Login error:", error);
          notifications.show({
              title: "Login Failed",
              message: "Invalid email or password",
              color: "red",
          });
          return false;
      }
  };  
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Store in our "database"
      const newUser = { id: Date.now(), username, email, password, superuser : false, staff: false };
      demoUsers.push(newUser);

      notifications.show({
        title: "Registration Successful",
        message: "You can now log in with your credentials",
        color: "green",
      });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      notifications.show({
        title: "Registration Failed",
        message: "Registration failed, please try again",
        color: "red",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    notifications.show({
      title: "Logged Out",
      message: "You have been logged out successfully",
      color: "blue",
    });
  };

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

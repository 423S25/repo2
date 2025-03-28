
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { notifications } from "@mantine/notifications";

// Define the user type without password
interface User {
  id: number;
  username: string;
  email: string;
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
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
  { id: 1, username: "demo", email: "demo@example.com", password: "password" },
];

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find user in our demo "database"
      const foundUser = demoUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        // Create a copy without the password
        const userWithoutPassword: User = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
        };
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        notifications.show({
          title: "Login Successful",
          message: "Welcome back!",
          color: "green",
        });
        return true;
      } else {
        // Try with any credentials for demo purposes
        const newUser: User = {
          id: Date.now(), // Simple unique ID
          username: email.split("@")[0], // Use part of email as username
          email: email,
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        setIsAuthenticated(true);
        notifications.show({
          title: "Login Successful",
          message: "Welcome back!",
          color: "green",
        });
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      notifications.show({
        title: "Login Failed",
        message: "Login failed, please try again",
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
      const newUser = { id: Date.now(), username, email, password };
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

import {
  createContext,
  useState,
  type ReactNode,
} from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("accessToken")
  );

  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);

    setUser(userData);
    setAccessToken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* oxlint-disable react(only-export-components) */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("rentkhoj_token");
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const token = localStorage.getItem("rentkhoj_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (active) setUser(currentUser);
      } catch {
        localStorage.removeItem("rentkhoj_token");
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser((current) => ({ ...current, ...updatedUser }));
  }, []);

  const login = async (formData) => {
    const result = await loginUser(formData);

    localStorage.setItem("rentkhoj_token", result.access_token);
    setUser(result.user);

    return result.user;
  };

  
const register = async (formData) => {
  return await registerUser(formData);
};


  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

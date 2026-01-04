import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setProfile(null);
        return;
      }
      setLoading(true);
      const ProfileResponse = await axios.get("/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("ProfileResponse:", ProfileResponse);
      setProfile(ProfileResponse.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          logout();
        } else {
          setUser(decoded);
          fetchProfile();
        }
      } catch (error) {
        console.error("Invalid token", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    profile,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

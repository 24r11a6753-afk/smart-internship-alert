import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API = "https://smart-internship-alert-1.onrender.com/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ✅ LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // ✅ REGISTER FUNCTION
  const register = async (name, email, password, interests) => {
    try {
      const res = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        interests,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setUser(res.data.user);
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
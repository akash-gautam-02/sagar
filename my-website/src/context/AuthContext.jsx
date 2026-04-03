import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = '/api';
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authStep, setAuthStep] = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [authType, setAuthType] = useState('');
  const inactivityTimer = useRef(null);

  // Auto logout function
  const logout = useCallback(async (logActivity = true) => {
    if (logActivity && token) {
      try {
        await axios.post(`${API_URL}/user/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (_) { /* silent */ }
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    setToken(null);
    setAuthStep('login');
    setIdentifier('');
    setAuthType('');
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  }, [token]);

  // Reset inactivity timer on user action
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout(true);
    }, INACTIVITY_TIMEOUT);
  }, [logout]);

  // Set up axios interceptor for 401 auto-logout
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Token expired or invalid — auto logout
          logout(false);
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);

  // Set up inactivity listeners
  useEffect(() => {
    if (!user) return;
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetInactivityTimer));
    resetInactivityTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetInactivityTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [user, resetInactivityTimer]);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        // Check if JWT is expired by decoding payload (no verify needed here)
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          // Token expired — clear everything
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const [sessionInfo, setSessionInfo] = useState(null);

  /**
   * Send OTP to email or phone
   */
  const sendOTP = async (id) => {
    setLoading(true);
    try {
      const isEmail = id.includes('@');
      const endpoint = isEmail ? '/auth/email/send-otp' : '/auth/phone/send-otp';
      const payload = isEmail ? { email: id } : { phone: id };
      
      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      
      setIdentifier(id);
      setAuthType(isEmail ? 'email' : 'phone');
      if (res.data.sessionInfo) {
        setSessionInfo(res.data.sessionInfo);
      }
      setAuthStep('otp');
      return { success: true };
    } catch (err) {
      throw err.response?.data?.error || 'Failed to send OTP. Please try again.';
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify OTP and login
   */
  const verifyOTP = async (otpCode) => {
    setLoading(true);
    try {
      const isEmail = authType === 'email';
      const endpoint = isEmail ? '/auth/email/verify-otp' : '/auth/phone/verify-otp';
      const payload = isEmail 
        ? { email: identifier, otp: otpCode } 
        : { phone: identifier, otp: otpCode, sessionInfo };

      const res = await axios.post(`${API_URL}${endpoint}`, payload);

      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setSessionInfo(null);
        return { success: true };
      }
    } catch (err) {
      throw err.response?.data?.error || 'Verification failed. Please check your code.';
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch fresh profile from server
   */
  const fetchProfile = async () => {
    const storedToken = token || localStorage.getItem('auth_token');
    if (!storedToken) return null;
    try {
      const res = await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      const updated = { ...user, ...res.data.profile };
      setUser(updated);
      localStorage.setItem('auth_user', JSON.stringify(updated));
      return res.data.profile;
    } catch (err) {
      console.error('Profile fetch failed:', err);
      return null;
    }
  };

  /**
   * Update profile
   */
  const updateProfile = async (data) => {
    const storedToken = token || localStorage.getItem('auth_token');
    const res = await axios.put(`${API_URL}/user/profile`, data, {
      headers: { Authorization: `Bearer ${storedToken}` }
    });
    if (res.data.success) {
      const updated = { ...user, ...res.data.profile };
      setUser(updated);
      localStorage.setItem('auth_user', JSON.stringify(updated));
    }
    return res.data;
  };

  /**
   * Fetch activity logs
   */
  const fetchActivity = async () => {
    const storedToken = token || localStorage.getItem('auth_token');
    if (!storedToken) return [];
    try {
      const res = await axios.get(`${API_URL}/user/activity`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      return res.data.logs || [];
    } catch (err) {
      console.error('Activity fetch failed:', err);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      authStep,
      identifier,
      authType,
      setAuthStep,
      sendOTP,
      verifyOTP,
      logout,
      fetchProfile,
      updateProfile,
      fetchActivity,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { socket } from '../utils/socket';

// Create the context
const AuthContext = createContext();

// Create a custom hook for easy access in our components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  //Socket Connection Management
  useEffect(() => {
    if (user) {
      // Connect to the WebSocket server
      socket.connect();
      socket.emit('join-user-room', user._id);
    } else {
      socket.disconnect();
    }
    return () => {
      socket.disconnect();
    };
  }, [user]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { data } = response.data;
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ _id: data._id, email: data.email }));
    
    setUser({ _id: data._id, email: data.email });
    return data;
  };

  const register = async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    const { data } = response.data;
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ _id: data._id, email: data.email }));
    
    setUser({ _id: data._id, email: data.email });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
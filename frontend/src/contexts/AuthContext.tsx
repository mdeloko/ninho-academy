import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  nome: string;
  email: string;
  xp: number;
  temESP32: boolean;
  sincronizado: boolean;
  sequenciaDias: number;
  trilhaId?: string;
  licoesConcluidas: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { usuario, token: newToken } = response.data;

    setToken(newToken);
    setUser(usuario);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(usuario));
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { usuario, token: newToken } = response.data;

    setToken(newToken);
    setUser(usuario);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(usuario));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

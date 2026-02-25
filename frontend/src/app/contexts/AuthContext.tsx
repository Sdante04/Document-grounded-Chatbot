import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'editor' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  tenants: Tenant[];
}

export interface Tenant {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'team';
}

interface AuthContextType {
  user: User | null;
  currentTenant: Tenant | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchTenant: (tenantId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'María González',
  email: 'maria@empresa.com',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  tenants: [
    { id: 't1', name: 'Acme Corp', plan: 'pro' },
    { id: 't2', name: 'Startup Inc', plan: 'free' },
  ]
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      setUser(mockUser);
      setCurrentTenant(mockUser.tenants[0]);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentTenant(null);
  };

  const switchTenant = (tenantId: string) => {
    const tenant = user?.tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      currentTenant,
      isAuthenticated: !!user,
      login,
      logout,
      switchTenant,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

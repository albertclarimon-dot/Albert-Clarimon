import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LogisticRecord, User, Incident } from '../types';
import { dbService } from '../services/db';

interface AppState {
  currentUser: User | null;
  records: LogisticRecord[];
  incidents: Incident[];
  login: (user: User) => void;
  logout: () => void;
  addRecord: (record: LogisticRecord) => void;
  addIncident: (incident: Incident) => void;
}



const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Check if we have an active session
    const saved = localStorage.getItem('active_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [records, setRecords] = useState<LogisticRecord[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    dbService.init();
    setRecords(dbService.getRecords().reverse()); // newer first
    setIncidents(dbService.getIncidents().reverse());
  }, []);

  const login = (user: User) => {
    localStorage.setItem('active_user', JSON.stringify(user));
    setCurrentUser(user);
  };
  
  const logout = () => {
    localStorage.removeItem('active_user');
    setCurrentUser(null);
  };
  
  const addRecord = (record: LogisticRecord) => {
    dbService.saveRecord(record);
    setRecords(prev => [record, ...prev]);
  };

  const addIncident = (incident: Incident) => {
    dbService.saveIncident(incident);
    setIncidents(prev => [incident, ...prev]);
  };

  return (
    <AppContext.Provider value={{ currentUser, records, incidents, login, logout, addRecord, addIncident }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

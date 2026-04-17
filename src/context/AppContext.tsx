import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LogisticRecord, User, Incident } from '../types';

interface AppState {
  currentUser: User | null;
  records: LogisticRecord[];
  incidents: Incident[];
  login: (user: User) => void;
  logout: () => void;
  addRecord: (record: LogisticRecord) => void;
  addIncident: (incident: Incident) => void;
}

const mockUser: User = {
  id: 'u1',
  name: 'Operario',
  role: 'OPERARIO',
  terminal: 'Terminal Muelle 04 • Sector Norte'
};

const mockRecords: LogisticRecord[] = [
  {
    id: 'rec-1',
    operationType: 'SALIDA',
    date: new Date().toISOString().split('T')[0],
    time: '12:45:00',
    operator: 'Juan Pérez',
    licensePlate: 'CAM-2904',
    driverName: 'Juan Pérez',
    transportCompany: 'LogisTransit S.A.',
    entityName: 'Centro Logístico Norte',
    referenceNumber: 'ORD-2024',
    waybillNumber: 'ALB-882',
    pieceCount: 1200,
    cargoStatus: 'OK',
    observations: '',
    cargoPhotos: [],
    waybillPhoto: null,
    signature: null,
    incidentCount: 0,
    incidentsData: [],
    syncStatus: 'SYNCED'
  },
  {
    id: 'rec-2',
    operationType: 'LLEGADA',
    date: new Date().toISOString().split('T')[0],
    time: '11:30:00',
    operator: 'Operario',
    licensePlate: 'CAM-8812',
    driverName: 'Carlos López',
    transportCompany: 'EuroCargo Express',
    entityName: 'Proveedor Global',
    referenceNumber: 'REF-991',
    waybillNumber: 'ALB-112',
    pieceCount: 600,
    cargoStatus: 'OK',
    observations: '',
    cargoPhotos: [],
    waybillPhoto: null,
    signature: null,
    incidentCount: 0,
    incidentsData: [],
    syncStatus: 'SYNCED'
  }
];

const mockIncidents: Incident[] = [
  {
    id: 'inc-1',
    recordId: 'rec-xyz',
    type: 'Rotura de precinto',
    description: 'El camión llegó con el precinto de seguridad roto.',
    severity: 'ALTA',
    photos: [],
    reportedBy: 'Operario',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'PENDIENTE'
  }
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Auto-login for MVP to speed up testing
  const [currentUser, setCurrentUser] = useState<User | null>(mockUser);
  const [records, setRecords] = useState<LogisticRecord[]>(mockRecords);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);

  const login = (user: User) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);
  
  const addRecord = (record: LogisticRecord) => {
    setRecords(prev => [record, ...prev]);
  };

  const addIncident = (incident: Incident) => {
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

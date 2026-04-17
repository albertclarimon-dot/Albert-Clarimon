import { LogisticRecord, Incident, User } from '../types';

const USERS_KEY = 'logitrack_users';
const RECORDS_KEY = 'logitrack_records';
const INCIDENTS_KEY = 'logitrack_incidents';

// Initial dummy database if empty
const initDB = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers: User[] = [
      { id: 'admin-1', name: 'Administrador Pretec', username: 'admin', pin: '1234', role: 'ADMIN', terminal: 'Sede Central' },
      { id: 'op-1', name: 'Juan Pérez', username: 'juanp', pin: '0000', role: 'OPERARIO', terminal: 'Muelle 1' },
      { id: 'op-2', name: 'María Gómez', username: 'mariag', pin: '0000', role: 'OPERARIO', terminal: 'Muelle 2' }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
  
  if (!localStorage.getItem(RECORDS_KEY)) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(INCIDENTS_KEY)) {
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify([]));
  }
};

export const dbService = {
  init: initDB,
  
  // Users
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  
  // Records
  getRecords: (): LogisticRecord[] => JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]'),
  saveRecord: (record: LogisticRecord) => {
    const records = dbService.getRecords();
    records.push(record);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  },
  
  // Incidents
  getIncidents: (): Incident[] => JSON.parse(localStorage.getItem(INCIDENTS_KEY) || '[]'),
  saveIncident: (incident: Incident) => {
    const incidents = dbService.getIncidents();
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify([...incidents, incident]));
  },
  updateIncidentStatus: (id: string, status: 'PENDIENTE' | 'REVISADA' | 'CERRADA') => {
    const incidents = dbService.getIncidents();
    const idx = incidents.findIndex(i => i.id === id);
    if (idx > -1) {
      incidents[idx].status = status;
      localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
    }
  }
};

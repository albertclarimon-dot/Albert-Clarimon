export type OperationType = 'SALIDA' | 'LLEGADA';
export type CargoStatus = 'OK' | 'DAÑADO' | 'PENDIENTE';
export type IncidentSeverity = 'BAJA' | 'MEDIA' | 'ALTA';
export type IncidentStatus = 'PENDIENTE' | 'REVISADA' | 'CERRADA';

export interface User {
  id: string;
  name: string;
  username: string; // login identifier
  pin: string; // password
  role: 'OPERARIO' | 'SUPERVISOR' | 'ADMIN';
  terminal: string;
}

export interface Incident {
  id: string;
  recordId?: string; // Can be associated later or immediately
  type: string;
  description: string;
  severity: IncidentSeverity;
  photos: string[]; // Base64 or URLs
  reportedBy: string; // user name
  createdAt: string; // ISO date
  status: IncidentStatus;
}

// Flat structure optimized for Make/Excel export
export interface LogisticRecord {
  id: string;
  operationType: OperationType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  operator: string;
  licensePlate: string;
  driverName: string;
  transportCompany: string;
  entityName: string; // Client (for Salida) or Supplier (for Llegada)
  referenceNumber: string; // Order / Expedicion
  waybillNumber: string; // Albaran
  pieceCount: number;
  cargoStatus: CargoStatus;
  observations: string;
  
  // Evidences (Base64 for MVP, URLs if uploaded to cloud storage)
  cargoPhotos: string[];
  waybillPhoto: string | null;
  signature: string | null; // Base64 image
  
  // Embedded incidents summary for easy export
  incidentCount: number;
  incidentsData: Incident[]; 
  
  syncStatus: 'PENDING' | 'SYNCED' | 'ERROR';
}

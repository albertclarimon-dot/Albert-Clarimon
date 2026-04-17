/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { Button } from './components/ui/Button';
import Login from './pages/Login';
import Home from './pages/Home';
import RecordForm from './pages/RecordForm';
import History from './pages/History';
import Incidents from './pages/Incidents';

const Profile = () => {
  const { currentUser, logout } = useAppContext();
  return (
    <div className="p-6 max-w-lg mx-auto animate-in fade-in pb-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">Mi Perfil</h1>
      
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 flex flex-col gap-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre</p>
          <p className="font-semibold text-slate-800 text-lg">{currentUser?.name}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rol</p>
          <p className="font-semibold text-slate-800">{currentUser?.role}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Puesto de Trabajo</p>
          <p className="font-semibold text-slate-800">{currentUser?.terminal}</p>
        </div>
      </div>
      
      <Button variant="danger" className="w-full" onClick={logout}>
         Cerrar Sesión
      </Button>
    </div>
  );
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppContext();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="record/:type" element={<RecordForm />} />
            <Route path="history" element={<History />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import RecordForm from './pages/RecordForm';
import History from './pages/History';
import Incidents from './pages/Incidents';

const Profile = () => <div className="p-6 text-center animate-in fade-in"><h1 className="text-2xl font-bold mt-10">Perfil</h1><p className="text-slate-500 mt-2">Esta sección estará disponible en la versión final.</p></div>;

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


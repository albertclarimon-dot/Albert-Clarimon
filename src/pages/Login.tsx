import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAppContext } from '../context/AppContext';
import { dbService } from '../services/db';

export default function Login() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.init(); // ensure DB is loaded
    const users = dbService.getUsers();
    
    // Find user
    const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!foundUser) {
        setError('Usuario no encontrado');
        return;
    }
    
    if (foundUser.pin !== pin) {
        setError('PIN / Contraseña incorrecta');
        return;
    }
    
    // Success login
    login(foundUser);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F7F8F9] font-sans max-w-md mx-auto p-6 pt-12 items-center">
      <div className="flex items-center gap-3 mb-10 text-[#294396] font-bold text-3xl tracking-tight">
        {/* PRETEC Logo Simulation */}
        <div className="w-10 h-10 bg-[#294396] rounded-md flex overflow-hidden shrink-0">
          <div className="w-1/3 h-full"></div>
          <div className="w-1/3 h-full bg-[#38a169] flex flex-col justify-evenly items-center py-1">
             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <div className="w-1/3 h-full"></div>
        </div>
        PRETEC
      </div>

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-800 mb-2">Bienvenido</h1>
        <p className="text-slate-500 font-medium tracking-wide">
          Introduzca sus credenciales de acceso
        </p>
      </div>

      <form className="w-full space-y-6" onSubmit={handleLogin}>
        <Input 
          label="Usuario" 
          placeholder="admin o empleado" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <Input 
          label="PIN / Contraseña" 
          type="password" 
          placeholder="••••••••" 
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800 font-medium">
          💡 Esta aplicación utiliza almacenamiento del navegador (localStorage) para guardar los datos permanentemente en este dispositivo.
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
            <span>Recordar dispositivo</span>
          </label>
          <a href="#" className="text-sm font-bold text-slate-900">Recuperar acceso</a>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                {error}
            </div>
        )}

        <Button type="submit" size="lg" className="w-full mt-4">
          Entrar
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500 max-w-xs leading-relaxed">
         Cuentas demo:<br/>
         - <b>admin</b> / 1234 (Dashboard Total)<br/>
         - <b>juanp</b> / 0000 (Solo registro)
      </div>
    </div>
  );
}

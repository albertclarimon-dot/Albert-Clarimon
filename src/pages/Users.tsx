import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Users as UsersIcon } from 'lucide-react';
import { dbService } from '../services/db';
import { User as UserType } from '../types';

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [newUser, setNewUser] = useState({ name: '', username: '', pin: '', role: 'OPERARIO' as 'OPERARIO' | 'ADMIN', terminal: 'Sede' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(dbService.getUsers());
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.pin.length < 6) {
      alert("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }
    const u: UserType = {
      id: `u-${Date.now()}`,
      ...newUser
    };
    dbService.saveUser(u);
    setNewUser({ name: '', username: '', pin: '', role: 'OPERARIO', terminal: 'Sede' });
    loadUsers();
  };

  const handleDelete = (id: string, username: string) => {
    if (username === 'admin') {
        alert("No puedes borrar al superadministrador.");
        return;
    }
    if (window.confirm("¿Seguro que deseas eliminar a este usuario?")) {
        dbService.deleteUser(id);
        loadUsers();
    }
  };

  const toggleRole = (id: string, currentRole: string, username: string) => {
    if (username === 'admin') {
        alert("No puedes quitarle el rol de admin al superadministrador.");
        return;
    }
    const newRole = currentRole === 'ADMIN' ? 'OPERARIO' : 'ADMIN';
    dbService.updateUserRole(id, newRole as 'ADMIN' | 'OPERARIO' | 'SUPERVISOR');
    loadUsers();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in pb-10 max-w-3xl">
      
      {/* Create User Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
         <div className="p-4 border-b border-slate-100 flex items-center gap-2 text-slate-600 font-bold tracking-wide text-[13px]">
           <UserPlus className="w-4 h-4" />
           CREAR USUARIO
         </div>
         <form onSubmit={handleAdd} className="p-5 flex flex-col gap-5">
            <div>
              <label className="text-[14px] font-bold text-slate-900 mb-2 block">Nombre</label>
              <input 
                 required 
                 value={newUser.name} 
                 onChange={e => setNewUser(p => ({...p, name: e.target.value}))} 
                 className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:border-slate-500 focus:outline-none transition-colors text-slate-900" 
              />
            </div>

            <div>
              <label className="text-[14px] font-bold text-slate-900 mb-2 block">Email</label>
              <input 
                 type="email"
                 required 
                 value={newUser.username} 
                 onChange={e => setNewUser(p => ({...p, username: e.target.value}))} 
                 className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:border-slate-500 focus:outline-none transition-colors text-slate-900" 
              />
            </div>

            <div>
              <label className="text-[14px] font-bold text-slate-900 mb-2 block">Contraseña</label>
              <input 
                 required 
                 minLength={6}
                 type="text"
                 placeholder="mín. 6 caracteres"
                 value={newUser.pin} 
                 onChange={e => setNewUser(p => ({...p, pin: e.target.value}))} 
                 className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:border-slate-500 focus:outline-none transition-colors text-slate-500 font-mono" 
              />
            </div>

            <div>
              <label className="text-[14px] font-bold text-slate-900 mb-2 block">Rol</label>
              <select
                value={newUser.role}
                onChange={e => setNewUser(p => ({...p, role: e.target.value as 'ADMIN' | 'OPERARIO'}))}
                className="w-full h-12 rounded-xl border border-slate-300 px-4 focus:border-slate-500 focus:outline-none transition-colors text-slate-900 appearance-none bg-white"
              >
                <option value="OPERARIO">Operario</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <button type="submit" className="w-full h-12 bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium rounded-xl mt-2 transition-colors">
               Crear usuario
            </button>
         </form>
      </div>

      {/* Users List Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
         <div className="p-4 border-b border-slate-100 flex items-center gap-2 text-slate-600 font-bold tracking-wide text-[13px]">
           <UsersIcon className="w-4 h-4" />
           USUARIOS Y ROLES
         </div>
         <div className="p-5 flex flex-col gap-3">
            {users.map(u => (
               <div key={u.id} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-[16px]">{u.name}</h4>
                    <p className="text-[14px] text-slate-500">{u.username}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-900 font-bold text-[12px] tracking-wide rounded-[8px]">
                      {u.role}
                    </span>
                    {u.username !== 'admin' && (
                    <>
                      <button 
                         onClick={() => toggleRole(u.id, u.role, u.username)} 
                         className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-[8px] text-[13px] font-semibold text-slate-800 transition"
                      >
                         {u.role === 'OPERARIO' ? 'Hacer admin' : 'Hacer operario'}
                      </button>
                      <button 
                         onClick={() => handleDelete(u.id, u.username)} 
                         className="w-8 h-8 flex items-center justify-center bg-[#ef4444] hover:bg-red-700 text-white rounded-[8px] transition"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                    )}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, records, incidents } = useAppContext();

  const today = new Date().toISOString().split('T')[0];
  const todaysRecords = records.filter(r => r.date === today);
  const todaysLlegadas = todaysRecords.filter(r => r.operationType === 'LLEGADA').length;
  const todaysSalidas = todaysRecords.filter(r => r.operationType === 'SALIDA').length;
  const totalPalets = todaysRecords.reduce((acc, curr) => acc + curr.pieceCount, 0);
  const openIncidents = incidents.filter(i => i.status === 'PENDIENTE').length;

  return (
    <div className="flex flex-col md:grid md:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Info */}
      <header className="md:col-span-4 flex justify-between items-center mb-1">
        <div className="flex items-center gap-[15px]">
          <div>
            <h1 className="text-[18px] font-bold text-[#1a1a1b] leading-tight">{currentUser?.name}</h1>
            <p className="text-[12px] text-[#64748b] font-medium mt-0.5">{currentUser?.terminal} • Dock #04</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-[6px] text-[11px] font-bold text-[#10b981] bg-[#f0fdf4] px-3 py-1.5 rounded-full border border-[#bcf0da]">
          <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
          INTEGRACIÓN MAKE ACTIVA
        </div>
      </header>

      {/* Action Cards */}
      <button 
        onClick={() => navigate('/record/salida')}
        className="md:col-span-2 h-[180px] bg-[#eff6ff] rounded-[24px] border border-transparent md:border-2 md:border-[#2563eb] text-[#2563eb] flex flex-col items-center justify-center gap-[12px] transition-transform active:scale-[0.98] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] w-full"
      >
        <ArrowUpFromLine className="w-10 h-10 stroke-[2.5]" />
        <div className="text-center">
            <h2 className="text-[24px] font-bold uppercase tracking-[1px]">Registrar Salida</h2>
            <p className="text-[13px] opacity-80">Expedición de mercancía y palets</p>
        </div>
      </button>

      <button 
        onClick={() => navigate('/record/llegada')}
        className="md:col-span-2 h-[180px] bg-[#ecfdf5] rounded-[24px] border border-transparent md:border-2 md:border-[#10b981] text-[#10b981] flex flex-col items-center justify-center gap-[12px] transition-transform active:scale-[0.98] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] w-full"
      >
        <ArrowDownToLine className="w-10 h-10 stroke-[2.5]" />
        <div className="text-center">
          <h2 className="text-[24px] font-bold uppercase tracking-[1px]">Registrar Llegada</h2>
          <p className="text-[13px] opacity-80">Recepción de proveedores y compras</p>
        </div>
      </button>

      {/* Stat Cards - ONLY ADMIN */}
      {currentUser?.role === 'ADMIN' && (
        <>
          <div className="md:col-span-1 bg-[#ffffff] rounded-[24px] border border-[#e2e8f0] p-6 flex flex-col justify-between shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] min-h-[140px]">
            <div className="text-[12px] uppercase text-[#64748b] font-semibold">Total Piezas</div>
            <div className="text-[32px] font-bold font-mono text-[#1a1a1b]">{totalPalets}</div>
            <div className="text-[11px] text-[#10b981]">+8% vs ayer</div>
          </div>

          <div className="md:col-span-1 bg-[#ffffff] rounded-[24px] border border-[#e2e8f0] p-6 flex flex-col justify-between shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] min-h-[140px]">
            <div className="text-[12px] uppercase text-[#64748b] font-semibold">Entradas / Salidas</div>
            <div className="text-[32px] font-bold font-mono text-[#1a1a1b]">{todaysLlegadas} / {todaysSalidas}</div>
            <div className="text-[11px] text-[#64748b]">Movimientos hoy</div>
          </div>
        </>
      )}

      {/* History Card - ONLY ADMIN */}
      {currentUser?.role === 'ADMIN' && (
      <div className="md:col-span-3 bg-[#ffffff] rounded-[24px] border border-[#e2e8f0] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col overflow-x-auto min-h-[220px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-bold text-[#1a1a1b]">Registros Recientes</h3>
          <button onClick={() => navigate('/history')} className="text-[12px] font-medium text-[#2563eb] hover:underline">Ver Historial Completo →</button>
        </div>

        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr>
              <th className="py-2 text-[11px] uppercase text-[#94a3b8] font-semibold border-b border-[#e2e8f0]">Hora</th>
              <th className="py-2 text-[11px] uppercase text-[#94a3b8] font-semibold border-b border-[#e2e8f0]">Operario</th>
              <th className="py-2 text-[11px] uppercase text-[#94a3b8] font-semibold border-b border-[#e2e8f0]">Tipo</th>
              <th className="py-2 text-[11px] uppercase text-[#94a3b8] font-semibold border-b border-[#e2e8f0]">Matrícula</th>
              <th className="py-2 text-[11px] uppercase text-[#94a3b8] font-semibold border-b border-[#e2e8f0]">Piezas</th>
              <th className="py-2 text-[11px] uppercase text-[#94a3b8] font-semibold border-b border-[#e2e8f0]">Estado</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(0, 3).map(record => (
              <tr key={record.id} className="border-b border-dotted border-[#e2e8f0] hover:bg-slate-50 transition-colors">
                <td className="py-3 text-[14px] text-[#1a1a1b]">{record.time.substring(0, 5)}</td>
                <td className="py-3 text-[14px] text-[#1a1a1b] font-medium">{record.operator}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-[6px] text-[11px] font-bold uppercase ${record.operationType === 'SALIDA' ? 'bg-[#dbeafe] text-[#1e40af]' : 'bg-[#d1fae5] text-[#065f46]'}`}>
                    {record.operationType}
                  </span>
                </td>
                <td className="py-3 text-[14px] font-bold text-[#1a1a1b]">{record.licensePlate}</td>
                <td className="py-3 text-[14px] text-[#1a1a1b]">{record.pieceCount} pz</td>
                <td className="py-3 text-[13px] font-medium">
                   <span className={record.cargoStatus === 'OK' ? 'text-[#10b981]' : 'text-[#f59e0b]'}>
                     {record.cargoStatus === 'OK' ? 'Sincronizado' : 'Incidencia'}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
           <p className="text-sm text-slate-500 py-4 text-center">No hay registros hoy</p>
        )}
      </div>
      )}

      {/* Incident Card - ONLY ADMIN */}
      {currentUser?.role === 'ADMIN' && (
      <div className="md:col-span-1 bg-[#fffbeb] rounded-[24px] border border-[#fde68a] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <h3 className="text-[14px] font-bold text-[#1a1a1b] mb-3 flex items-center justify-between">
          Incidencias Críticas
          {openIncidents > 0 && <AlertTriangle className="w-4 h-4 text-[#ef4444]" />}
        </h3>
        
        <div className="flex-1">
          {incidents.slice(0, 1).map(inc => (
            <div key={inc.id} className="bg-white p-[12px] rounded-[12px] border border-[#fde68a] mb-2">
              <div className="flex justify-between items-center mb-[5px]">
                 <span className="text-[10px] font-bold text-[#ef4444] uppercase">{inc.severity}</span>
                 <span className="text-[10px] text-[#92400e]">Hoy</span>
              </div>
              <p className="text-[12px] font-semibold text-[#1a1a1b] leading-tight truncate">{inc.type}</p>
              <p className="text-[11px] text-[#92400e] mt-1 truncate">{inc.description}</p>
            </div>
          ))}
          {incidents.length === 0 && (
            <div className="text-center text-sm text-[#92400e] py-6 opacity-70">
              Muelle Operativo
            </div>
          )}
        </div>

        <button onClick={() => navigate('/incidents')} className="w-full mt-2 py-[10px] bg-[#1a1a1b] text-white rounded-[10px] text-[12px] font-medium hover:bg-slate-800 transition-colors">
          Gestionar Alertas
        </button>
      </div>
      )}

    </div>
  );
}

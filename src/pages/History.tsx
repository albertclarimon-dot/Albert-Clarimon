import { useState } from 'react';
import { Search, ArrowUpFromLine, ArrowDownToLine, AlertTriangle, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';

export default function History() {
  const { records } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => 
    r.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.transportCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Historial</h1>
        <p className="text-slate-500 font-medium tracking-wide mt-1">Consulta los últimos registros</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar matrícula, empresa o ref..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 bg-white rounded-xl pl-10 pr-4 text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No se encontraron registros</p>
          </div>
        ) : filteredRecords.map(record => (
          <Card key={record.id} className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
               <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${record.operationType === 'SALIDA' ? 'bg-slate-100' : 'bg-blue-50'}`}>
                    {record.operationType === 'SALIDA' ? 
                      <ArrowUpFromLine className="w-5 h-5 text-slate-700" /> : 
                      <ArrowDownToLine className="w-5 h-5 text-blue-600" />
                    }
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 leading-tight">{record.operationType}</h3>
                   <p className="text-xs font-bold text-slate-500">{record.date} • {record.time.substring(0, 5)}</p>
                 </div>
               </div>
               <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-800 rounded-md">COMPLETADO</span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-1">
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-0.5">MATRÍCULA</p>
                <p className="font-semibold text-slate-800">{record.licensePlate}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-0.5">TRANSPORTE</p>
                <p className="font-semibold text-slate-800 truncate">{record.transportCompany}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-0.5">PIEZAS</p>
                <p className="font-semibold text-slate-800">{record.pieceCount}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-0.5">ESTADO</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${record.cargoStatus === 'OK' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <p className="font-semibold text-slate-800">{record.cargoStatus}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

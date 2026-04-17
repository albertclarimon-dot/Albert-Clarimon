import { useState } from 'react';
import { AlertTriangle, MapPin, Clock, FileWarning } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';

export default function Incidents() {
  const { incidents } = useAppContext();
  const [filter, setFilter] = useState<'PENDIENTE' | 'REVISADA' | 'CERRADA' | 'ALL'>('ALL');

  const filteredIncidents = filter === 'ALL' ? incidents : incidents.filter(i => i.status === filter);

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Incidencias</h1>
        <p className="text-slate-500 font-medium tracking-wide mt-1">Gestión de problemas en muelle</p>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {(['ALL', 'PENDIENTE', 'REVISADA', 'CERRADA'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors
              ${filter === status 
                ? 'bg-slate-900 text-white' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {status === 'ALL' ? 'TODAS' : status}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
         {filteredIncidents.length === 0 ? (
          <div className="text-center py-10">
            <FileWarning className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No hay incidencias que mostrar</p>
          </div>
        ) : filteredIncidents.map(inc => (
          <Card key={inc.id} className="overflow-hidden border-0 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <div className={`h-1.5 w-full ${inc.severity === 'ALTA' ? 'bg-red-500' : inc.severity === 'MEDIA' ? 'bg-orange-400' : 'bg-yellow-400'}`} />
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${inc.status === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-900 text-sm">{inc.type}</h3>
                     <p className="text-xs font-medium text-slate-500">{new Date(inc.createdAt).toLocaleString('es-ES', {hour: '2-digit', minute:'2-digit', day: '2-digit', month: 'short'})}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase
                  ${inc.status === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 
                    inc.status === 'REVISADA' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {inc.status}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {inc.description}
              </p>

              <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Reportado por: {inc.reportedBy}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

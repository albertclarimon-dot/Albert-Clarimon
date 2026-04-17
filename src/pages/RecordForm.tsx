import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { ArrowLeft, Camera, X, Check, UploadCloud, AlertTriangle, Clock, ArrowUpFromLine } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import { LogisticRecord, CargoStatus } from '../types';
import { sendRecordToMake } from '../lib/utils';

export default function RecordForm() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { currentUser, addRecord } = useAppContext();
  
  const isLlegada = type === 'llegada';
  const operationName = isLlegada ? 'Llegada' : 'Salida';
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    licensePlate: '',
    driverName: '',
    transportCompany: '',
    entityName: '',
    referenceNumber: '',
    waybillNumber: '',
    pieceCount: 0,
    cargoStatus: 'OK' as CargoStatus,
    observations: ''
  });

  // Evidences State
  const [cargoPhotos, setCargoPhotos] = useState<string[]>([]);
  const [waybillPhoto, setWaybillPhoto] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantity = (delta: number) => {
    setFormData(prev => ({ ...prev, pieceCount: Math.max(0, prev.pieceCount + delta) }));
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>, type: 'cargo' | 'waybill') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'cargo') {
          setCargoPhotos(prev => [...prev, base64]);
        } else {
          setWaybillPhoto(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    // Validate Step 1
    if (!formData.licensePlate || !formData.transportCompany || !formData.entityName || !formData.referenceNumber || !formData.waybillNumber || formData.pieceCount <= 0) {
       setValidationError('Por favor, complete todos los campos obligatorios y asegúrese de que el nº de piezas sea mayor a 0 antes de continuar.');
       return;
    }
    setValidationError('');
    setStep(2);
  };
  const submitRecord = async () => {
    // Validate Evidences
    if (cargoPhotos.length === 0) {
       setValidationError('Debe incluir al menos 1 fotografía de la mercancía de forma obligatoria.');
       return;
    }
    setValidationError('');

    if (isSubmitting) return;

    setIsSubmitting(true);
    
    const signatureBase64 = signatureRef.current?.isEmpty() ? null : signatureRef.current?.toDataURL();
    
    const newRecord: LogisticRecord = {
      id: `rec-${Date.now()}`,
      operationType: isLlegada ? 'LLEGADA' : 'SALIDA',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('es-ES', { hour12: false }),
      operator: currentUser?.name || 'Unknown',
      ...formData,
      cargoPhotos,
      waybillPhoto,
      signature: signatureBase64,
      incidentCount: formData.cargoStatus !== 'OK' ? 1 : 0, // Auto incident block in MVP
      incidentsData: [], // Would generate incident if true in real app
      syncStatus: 'PENDING'
    };

    // 1. Save to local context
    addRecord(newRecord);

    try {
      await sendRecordToMake(newRecord);
      setShowSuccess(true);
    } catch (e) {
      console.error("Failed to send to Make", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-in fade-in zoom-in duration-300">
         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-green-600" />
         </div>
         <h2 className="text-2xl font-bold text-slate-900 text-center">Información enviada correctamente</h2>
         <p className="text-slate-500 text-center mb-8">Los datos han sido registrados e integrados mediante Make con éxito.</p>
         <Button size="lg" className="px-12" onClick={() => navigate('/', { replace: true })}>Cerrar y Volver</Button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200">
            <ArrowLeft className="w-6 h-6 text-slate-800" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Registrar {operationName}</h1>
            <p className="text-sm font-medium text-slate-500">Complete los datos de la expedición actual.</p>
          </div>
        </div>

        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 flex items-center gap-2">
             DATOS DE TRANSPORTE
          </h3>
          <Input label="Matrícula" name="licensePlate" placeholder="1234-ABC" value={formData.licensePlate} onChange={handleInputChange} />
          <Input label="Conductor" name="driverName" placeholder="Nombre completo" value={formData.driverName} onChange={handleInputChange} />
          <Input label="Empresa de Transporte" name="transportCompany" placeholder="Ej. TransLog S.A." value={formData.transportCompany} onChange={handleInputChange} />
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-widest text-slate-500">DETALLES DE CARGA</h3>
          <Input label={isLlegada ? "Proveedor / Origen" : "Cliente / Destino"} name="entityName" placeholder="Nombre de entidad" value={formData.entityName} onChange={handleInputChange} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nº Pedido" name="referenceNumber" placeholder="ORD-2024" value={formData.referenceNumber} onChange={handleInputChange} />
            <Input label="Nº Albarán" name="waybillNumber" placeholder="ALB-882" value={formData.waybillNumber} onChange={handleInputChange} />
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-widest text-slate-500">CANTIDAD DE PIEZAS</h3>
          
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-500 block">Nº PIEZAS / BULTOS</label>
              <input
                 type="number"
                 className="text-2xl font-black text-slate-900 bg-transparent w-full focus:outline-none"
                 value={formData.pieceCount || ''}
                 onChange={(e) => setFormData(prev => ({...prev, pieceCount: parseInt(e.target.value) || 0}))}
                 placeholder="0"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="icon" onClick={() => handleQuantity(-10)}>-10</Button>
              <Button type="button" variant="default" size="icon" onClick={() => handleQuantity(10)}>+10</Button>
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold tracking-widest text-slate-500">ESTADO Y OBSERVACIONES</h3>
          
          <div className="grid grid-cols-3 gap-2">
            {(['OK', 'DAÑADO', 'PENDIENTE'] as CargoStatus[]).map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setFormData(prev => ({...prev, cargoStatus: status}))}
                className={`py-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all
                  ${formData.cargoStatus === status 
                    ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-500' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {status === 'OK' && <Check className="w-5 h-5 mb-1" />}
                {status === 'DAÑADO' && <AlertTriangle className="w-5 h-5 mb-1" />}
                {status === 'PENDIENTE' && <Clock className="w-5 h-5 mb-1" />}
                {status}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-semibold tracking-wide text-slate-700 uppercase">OBSERVACIONES</label>
            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleInputChange}
              placeholder="Detalles adicionales sobre la carga..."
              className="resize-none h-24 w-full rounded-xl bg-slate-100 px-4 py-3 text-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            />
          </div>
        </Card>

        {validationError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm font-medium">
            {validationError}
          </div>
        )}

        <Button size="lg" className="w-full mt-4" onClick={handleNextStep}>
          Continuar a Evidencias &nbsp; →
        </Button>
      </div>
    );
  }

  // STEP 2: EVIDENCES
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep(1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200">
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
        <div>
          <p className="text-xs font-bold text-slate-500 tracking-widest">PASO 2 DE 2</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Evidencias y Firma</h1>
        </div>
      </div>

      <Card className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
           <Camera className="w-5 h-5 text-slate-800" />
           <h3 className="text-lg font-bold text-slate-900">Captura de Fotos</h3>
        </div>

        <div>
          <p className="font-bold text-slate-900 mb-1">Foto Mercancía</p>
          <p className="text-sm text-slate-500 mb-3">Estado de la mercancía y disposición</p>
          <div className="flex flex-wrap gap-3">
            {cargoPhotos.map((photo, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                <img src={photo} alt="Mercancía" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setCargoPhotos(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-red-500 p-1 rounded-full text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handlePhotoCapture(e, 'cargo')} />
              <Camera className="w-6 h-6 text-slate-400" />
            </label>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="font-bold text-slate-900 mb-1">Foto Albarán</p>
          <p className="text-sm text-slate-500 mb-3">Documento firmado legible</p>
          {waybillPhoto ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
               <img src={waybillPhoto} alt="Albarán" className="w-full h-full object-cover" />
               <button 
                 onClick={() => setWaybillPhoto(null)}
                 className="absolute top-2 right-2 bg-red-500 p-2 rounded-full text-white"
               >
                 <X className="w-4 h-4" />
               </button>
            </div>
          ) : (
            <label className="w-full h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handlePhotoCapture(e, 'waybill')} />
              <Camera className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-400 tracking-widest">SIN CAPTURA</span>
            </label>
          )}
        </div>
      </Card>

      <Card className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
           <h3 className="text-lg font-bold text-slate-900">Firma del Transportista</h3>
           <button 
             type="button" 
             onClick={() => signatureRef.current?.clear()}
             className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
           >
             LIMPIAR
           </button>
        </div>
        
        <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white relative">
           <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
           <p className="absolute inset-x-0 top-[40%] text-center text-slate-300 font-bold text-xl pointer-events-none uppercase tracking-widest">Firme Aquí</p>
           <SignatureCanvas 
              ref={signatureRef} 
              penColor="#0f172a"
              canvasProps={{className: 'w-full h-48 relative z-10'}} 
           />
        </div>
        <p className="text-xs text-center text-slate-500 font-medium leading-relaxed px-4">
          Al firmar, confirma que la mercancía ha sido entregada/recogida según las condiciones pactadas.
        </p>
      </Card>

      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
         <UploadCloud className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
         <div>
           <p className="text-sm font-bold text-amber-900 mb-1">SINCRONIZACIÓN AUTOMÁTICA</p>
           <p className="text-xs text-amber-700 leading-relaxed">
             Tras pulsar finalizar, los datos y evidencias serán enviados instantáneamente a los sistemas centrales (Make/Excel) para su procesamiento.
           </p>
         </div>
      </div>

      {validationError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm font-medium">
          {validationError}
        </div>
      )}

      <Button size="lg" className="w-full mt-2 gap-3 shadow-lg" onClick={submitRecord} disabled={isSubmitting}>
        {isSubmitting ? 'ENVIANDO...' : 'FINALIZAR Y ENVIAR REGISTRO'}
        {!isSubmitting && <ArrowUpFromLine className="w-5 h-5 rotate-45" />}
      </Button>
    </div>
  );
}

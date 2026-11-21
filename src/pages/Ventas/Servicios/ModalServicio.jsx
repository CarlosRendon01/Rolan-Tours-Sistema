import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Save, X, Plus, Trash2, Search } from 'lucide-react';
import { API_CONFIG } from '../../../config/api';
import '../Clientes/Modales/ModalCrearClienteLead.css';
import './ServiciosCliente.css';

const initial = { proveedor_id: '', nombre: '', tipo_servicio: '', cantidad: 1, precio_unitario: '', descripcion: '', origen: '', destino: '', num_pasajeros: '', fecha_salida: '', fecha_regreso: '', hora_salida: '', hora_regreso: '' };
const fields = [['nombre','Nombre del servicio','text'],['tipo_servicio','Tipo de servicio','text'],['cantidad','Cantidad','number'],['precio_unitario','Importe por servicio','number'],['origen','Origen','text'],['destino','Destino','text'],['num_pasajeros','Pasajeros','number'],['fecha_salida','Fecha de inicio','date'],['fecha_regreso','Fecha de fin','date'],['hora_salida','Hora de inicio','time'],['hora_regreso','Hora de fin','time']];
export default function ModalServicio({ cliente, lead, servicio, onClose, onSaved }) {
  const [form, setForm] = useState(() => Object.fromEntries(Object.keys(initial).map((key) => [key, servicio?.[key] ?? initial[key]])));
  const [catalog,setCatalog] = useState([]);
  const [query,setQuery] = useState('');
  const [providerFilter,setProviderFilter] = useState('');
  const [typeFilter,setTypeFilter] = useState('');
  const [lines,setLines] = useState(() => (servicio?.partidas || []).map(({catalogo_tipo,catalogo_id,proveedor_id,nombre,tipo,cantidad,precio_unitario,proveedor}) => ({catalogo_tipo,catalogo_id,proveedor_id,nombre,tipo:tipo || '',cantidad,precio_unitario,proveedor_nombre:proveedor?.nombre_razon_social})));
  const updateLine = (index,key,value) => setLines((current) => current.map((line,i) => i === index ? {...line,[key]:value} : line));
  const total = lines.reduce((sum,line) => sum + Math.round(Number(line.cantidad)*Number(line.precio_unitario)*100)/100,0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector('input,select,button')?.focus();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${API_CONFIG.BASE_URL}/servicios/catalogo`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, signal: controller.signal })
      .then(({ data }) => { setCatalog(data); setLoaded(true); })
      .catch((cause) => { if (!axios.isCancel(cause)) setError('No se pudo cargar la lista de servicios de proveedores.'); });
    return () => controller.abort();
  }, []);
  const providerOptions = [...new Map(catalog.map((item) => [String(item.proveedor_id),{id:item.proveedor_id,nombre:item.proveedor}])).values()];
  const types = [...new Set(catalog.map((item) => item.tipo))];
  const available = catalog.filter((item) => (!providerFilter || String(item.proveedor_id)===providerFilter) && (!typeFilter || item.tipo===typeFilter) && `${item.nombre} ${item.proveedor} ${item.descripcion || ''}`.toLowerCase().includes(query.toLowerCase()));
  const add = (item) => setLines((current) => {
    const match = current.findIndex((line) => line.catalogo_tipo===item.catalogo_tipo && Number(line.catalogo_id)===Number(item.catalogo_id));
    if (match>=0) return current;
    return [...current,{catalogo_tipo:item.catalogo_tipo,catalogo_id:item.catalogo_id,proveedor_id:item.proveedor_id,proveedor_nombre:item.proveedor,nombre:item.nombre,tipo:item.tipo,cantidad:1,precio_unitario:item.moneda==='MXN' ? item.precio_unitario : ''}];
  });
  const close = () => { if (!busy) onClose(); };
  const save = async (event) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const payload = { ...Object.fromEntries(Object.entries(form).filter(([key]) => !['proveedor_id','cantidad','precio_unitario'].includes(key)).map(([key,value]) => [key,value === '' ? null : value])), partidas:lines.map((line) => ({catalogo_tipo:line.catalogo_tipo || null,catalogo_id:line.catalogo_id || null,proveedor_id:line.proveedor_id,nombre:line.nombre,tipo:line.tipo,cantidad:line.cantidad,precio_unitario:line.precio_unitario})), cliente_id: cliente.id, lead_id: lead.id };
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      if (servicio) await axios.put(`${API_CONFIG.BASE_URL}/servicios/${servicio.id}`,payload,config);
      else await axios.post(`${API_CONFIG.BASE_URL}/servicios`,payload,config);
      await onSaved?.(); onClose();
    } catch (cause) { setError(Object.values(cause.response?.data?.errors || {}).flat().join(' ') || cause.response?.data?.message || 'No se pudo guardar el servicio.'); }
    finally { setBusy(false); }
  };
  return <div className="nuevo-cliente-overlay" onClick={close} onKeyDown={(event) => {
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const controls = Array.from(dialog.current.querySelectorAll('input,select,textarea,button')).filter((el) => !el.disabled);
      const first = controls[0]; const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }}><section ref={dialog} className="nuevo-cliente-modal servicio-modal" role="dialog" aria-modal="true" aria-labelledby="servicio-heading" onClick={(event) => event.stopPropagation()}>
    <header className="nuevo-cliente-header"><div><h2 id="servicio-heading">{servicio ? 'Editar servicio' : 'Crear conjunto de servicios'}</h2><p>{cliente.nombre} · {lead.nombre || `Lead #${lead.id}`}</p></div><button type="button" className="nuevo-cliente-close" onClick={close} disabled={busy} aria-label="Cerrar"><X size={20}/></button></header>
    <form onSubmit={save}><div className="nuevo-cliente-content">
      <div className="servicio-contexto"><span>Cliente<strong>{cliente.nombre}</strong></span><span>Lead<strong>{lead.nombre || `#${lead.id}`}</strong></span></div>
      <fieldset disabled={busy}><legend>Conjunto de servicios del lead</legend><div className="nuevo-cliente-grid">
        <label className="nuevo-cliente-wide">Nombre del conjunto *<input required value={form.nombre} onChange={(e) => setForm({...form,nombre:e.target.value})} placeholder="Por ejemplo: Programa Oaxaca"/></label>
        <label className="nuevo-cliente-wide">Comentarios e itinerario general<textarea rows={3} value={form.descripcion} onChange={(e) => setForm({...form,descripcion:e.target.value})}/></label>
      </div></fieldset>
      <fieldset disabled={busy}><legend>Servicios registrados de proveedores</legend><p className="nuevo-cliente-help">Selecciona de los servicios que ya están vinculados a tus proveedores. Puedes filtrar por tipo o proveedor y añadir varios al conjunto.</p>
        <div className="nuevo-cliente-grid servicio-catalogo-filtros"><label>Tipo<select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option value="">Todos los tipos</option>{types.map((type) => <option key={type}>{type}</option>)}</select></label><label>Proveedor<select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}><option value="">Todos los proveedores</option>{providerOptions.map((provider) => <option key={provider.id} value={provider.id}>{provider.nombre}</option>)}</select></label><label className="nuevo-cliente-wide"><span><Search size={14}/> Buscar servicio</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nombre, descripción o proveedor"/></label></div>
        <ul className="servicio-catalogo-lista" aria-label="Servicios disponibles">{available.map((item) => <li key={item.key}><div><strong>{item.nombre}</strong><small>{item.tipo} · {item.proveedor}</small>{item.descripcion && <small>{item.descripcion}</small>}<small>{item.catalogo_tipo==='proveedor' ? 'Importe a capturar en el conjunto' : `${Number(item.precio_unitario || 0).toLocaleString('es-MX',{style:'currency',currency:item.moneda || 'MXN'})} ${item.moneda || 'MXN'}`}</small></div><button type="button" className="servicio-agregar-concepto" disabled={lines.length>=100 || lines.some((line) => line.catalogo_tipo===item.catalogo_tipo && Number(line.catalogo_id)===Number(item.catalogo_id))} onClick={() => add(item)} aria-label={`Agregar ${item.nombre} de ${item.proveedor}`}><Plus size={16}/>{lines.some((line) => line.catalogo_tipo===item.catalogo_tipo && Number(line.catalogo_id)===Number(item.catalogo_id)) ? 'Seleccionado' : 'Añadir'}</button></li>)}</ul>
        {!loaded ? <p>Cargando servicios...</p> : available.length===0 && <p>No hay servicios registrados que coincidan con los filtros.</p>}
      </fieldset>
      <fieldset disabled={busy}><legend>Productos seleccionados ({lines.length})</legend><p className="nuevo-cliente-help">Cada producto se selecciona una sola vez, con su proveedor. Ajusta la cantidad en su renglón o quítalo si no lo necesitas. Los importes del conjunto están en MXN; si la tarifa de origen está en otra moneda, ingresa aquí el importe acordado en MXN.</p>
        {lines.length===0 ? <p>Añade al menos un servicio de la lista.</p> : <ul className="servicio-seleccion-lista">{lines.map((line,index) => <li key={`${line.catalogo_tipo || 'anterior'}:${line.catalogo_id || index}`}><div className="servicio-seleccion-nombre"><strong>{line.nombre}</strong><small>{line.tipo} · {line.proveedor_nombre || providerOptions.find((provider) => Number(provider.id)===Number(line.proveedor_id))?.nombre || 'Proveedor registrado'}</small></div><label>Cantidad<input required type="number" min="1" max="100000" value={line.cantidad} onChange={(e) => updateLine(index,'cantidad',e.target.value)}/></label><label>Importe unitario (MXN)<input required type="number" min="0" step="0.01" value={line.precio_unitario} onChange={(e) => updateLine(index,'precio_unitario',e.target.value)}/></label><strong>{Number(line.cantidad*line.precio_unitario || 0).toLocaleString('es-MX',{style:'currency',currency:'MXN'})}</strong><button type="button" className="servicio-quitar" aria-label={`Quitar ${line.nombre}`} onClick={() => setLines(lines.filter((_,i) => i!==index))}><Trash2 size={16}/></button></li>)}</ul>}
      </fieldset>
      <fieldset disabled={busy}><legend>Fechas y recorrido</legend><div className="nuevo-cliente-grid">{fields.slice(4).map(([key,label,type]) => <label key={key}>{label}<input type={type} min={key === 'num_pasajeros' ? 1 : key === 'fecha_regreso' ? form.fecha_salida : undefined} value={form[key]} onChange={(e) => setForm({ ...form, [key]:e.target.value })}/></label>)}</div></fieldset>
      <p className="servicio-total">Total del conjunto<strong>{Number(total || 0).toLocaleString('es-MX',{style:'currency',currency:'MXN'})}</strong></p>
      {error && <p role="alert" className="nuevo-cliente-error">{error}</p>}
    </div><footer className="nuevo-cliente-footer"><button type="button" onClick={close} disabled={busy}>Cancelar</button><button disabled={busy || !loaded || lines.length===0}><Save size={16}/>{busy ? 'Guardando...' : 'Guardar conjunto'}</button></footer></form>
  </section></div>;
}

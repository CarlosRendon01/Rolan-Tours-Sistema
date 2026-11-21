import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Edit, Trash2, CreditCard, FileText, ChevronLeft, ChevronRight, X, ClipboardList } from 'lucide-react';
import PrincipalComponente from '../../Generales/Componentes/PrincipalComponente';
import ModalServicio from './ModalServicio';
import { API_CONFIG } from '../../../config/api';
import '../Clientes/TablaClientes.css';
import '../Clientes/Modales/ModalCrearClienteLead.css';
import './ServiciosCliente.css';

const money = (value) => Number(value || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
const errorText = (error) => Object.values(error.response?.data?.errors || {}).flat().join(' ') || error.response?.data?.message || error.response?.data?.error || 'No se pudo completar la operación.';
const options = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const api = (path) => `${API_CONFIG.BASE_URL}/${path}`;

export default function ServiciosCliente() {
  const [params] = useSearchParams();
  const scope = new URLSearchParams([...params.entries()].filter(([key]) => ['lead_id','cliente_id'].includes(key))).toString();
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(null);
  const [order, setOrder] = useState(null);
  const [vehicle, setVehicle] = useState('');
  const [operators,setOperators] = useState([]);
  const [operator,setOperator] = useState('');
  const [address,setAddress] = useState('');
  const [paymentMethod,setPaymentMethod] = useState('transferencia');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const permissions = JSON.parse(localStorage.getItem('user') || '{}').permisos || [];
  const canEdit = permissions.includes('ventas.servicios.editar');
  const canDelete = permissions.includes('ventas.servicios.eliminar');
  const load = async () => { const { data } = await axios.get(api(`servicios?${scope}`), options()); setServices(data); };
  useEffect(() => {
    const controller = new AbortController();
    axios.get(api(`servicios?${scope}`), { ...options(), signal:controller.signal })
      .then(({ data }) => setServices(data))
      .catch((cause) => { if (!axios.isCancel(cause)) setError(errorText(cause)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [scope]);
  const act = async (operation) => { setBusy(true); setError(''); try { await operation(); await load(); } catch (cause) { setError(errorText(cause)); } finally { setBusy(false); } };
  const payment = (service) => act(async () => {
    await axios.post(api('pagos'), { servicio_id: service.id, cliente_id: service.cliente_id, numero_contrato: `SER-${service.id}-${Date.now()}`, monto_total: service.total, numero_abonos: 1 }, options());
    setNotice('Plan creado. Puedes registrar sus abonos en Pagos.');
  });
  const openOrder = (service) => act(async () => {
    const [vehiclesResponse,operatorsResponse] = await Promise.all(['vehiculos','operadores'].map((path) => axios.get(api(path),options())));
    setVehicles(vehiclesResponse.data.data || vehiclesResponse.data); setOperators(operatorsResponse.data.data || operatorsResponse.data); setOrder(service); setVehicle(''); setOperator(''); setAddress(service.cliente?.direccion || '');
  });
  const filtered = services.filter((s) => `${s.nombre} ${s.folio} ${s.cliente?.nombre} ${s.lead?.nombre} ${s.partidas?.map((p) => p.nombre+' '+p.proveedor?.nombre_razon_social).join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1,Math.ceil(filtered.length / limit));
  const current = Math.min(page,pages);
  const visible = filtered.slice((current-1)*limit,current*limit);
  return <PrincipalComponente><main className="clientes-contenedor-principal servicios-cliente-pagina">
    <div className="clientes-encabezado"><div className="clientes-seccion-logo"><div className="clientes-lineas-decorativas">{['roja','azul','verde','amarilla'].map((color) => <div key={color} className={`clientes-linea clientes-${color}`}/>)}</div><h1 className="clientes-titulo">Gestión de Servicios</h1></div><div className="clientes-contenedor-estadisticas"><div className="clientes-estadistica"><div className="clientes-icono-estadistica-circular"><ClipboardList size={22}/></div><span className="clientes-label-estadistica">SERVICIOS: {services.length}</span></div><div className="clientes-estadistica"><div className="clientes-icono-estadistica-cuadrado"><FileText size={22}/></div><span className="clientes-label-estadistica">ÓRDENES: {services.reduce((sum,s) => sum+s.ordenes.length,0)}</span></div></div></div>
    <div className="servicios-introduccion"><p>{scope ? 'Servicios del lead seleccionado.' : 'Consulta los servicios, sus pagos y órdenes. Para añadir uno, abre el lead en Clientes.'}</p><Link className="clientes-boton-nuevo" to="/clientes">Ir a Clientes y Leads</Link>{scope && <Link to="/servicios-clientes">Ver todos los servicios</Link>}</div>
    {error && <p role="alert" className="nuevo-cliente-error servicios-aviso">{error}</p>}{notice && <p role="status" className="servicios-aviso">{notice}</p>}
    <div className="clientes-controles"><div className="clientes-control-registros"><label htmlFor="servicios-limit">Mostrar</label><select id="servicios-limit" className="clientes-selector-registros" value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>{[10,25,50].map((n) => <option key={n}>{n}</option>)}</select><span>registros</span></div><div className="clientes-control-busqueda"><label htmlFor="servicios-search">Buscar:</label><div className="clientes-entrada-busqueda"><Search size={18} className="clientes-icono-buscar"/><input id="servicios-search" className="clientes-entrada-buscar" placeholder="Servicio, cliente, lead o proveedor" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}/></div></div></div>
    <div className="clientes-contenedor-tabla"><table className="clientes-tabla"><thead><tr className="clientes-fila-encabezado"><th>Servicio</th><th>Cliente / lead</th><th>Proveedores</th><th>Conceptos</th><th>Total</th><th>Pagos / órdenes</th><th>Acciones</th></tr></thead><tbody>
      {loading ? <tr><td colSpan={7}>Cargando servicios...</td></tr> : visible.length === 0 ? <tr><td colSpan={7} className="servicios-vacio">No hay servicios para mostrar. Puedes añadirlos desde el lead en Clientes.</td></tr> : visible.map((s) => <tr className="clientes-fila-cliente" key={s.id}>
        <td data-label="Servicio"><strong>{s.nombre}</strong><small>{s.folio}</small><small>{s.descripcion}</small>{s.partidas?.map((line) => <small key={line.id}>{line.cantidad} × {line.nombre} · {money(line.total)}</small>)}</td><td data-label="Cliente / lead">{s.cliente?.nombre}<small>{s.lead?.nombre || 'Sin lead'}</small></td><td data-label="Proveedor">{[...new Set((s.partidas || []).map((line) => line.proveedor?.nombre_razon_social).filter(Boolean))].join(', ') || 'Sin proveedor'}</td><td data-label="Cantidad">{s.partidas?.length || 0}</td><td data-label="Total"><strong>{money(s.total)}</strong></td><td data-label="Pagos / órdenes"><Link to="/pagos">{s.pagos.length} planes de pago</Link><br/><Link to="/orden-servicio">{s.ordenes.length} órdenes</Link>{s.contrato && <><br/><Link to="/contratos">Contrato</Link></>}{s.reserva && <><br/><Link to="/reservas">Reserva</Link></>}</td>
        <td data-label="Acciones"><div className="clientes-botones-accion">{canEdit && <><button className="clientes-boton-accion clientes-editar" title="Editar servicio" aria-label={`Editar ${s.nombre}`} disabled={busy || s.pagos.length > 0 || s.ordenes.length > 0 || s.contrato || s.reserva || !s.cliente || !s.lead} onClick={() => { setForm(s); setError(''); }}><Edit size={16}/></button><button className="clientes-boton-accion clientes-ver" title="Crear plan de pagos" aria-label={`Crear plan de pagos de ${s.nombre}`} disabled={busy || s.pagos.length > 0} onClick={() => payment(s)}><CreditCard size={16}/></button><button className="clientes-boton-accion clientes-ver" title="Generar orden, contrato, reserva y plan de pagos" aria-label={`Generar documentos de ${s.nombre}`} disabled={busy || (s.ordenes.length > 0 && !!s.contrato && !!s.reserva)} onClick={() => openOrder(s)}><FileText size={16}/></button></>}{canDelete && <button className="clientes-boton-accion clientes-eliminar" title="Eliminar servicio" aria-label={`Eliminar ${s.nombre}`} disabled={busy} onClick={() => { if (window.confirm('¿Eliminar este servicio?')) act(() => axios.delete(api(`servicios/${s.id}`),options())); }}><Trash2 size={16}/></button>}</div></td>
      </tr>)}
    </tbody></table></div>
    <div className="clientes-pie-tabla"><span className="clientes-informacion-registros">{filtered.length} servicios encontrados</span><div className="clientes-controles-paginacion"><button className="clientes-boton-paginacion" disabled={current===1} onClick={() => setPage(current-1)}><ChevronLeft size={18}/>Anterior</button><span>{current} / {pages}</span><button className="clientes-boton-paginacion" disabled={current===pages} onClick={() => setPage(current+1)}>Siguiente<ChevronRight size={18}/></button></div></div>
    {form && <ModalServicio cliente={form.cliente} lead={form.lead} servicio={form} onClose={() => setForm(null)} onSaved={async () => { await load(); setNotice('Servicio actualizado.'); }}/>} 
    {order && <div className="nuevo-cliente-overlay"><section className="nuevo-cliente-modal servicio-modal" role="dialog" aria-modal="true" aria-labelledby="order-heading"><header className="nuevo-cliente-header"><div><h2 id="order-heading">Generar documentos del conjunto</h2><p>{order.nombre}</p></div><button className="nuevo-cliente-close" disabled={busy} onClick={() => setOrder(null)} aria-label="Cerrar"><X size={20}/></button></header><div className="nuevo-cliente-content"><label>Unidad *<select value={vehicle} onChange={(e) => setVehicle(e.target.value)}><option value="">Selecciona una unidad</option>{vehicles.filter((v) => !v.deleted_at && v.activo !== false).map((v) => <option key={v.id} value={v.id}>{v.marca} {v.modelo} · {v.numero_placa}</option>)}</select></label><label>Conductor *<select value={operator} onChange={(e) => setOperator(e.target.value)}><option value="">Selecciona un conductor</option>{operators.filter((item) => item.activo !== false && !item.deleted_at).map((item) => <option key={item.id} value={item.id}>{[item.nombre,item.apellido_paterno,item.apellido_materno].filter(Boolean).join(' ')}</option>)}</select></label><label>Domicilio del contrato *<input value={address} onChange={(e) => setAddress(e.target.value)}/></label><label>Forma de pago de la reserva<select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}><option value="transferencia">Transferencia</option><option value="efectivo">Efectivo</option></select></label><p>Se generará una sola orden con esta unidad y conductor, un contrato y una reserva que incluyan todos los conceptos. El plan de pagos existente se conserva; si no existe, se crea con el total del conjunto.</p>{error && <p role="alert" className="nuevo-cliente-error">{error}</p>}</div><footer className="nuevo-cliente-footer"><button disabled={busy} onClick={() => setOrder(null)}>Cancelar</button><button disabled={busy || !vehicle || !operator || !address.trim()} onClick={() => act(async () => { const { data } = await axios.post(api(`servicios/${order.id}/documentos`),{vehiculo_id:vehicle,operador_id:operator,domicilio:address,forma_pago:paymentMethod},options()); setOrder(null); setNotice(`Orden ${data.orden.folio}, contrato, reserva y plan de pagos listos para el conjunto.`); })}>Generar documentos</button></footer></section></div>}
  </main></PrincipalComponente>;
}

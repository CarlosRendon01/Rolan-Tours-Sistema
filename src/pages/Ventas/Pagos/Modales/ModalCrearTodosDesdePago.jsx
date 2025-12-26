import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { X, Save, FileText, AlertCircle, Calendar, User, MapPin, Car, Users } from 'lucide-react';
import '../../Pagos/ModalesAbonos/ModalAgregarAbono.css';

const ModalCrearTodosDesdePago = ({ estaAbierto, pago, alCerrar }) => {
    const navigate = useNavigate();
    const [guardando, setGuardando] = useState(false);
    const [errores, setErrores] = useState({});
    const [seccionActiva, setSeccionActiva] = useState('orden');
    const [cargandoFolios, setCargandoFolios] = useState(false);
    const [conductoresDisponibles, setConductoresDisponibles] = useState([]);
    const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
    const [coordinadoresDisponibles, setCoordinadoresDisponibles] = useState([]);
    const [guiasDisponibles, setGuiasDisponibles] = useState([]);
    const [conductoresFiltrados, setConductoresFiltrados] = useState([]);
    const [vehiculosFiltrados, setVehiculosFiltrados] = useState([]);
    const [ordenesExistentes, setOrdenesExistentes] = useState([]);

    const [formulario, setFormulario] = useState({
        // Orden
        folio_orden: '',
        fecha_orden_servicio: new Date().toISOString().split('T')[0],
        conductor_id: '',
        vehiculo_id: '',

        // Contrato
        domicilio: '',
        rfc: '',
        tipo_pasaje: 'Turismo Estatal',
        n_unidades_contratadas: '1',

        // Reserva
        folio_reserva: '',
        fecha_reserva: new Date().toISOString().split('T')[0],
        num_habitantes: '1',
        servicio: '',
        forma_pago: 'efectivo',
        pagado: 'no pagado',

        coordinador_id: '',
        guia_id: '',
    });

    // Función para obtener el siguiente folio disponible
    const obtenerSiguienteFolio = async () => {
        setCargandoFolios(true);
        try {
            const token = localStorage.getItem('token');

            // Obtener siguiente folio de orden
            const resOrden = await axios.get('http://127.0.0.1:8000/api/ordenes-servicio/siguiente-folio', {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
            });

            // Obtener siguiente folio de reserva
            const resReserva = await axios.get('http://127.0.0.1:8000/api/reservas/siguiente-folio', {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
            });

            setFormulario(prev => ({
                ...prev,
                folio_orden: resOrden.data.siguiente_folio || '1',
                folio_reserva: resReserva.data.siguiente_folio || '1'
            }));

        } catch (error) {
            console.error('Error al obtener folios:', error);
            // Si falla, usar valor por defecto
            setFormulario(prev => ({
                ...prev,
                folio_orden: '1',
                folio_reserva: '1'
            }));
        } finally {
            setCargandoFolios(false);
        }
    };

    // Cargar folios al abrir el modal
    useEffect(() => {
        const cargarDatos = async () => {
            if (!estaAbierto || !pago) return;

            try {
                const token = localStorage.getItem('token');

                const [conductores, vehiculos, coordinadores, guias, ordenes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/ordenes-servicio/conductores/disponibles', {
                        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
                    }),
                    axios.get('http://127.0.0.1:8000/api/ordenes-servicio/vehiculos/disponibles', {
                        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
                    }),
                    axios.get('http://127.0.0.1:8000/api/coordinadores', {
                        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
                    }),
                    axios.get('http://127.0.0.1:8000/api/guias', {
                        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
                    }),
                    axios.get('http://127.0.0.1:8000/api/ordenes-servicio', {
                        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
                    })
                ]);

                setConductoresDisponibles(conductores.data || []);
                setVehiculosDisponibles(vehiculos.data || []);
                setCoordinadoresDisponibles(coordinadores.data || []);
                setGuiasDisponibles(guias.data || []);
                setOrdenesExistentes(ordenes.data || []);

            } catch (error) {
                console.error('Error al cargar datos:', error);
            }

            // Resetear formulario
            setFormulario({
                folio_orden: '',
                fecha_orden_servicio: new Date().toISOString().split('T')[0],
                conductor_id: '',
                vehiculo_id: '',
                coordinador_id: '',
                guia_id: '',
                domicilio: '',
                rfc: pago.cotizacion?.cliente?.rfc || '',
                tipo_pasaje: 'Turismo Estatal',
                n_unidades_contratadas: '1',
                folio_reserva: '',
                fecha_reserva: new Date().toISOString().split('T')[0],
                num_habitantes: '1',
                servicio: pago.cotizacion?.descripcion || '',
                forma_pago: 'efectivo',
                pagado: 'no pagado',
            });
            setErrores({});

            // Obtener folios
            obtenerSiguienteFolio();
        };

        cargarDatos();
    }, [estaAbierto, pago]);

    const manejarCambio = (campo, valor) => {
        setFormulario(prev => ({ ...prev, [campo]: valor }));
        if (errores[campo]) {
            setErrores(prev => ({ ...prev, [campo]: null }));
        }
    };

    useEffect(() => {
        if (conductoresDisponibles.length > 0 && ordenesExistentes.length > 0) {
            const conductoresAsignados = ordenesExistentes
                .filter(o => o.operador_id)
                .map(o => parseInt(o.operador_id));

            const conductoresLibres = conductoresDisponibles.filter(
                c => !conductoresAsignados.includes(c.id)
            );

            setConductoresFiltrados(conductoresLibres);
        } else {
            setConductoresFiltrados(conductoresDisponibles);
        }
    }, [conductoresDisponibles, ordenesExistentes]);

    useEffect(() => {
        if (vehiculosDisponibles.length > 0 && ordenesExistentes.length > 0) {
            const vehiculosAsignados = ordenesExistentes
                .filter(o => o.vehiculo_id)
                .map(o => parseInt(o.vehiculo_id));

            const vehiculosLibres = vehiculosDisponibles.filter(
                v => !vehiculosAsignados.includes(v.id)
            );

            setVehiculosFiltrados(vehiculosLibres);
        } else {
            setVehiculosFiltrados(vehiculosDisponibles);
        }
    }, [vehiculosDisponibles, ordenesExistentes]);

    const validarFormulario = () => {
        const nuevosErrores = {};

        // Validar Orden
        if (!formulario.folio_orden) nuevosErrores.folio_orden = 'El folio de orden es obligatorio';
        if (!formulario.fecha_orden_servicio) nuevosErrores.fecha_orden_servicio = 'La fecha es obligatoria';

        // Validar Contrato
        if (!formulario.domicilio.trim()) nuevosErrores.domicilio = 'El domicilio es obligatorio';
        if (!formulario.tipo_pasaje) nuevosErrores.tipo_pasaje = 'El tipo de pasaje es obligatorio';
        if (!formulario.n_unidades_contratadas) nuevosErrores.n_unidades_contratadas = 'Las unidades son obligatorias';

        // Validar Reserva
        if (!formulario.folio_reserva) nuevosErrores.folio_reserva = 'El folio de reserva es obligatorio';
        if (!formulario.fecha_reserva) nuevosErrores.fecha_reserva = 'La fecha de reserva es obligatoria';
        if (!formulario.num_habitantes) nuevosErrores.num_habitantes = 'El número de habitantes es obligatorio';
        if (!formulario.servicio.trim()) nuevosErrores.servicio = 'La descripción del servicio es obligatoria';

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const manejarEnviar = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            // Cambiar a la sección con errores
            if (errores.folio_orden || errores.fecha_orden_servicio) setSeccionActiva('orden');
            else if (errores.domicilio || errores.tipo_pasaje) setSeccionActiva('contrato');
            else if (errores.folio_reserva || errores.servicio) setSeccionActiva('reserva');
            return;
        }

        setGuardando(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                await Swal.fire({ icon: 'error', title: 'Sesión expirada' });
                navigate('/');
                return;
            }

            const response = await axios.post(
                `http://127.0.0.1:8000/api/pagos/${pago.id}/crear-todos`,
                formulario,
                { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
            );

            console.log('✅ Todo creado:', response.data);

            alCerrar();

            await Swal.fire({
                title: '¡Todo Creado Exitosamente!',
                html: `
                    <div style="text-align: left; padding: 1rem;">
                        <p><strong>✅ Orden de Servicio:</strong> #${formulario.folio_orden}</p>
                        <p><strong>✅ Contrato:</strong> Creado</p>
                        <p><strong>✅ Reserva:</strong> #${formulario.folio_reserva}</p>
                        <hr style="margin: 1rem 0;">
                        <p><strong>Cliente:</strong> ${pago.cotizacion?.cliente?.nombre || 'N/A'}</p>
                        <p><strong>Total:</strong> $${parseFloat(pago.planPago?.montoTotal || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'Ver Órdenes',
            });

            navigate('/orden-servicio', { replace: true });

        } catch (error) {
            console.error('❌ Error:', error);

            if (error.response?.status === 401) {
                await Swal.fire({ icon: 'error', title: 'Sesión expirada' });
                localStorage.clear();
                navigate('/login');
                return;
            }

            // Mostrar errores específicos del backend
            const mensaje = error.response?.data?.message ||
                error.response?.data?.error ||
                'No se pudo crear';

            await Swal.fire({
                title: 'Error',
                text: mensaje,
                icon: 'error',
            });
        } finally {
            setGuardando(false);
        }
    };

    if (!estaAbierto || !pago) return null;

    return (
        <div className="modal-abono-overlay" onClick={alCerrar}>
            <div className="modal-abono-contenedor" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
                {/* Header */}
                <div className="modal-abono-header">
                    <div>
                        <h2 className="modal-abono-titulo">Crear Orden + Contrato + Reserva</h2>
                        <p className="modal-abono-subtitulo">
                            Pago: {pago.numeroContrato} - Cliente: {pago.cliente?.nombre || 'Sin cliente'}
                        </p>
                        {cargandoFolios && (
                            <p style={{ color: '#3b82f6', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                Cargando folios automáticos...
                            </p>
                        )}
                    </div>
                    <button className="modal-abono-boton-cerrar" onClick={alCerrar} disabled={guardando}>
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: '1.5rem' }}>
                    {['orden', 'contrato', 'reserva'].map(seccion => (
                        <button
                            key={seccion}
                            onClick={() => setSeccionActiva(seccion)}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                border: 'none',
                                background: seccionActiva === seccion ? '#3b82f6' : 'transparent',
                                color: seccionActiva === seccion ? 'white' : '#6b7280',
                                fontWeight: seccionActiva === seccion ? '600' : '400',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                borderBottom: seccionActiva === seccion ? '3px solid #2563eb' : 'none'
                            }}
                        >
                            {seccion === 'orden' && <FileText size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />}
                            {seccion === 'contrato' && <FileText size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />}
                            {seccion === 'reserva' && <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />}
                            {seccion.charAt(0).toUpperCase() + seccion.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <form onSubmit={manejarEnviar} className="modal-abono-body">
                    {/* SECCIÓN ORDEN */}
                    {seccionActiva === 'orden' && (
                        <div className="modal-abono-seccion">
                            <div className="modal-abono-campo-grupo">
                                <div className="modal-abono-campo">
                                    <label className="modal-abono-label">Folio Orden (Auto) *</label>
                                    <input
                                        type="text"
                                        value={formulario.folio_orden}
                                        className={`modal-abono-input ${errores.folio_orden ? 'error' : ''}`}
                                        disabled={true}
                                        style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                                    />
                                    {errores.folio_orden && (
                                        <p className="modal-abono-error"><AlertCircle size={12} /> {errores.folio_orden}</p>
                                    )}
                                </div>

                                <div className="modal-abono-campo">
                                    <label className="modal-abono-label">Fecha Orden *</label>
                                    <input
                                        type="date"
                                        value={formulario.fecha_orden_servicio}
                                        onChange={(e) => manejarCambio('fecha_orden_servicio', e.target.value)}
                                        className={`modal-abono-input ${errores.fecha_orden_servicio ? 'error' : ''}`}
                                        disabled={guardando}
                                    />
                                    {errores.fecha_orden_servicio && (
                                        <p className="modal-abono-error"><AlertCircle size={12} /> {errores.fecha_orden_servicio}</p>
                                    )}
                                </div>
                            </div>

                            {/* Conductor */}
                            <div className="modal-abono-campo">
                                <label className="modal-abono-label">
                                    <User size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                    Conductor (Opcional)
                                </label>
                                <select
                                    value={formulario.conductor_id}
                                    onChange={(e) => manejarCambio('conductor_id', e.target.value)}
                                    className="modal-abono-select"
                                    disabled={guardando}
                                >
                                    <option value="">-- Sin conductor --</option>
                                    {conductoresFiltrados.map((conductor) => (
                                        <option key={conductor.id} value={conductor.id}>
                                            {conductor.nombre_conductor} {conductor.apellido_paterno_conductor} {conductor.apellido_materno_conductor}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Vehículo */}
                            <div className="modal-abono-campo">
                                <label className="modal-abono-label">
                                    <Car size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                    Vehículo (Opcional)
                                </label>
                                <select
                                    value={formulario.vehiculo_id}
                                    onChange={(e) => manejarCambio('vehiculo_id', e.target.value)}
                                    className="modal-abono-select"
                                    disabled={guardando}
                                >
                                    <option value="">-- Sin vehículo --</option>
                                    {vehiculosFiltrados.map((vehiculo) => (
                                        <option key={vehiculo.id} value={vehiculo.id}>
                                            {vehiculo.nombre} - {vehiculo.numero_placa} ({vehiculo.marca} {vehiculo.modelo})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Coordinador */}
                            <div className="modal-abono-campo">
                                <label className="modal-abono-label">
                                    <Users size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                    Coordinador (Opcional)
                                </label>
                                <select
                                    value={formulario.coordinador_id}
                                    onChange={(e) => manejarCambio('coordinador_id', e.target.value)}
                                    className="modal-abono-select"
                                    disabled={guardando}
                                >
                                    <option value="">-- Sin coordinador --</option>
                                    {coordinadoresDisponibles.map((coord) => (
                                        <option key={coord.id} value={coord.id}>
                                            {coord.nombre} {coord.apellido_paterno} {coord.apellido_materno}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Guía */}
                            <div className="modal-abono-campo">
                                <label className="modal-abono-label">
                                    <User size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                    Guía Turístico (Opcional)
                                </label>
                                <select
                                    value={formulario.guia_id}
                                    onChange={(e) => manejarCambio('guia_id', e.target.value)}
                                    className="modal-abono-select"
                                    disabled={guardando}
                                >
                                    <option value="">-- Sin guía --</option>
                                    {guiasDisponibles.map((guia) => (
                                        <option key={guia.id} value={guia.id}>
                                            {guia.nombre} {guia.apellido_paterno} {guia.apellido_materno}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN CONTRATO */}
                    {seccionActiva === 'contrato' && (
                        <div className="modal-abono-seccion">
                            <div className="modal-abono-campo">
                                <label className="modal-abono-label">Domicilio *</label>
                                <input
                                    type="text"
                                    value={formulario.domicilio}
                                    onChange={(e) => manejarCambio('domicilio', e.target.value)}
                                    className={`modal-abono-input ${errores.domicilio ? 'error' : ''}`}
                                    disabled={guardando}
                                    placeholder="Calle, número, colonia..."
                                />
                                {errores.domicilio && (
                                    <p className="modal-abono-error"><AlertCircle size={12} /> {errores.domicilio}</p>
                                )}
                            </div>

                            <div className="modal-abono-campo-grupo">
                                <div className="modal-abono-campo">
                                    <label className="modal-abono-label">RFC</label>
                                    <input
                                        type="text"
                                        value={formulario.rfc}
                                        onChange={(e) => manejarCambio('rfc', e.target.value)}
                                        className="modal-abono-input"
                                        disabled={guardando}
                                        placeholder="XAXX010101000"
                                        maxLength="13"
                                    />
                                </div>

                                <div className="modal-abono-campo">
                                    <label className="modal-abono-label">Tipo de Pasaje *</label>
                                    <select
                                        value={formulario.tipo_pasaje}
                                        onChange={(e) => manejarCambio('tipo_pasaje', e.target.value)}
                                        className="modal-abono-select"
                                        disabled={guardando}
                                    >
                                        <option value="Turismo Estatal">Turismo Estatal</option>
                                        <option value="Turismo Internacional">Turismo Internacional</option>
                                        <option value="Nacional">Nacional</option>
                                        <option value="Escolar">Escolar</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-abono-campo">
                                <label className="modal-abono-label">N° Unidades Contratadas *</label>
                                <input
                                    type="number"
                                    value={formulario.n_unidades_contratadas}
                                    onChange={(e) => manejarCambio('n_unidades_contratadas', e.target.value)}
                                    className={`modal-abono-input ${errores.n_unidades_contratadas ? 'error' : ''}`}
                                    disabled={guardando}
                                    min="1"
                                />
                                {errores.n_unidades_contratadas && (
                                    <p className="modal-abono-error"><AlertCircle size={12} /> {errores.n_unidades_contratadas}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN RESERVA */}
                    {seccionActiva === 'reserva' && (
                        <div className="modal-abono-seccion">
                            <div className="modal-abono-campo-grupo">
                                <div className="modal-abono-campo">
                                    <label className="modal-abono-label">Folio Reserva (Auto) *</label>
                                    <input
                                        type="text"
                                        value={formulario.folio_reserva}
                                        className={`modal-abono-input ${errores.folio_reserva ? 'error' : ''}`}
                                        disabled={true}
                                        style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                                    />
                                    {errores.folio_reserva && (
                                        <p className="modal-abono-error"><AlertCircle size={12} /> {errores.folio_reserva}</p>
                                    )}
                                </div>

                                <div className="modal-abono-campo">
                                    <label className="modal-abono-label">Fecha Reserva *</label>
                                    <input
                                        type="date"
                                        value={formulario.fecha_reserva}
                                        onChange={(e) => manejarCambio('fecha_reserva', e.target.value)}
                                        className={`modal-abono-input ${errores.fecha_reserva ? 'error' : ''}`}
                                        disabled={guardando}
                                    />
                                    {errores.fecha_reserva && (
                                        <p className="modal-abono-error"><AlertCircle size={12} /> {errores.fecha_reserva}</p>
                                    )}
                                </div>
                            </div>

                            <div className="modal-abono-campo-grupo">
                                <div className="modal-abono-campo">
                                    <label className="modal-abono-label">N° Habitantes *</label>
                                    <input
                                        type="number"
                                        value={formulario.num_habitantes}
                                        onChange={(e) => manejarCambio('num_habitantes', e.target.value)}
                                        className={`modal-abono-input ${errores.num_habitantes ? 'error' : ''}`}
                                        disabled={guardando}
                                        min="1"
                                    />
                                    {errores.num_habitantes && (
                                        <p className="modal-abono-error"><AlertCircle size={12} /> {errores.num_habitantes}</p>
                                    )}
                                </div>

                                <div className="modal-abono-campo">
                                    <label className="modal-abono-label">Forma de Pago *</label>
                                    <select
                                        value={formulario.forma_pago}
                                        onChange={(e) => manejarCambio('forma_pago', e.target.value)}
                                        className="modal-abono-select"
                                        disabled={guardando}
                                    >
                                        <option value="efectivo">Efectivo</option>
                                        <option value="transferencia">Transferencia</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-abono-campo">
                                <label className="modal-abono-label">Descripción del Servicio *</label>
                                <textarea
                                    value={formulario.servicio}
                                    onChange={(e) => manejarCambio('servicio', e.target.value)}
                                    rows={3}
                                    className={`modal-abono-textarea ${errores.servicio ? 'error' : ''}`}
                                    disabled={guardando}
                                    placeholder="Describe el servicio..."
                                />
                                {errores.servicio && (
                                    <p className="modal-abono-error"><AlertCircle size={12} /> {errores.servicio}</p>
                                )}
                            </div>

                            <div className="modal-abono-campo">
                                <label className="modal-abono-label">Estado de Pago *</label>
                                <select
                                    value={formulario.pagado}
                                    onChange={(e) => manejarCambio('pagado', e.target.value)}
                                    className="modal-abono-select"
                                    disabled={guardando}
                                >
                                    <option value="no pagado">No Pagado</option>
                                    <option value="pagado">Pagado</option>
                                </select>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="modal-abono-footer">
                    <button
                        type="button"
                        onClick={alCerrar}
                        className="modal-abono-boton-cancelar"
                        disabled={guardando}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={manejarEnviar}
                        className="modal-abono-boton-guardar"
                        disabled={guardando || cargandoFolios}
                    >
                        {guardando ? (
                            <>
                                <div style={{
                                    width: '18px',
                                    height: '18px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTop: '2px solid white',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite'
                                }} />
                                <span>Creando...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Crear Todo</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCrearTodosDesdePago;
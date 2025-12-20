// REEMPLAZAR COMPLETO el archivo ModalCrearCotizacion.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Save, Calendar, MapPin, Users, FileText } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../Cotizador/Componentes/nuevaCotizacion.css'; // ✅ Usar el mismo CSS que NuevaCotizacion

const ModalCrearCotizacion = ({ estaAbierto, cliente, alCerrar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [leadSeleccionado, setLeadSeleccionado] = useState(null);
    const [opcionesExtras, setOpcionesExtras] = useState({
        transporte: [],
        restaurante: [],
        tour: [],
        hospedaje: [],
    });

    // ✅ Generar folio automático
    const generarFolioAutomatico = () => {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        const timestamp = Date.now().toString().slice(-6);
        return `${año}${mes}${dia}${timestamp}`;
    };

    const [formData, setFormData] = useState({
        folio: generarFolioAutomatico(),
        fecha_salida: '',
        fecha_regreso: '',
        hora_salida: '08:00',
        hora_regreso: '18:00',
        numero_dias: '',
        total_kilometros: '',
        costo_casetas: '',
        tipo_camino: 'terraceria',
        id: '',
        lead_id: '',
        nombre_responsable: '',
        tipo_servicio: 'Transporte',
        num_pasajeros: 1,
        origen: 'Oaxaca de Juarez, Oaxaca',
        punto_intermedio: '',
        destino: '',
        fecha: new Date().toISOString().split('T')[0],
        tipo_cliente: 'solo_una_vez',
        descripcion: '',
        cliente_id: cliente?.id || null,
        transporte: '',
        restaurante: '',
        tour: '',
        hospedaje: '',
        extras: [],
        total: '',
        totalLetra: '',
        lista: []
    });

    // ✅ Cargar extras desde el backend
    useEffect(() => {
        const fetchExtras = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/extras', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });

                const data = response.data;
                const transporte = data.filter((e) => e.tipo === 'transporte');
                const restaurante = data.filter((e) => e.tipo === 'restaurante');
                const tour = data.filter((e) => e.tipo === 'tour');
                const hospedaje = data.filter((e) => e.tipo === 'hospedaje');

                setOpcionesExtras({ transporte, restaurante, tour, hospedaje });
            } catch (error) {
                console.error('Error al cargar extras:', error);
            }
        };

        if (estaAbierto) {
            fetchExtras();
        }
    }, [estaAbierto]);

    useEffect(() => {
        if (cliente) {
            // ✅ Obtener el nombre del usuario logueado del localStorage
            const usuario = JSON.parse(localStorage.getItem('user') || '{}');
            const nombreUsuario = usuario.nombre || '';

            setFormData(prev => ({
                ...prev,
                cliente_id: cliente.id,
                nombre_responsable: nombreUsuario,
                folio: generarFolioAutomatico()
            }));
        }
    }, [cliente]);

    const handleLeadChange = (e) => {
        const leadId = e.target.value;
        setFormData(prev => ({ ...prev, lead_id: leadId }));

        const lead = cliente?.leads?.find(l => l.id.toString() === leadId);
        if (lead) {
            setLeadSeleccionado(lead);
            setFormData(prev => ({
                ...prev,
                num_pasajeros: lead.pax || 1,
                tipo_servicio: lead.tipo_servicio || 'Transporte',
                destino: lead.destino_servicio || '',
                origen: lead.origen_servicio || prev.origen,
                tipo_cliente: lead.tipo_cliente === '2*' ? 'frecuente' : 'solo_una_vez'
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExtraChange = (e) => {
        const { name, value } = e.target;
        if (!value) return;

        const selected = opcionesExtras[name].find((extra) => extra.nombre === value);
        if (!selected) return;

        setFormData((prev) => {
            const yaExiste = prev.extras.find(
                (item) => item.tipo === name && item.valor === selected.nombre
            );
            if (yaExiste) return prev;

            const nuevosExtras = [
                ...prev.extras,
                { tipo: name, valor: selected.nombre, costo: selected.costo },
            ];

            const totalExtras = nuevosExtras.reduce((acc, curr) => acc + curr.costo, 0);
            return {
                ...prev,
                extras: nuevosExtras,
                total: totalExtras.toFixed(2),
            };
        });
    };

    const handleEliminarExtra = (index) => {
        setFormData((prev) => {
            const nuevosExtras = prev.extras.filter((_, i) => i !== index);
            const totalExtras = nuevosExtras.reduce((acc, curr) => acc + curr.costo, 0);
            return {
                ...prev,
                extras: nuevosExtras,
                total: totalExtras.toFixed(2),
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Sesión expirada',
                    text: 'Por favor, inicia sesión nuevamente'
                });
                navigate('/');
                return;
            }

            if (!formData.num_pasajeros || formData.num_pasajeros < 1) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campo requerido',
                    text: 'Debe especificar al menos 1 pasajero'
                });
                setLoading(false);
                return;
            }

            if (!formData.destino) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campo requerido',
                    text: 'Debe especificar un destino'
                });
                setLoading(false);
                return;
            }

            if (!formData.fecha_salida) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campo requerido',
                    text: 'Debe especificar una fecha de salida'
                });
                setLoading(false);
                return;
            }

            const response = await axios.post(
                'http://127.0.0.1:8000/api/cotizaciones',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Cotización creada exitosamente',
                confirmButtonColor: '#10b981',
                confirmButtonText: 'Aceptar'
            });

            console.log('Cotización creada:', response.data);
            alCerrar();
            navigate('/cotizaciones', { replace: true });

        } catch (error) {
            console.error('Error al crear cotización:', error);

            if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Sesión expirada',
                    text: 'Por favor, inicia sesión nuevamente'
                });
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('rol');
                navigate('/');
                return;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al crear cotización',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!estaAbierto) return null;

    return (
        <div className="modal-overlay" onClick={alCerrar}>
            <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
                <div className="header-formulario">
                    <h2>
                        Crear Cotización - Cliente: {cliente?.nombre}
                    </h2>
                </div>

                <form className="formulario-cotizacion" onSubmit={handleSubmit}>
                    <div className="paso-contenido">
                        {/* Seleccionar Lead */}
                        {cliente?.leads && cliente.leads.length > 0 && (
                            <label>
                                Lead Asociado (Opcional)
                                <select
                                    name="lead_id"
                                    value={formData.lead_id}
                                    onChange={handleLeadChange}
                                >
                                    <option value="">Sin lead asociado</option>
                                    {cliente.leads.map(lead => (
                                        <option key={lead.id} value={lead.id}>
                                            {lead.nombre} - Pipeline: {lead.pipeline_id} - Estado: {lead.estado_lead}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}

                        {/* Nombre Responsable */}
                        <label>
                            Nombre Responsable (Usuario) <span className="required">*</span>
                            <input
                                type="text"
                                name="nombre_responsable"
                                value={formData.nombre_responsable}
                                onChange={handleChange}
                                required
                                readOnly
                                placeholder="Nombre del usuario que crea la cotización"
                            />
                        </label>

                        {/* Datos básicos */}
                        <div className="fila">
                            <label>
                                Número de Pasajeros <span className="required">*</span>
                                <input
                                    type="number"
                                    name="num_pasajeros"
                                    value={formData.num_pasajeros}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </label>

                            <label>
                                Tipo de Servicio <span className="required">*</span>
                                <input
                                    type="text"
                                    name="tipo_servicio"
                                    value={formData.tipo_servicio}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Transporte, Tour, Traslado"
                                />
                            </label>
                        </div>

                        {/* Rutas */}
                        <label>
                            Origen <span className="required">*</span>
                            <input
                                type="text"
                                name="origen"
                                value={formData.origen}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Punto Intermedio (Opcional)
                            <input
                                type="text"
                                name="punto_intermedio"
                                value={formData.punto_intermedio}
                                onChange={handleChange}
                                placeholder="Ejemplo: Puerto Escondido"
                            />
                        </label>

                        <label>
                            Destino <span className="required">*</span>
                            <input
                                type="text"
                                name="destino"
                                value={formData.destino}
                                onChange={handleChange}
                                required
                                placeholder="Ejemplo: Ciudad de México"
                            />
                        </label>

                        {/* Fechas y horas */}
                        <div className="fila">
                            <label>
                                Fecha Salida <span className="required">*</span>
                                <input
                                    type="date"
                                    name="fecha_salida"
                                    value={formData.fecha_salida}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </label>

                            <label>
                                Hora Salida <span className="required">*</span>
                                <input
                                    type="time"
                                    name="hora_salida"
                                    value={formData.hora_salida}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>

                        <div className="fila">
                            <label>
                                Fecha Regreso (Opcional)
                                <input
                                    type="date"
                                    name="fecha_regreso"
                                    value={formData.fecha_regreso}
                                    onChange={handleChange}
                                    min={formData.fecha_salida || new Date().toISOString().split('T')[0]}
                                />
                            </label>

                            <label>
                                Hora Regreso
                                <input
                                    type="time"
                                    name="hora_regreso"
                                    value={formData.hora_regreso}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>

                        {/* Tipo de camino y cliente */}
                        <div className="fila">
                            <label>
                                Tipo de Camino <span className="required">*</span>
                                <select
                                    name="tipo_camino"
                                    value={formData.tipo_camino}
                                    onChange={handleChange}
                                >
                                    <option value="terraceria">Terracería</option>
                                    <option value="pavimento">Pavimento (Pista)</option>
                                </select>
                            </label>

                            <label>
                                Tipo de Cliente <span className="required">*</span>
                                <select
                                    name="tipo_cliente"
                                    value={formData.tipo_cliente}
                                    onChange={handleChange}
                                >
                                    <option value="solo_una_vez">Cliente Nuevo (Sin descuento)</option>
                                    <option value="frecuente">Cliente Frecuente (Descuento 10%)</option>
                                </select>
                            </label>
                        </div>

                        {/* Descripción */}
                        <label>
                            Descripción / Notas (Opcional)
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Detalles adicionales del viaje, requerimientos especiales, etc."
                            />
                        </label>

                        {/* Extras */}
                        <div className="extras-grid">
                            <label>
                                Transporte:
                                <select
                                    name="transporte"
                                    value={formData.transporte}
                                    onChange={handleExtraChange}
                                >
                                    <option value="">Seleccionar...</option>
                                    {opcionesExtras.transporte.map((extra) => (
                                        <option key={extra.id} value={extra.nombre}>
                                            {extra.nombre} - ${extra.costo}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Restaurante:
                                <select
                                    name="restaurante"
                                    value={formData.restaurante}
                                    onChange={handleExtraChange}
                                >
                                    <option value="">Seleccionar...</option>
                                    {opcionesExtras.restaurante.map((extra) => (
                                        <option key={extra.id} value={extra.nombre}>
                                            {extra.nombre} - ${extra.costo}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Tour:
                                <select
                                    name="tour"
                                    value={formData.tour}
                                    onChange={handleExtraChange}
                                >
                                    <option value="">Seleccionar...</option>
                                    {opcionesExtras.tour.map((extra) => (
                                        <option key={extra.id} value={extra.nombre}>
                                            {extra.nombre} - ${extra.costo}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Hospedaje:
                                <select
                                    name="hospedaje"
                                    value={formData.hospedaje}
                                    onChange={handleExtraChange}
                                >
                                    <option value="">Seleccionar...</option>
                                    {opcionesExtras.hospedaje.map((extra) => (
                                        <option key={extra.id} value={extra.nombre}>
                                            {extra.nombre} - ${extra.costo}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        {/* Extras seleccionados */}
                        {formData.extras.length > 0 && (
                            <div className="extras-seleccionados">
                                <h4>Extras Seleccionados:</h4>
                                <div className="extras-lista">
                                    {formData.extras.map((extra, index) => (
                                        <div key={index} className="extra-item">
                                            <span className="extra-tipo">{extra.tipo}:</span>
                                            <span className="extra-valor">{extra.valor}</span>
                                            <span className="extra-costo">${extra.costo}</span>
                                            <button
                                                type="button"
                                                className="btn-eliminar-extra"
                                                onClick={() => handleEliminarExtra(index)}
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Información del lead seleccionado */}
                        {leadSeleccionado && (
                            <div style={{
                                background: '#f0fdf4',
                                border: '1px solid #86efac',
                                borderRadius: '8px',
                                padding: '1rem',
                                marginTop: '1rem'
                            }}>
                                <h4>📋 Información del Lead Asociado:</h4>
                                <p><strong>Nombre:</strong> {leadSeleccionado.nombre}</p>
                                <p><strong>Pipeline:</strong> {leadSeleccionado.pipeline_id}</p>
                                <p><strong>Etapa:</strong> {leadSeleccionado.etapa_id}</p>
                                <p><strong>Estado:</strong> {leadSeleccionado.estado_lead}</p>
                                {leadSeleccionado.precio && (
                                    <p><strong>Precio estimado:</strong> ${leadSeleccionado.precio.toLocaleString()}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="botones-navegacion">
                        <button
                            type="button"
                            onClick={alCerrar}
                            className="btn-cancelar"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <div className="botones-derecha">
                            <button
                                type="submit"
                                className="btn-guardar"
                                disabled={loading}
                            >
                                {loading ? 'Calculando y creando...' : 'Crear Cotización'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCrearCotizacion;
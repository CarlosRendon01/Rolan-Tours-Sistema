import React, { useState, useEffect } from 'react';
import { X, User, Phone, FileText, MapPin, Car, Users, Calendar, Clock, DollarSign, CreditCard } from 'lucide-react';

import './ModalVerOrden.css';

const ModalVerOrden = ({ estaAbierto, orden, alCerrar }) => {
  const [seccionActiva, setSeccionActiva] = useState('orden');

  useEffect(() => {
    const restaurarScroll = () => {
      document.body.style.overflow = '';
      document.body.style.overflowY = '';
      document.documentElement.style.overflow = '';
    };

    const manejarTeclaEscape = (evento) => {
      if (evento.key === 'Escape') {
        alCerrar();
      }
    };

    if (estaAbierto) {
      document.addEventListener('keydown', manejarTeclaEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', manejarTeclaEscape);
      restaurarScroll();
    };
  }, [estaAbierto, alCerrar]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    try {
      return new Date(fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  const formatearTelefono = (telefono) => {
    if (!telefono) return 'No disponible';
    const numeroLimpio = telefono.replace(/\D/g, '');
    if (numeroLimpio.length === 10) {
      return `${numeroLimpio.slice(0, 3)}-${numeroLimpio.slice(3, 6)}-${numeroLimpio.slice(6)}`;
    }
    return telefono;
  };

  const formatearMoneda = (valor) => {
    if (!valor) return 'No disponible';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor);
  };

  const CampoVisualizacion = ({ icono: Icono, etiqueta, valor }) => (
    <div className="meo-form-group">
      <label>
        <Icono size={18} />
        {etiqueta}
      </label>
      <div style={{
        padding: '0.875rem 1rem',
        border: '2px solid #ebe5e5ff',
        borderRadius: '10px',
        backgroundColor: '#f9fafb',
        color: '#374151',
        fontSize: '1rem',
        minHeight: '45px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {valor || 'No disponible'}
      </div>
    </div>
  );

  const renderSeccionOrden = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={FileText}
        etiqueta="Folio"
        valor={orden.folio || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Calendar}
        etiqueta="Fecha de Orden de Servicio"
        valor={orden.fecha_orden_servicio ? formatearFecha(orden.fecha_orden_servicio) : 'No disponible'}
      />
      <div className="meo-form-group form-group-full">
        <label>
          <User size={18} />
          Nombre del Prestador de Servicios
        </label>
        <div style={{
          padding: '0.875rem 1rem',
          border: '2px solid #ebe5e5ff',
          borderRadius: '10px',
          backgroundColor: '#f9fafb',
          color: '#374151',
          fontSize: '1rem',
          minHeight: '45px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {orden.nombre_prestador || 'Antonio Alonso Meza'}
        </div>
      </div>
    </div>
  );

  const renderSeccionConductor = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={User}
        etiqueta="Nombre del Conductor"
        valor={orden.nombre_conductor || 'No disponible'}
      />
      <CampoVisualizacion
        icono={User}
        etiqueta="Apellido Paterno"
        valor={orden.apellido_paterno_conductor || 'No disponible'}
      />
      <CampoVisualizacion
        icono={User}
        etiqueta="Apellido Materno"
        valor={orden.apellido_materno_conductor || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Phone}
        etiqueta="Teléfono del Conductor"
        valor={formatearTelefono(orden.telefono_conductor)}
      />
      <div className="meo-form-group form-group-full">
        <label>
          <FileText size={18} />
          Número de Licencia
        </label>
        <div style={{
          padding: '0.875rem 1rem',
          border: '2px solid #ebe5e5ff',
          borderRadius: '10px',
          backgroundColor: '#f9fafb',
          color: '#374151',
          fontSize: '1rem',
          minHeight: '45px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {orden.licencia_conductor || 'No disponible'}
        </div>
      </div>
    </div>
  );

  const renderSeccionServicio = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={User}
        etiqueta="Nombre de Cliente"
        valor={orden.nombre_cliente || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Phone}
        etiqueta="Teléfono"
        valor={formatearTelefono(orden.telefono_cliente)}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Ciudad de Origen"
        valor={orden.ciudad_origen || 'No disponible'}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Punto Intermedio"
        valor={orden.punto_intermedio || 'No especificado'}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Destino"
        valor={orden.destino || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Users}
        etiqueta="Número de Pasajeros"
        valor={orden.numero_pasajeros || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Calendar}
        etiqueta="Fecha Inicio Servicio"
        valor={orden.fecha_inicio_servicio ? formatearFecha(orden.fecha_inicio_servicio) : 'No disponible'}
      />
      <CampoVisualizacion
        icono={Clock}
        etiqueta="Horario Inicio Servicio"
        valor={orden.horario_inicio_servicio || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Calendar}
        etiqueta="Fecha Final Servicio"
        valor={orden.fecha_final_servicio ? formatearFecha(orden.fecha_final_servicio) : 'No disponible'}
      />
      <CampoVisualizacion
        icono={Clock}
        etiqueta="Horario Final Servicio"
        valor={orden.horario_final_servicio || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Clock}
        etiqueta="Horario Final Real"
        valor={orden.horario_final_real || 'No disponible'}
      />
      <div className="meo-form-group form-group-full">
        <label>
          <FileText size={18} />
          Itinerario Detallado
        </label>
        <div style={{
          padding: '0.875rem 1rem',
          border: '2px solid #ebe5e5ff',
          borderRadius: '10px',
          backgroundColor: '#f9fafb',
          color: '#374151',
          fontSize: '1rem',
          minHeight: '100px',
          display: 'flex',
          alignItems: 'flex-start',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {orden.itinerario_detallado || 'No disponible'}
        </div>
      </div>
      <div className="meo-form-group form-group-full">
        <label>
          <MapPin size={18} />
          Dirección de Retorno
        </label>
        <div style={{
          padding: '0.875rem 1rem',
          border: '2px solid #ebe5e5ff',
          borderRadius: '10px',
          backgroundColor: '#f9fafb',
          color: '#374151',
          fontSize: '1rem',
          minHeight: '45px',
          display: 'flex',
          alignItems: 'center'
        }}>
          {orden.direccion_retorno || 'No disponible'}
        </div>
      </div>
    </div>
  );

  const renderSeccionVehiculo = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={Car}
        etiqueta="Marca"
        valor={orden.marca || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Car}
        etiqueta="Modelo"
        valor={orden.modelo || 'No disponible'}
      />
      <CampoVisualizacion
        icono={CreditCard}
        etiqueta="Placa"
        valor={orden.placa || 'No disponible'}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="KM Inicial"
        valor={orden.km_inicial || 'No disponible'}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="KM Final"
        valor={orden.km_final || 'No disponible'}
      />
      <CampoVisualizacion
        icono={DollarSign}
        etiqueta="Litros Consumidos"
        valor={orden.litros_consumidos || 'No disponible'}
      />
      <CampoVisualizacion
        icono={DollarSign}
        etiqueta="Rendimiento"
        valor={orden.rendimiento || 'No disponible'}
      />
    </div>
  );

  const renderSeccionControl = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={DollarSign}
        etiqueta="Importe"
        valor={orden.importe ? formatearMoneda(orden.importe) : 'No disponible'}
      />
      <CampoVisualizacion
        icono={FileText}
        etiqueta="Pagado"
        valor={orden.pagado === 'si' ? 'Sí' : orden.pagado === 'no' ? 'No' : 'No disponible'}
      />
      <CampoVisualizacion
        icono={CreditCard}
        etiqueta="Forma de Pago"
        valor={orden.forma_pago || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Calendar}
        etiqueta="Fecha de Pago"
        valor={orden.fecha_pago ? formatearFecha(orden.fecha_pago) : 'No disponible'}
      />
      <CampoVisualizacion
        icono={DollarSign}
        etiqueta="Costo Proveedor"
        valor={orden.costo_proveedor ? formatearMoneda(orden.costo_proveedor) : 'No disponible'}
      />
      <CampoVisualizacion
        icono={CreditCard}
        etiqueta="Forma Pago Proveedor"
        valor={orden.forma_pago_proveedor === 'transferencia' ? 'Transferencia' : orden.forma_pago_proveedor === 'efectivo' ? 'Efectivo' : 'No disponible'}
      />
      <CampoVisualizacion
        icono={FileText}
        etiqueta="Pagado Proveedor"
        valor={orden.pagado_proveedor === 'si' ? 'Sí' : orden.pagado_proveedor === 'no' ? 'No' : 'No disponible'}
      />
    </div>
  );

  if (!estaAbierto || !orden) return null;

  return (
    <div className="meo-overlay" onClick={alCerrar}>
      <div className="meo-contenido modal-xl" onClick={(e) => e.stopPropagation()}>

        <div className="meo-header">
          <h2>Ver Orden</h2>
          <button className="meo-btn-cerrar" onClick={alCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        <div className="meo-tabs">
          <button
            className={`meo-tab-button ${seccionActiva === 'orden' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('orden')}
            type="button"
          >
            <FileText size={18} />
            Datos Orden de Servicio
          </button>
          <button
            className={`meo-tab-button ${seccionActiva === 'conductor' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('conductor')}
            type="button"
          >
            <User size={18} />
            Datos Conductor
          </button>
          <button
            className={`meo-tab-button ${seccionActiva === 'servicio' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('servicio')}
            type="button"
          >
            <MapPin size={18} />
            Datos Servicio
          </button>
          <button
            className={`meo-tab-button ${seccionActiva === 'vehiculo' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('vehiculo')}
            type="button"
          >
            <Car size={18} />
            Vehículo
          </button>
          <button
            className={`meo-tab-button ${seccionActiva === 'control' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('control')}
            type="button"
          >
            <DollarSign size={18} />
            Control Internos
          </button>
        </div>

        <div className="meo-form">
          {seccionActiva === 'orden' && renderSeccionOrden()}
          {seccionActiva === 'conductor' && renderSeccionConductor()}
          {seccionActiva === 'servicio' && renderSeccionServicio()}
          {seccionActiva === 'vehiculo' && renderSeccionVehiculo()}
          {seccionActiva === 'control' && renderSeccionControl()}
        </div>

        <div className="meo-footer">
          <div className="meo-botones-izquierda">

          </div>
          <div className="meo-botones-derecha">
            <button
              type="button"
              className="meo-btn-cancelar"
              onClick={alCerrar}
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                color: 'white',
                borderColor: '#2563eb'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerOrden;
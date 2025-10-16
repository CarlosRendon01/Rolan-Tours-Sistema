import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, FileText, Globe, MapPin, Car, Users, Calendar, Clock, Hash, CreditCard } from 'lucide-react';

// Importa los estilos del modal editar (ya que usaremos el mismo diseño)
import './ModalEditarOrden.css';

const ModalVerOrden = ({ estaAbierto, orden, alCerrar }) => {
  const [seccionActiva, setSeccionActiva] = useState('cotizacion');

  // Restaurar scroll cuando se cierra
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

  // Funciones de formato
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

  const renderSeccionCotizacion = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={Calendar}
        etiqueta="Fecha de Salida"
        valor={orden.fechaSalida ? formatearFecha(orden.fechaSalida) : 'No disponible'}
      />
      <CampoVisualizacion
        icono={Calendar}
        etiqueta="Fecha de Regreso"
        valor={orden.fechaRegreso ? formatearFecha(orden.fechaRegreso) : 'No disponible'}
      />
      <CampoVisualizacion
        icono={Clock}
        etiqueta="Hora de Salida"
        valor={orden.horaSalida || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Clock}
        etiqueta="Hora de Regreso"
        valor={orden.horaRegreso || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Users}
        etiqueta="Número de Pasajeros"
        valor={orden.pasajeros || 'No disponible'}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Origen del Servicio"
        valor={orden.origenServicio || 'No disponible'}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Punto Intermedio"
        valor={orden.puntoIntermedio || 'No especificado'}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Destino del Servicio"
        valor={orden.destinoServicio || 'No disponible'}
      />
    </div>
  );

  const renderSeccionVehiculo = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={Car}
        etiqueta="Marca del Vehículo"
        valor={orden.marca_vehiculo || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Car}
        etiqueta="Modelo del Vehículo"
        valor={orden.modelo_vehiculo || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Car}
        etiqueta="Color"
        valor={orden.color || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Users}
        etiqueta="Número de Pasajeros"
        valor={orden.n_pasajero_vehiculo || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Hash}
        etiqueta="Número de Serie"
        valor={orden.numero_serie || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Hash}
        etiqueta="Número de TAG"
        valor={orden.numero_tag || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Hash}
        etiqueta="Número de Placa"
        valor={orden.numero_placa || 'No disponible'}
      />
    </div>
  );

  const renderSeccionOperador = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={User}
        etiqueta="Nombre del Operador"
        valor={orden.nombre_operador || 'No disponible'}
      />
      <CampoVisualizacion
        icono={User}
        etiqueta="Apellido Paterno"
        valor={orden.apellido_paterno_operador || 'No disponible'}
      />
      <CampoVisualizacion
        icono={User}
        etiqueta="Apellido Materno"
        valor={orden.apellido_materno_operador || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Phone}
        etiqueta="Teléfono del Operador"
        valor={formatearTelefono(orden.telefono_operador)}
      />
      <CampoVisualizacion
        icono={Phone}
        etiqueta="Teléfono Familiar"
        valor={formatearTelefono(orden.telefono_familiar_operador)}
      />
      <CampoVisualizacion
        icono={Mail}
        etiqueta="Email del Operador"
        valor={orden.correo_electronico_operador || 'No disponible'}
      />
      <CampoVisualizacion
        icono={CreditCard}
        etiqueta="Número de Licencia"
        valor={orden.numero_licencia || 'No disponible'}
      />
    </div>
  );

  const renderSeccionGuia = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={User}
        etiqueta="Nombre del Guía"
        valor={orden.nombre_guia || 'No disponible'}
      />
      <CampoVisualizacion
        icono={User}
        etiqueta="Apellido Paterno"
        valor={orden.apellido_paterno_guia || 'No disponible'}
      />
      <CampoVisualizacion
        icono={User}
        etiqueta="Apellido Materno"
        valor={orden.apellido_materno_guia || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Phone}
        etiqueta="Teléfono del Guía"
        valor={formatearTelefono(orden.telefono_guia)}
      />
      <CampoVisualizacion
        icono={Mail}
        etiqueta="Email del Guía"
        valor={orden.correo_electronico_guia || 'No disponible'}
      />
    </div>
  );

  if (!estaAbierto || !orden) return null;

  return (
    <div className="meo-overlay" onClick={alCerrar}>
      <div className="meo-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="meo-header">
          <h2>Ver Orden</h2>
          <button className="meo-btn-cerrar" onClick={alCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Tabs de Navegación */}
        <div className="meo-tabs">
          <button
            className={`meo-tab-button ${seccionActiva === 'cotizacion' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('cotizacion')}
            type="button"
          >
            <FileText size={18} />
            Datos Cotización
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
            className={`meo-tab-button ${seccionActiva === 'operador' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('operador')}
            type="button"
          >
            <User size={18} />
            Operador
          </button>
          <button
            className={`meo-tab-button ${seccionActiva === 'guia' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('guia')}
            type="button"
          >
            <Users size={18} />
            Guía
          </button>
        </div>

        {/* Contenido (scrolleable) */}
        <div className="meo-form">
          {seccionActiva === 'cotizacion' && renderSeccionCotizacion()}
          {seccionActiva === 'vehiculo' && renderSeccionVehiculo()}
          {seccionActiva === 'operador' && renderSeccionOperador()}
          {seccionActiva === 'guia' && renderSeccionGuia()}
        </div>

        {/* Footer */}
        <div className="meo-footer">
          <div className="meo-botones-izquierda">
            {/* Espacio vacío para mantener el layout */}
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
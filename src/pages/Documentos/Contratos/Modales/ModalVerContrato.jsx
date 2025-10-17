import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, FileText, Globe, MapPin, Car, Users, Calendar, Clock, Hash, CreditCard } from 'lucide-react';

// Importa los estilos del modal editar (ya que usaremos el mismo diseño)
import './ModalEditarContrato.css';

const ModalVerContrato = ({ estaAbierto, contrato, alCerrar }) => {
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
        valor={contrato.fechaSalida ? formatearFecha(contrato.fechaSalida) : 'No disponible'}
      />
      <CampoVisualizacion
        icono={Calendar}
        etiqueta="Fecha de Regreso"
        valor={contrato.fechaRegreso ? formatearFecha(contrato.fechaRegreso) : 'No disponible'}
      />
      <CampoVisualizacion
        icono={Clock}
        etiqueta="Hora de Salida"
        valor={contrato.horaSalida || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Clock}
        etiqueta="Hora de Regreso"
        valor={contrato.horaRegreso || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Users}
        etiqueta="Número de Pasajeros"
        valor={contrato.pasajeros || 'No disponible'}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Origen del Servicio"
        valor={contrato.origenServicio || 'No disponible'}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Punto Intermedio"
        valor={contrato.puntoIntermedio || 'No especificado'}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Destino del Servicio"
        valor={contrato.destinoServicio || 'No disponible'}
      />
    </div>
  );

  const renderSeccionVehiculo = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={Car}
        etiqueta="Marca del Vehículo"
        valor={contrato.marca_vehiculo || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Car}
        etiqueta="Modelo del Vehículo"
        valor={contrato.modelo_vehiculo || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Car}
        etiqueta="Color"
        valor={contrato.color || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Users}
        etiqueta="Número de Pasajeros"
        valor={contrato.n_pasajero_vehiculo || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Hash}
        etiqueta="Número de Serie"
        valor={contrato.numero_serie || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Hash}
        etiqueta="Número de TAG"
        valor={contrato.numero_tag || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Hash}
        etiqueta="Número de Placa"
        valor={contrato.numero_placa || 'No disponible'}
      />
    </div>
  );

  const renderSeccionOperador = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={User}
        etiqueta="Nombre del Operador"
        valor={contrato.nombre_operador || 'No disponible'}
      />
      <CampoVisualizacion
        icono={User}
        etiqueta="Apellido Paterno"
        valor={contrato.apellido_paterno_operador || 'No disponible'}
      />
      <CampoVisualizacion
        icono={User}
        etiqueta="Apellido Materno"
        valor={contrato.apellido_materno_operador || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Phone}
        etiqueta="Teléfono del Operador"
        valor={formatearTelefono(contrato.telefono_operador)}
      />
      <CampoVisualizacion
        icono={Phone}
        etiqueta="Teléfono Familiar"
        valor={formatearTelefono(contrato.telefono_familiar_operador)}
      />
      <CampoVisualizacion
        icono={Mail}
        etiqueta="Email del Operador"
        valor={contrato.correo_electronico_operador || 'No disponible'}
      />
      <CampoVisualizacion
        icono={CreditCard}
        etiqueta="Número de Licencia"
        valor={contrato.numero_licencia || 'No disponible'}
      />
    </div>
  );

  const renderSeccionGuia = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={User}
        etiqueta="Nombre del Guía"
        valor={contrato.nombre_guia || 'No disponible'}
      />
      <CampoVisualizacion
        icono={User}
        etiqueta="Apellido Paterno"
        valor={contrato.apellido_paterno_guia || 'No disponible'}
      />
      <CampoVisualizacion
        icono={User}
        etiqueta="Apellido Materno"
        valor={contrato.apellido_materno_guia || 'No disponible'}
      />
      <CampoVisualizacion
        icono={Phone}
        etiqueta="Teléfono del Guía"
        valor={formatearTelefono(contrato.telefono_guia)}
      />
      <CampoVisualizacion
        icono={Mail}
        etiqueta="Email del Guía"
        valor={contrato.correo_electronico_guia || 'No disponible'}
      />
    </div>
  );

  if (!estaAbierto || !contrato) return null;

  return (
    <div className="meo-overlay" onClick={alCerrar}>
      <div className="meo-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="meo-header">
          <h2>Ver Contrato</h2>
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

export default ModalVerContrato;
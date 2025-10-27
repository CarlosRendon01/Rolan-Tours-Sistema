import React, { useState, useEffect } from 'react';
import { X, User, Phone, FileText, Globe, MapPin, Car, Users, Calendar, Clock, DollarSign, Building, Hash } from 'lucide-react';
import './ModalVerContrato.css';

const ModalVerContrato = ({ estaAbierto, contrato, alCerrar }) => {
  const [seccionActiva, setSeccionActiva] = useState('contrato');

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
    const numeroLimpio = telefono.toString().replace(/\D/g, '');
    if (numeroLimpio.length === 10) {
      return `${numeroLimpio.slice(0, 3)}-${numeroLimpio.slice(3, 6)}-${numeroLimpio.slice(6)}`;
    }
    return telefono;
  };

  const formatearMoneda = (cantidad) => {
    if (!cantidad) return 'No disponible';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cantidad);
  };

  const CampoVisualizacion = ({ icono: Icono, etiqueta, valor }) => (
    <div className="meo-form-group">
      <label>
        <Icono size={18} />
        {etiqueta}
      </label>
      <div className="meo-campo-visualizacion">
        {valor || 'No disponible'}
      </div>
    </div>
  );

  const renderSeccionContrato = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={Building}
        etiqueta="Representante de la Empresa"
        valor={contrato.representante_empresa}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Domicilio"
        valor={contrato.domicilio}
      />
    </div>
  );

  const renderSeccionServicio = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={User}
        etiqueta="Nombre del Cliente"
        valor={contrato.nombre_cliente}
      />
      <CampoVisualizacion
        icono={Globe}
        etiqueta="Nacionalidad"
        valor={contrato.nacionalidad}
      />
      <CampoVisualizacion
        icono={Globe}
        etiqueta="rfc"
        valor={contrato.rfc}
      />
      <CampoVisualizacion
        icono={Phone}
        etiqueta="Teléfono"
        valor={formatearTelefono(contrato.telefono_cliente)}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Ciudad de Origen"
        valor={contrato.ciudad_origen}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Punto Intermedio"
        valor={contrato.punto_intermedio || 'No especificado'}
      />
      <CampoVisualizacion
        icono={MapPin}
        etiqueta="Destino"
        valor={contrato.destino}
      />
      <CampoVisualizacion
        icono={FileText}
        etiqueta="Tipo de Pasaje"
        valor={contrato.tipo_pasaje}
      />
      <CampoVisualizacion
        icono={Car}
        etiqueta="N° Unidades Contratadas"
        valor={contrato.n_unidades_contratadas}
      />
      <CampoVisualizacion
        icono={Users}
        etiqueta="Número de Pasajeros"
        valor={contrato.numero_pasajeros}
      />
      <CampoVisualizacion
        icono={Calendar}
        etiqueta="Fecha Inicio Servicio"
        valor={formatearFecha(contrato.fecha_inicio_servicio)}
      />
      <CampoVisualizacion
        icono={Clock}
        etiqueta="Horario Inicio Servicio"
        valor={contrato.horario_inicio_servicio}
      />
      <CampoVisualizacion
        icono={Calendar}
        etiqueta="Fecha Final Servicio"
        valor={formatearFecha(contrato.fecha_final_servicio)}
      />
      <CampoVisualizacion
        icono={Clock}
        etiqueta="Horario Final Servicio"
        valor={contrato.horario_final_servicio}
      />
      <div className="meo-form-group form-group-full">
        <label>
          <FileText size={18} />
          Itinerario Detallado
        </label>
        <div className="meo-campo-visualizacion">
          {contrato.itinerario_detallado || 'No disponible'}
        </div>
      </div>
    </div>
  );

  const renderSeccionCosto = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={DollarSign}
        etiqueta="Importe del Servicio"
        valor={formatearMoneda(contrato.importe_servicio)}
      />
      <CampoVisualizacion
        icono={DollarSign}
        etiqueta="Anticipo"
        valor={formatearMoneda(contrato.anticipo)}
      />
      <CampoVisualizacion
        icono={Calendar}
        etiqueta="Fecha de Liquidación"
        valor={formatearFecha(contrato.fecha_liquidacion)}
      />
      <div className="meo-form-group form-group-full">
        <label>
          <FileText size={18} />
          Costos Cubiertos por este Servicio
        </label>
        <div className="meo-campo-visualizacion">
          {contrato.costos_cubiertos && contrato.costos_cubiertos.length > 0 ? (
            <ul className="meo-lista-costos-ver">
              {contrato.costos_cubiertos.map((costo, index) => (
                <li key={index}>{costo}</li>
              ))}
            </ul>
          ) : (
            'No se especificaron costos cubiertos'
          )}
        </div>
      </div>
      {contrato.costos_cubiertos?.includes('Otro, especifique') && contrato.otro_costo_especificacion && (
        <CampoVisualizacion
          icono={FileText}
          etiqueta="Especificación de Otro Costo"
          valor={contrato.otro_costo_especificacion}
        />
      )}
    </div>
  );

  const renderSeccionVehiculo = () => (
    <div className="meo-form-grid">
      <CampoVisualizacion
        icono={Car}
        etiqueta="Marca del Vehículo"
        valor={contrato.marca_vehiculo}
      />
      <CampoVisualizacion
        icono={Car}
        etiqueta="Modelo del Vehículo"
        valor={contrato.modelo_vehiculo}
      />
      <CampoVisualizacion
        icono={Hash}
        etiqueta="Placa del Vehículo"
        valor={contrato.placa_vehiculo}
      />
      <CampoVisualizacion
        icono={Users}
        etiqueta="Capacidad del Vehículo"
        valor={contrato.capacidad_vehiculo}
      />
      <div className="meo-form-group form-group-full">
        <label>
          <Car size={18} />
          Extras del Vehículo
        </label>
        <div className="meo-campo-visualizacion">
          {contrato.aire_acondicionado && '✓ Aire Acondicionado'}
          {contrato.aire_acondicionado && contrato.asientos_reclinables && ' | '}
          {contrato.asientos_reclinables && '✓ Asientos Reclinables'}
          {!contrato.aire_acondicionado && !contrato.asientos_reclinables && 'Sin extras especificados'}
        </div>
      </div>
    </div>
  );

  if (!estaAbierto || !contrato) return null;

  return (
    <div className="meo-overlay" onClick={alCerrar}>
      <div className="meo-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        <div className="meo-header">
          <h2>Ver Contrato</h2>
          <button className="meo-btn-cerrar" onClick={alCerrar} type="button">
            <X size={24} />
          </button>
        </div>

        <div className="meo-tabs">
          <button
            className={`meo-tab-button ${seccionActiva === 'contrato' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('contrato')}
            type="button"
          >
            <Building size={18} />
            Datos de Contrato
          </button>
          <button
            className={`meo-tab-button ${seccionActiva === 'servicio' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('servicio')}
            type="button"
          >
            <FileText size={18} />
            Datos del Servicio
          </button>
          <button
            className={`meo-tab-button ${seccionActiva === 'costo' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('costo')}
            type="button"
          >
            <DollarSign size={18} />
            Costo Extra
          </button>
          <button
            className={`meo-tab-button ${seccionActiva === 'vehiculo' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('vehiculo')}
            type="button"
          >
            <Car size={18} />
            Datos Vehículo
          </button>
        </div>

        <div className="meo-form">
          {seccionActiva === 'contrato' && renderSeccionContrato()}
          {seccionActiva === 'servicio' && renderSeccionServicio()}
          {seccionActiva === 'costo' && renderSeccionCosto()}
          {seccionActiva === 'vehiculo' && renderSeccionVehiculo()}
        </div>

        <div className="meo-footer">
          <div className="meo-botones-izquierda"></div>
          <div className="meo-botones-derecha">
            <button
              type="button"
              className="meo-btn-ver-cerrar"
              onClick={alCerrar}
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
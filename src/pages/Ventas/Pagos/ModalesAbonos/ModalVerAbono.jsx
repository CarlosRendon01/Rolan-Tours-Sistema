import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Receipt,
  Info
} from 'lucide-react';
import './ModalVerAbono.css';

const ModalVerAbono = ({ abierto, onCerrar, pagoSeleccionado }) => {
  const [tabActiva, setTabActiva] = useState(1);

  if (!abierto || !pagoSeleccionado) return null;

  const calcularProgreso = (montoPagado, montoTotal) => {
    return Math.round((montoPagado / montoTotal) * 100);
  };

  const obtenerEstadoClase = (estado) => {
    switch (estado) {
      case 'FINALIZADO':
        return 'estado-finalizado';
      case 'EN_PROCESO':
        return 'estado-en-proceso';
      case 'VENCIDO':
        return 'estado-vencido';
      default:
        return 'estado-en-proceso';
    }
  };

  const progreso = calcularProgreso(
    pagoSeleccionado.planPago.montoPagado,
    pagoSeleccionado.planPago.montoTotal
  );

  const cantidadAbonos = pagoSeleccionado.historialAbonos?.length || 0;

  return (
    <div className="modal-ver-abono-overlay" onClick={onCerrar}>
      <div className="modal-ver-abono-contenedor" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-ver-abono-header">
          <button className="modal-ver-abono-boton-cerrar" onClick={onCerrar}>
            <X size={20} />
          </button>
          <div className="modal-ver-abono-header-contenido">
            <FileText size={24} />
            <div>
              <h2 className="modal-ver-abono-titulo">Detalle del Pago</h2>
              <p className="modal-ver-abono-subtitulo">
                Contrato: {pagoSeleccionado.numeroContrato}
              </p>
            </div>
          </div>

          {/* Pestañas de navegación */}
          <div className="modal-ver-abono-tabs">
            <button 
              className={`modal-ver-abono-tab ${tabActiva === 1 ? 'activa' : ''}`}
              onClick={() => setTabActiva(1)}
            >
              <Info size={16} />
              Información General
            </button>
            <button 
              className={`modal-ver-abono-tab ${tabActiva === 2 ? 'activa' : ''}`}
              onClick={() => setTabActiva(2)}
            >
              <Receipt size={16} />
              Historial
              <span className="modal-ver-abono-tab-badge">{cantidadAbonos}</span>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="modal-ver-abono-contenido">
          {tabActiva === 1 && (
            <div className="modal-ver-abono-tab-contenido">
              {/* Estado del Pago */}
              <div className="modal-ver-abono-seccion-estado">
                <div className={`modal-ver-abono-badge-estado ${obtenerEstadoClase(pagoSeleccionado.estado)}`}>
                  {pagoSeleccionado.estado === 'FINALIZADO' ? (
                    <CheckCircle size={14} />
                  ) : (
                    <Clock size={14} />
                  )}
                  <span>
                    {pagoSeleccionado.estado === 'FINALIZADO' ? 'Pago Completado' : 'En Proceso'}
                  </span>
                </div>
                <div className="modal-ver-abono-fecha-creacion">
                  Registrado el {pagoSeleccionado.fechaCreacion}
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="modal-ver-abono-seccion">
                <h3 className="modal-ver-abono-titulo-seccion">
                  <User size={16} />
                  Cliente
                </h3>
                <div className="modal-ver-abono-grid">
                  <div className="modal-ver-abono-campo">
                    <label><User size={14} /> Nombre</label>
                    <div className="modal-ver-abono-valor">
                      {pagoSeleccionado.cliente.nombre}
                    </div>
                  </div>
                  <div className="modal-ver-abono-campo">
                    <label><Mail size={14} /> Email</label>
                    <div className="modal-ver-abono-valor">
                      {pagoSeleccionado.cliente.email}
                    </div>
                  </div>
                  {pagoSeleccionado.cliente.telefono && (
                    <div className="modal-ver-abono-campo">
                      <label><Phone size={14} /> Teléfono</label>
                      <div className="modal-ver-abono-valor">
                        {pagoSeleccionado.cliente.telefono}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del Servicio */}
              <div className="modal-ver-abono-seccion">
                <h3 className="modal-ver-abono-titulo-seccion">
                  <MapPin size={16} />
                  Servicio
                </h3>
                <div className="modal-ver-abono-grid">
                  <div className="modal-ver-abono-campo">
                    <label>Tipo de Tour</label>
                    <div className="modal-ver-abono-valor-destacado">
                      {pagoSeleccionado.servicio.tipo}
                    </div>
                  </div>
                  <div className="modal-ver-abono-campo">
                    <label>Descripción</label>
                    <div className="modal-ver-abono-valor">
                      {pagoSeleccionado.servicio.descripcion}
                    </div>
                  </div>
                  <div className="modal-ver-abono-campo">
                    <label><Calendar size={14} /> Fecha del Tour</label>
                    <div className="modal-ver-abono-valor">
                      {pagoSeleccionado.servicio.fechaTour}
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan de Pago */}
              <div className="modal-ver-abono-seccion">
                <h3 className="modal-ver-abono-titulo-seccion">
                  <DollarSign size={16} />
                  Plan de Pago
                </h3>
                
                {/* Progreso */}
                <div className="modal-ver-abono-progreso-contenedor">
                  <div className="modal-ver-abono-progreso-info">
                    <span className="modal-ver-abono-progreso-texto">Progreso</span>
                    <span className="modal-ver-abono-progreso-porcentaje">{progreso}%</span>
                  </div>
                  <div className="modal-ver-abono-barra-progreso">
                    <div 
                      className="modal-ver-abono-barra-progreso-relleno"
                      style={{ 
                        width: `${progreso}%`,
                        backgroundColor: progreso === 100 ? '#10b981' : '#3b82f6'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="modal-ver-abono-estadisticas-grid">
                  <div className="modal-ver-abono-tarjeta-stat destacado">
                    <div className="modal-ver-abono-stat-contenido">
                      <span className="modal-ver-abono-stat-label">
                        <DollarSign size={16} />
                        Total
                      </span>
                      <span className="modal-ver-abono-stat-valor">
                        ${pagoSeleccionado.planPago.montoTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="modal-ver-abono-tarjeta-stat">
                    <div className="modal-ver-abono-stat-contenido">
                      <span className="modal-ver-abono-stat-label">
                        <CheckCircle size={16} />
                        Pagado
                      </span>
                      <span className="modal-ver-abono-stat-valor">
                        ${pagoSeleccionado.planPago.montoPagado.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="modal-ver-abono-tarjeta-stat">
                    <div className="modal-ver-abono-stat-contenido">
                      <span className="modal-ver-abono-stat-label">
                        <AlertCircle size={16} />
                        Pendiente
                      </span>
                      <span className="modal-ver-abono-stat-valor">
                        ${pagoSeleccionado.planPago.saldoPendiente.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="modal-ver-abono-tarjeta-stat">
                    <div className="modal-ver-abono-stat-contenido">
                      <span className="modal-ver-abono-stat-label">
                        <TrendingUp size={16} />
                        Abonos
                      </span>
                      <span className="modal-ver-abono-stat-valor">
                        {pagoSeleccionado.planPago.abonosRealizados} / {pagoSeleccionado.planPago.abonosPlaneados}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información Adicional */}
                <div className="modal-ver-abono-info-adicional">
                  <div className="modal-ver-abono-info-item">
                    <span className="modal-ver-abono-info-label">Abono Mínimo:</span>
                    <span className="modal-ver-abono-info-valor">
                      ${pagoSeleccionado.planPago.abonoMinimo.toLocaleString()}
                    </span>
                  </div>
                  {pagoSeleccionado.estado !== 'FINALIZADO' && (
                    <div className="modal-ver-abono-info-item">
                      <span className="modal-ver-abono-info-label">Próximo Vencimiento:</span>
                      <span className="modal-ver-abono-info-valor destacado">
                        <Clock size={12} />
                        {pagoSeleccionado.proximoVencimiento}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Observaciones Generales */}
              {pagoSeleccionado.observaciones && (
                <div className="modal-ver-abono-seccion">
                  <h3 className="modal-ver-abono-titulo-seccion">
                    <FileText size={16} />
                    Observaciones
                  </h3>
                  <div className="modal-ver-abono-observaciones-contenido">
                    {pagoSeleccionado.observaciones}
                  </div>
                </div>
              )}
            </div>
          )}

          {tabActiva === 2 && (
            <div className="modal-ver-abono-tab-contenido">
              {/* Historial de Abonos */}
              <div className="modal-ver-abono-seccion">
                <h3 className="modal-ver-abono-titulo-seccion">
                  <Receipt size={16} />
                  Historial de Abonos ({cantidadAbonos})
                </h3>
                
                {cantidadAbonos === 0 ? (
                  <div className="modal-ver-abono-sin-abonos">
                    <AlertCircle size={40} />
                    <p>No hay abonos registrados</p>
                  </div>
                ) : (
                  <div className="modal-ver-abono-historial">
                    {pagoSeleccionado.historialAbonos.map((abono, indice) => (
                      <div key={indice} className="modal-ver-abono-item-historial">
                        <div className="modal-ver-abono-historial-header">
                          <div className="modal-ver-abono-historial-numero">
                            {abono.numeroAbono}
                          </div>
                          <span className="modal-ver-abono-historial-monto">
                            ${abono.monto.toLocaleString()}
                          </span>
                          <span className="modal-ver-abono-historial-fecha">
                            <Calendar size={12} />
                            {abono.fecha}
                          </span>
                        </div>
                        <div className="modal-ver-abono-historial-contenido">
                          <div className="modal-ver-abono-historial-info">
                            <span className="modal-ver-abono-historial-metodo">
                              <CreditCard size={12} />
                              {abono.metodoPago}
                            </span>
                            {abono.referencia && (
                              <span className="modal-ver-abono-referencia">
                                Ref: {abono.referencia}
                              </span>
                            )}
                          </div>
                          {abono.observaciones && (
                            <div className="modal-ver-abono-historial-observaciones">
                              {abono.observaciones}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-ver-abono-footer">
          <button className="modal-ver-abono-boton-secundario" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerAbono;
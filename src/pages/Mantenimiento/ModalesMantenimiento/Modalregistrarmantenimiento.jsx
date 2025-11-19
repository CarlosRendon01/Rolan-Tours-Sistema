import React, { useState } from 'react';
import { X, Save, Wrench, Calendar, DollarSign, FileText, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import './ModalRegistrarMantenimiento.css';

const ModalRegistrarMantenimiento = ({ vehiculo, mantenimiento, onGuardar, onCerrar }) => {
  const tiposMantenimientoIniciales = [
    'Mantenimiento Preventivo',
    'Mantenimiento Correctivo',
    'Cambio de Aceite',
    'Cambio de Llantas',
    'Revisión de Frenos',
    'Alineación y Balanceo',
    'Cambio de Filtros',
    'Revisión General',
    'Reparación de Motor',
    'Reparación de Transmisión',
    'Sistema Eléctrico',
    'Sistema de Suspensión',
    'Otro'
  ];

  const [tiposMantenimiento, setTiposMantenimiento] = useState(tiposMantenimientoIniciales);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [mostrarCampoNuevoTipo, setMostrarCampoNuevoTipo] = useState(false);

  const [formData, setFormData] = useState({
    tipo: '',
    kilometraje: mantenimiento.kilometraje_actual,
    descripcion: '',
    costo: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si selecciona "Otro", mostrar campo de texto
    if (name === 'tipo' && value === 'Otro') {
      setMostrarCampoNuevoTipo(true);
    } else if (name === 'tipo' && value !== 'Otro') {
      setMostrarCampoNuevoTipo(false);
      setNuevoTipo('');
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo
    if (errores[name]) {
      setErrores(prev => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[name];
        return nuevosErrores;
      });
    }
  };

  const handleAgregarNuevoTipo = () => {
    const tipoLimpio = nuevoTipo.trim();
    
    if (!tipoLimpio) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor ingresa el nombre del tipo de mantenimiento',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Verificar si ya existe
    if (tiposMantenimiento.some(tipo => tipo.toLowerCase() === tipoLimpio.toLowerCase())) {
      Swal.fire({
        icon: 'info',
        title: 'Tipo existente',
        text: 'Este tipo de mantenimiento ya existe en la lista',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Agregar el nuevo tipo antes de "Otro"
    const nuevostiposMantenimiento = [...tiposMantenimiento];
    nuevostiposMantenimiento.splice(nuevostiposMantenimiento.length - 1, 0, tipoLimpio);
    setTiposMantenimiento(nuevostiposMantenimiento);

    // Seleccionar automáticamente el nuevo tipo
    setFormData(prev => ({
      ...prev,
      tipo: tipoLimpio
    }));

    // Limpiar y ocultar campo
    setNuevoTipo('');
    setMostrarCampoNuevoTipo(false);

    // Mensaje de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Tipo agregado!',
      text: `"${tipoLimpio}" se ha agregado a la lista`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.tipo) {
      nuevosErrores.tipo = 'Selecciona el tipo de mantenimiento';
    }

    if (!formData.kilometraje || parseInt(formData.kilometraje) < 0) {
      nuevosErrores.kilometraje = 'El kilometraje debe ser mayor o igual a 0';
    }

    if (parseInt(formData.kilometraje) < mantenimiento.kilometraje_actual) {
      nuevosErrores.kilometraje = `El kilometraje no puede ser menor al actual (${mantenimiento.kilometraje_actual} km)`;
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es requerida';
    }

    if (formData.costo && parseFloat(formData.costo) < 0) {
      nuevosErrores.costo = 'El costo debe ser mayor o igual a 0';
    }

    if (!formData.fecha) {
      nuevosErrores.fecha = 'La fecha es requerida';
    }

    return nuevosErrores;
  };

  const handleSubmit = async () => {
    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      // Focus en el primer campo con error
      setTimeout(() => {
        const primerCampoConError = Object.keys(nuevosErrores)[0];
        const elemento = document.querySelector(`[name="${primerCampoConError}"]`);
        if (elemento) {
          elemento.focus();
          elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      return;
    }

    setGuardando(true);

    try {
      const nuevoMantenimiento = {
        tipo: formData.tipo,
        kilometraje: parseInt(formData.kilometraje),
        descripcion: formData.descripcion,
        costo: formData.costo ? parseFloat(formData.costo) : null,
        fecha: formData.fecha
      };

      await onGuardar(vehiculo.id, nuevoMantenimiento);

      console.log('✅ Mantenimiento registrado:', nuevoMantenimiento);

      // Cerrar modal
      onCerrar();

      // Esperar un poco
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mostrar alerta de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Mantenimiento Registrado!',
        html: `
          <div style="font-size: 1.1rem; margin-top: 15px;">
            <strong style="color: #2563eb; font-size: 1.2rem;">${formData.tipo}</strong>
            <p style="margin-top: 10px; color: #64748b;">
              ha sido registrado exitosamente para <strong>${vehiculo.nombre}</strong>
            </p>
          </div>
        `,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#667eea',
        timer: 3000,
        timerProgressBar: true,
        width: '500px'
      });

    } catch (error) {
      console.error('Error al registrar mantenimiento:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar el mantenimiento. Intenta nuevamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-reg-mant-overlay" onClick={onCerrar}>
      <div className="modal-reg-mant-contenido" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-reg-mant-header">
          <div className="modal-reg-mant-header-info">
            <div className="modal-reg-mant-icono">
              <Wrench size={24} />
            </div>
            <div>
              <h2>Registrar Mantenimiento</h2>
              <p>{vehiculo.nombre} • {vehiculo.numero_placa}</p>
            </div>
          </div>
          <button className="modal-reg-mant-btn-cerrar" onClick={onCerrar}>
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <div className="modal-reg-mant-form">
          {/* Tipo de mantenimiento */}
          <div className="modal-reg-mant-form-group">
            <label htmlFor="tipo">
              <Wrench size={18} />
              Tipo de Mantenimiento <span className="modal-reg-mant-required">*</span>
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={errores.tipo ? 'error' : ''}
            >
              <option value="">Selecciona un tipo</option>
              {tiposMantenimiento.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
            {errores.tipo && (
              <span className="modal-reg-mant-error">{errores.tipo}</span>
            )}
          </div>

          {/* Campo para nuevo tipo de mantenimiento */}
          {mostrarCampoNuevoTipo && (
            <div className="modal-reg-mant-form-group" style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', border: '2px dashed #667eea' }}>
              <label htmlFor="nuevoTipo" style={{ color: '#1e40af' }}>
                <Plus size={18} />
                Nuevo Tipo de Mantenimiento
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                <input
                  type="text"
                  id="nuevoTipo"
                  value={nuevoTipo}
                  onChange={(e) => setNuevoTipo(e.target.value)}
                  placeholder="Ej: Cambio de Batería"
                  style={{ flex: 1 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAgregarNuevoTipo();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAgregarNuevoTipo}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '8px', marginBottom: '0' }}>
                Escribe el nombre del nuevo tipo y presiona "Agregar" o Enter
              </p>
            </div>
          )}

          {/* Kilometraje y Fecha */}
          <div className="modal-reg-mant-form-row">
            <div className="modal-reg-mant-form-group">
              <label htmlFor="kilometraje">
                <Calendar size={18} />
                Kilometraje Actual <span className="modal-reg-mant-required">*</span>
              </label>
              <input
                type="number"
                id="kilometraje"
                name="kilometraje"
                value={formData.kilometraje}
                onChange={handleChange}
                min={mantenimiento.kilometraje_actual}
                className={errores.kilometraje ? 'error' : ''}
                placeholder="0"
              />
              {errores.kilometraje && (
                <span className="modal-reg-mant-error">{errores.kilometraje}</span>
              )}
            </div>

            <div className="modal-reg-mant-form-group">
              <label htmlFor="fecha">
                <Calendar size={18} />
                Fecha <span className="modal-reg-mant-required">*</span>
              </label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className={errores.fecha ? 'error' : ''}
              />
              {errores.fecha && (
                <span className="modal-reg-mant-error">{errores.fecha}</span>
              )}
            </div>
          </div>

          {/* Costo */}
          <div className="modal-reg-mant-form-group">
            <label htmlFor="costo">
              <DollarSign size={18} />
              Costo (MXN)
            </label>
            <input
              type="number"
              id="costo"
              name="costo"
              value={formData.costo}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={errores.costo ? 'error' : ''}
              placeholder="0.00"
            />
            {errores.costo && (
              <span className="modal-reg-mant-error">{errores.costo}</span>
            )}
          </div>

          {/* Descripción */}
          <div className="modal-reg-mant-form-group">
            <label htmlFor="descripcion">
              <FileText size={18} />
              Descripción del Trabajo <span className="modal-reg-mant-required">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={errores.descripcion ? 'error' : ''}
              placeholder="Describe el trabajo realizado, piezas cambiadas, observaciones, etc."
              rows="4"
            />
            {errores.descripcion && (
              <span className="modal-reg-mant-error">{errores.descripcion}</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-reg-mant-footer">
          <button 
            type="button" 
            className="modal-reg-mant-btn-cancelar" 
            onClick={onCerrar}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button 
            type="button"
            className={`modal-reg-mant-btn-guardar ${guardando ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={guardando}
          >
            {!guardando && <Save size={20} />}
            <span>{guardando ? 'Guardando...' : 'Guardar Mantenimiento'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistrarMantenimiento;
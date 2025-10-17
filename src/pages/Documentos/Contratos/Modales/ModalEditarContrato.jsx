import React, { useState, useEffect, useCallback } from 'react';
import { X, Save, User, Mail, Phone, FileText, Globe, MapPin, Car, Users, AlertCircle, Calendar, Clock } from 'lucide-react';

// Asegúrate de importar el CSS actualizado
import './ModalEditarContrato.css';

const ModalEditarContrato = ({ estaAbierto, contrato, alCerrar, alGuardar }) => {
  const [datosFormulario, setDatosFormulario] = useState({
    // Datos cotización
    fechaSalida: '',
    fechaRegreso: '',
    horaSalida: '',
    horaRegreso: '',
    pasajeros: '',
    origenServicio: '',
    puntoIntermedio: '',
    destinoServicio: '',

    // Datos vehículo
    modelo_vehiculo: '',
    marca_vehiculo: '',
    color: '',
    n_pasajero_vehiculo: '',
    numero_serie: '',
    numero_tag: '',
    numero_placa: '',

    // Datos Operadores 
    nombre_operador: '',
    apellido_materno_operador: '',
    apellido_paterno_operador: '',
    telefono_operador: '',
    telefono_familiar_operador: '',
    correo_electronico_operador: '',
    numero_licencia: '',

    // Datos guía
    nombre_guia: '',
    apellido_paterno_guia: '',
    apellido_materno_guia: '',
    telefono_guia: '',
    correo_electronico_guia: '',
  });

  const [seccionActiva, setSeccionActiva] = useState('cotizacion');
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  // Cargar datos del contrato cuando se abre el modal
  useEffect(() => {
    if (estaAbierto && contrato) {
      setDatosFormulario({
        fechaSalida: contrato.fechaSalida || '',
        fechaRegreso: contrato.fechaRegreso || '',
        horaSalida: contrato.horaSalida || '',
        horaRegreso: contrato.horaRegreso || '',
        pasajeros: contrato.pasajeros || '',
        origenServicio: contrato.origenServicio || '',
        puntoIntermedio: contrato.puntoIntermedio || '',
        destinoServicio: contrato.destinoServicio || '',

        modelo_vehiculo: contrato.modelo_vehiculo || '',
        marca_vehiculo: contrato.marca_vehiculo || '',
        color: contrato.color || '',
        n_pasajero_vehiculo: contrato.n_pasajero_vehiculo || '',
        numero_serie: contrato.numero_serie || '',
        numero_tag: contrato.numero_tag || '',
        numero_placa: contrato.numero_placa || '',

        nombre_operador: contrato.nombre_operador || '',
        apellido_materno_operador: contrato.apellido_materno_operador || '',
        apellido_paterno_operador: contrato.apellido_paterno_operador || '',
        telefono_operador: contrato.telefono_operador || '',
        telefono_familiar_operador: contrato.telefono_familiar_operador || '',
        correo_electronico_operador: contrato.correo_electronico_operador || '',
        numero_licencia: contrato.numero_licencia || '',

        nombre_guia: contrato.nombre_guia || '',
        apellido_paterno_guia: contrato.apellido_paterno_guia || '',
        apellido_materno_guia: contrato.apellido_materno_guia || '',
        telefono_guia: contrato.telefono_guia || '',
        correo_electronico_guia: contrato.correo_electronico_guia || '',
      });
      setErrores({});
    }
  }, [estaAbierto, contrato]);

  const limpiarErrorCampo = useCallback((nombreCampo) => {
    setErrores((prev) => {
      const nuevosErrores = { ...prev };
      delete nuevosErrores[nombreCampo];
      return nuevosErrores;
    });
  }, []);

  const manejarCambioFormulario = useCallback((evento) => {
    const { name, value } = evento.target;
    setDatosFormulario(datosAnteriores => ({
      ...datosAnteriores,
      [name]: value
    }));

    if (errores[name]) {
      limpiarErrorCampo(name);
    }
  }, [errores, limpiarErrorCampo]);

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validaciones campos cotización (obligatorios)
    if (!datosFormulario.fechaSalida.trim()) {
      nuevosErrores.fechaSalida = 'La fecha de salida es obligatoria';
    }

    if (!datosFormulario.fechaRegreso.trim()) {
      nuevosErrores.fechaRegreso = 'La fecha de regreso es obligatoria';
    }

    // Validar que fecha de regreso sea posterior a fecha de salida
    if (datosFormulario.fechaSalida && datosFormulario.fechaRegreso) {
      const salida = new Date(datosFormulario.fechaSalida);
      const regreso = new Date(datosFormulario.fechaRegreso);
      if (regreso < salida) {
        nuevosErrores.fechaRegreso = 'La fecha de regreso debe ser posterior a la de salida';
      }
    }

    if (!datosFormulario.horaSalida.trim()) {
      nuevosErrores.horaSalida = 'La hora de salida es obligatoria';
    }

    if (!datosFormulario.horaRegreso.trim()) {
      nuevosErrores.horaRegreso = 'La hora de regreso es obligatoria';
    }

    if (!datosFormulario.pasajeros) {
      nuevosErrores.pasajeros = 'El número de pasajeros es obligatorio';
    } else if (parseInt(datosFormulario.pasajeros) < 1) {
      nuevosErrores.pasajeros = 'Debe haber al menos 1 pasajero';
    }

    if (!datosFormulario.origenServicio.trim()) {
      nuevosErrores.origenServicio = 'El origen del servicio es obligatorio';
    } else if (datosFormulario.origenServicio.trim().length < 3) {
      nuevosErrores.origenServicio = 'El origen debe tener al menos 3 caracteres';
    }

    if (!datosFormulario.destinoServicio.trim()) {
      nuevosErrores.destinoServicio = 'El destino del servicio es obligatorio';
    } else if (datosFormulario.destinoServicio.trim().length < 3) {
      nuevosErrores.destinoServicio = 'El destino debe tener al menos 3 caracteres';
    }

    return nuevosErrores;
  };

  const mostrarNotificacionExito = () => {
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        title: '¡Excelente!',
        text: 'La información de la contrato se ha actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Perfecto',
        confirmButtonColor: '#2563eb',
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'swal-popup-custom-contrato',
          title: 'swal-title-custom-contrato',
          confirmButton: 'swal-confirm-custom-contrato'
        }
      });
    }
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);

      // Cambiar a la sección que tiene errores
      const camposCotizacion = ['fechaSalida', 'fechaRegreso', 'horaSalida', 'horaRegreso', 'pasajeros', 'origenServicio', 'puntoIntermedio', 'destinoServicio'];
      const erroresEnCotizacion = Object.keys(nuevosErrores).some(key => camposCotizacion.includes(key));

      if (erroresEnCotizacion) {
        setSeccionActiva('cotizacion');
      }

      // Focus en el primer campo con error
      setTimeout(() => {
        const primerCampoConError = Object.keys(nuevosErrores)[0];
        const elemento = document.getElementById(primerCampoConError);
        if (elemento) {
          elemento.focus();
          elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      return;
    }

    setGuardando(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const datosActualizados = {
        ...contrato,
        ...datosFormulario,
        fecha_actualizacion: new Date().toISOString()
      };

      await alGuardar(datosActualizados);

      mostrarNotificacionExito();

      setTimeout(() => {
        manejarCerrar();
      }, 500);

    } catch (error) {
      console.error('Error al guardar:', error);
      if (typeof window !== 'undefined' && window.Swal) {
        window.Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al guardar la información. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Reintentar',
          confirmButtonColor: '#ef4444'
        });
      }
    } finally {
      setGuardando(false);
    }
  };

  const manejarCerrar = () => {
    if (guardando) return;
    setErrores({});
    setGuardando(false);
    alCerrar();
  };

  const MensajeError = ({ nombreCampo }) => {
    const error = errores[nombreCampo];
    if (!error) return null;
    return (
      <span className="meo-error-mensaje">
        <AlertCircle size={14} />
        {error}
      </span>
    );
  };

  const renderSeccionCotizacion = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="fechaSalida">
          <Calendar size={18} />
          Fecha de Salida <span className="meo-required">*</span>
        </label>
        <input
          type="date"
          id="fechaSalida"
          name="fechaSalida"
          value={datosFormulario.fechaSalida}
          onChange={manejarCambioFormulario}
          className={errores.fechaSalida ? 'input-error' : ''}
          disabled={guardando}
        />
        <MensajeError nombreCampo="fechaSalida" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="fechaRegreso">
          <Calendar size={18} />
          Fecha de Regreso <span className="meo-required">*</span>
        </label>
        <input
          type="date"
          id="fechaRegreso"
          name="fechaRegreso"
          value={datosFormulario.fechaRegreso}
          onChange={manejarCambioFormulario}
          className={errores.fechaRegreso ? 'input-error' : ''}
          disabled={guardando}
        />
        <MensajeError nombreCampo="fechaRegreso" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="horaSalida">
          <Clock size={18} />
          Hora de Salida <span className="meo-required">*</span>
        </label>
        <input
          type="time"
          id="horaSalida"
          name="horaSalida"
          value={datosFormulario.horaSalida}
          onChange={manejarCambioFormulario}
          className={errores.horaSalida ? 'input-error' : ''}
          disabled={guardando}
        />
        <MensajeError nombreCampo="horaSalida" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="horaRegreso">
          <Clock size={18} />
          Hora de Regreso <span className="meo-required">*</span>
        </label>
        <input
          type="time"
          id="horaRegreso"
          name="horaRegreso"
          value={datosFormulario.horaRegreso}
          onChange={manejarCambioFormulario}
          className={errores.horaRegreso ? 'input-error' : ''}
          disabled={guardando}
        />
        <MensajeError nombreCampo="horaRegreso" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="pasajeros">
          <Users size={18} />
          Número de Pasajeros <span className="meo-required">*</span>
        </label>
        <input
          type="number"
          id="pasajeros"
          name="pasajeros"
          value={datosFormulario.pasajeros}
          onChange={manejarCambioFormulario}
          className={errores.pasajeros ? 'input-error' : ''}
          placeholder="15"
          disabled={guardando}
          min="1"
        />
        <MensajeError nombreCampo="pasajeros" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="origenServicio">
          <MapPin size={18} />
          Origen del Servicio <span className="meo-required">*</span>
        </label>
        <input
          type="text"
          id="origenServicio"
          name="origenServicio"
          value={datosFormulario.origenServicio}
          onChange={manejarCambioFormulario}
          className={errores.origenServicio ? 'input-error' : ''}
          placeholder="Ciudad o dirección de origen"
          disabled={guardando}
        />
        <MensajeError nombreCampo="origenServicio" />
      </div>

      <div className="meo-form-group">
        <label htmlFor="puntoIntermedio">
          <MapPin size={18} />
          Punto Intermedio
        </label>
        <input
          type="text"
          id="puntoIntermedio"
          name="puntoIntermedio"
          value={datosFormulario.puntoIntermedio}
          onChange={manejarCambioFormulario}
          placeholder="Parada intermedia (opcional)"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="destinoServicio">
          <MapPin size={18} />
          Destino del Servicio <span className="meo-required">*</span>
        </label>
        <input
          type="text"
          id="destinoServicio"
          name="destinoServicio"
          value={datosFormulario.destinoServicio}
          onChange={manejarCambioFormulario}
          className={errores.destinoServicio ? 'input-error' : ''}
          placeholder="Ciudad o dirección de destino"
          disabled={guardando}
        />
        <MensajeError nombreCampo="destinoServicio" />
      </div>
    </div>
  );

  const renderSeccionVehiculo = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="marca_vehiculo">
          <Car size={18} />
          Marca del Vehículo
        </label>
        <input
          type="text"
          id="marca_vehiculo"
          name="marca_vehiculo"
          value={datosFormulario.marca_vehiculo}
          onChange={manejarCambioFormulario}
          placeholder="Toyota, Mercedes, etc."
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="modelo_vehiculo">
          <Car size={18} />
          Modelo del Vehículo
        </label>
        <input
          type="text"
          id="modelo_vehiculo"
          name="modelo_vehiculo"
          value={datosFormulario.modelo_vehiculo}
          onChange={manejarCambioFormulario}
          placeholder="Hiace, Sprinter, etc."
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="color">Color</label>
        <input
          type="text"
          id="color"
          name="color"
          value={datosFormulario.color}
          onChange={manejarCambioFormulario}
          placeholder="Blanco, Negro, etc."
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="n_pasajero_vehiculo">
          <Users size={18} />
          Número de Pasajeros
        </label>
        <input
          type="number"
          id="n_pasajero_vehiculo"
          name="n_pasajero_vehiculo"
          value={datosFormulario.n_pasajero_vehiculo}
          onChange={manejarCambioFormulario}
          placeholder="15"
          disabled={guardando}
          min="1"
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="numero_serie">Número de Serie</label>
        <input
          type="text"
          id="numero_serie"
          name="numero_serie"
          value={datosFormulario.numero_serie}
          onChange={manejarCambioFormulario}
          placeholder="Ingrese el número de serie"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="numero_tag">Número de TAG</label>
        <input
          type="text"
          id="numero_tag"
          name="numero_tag"
          value={datosFormulario.numero_tag}
          onChange={manejarCambioFormulario}
          placeholder="Ingrese el número de TAG"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="numero_placa">Número de Placa</label>
        <input
          type="text"
          id="numero_placa"
          name="numero_placa"
          value={datosFormulario.numero_placa}
          onChange={manejarCambioFormulario}
          placeholder="ABC-123-D"
          disabled={guardando}
          style={{ textTransform: 'uppercase' }}
        />
      </div>
    </div>
  );

  const renderSeccionOperador = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="nombre_operador">
          <User size={18} />
          Nombre del Operador
        </label>
        <input
          type="text"
          id="nombre_operador"
          name="nombre_operador"
          value={datosFormulario.nombre_operador}
          onChange={manejarCambioFormulario}
          placeholder="Nombre"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="apellido_paterno_operador">Apellido Paterno</label>
        <input
          type="text"
          id="apellido_paterno_operador"
          name="apellido_paterno_operador"
          value={datosFormulario.apellido_paterno_operador}
          onChange={manejarCambioFormulario}
          placeholder="Apellido Paterno"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="apellido_materno_operador">Apellido Materno</label>
        <input
          type="text"
          id="apellido_materno_operador"
          name="apellido_materno_operador"
          value={datosFormulario.apellido_materno_operador}
          onChange={manejarCambioFormulario}
          placeholder="Apellido Materno"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="telefono_operador">
          <Phone size={18} />
          Teléfono del Operador
        </label>
        <input
          type="tel"
          id="telefono_operador"
          name="telefono_operador"
          value={datosFormulario.telefono_operador}
          onChange={manejarCambioFormulario}
          placeholder="9511234567"
          disabled={guardando}
          maxLength="10"
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="telefono_familiar_operador">Teléfono Familiar</label>
        <input
          type="tel"
          id="telefono_familiar_operador"
          name="telefono_familiar_operador"
          value={datosFormulario.telefono_familiar_operador}
          onChange={manejarCambioFormulario}
          placeholder="9511234567"
          disabled={guardando}
          maxLength="10"
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="correo_electronico_operador">
          <Mail size={18} />
          Email del Operador
        </label>
        <input
          type="email"
          id="correo_electronico_operador"
          name="correo_electronico_operador"
          value={datosFormulario.correo_electronico_operador}
          onChange={manejarCambioFormulario}
          placeholder="operador@ejemplo.com"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="numero_licencia">
          <FileText size={18} />
          Número de Licencia
        </label>
        <input
          type="text"
          id="numero_licencia"
          name="numero_licencia"
          value={datosFormulario.numero_licencia}
          onChange={manejarCambioFormulario}
          placeholder="Ingrese el número de licencia"
          disabled={guardando}
        />
      </div>
    </div>
  );

  const renderSeccionGuia = () => (
    <div className="meo-form-grid">
      <div className="meo-form-group">
        <label htmlFor="nombre_guia">
          <User size={18} />
          Nombre del Guía
        </label>
        <input
          type="text"
          id="nombre_guia"
          name="nombre_guia"
          value={datosFormulario.nombre_guia}
          onChange={manejarCambioFormulario}
          placeholder="Nombre"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="apellido_paterno_guia">Apellido Paterno</label>
        <input
          type="text"
          id="apellido_paterno_guia"
          name="apellido_paterno_guia"
          value={datosFormulario.apellido_paterno_guia}
          onChange={manejarCambioFormulario}
          placeholder="Apellido Paterno"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="apellido_materno_guia">Apellido Materno</label>
        <input
          type="text"
          id="apellido_materno_guia"
          name="apellido_materno_guia"
          value={datosFormulario.apellido_materno_guia}
          onChange={manejarCambioFormulario}
          placeholder="Apellido Materno"
          disabled={guardando}
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="telefono_guia">
          <Phone size={18} />
          Teléfono del Guía
        </label>
        <input
          type="tel"
          id="telefono_guia"
          name="telefono_guia"
          value={datosFormulario.telefono_guia}
          onChange={manejarCambioFormulario}
          placeholder="9511234567"
          disabled={guardando}
          maxLength="10"
        />
      </div>

      <div className="meo-form-group">
        <label htmlFor="correo_electronico_guia">
          <Mail size={18} />
          Email del Guía
        </label>
        <input
          type="email"
          id="correo_electronico_guia"
          name="correo_electronico_guia"
          value={datosFormulario.correo_electronico_guia}
          onChange={manejarCambioFormulario}
          placeholder="guia@ejemplo.com"
          disabled={guardando}
        />
      </div>
    </div>
  );

  if (!estaAbierto || !contrato) return null;

  return (
    <div className="meo-overlay" onClick={manejarCerrar}>
      <div className="meo-contenido modal-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="meo-header">
          <h2>Editar Contrato</h2>
          <button className="meo-btn-cerrar" onClick={manejarCerrar} disabled={guardando} type="button">
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

        {/* Formulario (scrolleable) */}
        <form onSubmit={manejarEnvio} className="meo-form">
          {seccionActiva === 'cotizacion' && renderSeccionCotizacion()}
          {seccionActiva === 'vehiculo' && renderSeccionVehiculo()}
          {seccionActiva === 'operador' && renderSeccionOperador()}
          {seccionActiva === 'guia' && renderSeccionGuia()}
        </form>

        {/* Footer */}
        <div className="meo-footer">
          <div className="meo-botones-izquierda">
            <button type="button" className="meo-btn-cancelar" onClick={manejarCerrar} disabled={guardando}>
              Cancelar
            </button>
          </div>
          <div className="meo-botones-derecha">
            <button
              type="button"
              className={`meo-btn-actualizar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
              onClick={manejarEnvio}
            >
              {!guardando && <Save size={20} />}
              <span>{guardando ? 'Actualizando...' : 'Actualizar Contrato'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarContrato;
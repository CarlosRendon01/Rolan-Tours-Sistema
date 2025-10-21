import React, { useState, useEffect } from 'react';
import { Edit, User, Mail, Phone, FileText, Globe, MapPin, X, Save, AlertCircle } from 'lucide-react';
import './ModalEditarCliente.css';

const ModalEditarCliente = ({ estaAbierto, cliente, alCerrar, alGuardar }) => {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    numero_lead: '',
    canal_contacto: '',
    rfc: '',
    direccion: '',
    fecha_registro: ''
  });

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  // Cargar datos del cliente cuando se abre el modal
  useEffect(() => {
    if (estaAbierto && cliente) {
      setDatosFormulario({
        nombre: cliente.nombre || '',
        email: cliente.email || '',
        telefono: cliente.telefono || '',
        numero_lead: cliente.numero_lead || '',
        canal_contacto: cliente.canal_contacto || '',
        rfc: cliente.rfc || '',
        direccion: cliente.direccion || '',
        fecha_registro: cliente.fecha_registro || ''
      });
      setErrores({});
    }
  }, [estaAbierto, cliente]);

  // Manejar la tecla Escape
  useEffect(() => {
    const manejarTeclaEscape = (evento) => {
      if (evento.key === 'Escape' && estaAbierto) {
        manejarCerrar();
      }
    };

    if (estaAbierto) {
      document.addEventListener('keydown', manejarTeclaEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', manejarTeclaEscape);
      document.body.style.overflow = 'unset';
    };
  }, [estaAbierto]);

  const manejarCambioFormulario = (evento) => {
    const { name, value } = evento.target;
    setDatosFormulario(datosAnteriores => ({
      ...datosAnteriores,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(erroresAnteriores => ({
        ...erroresAnteriores,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosFormulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (datosFormulario.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!datosFormulario.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosFormulario.email)) {
      nuevosErrores.email = 'El email no tiene un formato válido';
    }

    if (!datosFormulario.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    } else if (!/^\d{10}$/.test(datosFormulario.telefono.replace(/\D/g, ''))) {
      nuevosErrores.telefono = 'El teléfono debe tener 10 dígitos';
    }

    if (!datosFormulario.numero_lead.trim()) {
      nuevosErrores.numero_lead = 'El número de lead es obligatorio';
    }

    if (!datosFormulario.canal_contacto) {
      nuevosErrores.canal_contacto = 'Debe seleccionar un canal de contacto';
    }

    if (!datosFormulario.rfc.trim()) {
      nuevosErrores.rfc = 'El RFC es obligatorio';
    } else if (!/^[A-Z&Ñ]{3,4}\d{6}[A-Z\d]{3}$/.test(datosFormulario.rfc.toUpperCase())) {
      nuevosErrores.rfc = 'El formato del RFC no es válido';
    }
    return nuevosErrores;
  };

  const mostrarNotificacionExito = () => {
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        title: '¡Excelente!',
        text: 'La información del cliente se ha actualizado correctamente',
        icon: 'success',
        iconHtml: '✓',
        iconColor: '#27ae60',
        confirmButtonText: 'Perfecto',
        confirmButtonColor: '#27ae60',
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        },
        customClass: {
          popup: 'swal-popup-custom-editar',
          title: 'swal-title-custom-editar',
          content: 'swal-content-custom-editar',
          confirmButton: 'swal-button-custom-editar',
          icon: 'swal-icon-success-custom'
        },
        background: '#ffffff',
        backdrop: `
        rgba(44, 62, 80, 0.8)
        left top
        no-repeat
      `
      });
    } else {
      alert('La información del cliente se ha actualizado correctamente');
    }
  };

  const mostrarNotificacionError = () => {
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        title: 'Error de validación',
        text: 'Por favor, revisa los campos marcados en rojo',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#e74c3c',
        customClass: {
          popup: 'swal-popup-custom-editar',
          title: 'swal-title-custom-editar',
          content: 'swal-content-custom-editar',
          confirmButton: 'swal-button-error-editar'
        }
      });
    }
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      mostrarNotificacionError();

      // Hacer scroll al primer campo con error
      const primerCampoConError = Object.keys(nuevosErrores)[0];
      const elemento = document.getElementById(primerCampoConError);
      if (elemento) {
        elemento.focus();
        elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return;
    }

    setGuardando(true);

    try {
      // Simular delay de guardado (remover en producción)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Llamar a la función alGuardar con los datos actualizados
      const datosActualizados = {
        ...cliente,
        ...datosFormulario,
        rfc: datosFormulario.rfc.toUpperCase(), // RFC siempre en mayúsculas
        fecha_actualizacion: new Date().toISOString()
      };

      await alGuardar(datosActualizados);

      // Mostrar notificación de éxito
      mostrarNotificacionExito();

      // Cerrar modal después de un breve delay
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
          confirmButtonColor: '#e74c3c',
          customClass: {
            popup: 'swal-popup-custom-editar',
            title: 'swal-title-custom-editar',
            content: 'swal-content-custom-editar',
            confirmButton: 'swal-button-error-editar'
          }
        });
      } else {
        alert('Hubo un problema al guardar la información. Por favor, intenta nuevamente.');
      }
    } finally {
      setGuardando(false);
    }
  };

  const manejarCerrar = () => {
    if (guardando) return; // No permitir cerrar mientras se guarda

    setErrores({});
    setGuardando(false);
    alCerrar();
  };

  if (!estaAbierto || !cliente) return null;

  return (
    <div className="superposicion-modal-editar" onClick={manejarCerrar}>
      <div className="contenido-modal-editar" onClick={(evento) => evento.stopPropagation()}>
        <div className="encabezado-modal-editar">
          <h2 className="titulo-modal-editar">
            <Edit size={26} />
            Editar Cliente
          </h2>
          <button
            className="boton-cerrar-modal-editar"
            onClick={manejarCerrar}
            disabled={guardando}
            aria-label="Cerrar modal"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="cuerpo-modal-editar">
          <div className="cuadricula-formulario-editar">
            {/* Nombre Completo */}
            <div className="campo-formulario-editar">
              <label htmlFor="nombre" className="etiqueta-formulario-editar">
                <User size={18} />
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={datosFormulario.nombre}
                onChange={manejarCambioFormulario}
                className={`entrada-formulario-editar ${errores.nombre ? 'entrada-error' : ''}`}
                placeholder="Ingrese el nombre completo del cliente"
                disabled={guardando}
                autoComplete="name"
              />
              {errores.nombre && (
                <div className="mensaje-error">
                  <AlertCircle size={14} />
                  {errores.nombre}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="campo-formulario-editar">
              <label htmlFor="email" className="etiqueta-formulario-editar">
                <Mail size={18} />
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={datosFormulario.email}
                onChange={manejarCambioFormulario}
                className={`entrada-formulario-editar ${errores.email ? 'entrada-error' : ''}`}
                placeholder="ejemplo@empresa.com"
                disabled={guardando}
                autoComplete="email"
              />
              {errores.email && (
                <div className="mensaje-error">
                  <AlertCircle size={14} />
                  {errores.email}
                </div>
              )}
            </div>

            {/* Teléfono */}
            <div className="campo-formulario-editar">
              <label htmlFor="telefono" className="etiqueta-formulario-editar">
                <Phone size={18} />
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={datosFormulario.telefono}
                onChange={manejarCambioFormulario}
                className={`entrada-formulario-editar ${errores.telefono ? 'entrada-error' : ''}`}
                placeholder="951 123 4567"
                disabled={guardando}
                autoComplete="tel"
              />
              {errores.telefono && (
                <div className="mensaje-error">
                  <AlertCircle size={14} />
                  {errores.telefono}
                </div>
              )}
            </div>

            {/* Número Lead */}
            <div className="campo-formulario-editar">
              <label htmlFor="numero_lead" className="etiqueta-formulario-editar">
                <FileText size={18} />
                Número de Lead *
              </label>
              <input
                type="text"
                id="numero_lead"
                name="numero_lead"
                value={datosFormulario.numero_lead}
                onChange={manejarCambioFormulario}
                className={`entrada-formulario-editar ${errores.numero_lead ? 'entrada-error' : ''}`}
                placeholder="LEAD-001"
                disabled={guardando}
                style={{ textTransform: 'uppercase' }}
              />
              {errores.numero_lead && (
                <div className="mensaje-error">
                  <AlertCircle size={14} />
                  {errores.numero_lead}
                </div>
              )}
            </div>

            {/* Canal de Contacto */}
            <div className="campo-formulario-editar">
              <label htmlFor="canal_contacto" className="etiqueta-formulario-editar">
                <Globe size={18} />
                Canal de Contacto *
              </label>
              <select
                id="canal_contacto"
                name="canal_contacto"
                value={datosFormulario.canal_contacto}
                onChange={manejarCambioFormulario}
                className={`entrada-formulario-editar ${errores.canal_contacto ? 'entrada-error' : ''}`}
                disabled={guardando}
              >
                <option value="">Seleccionar canal de contacto</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Sitio Web">Sitio Web</option>
                <option value="Teléfono">Teléfono</option>
                <option value="Email">Email</option>
                <option value="Referido">Referido</option>
                <option value="Presencial">Presencial</option>
              </select>
              {errores.canal_contacto && (
                <div className="mensaje-error">
                  <AlertCircle size={14} />
                  {errores.canal_contacto}
                </div>
              )}
            </div>

            {/* RFC */}
            <div className="campo-formulario-editar">
              <label htmlFor="rfc" className="etiqueta-formulario-editar">
                <FileText size={18} />
                RFC *
              </label>
              <input
                type="text"
                id="rfc"
                name="rfc"
                value={datosFormulario.rfc}
                onChange={manejarCambioFormulario}
                className={`entrada-formulario-editar ${errores.rfc ? 'entrada-error' : ''}`}
                placeholder="ABCD850102XXX"
                disabled={guardando}
                maxLength="13"
                style={{ textTransform: 'uppercase' }}
              />
              {errores.rfc && (
                <div className="mensaje-error">
                  <AlertCircle size={14} />
                  {errores.rfc}
                </div>
              )}
            </div>

            {/* Dirección */}
            <div className="campo-formulario-editar campo-completo-editar">
              <label htmlFor="direccion" className="etiqueta-formulario-editar">
                <MapPin size={18} />
                Dirección Completa *
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={datosFormulario.direccion}
                onChange={manejarCambioFormulario}
                className={`entrada-formulario-editar ${errores.direccion ? 'entrada-error' : ''}`}
                placeholder="Calle, número, colonia, ciudad, estado, código postal"
                disabled={guardando}
                autoComplete="street-address"
              />
              {errores.direccion && (
                <div className="mensaje-error">
                  <AlertCircle size={14} />
                  {errores.direccion}
                </div>
              )}
            </div>
          </div>

          <div className="acciones-modal-editar">
            <button
              type="button"
              className="boton-cancelar-editar"
              onClick={manejarCerrar}
              disabled={guardando}
            >
              <X size={16} />
              Cancelar
            </button>
            <button
              type="submit"
              className={`boton-guardar-editar ${guardando ? 'loading' : ''}`}
              disabled={guardando}
            >
              <Save size={16} />
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarCliente;
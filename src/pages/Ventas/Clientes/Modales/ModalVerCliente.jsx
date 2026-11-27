import { ClientContactFieldsView } from '../ContactCustomFields';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../../../../config/api';
import {
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  MapPin,
  X,
  IdCard,
  Hash
} from 'lucide-react';
import './ModalVerCliente.css';
import customFieldDefinitions from '../kommoFields.json';
import { formatKommoValue } from '../../../../utils/kommoFormatting';

const definitionsById = new Map(customFieldDefinitions.map((field) => [Number(field.id), field]));

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

const ModalVerCliente = ({ estaAbierto, cliente, alCerrar, puedeEditar = false, onAssigned }) => {
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [savingLeadId, setSavingLeadId] = useState(null);
  const [assignmentError, setAssignmentError] = useState('');
  useEffect(() => {
    if (!estaAbierto || !puedeEditar) return;
    const token = localStorage.getItem('token');
    axios.get(`${API_CONFIG.BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setUsers(data.filter((user) => !user.deleted_at && user.estado !== 'inactivo')))
      .catch(() => setAssignmentError('No se pudo cargar la lista de usuarios.'));
  }, [estaAbierto, puedeEditar]);

  const guardarAsignacion = async (leadId) => {
    setSavingLeadId(leadId);
    setAssignmentError('');
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_CONFIG.BASE_URL}/leads/${leadId}/assignment`, {
        assigned_user_id: assignments[leadId] ? Number(assignments[leadId]) : null,
      }, { headers: { Authorization: `Bearer ${token}` } });
      await onAssigned?.();
    } catch (cause) {
      setAssignmentError(cause.response?.data?.error || 'No se pudo asignar el usuario.');
    } finally {
      setSavingLeadId(null);
    }
  };

  const restaurarScroll = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
  }, []);

  const manejarCierre = useCallback(() => {
    restaurarScroll();
    alCerrar();
  }, [alCerrar, restaurarScroll]);

  const telefonoFormateado = useMemo(
    () => formatearTelefono(cliente?.telefono),
    [cliente?.telefono]
  );

  const fechaFormateada = useMemo(
    () => formatearFecha(cliente?.fecha_registro),
    [cliente?.fecha_registro]
  );

  useEffect(() => {
    if (estaAbierto) {
      document.body.style.overflow = 'hidden';
    } else {
      restaurarScroll();
    }
  }, [estaAbierto, restaurarScroll]);

  useEffect(() => {
    const manejarTeclaEscape = (evento) => {
      if (evento.key === 'Escape') {
        manejarCierre();
      }
    };

    if (estaAbierto) {
      document.addEventListener('keydown', manejarTeclaEscape);
    }

    return () => {
      document.removeEventListener('keydown', manejarTeclaEscape);
    };
  }, [estaAbierto, manejarCierre]);

  if (!estaAbierto || !cliente) {
    return null;
  }

  return (
    <div className="superposicion-modal-ver" onClick={manejarCierre}>
      <div className="contenido-modal-ver" onClick={(e) => e.stopPropagation()}>
        <div className="encabezado-modal-ver">
          <button
            className="boton-cerrar-modal-ver"
            onClick={manejarCierre}
            aria-label="Cerrar modal"
            type="button"
          >
            <X size={20} />
          </button>
          <h2 className="titulo-modal-ver">
            <User size={24} />
            Información del Cliente
          </h2>
        </div>

        <div className="cuerpo-modal-ver">
          <div className="lista-informacion-cliente-ver">
            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <Hash size={16} />
                ID del Cliente
              </div>
              <div className="valor-informacion-ver">
                #{cliente.id || 'No disponible'}
              </div>
            </div>

            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <User size={16} />
                Nombre Completo
              </div>
              <div className="valor-informacion-ver">
                {cliente.nombre || 'No disponible'}
              </div>
            </div>

            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <Mail size={16} />
                Correo Electrónico
              </div>
              <div className="valor-informacion-ver">
                {cliente.email || cliente['CORREO ELECTRÓNICO'] || 'No disponible'}
              </div>
            </div>

            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <Phone size={16} />
                Teléfono
              </div>
              <div className="valor-informacion-ver">
                {telefonoFormateado}
              </div>
            </div>


            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <IdCard size={16} />
                RFC
              </div>
              <div className="valor-informacion-ver">
                {cliente.rfc || 'No disponible'}
              </div>
            </div>

            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <MapPin size={16} />
                Dirección
              </div>
              <div className="valor-informacion-ver">
                {cliente.direccion || 'No especificada'}
              </div>
            </div>

            <div className="elemento-informacion-ver">
              <div className="etiqueta-informacion-ver">
                <Calendar size={16} />
                Fecha de Registro
              </div>
              <div className="valor-informacion-ver">
                {fechaFormateada}
              </div>
            </div>
          </div>

          <ClientContactFieldsView client={cliente}/>
          <div className="cliente-leads-detalle">
            <h3>Leads del cliente</h3>
            {(cliente.leads || []).length === 0 && <p>Este cliente todavía no tiene leads.</p>}
            {assignmentError && <p role="alert" className="cliente-asignacion-error">{assignmentError}</p>}
            {(cliente.leads || []).map((lead) => (
              <section key={lead.id} className="cliente-lead-card">
                <h4>{lead.nombre || `Lead #${lead.id}`}</h4>
                <p>Embudo: {lead.pipeline_id ?? 'Sin dato'} · Etapa: {lead.etapa_id ?? 'Sin dato'}</p>
                <p>Nombre en Kommo (etiqueta): {lead.responsible_name || 'Sin dato'}</p>
                <p>Usuario asignado: {lead.assigned_user ? [lead.assigned_user.nombre, lead.assigned_user.apellido_paterno, lead.assigned_user.apellido_materno].filter(Boolean).join(' ') : 'Sin asignar'}</p>
                {puedeEditar && <div className="cliente-lead-asignacion">
                  <select aria-label={`Usuario del lead ${lead.id}`} value={assignments[lead.id] ?? lead.assigned_user_id ?? ''} onChange={(event) => setAssignments((current) => ({ ...current, [lead.id]: event.target.value }))}>
                    <option value="">Sin asignar</option>
                    {users.map((user) => <option key={user.id} value={user.id}>{[user.nombre, user.apellido_paterno, user.apellido_materno].filter(Boolean).join(' ')}</option>)}
                  </select>
                  <button type="button" disabled={savingLeadId === lead.id} onClick={() => guardarAsignacion(lead.id)}>{savingLeadId === lead.id ? 'Guardando...' : 'Asignar usuario'}</button>
                </div>}
                {lead.descripcion && <p>{lead.descripcion}</p>}
                {lead.precio != null && <p>Precio: ${Number(lead.precio).toLocaleString('es-MX')}</p>}
                {Array.isArray(lead.tags) && lead.tags.length > 0 && (
                  <div className="cliente-lead-tags">{lead.tags.map((tag, index) => <span key={tag.id || index}>{tag.name || tag.value || String(tag)}</span>)}</div>
                )}
                {Array.isArray(lead.custom_fields_values) && lead.custom_fields_values.length > 0 && (
                  <details>
                    <summary>Campos personalizados ({lead.custom_fields_values.length})</summary>
                    <dl>{lead.custom_fields_values.map((field, index) => (
                      <div key={field.field_id || index}>
                        <dt>{field.field_name || `Campo ${field.field_id}`}</dt>
                        <dd>{Array.isArray(field.values) && field.values.length ? field.values.map((item) => formatKommoValue(item.value, field.field_type || definitionsById.get(Number(field.field_id ?? field.id))?.type)).join(', ') : 'Sin valor'}</dd>
                      </div>
                    ))}</dl>
                  </details>
                )}
              </section>
            ))}
          </div>

          <div className="contenedor-boton-inferior-ver">
            <button
              className="boton-cerrar-inferior-ver"
              onClick={manejarCierre}
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerCliente;

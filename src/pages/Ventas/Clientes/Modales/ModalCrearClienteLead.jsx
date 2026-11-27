import ContactCustomFields from '../ContactCustomFields';
import { mergeClientContactFields } from '../contactFields';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, X } from 'lucide-react';
import { API_CONFIG } from '../../../../config/api';
import fields from '../kommoFields.json';
import stages from '../kommoStages.json';
import './ModalCrearClienteLead.css';

const pipelines = [
  { id: 9974080, name: 'Transporte' },
  { id: 9524560, name: 'Tours' },
  { id: 8347111, name: 'Trace Viajes' },
];

const fieldValue = (field, raw) => {
  if (field.type === 'numeric') return Number(raw);
  if (field.type === 'date' || field.type === 'date_time') {
    return Math.floor(new Date(raw).getTime() / 1000);
  }
  return raw;
};

const buildCustomFields = (selected, values) => selected.flatMap((fieldId) => {
  const field = fields.find((item) => item.id === fieldId);
  if (!field) return [];
  const raw = values[fieldId];
  const chosen = Array.isArray(raw) ? raw : [raw];
  const entries = chosen.filter((value) => value !== '' && value != null).map((value) => {
    const option = field.enums.find((item) => String(item.id) === String(value));
    return option
      ? { value: option.value, enum_id: option.id }
      : { value: fieldValue(field, value) };
  });
  return entries.length ? [{ field_id: field.id, field_name: field.name, field_type: field.type, values: entries }] : [];
});

export default function ModalCrearClienteLead({ onClose, onSaved }) {
  const [cliente, setCliente] = useState({ nombre: '', email: '', telefono: '', canal_contacto: '',rfc:'',direccion:'' });
  const [contactFields,setContactFields] = useState([]);
  const [lead, setLead] = useState({ nombre: '', descripcion: '', precio: '', pipeline_id: pipelines[0].id, etapa_id: stages.find((item) => item.pipelineId === pipelines[0].id)?.id, assigned_user_id: '' });
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [fieldToAdd, setFieldToAdd] = useState('');
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_CONFIG.BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setUsers(data.filter((user) => !user.deleted_at && user.estado !== 'inactivo')))
      .catch(() => setUsersError('No se pudo cargar la lista de usuarios.'));
  }, []);

  const setClientValue = (name, value) => setCliente((current) => ({ ...current, [name]: value }));
  const setLeadValue = (name, value) => setLead((current) => ({ ...current, [name]: value }));
  const availableFields = fields.filter((field) => !selectedFields.includes(field.id));
  const pipelineStages = stages.filter((stage) => stage.pipelineId === Number(lead.pipeline_id));

  const save = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_CONFIG.BASE_URL}/clientes/con-lead`, {
        cliente: {
          nombre: cliente.nombre.trim(),
          email: cliente.email.trim() || null,
          telefono: cliente.telefono.trim() || null,
          canal_contacto: cliente.canal_contacto.trim() || null,
          rfc:cliente.rfc.trim() || null,
          direccion:cliente.direccion.trim() || null,
          contact_custom_fields:mergeClientContactFields(contactFields,cliente),
        },
        lead: {
          nombre: lead.nombre.trim(),
          descripcion: lead.descripcion.trim() || null,
          precio: lead.precio === '' ? null : Number(lead.precio),
          pipeline_id: Number(lead.pipeline_id),
          etapa_id: Number(lead.etapa_id),
          assigned_user_id: Number(lead.assigned_user_id),
          tags: tags.split(',').map((name) => name.trim()).filter(Boolean).map((name) => ({ name })),
          custom_fields_values: buildCustomFields(selectedFields, values),
        },
      }, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
      await onSaved();
      onClose();
    } catch (cause) {
      const details = cause.response?.data?.errors;
      setError(details ? Object.values(details).flat().join(' ') : cause.response?.data?.error || 'No se pudo crear el cliente y su lead.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="nuevo-cliente-overlay" onClick={onClose}>
      <section className="nuevo-cliente-modal" role="dialog" aria-modal="true" aria-labelledby="nuevo-cliente-title" onClick={(event) => event.stopPropagation()}>
        <header className="nuevo-cliente-header">
          <div>
            <h2 id="nuevo-cliente-title">Añadir cliente con lead</h2>
            <p>Registra los datos del cliente y su oportunidad en una sola vez.</p>
          </div>
          <button type="button" className="nuevo-cliente-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </header>
        <form onSubmit={save}>
          <div className="nuevo-cliente-content">
            <fieldset>
              <legend>Cliente</legend>
              <div className="nuevo-cliente-grid">
                <label>Nombre *<input value={cliente.nombre} onChange={(e) => setClientValue('nombre', e.target.value)} required maxLength={255} /></label>
                <label>Correo<input type="email" value={cliente.email} onChange={(e) => setClientValue('email', e.target.value)} /></label>
                <label>Teléfono<input value={cliente.telefono} onChange={(e) => setClientValue('telefono', e.target.value)} /></label>
                <label>RFC<input value={cliente.rfc} onChange={(e) => setClientValue('rfc',e.target.value)}/></label>
                <label>Dirección<input value={cliente.direccion} onChange={(e) => setClientValue('direccion',e.target.value)}/></label>
              </div>
            </fieldset>
            <ContactCustomFields fields={contactFields} onChange={setContactFields} primary={cliente} disabled={saving}/>
            <fieldset>
              <legend>Lead</legend>
              <div className="nuevo-cliente-grid">
                <label>Nombre del lead *<input value={lead.nombre} onChange={(e) => setLeadValue('nombre', e.target.value)} required maxLength={255} /></label>
                <label>Precio<input type="number" min="0" step="0.01" value={lead.precio} onChange={(e) => setLeadValue('precio', e.target.value)} /></label>
                <label>Embudo *<select value={lead.pipeline_id} onChange={(e) => { const pipelineId = Number(e.target.value); setLead((current) => ({ ...current, pipeline_id: pipelineId, etapa_id: stages.find((item) => item.pipelineId === pipelineId)?.id })); }}>{pipelines.map((pipeline) => <option key={pipeline.id} value={pipeline.id}>{pipeline.name}</option>)}</select></label>
                <label>Etapa *<select value={lead.etapa_id || ''} onChange={(e) => setLeadValue('etapa_id', Number(e.target.value))} required>{pipelineStages.map((stage) => <option key={stage.id} value={stage.id}>{stage.name}</option>)}</select></label>
                <label>Responsable (usuario) *<select value={lead.assigned_user_id} onChange={(e) => setLeadValue('assigned_user_id', e.target.value)} required><option value="">Selecciona un usuario</option>{users.map((user) => <option key={user.id} value={user.id}>{[user.nombre, user.apellido_paterno, user.apellido_materno].filter(Boolean).join(' ')}</option>)}</select></label>
                <label>Etiquetas<input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Separadas por comas" /></label>
                <label className="nuevo-cliente-wide">Descripción<textarea rows={3} value={lead.descripcion} onChange={(e) => setLeadValue('descripcion', e.target.value)} /></label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Campos personalizados</legend>
              <p className="nuevo-cliente-help">Agrega solo los campos que tengan un valor para este lead.</p>
              <div className="nuevo-cliente-add-field">
                <select value={fieldToAdd} onChange={(e) => setFieldToAdd(e.target.value)} aria-label="Campo personalizado">
                  <option value="">Selecciona un campo</option>
                  {availableFields.map((field) => <option key={field.id} value={field.id}>{field.name}</option>)}
                </select>
                <button type="button" disabled={!fieldToAdd} onClick={() => { setSelectedFields((current) => [...current, Number(fieldToAdd)]); setFieldToAdd(''); }}><Plus size={16} /> Añadir campo</button>
              </div>
              {selectedFields.map((fieldId) => {
                const field = fields.find((item) => item.id === fieldId);
                if (!field) return null;
                const raw = values[fieldId] ?? (field.type === 'multiselect' ? [] : '');
                return <div className="nuevo-cliente-custom" key={fieldId}>
                  <label>{field.name}
                    {field.type === 'multiselect' ? <select multiple value={raw} onChange={(e) => setValues((current) => ({ ...current, [fieldId]: Array.from(e.target.selectedOptions, (option) => option.value) }))}>{field.enums.map((option) => <option key={option.id} value={option.id}>{option.value}</option>)}</select>
                      : field.type === 'select' ? <select value={raw} onChange={(e) => setValues((current) => ({ ...current, [fieldId]: e.target.value }))}><option value="">Selecciona</option>{field.enums.map((option) => <option key={option.id} value={option.id}>{option.value}</option>)}</select>
                        : <input type={field.type === 'numeric' ? 'number' : field.type === 'date' ? 'date' : field.type === 'date_time' ? 'datetime-local' : field.type === 'url' ? 'url' : 'text'} value={raw} onChange={(e) => setValues((current) => ({ ...current, [fieldId]: e.target.value }))} />}
                  </label>
                  <button type="button" onClick={() => setSelectedFields((current) => current.filter((id) => id !== fieldId))} aria-label={`Quitar ${field.name}`}><Trash2 size={16} /></button>
                </div>;
              })}
            </fieldset>
            {usersError && <p className="nuevo-cliente-error" role="alert">{usersError}</p>}
            {error && <p className="nuevo-cliente-error" role="alert">{error}</p>}
          </div>
          <footer className="nuevo-cliente-footer">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cliente y lead'}</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

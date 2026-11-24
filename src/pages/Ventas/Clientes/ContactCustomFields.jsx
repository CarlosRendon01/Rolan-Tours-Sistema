import { Plus, Trash2 } from 'lucide-react';
import { contactDefinitions, clientContactFields } from './contactFields';
import { formatKommoValue } from '../../../utils/kommoFormatting';
import './ContactCustomFields.css';
const mainIds = new Set([894068,894070,1475591,1478610]);
const labels = {WORK:'Trabajo',WORKDD:'Trabajo directo',MOB:'Móvil',FAX:'Fax',HOME:'Casa',OTHER:'Otro',PRIV:'Personal'};
const inputDate = (value) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}/u.test(String(value))) return String(value).slice(0,10);
  const date = new Date(Number(value)*1000);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0,10);
};
export default function ContactCustomFields({ fields, onChange, primary, disabled=false }) {
  const entries = (id) => fields.find((field) => Number(field.field_id)===id)?.values || [];
  const setEntries = (definition,values) => onChange([...fields.filter((field) => Number(field.field_id)!==definition.id),{field_id:definition.id,field_name:definition.name,field_type:definition.type,values}]);
  const optionEntry = (definition,value) => ({value,...(definition.enums.find((option) => option.value===value) ? {enum_id:definition.enums.find((option) => option.value===value).id} : {})});
  return <fieldset className="contacto-crm" disabled={disabled}><legend>Datos del contacto y facturación (CRM)</legend><div className="contacto-crm-grid">
    {contactDefinitions.filter((field) => !mainIds.has(field.id)).map((definition) => {
      const values=entries(definition.id); const value=values[0]?.value ?? '';
      if (definition.type==='multiselect') return <details className="contacto-crm-wide" key={definition.id}><summary>{definition.name} ({values.length} seleccionados)</summary><div className="contacto-crm-opciones">{definition.enums.map((option) => <label key={option.id}><input type="checkbox" checked={values.some((entry) => entry.value===option.value)} onChange={(event) => setEntries(definition,event.target.checked ? [...values,{value:option.value,enum_id:option.id}] : values.filter((entry) => entry.value!==option.value))}/>{option.value}</label>)}</div></details>;
      if (definition.type==='radiobutton') return <div className="contacto-crm-radio" key={definition.id}><span>{definition.name}</span><div>{[...definition.enums,{id:'empty',value:''}].map((option) => <label key={option.id}><input type="radio" name={`contacto-${definition.id}`} checked={value===option.value} onChange={() => setEntries(definition,option.value ? [optionEntry(definition,option.value)] : [])}/>{option.value || 'Sin especificar'}</label>)}</div></div>;
      return <label key={definition.id}>{definition.name}{definition.type==='select' ? <select value={value} onChange={(event) => setEntries(definition,event.target.value ? [optionEntry(definition,event.target.value)] : [])}><option value="">Sin especificar</option>{definition.enums.map((option) => <option key={option.id} value={option.value}>{option.value}</option>)}</select> : definition.type==='textarea' ? <textarea rows={2} value={value} onChange={(event) => setEntries(definition,[{value:event.target.value}])}/> : <input type={definition.type==='date' ? 'date' : definition.id===1478163 ? 'email' : 'text'} value={definition.type==='date' ? inputDate(value) : value} onChange={(event) => setEntries(definition,[{value:definition.type==='date' && event.target.value ? String(Date.parse(`${event.target.value}T00:00:00Z`)/1000) : event.target.value}])}/>}</label>;
    })}
    {[894068,894070].map((id) => {
      const definition=contactDefinitions.find((field) => field.id===id); const values=entries(id); const extra=values.slice(1);
      const changeExtra=(next) => setEntries(definition,[{...(values[0] || {}),value:primary[id===894068 ? 'telefono' : 'email'] || ''},...next]);
      return <div className="contacto-crm-wide contacto-crm-multiples" key={id}><strong>{id===894068 ? 'Teléfonos adicionales' : 'Correos adicionales'}</strong>{extra.map((entry,index) => <div key={index}><input aria-label={`${definition.name} adicional ${index+1}`} type={id===894070 ? 'email' : 'tel'} value={entry.value} onChange={(event) => changeExtra(extra.map((item,i) => i===index ? {...item,value:event.target.value} : item))}/><select aria-label={`Tipo de ${definition.name} ${index+1}`} value={entry.enum_id || ''} onChange={(event) => changeExtra(extra.map((item,i) => i===index ? {...item,enum_id:Number(event.target.value)} : item))}><option value="">Sin etiqueta</option>{definition.enums.map((option) => <option key={option.id} value={option.id}>{labels[option.value] || option.value}</option>)}</select><button type="button" aria-label={`Quitar ${definition.name} ${index+1}`} onClick={() => changeExtra(extra.filter((_,i) => i!==index))}><Trash2 size={16}/></button></div>)}<button type="button" onClick={() => changeExtra([...extra,{value:'',enum_id:definition.enums[0]?.id}])}><Plus size={15}/>{id===894068 ? 'Añadir teléfono' : 'Añadir correo'}</button></div>;
    })}
  </div></fieldset>;
}
export function ClientContactFieldsView({ client }) {
  const fields=clientContactFields(client).filter((field) => field.values?.length);
  if (!fields.length) return null;
  return <section className="contacto-crm-vista"><h3>Datos de contacto y facturación del CRM</h3><dl>{fields.map((field) => <div key={field.field_id}><dt>{field.field_name}</dt><dd>{field.values.map((entry,index) => <span key={index}>{formatKommoValue(entry.value,field.field_type)}{field.field_type==='multitext' && (entry.enum_code || entry.enum_id) ? ` (${labels[entry.enum_code] || labels[contactDefinitions.find((definition) => definition.id===field.field_id)?.enums.find((option) => option.id===entry.enum_id)?.value] || entry.enum_code || 'Otro'})` : ''}</span>)}</dd></div>)}</dl></section>;
}

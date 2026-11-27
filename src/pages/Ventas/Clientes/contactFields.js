import definitions from './kommoContactFields.json';
export { definitions as contactDefinitions };
const primaryColumns = {894068:'telefono',894070:'email',1478163:'email',1475591:'direccion',1478610:'rfc'};
export function clientContactChannel(client) {
  const values = client?.contact_custom_fields?.find((field) => Number(field.field_id) === 1471700)?.values;
  const channels = values?.map((entry) => entry.value) || client?.['Como conocio la empresa?'];
  return Array.isArray(channels) && channels.length ? channels.join(', ') : client?.canal_contacto || '';
}
export function clientContactFields(client) {
  const fields = (client?.contact_custom_fields || []).map((field) => ({...field,values:[...(field.values || [])]}));
  for (const definition of definitions) {
    if (fields.some((field) => Number(field.field_id)===definition.id)) continue;
    const raw = definition.id===894068 ? client?.telefonos : definition.id===894070 ? client?.correos : null;
    const value = client?.[primaryColumns[definition.id] || definition.name];
    const values = raw?.length ? raw : value == null || value === '' ? [] : (Array.isArray(value) ? value : [value]).map((entry) => ({value:entry}));
    fields.push({field_id:definition.id,field_name:definition.name,field_type:definition.type,values});
  }
  const emails = fields.find((field) => Number(field.field_id) === 894070);
  const alternate = fields.find((field) => Number(field.field_id) === 1478163)?.values?.[0]?.value || client?.['CORREO ELECTRÓNICO'];
  if (alternate && !emails.values.some((entry) => String(entry.value).toLowerCase() === String(alternate).toLowerCase())) emails.values.push({value:alternate});
  const channel = fields.find((field) => Number(field.field_id) === 1471700);
  if (!channel.values.length && client?.canal_contacto) channel.values = [{value:client.canal_contacto}];
  return fields;
}
export function mergeClientContactFields(fields, primary) {
  return definitions.map((definition) => {
    const field = fields.find((entry) => Number(entry.field_id)===definition.id);
    let values = field?.values || [];
    if (primaryColumns[definition.id]) {
      const value = primary[primaryColumns[definition.id]]?.trim() || '';
      const extra = definition.type==='multitext' ? values.slice(1) : [];
      values = [{...(values[0] || {}),value},...extra];
    }
    return {field_id:definition.id,field_name:definition.name,field_type:definition.type,values:values.filter((item) => item.value!=='' && item.value!=null).map((item) => ({...item,value:String(item.value)}))};
  });
}

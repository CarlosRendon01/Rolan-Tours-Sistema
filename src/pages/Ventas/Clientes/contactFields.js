import definitions from './kommoContactFields.json';
export { definitions as contactDefinitions };
const primaryColumns = {894068:'telefono',894070:'email',1475591:'direccion',1478610:'rfc'};
export function clientContactFields(client) {
  const fields = [...(client?.contact_custom_fields || [])];
  for (const definition of definitions) {
    if (fields.some((field) => Number(field.field_id)===definition.id)) continue;
    const raw = definition.id===894068 ? client?.telefonos : definition.id===894070 ? client?.correos : null;
    const value = client?.[primaryColumns[definition.id] || definition.name];
    const values = raw?.length ? raw : value == null || value === '' ? [] : (Array.isArray(value) ? value : [value]).map((entry) => ({value:entry}));
    fields.push({field_id:definition.id,field_name:definition.name,field_type:definition.type,values});
  }
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

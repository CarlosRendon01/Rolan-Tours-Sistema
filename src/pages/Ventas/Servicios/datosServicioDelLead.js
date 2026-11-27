import { kommoDateTimeToInputs } from '../../../utils/kommoFormatting.js';

export function datosServicioDelLead(lead) {
  const fields = Array.isArray(lead?.custom_fields_values) ? lead.custom_fields_values : [];
  const campo = (id, nombre) => {
    const field = fields.find((item) => Number(item?.field_id ?? item?.id) === id)
      ?? fields.find((item) => item?.field_name === nombre);
    return field?.values?.[0]?.value || lead?.[nombre] || lead?.[`cf_${id}`];
  };

  const inicio = kommoDateTimeToInputs(campo(1468851, 'FECHA INICIO DEL SERVICIO'));
  const fin = kommoDateTimeToInputs(campo(1468849, 'FECHA FIN DEL SERVICIO'));
  const pasajeros = Number(campo(956999, 'PAX') || lead?.pax);

  return {
    origen: campo(1468855, 'ORIGEN DEL SERVICIO') || lead?.origen_servicio || '',
    destino: campo(1468857, 'DESTINO A') || lead?.destino_servicio || campo(1468859, 'DESTINO B') || '',
    num_pasajeros: Number.isInteger(pasajeros) && pasajeros > 0 ? pasajeros : '',
    fecha_salida: inicio.fecha,
    hora_salida: inicio.hora,
    fecha_regreso: fin.fecha,
    hora_regreso: fin.hora,
  };
}

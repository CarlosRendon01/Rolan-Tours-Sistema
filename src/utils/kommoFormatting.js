const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };
const dateFormatter = new Intl.DateTimeFormat('es-MX', { ...dateOptions, timeZone: 'UTC' });
const dateTimeFormatter = new Intl.DateTimeFormat('es-MX', {
  ...dateOptions, hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'America/Mexico_City',
});
const dateTimeInputFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'America/Mexico_City',
});

function parseKommoDate(value) {
  const raw = typeof value === 'string' ? value.trim() : value;
  if (raw == null || raw === '') return new Date(NaN);
  if (typeof raw === 'number' || (typeof raw === 'string' && /^[+-]?\d+(?:\.\d+)?$/u.test(raw))) {
    const timestamp = Number(raw);
    return new Date(Math.abs(timestamp) < 1e12 ? timestamp * 1000 : timestamp);
  }
  // Unzoned serialized database dates are stored in UTC.
  const text = String(raw).replace(/^(\d{4}-\d{2}-\d{2}) /u, '$1T');
  return new Date(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/u.test(text) ? `${text}Z` : text);
}

export function kommoDateTimeToInputs(value) {
  const date = parseKommoDate(value);
  if (Number.isNaN(date.getTime())) return { fecha: '', hora: '' };
  const raw = typeof value === 'string' ? value.trim() : '';
  if (/^\d{4}-\d{2}-\d{2}$/u.test(raw)) return { fecha: raw, hora: '' };

  const { year, month, day, hour, minute } = Object.fromEntries(
    dateTimeInputFormatter.formatToParts(date).map(({ type, value }) => [type, value]),
  );
  return { fecha: `${year}-${month}-${day}`, hora: `${hour}:${minute}` };
}

export function formatKommoValue(value, type) {
  if (value == null || value === '') return 'Sin valor';
  if (!['date', 'date_time'].includes(type)) return String(value);
  const date = parseKommoDate(value);
  if (Number.isNaN(date.getTime())) return 'Fecha no válida';
  return (type === 'date' ? dateFormatter : dateTimeFormatter).format(date);
}

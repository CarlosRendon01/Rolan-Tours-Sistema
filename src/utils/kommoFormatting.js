const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };
const dateFormatter = new Intl.DateTimeFormat('es-MX', { ...dateOptions, timeZone: 'UTC' });
const dateTimeFormatter = new Intl.DateTimeFormat('es-MX', {
  ...dateOptions, hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'America/Mexico_City',
});

export function formatKommoValue(value, type) {
  if (value == null || value === '') return 'Sin valor';
  if (!['date', 'date_time'].includes(type)) return String(value);
  let date;
  const raw = typeof value === 'string' ? value.trim() : value;
  if (typeof raw === 'number' || (typeof raw === 'string' && /^[+-]?\d+(?:\.\d+)?$/u.test(raw))) {
    const timestamp = Number(raw);
    date = new Date(Math.abs(timestamp) < 1e12 ? timestamp * 1000 : timestamp);
  } else {
    // Unzoned serialized database dates are stored in UTC.
    const text = String(raw).replace(/^(\d{4}-\d{2}-\d{2}) /u, '$1T');
    date = new Date(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/u.test(text) ? `${text}Z` : text);
  }
  if (Number.isNaN(date.getTime())) return 'Fecha no válida';
  return (type === 'date' ? dateFormatter : dateTimeFormatter).format(date);
}

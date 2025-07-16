export function generateFormattedDate(date = new Date()) {
  const dateOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  const hourOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  const dateText = new Intl.DateTimeFormat('es-ES', dateOptions).format(date);
  const hourText = new Intl.DateTimeFormat('es-ES', hourOptions).format(date);

  return `${dateText.charAt(0).toUpperCase() + dateText.slice(1)} a las ${hourText}`;
}

/** "hace 6 min", "hace 2 h", "hace unos segundos". */
export function haceCuanto(fecha: string, ahora: number = Date.now()): string {
  const ms = ahora - new Date(fecha).getTime();
  if (Number.isNaN(ms)) return '';
  const min = Math.floor(Math.max(ms, 0) / 60000);
  if (min < 1) return 'hace unos segundos';
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
}

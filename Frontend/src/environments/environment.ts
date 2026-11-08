/**
 * Configuración de la aplicación.
 * apiUrl es relativa ('/api'): en desarrollo, `ng serve` redirige esas
 * peticiones al backend mediante proxy.conf.json, así que no hace falta CORS.
 */
export const environment = {
  apiUrl: '/api',
};

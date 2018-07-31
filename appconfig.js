/**
 * @providesModule AppConfig
 */
import { EU_FRANNKFURT_DOMAIN, US_VIRGINIA_DOMAIN } from 'AppConstants';

// export const API_URL = 'http://pms.hanastt.org:8800';
// export const API_URL = `http://${US_VIRGINIA_DOMAIN}:8800`;
const env = process.env.NODE_ENV;
console.info('NODE_ENV', env);
export const API_URL = env === 'development' ?
  'http://pms.hanastt.org:8800' : `http://${US_VIRGINIA_DOMAIN}:8800`;

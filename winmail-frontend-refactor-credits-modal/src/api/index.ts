import CONFIG from '@/config';

const API_BASE_URL = CONFIG.apiBaseUrl;
const API_VERSION = CONFIG.apiVersion;

export const API_URL = `${API_BASE_URL}/${API_VERSION}`;

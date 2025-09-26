import { API_URL } from '.';

const TEMPLATE_API_ENPOINTS = {
  GET_ALL_TEMPLATES: `${API_URL}/templates`,
  GET_TEMPLATE_BY_ID: (id: string) => `${API_URL}/templates/${id}`,
  CREATE_TEMPLATE: `${API_URL}/templates`,
  UPDATE_TEMPLATE: (id: string) => `${API_URL}/templates/${id}`,
  DELETE_TEMPLATE: (id: string) => `${API_URL}/templates/${id}`,
  SEARCH_TEMPLATES: (query: string) =>
    `${API_URL}/templates/search?query=${query}`,
} as const;

export default TEMPLATE_API_ENPOINTS;

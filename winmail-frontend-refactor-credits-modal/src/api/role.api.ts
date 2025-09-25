import { API_URL } from '.';

const ROLE_API_ENPOINTS = {
  GET_ALL_ROLES: `${API_URL}/users`,
  GET_ROLES_BY_ID: (id: string) => `${API_URL}/users/${id}`,
  CREATE_ROLE: `${API_URL}/users`,
  UPDATE_ROLE: (id: string) => `${API_URL}/users/${id}`,
  DELETE_ROLE: (id: string) => `${API_URL}/users/${id}`,
  SEARCH_ROLE: (query: string) => `${API_URL}/users/search?query=${query}`,
} as const;

export default ROLE_API_ENPOINTS;

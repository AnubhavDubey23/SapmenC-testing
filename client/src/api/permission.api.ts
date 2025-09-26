import { API_URL } from '.';

const PERMISSION_API_ENPOINTS = {
  GET_ALL_PERMISSIONS: `${API_URL}/users`,
  GET_PERMISSION_BY_ID: (id: string) => `${API_URL}/users/${id}`,
  CREATE_PERMISSION: `${API_URL}/users`,
  UPDATE_PERMISSION: (id: string) => `${API_URL}/users/${id}`,
  DELETE_PERMISSION: (id: string) => `${API_URL}/users/${id}`,
  SEARCH_PERMISSION: (query: string) =>
    `${API_URL}/users/search?query=${query}`,
} as const;

export default PERMISSION_API_ENPOINTS;

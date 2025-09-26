import { API_URL } from '.';

const USER_API_ENPOINTS = {
  GET_ALL_USERS: `${API_URL}/users`,
  GET_USER_BY_ID: (id: string) => `${API_URL}/users/${id}`,
  CREATE_USER: `${API_URL}/users`,
  UPDATE_USER: (id: string) => `${API_URL}/users/${id}`,
  DELETE_USER: (id: string) => `${API_URL}/users/${id}`,
  SEARCH_USERS: (query: string) => `${API_URL}/users/search?query=${query}`,
  ME: `${API_URL}/users/me`,
  PLAN_DETAILS: `${API_URL}/users/plan/details`,
} as const;

export default USER_API_ENPOINTS;

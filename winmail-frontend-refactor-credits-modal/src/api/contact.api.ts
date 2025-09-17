import { API_URL } from '.';

const CONTACT_API_ENPOINTS = {
  GET_ALL_CONTACTS: (segmentId: string) => `${API_URL}/contacts/:${segmentId}`,
  GET_CONTACT_BY_ID: (id: string) => `${API_URL}/contacts/${id}`,
  CREATE_CONTACT: `${API_URL}/contacts`,
  UPDATE_CONTACT: (id: string) => `${API_URL}/contacts/${id}`,
  DELETE_CONTACT: (id: string) => `${API_URL}/contacts/${id}`,
  SEARCH_CONTACT: (query: string) =>
    `${API_URL}/contacts/search?query=${query}`,
} as const;

export default CONTACT_API_ENPOINTS;

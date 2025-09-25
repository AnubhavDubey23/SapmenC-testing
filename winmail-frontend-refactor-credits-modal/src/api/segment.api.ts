import { API_URL } from '.';

const segment_API_ENPOINTS = {
  GET_ALL_segments: `${API_URL}/segments`,
  GET_segment_BY_ID: (id: string) => `${API_URL}/segments/${id}`,
  CREATE_segment: `${API_URL}/segments`,
  UPDATE_segment: (id: string) => `${API_URL}/segments/${id}`,
  DELETE_segment: (id: string) => `${API_URL}/segments/${id}`,
  SEARCH_segment: (query: string) => `${API_URL}/segments/search?query=${query}`,
} as const;

export default segment_API_ENPOINTS;

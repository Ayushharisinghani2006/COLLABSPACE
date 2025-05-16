const API_BASE_URL = '/v1';

const apiEndpoints = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,

  // Meetings
  GET_MEETINGS: `${API_BASE_URL}/meetings`,
  GET_MEETING_BY_ID: (id) => `${API_BASE_URL}/meetings/${id}`,
  CREATE_MEETING: `${API_BASE_URL}/meetings`,
  UPDATE_MEETING: (id) => `${API_BASE_URL}/meetings/${id}`,
  DELETE_MEETING: (id) => `${API_BASE_URL}/meetings/${id}`,

  // Whiteboards
  GET_WHITEBOARDS: `${API_BASE_URL}/whiteboards`,
  GET_WHITEBOARD_BY_ID: (id) => `${API_BASE_URL}/whiteboards/${id}`,
  CREATE_WHITEBOARD: `${API_BASE_URL}/whiteboards`,
  UPDATE_WHITEBOARD: (id) => `${API_BASE_URL}/whiteboards/${id}`,
  DELETE_WHITEBOARD: (id) => `${API_BASE_URL}/whiteboards/${id}`,

  // Analytics
  GET_ANALYTICS: `${API_BASE_URL}/analytics`,

  // Tasks
  GET_TASKS: `${API_BASE_URL}/tasks`,
  CREATE_TASK: `${API_BASE_URL}/tasks`,
  UPDATE_TASK: (id) => `${API_BASE_URL}/tasks/${id}`,
  DELETE_TASK: (id) => `${API_BASE_URL}/tasks/${id}`,

  // Documents
  GET_DOCUMENTS: `${API_BASE_URL}/documents`,
  CREATE_DOCUMENT: `${API_BASE_URL}/documents`,
  UPDATE_DOCUMENT: (id) => `${API_BASE_URL}/documents/${id}`,
  DELETE_DOCUMENT: (id) => `${API_BASE_URL}/documents/${id}`,
};

export default apiEndpoints;
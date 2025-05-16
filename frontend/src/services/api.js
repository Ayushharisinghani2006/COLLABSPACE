import apiEndpoints from '../constants/apiEndpoints';

const api = {
  // Authentication
  login: async (email, password) => {
    const response = await fetch(apiEndpoints.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  signup: async (name, email, password) => {
    const response = await fetch(apiEndpoints.SIGNUP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(apiEndpoints.LOGOUT, {
      method: 'POST',
    });
    return response.json();
  },

  // Meetings
  getMeetings: async () => {
    const response = await fetch(apiEndpoints.GET_MEETINGS);
    return response.json();
  },

  getMeetingById: async (id) => {
    const response = await fetch(apiEndpoints.GET_MEETING_BY_ID(id));
    return response.json();
  },

  // Whiteboards
  getWhiteboards: async () => {
    const response = await fetch(apiEndpoints.GET_WHITEBOARDS);
    return response.json();
  },

  getWhiteboardById: async (id) => {
    const response = await fetch(apiEndpoints.GET_WHITEBOARD_BY_ID(id));
    return response.json();
  },

  // Analytics
  getAnalytics: async () => {
    const response = await fetch(apiEndpoints.GET_ANALYTICS);
    return response.json();
  },
};

export default api;
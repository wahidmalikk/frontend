import axios from 'axios';

// Create an instance of axios with a base configuration
const api = axios.create({
  // IMPORTANT: Set the baseURL to the address where your Node.js/Express server is running.
  // This is the default port for local development servers.
  baseURL: 'http://localhost:5001', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
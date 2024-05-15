import axios from 'axios'
/* eslint-env node */
let baseurl = 'https://project-management-server-fvka.onrender.com/';

export const apiInstance = axios.create({
  baseURL: baseurl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});
import axios from 'axios'
/* eslint-env node */
let baseurl = process.env.mode == 'prod' ? '' : 'http://localhost:3000/';

//baseurl = 'https://api.mosecop.com/api/v1/';
export const apiInstance = axios.create({
  baseURL: baseurl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});
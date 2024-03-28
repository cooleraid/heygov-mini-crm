const axios = require('axios');
const _ = require('lodash');

const axiosInstance = axios.create({});
axiosInstance.interceptors.request.use(request => {
  console.log('request', request?.method?.toUpperCase(), request.url, JSON.stringify(_.omit(request.data, ['api_key', 'Token', 'file_base64'])));
  return request;
});

axiosInstance.interceptors.response.use(response => {
  console.log('response', response.status, JSON.stringify(response?.data));
  return response;
});

module.exports = axiosInstance;

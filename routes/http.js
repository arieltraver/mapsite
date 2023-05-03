const axios = require('axios');
// When building the client into a static file, we do not need to include the server path as it is returned by it

//function which uses axios to query REST API's.
const http = (
  url,
  {
    method = 'GET',
    headers = undefined,
    data = undefined,
  },
) => {
  return axios({
    url: url,
    method,
    headers,
    data,
  });
};

// Main functions to handle different types of endpoints
const get = (url, opts = {}) => http(url, { ...opts });
const post = (url, opts = {}) => http(url, { method: 'POST', ...opts });
const put = (url, opts = {}) => http(url, { method: 'PUT', ...opts });
const deleteData = (url, opts = {}) => http(url, { method: 'DELETE', ...opts });

const methods = {
  get,
  post,
  put,
  delete: deleteData,
};

module.exports = methods;
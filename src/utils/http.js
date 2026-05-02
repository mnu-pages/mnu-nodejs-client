'use strict';

import https from 'https';

/**
 * Simple HTTP GET wrapper using built-in https module
 * @param {string} url 
 * @returns {Promise<string>}
 */
export function get(url) {
  const options = {
    headers: {
      'User-Agent': 'mnu-nodejs-client'
    }
  };

  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      if (res.statusCode === 404) {
        return reject(new Error('Page not found (404)'));
      }
      
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch: ${res.statusCode} ${res.statusMessage}`));
      }

      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(new Error(`Network error: ${err.message}`));
    });
  });
}

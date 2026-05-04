'use strict';

import https from 'https';
import { getAnonymousId } from './identity.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, '../../package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const VERSION = pkg.version;

/**
 * Simple HTTP GET wrapper using built-in https module
 * @param {string} url 
 * @returns {Promise<string>}
 */
export function get(url) {
  const anonId = getAnonymousId();
  const options = {
    headers: {
      'User-Agent': `mnu-nodejs-client/${VERSION} (ID/${anonId})`
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

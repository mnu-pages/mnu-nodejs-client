'use strict';

import os from 'os';

/**
 * 32-bit FNV-1a hash implementation
 * @param {string} str 
 * @returns {number}
 */
function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Generates an 8-character hex anonymous identifier based on system info.
 * Matches the C client's stateless implementation.
 * @returns {string}
 */
export function getAnonymousId() {
  const sysname = os.type();
  const nodename = os.hostname();
  const machine = os.machine ? os.machine() : os.arch();
  const uid = process.getuid ? process.getuid() : 0;

  const combined = `${sysname}${nodename}${machine}${uid}`;
  const hash = fnv1a(combined);
  
  return hash.toString(16).padStart(8, '0');
}

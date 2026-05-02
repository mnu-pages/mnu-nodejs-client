'use strict';

/**
 * Normalizes input commands.
 * @param {string} input 
 * @returns {string}
 */
export function normalizeCommand(input) {
  if (input === 'q') return ':q';
  return input;
}

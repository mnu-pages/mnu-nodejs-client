'use strict';

import { padLeft } from '../utils/string.js';

/**
 * Renders a .DIV element
 * @param {string} text 
 * @param {number} width 
 * @returns {string[]}
 */
export function renderDiv(text, width) {
  const idealPadding = Math.floor(width * 0.08);
  const leftPadding = width < 40 ? Math.min(idealPadding, 2) : idealPadding;
  const padded = padLeft(text, leftPadding);
  return [`\x1b[1m${padded}\x1b[0m`]; // Deep bold
}

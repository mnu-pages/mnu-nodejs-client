'use strict';

/**
 * Renders a .TITLE element
 * @param {string} text 
 * @param {number} width 
 * @returns {string[]}
 */
export function renderTitle(text, width) {
  // Calculate padding manually to only underline the text itself
  const paddingSize = Math.max(0, Math.floor((width - text.length) / 2));
  const padding = ' '.repeat(paddingSize);
  
  // Use separate codes for bold (1) and underline (4) for better compatibility
  // Only the text part gets the escape sequences
  const result = [`${padding}\x1b[1m\x1b[4m${text}\x1b[0m`, '']; 
  return result;
}

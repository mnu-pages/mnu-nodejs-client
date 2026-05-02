'use strict';

import { wrapText, padLeft, applyFormatting } from '../utils/string.js';

/**
 * Renders a normal text element
 * @param {string} text 
 * @param {number} width 
 * @returns {string[]}
 */
export function renderText(text, width) {
  const leftPadding = Math.floor(width * 0.10);
  const rightPadding = Math.floor(width * 0.10);
  const contentWidth = width - leftPadding - rightPadding;

  // Apply formatting BEFORE wrapping so that formatted spans
  // can be correctly handled across multiple lines by wrapText
  const formatted = applyFormatting(text);
  const wrapped = wrapText(formatted, contentWidth);
  
  return wrapped.map(line => padLeft(line, leftPadding));
}

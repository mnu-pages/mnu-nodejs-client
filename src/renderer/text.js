'use strict';

import { wrapText, padLeft, applyFormatting } from '../utils/string.js';

/**
 * Renders a normal text element.
 * Ensures a minimum content width and robust padding.
 * @param {string} text 
 * @param {number} width 
 * @returns {string[]}
 */
export function renderText(text, width) {
  // Use responsive padding that guarantees at least 20 chars of content
  // if width permits, or fills available space on tiny screens.
  const idealPadding = Math.floor(width * 0.10);
  const leftPadding = width < 40 ? Math.min(idealPadding, 2) : idealPadding;
  const rightPadding = leftPadding;
  
  const contentWidth = Math.max(width - leftPadding - rightPadding, Math.min(width, 20));

  const formatted = applyFormatting(text);
  const wrapped = wrapText(formatted, contentWidth);
  
  return wrapped.map(line => padLeft(line, leftPadding));
}

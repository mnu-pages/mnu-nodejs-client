'use strict';

import { renderTitle } from './title.js';
import { renderDiv } from './div.js';
import { renderText } from './text.js';

/**
 * Layouts the entire document into an array of lines.
 * @param {Array<{type: string, content: string}>} elements 
 * @param {number} width 
 * @returns {string[]}
 */
export function layout(elements, termWidth) {
  // Respect the 80-character maximum content width, centered
  const contentWidth = termWidth > 80 ? 80 : termWidth;
  const basePaddingSize = Math.floor((termWidth - contentWidth) / 2);
  const basePadding = ' '.repeat(basePaddingSize);

  const lines = [];

  for (const element of elements) {
    let elementLines = [];
    switch (element.type) {
      case 'TITLE':
        elementLines = renderTitle(element.content, contentWidth);
        break;
      case 'DIV':
        if (lines.length > 0) lines.push(basePadding); // Add blank line with padding
        elementLines = renderDiv(element.content, contentWidth);
        break;
      case 'TEXT':
        elementLines = renderText(element.content, contentWidth);
        break;
      case 'SPACE':
        elementLines = [''];
        break;
    }
    
    // Apply base padding to each line of the element
    for (let i = 0; i < elementLines.length; i++) {
      lines.push(basePadding + elementLines[i]);
    }
  }

  return lines;
}

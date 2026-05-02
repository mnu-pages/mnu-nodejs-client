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
export function layout(elements, width) {
  let lines = [];

  for (const element of elements) {
    switch (element.type) {
      case 'TITLE':
        lines = lines.concat(renderTitle(element.content, width));
        break;
      case 'DIV':
        // Add a blank line before DIV if not the first element
        if (lines.length > 0) lines.push('');
        lines = lines.concat(renderDiv(element.content, width));
        break;
      case 'TEXT':
        lines = lines.concat(renderText(element.content, width));
        break;
      case 'SPACE':
        lines.push('');
        break;
    }
  }

  return lines;
}

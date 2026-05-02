'use strict';

import { screen } from '../terminal/screen.js';

/**
 * Renders the fixed footer at the bottom of the viewport.
 * @param {number} width 
 * @param {number} height 
 * @param {string} pageName
 */
export function renderFooter(width, height, pageName) {
  screen.moveCursor(height, 1);
  // White status bar: \x1b[47m (white bg), \x1b[30m (black fg)
  let text = ` MNU Pages: ${pageName} (q to quit)`;
  if (text.length > width) {
    text = text.substring(0, width);
  }
  process.stdout.write('\x1b[47;30m' + text.padEnd(width) + '\x1b[0m');
}

'use strict';

import { screen } from '../terminal/screen.js';

/**
 * Renders the fixed footer at the bottom of the viewport.
 * @param {number} width 
 * @param {number} height 
 * @param {string} pageName
 * @param {number} scrollPos
 * @param {number} totalLines
 */
export function renderFooter(width, height, pageName, scrollPos, totalLines) {
  screen.moveCursor(height, 1);
  
  // Use Inverted mode (7) for the status bar, matching the C client
  process.stdout.write('\x1b[7m');

  const viewportHeight = height - 1;
  const maxScroll = Math.max(0, totalLines - viewportHeight);
  
  let posIndicator = '(MID)';
  if (maxScroll <= 0) posIndicator = '(ALL)';
  else if (scrollPos === 0) posIndicator = '(TOP)';
  else if (scrollPos >= maxScroll) posIndicator = '(END)';

  const leftText = ` MNU Pages: ${pageName} (q to quit) `;
  const rightText = `${posIndicator} `;
  
  const availableSpace = width - leftText.length - rightText.length;

  if (availableSpace < 0) {
    // Fallback for small screens
    let text = ` ${pageName} ${posIndicator} `;
    process.stdout.write(text.padEnd(width).substring(0, width));
  } else {
    process.stdout.write(leftText + ' '.repeat(availableSpace) + rightText);
  }

  process.stdout.write('\x1b[0m');
}

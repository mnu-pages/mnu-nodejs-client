'use strict';

const ANSI_REGEX = /\x1b\[[0-9;]*m/g;

/**
 * Strips ANSI escape codes from a string to get its visible length.
 * @param {string} text 
 * @returns {string}
 */
export function stripAnsi(text) {
  return text.replace(ANSI_REGEX, '');
}

/**
 * Wraps text to a specific width, accounting for ANSI escape codes and long words.
 * @param {string} text 
 * @param {number} width 
 * @returns {string[]}
 */
export function wrapText(text, width) {
  if (width <= 0) return [text];

  const lines = [];
  let currentLineText = '';
  let currentVisibleLength = 0;
  let activeStyle = '';

  // Simple tokenization: split by spaces but preserve them as tokens,
  // and handle ANSI codes as zero-width tokens.
  const parts = text.split(/(\x1b\[[0-9;]*m|\s+)/g).filter(p => p !== undefined && p !== '');

  for (const part of parts) {
    if (part.match(ANSI_REGEX)) {
      activeStyle = (part === '\x1b[0m') ? '' : part;
      currentLineText += part;
      continue;
    }

    if (part.match(/^\s+$/)) {
      // It's whitespace
      if (currentVisibleLength + part.length > width) {
        // Space doesn't fit, just start new line without the space
        lines.push(currentLineText + '\x1b[0m');
        currentLineText = activeStyle;
        currentVisibleLength = 0;
      } else {
        currentLineText += part;
        currentVisibleLength += part.length;
      }
      continue;
    }

    // It's a word
    if (currentVisibleLength + part.length > width) {
      if (part.length > width) {
        // Word itself is longer than width, must force split it
        let remainingWord = part;
        while (remainingWord.length > 0) {
          const spaceLeft = width - currentVisibleLength;
          if (spaceLeft <= 0) {
            lines.push(currentLineText + '\x1b[0m');
            currentLineText = activeStyle;
            currentVisibleLength = 0;
            continue;
          }
          const chunk = remainingWord.substring(0, spaceLeft);
          currentLineText += chunk;
          currentVisibleLength += chunk.length;
          remainingWord = remainingWord.substring(spaceLeft);
          
          if (currentVisibleLength >= width) {
            lines.push(currentLineText + '\x1b[0m');
            currentLineText = activeStyle;
            currentVisibleLength = 0;
          }
        }
      } else {
        // Word doesn't fit on this line, start a new one
        if (currentVisibleLength > 0) {
          lines.push(currentLineText + '\x1b[0m');
        }
        currentLineText = activeStyle + part;
        currentVisibleLength = part.length;
      }
    } else {
      currentLineText += part;
      currentVisibleLength += part.length;
    }
  }

  if (stripAnsi(currentLineText).trim() !== '') {
    lines.push(currentLineText + '\x1b[0m');
  }

  return lines;
}

/**
 * Pads a string on the left.
 * @param {string} text 
 * @param {number} padding 
 * @returns {string}
 */
export function padLeft(text, padding) {
  return padding <= 0 ? text : ' '.repeat(padding) + text;
}

/**
 * Centers a string within a width.
 * @param {string} text 
 * @param {number} width 
 * @returns {string}
 */
export function center(text, width) {
  const visible = stripAnsi(text);
  const paddingSize = Math.max(0, Math.floor((width - visible.length) / 2));
  return ' '.repeat(paddingSize) + text;
}

/**
 * Applies inline formatting: **bold**, __underline__
 * @param {string} text 
 * @returns {string}
 */
export function applyFormatting(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '\x1b[1m$1\x1b[0m')
    .replace(/__(.*?)__/g, '\x1b[4m$1\x1b[0m');
}

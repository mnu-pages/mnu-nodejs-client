'use strict';

/**
 * Strips ANSI escape codes from a string to get its visible length.
 * @param {string} text 
 * @returns {string}
 */
export function stripAnsi(text) {
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * Wraps text to a specific width, accounting for ANSI escape codes and long words.
 * Each line is guaranteed to be independent (starts with current style, ends with reset).
 * @param {string} text 
 * @param {number} width 
 * @returns {string[]}
 */
export function wrapText(text, width) {
  if (width <= 0) return [text];

  // Regex to match either an ANSI sequence or a single character
  const tokenRegex = /(\x1b\[[0-9;]*m)|(.)/gs;
  const tokens = [];
  let match;
  while ((match = tokenRegex.exec(text)) !== null) {
    tokens.push({
      value: match[0],
      isAnsi: !!match[1],
      isSpace: match[2] === ' '
    });
  }

  const lines = [];
  let currentLine = '';
  let currentVisibleLength = 0;
  let activeStyle = '';
  let lastSpaceIndex = -1;
  let lastSpaceVisibleLength = 0;
  let lastSpaceActiveStyle = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.isAnsi) {
      if (token.value === '\x1b[0m') {
        activeStyle = '';
      } else {
        activeStyle = token.value;
      }
      currentLine += token.value;
      continue;
    }

    // It's a visible character
    if (currentVisibleLength >= width) {
      // Need to wrap
      if (lastSpaceIndex !== -1 && !token.isSpace) {
        // Wrap at the last space
        const spaceLine = currentLine.substring(0, lastSpaceIndex);
        lines.push(spaceLine + '\x1b[0m');
        
        // Restart from after the space
        currentLine = lastSpaceActiveStyle;
        currentVisibleLength = 0;
        i = lastSpaceIndex; // Loop will increment i, so it will start at lastSpaceIndex + 1
        lastSpaceIndex = -1;
        activeStyle = lastSpaceActiveStyle;
      } else {
        // No space to wrap at, or we are at a space. Hard wrap.
        lines.push(currentLine + '\x1b[0m');
        currentLine = activeStyle + token.value;
        currentVisibleLength = 1;
      }
    } else {
      if (token.isSpace) {
        lastSpaceIndex = i;
        lastSpaceVisibleLength = currentVisibleLength;
        lastSpaceActiveStyle = activeStyle;
      }
      currentLine += token.value;
      currentVisibleLength++;
    }
  }

  if (currentLine) {
    lines.push(currentLine + '\x1b[0m');
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
  return ' '.repeat(padding) + text;
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

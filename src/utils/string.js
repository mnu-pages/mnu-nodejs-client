'use strict';

const ANSI_REGEX = /\x1b\[[0-9;]*m/g;
const TOKEN_REGEX = /(\x1b\[[0-9;]*m)|(.)/gs;

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
 * Each line is guaranteed to be independent (starts with current style, ends with reset).
 * @param {string} text 
 * @param {number} width 
 * @returns {string[]}
 */
export function wrapText(text, width) {
  if (width <= 0) return [text];

  const tokens = [];
  let match;
  // Reset regex index for global match
  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(text)) !== null) {
    tokens.push({
      value: match[0],
      isAnsi: !!match[1],
      isSpace: match[2] === ' '
    });
  }

  const lines = [];
  let currentLineText = '';
  let currentVisibleLength = 0;
  let activeStyle = '';
  
  let startTokenIndex = 0;
  let lastSpaceTokenIndex = -1;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.isAnsi) {
      activeStyle = (token.value === '\x1b[0m') ? '' : token.value;
      currentLineText += token.value;
      continue;
    }

    if (currentVisibleLength >= width) {
      if (lastSpaceTokenIndex !== -1 && !token.isSpace) {
        let line = '';
        let lineStyle = '';
        for (let j = startTokenIndex; j <= lastSpaceTokenIndex; j++) {
          const t = tokens[j];
          line += t.value;
          if (t.isAnsi) {
            lineStyle = (t.value === '\x1b[0m') ? '' : t.value;
          }
        }
        lines.push(line + '\x1b[0m');
        
        i = lastSpaceTokenIndex;
        startTokenIndex = i + 1;
        currentLineText = lineStyle;
        currentVisibleLength = 0;
        activeStyle = lineStyle;
        lastSpaceTokenIndex = -1;
      } else {
        lines.push(currentLineText + '\x1b[0m');
        currentLineText = activeStyle + token.value;
        currentVisibleLength = 1;
        startTokenIndex = i;
        lastSpaceTokenIndex = -1;
      }
    } else {
      if (token.isSpace) {
        lastSpaceTokenIndex = i;
      }
      currentLineText += token.value;
      currentVisibleLength++;
    }
  }

  if (currentLineText && stripAnsi(currentLineText).trim() !== '') {
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

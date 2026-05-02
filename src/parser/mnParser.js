'use strict';

/**
 * Parses the .mn format into a structured document array.
 * Types: TITLE, DIV, TEXT, SPACE
 * @param {string} rawContent 
 * @returns {Array<{type: string, content: string}>}
 */
export function parse(rawContent) {
  const lines = rawContent.split(/\r?\n/);
  const document = [];
  let currentTextBlock = [];

  const flushTextBlock = () => {
    if (currentTextBlock.length > 0) {
      document.push({ type: 'TEXT', content: currentTextBlock.join(' ') });
      currentTextBlock = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmedLine = rawLine.trim();

    if (trimmedLine.startsWith('.TITLE "')) {
      flushTextBlock();
      const match = trimmedLine.match(/^\.TITLE\s+"([^"]+)"/);
      if (match) {
        document.push({ type: 'TITLE', content: match[1] });
      }
    } else if (trimmedLine.startsWith('.DIV "')) {
      flushTextBlock();
      const match = trimmedLine.match(/^\.DIV\s+"([^"]+)"/);
      if (match) {
        document.push({ type: 'DIV', content: match[1] });
      }
    } else if (trimmedLine === '') {
      flushTextBlock();
      // Only add a SPACE if the previous element wasn't already a SPACE or a DIV (which adds its own space)
      if (document.length > 0 && document[document.length - 1].type !== 'SPACE') {
        document.push({ type: 'SPACE', content: '' });
      }
    } else {
      // It's normal body text. Add to current block to allow reflowing.
      currentTextBlock.push(trimmedLine);
    }
  }

  flushTextBlock();
  return document;
}

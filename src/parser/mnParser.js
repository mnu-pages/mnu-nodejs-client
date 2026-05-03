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

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmedLine = rawLine.trim();

    if (trimmedLine.startsWith('.TITLE "')) {
      const match = trimmedLine.match(/^\.TITLE\s+"([^"]+)"/);
      if (match) {
        document.push({ type: 'TITLE', content: match[1] });
      }
    } else if (trimmedLine.startsWith('.DIV "')) {
      const match = trimmedLine.match(/^\.DIV\s+"([^"]+)"/);
      if (match) {
        document.push({ type: 'DIV', content: match[1] });
      }
    } else if (trimmedLine === '') {
      // Add a SPACE if the previous element wasn't already a SPACE
      if (document.length > 0 && document[document.length - 1].type !== 'SPACE') {
        document.push({ type: 'SPACE', content: '' });
      }
    } else {
      // Treat each line as its own text block.
      // This preserves lists and manual formatting while still allowing
      // the renderer to wrap lines that are too long.
      document.push({ type: 'TEXT', content: trimmedLine });
    }
  }

  return document;
}

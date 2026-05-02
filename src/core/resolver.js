'use strict';

import { repoBaseUrl } from '../../config/repo.js';

/**
 * Resolves a category:page string to a full GitHub raw URL.
 * Example: 'cli:git' -> 'https://raw.githubusercontent.com/.../cli/git.mn'
 * @param {string} input 
 * @returns {string}
 */
export function resolveUrl(input) {
  if (!input || !input.includes(':')) {
    throw new Error('Invalid input format. Use category:page (e.g., cli:git)');
  }

  const [category, page] = input.split(':');
  
  if (!category || !page) {
    throw new Error('Invalid input format. Use category:page (e.g., cli:git)');
  }

  return `${repoBaseUrl}/${category}/${page}.mn`;
}

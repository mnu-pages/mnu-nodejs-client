'use strict';

/**
 * Handles keypress mapping to pager actions.
 * @param {PagerEngine} engine 
 * @param {object} key 
 * @param {Function} quit 
 * @param {Function} showHelp
 */
export function handleInput(engine, key, quit, showHelp) {
  if (!key) return;

  switch (key.name) {
    case 'q':
      quit();
      break;
    case 'h':
      showHelp();
      break;
    case 'g':
      engine.scrollToTop();
      break;
    case 'j':
    case 'down':
      engine.scrollDown();
      break;
    case 'k':
    case 'up':
      engine.scrollUp();
      break;
    case 'd':
      engine.scrollHalfPageDown();
      break;
    case 'u':
      engine.scrollHalfPageUp();
      break;
  }

  // Handle 'G' (Shift+g)
  if (key.sequence === 'G') {
    engine.scrollToBottom();
  }
}

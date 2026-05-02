'use strict';

import readline from 'readline';

/**
 * Initializes raw key capture.
 * @param {Function} onKey Callback for key events
 */
export function initKeys(onKey) {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  
  readline.emitKeypressEvents(process.stdin);
  
  process.stdin.on('keypress', (str, key) => {
    // Ctrl+C to force exit
    if (key && key.ctrl && key.name === 'c') {
      process.emit('SIGINT');
      return;
    }
    onKey(str, key);
  });
}

/**
 * Cleanup key capture.
 */
export function cleanupKeys() {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
  }
  process.stdin.removeAllListeners('keypress');
  process.stdin.pause();
}

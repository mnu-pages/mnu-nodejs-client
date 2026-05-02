'use strict';

/**
 * Handles terminal screen operations (alternate buffer, cursor visibility).
 */
export const screen = {
  /**
   * Enters the alternate screen buffer and hides the cursor.
   */
  enter() {
    process.stdout.write('\x1b[?1049h'); // Enter alternate buffer
    process.stdout.write('\x1b[?25l');   // Hide cursor
  },

  /**
   * Restores the normal screen buffer and shows the cursor.
   */
  restore() {
    process.stdout.write('\x1b[?25h');   // Show cursor
    process.stdout.write('\x1b[?1049l'); // Leave alternate buffer
  },

  /**
   * Clears the screen.
   */
  clear() {
    process.stdout.write('\x1b[2J\x1b[H');
  },

  /**
   * Moves cursor to position.
   * @param {number} row 1-based
   * @param {number} col 1-based
   */
  moveCursor(row, col) {
    process.stdout.write(`\x1b[${row};${col}H`);
  },

  /**
   * Gets terminal size.
   * @returns {{width: number, height: number}}
   */
  getSize() {
    return {
      width: process.stdout.columns || 80,
      height: process.stdout.rows || 24
    };
  }
};

'use strict';

import { resolveUrl } from './resolver.js';
import { get } from '../utils/http.js';
import { parse } from '../parser/mnParser.js';
import { layout } from '../renderer/layout.js';
import { screen } from '../terminal/screen.js';
import { PagerEngine } from '../pager/engine.js';
import { initKeys, cleanupKeys } from '../terminal/keys.js';
import { handleInput } from '../pager/input.js';

/**
 * Main application class
 */
export class MnuClient {
  constructor() {
    this.engine = null;
  }

  /**
   * Starts the client with the given category:page input.
   * @param {string} input 
   */
  async start(input) {
    try {
      const url = resolveUrl(input);
      const rawContent = await get(url);
      const elements = parse(rawContent);
      
      const { width } = screen.getSize();
      const lines = layout(elements, width);

      const pageName = input.includes(':') ? input.split(':')[1] : input;
      this.engine = new PagerEngine(lines, pageName);
      
      screen.enter();
      this.engine.draw();

      initKeys((str, key) => {
        handleInput(this.engine, key, () => this.quit());
      });

      // Cleanup on signals and exceptions to ensure terminal is restored
      process.on('SIGINT', () => this.quit());
      process.on('uncaughtException', (err) => this.exitWithError(err.message));

      // Handle terminal resize
      process.stdout.on('resize', () => {
        this.engine.updateSize();
        // Re-layout might be needed if width changed
        const { width: newWidth } = screen.getSize();
        const reLayoutLines = layout(elements, newWidth);
        this.engine.lines = reLayoutLines;
        this.engine.draw();
      });

    } catch (err) {
      this.exitWithError(err.message);
    }
  }

  /**
   * Quits the application cleanly.
   */
  quit() {
    cleanupKeys();
    screen.restore();
    process.exit(0);
  }

  /**
   * Exits with an error message.
   * @param {string} message 
   */
  exitWithError(message) {
    // Ensure terminal is restored if we were in alternate buffer
    cleanupKeys();
    screen.restore();
    console.error(`\x1b[31mError:\x1b[0m ${message}`);
    process.exit(1);
  }
}

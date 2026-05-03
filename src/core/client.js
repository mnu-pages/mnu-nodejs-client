'use strict';

import { resolveUrl } from './resolver.js';
import { get } from '../utils/http.js';
import { parse } from '../parser/mnParser.js';
import { layout } from '../renderer/layout.js';
import { screen } from '../terminal/screen.js';
import { PagerEngine } from '../pager/engine.js';
import { initKeys, cleanupKeys } from '../terminal/keys.js';
import { handleInput } from '../pager/input.js';
import { helpContent } from './helpContent.js';

/**
 * Main application class
 */
export class MnuClient {
  constructor() {
    this.engine = null;
    this.isQuitting = false;
    this.currentElements = null;
  }

  /**
   * Starts the client with the given category:page input.
   * @param {string} input 
   */
  async start(input) {
    if (input === 'help') {
      return this.showHelpPage();
    }

    try {
      const url = resolveUrl(input);
      const rawContent = await get(url);
      this.renderRawContent(rawContent, input);
    } catch (err) {
      this.exitWithError(err.message);
    }
  }

  /**
   * Displays the built-in help page.
   */
  showHelpPage() {
    this.renderRawContent(helpContent, 'help');
  }

  /**
   * Renders raw .mn content and initializes the pager.
   * @param {string} rawContent 
   * @param {string} pageName 
   */
  renderRawContent(rawContent, pageName) {
    this.currentElements = parse(rawContent);
    const { width } = screen.getSize();
    const lines = layout(this.currentElements, width);

    const displayName = pageName.includes(':') ? pageName.split(':')[1] : pageName;

    if (this.engine) {
      this.engine.lines = lines;
      this.engine.pageName = displayName;
      this.engine.scrollPos = 0;
      this.engine.draw();
    } else {
      this.engine = new PagerEngine(lines, displayName);
      screen.enter();
      this.engine.draw();

      initKeys((str, key) => {
        handleInput(this.engine, key, () => this.quit(), () => this.showHelpPage());
      });

      const signalHandler = () => this.quit();
      process.on('SIGINT', signalHandler);
      process.on('SIGTERM', signalHandler);

      process.on('uncaughtException', (err) => {
        this.exitWithError(err.message);
      });

      process.stdout.on('resize', () => {
        if (this.isQuitting) return;
        this.engine.updateSize();
        const { width: newWidth } = screen.getSize();
        const reLayoutLines = layout(this.currentElements, newWidth);
        this.engine.lines = reLayoutLines;
        this.engine.draw();
      });
    }
  }

  /**
   * Quits the application cleanly.
   */
  quit() {
    if (this.isQuitting) return;
    this.isQuitting = true;
    
    cleanupKeys();
    screen.restore();
    process.exit(0);
  }

  /**
   * Exits with an error message.
   * @param {string} message 
   */
  exitWithError(message) {
    if (this.isQuitting) return;
    this.isQuitting = true;

    cleanupKeys();
    screen.restore();
    console.error(`\x1b[31mError:\x1b[0m ${message}`);
    process.exit(1);
  }
}

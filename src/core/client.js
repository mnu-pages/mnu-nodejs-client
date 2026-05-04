'use strict';

import { get } from '../utils/http.js';
import { parse } from '../parser/mnParser.js';
import { layout } from '../renderer/layout.js';
import { screen } from '../terminal/screen.js';
import { PagerEngine } from '../pager/engine.js';
import { initKeys, cleanupKeys } from '../terminal/keys.js';
import { handleInput } from '../pager/input.js';
import { helpContent } from './helpContent.js';
import { readFileSync } from 'fs';
import { resolveUrl } from './resolver.js';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, '../../package.json');

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
   * Starts the client with the given arguments.
   * @param {string[]} args 
   */
  async start(args) {
    const command = args[0];

    if (command === 'help') {
      return this.showHelpPage();
    }

    if (command === 'version' || command === '--version' || command === '-v') {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      console.log(`mnu v${pkg.version}`);
      process.exit(0);
    }

    try {
      let rawContent;
      let pageName;

      if (command === 'run') {
        const filePath = args[1];
        if (!filePath) {
          throw new Error('Usage: mnu run path/to/file.mn');
        }
        rawContent = readFileSync(filePath, 'utf8');
        pageName = filePath;
      } else {
        const url = resolveUrl(command);
        rawContent = await get(url);
        pageName = command;
      }

      this.renderRawContent(rawContent, pageName);
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
    try {
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
        process.once('SIGINT', signalHandler);
        process.once('SIGTERM', signalHandler);

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
    } catch (err) {
      this.exitWithError(`Rendering error: ${err.message}`);
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
    // Ensure we are at the bottom of the screen before printing error
    const { height } = screen.getSize();
    screen.moveCursor(height, 1);
    console.error(`\x1b[31mError:\x1b[0m ${message}`);
    process.exit(1);
  }
}

'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from '../src/parser/mnParser.js';
import { layout } from '../src/renderer/layout.js';
import { screen } from '../src/terminal/screen.js';
import { PagerEngine } from '../src/pager/engine.js';
import { initKeys, cleanupKeys } from '../src/terminal/keys.js';
import { handleInput } from '../src/pager/input.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runLocalTest() {
  const filePath = path.join(__dirname, 'git.mn');
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: Example file not found at ${filePath}`);
    process.exit(1);
  }

  try {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const elements = parse(rawContent);
    
    const { width } = screen.getSize();
    const lines = layout(elements, width);

    const engine = new PagerEngine(lines, 'git');
    
    screen.enter();
    engine.draw();

    const quit = () => {
      cleanupKeys();
      screen.restore();
      process.exit(0);
    };

    initKeys((str, key) => {
      handleInput(engine, key, quit);
    });

    process.on('SIGINT', quit);
    process.on('uncaughtException', (err) => {
      cleanupKeys();
      screen.restore();
      console.error(`\x1b[31mError:\x1b[0m ${err.message}`);
      process.exit(1);
    });

    process.stdout.on('resize', () => {
      engine.updateSize();
      const { width: newWidth } = screen.getSize();
      const reLayoutLines = layout(elements, newWidth);
      engine.lines = reLayoutLines;
      engine.draw();
    });

  } catch (err) {
    cleanupKeys();
    screen.restore();
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

runLocalTest();

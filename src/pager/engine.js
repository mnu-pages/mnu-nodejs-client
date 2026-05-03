'use strict';

import { screen } from '../terminal/screen.js';
import { renderFooter } from '../ui/footer.js';

export class PagerEngine {
  constructor(lines, pageName = 'unknown') {
    this.lines = lines;
    this.pageName = pageName;
    this.scrollPos = 0;
    this.size = screen.getSize();
  }

  updateSize() {
    this.size = screen.getSize();
    this.clampScroll();
  }

  clampScroll() {
    const maxScroll = Math.max(0, this.lines.length - (this.size.height - 1));
    if (this.scrollPos > maxScroll) this.scrollPos = maxScroll;
    if (this.scrollPos < 0) this.scrollPos = 0;
  }

  scrollDown(n = 1) {
    const oldPos = this.scrollPos;
    this.scrollPos += n;
    this.clampScroll();
    if (oldPos !== this.scrollPos) this.draw();
  }

  scrollUp(n = 1) {
    const oldPos = this.scrollPos;
    this.scrollPos -= n;
    this.clampScroll();
    if (oldPos !== this.scrollPos) this.draw();
  }

  scrollToTop() {
    if (this.scrollPos === 0) return;
    this.scrollPos = 0;
    this.draw();
  }

  scrollToBottom() {
    const newPos = Math.max(0, this.lines.length - (this.size.height - 1));
    if (this.scrollPos === newPos) return;
    this.scrollPos = newPos;
    this.draw();
  }

  /**
   * Renders the viewport by explicitly positioning each line.
   * This is the most stable method and prevents "doubling" artifacts.
   */
  draw() {
    const viewportHeight = this.size.height - 1;
    const visibleLines = this.lines.slice(this.scrollPos, this.scrollPos + viewportHeight);
    
    // Clear screen once before drawing lines
    screen.clear();

    for (let i = 0; i < viewportHeight; i++) {
      const line = visibleLines[i];
      if (line !== undefined) {
        screen.moveCursor(i + 1, 1);
        // \x1b[K clears to end of line to prevent ghosting
        process.stdout.write(line + '\x1b[K');
      }
    }

    renderFooter(this.size.width, this.size.height, this.pageName);
  }
}

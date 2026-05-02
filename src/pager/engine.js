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

  /**
   * Refreshes the terminal size.
   */
  updateSize() {
    this.size = screen.getSize();
    this.clampScroll();
  }

  /**
   * Clamps scroll position to valid range.
   */
  clampScroll() {
    const maxScroll = Math.max(0, this.lines.length - (this.size.height - 1));
    if (this.scrollPos > maxScroll) {
      this.scrollPos = maxScroll;
    }
    if (this.scrollPos < 0) {
      this.scrollPos = 0;
    }
  }

  /**
   * Scrolls down by N lines.
   */
  scrollDown(n = 1) {
    this.scrollPos += n;
    this.clampScroll();
    this.draw();
  }

  /**
   * Scrolls up by N lines.
   */
  scrollUp(n = 1) {
    this.scrollPos -= n;
    this.clampScroll();
    this.draw();
  }

  /**
   * Scrolls to top.
   */
  scrollToTop() {
    this.scrollPos = 0;
    this.draw();
  }

  /**
   * Scrolls to bottom.
   */
  scrollToBottom() {
    this.scrollPos = Math.max(0, this.lines.length - (this.size.height - 1));
    this.draw();
  }

  /**
   * Draws the current viewport.
   */
  draw() {
    screen.clear();
    const viewportHeight = this.size.height - 1; // Save 1 row for footer
    const visibleLines = this.lines.slice(this.scrollPos, this.scrollPos + viewportHeight);

    for (let i = 0; i < visibleLines.length; i++) {
      screen.moveCursor(i + 1, 1);
      process.stdout.write(visibleLines[i]);
    }

    renderFooter(this.size.width, this.size.height, this.pageName);
  }
}

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

  scrollHalfPageDown() {
    const n = Math.floor(this.size.height / 2);
    this.scrollDown(n);
  }

  scrollHalfPageUp() {
    const n = Math.floor(this.size.height / 2);
    this.scrollUp(n);
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
   * Renders the viewport using a single batch write to prevent flicker.
   * Replicates the C client's RenderBuf logic.
   */
  draw() {
    const viewportHeight = this.size.height - 1;
    const visibleLines = this.lines.slice(this.scrollPos, this.scrollPos + viewportHeight);
    
    let buffer = '\x1b[?25l\x1b[H'; // Hide cursor and move to (1,1)

    for (let i = 0; i < viewportHeight; i++) {
      const line = visibleLines[i];
      if (line !== undefined) {
        // Line exists, append it and clear to end of line
        buffer += line + '\x1b[K\r\n';
      } else {
        // Line doesn't exist (past end of document), just clear line
        buffer += '\x1b[K\r\n';
      }
    }

    // Move to the last row for the footer
    buffer += `\x1b[${this.size.height};1H`;
    
    process.stdout.write(buffer);

    // Render the footer (it will do its own write, but we could also buffer it)
    renderFooter(this.size.width, this.size.height, this.pageName, this.scrollPos, this.lines.length);
  }
}

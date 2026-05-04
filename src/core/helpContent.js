'use strict';

export const helpContent = `.TITLE "mnu help"

.DIV "WHAT IS MNU?"
mnu is your friendly tool for reading simple documentation right in your terminal. It's built to be fast, clean, and very easy to read.

.DIV "WHERE TO LOOK?"
We organize pages into different categories to make them easy to find:
- **cli**: All about command-line tools and utilities.
- **linux**: Helpful things and commands specifically for Linux.
- **mac**: Helpful things and commands specifically for macOS.
- **windows**: Helpful things and commands specifically for Windows.

.DIV "HOW TO MOVE?"
Getting around is simple! Just use these keys on your keyboard:
- **j** or **Down**: Move down one line at a time.
- **k** or **Up**: Move up one line at a time.
- **d**: Jump down half a page to go faster.
- **u**: Jump up half a page to go faster.
- **g** or **Home**: Jump all the way to the top.
- **G** or **End**: Jump all the way to the bottom.
- **q**: Quit the viewer and go back to your shell.
- **h**: Close this help guide.

.DIV "HOW TO USE?"
To read a page, just type the category and the page name like this:
**mnu category:page**

To test a local file while writing your own page, use:
**mnu run path/to/file.mn**

To check the current version, use:
**mnu version**

Example: **mnu cli:git** or **mnu run test.mn**

.DIV "WANT TO HELP?"
Found a bug, need to update mnu, or want to add a page of your own? Check these links:


Project/Updates: __https://github.com/mnu-pages/mnu-client__
Contribute: __https://github.com/mnu-pages__

.DIV "NOTE"
Right now, MNU Pages has a very limited number of pages. We welcome everyone to help us grow by contributing your own pages to the collection!
`;

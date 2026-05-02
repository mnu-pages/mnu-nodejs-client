# mnu

Welcome to `mnu`! We believe documentation should be simple, scannable, and easy on the eyes. This is a terminal document viewer designed specifically for the `.mn` format.

It's like `man` or `less`, but focused on getting you the answers you need without the wall of text.

## Getting Started

To install `mnu` globally on your system, run:

```bash
npm install -g mnu-docs
```

## How to Use It

Using `mnu` is straightforward. Just tell it which category and page you want to see:

```bash
mnu category:page
```

**Try this example:**
```bash
mnu cli:git
```

## The .mn Syntax

We keep things structured so you can focus on writing. Here is how a `.mn` file looks:

- `.TITLE "text"`: Centered at the top, bold and underlined.
- `.DIV "text"`: A section header with nice padding.
- **Normal text**: Just write! It wraps automatically with clean margins.
- `**bold**`: For when you really need to highlight a command.
- `__underline__`: For important terms or folders.

## Navigation

Once you're in a document, you can move around using familiar keys:
- `j` or `ArrowDown`: Scroll down
- `k` or `ArrowUp`: Scroll up
- `g`: Jump to the very top
- `G`: Jump to the very bottom
- `q`: Quit and get back to your shell

## Contributing

If you want to improve the `mnu` tool itself, check out [CONTRIBUTING.md](./CONTRIBUTING.md).

To contribute new documentation pages or fix existing ones, please visit the [MNU Pages repository](https://github.com/mnu-pages/pages).

## License

MIT

# mnu

Welcome to `mnu`! We believe documentation should be simple, scannable, and easy on the eyes. This is a Node.js terminal document client designed specifically for the `.mn` format.

It's like `man` or `less`, but focused on getting you the answers you need without the wall of text.

> **Note:** For the best performance and minimal resource usage, we recommend using the [original C implementation](https://github.com/mnu-pages/mnu-client).

## Getting Started

To install `mnu` globally on your system, run:

```bash
npm install -g mnu-client
```

## How to Use It

Using `mnu` is straightforward. Just tell it which category and page you want to see:

```bash
mnu category:page
```

**Try these examples:**
```bash
mnu cli:git
mnu help
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
- `d`: Half page down
- `u`: Half page up
- `g`: Jump to the very top
- `G`: Jump to the very bottom
- `h`: Show help page
- `q`: Quit and get back to your shell

## Contributing

If you want to improve the `mnu` tool itself, check out [CONTRIBUTING.md](./CONTRIBUTING.md). 

Please also review our [Terms of Use](./TERMS.md) regarding responsible use, privacy-preserving anonymous identifiers, and infrastructure safety.

To contribute new documentation pages or fix existing ones, please visit the [MNU Pages repository](https://github.com/mnu-pages/pages).

## License

MIT

# Sibling Project Context: mnu-client (C Implementation)

This document provides a detailed analysis of the sibling project `mnu-client`, which is the high-performance C implementation of the `mnu` terminal document client.

## Project Overview

- **Repository**: `../mnu-client`
- **Language**: Strict POSIX C11.
- **Primary Goal**: A lightweight, portable, and flicker-free terminal document client for the `.mn` format.
- **Key Dependencies**: `libcurl` (networking), `make` (build system).

## Architecture & Module Breakdown

### Core Modules (`source/`)

- **`main.c`**: 
    - Handles CLI arguments: `category:page`, `run <file>`, `help`, `version`.
    - Manages the main application loop and signal handling (`SIGINT`, `SIGTERM`, `SIGWINCH`).
    - Integrates parsing, layout, and rendering into a cohesive flow.
- **`parser.c`**: 
    - Implements the `.mn` syntax parser.
    - Identifies `TITLE`, `DIV`, `TEXT`, and `SPACE` elements.
    - **Optimization**: Collapses consecutive blank lines into a single `SPACE` element and prevents leading spaces from being interpreted as content.
- **`renderer.c`**: 
    - Features an optimized **Render Buffer (`RenderBuf`)** system to batch terminal writes, ensuring zero-flicker updates.
    - Implements a responsive status bar (footer) that displays the page name and scroll progress (`TOP`, `MID`, `END`, or `ALL`).
    - Uses ANSI escape codes for styling (Inverted mode for footer, Bold/Underline for titles).
- **`http.c`**: 
    - Handles remote document fetching via `libcurl`.
    - Implements the **Anonymous Identifier System** in the User-Agent (`mnu-client/<VERSION> (ID/<ANON_ID>)`).
- **`layout.c`**: 
    - Responsible for word-wrapping and calculating content positioning based on the terminal's column count.
- **`terminal.c`**: 
    - Manages raw terminal mode, cursor visibility, and capturing keystrokes (including arrow keys).

### Build System

- Uses a simple `Makefile`.
- Default compiler is `clang`, but compatible with `gcc`.
- Compiles all source files into a single binary at `build/mnu`.

## Key Technical Specifications (from `GEMINI.md`)

- **Viewport**: Maximum content width of 80 characters, centered.
- **Padding**: 
    - Text: 10% Left / 10% Right.
    - DIV: 8% Left / 10% Right (visual outdent).
- **Anonymous ID**: A 32-bit FNV-1a hash of `uname` data + `getuid()`, used for infrastructure safety without compromising user privacy.
- **UTF-8 Support**: Full Unicode support via `mbrtowc` and `wcwidth`.

## Comparison with Node.js Client

| Feature | C Client (`mnu-client`) | Node.js Client (`mnu-nodejs-client`) |
| :--- | :--- | :--- |
| **Language** | C11 | JavaScript (ESM) |
| **Rendering** | Double-buffered (`RenderBuf`) | Direct `process.stdout.write` |
| **Networking** | `libcurl` | Custom `http.js` wrapper |
| **Input Handling** | Custom `terminal_read_key` | `readline` / `process.stdin` |
| **Parsing** | Manual string scanning | Regex-based (`mnParser.js`) |
| **Binary Size** | Minimal (native) | Large (Node.js runtime required) |

## Key Findings for Developers

- The C client is the "reference implementation" for performance and UI layout rules.
- The `Anonymous Identifier System` is a critical requirement for remote fetching to prevent infrastructure abuse while maintaining privacy.
- Signal handling for `SIGWINCH` is explicitly implemented to handle terminal resizing gracefully.

# Prezen

A **lightweight, zero‑dependency CLI** for transforming GitHub‑flavored Markdown into full‑screen presentation slides. It bundles syntax highlighting, MathJax support, and a handful of ready‑made themes so you can write slides the way you write docs.

## 🧩 Overview

Prezen reads a Markdown file, splits it at horizontal rules (`---`), and wraps each section inside an SVG slide. It ships the generated HTML next to the source file (e.g. `talk.md → talk.md.html`) and gives you keyboard/touch navigation out of the box.

Front‑matter (via [gray‑matter](https://github.com/jonschlinkert/gray-matter)) lets you specify metadata such as `title`, `theme`, and `paginate`. The rendering is powered by [marked](https://github.com/markedjs/marked) with a small custom tokenizer to keep LaTeX backslashes intact.

## 🚀 Features

- ✅ Converts Markdown to standalone HTML slides
- 🎨 Three built‑in themes: `default`, `academic`, `cooporative`, `hacker`
- 📚 Syntax highlighting with **highlight.js**
- 🔢 Optional pagination/counters
- 🧮 Built‑in MathJax for TeX/LaTeX equations
- 🧠 Touch‑ and keyboard‑friendly navigation with hash‑based URLs
- 🧾 Simple front‑matter configuration
- 🛠️ Works with [bun](https://bun.sh) or Node.js (ESM)
- 🧪 Example and test files included under `examples/`

## 🔧 Installation

```bash
# clone the repo
git clone https://github.com/nguyengiabach1201/Prezen.git
cd Prezen

# install dependencies (using bun or npm/yarn)
bun install
# or
npm install
```

You can also build a standalone executable with `bun build`:

```bash
bun run build
# or
npm run build
```

## 💻 Usage

```bash
bun run src/prezen.js -f path/to/slides.md
# or
node src/prezen.js -f path/to/slides.md
# or, if you built the binary:
./prezen -f slides.md
```

Options:

```bash
Usage: node src/prezen.js [options] or bun run src/prezen.js [options]

Options:
  -f, --file <path>    The path to the markdown file to read (Required)
  -h, --help           Display this help message
```

The output file will be `${input}.html`. Open it in any modern browser to run the presentation.

## 📝 Markdown & Front‑Matter

Each horizontal rule (`---`) denotes a new slide. You may include YAML front‑matter at the top of the document:

```yaml
---
title: "My Talk"
theme: academic
paginate: true
---
```

Valid front‑matter keys:

- `title` – string used for `<title>` and browser tab
- `theme` – one of `default`, `academic`, `cooporative`, `hacker` (case‑sensitive)
- `paginate` – boolean; show `current slide` counter
- Any other key is ignored but preserved by gray‑matter

Standard GitHub‑Flavored Markdown (tables, fenced code, autolinks, HTML blocks) is supported via `marked`.

## 🎨 Themes & Custom Styling

Themes are simple CSS blobs imported from `src/assets/styles/themes`. You can
select one via front‑matter or use your custom themes, note that you need to keep `custom-theme.css` in the same directory as the output HTML file:

```yaml
---
theme: custom-theme.css
---
```

You can also add additional styles inline:

```yaml
---
style: |
    .slide { background: black; color: #fff; }
---
```

Custom CSS may also be passed by editing the generated HTML or
using a wrapper script if you prefer.

## 🔢 Pagination & Navigation

Slides respond to:

- Arrow keys / space to move forward and back
- Hash URLs (`#3` for slide 3) so you can link directly
- Youch swipe left/right on mobile

The counter appears at the bottom when `paginate: true`.

## 🔍 Examples & Tests

Look at the `examples/` directory for sample Markdown files and the
corresponding generated HTML.

## 🛠 Development

- Source entry point: `src/prezen.js`
- Control logic for the browser lives in `src/core/control.js`
- Static assets (CSS/JS) are embedded at build time using Bun’s text
  import feature

To modify or extend the CLI, simply edit `src/prezen.js` and rerun the
command. The project uses ES modules, so it works with Node 16+ or Bun.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Happy presenting! 🎤

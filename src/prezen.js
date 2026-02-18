import matter from "gray-matter";
import { marked } from "marked";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

import highlightCss from "./assets/plugins/highlight.js/default.min.css" with { type: "text" };
import highlightJs from "./assets/plugins/highlight.js/highlight.min.js" with { type: "text" };

import mathJaxJs from "./assets/plugins/MathJax/tex-chtml.js" with { type: "text" };

import shellCss from "./assets/styles/shell.css" with { type: "text" };
import themeDefault from "./assets/styles/themes/themeDefault.css" with { type: "text" };

import themeAcademic from "./assets/styles/themes/themeAcademic.css" with { type: "text" };
import themeCooporative from "./assets/styles/themes/themeCooporative.css" with { type: "text" };
import themeHacker from "./assets/styles/themes/themeHacker.css" with { type: "text" };

import controlJs from "./core/control.js" with { type: "text" };

// Prevent the case \\ being treated as \ (as in Latex)
marked.use({
    tokenizer: {
        escape(src) {
            const cap = /^\\{2}/.exec(src);
            if (cap) {
                return {
                    type: "text",
                    raw: cap[0],
                    text: "\\\\",
                };
            }
            return false;
        },
    },
});

const args = process.argv.slice(2);

const helpMessage = `
Usage: bun run prezen.js [options]

Options:
  -f, --file <path>    The path to the markdown file to read (Required)
  --pdf                Export PDF file
  --preview            Enable preview mode with live reload
  --port <port>        Set the port for review mode
  -h, --help           Display this help message
`;

const options = {
    filePath: null,
    exportPdf: false,
    title: "Prezen Slides",
    theme: "default",
    paginate: false,
    style: null,
    preview: false,
    port: 3000,
};

for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
        case "-h":
        case "--help":
            console.log(helpMessage);
            process.exit(0);
            break;
        case "-f":
        case "--file":
            options.filePath = args[++i];
            break;
        case "--pdf":
            options.exportPdf = true;
            break;
        case "--preview":
            options.preview = true;
            break;
        case "--port":
            options.port = args[++i];
            break;
        default:
            console.error(`Error: Unknown option ${arg}\nUse -h for help.`);
            process.exit(-1);
    }
}

if (!options.filePath) {
    console.error("Error: Missing required argument --file <path>");
    console.log(helpMessage);
    process.exit(-1);
}

let isCustomTheme;
let theme;

function getTheme() {
    isCustomTheme = false;

    switch (options.theme) {
        case "default":
            theme = themeDefault;
            break;
        case "academic":
            theme = themeAcademic;
            break;
        case "cooporative":
            theme = themeCooporative;
            break;
        case "hacker":
            theme = themeHacker;
            break;
        default:
            isCustomTheme = true;

            try {
                theme = fs.readFileSync(
                    path.join(
                        path.dirname(path.resolve(options.filePath)),
                        options.theme,
                    ),
                    "utf-8",
                );
            } catch (err) {
                console.error(`Error: Could not add this custom theme ${err}`);
                process.exit(-1);
            }

            break;
    }
}

function splitMarkdownByHr(markdown) {
    const tokens = marked.lexer(markdown);
    const slides = [];
    let currentSlideTokens = [];

    for (const token of tokens) {
        if (token.type === "hr") {
            slides.push(currentSlideTokens);
            currentSlideTokens = [];
        } else {
            currentSlideTokens.push(token);
        }
    }

    if (currentSlideTokens.length > 0) {
        slides.push(currentSlideTokens);
    }

    return slides.map((slideTokens) => {
        // parser() expects the links property from the original lexer for references
        slideTokens.links = tokens.links;
        return marked.parser(slideTokens);
    });
}

let markdownSlides;

function getMarkdownSlides() {
    const file = matter.read(options.filePath);
    const data = file.data;
    const content = file.content.replace(
        /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,
    );

    if (typeof data.title == "string") {
        options.title = data.title;
    }

    if (typeof data.theme == "string") {
        options.theme = data.theme;
    }

    if (data.paginate) {
        options.paginate = true;
    }

    if (typeof data.style === "string") {
        options.style = data.style;
    }

    markdownSlides = splitMarkdownByHr(content);
}

function generateFullHtml(markdownSlides) {
    getTheme();

    const slidesBody = markdownSlides
        .map(
            (html, index) =>
                `<div class="slide" ${options.paginate ? `data-page="${index + 1}"` : ""}>${html}</div>`,
        )
        .join("\n");

    const liveReloadScript = options.preview
        ? `
    <script>
        const ws = new WebSocket("ws://" + location.host + "/ws");
        ws.onmessage = (event) => {
            if (event.data === "reload") location.reload();
        };
    </script>`
        : "";

    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.title}</title>

    <script>
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$']],
                processEscapes: true
            },
            options: {
                enableMenu: false,
            }
        };
    </script>

    <script async>${mathJaxJs}</script>
    
    <style>${highlightCss}</style>
    <script>${highlightJs}</script>
    <script>hljs.highlightAll();</script>

    <style>${shellCss}</style>
    <style>${theme}</style>

    ${typeof options.style == "string" ? `<style>${options.style}</style>` : ""}

    ${liveReloadScript}
</head>

<body>
    <svg viewBox="0 0 1280 720">
        <foreignObject width="1280" height="720" class="prezen-slide-container">
            ${slidesBody}
        </foreignObject>
    </svg>

    <section class="counter"></section>
    <script>${controlJs}</script>
</body>

</html>
`;
}

function compileHtml() {
    getMarkdownSlides();
    const fullHtml = generateFullHtml(markdownSlides);
    return fullHtml;
}

async function compilePdf() {
    getTheme();
    getMarkdownSlides();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });

    const slidesBody = markdownSlides
        .map(
            (html, index) => `
<svg viewBox="0 0 1280 720" style="position: absolute; top: ${720 * index}">
    <foreignObject width="1280" height="720" class="prezen-slide-container">
        <div class="slide" ${options.paginate ? `data-page="${index + 1}"` : ""}>
            ${html}
        </div>
    </foreignObject>
</svg>`,
        )
        .join("\n");

    const fullHtml = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script>
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$']],
                processEscapes: true
            },
            options: {
                enableMenu: false,
            }
        };
    </script>

    <script async>${mathJaxJs}</script>
    
    <style>${highlightCss}</style>
    <script>${highlightJs}</script>
    <script>hljs.highlightAll();</script>

    <style>
        body {
            margin: 0;
            width: 100vw;
        }

        .slide {
            width: 100%;
            height: 100%;
            padding: 70px;
            box-sizing: border-box;
        }
    </style>
    <style>${theme}</style>

    ${typeof options.style == "string" ? `<style>${options.style}</style>` : ""}
</head>

<body>
    ${slidesBody}
</body>

</html>
`;

    await page.setContent(fullHtml);

    await page.pdf({
        path: `${options.filePath}.pdf`,
        width: "1280px",
        height: "720px",
        printBackground: true,
        margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });

    await browser.close();
    console.log(`Created ${options.filePath}.pdf`);
}

if (options.preview) {
    try {
        compileHtml();

        const port = options.port;
        const sockets = new Set();

        Bun.serve({
            port,
            fetch(req, server) {
                const url = new URL(req.url);
                if (url.pathname === "/ws") {
                    if (server.upgrade(req)) return;
                    return new Response("Upgrade failed", { status: 400 });
                }
                return new Response(compileHtml(), {
                    headers: { "Content-Type": "text/html" },
                });
            },
            websocket: {
                open(ws) {
                    sockets.add(ws);
                },
                close(ws) {
                    sockets.add(ws);
                },
                message() {}, // No-op
            },
        });

        console.log(`Preview server running at http://localhost:${port}`);
        console.log(`Watching for changes in: ${options.filePath}`);

        fs.watch(options.filePath, (event) => {
            if (event === "change") {
                console.log(`Re-compiling ${options.filePath}...`);
                for (const socket of sockets) {
                    socket.send("reload");
                }
            }
        });

        if (isCustomTheme) {
            fs.watch(
                path.join(
                    path.dirname(path.resolve(options.filePath)),
                    options.theme,
                ),
                (event) => {
                    if (event === "change") {
                        console.log(`Re-compiling ${options.filePath}...`);
                        for (const socket of sockets) {
                            socket.send("reload");
                        }
                    }
                },
            );
        }
    } catch (err) {
        console.error(`Error: Could not run preview mode ${err.message}`);
        process.exit(-1);
    }
} else if (options.exportPdf) {
    try {
        compilePdf();
    } catch (err) {
        console.error(`Error: Could not build PDF file ${err.message}`);
        process.exit(-1);
    }
} else {
    try {
        const fullHtml = compileHtml();
        fs.writeFileSync(options.filePath + ".html", fullHtml, "utf-8");
        console.log(`Created ${options.filePath}.html`);
    } catch (err) {
        console.error(`Error: Could not build HTML file ${err.message}`);
        process.exit(-1);
    }
}

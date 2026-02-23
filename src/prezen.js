import fs from "fs";
import path from "path";
import { BrowserFinder } from "@agent-infra/browser-finder";
import matter from "gray-matter";
import { marked } from "marked";
import puppeteer from "puppeteer-core";
import pptxgen from "pptxgenjs";

// Asset Imports (Bun-specific attribute syntax)
import highlightCss from "./assets/plugins/highlight.js/default.min.css" with { type: "text" };
import highlightJs from "./assets/plugins/highlight.js/highlight.min.js" with { type: "text" };
import mathJaxJs from "./assets/plugins/MathJax/tex-chtml.js" with { type: "text" };
import shellCss from "./assets/styles/shell.css" with { type: "text" };
import controlJs from "./core/control.js" with { type: "text" };

// Theme Mapping
import themeDefault from "./assets/styles/themes/themeDefault.css" with { type: "text" };
import themeAcademic from "./assets/styles/themes/themeAcademic.css" with { type: "text" };
import themeCooporative from "./assets/styles/themes/themeCooporative.css" with { type: "text" };
import themeHacker from "./assets/styles/themes/themeHacker.css" with { type: "text" };

const THEMES = {
    default: themeDefault,
    academic: themeAcademic,
    cooporative: themeCooporative,
    hacker: themeHacker,
};

// --- Setup ---

marked.use({
    tokenizer: {
        escape(src) {
            const cap = /^\\{2}/.exec(src);
            if (cap) return { type: "text", raw: cap[0], text: "\\\\" };
            return false;
        },
    },
});

// --- Core Logic ---

/**
 * Parses the markdown file, extracts frontmatter, and splits content into slides.
 */
function parseMarkdown(filePath) {
    const { data, content } = matter.read(filePath);
    const cleanContent = content.replace(/^[\u200B-\uFEFF]/, "");

    const tokens = marked.lexer(cleanContent);
    const slides = [];
    let current = [];

    for (const token of tokens) {
        if (token.type === "hr") {
            slides.push(
                marked.parser(Object.assign(current, { links: tokens.links })),
            );
            current = [];
        } else {
            current.push(token);
        }
    }
    if (current.length)
        slides.push(
            marked.parser(Object.assign(current, { links: tokens.links })),
        );

    return {
        slides,
        config: {
            title: data.title || "Prezen Slides",
            theme: data.theme || "default",
            paginate: !!data.paginate,
            style: data.style || "",
            class: Array.isArray(data.class) ? data.class : [data.class],
        },
    };
}

/**
 * Resolves the CSS theme string.
 */
function resolveTheme(themeName, markdownPath) {
    if (THEMES[themeName]) return THEMES[themeName];
    try {
        const customPath = path.resolve(path.dirname(markdownPath), themeName);
        return fs.readFileSync(customPath, "utf-8");
    } catch {
        console.warn(
            `Warning: Theme "${themeName}" not found. Falling back to default.`,
        );
        return THEMES.default;
    }
}

/**
 * Shared HTML wrapper for Preview, PDF, and PPTX.
 */
function renderHTML({ slides, config, themeCss, isPreview, isExport }) {
    const slidesHtml = slides
        .map(
            (html, i) => `
        <div class="slide" ${config.paginate ? `data-page="${i + 1}"` : ""}>
            ${html}
        </div>
    `,
        )
        .join("\n");

    const layout = isExport
        ? slides
              .map(
                  (html, i) =>
                      `<svg viewBox="0 0 1280 720" style="position: absolute; top: ${720 * i}"><foreignObject width="1280" height="720" class="prezen-slide-container"><div class="slide" ${config.paginate ? `data-page="${i + 1}"` : ""}>${html}</div></foreignObject></svg>`,
              )
              .join("")
        : `<svg viewBox="0 0 1280 720"><foreignObject width="1280" height="720" class="prezen-slide-container">${slidesHtml}</foreignObject></svg>`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${config.title}</title>
    <script>window.MathJax = { tex: { inlineMath: [['$', '$']], processEscapes: true }, options: { enableMenu: false } };</script>
    <script async>${mathJaxJs}</script>
    <style>${highlightCss}${
        isExport
            ? `
body {
    margin: 0;
    width: 100vw;
}

.slide {
    width: 100%;
    height: 100%;
    padding: 70px;
    box-sizing: border-box;
}`
            : shellCss
    }${themeCss}${config.style}${
        config.class.includes("center")
            ? `
.slide {
    display: grid;
    align-content: center;
}
`
            : ""
    }</style>
    <script>${highlightJs}</script>
    <script>hljs.highlightAll();</script>
    ${
        isPreview
            ? `
    <script>
        const ws = new WebSocket("ws://" + location.host + "/ws");
        ws.onmessage = (e) => e.data === "reload" && location.reload();
    </script>`
            : ""
    }
</head>
<body>
    ${layout}
    ${!isExport ? `<section class="counter"></section><script>${controlJs}</script>` : ""}
</body>
</html>`;
}

// --- Actions ---

async function exportAssets(filePath, html, options) {
    const finder = new BrowserFinder();
    const resolved = finder.findBrowser();
    const execPath = resolved?.path || "";
    if (!execPath) {
        throw new Error("No compatible browser found for Puppeteer");
    }

    const browser = await puppeteer.launch({ executablePath: execPath });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 4 });
    await page.setContent(html, { waitUntil: "networkidle0" });

    if (options.pdf) {
        await page.pdf({
            path: `${filePath}.pdf`,
            width: "1280px",
            height: "720px",
            printBackground: true,
        });
        console.log(`PDF Created: ${filePath}.pdf`);
    }

    if (options.pptx) {
        const pres = new pptxgen();
        const slides = await page.$$(".slide");
        for (const slide of slides) {
            const img = await slide.screenshot({ encoding: "base64" });
            pres.addSlide().addImage({
                data: `image/png;base64,${img}`,
                x: 0,
                y: 0,
                w: "100%",
                h: "100%",
            });
        }
        await pres.writeFile({ fileName: `${filePath}.pptx` });
        console.log(`PPTX Created: ${filePath}.pptx`);
    }

    await browser.close();
}

function startPreviewServer(filePath, port) {
    const sockets = new Set();

    const reload = () => {
        console.log("Re-compiling...");
        for (const s of sockets) s.send("reload");
    };

    Bun.serve({
        port,
        async fetch(req, server) {
            if (new URL(req.url).pathname === "/ws") {
                return server.upgrade(req)
                    ? undefined
                    : new Response("WS upgrade failed", { status: 400 });
            }
            const { slides, config } = parseMarkdown(filePath);
            const themeCss = resolveTheme(config.theme, filePath);
            return new Response(
                renderHTML({ slides, config, themeCss, isPreview: true }),
                {
                    headers: { "Content-Type": "text/html" },
                },
            );
        },
        websocket: {
            open(ws) {
                sockets.add(ws);
            },
            close(ws) {
                sockets.delete(ws);
            },
        },
    });

    fs.watch(filePath, (event) => event === "change" && reload());
    console.log(`Preview: http://localhost:${port}`);
}

// --- CLI Entry Point ---

const args = Bun.argv.slice(2);
const options = {
    file: args[args.indexOf("-f") + 1] || args[args.indexOf("--file") + 1],
    pdf: args.includes("--pdf"),
    pptx: args.includes("--pptx"),
    preview: args.includes("--preview"),
    port: parseInt(args[args.indexOf("--port") + 1]) || 3000,
    help: args.includes("-h") || args.includes("--help"),
};

if (options.help || !options.file) {
    console.log(
        "Usage: bun prezen.js -f <file.md> [--pdf] [--pptx] [--preview] [--port 3000]",
    );
    process.exit(0);
}

// Execution flow
(async () => {
    try {
        if (options.preview) {
            startPreviewServer(options.file, options.port);
        } else if (options.pdf || options.pptx) {
            const { slides, config } = parseMarkdown(options.file);
            const themeCss = resolveTheme(config.theme, options.file);
            const html = renderHTML({
                slides,
                config,
                themeCss,
                isExport: true,
            });
            await exportAssets(options.file, html, options);
        } else {
            const { slides, config } = parseMarkdown(options.file);
            const themeCss = resolveTheme(config.theme, options.file);
            fs.readFileSync(
                `${options.file}.html`,
                renderHTML({ slides, config, themeCss }),
            );
            console.log(`HTML Created: ${options.file}.html`);
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
})();

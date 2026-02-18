import matter from "gray-matter";
import { marked } from "marked";
import fs from "fs";

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
Usage: node prezen.js [options] or bun run prezen.js [options]

Options:
  -f, --file <path>    The path to the markdown file to read (Required)
  -h, --help           Display this help message
`;

const options = {
    filePath: null,
    title: "Prezen Slides",
    theme: "default",
    paginate: false,
    style: null,
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

function generateFullHtml(htmlSlides) {
    let isCustomTheme = false;
    let theme;

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
            theme = options.theme;
            break;
    }

    const slidesBody = htmlSlides
        .map(
            (html, index) =>
                `<div class="slide" ${options.paginate ? `data-page="${index + 1}"` : ""}>${html}</div>`,
        )
        .join("\n");

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
    ${isCustomTheme ? `<link rel="stylesheet" href="${theme}">` : `<style>${theme}</style>`}

    ${typeof options.style == "string" ? `<style>${options.style}</style>` : ""}
</head>

<body>
    <svg viewBox="0 0 1280 720">
        <foreignObject width="1280" height="720" class="prezen-slide-container markdown-body">
            ${slidesBody}
        </foreignObject>
    </svg>

    <section class="counter"></section>
    <script>${controlJs}</script>
</body>

</html>
`;
}

try {
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

    const htmlSlides = splitMarkdownByHr(content);
    const fullHtml = generateFullHtml(htmlSlides);

    fs.writeFileSync(options.filePath + ".html", fullHtml, "utf-8");
} catch (err) {
    console.error(`Error: Could not read file ${err.message}`);
    process.exit(-1);
}

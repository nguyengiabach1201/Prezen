import fs from "fs";

function template(markdown) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Slideshow</title>

<script type="module">
  import ZeroMd from 'https://cdn.jsdelivr.net/npm/zero-md@3'
  customElements.define('zero-md', class extends ZeroMd {
    async load() {
      await super.load()
      this.template = \`
        <style>:host { display: flex; align-items: center; justify-content: center; position: relative; contain: content; padding: 1rem; } :host([hidden]) { display: none; }</style>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5/github-markdown-light.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11/styles/github.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0/dist/katex.min.css" />
      \`
    }
  })
</script>
</head>
<body>
<div class="presentation">

${markdown}

</div>
<script src="https://nguyengiabach1201.github.io/Prezen/prezen.js"></script>
</body>
</html>
`;
}

function seperate(html) {
  html = html.split("\n");
  for (let i = 0; i < html.length; i++) html[i] = html[i].trim();
  html = html.join("\n");

  return html;
}

function join(html) {
  html = html.split("\n");
  for (let i = 0; i < html.length; i++) {
    html[i] = html[i].trim();

    if (html[i] == "---") {
      html[i] = `</script></zero-md></div></div><div><div class='content'><zero-md><script type="text/markdown">`;
    }
  }
  html = html.join("\n");

  return `<div><div class='content'><zero-md><script type="text/markdown">` + html + `</script></zero-md></div></div>`;
}

for (let i = 2; i < process.argv.length; i++) {
  try {
    const src = fs.readFileSync(process.argv[i], "utf-8");
    var filename = process.argv[i].replace(/^.*[\\/]/, "");

    let html = seperate(src);
    html = join(html);
    html = template(html);

    try {
      fs.writeFileSync(filename + ".html", html);
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
}

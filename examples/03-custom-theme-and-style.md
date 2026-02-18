---
title: "Custom Theme & Style Demo"
theme: default
paginate: true
style: |
    /* Custom style injected via front-matter */
    .slide {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    h1 {
      color: #4a148c;
    }
    .glass-card {
      background: rgba(228, 215, 215, 0.7);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 30px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
    }
---

# 🎨 Custom Themes & Inline Styles

This slide uses the **default** Prezen theme with custom style injected via the YAML front-matter.

- **Theme**: default (one of: default, academic, gaia)
- **Font**: Segoe UI (Customized via style)
- **Features**: paginate, custom CSS, inline styles

---

# 🌓 Slide-Specific Styles

Add an inline `<style>` block to customize individual slides. This approach lets you override global styles for just the current slide **and onwards**.

- Add `<style>` tags directly in Markdown
- Affects current and subsequent slides
- Perfect for custom layouts or accent colors

---

<style>
    @scope {
        :scope { background: coral; } /* Styles the container itself */
        p { color: white; }           /* Styles only paragraphs inside this div */
    }
</style>

To make `<style>` apply to just the current slide, use `@scope` like this:

```css
<style>
    @scope {
        :scope { background: coral; } /* Styles the container itself */
        p { color: white; }           /* Styles only paragraphs inside this div */
    }
</style>
```

---

## 🧪 Custom CSS Classes & Flexbox

Define custom classes in a `<style>` block or in the front-matter and apply them to `<div>` elements for modern layouts.

<div class="glass-card">

### 💡 The Glassmorphism Effect

Use `backdrop-filter: blur(10px)` and `rgba()` colors to create elegant, layered designs

</div>

---

# ✨ Summary

Prezen gives you multiple ways to style slides:

1. **Front-Matter**: Use the `style` key to inject global CSS
2. **Inline `<style>` blocks**: Add CSS anywhere in your Markdown
3. **Inline `<div style="...">` tags**: Quick, one-off style tweaks
4. **Built-in Themes**: Choose `default`, `academic`, or `gaia`
5. **Combine them all**: Mix and match for maximum flexibility

Start simple with a theme, then layer on custom CSS as needed!

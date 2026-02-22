# 🛠️ Advanced Layout Techniques

Using HTML `div` blocks allows for layouts that standard Markdown cannot achieve alone.

1. **Vertical Centering** via Inline Styles
2. **Multi-column Layouts** via Scoped CSS
3. **GFM Integration** inside HTML containers

---

<div style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%">
<div>

# 🎯 Vertically Centered Header

This text is perfectly aligned in the middle of the slide.

</div>
</div>

---

<style>
  .row {
    margin-top: 1em;
    display: flex;
    gap: 20px;
  }
  .column {
    flex: 1;
    padding: 20px;
    border-radius: 10px;
    background-color: #f0f0f0;
  }
  .col-right {
    background-color: #e0f7fa;
  }
</style>

## 📊 Dual Column Layout

Using the `.row` and `.column` classes defined in the `<style>` block:

<div class="row">
<div class="column" markdown="1">
    
### ⬅️ Left Column
* **Markdown content**
* works perfectly
* inside this div.

</div>
<div class="column col-right" markdown="1">
    
### ➡️ Right Column
Checkboxes and Tables:
- [x] Column A
- [x] Column B
- [ ] Column C

</div>
</div>

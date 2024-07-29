# Prezen

## Introduction
__Prezen__ is a powerful tool that empowers users to craft dynamic and scalable presentations using __HTML__, a familiar language. By leveraging web technologies, __Prezen__ offers unparalleled __flexibility__ and __customization__, enabling the creation of __visually stunning__ and __interactive__ slides.

## How to use

### Initial
Here is the initial template for your presentation with __Prezen__:
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slideshow</title>
</head>

<body>
    <div class="presentation">

    </div>
    <script src="./prezen.js"></script>
</body>

</html>
```

### Create your first slide
Inside `<div class="presentation"></div>` is where you put your slides in. 

To create a slide, paste the following code:
```html
<div>
    <div class="heading">
    </div>
    <div class="content">
    </div>
</div>
```

> [!NOTE]  
> If you don't want your slide to have a heading, you could remove the first `div`.
>
> If you want your contents to be centered, simply add `center` to the second `div`'s class list.

The slide is divided into two `div`s:
- The first is the __heading__, this div contains bare text which is your desired title.
- The second is the __content__, build your slides just like you build your website with __HTML__.

### Slides' effects
Additionally, you can add __transition effects__ to your slides!

Simply add the effect name to the slide's class list:
```html
<div class="ef1">
    <div class="content">
        <h1>This slide has a transition effect!!!</h1>
    </div>
</div>
```

There are 12 effects in total:
- `ef1`: Zoom in
- `ef2`: Zoom out
- `ef3`: Right to left
- `ef4`: Left to right
- `ef5`: Top to bottom
- `ef6`: Bottom to top
- `ef7`: Rotate around
- `ef8`: Rotate left to right
- `ef9`: Rotate right to left
- `ef10`: Skew left to right
- `ef11`: Skew right to left
- `ef12`: Fade in

> [!NOTE]
> You can also __merge__ many effects just by writing __multiple__ effect names.

### Charts
__Prezen__ also comes with a __chart displayer__. The syntax for this is a bit more complex.

You first create a `div`, which itself has class `chart` then the chart type: `bar` or `line` or `pie`. Then inside that `div` is first the chart name, then the data.

Here is an example:
```html
<div class="chart bar">
    Name: Foo
    Bar:1000
    Foo:1000
    Bar:1000
</div>
```

### Change theme
__Prezen__'s default theme is a light-blue theme, but it is modifiable.

You would need to create a `CSS` file with any names you want. Inside that file, inside `:root` class, there are 4 values you can change based on your will:
- `background`: Which is the color for the background of your presentation.
- `theme`: Which is the color for `<h1>` to `<h6>` tags, __header__ and many others.
- `heading`: Which is the color for the __heading's title__.
- `p-color`: Which is the color for the `<p>` tags
  
Here is an example:
```css
:root {
    --theme: #ea5312;
    --background: white;
    --heading: white;
    --p-color: black;
}
```

### Example
I also included a [template](./example.html) file that contains all of __Prezen__ features!

## Markdown support
__Prezen__ also support editting with [__Markdown__](./src/markdown/example.md)! The syntax is simple, just like __Github's Markdown__.

## To-do
- Support Markdown
- Draw on slides during a presentation

## Contact
Feel free to fork this repository or open issues. For any further information, please contact [my email](mailto:nguyengiabach1201@gmail.com).

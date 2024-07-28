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

### Charts

### Change theme

### Example
I also included a [template](./template.html) file that contains all of __Prezen__ features!

## To-do
- Support Markdown
- Draw on slides during a presentation

## Contact
Feel free to fork this repository or open issues. For any further information, please contact [my email](mailto:nguyengiabach1201@gmail.com).

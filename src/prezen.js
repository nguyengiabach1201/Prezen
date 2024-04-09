(function () {
    // add scripts & styles
    document.body.style.display = "none";
    function addScript(src) {
        var s = document.createElement('script');
        s.setAttribute('src', src);
        document.head.appendChild(s);
    }

    function addStyle(src) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;
        document.head.appendChild(link);
    }

    addScript("https://polyfill.io/v3/polyfill.min.js?features=es6");
    addScript("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js");
    addScript("https://cdn.jsdelivr.net/npm/chart.js@2.8.0");

    addStyle("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");
    addStyle("https://nguyengiabach1201.github.io/Prezen/src/prezen.css");

    addScript("https://nguyengiabach1201.github.io/Prezen/plugins/prism.js");
    addStyle("https://nguyengiabach1201.github.io/Prezen/plugins/prism.css");

    // fully loaded
    window.addEventListener('load', function () {
        document.body.style.display = "flex";
        addScript("https://nguyengiabach1201.github.io/Prezen/plugins/prezen-chart.js");

        if (getComputedStyle(document.documentElement).getPropertyValue('--theme') == '') {
            document.documentElement.style.setProperty('--theme', '#1e90ff');
        }
        if (getComputedStyle(document.documentElement).getPropertyValue('--background') == '') {
            document.documentElement.style.setProperty('--background', 'white');
        }
        if (getComputedStyle(document.documentElement).getPropertyValue('--heading') == '') {
            document.documentElement.style.setProperty('--heading', 'white');
        }
        if (getComputedStyle(document.documentElement).getPropertyValue('--p-color') == '') {
            document.documentElement.style.setProperty('--p-color', 'black');
        }
    });

    // add #presentation-area
    const presentation = document.querySelector(".presentation");
    const presentationController = document.createElement("div");
    presentationController.id = "presentation-area"

    if (presentation.parentNode) {
        presentation.parentNode.insertBefore(presentationController, presentation);
    } else {
        document.body.appendChild(presentationController);
    }
    presentationController.appendChild(presentation);

    // auto show the first slide
    document.querySelectorAll(".slide")[0].classList.add("show");

    // add counter & navigation button
    function fromHTML(html, trim = true) {
        html = trim ? html : html.trim();
        if (!html) return null;
        const template = document.createElement('template');
        template.innerHTML = html;
        const result = template.content.children;
        if (result.length === 1) return result[0];
        return result;
    }
    let counter = fromHTML('<section class="counter"></section>');
    let navigation = fromHTML('<section class="navigation"><button id="left-btn" class="btn"><i class="fas fa-solid fa-caret-left"></i></button><button id="right-btn" class="btn"><i class="fa-solid fa-caret-right"></i></button></section>');
    presentationController.appendChild(counter);
    presentationController.appendChild(navigation);

    // get elements
    let slides, currentSlide;

    var slideNumber = document.querySelector(".counter");
    var toLeftBtn = document.querySelector("#left-btn");
    var toRightBtn = document.querySelector("#right-btn");

    // initailize defualt values
    var currentSlideNo = 1;
    var totalSides = 0;

    // keyboard input
    document.addEventListener('keydown', (event) => {
        var name = event.key;
        if (name == "ArrowDown" || name == "ArrowRight") {
            moveToRightSlide();
        }
        if (name == "ArrowUp" || name == "ArrowLeft") {
            moveToLeftSlide();
        }
    }, false);

    // run init script
    init();

    function init() {
        fullScreenMode();

        slides = document.querySelectorAll(".slide");
        currentSlide = document.querySelector(".slide.show");

        getCurrentSlideNo();
        totalSides = slides.length;
        setSlideNo();
        hideLeftButton();
        hideRightButton();
    }

    // handle clicks on left and right icons
    toLeftBtn.addEventListener("click", moveToLeftSlide);
    toRightBtn.addEventListener("click", moveToRightSlide);

    // hide left button at first page
    function hideLeftButton() {
        if (currentSlideNo == 1) {
            toLeftBtn.classList.remove("show");
        } else {
            toLeftBtn.classList.add("show");
        }
    }

    // hide right button at last page
    function hideRightButton() {
        if (currentSlideNo === totalSides) {
            toRightBtn.classList.remove("show");
        } else {
            toRightBtn.classList.add("show");
        }
    }

    // moves to left slide
    function moveToLeftSlide() {
        if (currentSlideNo != 1) {
            var tempSlide = currentSlide;
            currentSlide = currentSlide.previousElementSibling;
            tempSlide.classList.remove("show");
            currentSlide.classList.add("show");

            init();
        }
    }

    // moves to right slide
    function moveToRightSlide() {
        if (currentSlideNo != totalSides) {
            var tempSlide = currentSlide;
            currentSlide = currentSlide.nextElementSibling;
            tempSlide.classList.remove("show");
            currentSlide.classList.add("show");

            init();
        }
    }

    // get current slide
    function getCurrentSlideNo() {
        let counter = 0;

        slides.forEach((slide, i) => {
            counter++;

            if (slide.classList.contains("show")) {
                currentSlideNo = counter;
            }
        });
    }

    // go full screen
    function fullScreenMode() {
        presentationController.classList.add("full-screen");
    }

    // update counter
    function setSlideNo() {
        slideNumber.innerText = `${currentSlideNo} of ${totalSides}`;
    }

    // swipping
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }

    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    };

    function handleTouchMove(evt) {
        if (!xDown || !yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 0) {
                /* right swipe */
                moveToRightSlide();
            } else {
                /* left swipe */
                moveToLeftSlide();
            }
        } else {
            if (yDiff > 0) {
                /* down swipe */
            } else {
                /* up swipe */
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    };
})();
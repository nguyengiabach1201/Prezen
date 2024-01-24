// get elements
let presentation = document.querySelector(".presentation");
// let slides = document.querySelectorAll(".slide");
// let currentSlide = document.querySelector(".slide.show");
let slides, currentSlide;

var slideNumber = document.querySelector(".counter");
var toLeftBtn = document.querySelector("#left-btn");
var toRightBtn = document.querySelector("#right-btn");

let presentationController = document.querySelector("#presentation-area");
var toFullScreenBtn = document.querySelector("#full-screen");
var toSmallScreenBtn = document.querySelector("#small-screen");

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
let slides;
let currentSlideNo = 1;
let totalSides = 0;
const slideNumber = document.querySelector(".counter");

let touchStartX = 0;
let touchEndX = 0;

init();

function init() {
    slides = document.querySelectorAll(".slide");
    totalSides = slides.length;

    const hash = window.location.hash.replace("#", "");
    if (hash && !isNaN(hash)) {
        currentSlideNo = parseInt(hash);

        if (currentSlideNo > totalSides) currentSlideNo = totalSides;
        if (currentSlideNo < 1) currentSlideNo = 1;
    }

    updateSlideVisibility();
    setupTouchListeners();
}

document.addEventListener("keydown", (event) => {
    const name = event.key;
    if (name === "ArrowDown" || name === "ArrowRight" || name === " ") {
        moveToRightSlide();
    }
    if (name === "ArrowUp" || name === "ArrowLeft") {
        moveToLeftSlide();
    }
});

function setupTouchListeners() {
    document.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
    });
}

function handleGesture() {
    const threshold = 50; // Minimum distance in pixels to count as a swipe
    if (touchEndX < touchStartX - threshold) {
        moveToRightSlide();
    }
    if (touchEndX > touchStartX + threshold) {
        moveToLeftSlide();
    }
}

window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "");
    if (hash && !isNaN(hash)) {
        currentSlideNo = parseInt(hash);

        if (currentSlideNo > totalSides) currentSlideNo = totalSides;
        if (currentSlideNo < 1) currentSlideNo = 1;
    }

    updateSlideVisibility();
});

function updateSlideVisibility() {
    slides.forEach((slide, index) => {
        if (index === currentSlideNo - 1) {
            slide.classList.add("active");
        } else {
            slide.classList.remove("active");
        }

        if (index < currentSlideNo - 1) {
            slide.classList.add("exit");
        } else {
            slide.classList.remove("exit");
        }
    });

    window.location.hash = currentSlideNo;
    setSlideNo();
}

function moveToLeftSlide() {
    if (currentSlideNo > 1) {
        currentSlideNo--;
        updateSlideVisibility();
    }
}

function moveToRightSlide() {
    if (currentSlideNo < totalSides) {
        currentSlideNo++;
        updateSlideVisibility();
    }
}

function setSlideNo() {
    slideNumber.innerText = `${currentSlideNo} of ${totalSides}`;
}

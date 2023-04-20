export const init = () => {
    const hero = document.querySelector(".js-hero");
    if (!hero) return;
    const interval = hero.dataset.interval;
    const ACTIVE_CLASS = "is-active"
    let HeroInterval;

    function nextSlide() {
        clearTimeout(HeroInterval);
        hero.classList.remove("is-sliding");
        const slides = document.querySelectorAll(".js-hero-slide");
        const activeSlide = document.querySelector(".js-hero-slide.is-active");
        const nextItem = activeSlide.nextElementSibling;
        slides.forEach((slide) => {
            slide.classList.remove(ACTIVE_CLASS);
        })
        if (nextItem) {
            nextItem.classList.add(ACTIVE_CLASS);
        } else {
            slides[0].classList.add(ACTIVE_CLASS);
        }
        setTimeout(() => {
            hero.classList.add("is-sliding");
        }, 50)
        HeroInterval = setTimeout(() => {
            nextSlide();
		}, interval);
    }

    hero.classList.add("is-sliding");
    HeroInterval = setInterval(() => {
        nextSlide();
    }, interval)

};

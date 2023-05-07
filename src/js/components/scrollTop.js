
export const init = () => {
    const btn = document.querySelector(".js-scroll-top");
    const ACTIVE_CLASS = "is-active";

// When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
    if (document.body.scrollTop > 1080 || document.documentElement.scrollTop > 1080) {
        btn.classList.add(ACTIVE_CLASS);
    } else {
        btn.classList.remove(ACTIVE_CLASS);
    }
    }

    // When the user clicks on the button, scroll to the top of the document
    function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    }

    btn.addEventListener("click", topFunction);
};

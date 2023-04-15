
export const init = () => {
	const menu = document.querySelector('.js-menu');
    if (!menu) return;
    const menuBtn = document.querySelector('.js-menu-btn');

    function toggleMenu(e) {
        const body = document.querySelector("body");
        const parent = e.target.closest(".js-menu");
        const content = parent.querySelector(".js-menu-content");
        content.classList.toggle("is-open");
        body.classList.toggle("menu-open");
    }

    menuBtn.addEventListener("click", toggleMenu);
};

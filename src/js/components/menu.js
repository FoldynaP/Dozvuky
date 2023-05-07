
export const init = () => {
	const menu = document.querySelector('.js-menu');
    if (!menu) return;
    const menuBtn = document.querySelector('.js-menu-btn');

    function toggleMenu(e) {
        const body = document.querySelector("body");
        const parent = e.target.closest(".js-menu");
        const links = parent.querySelectorAll(".js-menu-link");
        const content = parent.querySelector(".js-menu-content");
        console.log(e)
        content.classList.toggle("is-open");
        body.classList.toggle("menu-open");
        links.forEach(link => {
            link.addEventListener("click", toggleMenu)
        });
    }

    menuBtn.addEventListener("click", toggleMenu);
};

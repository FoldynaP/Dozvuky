import EmblaCarousel from 'embla-carousel';

export const init = () => {
	const emblaNodes = document.querySelectorAll('.js-embla');

	Array.from(emblaNodes).forEach((emblaNode) => {
		const prevBtn = emblaNode.querySelector('.embla__button--prev');
		const nextBtn = emblaNode.querySelector('.embla__button--next');
		const viewPort = emblaNode.querySelector(".embla__viewport");

		let interval = null;
		const { carouselLoop, carouselInterval, slidesNumber } = emblaNode.dataset;

		const options = {
			align: 'start',
			loop: carouselLoop,
			slidesToScroll: slidesNumber || 1,
			inViewThreshold: 0.7,
		};


		const setupPrevNextBtns = (prevBtn, nextBtn, embla) => {
			prevBtn.addEventListener('click', embla.scrollPrev, false);
		nextBtn.addEventListener('click', embla.scrollNext, false);
		};
		const disablePrevNextBtns = (prevBtn, nextBtn, embla) => {
			return () => {
			  if (embla.canScrollPrev()) prevBtn.removeAttribute('disabled');
			  else prevBtn.setAttribute('disabled', 'disabled');
		  
			  if (embla.canScrollNext()) nextBtn.removeAttribute('disabled');
			  else nextBtn.setAttribute('disabled', 'disabled');
			};
		};
		const setupDotBtns = (dotsArray, embla) => {
			dotsArray.forEach((dotNode, i) => {
			  dotNode.addEventListener("click", () => embla.scrollTo(i), false);
			});
		};
		const generateDotBtns = (dots, embla) => {
			const template = document.getElementById("embla-dot-template").innerHTML;
			dots.innerHTML = embla.scrollSnapList().reduce(acc => acc + template, "");
			return [].slice.call(dots.querySelectorAll(".embla__dot"));
		};
		const selectDotBtn = (dotsArray, embla) => () => {
			const previous = embla.previousScrollSnap();
			const selected = embla.selectedScrollSnap();
			dotsArray[previous].classList.remove("is-selected");
			dotsArray[selected].classList.add("is-selected");
		};

		const dots = emblaNode.querySelector(".embla__dots");
		
		const hasSomeSlides = () => emblaNode.children.length && emblaNode.children[0] && emblaNode.children[0].children.length;
		
		if (!hasSomeSlides()) return;
		const embla = EmblaCarousel( viewPort, options);
		const dotsArray = generateDotBtns(dots, embla);
		const setSelectedDotBtn = selectDotBtn(dotsArray, embla);
		const disablePrevAndNextBtns = disablePrevNextBtns(prevBtn, nextBtn, embla);

        const createInterval = () => {
			interval = setInterval(() => {
				embla.scrollNext();
			}, carouselInterval);
		};

		const resetInterval = () => {
			if (!interval) return;
			clearInterval(interval);
			createInterval();
		};
        embla.on('scroll', () => {
			resetInterval();
		});

        if (!prevBtn || !nextBtn) return;
		setupPrevNextBtns(prevBtn, nextBtn, embla);

		setupDotBtns(dotsArray, embla);
		embla.on("select", setSelectedDotBtn);
		embla.on("select", disablePrevAndNextBtns);
		embla.on("init", setSelectedDotBtn);
		embla.on("init", disablePrevAndNextBtns);

		if (!carouselInterval) return;
		createInterval();

	});
};


export const init = () => {
	const buttons = document.querySelectorAll('.js-accordion-btn');

	function toggleItem(params) {
		const parentItem = this.closest('.js-accordion-item');
		const body = parentItem.querySelector('.js-accordion-body');
		const content = parentItem.querySelector('.js-accordion-content');
		const bodyHeight = body.clientHeight;
		parentItem.classList.toggle('is-open');
		if (parentItem.classList.contains('is-open')) {
			content.style.height = bodyHeight + 'px';
		} else {
			content.removeAttribute('style');
		}

	}

	buttons.forEach(item => {
		item.addEventListener('click', toggleItem);
	})


	function checkUrl(params) {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const acc = urlParams.get('accordion')
		const items = document.querySelectorAll('.js-accordion-item');
		items.forEach(parentItem => {
			if (parentItem.id === acc) {
				parentItem.classList.add('is-open');
				const body = parentItem.querySelector('.js-accordion-body');
				const content = parentItem.querySelector('.js-accordion-content');
				const bodyHeight = body.clientHeight;
				content.style.height = bodyHeight + 'px';
			}
		})
	}
	checkUrl();
};

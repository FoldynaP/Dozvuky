// Components
import * as accordion from './components/accordion';
import * as menu from './components/menu';
import * as hero from './components/hero';
import * as embla from './components/embla';
import * as parallax from './components/parallax';
import fslightbox from 'fslightbox';

// content load components
const componentsload = [];

// once delegated components
const components = [
	accordion,
	menu,
	hero,
	embla,
	parallax
].concat(componentsload);
window.App = {
	run() {
		const target = document;
		components.forEach((component) => component.init(target));

		document.addEventListener('contentload', (event) => {
			const eventTarget = event.target || target;
			componentsload.forEach((component) => component.init(eventTarget));
		});
	},

	initComponent(component) {
		return component.init();
	},
};

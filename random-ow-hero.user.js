// ==UserScript==
// @name         Random OW Hero Selector
// @namespace    https://baipyr.us/
// @version      2026-10-26
// @description  Addss a button to pick a random character of the selected roles for you!
// @author       Baipyrus
// @match        https://overwatch.blizzard.com/en-us/heroes/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blizzard.com
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	const cards = document.querySelector('.heroCards');
	if (!cards) throw new Error('Could not find hero cards container!');

	const container = document.createElement('div');
	container.style.justifyContent = 'center';
	container.style.flexDirection = 'column';
	container.style.alignItems = 'center';
	container.style.textAlign = 'center';
	container.style.marginTop = '2em';
	container.style.fontSize = '20px';
	container.style.display = 'flex';
	container.style.color = 'white';

	const output = document.createElement('div');
	output.style.marginTop = '1em';

	const label = document.createElement('span');
	label.textContent = 'Random character selector: ';

	const button = document.createElement('button');
	button.style.backgroundColor = '#FF7926';
	button.style.borderRadius = '8px';
	button.style.fontSize = '20px';
	button.style.border = '0px none';
	button.style.cursor = 'pointer';
	button.style.color = 'white';
	button.style.width = '5em';

	button.textContent = 'Pick';
	button.onclick = () => {
		const heroes = document.querySelectorAll('.hero-card[show="show"]');
		if (heroes.length === 0) throw new Error('Could not find any selected hero list!');
		const random = heroes[Math.floor(Math.random() * heroes.length)];

		const clone = random.cloneNode(true);
		if (output.childElementCount === 0) output.appendChild(clone);
		else output.replaceChild(clone, output.lastChild);
	};

	container.appendChild(label);
	container.appendChild(button);
	container.appendChild(output);
	cards.parentElement?.insertBefore(container, cards);
})();

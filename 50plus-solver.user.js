// ==UserScript==
// @name         50Plus puzzel solver
// @namespace    https://eiflerstrom.de/
// @version      2026-02-13
// @description  Solves some puzzels of the 50Plus website from the solution in the HTML
// @author       IC3P3
// @match        https://www.50plus.de/spiele/raetsel/*
// @icon         https://www.startpage.com/sp/sxpra?url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fe%2Fec%2F50PLUS_%2528nl%2529_Logo.svg%2F960px-50PLUS_%2528nl%2529_Logo.svg.png
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	function solve() {
		const solution = document.getElementsByClassName('sd-kwr-bg')[0].childNodes;
		const solutionLetters = [...solution].map((el) => el.getAttribute('data-default'));
		const input = document.getElementsByClassName('sd-kwr-input')[0].childNodes;
		const keyboard = document.getElementsByTagName('keyboard')[0].getElementsByTagName('key');

		solutionLetters.forEach((letter, index) => {
			if (letter == '') return;

			input[index].dispatchEvent(new MouseEvent('mousedown'));
			[...keyboard]
				.find((key) => key.getAttribute('data-value') == letter.toUpperCase())
				.dispatchEvent(new MouseEvent('mousedown'));
		});
	}

	const button = document.createElement('button');
	button.textContent = 'Solve Crossword';
	button.style.position = 'absolute';
	button.style.top = '-30px';
	button.onclick = solve;

	const interval = setInterval(() => {
		const dsgame = document.querySelector('#dsgame kwr');
		if (dsgame) {
			dsgame.appendChild(button);
			clearInterval(interval);
		}
	}, 500);
})();

// ==UserScript==
// @name         50Plus puzzel solver
// @namespace    https://baipyr.us/
// @version      2026-02-13
// @description  Solves some puzzels of the 50Plus website from the solution in the HTML
// @author       Baipyrus
// @match        https://www.50plus.de/spiele/raetsel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=50plus.de
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	// Wait for elements to load, then start solving the crossword
	setTimeout(() => {
		const crossword = document.querySelector('#dsgame > kwr');

		const [first, second] = crossword.children;
		const solutionElements = first.children;
		const inputElements = second.children;

		const solutionLetters = Array.from(solutionElements).map((b) => b.dataset.default);
		const touchKeyboard = Array.from(document.querySelectorAll('#dsgame > keyboard key'));

		// Loop over all empty crossword cells
		solutionLetters.forEach((letter, idx) => {
			if (letter === '') return;

			// Select corresponding input elemnt of this crossword cell
			inputElements[idx].dispatchEvent(new MouseEvent('mousedown'));
			// Click the corresponding letter on the touch keyboard
			touchKeyboard
				.find((key) => key.dataset.value === letter.toUpperCase())
				.dispatchEvent(new MouseEvent('mousedown'));
		});
	}, 1500);
})();

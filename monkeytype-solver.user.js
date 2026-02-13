// ==UserScript==
// @name         Monkeytype typer
// @namespace    https://baipyr.us/
// @version      2026-02-13
// @description  Types all the characters shown in Monkeytype
// @author       Baipyrus
// @match        https://monkeytype.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monkeytype.com
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	setInterval(() => {
		const letters = Array.from(document.querySelectorAll('.word.active > letter'));
		const activeWord = letters.map((l) => l.textContent).join('');
		const wordsInput = document.querySelector('#wordsInput');
		if (wordsInput.value.includes(activeWord)) return;
		wordsInput.value += activeWord;
	}, 100);
})();

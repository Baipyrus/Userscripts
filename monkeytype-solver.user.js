// ==UserScript==
// @name         Monkeytype typer
// @namespace    https://eiflerstrom.de/
// @version      2026-02-13
// @description  Types all the characters shown in Monkeytype
// @author       IC3P3
// @match        https://monkeytype.com/
// @icon         https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fcdn-1.webcatalog.io%2Fcatalog%2Fmonkeytype%2Fmonkeytype-icon-filled.png&sp=1770987398Td33d3ec9642301f3ba897fcb24cc48676971273ff44d406426223688679cd8f2
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	const interv = setInterval(() => {
		const letters = [...document.querySelectorAll('.word.active > letter')];
		const activeWord = letters.map((e) => e.innerText).join('');
		const wordsInput = document.querySelector('#wordsInput');
		if (wordsInput.value.includes(activeWord)) return;
		wordsInput.value += activeWord;
	}, 100);
})();

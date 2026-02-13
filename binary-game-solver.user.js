// ==UserScript==
// @name         Cisco Binary Game Solver
// @namespace    https://baipyr.us/
// @version      2026-02-13
// @description  Solves all the tasks in Ciscos Binary game
// @author       Baipyrus
// @match        https://learningcontent.cisco.com/games/binary/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cisco.com
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	setInterval(() => {
		// Go to next level or start game button
		const advanceLevel = document.querySelector('div.modal-body > button');
		if (advanceLevel) {
			advanceLevel.click();
			return;
		}

		// Get first row (div element with class "bits")
		const firstRow = document.querySelector('div.bits');
		const bits = Array.from(firstRow.childNodes);

		if (firstRow.firstChild.disabled) {
			// Convert binary to decimal (because bit-flips are disabled)
			// First, combine all string values from the bit elements to a binary string
			const binaryValue = bits.reduce((accumulator, bit) => (accumulator += bit.textContent), '');
			// Convert binary value into decimal, split by digit for easier keypad input
			const decimalValue = parseInt(binaryValue, 2).toString().split('');

			// Open decimal keypad input
			document.querySelector('div.digits').click();

			// Get keypad elements for decimal input
			const keypadButtons = Array.from(document.querySelectorAll('button.button'));
			const [_, confirmButton] = keypadButtons.filter((btn) => btn.firstChild.tagName === 'IMG');
			const keypadNumbers = keypadButtons.filter((btn) => btn.firstChild.nodeName === '#text');

			// Enter decimal value in keypad and conform input
			decimalValue.forEach((digit) => keypadNumbers[Number(digit)].click());
			confirmButton.click();
		} else {
			// Convert decimal to binary (because keypad input is disabled)
			// First, disable all bits (by setting them to '0')
			bits.forEach((bit) => {
				if (bit.textContent === '0') return;
				bit.click();
			});

			// Get decimal value from element with class "digits"
			const decimalValue = parseInt(document.querySelector('div.digits').textContent);
			// Convert decimal value to binary, pad the string with zeroes on the left
			const binaryValue = decimalValue.toString(2).padLeft(8, '0').split('');

			// Flip all bits from input that are supposed to be ones
			binaryValue.forEach((bit, idx) => {
				if (bit === '0') return;
				bits[idx].click();
			});
		}
	}, 1500);
})();

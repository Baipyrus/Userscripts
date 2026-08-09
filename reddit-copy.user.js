// ==UserScript==
// @name         Better Reddit Share URL Copy
// @namespace    https://baipyr.us/
// @version      2026-08-09
// @description  Overwrites default share button behavior in favor of quicker copying and shorter URLs.
// @author       Baipyrus
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	addEventListener(
		'click',
		async (event) => {
			const path = event.composedPath();
			const isShareBtn =
				path.some(
					(element) =>
						element.tagName === 'BUTTON' && element.textContent?.toLowerCase().includes('share')
				) && !path.some((element) => element.tagName === 'PDP-BACK-BUTTON');

			// `<shreddit-post-share-button>` has been found
			if (!isShareBtn) return;
			event.stopImmediatePropagation();
			event.preventDefault();

			const { target } = event;
			const valid = ['shreddit-post', 'shreddit-comment'];

			// Go through each valid element type, try finding it,
			// copy a modified permalink if found, otherwise skip it
			for (const tagName of valid) {
				/** @type {(HTMLElement & {permalink: string})?} */
				const shreddit = target?.closest(tagName);

				if (!shreddit?.permalink) continue;
				const fxreddit = `https://reddit.com${shreddit.permalink}`;

				try {
					// Parse link with builtin URL constructor to verify format
					new URL(fxreddit);

					// Try copying modified link to clipboard
					navigator.clipboard.writeText(fxreddit);

					shreddit.closeShareMenu();
					break;
				} catch {}
			}
		},
		true
	);
})();

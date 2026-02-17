// ==UserScript==
// @name         Reddit Share URL Converter
// @namespace    https://baipyr.us/
// @version      2026-02-11
// @description  Converts the Reddit URL when sharing a post to rxddit.com.
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
			/** @type {(HTMLElement & {permalink: string})?} */
			const shredditPost = target?.closest('shreddit-post');

			if (!shredditPost?.permalink) return;
			const fxreddit = `https://rxddit.com${shredditPost.permalink}`;

			try {
				// Parse link with builtin URL constructor to verify format
				new URL(fxreddit);

				// Try copying modified link to clipboard
				navigator.clipboard.writeText(fxreddit);

				shredditPost.closeShareMenu();
			} catch {}
		},
		true
	);
})();

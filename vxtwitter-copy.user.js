// ==UserScript==
// @name         Twitter Share URL Converter
// @namespace    https://baipyr.us/
// @version      2026-02-11
// @description  Converts the Twitter URL when sharing a post to vxtwitter.com.
// @author       Baipyrus
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	const twitterMatchRegex = /(x\.com|twitter\.com)/i;

	addEventListener('copy', (/** @type {ClipboardEvent} */ event) => {
		const selection = (getSelection() ?? '').toString();
		if (!selection) return;

		try {
			const shareUrl = new URL(selection);
			if (!shareUrl.hostname.match(twitterMatchRegex)) return;
			event.preventDefault();
		} catch {
			return;
		}

		const betterTwitFix = selection.replace(twitterMatchRegex, 'vxtwitter.com');
		event.clipboardData.setData('text/plain', betterTwitFix);
	});
})();

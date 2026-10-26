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

	// Minimal tweakable behavior
	const ZOOM_FACTOR = 2;
	const ZOOM_MS = 100;
	const EMPTY = 0;
	const HALF = 0.5;

	// Consistent styling with the rest of the page
	const style = document.createElement('style');
	style.textContent = `
        #random-picker {
            font-family: "Archivo", Helvetica, Arial, sans-serif;
            max-width: calc(100vw - 32px);
            box-shadow: 0 6px 24px #0005;
            box-sizing: border-box;
            align-items: center;
            border-radius: 12px;
            background: #e5ebf4;
            position: fixed;
            flex-wrap: wrap;
            z-index: 99999;
            color: #171d2b;
            display: flex;
            padding: 14px;
            bottom: 24px;
            right: 24px;
            gap: 12px;
        }

        #random-picker .pick {
            font: 600 16px "Archivo", Helvetica, Arial, sans-serif;
            transition: background-color .1s ease;
            justify-content: center;
            box-sizing: border-box;
            display: inline-flex;
            align-items: center;
            background: #e65d0f;
            border-radius: 8px;
            min-height: 48px;
            appearance: none;
            padding: 0 24px;
            cursor: pointer;
            color: #fff;
            border: 0;
        }

        #random-picker .pick:hover,
        #random-picker .pick:focus {
            background: #ff7926;
        }

        #random-picker .pick:active {
            transform: translateY(1px);
        }

        #random-picker .pick:focus-visible {
            outline: 2px solid #171d2b;
            outline-offset: 3px;
        }

        #random-picker .result {
            text-transform: capitalize;
            font-weight: 600;
            font-size: 16px;
        }

        #random-picker small {
            max-width: 240px;
            margin-top: 4px;
            font-size: 12px;
            display: block;
        }

        a.hero-card {
            transition: opacity .25s ease, filter .25s ease;
        }

        body.picker-active a.hero-card:not(.center-card):not(.target-card) {
            opacity: .15 !important;
            filter: grayscale(80%);
        }

        a.hero-card.target-card {
            outline: 4px solid #ff7926;
            outline-offset: 4px;
            border-radius: 8px;
        }

        #picker-backdrop {
            animation: backdrop-in .1s ease both;
            background: rgba(10, 15, 25, .45);
            position: fixed;
            z-index: 99997;
            inset: 0;
        }

        a.hero-card.center-card {
            width: var(--zoom-width, min(280px, 65vw)) !important;
            box-shadow: 0 15px 80px #0009 !important;
            outline: 4px solid #ff7926 !important;
            transform: translate(-50%, -50%);
            visibility: visible !important;
            position: fixed !important;
            z-index: 99998 !important;
            display: block !important;
            bottom: auto !important;
            height: auto !important;
            filter: none !important;
            right: auto !important;
            will-change: transform;
            opacity: 1 !important;
            left: 50% !important;
            margin: 0 !important;
            pointer-events: none;
            top: 50% !important;
            outline-offset: 4px;
            background: #e5ebf4;
            border-radius: 8px;
            max-height: 88vh;
            cursor: default;
            overflow: auto;
        }

        .center-card blz-card {
            width: 100%;
        }

        @keyframes backdrop-in {
            from {
                opacity: 0;
            } to {
                opacity: 1;
            }
        }

        @keyframes lock-on {
            from {
                outline-offset: 18px;
                outline-color: transparent;
            } to {
                outline-offset: 4px;
                outline-color: #ff7926;
            }
        }

        @media (max-width: 600px) {
            #random-picker {
                bottom: 16px;
                right: 16px;
            }
        }`;
	document.head.append(style);

	// Widget in the bottom right corner
	const panel = document.createElement('aside');
	panel.id = 'random-picker';

	// RNG Button for the widget
	const button = document.createElement('button');
	button.textContent = 'Pick';
	button.className = 'pick';

	// Title => Resulting Hero name label
	const result = document.createElement('div');
	result.textContent = 'Pick a random hero';
	result.className = 'result';

	// Widget description
	const note = document.createElement('small');
	note.textContent = 'Picks random from current selection';

	// Group container for text next to RNG button
	const text = document.createElement('div');
	text.append(result, note);
	panel.append(button, text);
	document.body.append(panel);

	// Incremented on every close, so a pick that is still scrolling/waiting knows it was cancelled
	let runId = 0;
	const closeSelection = () => {
		runId++;

		document.body.classList.remove('picker-active');
		document.querySelector('.target-card')?.classList.remove('target-card');
		document.querySelectorAll('#picker-backdrop, .center-card').forEach((el) => el.remove());
	};

	// Add functionality for pressing the RNG hero button
	button.addEventListener('click', async () => {
		// Get only heroes from selected roles (marked as "shown" via HTML data)
		const heroes = document.querySelectorAll('.hero-card[show="show"]');
		if (heroes.length === EMPTY) return;

		// Pick random hero and determine name
		const card = heroes[Math.floor(Math.random() * heroes.length)];
		const name = card.querySelector('blz-content-block')?.textContent ?? card.id;
		result.textContent = name;

		// Replace selection process and animation, if not already done
		closeSelection();
		const run = runId;

		// Wait until 'scrolled' event marks animation finish
		if (card.getClientRects().length === EMPTY) return;
		const scrolled = new Promise((resolve) =>
			document.addEventListener('scrollend', resolve, { once: true })
		);
		card.scrollIntoView({ behavior: 'smooth', block: 'center' });
		await scrolled;

		// If another hero selection has been started, we can ignore the rest from here
		if (run !== runId) return;

		// Mark selection and animation start
		document.body.classList.add('picker-active');
		card.classList.add('target-card');

		const vh = document.documentElement.clientHeight;
		const vw = document.documentElement.clientWidth;
		const from = card.getBoundingClientRect();

		// Calculate zoomed size with a bare minimum in mind
		const minZoomWidthPX = 300;
		const targetW = Math.max(from.width * ZOOM_FACTOR, minZoomWidthPX);

		// Global background dimming using slightly transparent grey sheet
		const backdrop = document.createElement('div');
		backdrop.addEventListener('click', closeSelection);
		backdrop.id = 'picker-backdrop';

		// Move the outline to the zoomed copy, which preserves the original grid
		card.classList.remove('target-card');

		// Finally clone selected hero card and zoom into it
		const centeredCard = card.cloneNode(true);
		centeredCard.style.setProperty('--zoom-width', `${targetW}px`);
		centeredCard.classList.add('center-card');
		document.body.append(backdrop, centeredCard);

		// Start exactly on top of the grid card, then grow into the centre of the screen
		const dx = from.left + from.width * HALF - vw * HALF;
		const dy = from.top + from.height * HALF - vh * HALF;
		const startScale = from.width / targetW;

		centeredCard.animate(
			[
				{ transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${startScale})` },
				{ transform: 'translate(-50%, -50%) scale(1)' }
			],
			{ duration: ZOOM_MS, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' }
		);
	});

	// Additional handler for ESC key to close the selection and clear backdrop
	document.addEventListener('keydown', (event) => event.key === 'Escape' && closeSelection());
})();

// ==UserScript==
// @name         Cisco Binary Game Solver
// @namespace    https://eiflerstrom.de/
// @version      2026-02-13
// @description  Solves all the tasks in Ciscos Binary game
// @author       IC3P3
// @match        https://learningcontent.cisco.com/games/binary/index.html
// @icon         https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F027%2F075%2F812%2Fnon_2x%2Fcisco-logo-transparent-free-png.png&sp=1770987865T1b54a25a0117341c512866926bc6810387937a99fff149f0234e6ccc2752d5fd
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        const next = document.querySelector('div.modal-body>button');
        if (next) {
            next.click();
            return;
        }
        const row = document.querySelector('div.bits');
        const children = Array.from(row.childNodes);
        if (children[0].disabled) {
            const binary = children.reduce((acc, bit) => (acc += bit.textContent), '');
            const value = parseInt(binary, 2).toString().split('');
            document.querySelector('div.digits').click();
            const buttons = Array.from(document.querySelectorAll('button.button'));
            const confirm = buttons.filter(btn => btn.firstChild.tagName === "IMG")[1];
            const numbers = buttons.filter(btn => btn.firstChild.nodeName === "#text");
            value.forEach(digit =>
                numbers[Number(digit)].click()
            );
            confirm.click();
        } else {
            children.forEach(bit => {
                if (bit.textContent === '0') return;
                bit.click();
            });
            const value = parseInt(document.querySelector('div.digits').textContent);
            const binary = value.toString(2).padLeft(8, '0').split('');
            binary.forEach((bit, idx) => {
                if (bit === '0') return;
                children[idx].click();
            });
        }
    }, 1500);
})();

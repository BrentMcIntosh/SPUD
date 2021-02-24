'use strict';

import { Genre } from '/js/Genre.js';

document.addEventListener('click', event => {

    if (event.srcElement.nodeName === 'BUTTON') {

        let item = new Genre();

        item.route(event.srcElement);
    }
});
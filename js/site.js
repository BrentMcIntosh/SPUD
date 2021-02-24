'use strict';

import { Genre } from '/js/Genre.js';
import { Artist } from '/js/Artist.js';
import { Album } from '/js/Album.js';

document.addEventListener('click', event => {

    if (event.srcElement.nodeName === 'BUTTON') {

        if (event.srcElement.classList.contains('genre')) {
            let item = new Genre();
            item.route(event.srcElement);
        }
        else if (event.srcElement.classList.contains('artist')) {
            let item = new Artist();
            item.route(event.srcElement);
        }
        else if (event.srcElement.classList.contains('album')) {
            let item = new Album();
            item.route(event.srcElement);
        }
    }
});
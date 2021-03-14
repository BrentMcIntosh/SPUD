"use strict";

import { Genre } from "/js/genre.js";
import { Artist } from "/js/artist.js";
import { Album } from "/js/album.js";


function what(thing) {

    console.log(thing);
}

document.addEventListener("click", event => {

    if (event.srcElement.nodeName === "BUTTON" || event.srcElement.nodeName === "IMG" || event.srcElement.nodeName === "DIV") {

        if (event.srcElement.classList.contains("genre")) {
            let item = new Genre();

            

            item.route(event.srcElement);
        }
        else if (event.srcElement.classList.contains("artist")) {
            let item = new Artist();
            item.route(event.srcElement);
        }
        else if (event.srcElement.classList.contains("album")) {
            let item = new Album();

            what(item);

            item.route(event.srcElement);
        }
    }
});
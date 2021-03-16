"use strict";

import { Genre } from "/js/genre.js";
import { Artist } from "/js/artist.js";
import { Album } from "/js/album.js";

document.addEventListener("click", event => {

    if (event.srcElement.nodeName === "BUTTON" || event.srcElement.nodeName === "IMG" || event.srcElement.nodeName === "DIV") {

        if (event.srcElement.classList.contains("genre")) {
            new Genre().route(event.srcElement);
        }
        else if (event.srcElement.classList.contains("artist")) {
            Artist.route(event.srcElement);
        }
        else if (event.srcElement.classList.contains("album")) {
            new Album().route(event.srcElement);
        }
    }
});
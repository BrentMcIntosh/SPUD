﻿"use strict";

import { Crud } from "/js/crud.js";
import { Interpolator } from "/js/interpolator.js";

export class Artist {
    
    static route(element) {

        let action = element.id;

        if (action === "listArtists" || action === "cancel") {
            Crud.list("Artist");
        } else {

            let artist = Interpolator.dataToClass({ artistId: 0, name: "" }, element.dataset);

            if (action === "create" || element.classList.contains("edit")) {
                Crud.simplePage("/Views/Artist/update.html", artist, artist.artistId);
            } 
			else if (action === "remove") {
                Crud.simplePage("/Views/Artist/delete.html", artist, artist.artistId);
            } 
			else if (action === "save") {
                Crud.save("Artist", artist, artist.artistId);
            } 
			else if (action === "confirmDelete") {
                Crud.confirmDelete("Artist/" + artist.artistId, Crud.list, "Artist");
            }
        }
    }
}

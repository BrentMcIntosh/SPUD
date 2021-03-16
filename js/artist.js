"use strict";

import { Dom } from "/js/dom.js";
import { Http } from "/js/http.js";
import { Interpolator } from "/js/interpolator.js";

export class Artist {

    static list() {
        Http.get("/Views/Artists/list.html", listTemplate => {
            Http.get("api/Artists/", artistsJson => {
                Dom.list(listTemplate, artistsJson);
            });
        });
    }

    static update(artist) {
        Artist.simplePage("update", artist);
    }

    static remove(artist) {
        Artist.simplePage("delete", artist);
    }

    static simplePage(page, artist) {
        Http.get("/Views/Artists/" + page + ".html", template => {
            Dom.page(template, artist, !artist.artistId);
        });
    }

    static save(artist) {

        let data = Interpolator.docToJson(artist, document);

        if (artist.artistId) {
            Http.put("/api/Artists/" + artist.artistId, data, Artist.list);
        } else {
            Http.post("/api/Artists", data, Artist.list);
        }
    }

    static confirmDelete(artistId) {
        Http.delete("/api/Artists/" + artistId, Artist.list);
    }

    static route(element) {

        let action = element.id;

        if (action === "listArtists" || action === "cancel") {
            Artist.list();
        } else {

            let artist = Interpolator.dataToClass({ artistId: 0, name: "" }, element.dataset);

            if (action === "create" || element.classList.contains("edit")) {
                Artist.update(artist);
            } else if (action === "remove") {
                Artist.remove(artist);
            } else if (action === "save") {
                Artist.save(artist);
            } else if (action === "confirmDelete") {
                Artist.confirmDelete(artist.artistId);
            }
        }
    }
}
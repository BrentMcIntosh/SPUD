"use strict";

import { Dom } from "/js/dom.js";
import { Crud } from "/js/crud.js";
import { Http } from "/js/http.js";
import { Interpolator } from "/js/interpolator.js";

export class Album {

    static list() {
        Crud.list("Albums", ["albumArtUrl"]);
    }

    static update(album) {
        Http.get("/Views/Albums/update.html", template => {
            Http.get("api/Albums/" + album.albumId, json => {

                let albumEdit = JSON.parse(json);
                let album = albumEdit.album;
                let artists = albumEdit.artists;
                let genres = albumEdit.genres;

                template = Interpolator.interpolate(template, album);

                Dom.hide("main");
                Dom.setMain(template);

                Crud.setSelect(album.artistId, artists, "artistId");
                Crud.setSelect(album.genreId, genres, "genreId");

                if (!album.albumId) {
                    Dom.hide("remove");
                }

                Dom.show("main");
            });
        });
    }

    static save(album) {

        let data = Interpolator.docToJson(album, document);

        if (album.albumId) {
            Http.put("/api/Albums/" + album.albumId, data, Album.list);
        } else {
            Http.post("/api/Albums", data, Album.list);
        }
    }

    static confirmDelete(albumId) {
        Http.delete("/api/Albums/" + albumId, Album.list);
    }

    static route(element) {

        let action = element.id;

        if (action === "listAlbums" || action === "cancel") {
            Crud.list("Albums", ["albumArtUrl"]);
        } else {

            let album = {
                albumId: 0,
                title: "",
                genreId: 0,
                artistId: 0,
                title: "",
                price: 0,
                albumArtUrl: ""
            };

            album = Interpolator.dataToClass(album, element.dataset);

            if (action === "create" || element.classList.contains("edit")) {
                Album.update(album);
            } else if (action === "remove") {
                Crud.simplePage("/Views/Albums/delete.html", album, album.albumId);
            } else if (action === "save") {
                Album.save(album);
            } else if (action === "confirmDelete") {
                Album.confirmDelete(album.albumId);
            }
        }
    }
}

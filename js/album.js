"use strict";

import { Dom } from "/js/dom.js";
import { Http } from "/js/http.js";
import { Interpolator } from "/js/interpolator.js";

export class Album {

    static list() {
        Http.get("/Views/Albums/list.html", template => {
            Http.get("api/Albums/", json => {

                Dom.hide("main");
                Dom.setMain(template);

                let itemTemplate = Dom.getButtonTemplate();

                for (let item of JSON.parse(json)) {

                    let button = Interpolator.interpolate(itemTemplate, item);

                    button = button.replace(`src=""`, `src="` + item.albumArtUrl + `"`);

                    Dom.setMain(button, true);
                }

                Dom.show("main");
            });
        });
    }

    static update(album) {
        Album.simplePage("update", album);
    }

    static remove(album) {
        Album.simplePage("delete", album);
    }

    static simplePage(page, album) {
        Http.get("/Views/Albums/" + page + ".html", template => {
            Dom.page(template, album, !album.albumId);
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
            Album.list();
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
                Album.remove(album);
            } else if (action === "save") {
                Album.save(album);
            } else if (action === "confirmDelete") {
                Album.confirmDelete(album.albumId);
            }
        }
    }
}
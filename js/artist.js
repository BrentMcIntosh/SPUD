"use strict";

import { Dom } from "/js/dom.js";
import { Http } from "/js/http.js";
import { Interpolator } from "/js/interpolator.js";

export class Artist {

    list() {
        new Http().get("/Views/Artists/list.html", listTemplate => {

            new Http().get("api/Artists/", artistList => {

                let dom = new Dom();

                dom.hide("main");
                dom.setMain(listTemplate);

                let list = JSON.parse(artistList);
                let itemTemplate = dom.getListButton();

                for (let i = 0; i < list.length; i++) {
                    dom.createListButton(itemTemplate, list[i]);
                }

                dom.show("main");
            });
        });
    }

    update(artist) {
        this.simplePage("update", artist);
    }

    remove(artist) {
        this.simplePage("delete", artist);
    }

    simplePage(page, artist) {
        new Http().get("/Views/Artists/" + page + ".html", template => {

            let dom = new Dom();

            dom.hide("main");
            dom.setMain(new Interpolator().interpolate(template, artist));

            if (!artist.artistId) {
                dom.hide("remove");
            }

            dom.show("main");
        });
    }

    save(artist) {

        let data = new Interpolator().docToJson(artist, document);

        if (artist.artistId) {
            new Http().put("/api/Artists/" + artist.artistId, data, new Artist().list, "Artists");
        } else {
            new Http().post("/api/Artists", data, new Artist().list, "Artists");
        }
    }

    reallyDelete(artistId) {
        new Http().delete("/api/Artists/" + artistId, new Artist().list, "");
    }

    route(element) {

        if (element.id === "listArtists" || element.id === "cancel") {
            this.list();
        } else {
            let artist = new Interpolator().dataToClass({ artistId: 0, name: "" }, element.dataset);

            if (element.id === "create" || event.srcElement.classList.contains("edit")) {
                this.update(artist);
            } else if (element.id === "remove") {
                this.remove(artist);
            } else if (element.id === "save") {
                this.save(artist);
            } else if (element.id === "reallyDelete") {
                this.reallyDelete(artist.artistId);
            }
        }
    }
}

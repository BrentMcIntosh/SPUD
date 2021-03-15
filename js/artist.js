"use strict";

import { Interpolator } from "/js/interpolator.js";
import { Http } from "/js/http.js";

export class Artist {

    list() {
        new Http().get("/Views/Artists/List.html", listTemplate => {

            new Http().get("api/Artists/", artistList => {

                let div = document.createElement("div");

                div.innerHTML = listTemplate;

                let list = JSON.parse(artistList);

                let template = div.getElementsByTagName("button")[1].outerHTML;

                div.getElementsByTagName("button")[1].remove();

                for (let i = 0; i < list.length; i++) {

                    let item = list[i];

                    let button = new Interpolator().interpolate(template, item);

                    div.innerHTML += button;
                }

                document.getElementById("main").innerHTML = div.innerHTML;
            });
        });
    }

    update(artist) {
        this.simplePage("Update", artist);
    }

    remove(artist) {
        this.simplePage("Delete", artist);
    }

    simplePage(page, artist) {
        new Http().get("/Views/Artists/" + page + ".html", template => {
            document.getElementById("main").style.display = "none";

            document.getElementById("main").innerHTML = new Interpolator().interpolate(template, artist);

            if (artist.artistId === "0") {
                document.getElementById("remove").style.display = "none";
            }

            document.getElementById("main").style.display = "block";
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

        if (element.innerText === "ARTISTS" || element.id === "cancel") {
            this.list();
        } else {
            let data = element.dataset;

            var artist = {
                artistId: 0,
                name: ""
            };

            artist = new Interpolator().dataToClass(artist, data);

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


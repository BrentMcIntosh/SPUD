"use strict";

import { Interpolator } from "/js/interpolator.js";
import { Http } from "/js/http.js";

export class Artist {

    list() {
        new Http().get("/Views/Artists/List.html", new Artist().getList, "");
    }

    update(artist) {
        this.simplePage("Update", artist);
    }

    remove(artist) {
        this.simplePage("Delete", artist);
    }

    getList(template) {
        new Http().get("api/Artists/", new Artist().combineListAndTemplate, template);
    }

    combineListAndTemplate(artistList, listHtml) {

        let div = document.createElement("div");

        div.innerHTML = listHtml;

        let list = JSON.parse(artistList);

        let template = div.getElementsByTagName("button")[1].outerHTML;

        div.getElementsByTagName("button")[1].remove();

        for (let i = 0; i < list.length; i++) {

            let item = list[i];

            let interpol = new Interpolator();

            let button = interpol.interpolate(template, item);

            div.innerHTML += button;
        }

        document.getElementById("main").innerHTML = div.innerHTML;
    }

    showPage(template, artist) {
        document.getElementById("main").style.display = "none";

        let interpol = new Interpolator();

        document.getElementById("main").innerHTML = interpol.interpolate(template, artist);

        if (artist.artistId === "0") {
            document.getElementById("remove").style.display = "none";
        }

        document.getElementById("main").style.display = "block";
    }

    simplePage(page, artist) {
        new Http().get("/Views/Artists/" + page + ".html", this.showPage, artist);
    }

    save(artist) {

        let interpol = new Interpolator();
        let data = interpol.docToJson(artist, document);
        let inner = new Artist();
        let http = new Http();

        if (artist.artistId) {
            http.put("/api/Artists/" + artist.artistId, data, inner.list, "Artists");
        } else {
            http.post("/api/Artists", data, inner.list, "Artists");
        }
    }

    reallyDelete(artistId) {
        new Http().delete("/api/Artists/" + artistId, this.list, "");
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

            let interpol = new Interpolator();

            artist = interpol.dataToClass(artist, data);

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
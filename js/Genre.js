"use strict";

import { Interpolator } from "/js/interpolator.js";
import { Http } from "/js/http.js";

export class Genre {

    list() {
        new Http().get("/Views/Genres/List.html", new Genre().getList, "");
    }

    update(genre) {
        this.simplePage("Update", genre);
    }

    remove(genre) {
        this.simplePage("Delete", genre);
    }

    getList(template) {
        new Http().get("api/Genres", new Genre().combineListAndTemplate, template);
    }

    showPage(template, genre) {

        document.getElementById("main").style.display = "none";
        document.getElementById("main").innerHTML = new Interpolator().interpolate(template, genre);

        if (genre.genreId === "0") {
            document.getElementById("remove").style.display = "none";
        }

        document.getElementById("main").style.display = "block";
    }

    combineListAndTemplate(genreList, listHtml) {

        let div = document.createElement("div");

        div.innerHTML = listHtml;

        let list = JSON.parse(genreList);

        let template = div.getElementsByTagName("button")[1].outerHTML;

        div.getElementsByTagName("button")[1].remove();

        for (let i = 0; i < list.length; i++) {

            let item = list[i];

            let button = new Interpolator().interpolate(template, item);

            div.innerHTML += button;
        }

        document.getElementById("main").innerHTML = div.innerHTML;
    }

    simplePage(page, genre) {
        new Http().get("/Views/Genres/" + page + ".html", new Genre().showPage, genre);
    }

    save(genre) {

        let interpol = new Interpolator();
        let data = interpol.docToJson(genre, document);
        let inner = new Genre();
        let http = new Http();

        if (genre.genreId) {
            http.put("/api/Genres/" + genre.genreId, data, inner.list, "Genres");
        } else {
            http.post("/api/Genres", data, inner.list, "Genres");
        }
    }

    reallyDelete(genreId) {
        new Http().delete("/api/Genres/" + genreId, new Genre().list, "");
    }

    route(element) {

        if (element.innerText === "GENRES" || element.id === "cancel") {
            this.list();
        } else {
            let data = element.dataset;

            var genre = {
                genreId: 0,
                name: "",
                description: ""
            };

            let interpol = new Interpolator();

            genre = interpol.dataToClass(genre, data);

            if (element.id === "create" || event.srcElement.classList.contains("edit")) {
                this.update(genre);
            } else if (element.id === "remove") {
                this.remove(genre);
            } else if (element.id === "save") {
                this.save(genre);
            } else if (element.id === "reallyDelete") {
                this.reallyDelete(genre.genreId);
            }
        }
    }
}
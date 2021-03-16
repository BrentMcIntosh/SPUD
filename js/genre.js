"use strict";

import { Dom } from "/js/dom.js";
import { Http } from "/js/http.js";
import { Interpolator } from "/js/interpolator.js";

export class Genre {

    static list() {
        Http.get("/Views/Genres/list.html", listTemplate => {
            Http.get("api/Genres/", genresJson => {
                Dom.list(listTemplate, genresJson);
            });
        });
    }

    static update(genre) {
        Genre.simplePage("update", genre);
    }

    static remove(genre) {
        Genre.simplePage("delete", genre);
    }

    static simplePage(page, genre) {
        Http.get("/Views/Genres/" + page + ".html", template => {
            Dom.page(template, genre, !genre.genreId);
        });
    }

    static save(genre) {

        let data = Interpolator.docToJson(genre, document);

        if (genre.genreId) {
            Http.put("/api/Genres/" + genre.genreId, data, Genre.list);
        } else {
            Http.post("/api/Genres", data, Genre.list);
        }
    }

    static confirmDelete(genreId) {
        Http.delete("/api/Genres/" + genreId, Genre.list);
    }

    static route(element) {

        let action = element.id;

        if (action === "listGenres" || action === "cancel") {
            Genre.list();
        } else {

            let genre = Interpolator.dataToClass({ genreId: 0, name: "", description: "" }, element.dataset);

            if (action === "create" || element.classList.contains("edit")) {
                Genre.update(genre);
            } else if (action === "remove") {
                Genre.remove(genre);
            } else if (action === "save") {
                Genre.save(genre);
            } else if (action === "confirmDelete") {
                Genre.confirmDelete(genre.genreId);
            }
        }
    }
}
"use strict";

import { Crud } from "/js/crud.js";
import { Interpolator } from "/js/interpolator.js";

export class Genre {
    
    static route(element) {

        let action = element.id;

        if (action === "listGenres" || action === "cancel") {
            Crud.list("Genres");
        } else {

            let genre = Interpolator.dataToClass({ genreId: 0, name: "", description: "" }, element.dataset);

            if (action === "create" || element.classList.contains("edit")) {
                Crud.simplePage("/Views/Genres/update.html", genre, genre.genreId);
            } else if (action === "remove") {
                Crud.simplePage("/Views/Genres/delete.html", genre, genre.genreId);
            } else if (action === "save") {
                Crud.save("Genres", genre, genre.genreId);
            } else if (action === "confirmDelete") {
                Crud.confirmDelete("/api/Genres/" + genre.genreId, Crud.list, "Genres");
            }
        }
    }
}

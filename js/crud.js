"use strict";

import { Dom } from "/js/dom.js";
import { Http } from "/js/http.js";
import { Interpolator } from "/js/interpolator.js";

export class Crud {

    static list(path) {
        Http.get("/Views/" + path + "/list.html", listTemplate => {
            Http.get("api/" + path + "/", artistsJson => {
                Dom.list(listTemplate, artistsJson);
            });
        });
    }

    static simplePage(url, item, id) {
        Http.get(url, template => {
            Dom.page(template, item, !id);
        });
    }

    static save(path, item, id) {

        let data = Interpolator.docToJson(item, document);

        if (id) {
            Http.put("/api/" + path + "/" + id, data, Crud.list, path);
        } else {
            Http.post("/api/" + path, data, Crud.list, path);
        }
    }

    static confirmDelete(url, callback, callbackArg) {
        Http.delete(url, callback, callbackArg);
    }
}

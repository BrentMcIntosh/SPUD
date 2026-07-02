"use strict";

import { Dom } from "/js/dom.js";
import { Http } from "/js/http.js";
import { Interpolator } from "/js/interpolator.js";

export class Crud {
	
	static apiUrl = "http://localhost:7102/api/"

    static list(path, images) {
        Http.get("/Views/" + path + "/list.html", template => {
            Http.getJson(path, json => {
                Dom.list(template, json, images);
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
            Http.put(path, id, data, Crud.list);
        } else {
            Http.post(path, data, Crud.list);
        }
    }

    static confirmDelete(url, callback, callbackArg) {
        Http.delete(Crud.apiUrl + url, callback, callbackArg);
    }

    static setSelect(id, items, idType) {

        let select = document.createElement("select");

        if (id === 0) {
            select.appendChild(document.createElement("option"));
        }

        for (let i = 0; i < items.length; i++) {

            let option = document.createElement("option");

            let item = items[i];

            option.value = item[idType];
            option.text = item.name;

            select.appendChild(option);
        }

        let text = select.innerHTML;
        let replaceText = `<option value="` + id + `">`;
        let replaceWith = `<option value="` + id + `" selected>`;

        Dom.setHtml(idType, text.replace(replaceText, replaceWith));
    }
}

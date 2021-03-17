"use strict";

import { Interpolator } from "/js/interpolator.js";

export class Dom {

    static hide(id) {
        document.getElementById(id).style.display = "none";
    }

    static show(id) {
        document.getElementById(id).style.display = "block";
    }

    static setMain(html, append) {

        if (append) {
            document.getElementById("main").innerHTML += html;
        }
        else {
            document.getElementById("main").innerHTML = html;
        }
    }

    static getButtonTemplate() {

        let listButton = document.getElementById("listButton");

        let html = listButton.outerHTML;

        listButton.remove();

        return html.replace(`id="listButton" `, "");
    }
    
    static createListButton(template, data) {

        let button = Interpolator.interpolate(template, data);

        Dom.setMain(button, true);
    }

    static list(template, json) {

        Dom.hide("main");
        Dom.setMain(template);

        let itemTemplate = Dom.getButtonTemplate();

        for (let item of JSON.parse(json)) {
            Dom.createListButton(itemTemplate, item);
        }

        Dom.show("main");
    }


    static page(template, data, hideRemove) {

        Dom.hide("main");
        Dom.setMain(Interpolator.interpolate(template, data));

        if (hideRemove) {
            Dom.hide("remove");
        }

        Dom.show("main");
    }
}

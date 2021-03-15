"use strict";

import { Interpolator } from "/js/interpolator.js";

export class Dom {

    hide(id) {
        document.getElementById(id).style.display = "none";
    }

    show(id) {
        document.getElementById(id).style.display = "block";
    }

    setMain(html, append) {

        if (append) {
            document.getElementById("main").innerHTML += html;
        }
        else {
            document.getElementById("main").innerHTML = html;
        }
    }

    getListButton() {

        let listButton = document.getElementById("listButton");

        let html = listButton.outerHTML;

        listButton.remove();

        return html;
    }
    
    createListButton(itemTemplate, item) {
        let buttonHtml = new Interpolator().interpolate(itemTemplate, item);

        buttonHtml = buttonHtml.replace("listButton", "artist" + item.artistId);

        this.setMain(buttonHtml, true);
    }
}
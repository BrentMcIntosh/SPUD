"use strict";

import { Interpolator } from "/js/Interpolator.js";

export class Artist {

    replace(page) {

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let div = document.createElement("div");

                div.innerHTML = this.responseText;

                let jsonRequest = new XMLHttpRequest();

                jsonRequest.onreadystatechange = function () {

                    if (this.readyState == 4 && this.status == 200) {

                        let list = JSON.parse(this.responseText);

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
                };

                jsonRequest.open("GET", "/api/" + page, true);
                jsonRequest.send();
            }
        };

        xhttp.open("GET", "/Views/" + page + "/List.html", true);
        xhttp.send();
    }

    update(artist) {
        this.simplePage("Update", artist);
    }

    remove(artist) {
        this.simplePage("Delete", artist);
    }

    simplePage(page, artist) {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                document.getElementById("main").style.display = "none";

                let interpol = new Interpolator();

                document.getElementById("main").innerHTML = interpol.interpolate(this.responseText, artist);

                if (artist.artistId === "0") {
                    document.getElementById("remove").style.display = "none";
                }

                document.getElementById("main").style.display = "block";
            }
        };

        xhttp.open("GET", "/Views/Artists/" + page + ".html", true);
        xhttp.send();
    }

    save(artist) {

        let xhttp = new XMLHttpRequest();
        let interpol = new Interpolator();
        let data = interpol.docToJson(artist, document);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {

                let inner = new Artist();

                inner.replace("Artists");
            }
        };

        if (artist.artistId) {
            xhttp.open("PUT", "/api/Artists/" + artist.artistId, true);
        } else {
            xhttp.open("POST", "/api/Artists", true);
        }

        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(data);
    }

    reallyDelete(artistId) {

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {

                let inner = new Artist();

                inner.replace("Artists");
            }
        };

        xhttp.open("DELETE", "/api/Artists/" + artistId, true);
        xhttp.send();
    }

    route(element) {

        if (element.innerText === "ARTISTS" || element.id === "cancel") {
            this.replace("Artists");
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
"use strict";

import { Interpolator } from "/js/interpolator.js";
import { Http } from "/js/http.js";

export class Album {

    list() {
        new Http().get("/Views/Albums/List.html", new Album().getList, "");
    }

    update(albumId) {
        new Http().get("/Views/Albums/Update.html", this.getData, albumId);
    }

    remove(album) {
        new Http().get("/Views/Albums/Delete.html", this.showPage, album);
    }

    getData(template, albumId) {
        new Http().get("api/Albums/" + albumId, new Album().combineDataAndTemplate, template);
    }

    getList(template) {
        new Http().get("api/Albums/", new Album().combineListAndTemplate, template);
    }

    combineDataAndTemplate(data, template) {

        let div = document.createElement("div");

        div.innerHTML = template;

        let albumEdit = JSON.parse(data);
        let album = albumEdit.album;
        let artists = albumEdit.artists;
        let genres = albumEdit.genres;
        let inner = new Album();
        let interpol = new Interpolator();

        div.innerHTML = interpol.interpolate(div.innerHTML, album);

        document.getElementById("main").style.display = "none";

        document.getElementById("main").innerHTML = div.innerHTML;

        document.getElementById("artistId").innerHTML = inner.setSelect(album.artistId, artists, "artistId");

        document.getElementById("genreId").innerHTML = inner.setSelect(album.genreId, genres, "genreId");

        if (album.albumId === 0) {
            document.getElementById("remove").style.display = "none";
        }

        document.getElementById("main").style.display = "block";
    }

    combineListAndTemplate(albumList, listHtml) {
        let list = JSON.parse(albumList);

        let div = document.createElement("div");

        div.innerHTML = listHtml;

        let template = div.getElementsByClassName("container")[0].outerHTML;

        div.getElementsByClassName("container")[0].remove();

        for (let i = 0; i < list.length; i++) {

            let item = list[i];

            let albumDiv = document.createElement("div");

            var interpol = new Interpolator();

            albumDiv.innerHTML = interpol.interpolate(template, item);

            albumDiv.getElementsByClassName("image")[0].src = item.albumArtUrl;

            div.innerHTML += albumDiv.innerHTML;
        }

        document.getElementById("main").innerHTML = div.innerHTML;
    }

    setSelect(id, items, idType) {

        var select = document.createElement("select");

        if (id === 0) {
            select.appendChild(document.createElement("option"));
        }

        for (var i = 0; i < items.length; i++) {

            var option = document.createElement("option");

            var item = items[i];

            option.value = item[idType];
            option.text = item.name;

            select.appendChild(option);
        }

        if (id === 0) {
            return select.innerHTML;
        }

        var text = select.innerHTML;

        var replaceText = "<option value='" + id + "'>";
        var replaceWith = "<option value='" + id + "' selected>";

        return text.replace(replaceText, replaceWith);
    }

    showPage(template, data) {
        document.getElementById("main").innerHTML = new Interpolator().interpolate(template, data);

        if (albumId === 0) {
            document.getElementById("remove").style.display = "none";
        }
    }

    save(album) {
        let interpol = new Interpolator();
        let data = interpol.docToJson(album, document);
        let http = new Http();

        if (album.albumId) {
            http.put("/api/Albums/" + album.albumId, data, this.list, "");
        } else {
            http.post("/api/Albums", data, this.list, "");
        }
    }

    reallyDelete(albumId) {
        new Http().delete("/api/Albums/" + albumId, this.list, "");
    }

    route(element) {

        if (element.id === "listAlbums" || element.id === "Cancel") {
            this.list();
        } else {
            let data = element.dataset;

            var album = {
                albumId: 0,
                title: "",
                genreId: 0,
                artistId: 0,
                title: "",
                price: 0,
                albumArtUrl: ""
            };

            album = new Interpolator().dataToClass(album, data);

            if (element.id === "create" || event.srcElement.classList.contains("edit")) {
                this.update(album.albumId);
            } else if (element.id === "remove") {
                this.remove(album);
            } else if (element.id === "save") {
                this.save(album);
            } else if (element.id === "reallyDelete") {
                this.reallyDelete(album.albumId);
            }
        }
    }
}


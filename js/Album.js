'use strict';

import { Interpolator } from '/js/Interpolator.js';

export class Album {

    replace(page) {

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let listHtml = this.responseText;

                let jsonRequest = new XMLHttpRequest();

                jsonRequest.onreadystatechange = function () {

                    if (this.readyState == 4 && this.status == 200) {

                        let list = JSON.parse(this.responseText);

                        let div = document.createElement('div');

                        div.innerHTML = listHtml;

                        let template = div.getElementsByClassName("container")[0].outerHTML;

                        div.getElementsByClassName("container")[0].remove();

                        for (let i = 0; i < list.length; i++) {

                            let item = list[i];

                            let albumDiv = document.createElement('div');

                            var interpol = new Interpolator();

                            albumDiv.innerHTML = interpol.interpolate(template, item);

                            albumDiv.getElementsByClassName("image")[0].src = item.albumArtUrl;

                            div.innerHTML += albumDiv.innerHTML;
                        }

                        document.getElementById('main').innerHTML = div.innerHTML;
                    }
                };

                jsonRequest.open('GET', '/api/' + page, true);
                jsonRequest.send();
            }
        };

        xhttp.open('GET', '/Views/' + page + '/List.html', true);
        xhttp.send();
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

        var replaceText = '<option value="' + id + '">';
        var replaceWith = '<option value="' + id + '" selected>';

        return text.replace(replaceText, replaceWith);
    }

    update(albumId) {

        let xhttp = new XMLHttpRequest();

        if (!albumId) {
            albumId = 0;
        }

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let div = document.createElement('div');

                div.innerHTML = this.responseText;

                let jsonRequest = new XMLHttpRequest();

                jsonRequest.onreadystatechange = function () {

                    if (this.readyState == 4 && this.status == 200) {

                        let albumEdit = JSON.parse(this.responseText);
                        let album = albumEdit.album;
                        let artists = albumEdit.artists;
                        let genres = albumEdit.genres;
                        let inner = new Album();
                        let interpol = new Interpolator();

                        div.innerHTML = interpol.interpolate(div.innerHTML, album);

                        document.getElementById('main').style.display = "none";

                        document.getElementById('main').innerHTML = div.innerHTML;

                        document.getElementById("artistId").innerHTML = inner.setSelect(album.artistId, artists, "artistId");

                        document.getElementById("genreId").innerHTML = inner.setSelect(album.genreId, genres, "genreId");

                        if (albumId === 0) {
                            document.getElementById('remove').style.display = "none";
                        }

                        document.getElementById('main').style.display = "block";
                    }
                };

                jsonRequest.open('GET', 'api/Albums/' + albumId, true);
                jsonRequest.send();
            }
        };

        xhttp.open('GET', '/Views/Albums/Update.html', true);
        xhttp.send();
    }

    remove(albumId, title, price, albumArtUrl) {
        this.simplePage('Delete', albumId, title, price, albumArtUrl);
    }

    simplePage(page, albumId, title, price, albumArtUrl) {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var interpol = new Interpolator();

                var album = {
                    albumId: albumId,
                    title: title,
                    price: price,
                    albumArtUrl: albumArtUrl
                };

                document.getElementById('main').innerHTML = interpol.interpolate(this.responseText, album);

                if (albumId === 0) {
                    document.getElementById('remove').style.display = "none";
                }
            }
        };

        xhttp.open('GET', '/Views/Albums/' + page + '.html', true);
        xhttp.send();
    }

    save(albumId) {

        var xhttp = new XMLHttpRequest();

        var album = {
            albumId: albumId || 0,
            title: "",
            genreId: 0,
            artistId: 0,
            title: "",
            price: 0,
            albumArtUrl: ""
        };

        let interpol = new Interpolator();

        let data = interpol.docToJson(album, document);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {

                let inner = new Album();

                inner.replace('Albums');
            }
        };

        if (albumId) {
            xhttp.open('PUT', '/api/Albums/' + albumId, true);
        } else {
            xhttp.open('POST', '/api/Albums', true);
        }

        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(data);
    }

    reallyDelete(albumId) {

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {

                let inner = new Album();

                inner.replace('Albums');
            }
        };

        xhttp.open('DELETE', '/api/Albums/' + albumId, true);
        xhttp.send();
    }

    route(element) {

        if (element.id === 'listAlbums' || element.id === 'Cancel') {
            this.replace('Albums');
        } else {
            let data = element.dataset;

            if (element.id === 'create' || event.srcElement.classList.contains('edit')) {
                this.update(data['albumid']);
            } else if (element.id === 'remove') {
                this.remove(data['albumid'], data['title'], data['price'], data['albumarturl']);
            } else if (element.id === 'save') {
                this.save(data['albumid']);
            } else if (element.id === 'reallyDelete') {
                this.reallyDelete(data['albumid']);
            }
        }
    }
}
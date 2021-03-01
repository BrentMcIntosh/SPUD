'use strict';

export class Album {

    interpolate(template, albumId, title, price, albumArtUrl, genreId, artistId) {
        template = template.replace(/{{albumId}}/g, albumId);
        template = template.replace(/{{title}}/g, title);
        template = template.replace(/{{price}}/g, price);
        template = template.replace(/{{albumArtUrl}}/g, albumArtUrl);

        if (genreId) {
            template = template.replace(/{{genreId}}/g, genreId);
        }

        if (artistId) {
            template = template.replace(/{{artistId}}/g, artistId);
        }

        return template;
    }

    replace(page) {

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let div = document.createElement('div');

                div.innerHTML = this.responseText;

                let jsonRequest = new XMLHttpRequest();

                jsonRequest.onreadystatechange = function () {

                    if (this.readyState == 4 && this.status == 200) {

                        let list = JSON.parse(this.responseText);

                        let table = div.getElementsByTagName('table')[0];

                        let template = table.getElementsByTagName('tr')[1].innerHTML;

                        for (let i = 0; i < list.length; i++) {

                            let item = list[i];

                            let inner = new Album();

                            let row = inner.interpolate(template, item.albumId, item.title, item.price, item.albumArtUrl);

                            if (i === 0) {
                                table.getElementsByTagName('tr')[1].innerHTML = row;
                            } else {
                                let child = document.createElement('tr');

                                child.innerHTML = row;

                                table.appendChild(child);
                            }
                        }

                        document.getElementsByTagName('main')[0].innerHTML = div.innerHTML;
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

                        var inner = new Album();

                        div.innerHTML = inner.interpolate(div.innerHTML, album.albumId, album.title, album.price > 0 ? album.price : "", album.albumArtUrl);

                        document.getElementsByTagName('main')[0].style.display = "none";

                        document.getElementsByTagName('main')[0].innerHTML = div.innerHTML;

                        document.getElementById("artistId").innerHTML = inner.setSelect(album.artistId, artists, "artistId");

                        document.getElementById("genreId").innerHTML = inner.setSelect(album.genreId, genres, "genreId");

                        document.getElementsByTagName('main')[0].style.display = "block";
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

                let inner = new Album();

                document.getElementsByTagName('main')[0].innerHTML = inner.interpolate(this.responseText, albumId, title, price, albumArtUrl);
            }
        };

        xhttp.open('GET', '/Views/Albums/' + page + '.html', true);
        xhttp.send();
    }

    save(albumId) {

        var xhttp = new XMLHttpRequest();

        var data = '{ "albumId": {{albumId}}, "title": "{{title}}", "genreId": "{{genreId}}", "artistId": "{{artistId}}", "price": "{{price}}", "albumArtUrl": "{{albumArtUrl}}" }';

        var title = document.getElementById("title").value;
        var genreId = document.getElementById("genreId").value;
        var artistId = document.getElementById("artistId").value;
        var title = document.getElementById("title").value;
        var price = document.getElementById("price").value;
        var albumArtUrl = document.getElementById("albumArtUrl").value;

        data = this.interpolate(data, albumId, title, price, albumArtUrl, genreId, artistId);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {

                let inner = new Album();

                inner.replace('Albums');
            }
        };

        if (albumId === '0') {
            xhttp.open('POST', '/api/Albums', true);
        } else {
            xhttp.open('PUT', '/api/Albums/' + albumId, true);
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

        if (element.innerText === 'ALBUMS' || element.title === 'Cancel') {
            this.replace('Albums');
        } else {
            let data = element.dataset;

            if (element.title === 'Create New Album' || element.title === 'Edit') {
                this.update(data['albumid']);
            } else if (element.title === 'Remove') {
                this.remove(data['albumid'], data['title'], data['price'], data['albumarturl']);
            } else if (element.title === 'Save') {
                this.save(data['albumid']);
            } else if (element.title === 'Really Delete') {
                this.reallyDelete(data['albumid']);
            }
        }
    }
}
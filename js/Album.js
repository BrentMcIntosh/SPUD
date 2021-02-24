'use strict';

export class Album {

    interpolate(template, albumId, title, price, albumArtUrl) {
        template = template.replace(/{{albumId}}/g, albumId);
        template = template.replace(/{{title}}/g, title);
        template = template.replace(/{{price}}/g, price);
        template = template.replace(/{{albumArtUrl}}/g, albumArtUrl);

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

    update(albumId, title, price, albumArtUrl) {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let div = document.createElement('div');

                div.innerHTML = this.responseText;

                let jsonRequest = new XMLHttpRequest();

                jsonRequest.onreadystatechange = function () {

                    if (this.readyState == 4 && this.status == 200) {

                        let albumEdit = JSON.parse(this.responseText);

                        //let table = div.getElementsByTagName('table')[0];

                        //let template = table.getElementsByTagName('tr')[1].innerHTML;

                        //for (let i = 0; i < list.length; i++) {

                        //    let item = list[i];

                        //    let inner = new Album();

                        //    let row = inner.interpolate(template, item.albumId, item.title, item.price, item.albumArtUrl);

                        //    if (i === 0) {
                        //        table.getElementsByTagName('tr')[1].innerHTML = row;
                        //    } else {
                        //        let child = document.createElement('tr');

                        //        child.innerHTML = row;

                        //        table.appendChild(child);
                        //    }
                        //}

                        //document.getElementsByTagName('main')[0].innerHTML = div.innerHTML;
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

        var data = '{ "albumId": {{albumId}}, "title": "{{title}}", "price": "{{price}}", "albumArtUrl": "{{albumArtUrl}}" }';

        var title = document.getElementById("title").value;
        var price = document.getElementById("price").value;
        var albumArtUrl = document.getElementById("albumArtUrl").value;

        data = this.interpolate(data, albumId, title, price, albumArtUrl);

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
                this.update(data['albumid'], data['title'], data['price'], data['albumarturl']);
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
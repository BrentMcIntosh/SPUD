'use strict';

export class Artist {

    interpolate(template, artistId, name) {
        template = template.replace(/{{artistId}}/g, artistId);
        template = template.replace(/{{name}}/g, name);

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

                            let inner = new Artist();

                            let row = inner.interpolate(template, item.artistId, item.name);

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

    update(artistId, name) {
        this.simplePage('Update', artistId, name);
    }

    remove(artistId, name) {
        this.simplePage('Delete', artistId, name);
    }

    simplePage(page, artistId, name) {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let inner = new Artist();

                document.getElementsByTagName('main')[0].innerHTML = inner.interpolate(this.responseText, artistId, name);
            }
        };

        xhttp.open('GET', '/Views/Artists/' + page + '.html', true);
        xhttp.send();
    }

    save(artistId) {

        var xhttp = new XMLHttpRequest();

        var data = '{ "artistId": {{artistId}}, "name": "{{name}}" }';

        var name = document.getElementById("name").value;

        data = this.interpolate(data, artistId, name);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {

                let inner = new Artist();

                inner.replace('Artists');
            }
        };

        if (artistId === '0') {
            xhttp.open('POST', '/api/Artists', true);
        } else {
            xhttp.open('PUT', '/api/Artists/' + artistId, true);
        }

        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(data);
    }

    reallyDelete(artistId) {

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {

                let inner = new Artist();

                inner.replace('Artists');
            }
        };

        xhttp.open('DELETE', '/api/Artists/' + artistId, true);
        xhttp.send();
    }

    route(element) {

        if (element.innerText === 'ARTISTS' || element.title === 'Cancel') {
            this.replace('Artists');
        } else {
            let data = element.dataset;

            if (element.title === 'Create New Artist' || element.title === 'Edit') {
                this.update(data['artistid'], data['name']);
            } else if (element.title === 'Remove') {
                this.remove(data['artistid'], data['name']);
            } else if (element.title === 'Save') {
                this.save(data['artistid']);
            } else if (element.title === 'Really Delete') {
                this.reallyDelete(data['artistid']);
            }
        }
    }
}
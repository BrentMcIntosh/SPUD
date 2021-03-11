'use strict';

import { Interpolator } from '/js/Interpolator.js';

export class Genre {

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

                        let template = div.getElementsByTagName('button')[1].outerHTML;

                        div.getElementsByTagName('button')[1].remove();

                        let interpol = new Interpolator();

                        for (let i = 0; i < list.length; i++) {

                            let item = list[i];

                            let button = interpol.interpolate(template, item);

                            div.innerHTML += button;
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

    update(genre) {
        this.simplePage('Update', genre);
    }

    remove(genre) {
        this.simplePage('Delete', genre);
    }

    simplePage(page, genre) {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let interpol = new Interpolator();

                document.getElementById('main').style.display = "none";
                document.getElementById('main').innerHTML = interpol.interpolate(this.responseText, genre);

                if (genre.genreId === "0") {
                    document.getElementById('remove').style.display = "none";
                }

                document.getElementById('main').style.display = "block";
            }
        };

        xhttp.open('GET', '/Views/Genres/' + page + '.html', true);
        xhttp.send();
    }

    save(genre) {

        let xhttp = new XMLHttpRequest();
        let interpol = new Interpolator();
        let data = interpol.docToJson(genre, document);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {

                let inner = new Genre();

                inner.replace('Genres');
            }
        };

        if (genre.genreId === 0) {
            xhttp.open('POST', '/api/Genres', true);
        } else {
            xhttp.open('PUT', '/api/Genres/' + genre.genreId, true);
        }

        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(data);
    }

    reallyDelete(genreId) {

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {

                let inner = new Genre();

                inner.replace('Genres');
            }
        };

        xhttp.open('DELETE', '/api/Genres/' + genreId, true);
        xhttp.send();
    }

    route(element) {

        if (element.innerText === 'GENRES' || element.id === 'cancel') {
            this.replace('Genres');
        } else {
            let data = element.dataset;

            var genre = {
                genreId: 0,
                name: "",
                description: ""
            };

            let interpol = new Interpolator();

            genre = interpol.dataToClass(genre, data);

            if (element.id === 'create' || event.srcElement.classList.contains('edit')) {
                this.update(genre);
            } else if (element.id === 'remove') {
                this.remove(genre);
            } else if (element.id === 'save') {
                this.save(genre);
            } else if (element.id === 'reallyDelete') {
                this.reallyDelete(genre.genreId);
            }
        }
    }
}
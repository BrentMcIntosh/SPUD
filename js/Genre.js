'use strict';

export class Genre {

    interpolate(template, genreId, name, description) {
        template = template.replace(/{{genreId}}/g, genreId);
        template = template.replace(/{{name}}/g, name);
        template = template.replace(/{{description}}/g, description);

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

                        let template = div.getElementsByTagName('button')[1].outerHTML;

                        div.getElementsByTagName('button')[1].remove();

                        for (let i = 0; i < list.length; i++) {

                            let item = list[i];

                            let inner = new Genre();

                            let button = inner.interpolate(template, item.genreId, item.name, item.description);

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

    update(genreId, name, description) {
        this.simplePage('Update', genreId, name, description);
    }

    remove(genreId, name, description) {
        this.simplePage('Delete', genreId, name, description);
    }

    simplePage(page, genreId, name, description) {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let inner = new Genre();

                if (!genreId) {
                    genreId = 0;
                }

                if (!name) name = '';
                if (!description) description = '';

                document.getElementById('main').style.display = "none";
                document.getElementById('main').innerHTML = inner.interpolate(this.responseText, genreId, name, description);

                if (genreId === 0) {
                    document.getElementById('remove').style.display = "none";
                }

                document.getElementById('main').style.display = "block";
            }
        };

        xhttp.open('GET', '/Views/Genres/' + page + '.html', true);
        xhttp.send();
    }

    save(genreId) {

        var xhttp = new XMLHttpRequest();

        var data = '{ "genreId": {{genreId}}, "name": "{{name}}", "description": "{{description}}" }';

        var name = document.getElementById("name").value;
        var description = document.getElementById("description").value;

        data = this.interpolate(data, genreId, name, description);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {

                let inner = new Genre();

                inner.replace('Genres');
            }
        };

        if (genreId === '0') {
            xhttp.open('POST', '/api/Genres', true);
        } else {
            xhttp.open('PUT', '/api/Genres/' + genreId, true);
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

            if (element.id === 'create' || event.srcElement.classList.contains('edit')) {
                this.update(data['genreid'], data['name'], data['description']);
            } else if (element.id === 'remove') {
                this.remove(data['genreid'], data['name'], data['description']);
            } else if (element.id === 'save') {
                this.save(data['genreid']);
            } else if (element.id === 'reallyDelete') {
                this.reallyDelete(data['genreid']);
            }
        }
    }
}
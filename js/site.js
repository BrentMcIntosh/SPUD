
function replace(page) {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var div = document.createElement('div');

            div.innerHTML = this.responseText;

            var jsonRequest = new XMLHttpRequest();

            jsonRequest.onreadystatechange = function () {

                if (this.readyState == 4 && this.status == 200) {

                    var list = JSON.parse(this.responseText);

                    var table = div.getElementsByTagName('table')[0];

                    var template = table.getElementsByTagName('tr')[1].innerHTML;

                    for (var i = 0; i < list.length; i++) {

                        var item = list[i];

                        var row = interpolate(template, item.genreId, item.name, item.description);

                        if (i === 0) {
                            table.getElementsByTagName('tr')[1].innerHTML = row;
                        } else {
                            var child = document.createElement('tr');

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

function update(genreId, name, description) {
    simplePage('Update', genreId, name, description);
}

function remove(genreId, name, description) {
    simplePage('Delete', genreId, name, description);
}

function simplePage(page, genreId, name, description) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementsByTagName('main')[0].innerHTML = interpolate(this.responseText, genreId, name, description);
        }
    };

    xhttp.open('GET', '/Views/Genres/' + page + '.html', true);
    xhttp.send();
}

function interpolate(template, genreId, name, description) {
    template = template.replace(/{{genreId}}/g, genreId);
    template = template.replace(/{{name}}/g, name);
    template = template.replace(/{{description}}/g, description);

    return template;
}

function save(genreId) {

    var xhttp = new XMLHttpRequest();

    var data = '{ "genreId": {{genreId}}, "name": "{{name}}", "description": "{{description}}" }';

    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;

    data = interpolate(data, genreId, name, description);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            replace('Genres');
        }
    };

    if (genreId === '0') {
        xhttp.open('POST', '/api/Genres', true);
    }
    else {
        xhttp.open('PUT', '/api/Genres/' + genreId, true);
    }

    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(data);
}

function reallyDelete(genreId) {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            replace('Genres');
        }
    };

    xhttp.open('DELETE', '/api/Genres/' + genreId, true);
    xhttp.send();
}

document.addEventListener('click', event => {

    if (event.srcElement.nodeName === 'BUTTON') {

        if (event.srcElement.innerText === 'GENRES' || event.srcElement.title === 'Cancel') {
            replace('Genres');
        }
        else {
            var data = event.srcElement.dataset;

            if (event.srcElement.title === 'Create New Genre' || event.srcElement.title === 'Edit') {
                update(data['genreid'], data['name'], data['description']);
            }
            else if (event.srcElement.title === 'Remove') {
                remove(data['genreid'], data['name'], data['description']);
            }
            else if (event.srcElement.title === 'Save') {
                save(data['genreid']);
            }
            else if (event.srcElement.title === 'Really Delete') {
                reallyDelete(data['genreid']);
            }
        }
    }
});


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

                    var tbody = div.getElementsByTagName('tbody')[0];

                    var template = tbody.getElementsByTagName('tr')[0].innerHTML;

                    for (var i = 0; i < list.length; i++) {

                        var item = list[i];

                        var row = interpolate(template, item.genreId, item.name, item.description);

                        if (i === 0) {
                            tbody.getElementsByTagName('tr')[0].innerHTML = row;
                        } else {
                            var child = document.createElement('tr');

                            child.innerHTML = row;

                            tbody.appendChild(child);
                        }
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

function update(list) {
    simplePage('Update', list);
}

function remove(list) {
    simplePage('Delete', list);
}

function simplePage(page, list) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var items = list.split('|');

            document.getElementById('main').innerHTML = interpolate(this.responseText, items[0], items[1], items[2]);
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

    if (genreId === 0) {
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

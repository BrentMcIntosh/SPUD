function replace(page) {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('main').innerHTML = this.responseText;

            var jsonRequest = new XMLHttpRequest();

            jsonRequest.onreadystatechange = function () {

                if (this.readyState == 4 && this.status == 200) {

                    var list = JSON.parse(this.responseText);

                    var tbody = document.getElementsByTagName('tbody')[0];

                    var template = tbody.getElementsByTagName('tr')[0].innerHTML;

                    for (var i = 0; i < list.length; i++) {

                        var item = list[i];

                        var row = template;

                        row = row.replace(/genreId/g, item.genreId);
                        row = row.replace(/name/g, item.name);
                        row = row.replace(/description/g, item.description);

                        if (i === 0) {
                            tbody.getElementsByTagName('tr')[0].innerHTML = row;
                        } else {
                            var child = document.createElement('tr');

                            child.innerHTML = row;

                            tbody.appendChild(child);
                        }
                    }
                }
            };

            jsonRequest.open('GET', '/api/' + page, true);
            jsonRequest.send();
        }
    };

    xhttp.open('GET', '/Views/' + page + '/List.html', true);
    xhttp.send();
}
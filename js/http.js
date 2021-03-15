"use strict";

export class Http {

    post(url, data, callback, callbackArg) {
        this.sendData("POST", url, data, callback, callbackArg);
    }

    get(url, callback, callbackArg) {
        let request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText, callbackArg);
            }
        };

        request.open("GET", url, true);
        request.send();
    }

    put(url, data, callback, callbackArg) {
        this.sendData("PUT", url, data, callback, callbackArg)
    }

    delete(url, callback, callbackArg) {
        let request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (this.readyState == 4) {
                callback(callbackArg);
            }
        };

        request.open("DELETE", url, true);
        request.send();
    }

    sendData(method, url, data, callback, callbackArg) {

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {

            if (this.readyState == 4) {

                callback(callbackArg);
            }
        };

        xhttp.open(method, url, true);

        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhttp.send(data);
    }
}


"use strict";

export class Http {


    static seed() {

    }


    static openDB() {
        const DBOpenRequest = window.indexedDB.open("toDoList");
        DBOpenRequest.onsuccess = (e) => {
            let db = DBOpenRequest.result;
        };
    }

    async addRow(newRow) {
        // 1. Read existing data, default to empty array if none exists
        const result = await chrome.storage.local.get({ my_table_data: [] });
        const tableData = result.my_table_data;

        // 2. Add the new row
        tableData.push(newRow);

        // 3. Update the storage
        await chrome.storage.local.set({ my_table_data: tableData });
        console.log("Row added successfully!");
    }



    static post(url, data, callback, callbackArg) {
        this.sendData("POST", url, data, callback, callbackArg);
    }



    static read(id) {
        const request = indexedDB.open("music");

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction("genre", "readonly");
            const genres = transaction.objectStore("genre");

            const getRequest = genres.get(id);

            getRequest.onsuccess = function () {
                if (getRequest.result) {
                    console.log("Genre found:", getRequest.result);
                } else {
                    console.log("Genre not found");
                }
            };

            getRequest.onerror = function (event) {
            console.error("Error retrieving genre:", event.target.errorCode);
            };
        };
    }

    static readAll(url, callback, callbackArg) {
        const request = indexedDB.open("music");

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(url, "readonly");
            const genres = transaction.objectStore(url);
            const getAllRequest = genres.getAll();
            
            getAllRequest.onsuccess = (event) => {
                const allRecords = event.target.result;
                console.log("Data retrieved:", allRecords);
                callback(allRecords, callbackArg);
            };
            
            getAllRequest.onerror = (event) => {
                console.error("Error fetching data:", event.target.error);
            };
        };
    }    


    static get(url, callback, callbackArg) {


        let request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText, callbackArg);
            }
        };

        request.open("GET", url, true);
        request.send();

    }

    static getJson(url, callback, callbackArg) {

        url = url.toLowerCase();

        this.readAll(url, callback, callbackArg);

    }

    static put(url, data, callback, callbackArg) {
        this.sendData("PUT", url, data, callback, callbackArg)
    }

    static delete(url, callback, callbackArg) {
        let request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (this.readyState == 4) {
                callback(callbackArg);
            }
        };

        request.open("DELETE", url, true);
        request.send();
    }

    static sendData(method, url, data, callback, callbackArg) {

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

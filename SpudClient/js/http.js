"use strict";

export class Http {


    // static seed() {

    // }


    // static openDB() {
    //     const DBOpenRequest = window.indexedDB.open("toDoList");
    //     DBOpenRequest.onsuccess = (e) => {
    //         let db = DBOpenRequest.result;
    //     };
    // }

    // async addRow(newRow) {
    //     // 1. Read existing data, default to empty array if none exists
    //     const result = await chrome.storage.local.get({ my_table_data: [] });
    //     const tableData = result.my_table_data;

    //     // 2. Add the new row
    //     tableData.push(newRow);

    //     // 3. Update the storage
    //     await chrome.storage.local.set({ my_table_data: tableData });
    //     console.log("Row added successfully!");
    // }



    static post(url, data, callback, callbackArg) {
        const request = indexedDB.open("music");

        url = url.toLowerCase();

        console.log(url);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(url, "readwrite");
            const store = transaction.objectStore(url);
            const request = store.openKeyCursor(null, "prev");
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                const maxId = cursor ? cursor.key : 0; 

                let temp = JSON.parse(data);

                if (url === 'genre') {
                    temp.genreId = maxId + 1;
                }
                else if (url === 'artist') {
                    temp.artistId = maxId + 1;
                }
                else if (url === 'album') {
                    temp.albumId = maxId + 1;
                }

                store.add(temp);
            };
        };
    }

    // static create() {
	//   const request = indexedDB.open("music");

	//   request.onsuccess = function (event) {
	// 		const db = event.target.result;
	// 		const transaction = db.transaction("genre", "readwrite");
	// 		const genres = transaction.objectStore("genre");
			
	// 		genres.add({ genreId: 4, name: 'Emo', description: 'Sucks' });
	//   };
    // }



    static getJsonSingle(storeName, id, callback) {

        if (id === 0) {
            return callback({ albumId: 0, title: '', genreId: 0, artistId: 0, albumArtUrl: '', price: '' });
        }

        const request = indexedDB.open("music");

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);

            console.log("the id is " + id);

            const getRequest = store.get(parseInt(id));

            getRequest.onsuccess = function () {

                if (getRequest.result) {
                    callback(getRequest.result);
                } else {
                    console.log("Album not found");
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
        this.readAll(url.toLowerCase(), callback, callbackArg);
    }

    static convert(record) {
        let obj = JSON.parse(record);

        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value)) {
                obj[key] = value.includes('.') ? obj[key] = parseFloat(value) : obj[key] = parseInt(value, 10);
            }
        });

        return obj;
    }

    static put(storeName, id, record, callback) {
        storeName = storeName.toLowerCase();

        let item = this.convert(record);
        const request = indexedDB.open("music");

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            store.put(item);
        };        
    }

    static delete(storeName, id) {
        storeName = storeName.toLowerCase();
        const request = indexedDB.open("music");

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            store.delete(id);
        };      
    }

    // static sendData(method, url, data, callback, callbackArg) {

    //     let xhttp = new XMLHttpRequest();

    //     xhttp.onreadystatechange = function () {

    //         if (this.readyState == 4) {

    //             callback(callbackArg);
    //         }
    //     };

    //     xhttp.open(method, url, true);
    //     xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //     xhttp.send(data);
    // }
}

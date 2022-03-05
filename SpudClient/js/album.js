"use strict";

import { Dom } from "/js/dom.js";
import { Crud } from "/js/crud.js";
import { Http } from "/js/http.js";
import { Interpolator } from "/js/interpolator.js";

export class Album {
	
	static apiUrl = "https://localhost:44321/Album/"
	static artistUrl = "https://localhost:44321/Artist/"
	static genreUrl = "https://localhost:44321/Genre/"

    static list() {
        Crud.list("Album", ["albumArtUrl"]);
    }

    static update(album) {
        Http.get("/Views/Album/update.html", template => {
            Http.get(Album.apiUrl + album.albumId, json => {
				Http.get(Album.artistUrl, artistJson => {
					Http.get(Album.genreUrl, genreJson => {

						let album = JSON.parse(json);
						let artists = JSON.parse(artistJson);
						let genres = JSON.parse(genreJson);

						template = Interpolator.interpolate(template, album);

						Dom.hide("main");
						Dom.setMain(template);

						Crud.setSelect(album.artistId, artists, "artistId");
						Crud.setSelect(album.genreId, genres, "genreId");

						if (!album.albumId) {
							Dom.hide("remove");
						}

						Dom.show("main");
					});
				});
            });
        });
    }

    static save(album) {

        let data = Interpolator.docToJson(album, document);

        if (album.albumId) {
            Http.put(Album.apiUrl + album.albumId, data, Album.list);
        } else {
            Http.post(Album.apiUrl, data, Album.list);
        }
    }

    static confirmDelete(albumId) {
        Http.delete(Album.apiUrl + albumId, Album.list);
    }

    static route(element) {

        let action = element.id;

        if (action === "listAlbums" || action === "cancel") {
            Crud.list("Album", ["albumArtUrl"]);
        } else {

            let album = {
                albumId: 0,
                title: "",
                genreId: 0,
                artistId: 0,
                title: "",
                price: 0,
                albumArtUrl: ""
            };

            album = Interpolator.dataToClass(album, element.dataset);

            if (action === "create" || element.classList.contains("edit")) {
                Album.update(album);
            } 
			else if (action === "remove") {
                Crud.simplePage("/Views/Album/delete.html", album, album.albumId);
            } 
			else if (action === "save") {
                Album.save(album);
            } 
			else if (action === "confirmDelete") {
                Album.confirmDelete(album.albumId);
            }
        }
    }
}

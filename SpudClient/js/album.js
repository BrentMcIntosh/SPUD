"use strict";

import { Dom } from "/js/dom.js";
import { Crud } from "/js/crud.js";
import { Http } from "/js/http.js";
import { Interpolator } from "/js/interpolator.js";

export class Album {
	
	static apiUrl = "http://localhost:3000/Album/"
	static artistUrl = "http://localhost:3000/Artist/"
	static genreUrl = "http://localhost:3000/Genre/"

    static list() {
        Crud.list("album", ["albumArtUrl"]);
    }

    static update(album) {
        Http.get("/Views/Album/update.html", template => {
            Http.getJsonSingle("album", album.albumId, json => {
				Http.getJson('artist', artistJson => {
					Http.getJson('genre', genreJson => {

						let album = json;
						let artists = artistJson;
						let genres = genreJson;

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
            Http.put('album', album.id, data, Album.list);
        } else {
            Http.post('album', data, Album.list);
        }

        Crud.list("album", ["albumArtUrl"]);
    }

    static confirmDelete(albumId) {
        Http.delete('album', parseInt(albumId));

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
                Crud.list("Album", ["albumArtUrl"]);
            }
        }
    }
}

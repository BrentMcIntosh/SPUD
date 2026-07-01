
function init() {

    const request = indexedDB.open("music");

    request.onerror = (event) => {
        // Handle errors.
    };

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        const genres = db.createObjectStore("genre", { keyPath: "genreId" });
        const artists = db.createObjectStore("artist", { keyPath: "artistId" });
        const albums = db.createObjectStore("album", { keyPath: "albumId" });
        
        genres.add({ genreId: 1, name: 'Jazz', description: 'Super Cool' });
        genres.add({ genreId: 2, name: 'Rock', description: 'Loud' });
        genres.add({ genreId: 3, name: 'Metal', description: 'Louder' });

        artists.add({ artistId: 1, name: 'Mingus' });
        artists.add({ artistId: 2, name: 'Bon Jovi' });
        artists.add({ artistId: 3, name: 'Judas Priest' });
        
        albums.add({ albumId: 1, name: 'The Black Saint and the Sinner Lady', genreId: 1, artistId: 1, albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Mingus_Black_Saint.jpg' });
        albums.add({ albumId: 2, name: 'Slippery When Wet', genreId: 2, artistId: 2, albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/a/ab/Bon_jovi_slippery_when_wet.jpg' });
        albums.add({ albumId: 3, name: 'Unleashed in the East', genreId: 2, artistId: 2, albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/9/92/Jpunleashedintheeast.JPG' });
    };
}


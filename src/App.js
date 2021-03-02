import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { spotify } from './Spotify_Credentials';
import { Dropdown } from './components/Dropdown';

function App() {
  const [token, setToken] = useState('');
  const [genres, setGenres] = useState({
    selectedGenre: '',
    listOfGenresFromAPI: [],
  });
  const [playlists, setPlaylists] = useState({
    selectedPlaylist: '',
    listOfPlaylistFromAPI: [],
  });

  useEffect(() => {
    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(
          `${spotify.id}:${spotify.secret}`
        ).toString('base64')}`,
      },
      data: 'grant_type=client_credentials',
      method: 'post',
    }).then((tokenResponse) => {
      setToken(tokenResponse.data.access_token);
      console.log(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + tokenResponse.data.access_token,
        },
      }).then((genreReponse) => {
        // console.log(data.categories.items);
        setGenres({
          selectedGenre: genres.selectedGenre,
          listOfGenresFromAPI: genreReponse.data.categories.items,
        });
      });
    });
  }, []);

  const genreChanged = (val) => {
    setGenres({
      selectedGenre: val,
      listOfGenresFromAPI: genres.listOfGenresFromAPI,
    });
    axios(
      `https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    ).then((playlistResponse) => {
      setPlaylists({
        selectedPlaylist: playlists.selectedPlaylist,
        listOfPlaylistFromAPI: playlistResponse.data.playlists.item,
      });
    });
  };

  const playlistChanged = (val) => {
    setPlaylists({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlists.listOfPlaylistFromAPI,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="container">
        <Dropdown
          lists={genres.listOfGenresFromAPI}
          selectedValue={genres.selectedGenre}
          changed={genreChanged}
        />
        <Dropdown
          lists={playlists.listOfPlaylistFromAPI}
          selectedValue={playlists.selectedPlaylist}
          changed={playlistChanged}
        />

        <button type="submit">Search</button>
      </div>
    </form>
  );
}

export default App;

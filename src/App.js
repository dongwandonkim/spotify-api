import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { spotify } from './Spotify_Credentials';
import { Dropdown } from './components/Dropdown';
import { TrackBox } from './components/TrackBox';
import { Detail } from './components/Detail';

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
  const [tracks, setTracks] = useState({
    selectedTrack: '',
    listOfTracksFromAPI: [],
  });
  const [trackDetail, setTrackDetail] = useState(null);

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
      // console.log(tokenResponse.data.access_token);

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
    console.log(val);
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
        listOfPlaylistFromAPI: playlistResponse.data.playlists.items,
      });
    });
  };

  const playlistChanged = (val) => {
    setPlaylists({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlists.listOfPlaylistFromAPI,
    });
  };

  const buttonClicked = (e) => {
    e.preventDefault();
    axios(
      `https://api.spotify.com/v1/playlists/${playlists.selectedPlaylist}/tracks?limit=10`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    ).then((tracksResponse) => {
      console.log(tracksResponse);
      setTracks({
        selectedTrack: tracks.selectedTrack,
        listOfTracksFromAPI: tracksResponse.data.items,
      });
    });
  };
  const trackBoxClicked = (val) => {
    const currentTracks = [...tracks.listOfTracksFromAPI];
    const trackInfo = currentTracks.filter((t) => t.track.id === val);
    setTrackDetail(trackInfo[0].track);
  };
  return (
    <div className="container">
      <form onSubmit={buttonClicked}>
        <Dropdown
          label="Genre :"
          lists={genres.listOfGenresFromAPI}
          selectedValue={genres.selectedGenre}
          changed={genreChanged}
        />
        <Dropdown
          label="Playlist :"
          lists={playlists.listOfPlaylistFromAPI}
          selectedValue={playlists.selectedPlaylist}
          changed={playlistChanged}
        />
        <div className="col-sm-6 row form-group px-0">
          <button type="submit" className="btn btn-success col-sm-12">
            Search
          </button>
        </div>
        <div className="row">
          <TrackBox
            lists={tracks.listOfTracksFromAPI}
            clicked={trackBoxClicked}
            onClick={buttonClicked}
          />
          {trackDetail && <Detail {...trackDetail} />}
        </div>
      </form>
    </div>
  );
}

export default App;

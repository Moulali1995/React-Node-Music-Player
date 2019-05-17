import React from 'react'
import ReactDOM from 'react-dom'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import './App.css'
class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      play: true,
      next: true,
      back: true,
      presentSong: '',
      presentSongSrc: '',
      playatstart: false,
      songs: [],
      songDetails: [],
      playlistexists: false,
      playlist: '',
      showPlaylistflag: false,
      playlistSongs: [],
      showPlaylistSongs: [],
      showPlaylistSongsjsx: [],
      nextSong: '',
      prevSong: ''
    }
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.previous = this.previous.bind(this)
    this.next = this.next.bind(this)
    this.playfromlist = this.playfromlist.bind(this)
    this.addtoPlaylist = this.addtoPlaylist.bind(this)
    this.showPlaylist = this.showPlaylist.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.deletePlaylist = this.deletePlaylist.bind(this)
    this.togglePlaylist = this.togglePlaylist.bind(this)
  }

  previous () {
    this.setState({ play: false })
    this.state.songDetails.filter(song => song.id === this.state.prevSong
      ? this.setState({ presentSongSrc: 'http://localhost:3001/songs/' + song.title + '.mp3',
        presentSong: song.title,
        artist: song.artist }) : song)
    this.setState({
      prevSong: this.state.prevSong - 1, nextSong: this.state.nextSong - 1
    })
    console.log('previous')
  }
  next () {
    this.setState({ play: false })
    this.state.songDetails.filter(song => song.id === this.state.nextSong
      ? this.setState({ presentSongSrc: 'http://localhost:3001/songs/' + song.title + '.mp3',
        presentSong: song.title,
        artist: song.artist }) : song)
    this.setState({
      nextSong: this.state.nextSong + 1, prevSong: this.state.prevSong + 1
    })
    console.log('next')
  }
  pause () {
    this.setState({ play: true })
    let audio = this.audioEl
    audio.pause()
    console.log('paused')
  }
  play () {
    if (this.state.playatstart) {
      this.setState({ play: false })
      let audio = this.audioEl
      audio.play()
      console.log(`playing`)
    } else {
      window.alert('Select song from the List to play')
    }
  }
  addtoPlaylist (song) {
    if (this.state.playlistexists) {
      this.setState(prevState => ({
        playlistSongs: [...prevState.playlistSongs, song] }), () => this.showPlaylist())
    } else {
      this.promptPlaylistName()
    }
  }
  promptPlaylistName () {
    var playlist = window.prompt('enter playlist name', 'Playlist1')
    if (playlist !== null) {
      if (playlist.length === 0) {
        this.promptPlaylistName()
      } else {
        this.setState({ playlistexists: true, playlist: playlist, showPlaylistflag: true })
        window.alert('Playlist created')
      }
    }
  }
  togglePlaylist () {
    if (this.state.showPlaylistflag) {
      this.setState({ showPlaylistflag: false })
    } else {
      this.setState({ showPlaylistflag: true })
    }
    if (!this.state.playlistexists) {
      window.alert('No playlist exists')
      this.setState({ showPlaylistflag: false })
    }
  }
  showPlaylist () {
    if (!this.state.playlistexists) {
      this.addtoPlaylist()
    }
    var showPlaylistlocal = this.state.playlistSongs.map((song, index) => {
      return (
        <div key={index}>
          <a onClick={(e) => this.playfromlist(song)}>
            <img src='https://image.flaticon.com/icons/svg/148/148722.svg' alt='♫' width='20' height='20' />
          &nbsp;&nbsp;&nbsp;Song-{song.title}&nbsp;&nbsp;&nbsp;
            <img src='https://image.flaticon.com/icons/svg/148/148733.svg' alt='Play' width='20' height='20' />
          </a>
        </div>
      )
    })
    this.setState({ showPlaylistSongsjsx: showPlaylistlocal })
  }
  savePlaylist () {
    if (this.state.playlistSongs.length == 0) {
      window.alert('Add songs to the playlist and then save the playlist')
    } else {
      const body = { playlist: this.state.playlist, savedSongs: [...this.state.playlistSongs] }
      axios.post('http://localhost:3001/addplaylist', body)
        .then(res => {
          window.alert('Playlist saved')
        }
        ).catch(error => window.alert('Some error occurred' + error))
    }
  }
  deletePlaylist () {
    axios.delete('http://localhost:3001/deleteplaylist')
      .then(res => {
        if (res.status === 200) {
          window.alert('Playlist deleted')
          this.setState({ showPlaylistflag: false, showPlaylistSongsjsx: [], playlistSongs: [], playlistexists: false, playlist: '' })
        } else { window.alert('Some error occurred') }
      }
      ).catch(error => window.alert('Some error occurred' + error))
  }

  playfromlist (song, index) {
    this.setState({ playatstart: true, nextSong: index + 1, prevSong: index - 1 })
    this.setState({ play: false, presentSong: song.title, artist: song.artist })
    const src = 'http://localhost:3001/songs/' + song.title + '.mp3'
    console.log('src : ' + src)
    this.setState({ presentSongSrc: src })
    console.log(`Playing Song : ${song.title}`)
  }

  componentDidMount () {
    axios.get('http://localhost:3001/playlists').then(
      res => {
        if (res.data.length === 0) {
          this.setState({ playlistexists: false })
        } else {
          this.setState({ playlist: res.data.playlist, playlistSongs: res.data.savedSongs, playlistexists: true })
          this.showPlaylist()
        }
      }
    ).catch(error => window.alert('Some error occurred' + error))
    axios.get('http://localhost:3001/songs').then(res => {
      this.setState({ songDetails: res.data })
      var songs = this.state.songDetails.map((song) => {
      // onClick={(e) => this.playfromlist(song)}
        return (
          <div key={song.id}>
            <img src='https://image.flaticon.com/icons/svg/148/148722.svg' alt='♫' width='20' height='20' />
            &nbsp;&nbsp;&nbsp;Song-{song.title}&nbsp;&nbsp;&nbsp;
            <button onClick={(e) => this.playfromlist(song, song.id)}>
              <img src='https://image.flaticon.com/icons/svg/148/148733.svg' alt='►' width='20' height='20' />
            </button>
            <button onClick={(e) => this.addtoPlaylist(song)} >&nbsp;+</button>
          </div>
        )
      })
      this.setState({ songs: songs })
    }
    )
  }
  render () {
    return (
      <Card align='center' style={{ width: '50rem' }}>
        <Card.Body >
          <div className='App' >
            <h2> React Music Player </h2>
            <marquee><h3>♫♫♫ ♫♫♫ ♫♫♫    ♫♫♫ ♫♫♫ ♫♫♫</h3></marquee>
            <Card align='center' style={{ width: '40rem' }}>
              <Card.Body >
                {this.state.songs}

                <br /><br />
                <button onClick={this.togglePlaylist}>Playlists</button>
                <br /><br />
                <b>{this.state.showPlaylistflag && this.state.playlist}</b>
                &nbsp;&nbsp;
                {this.state.showPlaylistflag &&
                <button onClick={this.savePlaylist}>Save Playlist</button>}
                {this.state.showPlaylistflag &&
                <button onClick={this.deletePlaylist}>delete Playlist</button>
                }
                {this.state.showPlaylistflag && this.state.showPlaylistSongsjsx}
                <br /><br />
                <marquee><b>{this.state.presentSong} </b><b>{this.state.artist} </b></marquee>

                <div className='row' >
                  <div className='column'>
                    <a onClick={this.previous}>
                      <img src='http://www.myiconfinder.com/uploads/iconsets/128-128-25d53f91e82b8da0e0c18a5c33dcc544.png' alt='Error' width='30' height='30' />
                    </a>
                  </div>
                  {this.state.play

                    ? <div className='column'>
                      <a onClick={this.play}>
                        <img src='https://image.flaticon.com/icons/svg/148/148733.svg' alt='►' width='30' height='30' />
                      </a>
                    </div>

                    : <div className='column'>
                      <a onClick={this.pause}>
                        <img src='https://image.flaticon.com/icons/svg/148/148735.svg' alt='‼' width='30' height='30' />
                      </a>
                    </div>
                  }
                  <div className='column'>
                    <a onClick={this.next}>
                      <img src='http://www.myiconfinder.com/uploads/iconsets/256-256-08f5b089ef1f06538ea794e0ed1814ee.png' alt='Error' width='30' height='30' />
                    </a>
                  </div>

                </div>
              </Card.Body>
            </Card>
            <div>

              <audio ref={el => (this.audioEl = el)} src={this.state.presentSongSrc} autoPlay />
            </div>
          </div>
        </Card.Body>
      </Card>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)

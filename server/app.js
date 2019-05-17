var express = require('express')
var fs = require('fs')
var path = require('path')
var app = express()
var cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static(__dirname + '/music'))
app.use('/public', express.static(__dirname + '/public'))
/** Implementing Simple Music Server using Express JS **/
app.get('/songs', (req, res) => {
  res.json(
    [
      { id: 1,
        title: 'song1',
        artist: 'artist1'
      },
      { id: 2,
        title: 'song2',
        artist: 'artist2'
      },
      { id: 3,
        title: 'song3',
        artist: 'artist3'
      },
      { id: 4,
        title: 'song4',
        artist: 'artist4'
      },
      { id: 5,
        title: 'song5',
        artist: 'artist5'
      }
    ]
  )
})

var filepath = path.join(__dirname, '/public/playlists/playlist.json')
app.get('/playlists', (req, res) => {
  fs.readFile(filepath, (err, data) => {
    if (err) {
      console.log('some error occurred' + err)
    } else {
      if (data === '') { console.log(data); res.sendStatus(201) } else { res.json(JSON.parse(data)) }
    }
  })
})
app.post('/addplaylist', (req, res) => {
  var playlist = req.body
  console.log(req.body)
  fs.writeFile(filepath, JSON.stringify(playlist), (error) => {
    if (error) { console.log('Some error occurred' + error) } else { res.status(200).send('Playlist added') }
  })
})
app.delete('/deleteplaylist', (req, res) => {
  fs.writeFile(filepath, JSON.stringify([]), (error) => {
    if (error) { console.log('Some error occurred' + error) } else { res.status(200).send('Playlist deleted') }
  })
})
app.get('/songs/:id', function (req, res) {
  // File to be served
  var fileId = req.params.id
  var file = path.join(__dirname, '/music/', fileId)
  fs.exists(file, function (exists) {
    if (exists) {
      var rstream = fs.createReadStream(file)
      return rstream.pipe(res)
    } else {
      res.status(404).json({ error: 'Song Not Found' })
      res.end()
    }
  })
})
module.exports = app

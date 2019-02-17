const express = require('express'),
      path = require('path'),
      http = require('http');
    
const app = express()
const port = 3001

var server = http.createServer(app)
var io = require('socket.io').listen(server)

var socket = require('./routes/sockets.js')(io)

app.use(socket)

server.listen(port, (err) => {
    if(err) {
        return console.log("something bad happened")
    }

    console.log(`server is listening on port ${port}`)
})
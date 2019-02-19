var handleDesktop = require('./desktop.js')
var handleCommunication = require('./communication.js')

var express = require('express')
var router = express.Router()

var returnRouter = function(io) {
    io.on('connection', function(socket) {
        var socketId = socket.id
        var clientIP = socket.request.connection.remoteAddress
        console.log('connection from ' + clientIP)

        handleDesktop.socketHandler(socket)
        handleCommunication.socketHandler(socket)
    })
        
    return router
}

module.exports = returnRouter
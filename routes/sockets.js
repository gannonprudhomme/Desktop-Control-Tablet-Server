var handleDesktop = require('./desktop.js')
var handleCommunication = require('./communication.js')

var express = require('express')
var router = express.Router()

var returnRouter = function(io) {
    io.on('connection', function(socket) {
        console.log('connection!')
        handleDesktop.socketHandler(socket)
        handleCommunication.socketHandler(socket)
    })
        
    return router
}

module.exports = returnRouter
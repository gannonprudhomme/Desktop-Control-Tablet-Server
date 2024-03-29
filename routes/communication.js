// Defines how the raspberry pi server and this server communicate

const commands = require('./commands.js')
const settings = require('../settings.js')

var client = require('socket.io-client')('http://' + settings.settings['tablet-ip'] + ':3000')

var socketHandler = function(socket) {
    socket.on('current_audio_device', function(data, ret) {
        ret('DAC')
    })

    socket.on('shortcut', function(data) {
        commands.sendKeypress(data)
    })
}

function getVolumeMixerData() {
    return new Promise((resolve, reject) => {
       client.emit('volume-mixer-settings', '', function(data) {
            resolve(data)
        }) 
    })    
}

/**
 * called by desktop.loadVolumeData(), which sets volumes 
 */
function getVolumeData() {
    // Shouldn't be called anymore
    return new Promise((resolve, reject) => {
        client.emit('volume_data', '', function(data) {
            resolve(data)
        })
    })
}

function getCurrentAudioDevice() {
    
}

module.exports.socketHandler = socketHandler
module.exports.getVolumeMixerData = getVolumeMixerData
module.exports.getVolumeData = getVolumeData
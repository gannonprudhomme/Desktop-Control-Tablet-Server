var express = require('express')
var router = express.Router()
var fs = require('fs')
var bodyParser = require('body-parser') // for parsing basic request data?
var os = require('os-utils')
var path = require('path')
var fileUtils = require('../fileutils.js')

var commands = require('./commands.js')
var communication = require('./communication.js')
var tasks = require('./tasks.js')

var volumes = {};
loadVolumeData()
//var volumeData = JSON.parse(fs.readFileSync('./public/volumeData.json', 'utf-8'))
//var settingsData = JSON.parse(fs.readFileSync('./view-settings.json'), 'utf-8')
var volumeMixerData = {}
loadVolumeMixerData()

//var currentAudioDevice = settingsData['audioDevices'][0]
var currentAudioDevice = 'DAC'

// Handle socket messages
var socketHandler = function(socket) {
  // Send the list of active programs, when given a set of programs to search for
  // Could load the list of active programs from the settings files instead, as for now they won't change
  socket.on('active_programs', function(data, ret) {
    // Search for the programs in data in the list of current tasks
    // Use the cached version of the list of current tasks

    var mixerDataInitialized = false

    if(Object.keys(volumeMixerData).length > 0) { // If the volume mixer data is loaded in
      ret(getActivePrograms()) // Return the active programs immediately

    } else { // If volumeMixerData isn't loaded in, check every 1/10th second if it is
      console.log('Waiting for volumeMixerData')
      setTimeout(function() {
          if(Object.keys(volumeMixerData).length > 0) { // If the volume mixer data is loaded in
            if(!mixerDataInitialized) { // And we haven't returned it yet
              console.log('Volume mixer data retrieved, returning')

              ret(getActivePrograms())

              mixerDataInitialized = true
            }
          }
      }, 200)
    }
  })

  // Change the current audio device
  socket.on('audio_device', function(data) {
    console.log('audio device ' + data)
    commands.changeAudioOutput(data)
    currentAudioDevice = data
  })

  socket.on('screenshot', function(data) {
    console.log('screenshot!')
    commands.sendKeypress('ctrl+printscreen')
  })

  // Send the current pc performance stats back to the client
  socket.on('pc_stats', function(data, ret) {
    var data = {  }

    // Calculate the current cpu usage over the next minute
    os.cpuUsage(function(val) {
      data.cpuUsage = val
    })

    // Calculate the current free usage over the next minute
    // Callback should always call after os.cpuUsage
    os.cpuFree(function(val) {
      data.cpuFree = val

      data.totalMemory = os.totalmem()
      data.usedMemory = data.totalMemory - os.freemem()

      // Send the pc usage data back to the client
      // console.log(data)
      ret(data)
    })
  })
    
  socket.on('set_volume', function(data) {
    var now = (new Date()).getTime()
    // console.log('Volume: ' + data.program + ': ' + (data.volume * 100) + ', Delay: ' + (now - data.time) + 'ms')
    // commands.saveDelay(now - data.time)

    volumes[currentAudioDevice][data.program] = data.volume;
    
    // Run a command to set the volume for the given program
    commands.setVolume(data.program, data.volume)
  })
  // return router
}

function getActivePrograms() {
  // Iterate over all of the specified volume mixer's programs
  var retData = {}
  var taskMap = tasks.getTaskMap()

  var mixers = volumeMixerData['volumeMixers']
  for(var slider of mixers) {
    var program = slider['programName']
    var id = slider['id']
    var isActive = false

    if(program !== 'master-volume') { // Master-volume will never be in the list of current processes
      // If current program is in the map of current tasks
      if(taskMap.has(program)) { 
        // Set it as an active task
        isActive = true
      }

      retData[id] = isActive
    } else {
      // master-volume will always be active
      retData['master-volume'] = true
    }
  }

  return retData
}

// Keep on Desktop
function getPerformanceUsage() {
  var data = {}
  
  os.cpuUsage(function(val) {
    data.cpuUsage = val;
  })
}

function loadVolumeMixerData() {
  console.log('Attempting to get volumeMixerData')
  communication.getVolumeMixerData().then((data) => {
    console.log('Retrieved volumeMixerData')
    volumeMixerData = data

  }).catch((error) => {
      console.log(error)
  })
}

function loadVolumeData() {
    communication.getVolumeData().then((data) => {
        volumes = data
    })
}

// Settings(and all exports) are references, and thus change as they're updated
module.exports.socketHandler = socketHandler
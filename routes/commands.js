const { exec } = require('child_process')
const fs = require('fs')
const commandExistsSync = require('command-exists').sync; // Note that this is synchronous
const desktopScripts = require('../desktop-scripts');
const { exit } = require('process');

function checkNirCmdExists() {
  if (!commandExistsSync('nircmd')) {
    console.log("ERROR: nircmd does not exist in PATH. Either update your path or download it from https://nirsoft.net/utils/nircmd.html/")
    exit(1);
  }
}

function setVolume(program, volume) {
  if(program === 'master-volume') {
    // Set the master volume
    // Save the separate volumes for each sound device? So my soundbar doesn't blast music super loud
    exec('nircmd setvolume 0 ' + parseInt(volume * 65535) + ' ' + parseInt(volume * 65535))

  } else {
    exec('nircmd true setappvolume \"' + program + '\" ' + volume)
  }
}

// Altenrative to setting the process volume
function setVolume2(pid, volume) {
  if (pid === -1) { // master volume
  } else {
    desktopScripts.setProcessVolume(`setprocessvolume ${pid} ${volume}`);
  }
}

function sendKeypress(keys) {
  checkNirCmdExists();
  exec('nircmd sendkeypress ' + keys)
}

function changeAudioOutput(device) {
  exec('nircmd setdefaultsounddevice \"' + device + '\"')
}

/**
 * Retrieve all of the currently running processes that have volume control
 */
function getProcessVolumes() {
  return new Promise((resolve, reject) => {
    // TODO: Add a timeout to this and reject it at some point
    // Also we need to remove this handler once it's added
    desktopScripts.getAllProcesses('./icons/', (err, message) => {
      if (err) {
        console.error(err);
        resolve([]);
        return;
      };

      const lines = message.split(/\r?\n/); // Need to remove an empty line from this
      
      const ret = []; // Array of objects, with each having a pid, name, and volume

      // Each line is formatted like "{pid} {procName} {volume}", where volume is [0, 100]
      lines.forEach((line, idx) => {
        if (line.length == 0) {
          return; // Skip empty lines
        }

        // Example line: '12136 "Program Name"  100
        // Splits the line by either _" or "_ - where underscore is a space
        // This makes it so that between the start & the first _" it's the PID, then from after the
        // _" to the "_ (inside of the quotes) is the program name, then the rest is the volume.
        // This allows us to handle spaces in program names (thanks Beat Saber)
        const lineSplit = line.split(/(?:(?:\s")|(?:"\s))/);


        const pid = Number(lineSplit[0]);
        const name = lineSplit[1];
        const volume = Number(lineSplit[2]);

        ret.push({
          pid, name, volume,
        })
      });

      resolve(ret);
    });
  });
}

var stream = fs.createWriteStream('delays.txt', {flags:'a'})
function saveDelay(time) {
  stream.write(time + '\n')
}

function addTwoNumbers(a, b) {
  return a+b
}

module.exports.addTwoNumbers = addTwoNumbers
module.exports.setVolume = setVolume
module.exports.setVolume2 = setVolume2
module.exports.sendKeypress = sendKeypress
module.exports.saveDelay = saveDelay
module.exports.changeAudioOutput = changeAudioOutput
module.exports.getProcessVolumes = getProcessVolumes

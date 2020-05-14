var edge = require('edge-js');
const path = require('path');
const getAllProcesses = edge.func(path.join(__dirname, 'csharp-scripts/GetAllProcessesCommand.cs'))
const setProcessVolume = edge.func(path.join(__dirname, 'csharp-scripts/SetProcessVolumeCommand.cs'))

module.exports.getAllProcesses = getAllProcesses;
module.exports.setProcessVolume = setProcessVolume;

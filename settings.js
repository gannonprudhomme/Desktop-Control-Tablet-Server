const fs = require('fs')

var settings = JSON.parse(fs.readFileSync('./settings.json'))

module.exports.settings = settings
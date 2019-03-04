# Desktop-Control-Tablet-Server
The Windows 10 server for the Desktop Control Tablet

## Features
- Remote volume control
- Audio device changing
- Current task reading

## Installation
1) Download [nodejs/npm](http://www.nodejs.org) and [nircmd](http://www.nirsoft.net/utils/nircmd.html) on your PC.
2) Clone the repository in the folder of your choosing
3) Set your Raspberry Pi Client's IP in `settings.json` under the `tablet-ip` field.

## Setup auto-launch for Windows 10
1) Create a file called `startserver.bat` in a folder of your choosing.
2) Add the following lines to it:
```bash
  cd path/to/your/folder
  node app.js
```
3) Add the file to startup 

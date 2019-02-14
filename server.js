const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { exec } = require('child_process');

const INTERVAL = 2000;
const MAX_DATA_POINTS = 20;

// set public directory
app.use(express.static(__dirname));

// serve page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// send information to the client on the specified interval
io.on('connection', (socket) => {
  const updateInterval = setInterval(updateClient, INTERVAL, socket);

  socket.on('disconnect', () => {
    clearInterval(updateInterval);
  });
});

http.listen(3000, () => {
  console.log('Visit the UI at http://localhost:3000');
});

let cpus = [];
let mems = [];

/**
 * Execute shell command to retrieve cpu and memory data and
 * send values to the client
 *
 * @param {Object} socket the current open socket
 */
function updateClient(socket) {
  // gather cpu and memory values for all processes and add them up
  const cmd = 'ps -A -o %cpu,%mem | awk \'{ cpu += $1; mem += $2} END {print cpu , mem}\'';

  exec(cmd, (err, stdout) => {
    // set value to null if the command failed with error, otherwise extract the value
    const cpuVal = err ? null : stdout.split(' ')[0];
    const memVal = err ? null : stdout.split(' ')[1];

    updateArray(cpuVal, cpus);
    updateArray(memVal, mems);
  
    socket.emit('update', cpus, mems);
  });
}

/**
 * Update array with latest value and remove oldest if the array has
 * reached the max length
 *
 * @param {Int} number to add to the array
 * @param {Array} array array to add value to
 */
function updateArray(value, array) {
  if(array.length === MAX_DATA_POINTS) {
    // remove the oldest value
    array.shift();
  }
  array.push({ x: new Date(), y: value});
}
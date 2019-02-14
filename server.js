var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);
const { exec } = require('child_process');

// number of lines in `top` output that contain aggregate data
const NUM_AGGREGATE_LINES = 11;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  const updateInterval = setInterval(updateUI, 3000);

  socket.on('disconnect', () => {
    clearInterval(updateInterval);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

let cpus = [];
let mems = [];

function updateUI() {
  const cmd = 'ps -A -o %cpu,%mem | awk \'{ cpu += $1; mem += $2} END {print cpu , mem}\'';

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      // in the event of an error, we'll just ignore it and try again on the next interval
      // if the error persists, we could possibly close the connection
      return;
    }

    const cpu = stdout.split(' ')[0];
    if(cpus.length === 20) {
      cpus.shift();
    }
    cpus.push({ x: new Date, y: cpu });

    const memory = stdout.split(' ')[1];
    if(mems.length === 20) {
      mems.shift();
    }
    mems.push({ x: new Date(), y: memory});
  
    io.emit('update', cpus, mems);
  });
}
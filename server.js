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

function updateUI() {

  exec('top -o cpu -l 1', (err, stdout, stderr) => {
    if (err) {
      // in the event of an error, we'll just ignore it and try again on the next interval
      // if the error persists, we could possibly close the connection
      return;
    }

    const output = stdout.split('\n');

    const aggregate = output.slice(0, NUM_AGGREGATE_LINES);
    const procs = output.slice(NUM_AGGREGATE_LINES, output.length);
  
    io.emit('update', aggregate, procs);
  });
}
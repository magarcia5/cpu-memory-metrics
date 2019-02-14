const io = require('socket.io-client');

const socket = io();

// the index of the time value when splitting aggregate data into an array
// not considered useful as it is not a metric
const TIME_INDEX = 1;

socket.on('update', function(aggregate, msg) {
  document.getElementById('aggregate-info').innerHTML = displayAggregate(aggregate);
});

function displayAggregate(data) {
  let html = '';

  // remove time
  data.splice(TIME_INDEX,1);

  // remove all whitespace elements
  const noWhiteSpaces = data.filter((d) => d.trim() !== '');

  noWhiteSpaces.forEach(element => {
    html = html.concat(`${element}<br>`);
  });

  return html;
}
const io = require('socket.io-client');

const socket = io();

// the index of the time value when splitting aggregate data into an array
// not considered useful as it is not a metric
const TIME_INDEX = 1;

socket.on('update', function(aggregate, procs) {
  document.getElementById('aggregate-info').innerHTML = displayAggregate(aggregate);
  document.getElementById('proc-table').innerHTML = displayProcs(procs);
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

function displayProcs(data) {
  let html = '';

  html = html.concat(generateHeader(data[0]));

  const tableRows = data.slice(1, data.length);
  tableRows.forEach(row => {
    html = html.concat('<tr>');
    let columns = row.replace(/ {2,}/g, ' ').split(' ');
    columns = columns.filter(d => d.trim() !== '');
    columns.forEach(col => {
      html = html.concat(`<td>${col}</td>`);
    })
    html = html.concat('</tr>');
  });

  return html;
}

function generateHeader(row) {
  let html = '<tr>';

  const columns = row.replace(/ {2,}/g, ' ').split(' ');
  columns.forEach(col => {
    html = html.concat(`<th>${col}</th>`);
  })

  html = html.concat('</tr>');

  return html;

}
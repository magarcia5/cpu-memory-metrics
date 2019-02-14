const io = require('socket.io-client');
const { Chart } = require('chart.js');

const CHART_OPTIONS = {
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [{
        type: 'time',
        time: {
            unit: 'second'
        }
    }]
}
};

// open socket
const socket = io();

// update charts when data is received
socket.on('update', function(cpus, mems) {
  drawChart('cpu-chart', cpus, 'CPU', '#3e95cd');
  drawChart('mem-chart', mems, 'Memory', '#3cba9f');
});

/**
 * Draw chart in specified canvas with specified data and
 * with ui settings
 *
 * @param {String} id canvas id
 * @param {Object} data array of x (time),y (value) data points
 * @param {String} label label for the line drawn
 * @param {String} borderColor hex color for line
 */
function drawChart(id, data, label, borderColor) {
  new Chart(document.getElementById(id), {
    type: 'line',
    data: {
      datasets: [{ 
          data,
          label,
          borderColor,
          fill: false
        }
      ]
    },
    options: CHART_OPTIONS
  });
}

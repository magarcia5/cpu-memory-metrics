const io = require('socket.io-client');
const { Chart } = require('chart.js');

const socket = io();

socket.on('update', function(cpus, mems) {

  new Chart(document.getElementById("cpu-chart"), {
    type: 'line',
    data: {
      datasets: [{ 
          data: cpus,
          label: "CPU",
          borderColor: "#3e95cd",
          fill: false
        }
      ]
    },
    options: {
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
    }
  });

  new Chart(document.getElementById("mem-chart"), {
    type: 'line',
    data: {
      datasets: [{ 
          data: mems,
          label: "Memory",
          borderColor: "#3cba9f",
          fill: false
        }
      ]
    },
    options: {
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
    }
  });
});
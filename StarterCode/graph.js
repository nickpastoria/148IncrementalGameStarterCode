let moneyChart;

$(document).ready(function() {
    // Initialize the chart
    let ctx = document.getElementById('moneyChart').getContext('2d');
    moneyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],  // Initially, no data points
            datasets: [{
                label: 'Views',
                data: [],  // Initially, no data points
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },{
                label: 'Income',
                data: [],  // Initially, no data points
                fill: false,
                borderColor: 'rgb(256, 10, 10)',
                tension: 0.1
            }]
        },
    });
});

function newColumn() {
    if(moneyChart.data.labels.length > 100)
    {
        moneyChart.data.labels.shift();
    }
    moneyChart.data.labels.push("");
}

function updateMoney(newMoneyValue) {

    if (moneyChart.data.datasets[1].data.length > 100) {
        moneyChart.data.datasets[1].data.shift();
    }
    // Add a data point with the current time and the new money value
    moneyChart.data.datasets[1].data.push(newMoneyValue);
    // Remove the first data point if there are too many

    // Update the chart
    moneyChart.update();
}


function updateViews(newViewsValue) {

    if (moneyChart.data.datasets[0].data.length > 100) {
        moneyChart.data.datasets[0].data.shift();
    }
    // Add a data point with the current time and the new money value
    moneyChart.data.datasets[0].data.push(newViewsValue);
    // Remove the first data point if there are too many

    // Update the chart
    moneyChart.update();
}
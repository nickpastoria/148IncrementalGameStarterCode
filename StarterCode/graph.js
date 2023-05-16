let moneyChart;

$(document).ready(function() {
    // Initialize the chart
    let ctx = document.getElementById('moneyChart').getContext('2d');
    moneyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],  // Initially, no data points
            datasets: [{
                label: 'Money Over Time',
                data: [],  // Initially, no data points
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
    });
});

// Then in your game logic, whenever the money value changes, add a data point to the chart:
function updateMoney(newMoneyValue) {
    // Add a data point with the current time and the new money value
    moneyChart.data.labels.push(new Date().toLocaleTimeString());
    moneyChart.data.datasets[0].data.push(newMoneyValue);
    // Remove the first data point if there are too many
    if (moneyChart.data.labels.length > 100) {
        moneyChart.data.labels.shift();
        moneyChart.data.datasets[0].data.shift();
    }
    // Update the chart
    moneyChart.update();
}

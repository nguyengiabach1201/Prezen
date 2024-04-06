function fromHTML(html, trim = true) {
    html = trim ? html : html.trim();
    if (!html) return null;
    const template = document.createElement('template');
    template.innerHTML = html;
    const result = template.content.children;
    if (result.length === 1) return result[0];
    return result;
}

let charts = document.querySelectorAll('.chart');
console.log(charts);
charts.forEach(chart => {
    let str = chart.innerHTML;
    let strs = str.split('\n');
    let rawData = [];

    strs.forEach(str => {
        while (str.charAt(0) == ' ' || str.charAt(0) == '\n') {
            str = str.substring(1);
        }

        if (str.length > 1) rawData.push(str);
    });

    chart.innerHTML = '';
    chartCanvas = fromHTML('<canvas></canvas>');
    chart.appendChild(chartCanvas);
    var ctx = chartCanvas.getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                label: '',
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: {
                tension: {
                    duration: 1000,
                    easing: 'easeInCubic',
                    from: 1,
                    to: 0,
                    loop: true
                }
            },
        }
    });

    rawData.forEach(data => {
        data = data.split(":")
        let name = data[0];
        let value = data[1];
        if (!isNaN(data[1])) value = parseFloat(data[1]);

        if (name != "Name") {
            myChart.data.labels.push(name);
            myChart.data.datasets.forEach((dataset) => {
                dataset.data.push(value);
            });
            myChart.update();
        } else {
            myChart.data.datasets[0].label = value;
        }
    });
});

console.log("Test chart");

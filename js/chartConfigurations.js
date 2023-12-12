/*
 * Ce fichier contient les fonctions qui retournent des configurations de graphique
 */

function getBarChartConfig(data, labels, title) {
    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: data.map(dataset => ({
                ...dataset,
                borderWidth: 1
            }))
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
}


function getPieChartConfig(data, labels, title,detail) {
    return {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: detail,
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(0, 128, 0, 0.5)',
                    'rgba(255, 0, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(0, 128, 0, 1)',
                    'rgba(255, 0, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            }
        },
    };
}


function getLineChartConfig(data, labels, title) {
    return {
        type: 'line',
        data: {
            labels: labels,
            datasets: data.map(dataset => ({
                ...dataset,
                fill: false,
                borderColor: dataset.backgroundColor,
                borderWidth: 2,
                tension: 0.1 // Cette propriété rend les lignes légèrement courbées
            }))
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: title
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };
}

function getDoughnutChartConfig(data, labels, title, detail) {
    return {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: detail,
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(0, 128, 0, 0.5)',
                    'rgba(255, 0, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(0, 128, 0, 1)',
                    'rgba(255, 0, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            }
        },
    };
}


// Exportez la fonction pour l'utiliser dans main.js
export { getBarChartConfig, getPieChartConfig, getLineChartConfig, getDoughnutChartConfig };


/*
 * Ce fichier contient les fonctions qui retournent des configurations de graphique
 */

/**
 * Permet de créer un graphique de type 'bar'
 * @param id - l'id du graphique
 * @param data - les données du graphique
 * @param labels - les labels du graphique
 * @param title - le titre du graphique
 * @returns {Chart}
 */
function createBarChart(id, data, labels, title) {
    return new Chart(document.getElementById(id).getContext('2d'), getBarChartConfig(data, labels, title));
}

/**
 * Permet de créer un graphique de type 'pie'
 * @param id - l'id du graphique
 * @param data - les données du graphique
 * @param labels - les labels du graphique
 * @param title - le titre du graphique
 * @param detail - le détail du graphique
 * @returns {Chart}
 */
function createPieChart(id, data, labels, title,detail) {
    return new Chart(document.getElementById(id).getContext('2d'), getPieChartConfig(data, labels, title,detail));
}

/**
 * Permet de créer un graphique de type 'line'
 * @param id - l'id du graphique
 * @param data - les données du graphique
 * @param labels - les labels du graphique
 * @param title - le titre du graphique
 * @returns {Chart}
 */
function createLineChart(id, data, labels, title) {
    return new Chart(document.getElementById(id).getContext('2d'), getLineChartConfig(data, labels, title));
}

/**
 * Permet de créer un graphique de type 'doughnut'
 * @param id - l'id du graphique
 * @param data - les données du graphique
 * @param labels - les labels du graphique
 * @param title - le titre du graphique
 * @param detail - le détail du graphique
 * @returns {Chart}
 */
function createDoughnutChart(id, data, labels, title,detail) {
    return new Chart(document.getElementById(id).getContext('2d'), getDoughnutChartConfig(data, labels, title,detail));
}

/**
 * Permet de récupérer la configuration d'un graphique de type 'bar'
 * @param data - les données du graphique
 * @param labels - les labels du graphique
 * @param title - le titre du graphique
 * @returns - la configuration du graphique
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
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11
                        },
                        autoSkip: true,
                    }
                }
            }
        }
    };
}

/**
 * Permet de récupérer la configuration d'un graphique de type 'pie'
 * @param data - les données du graphique
 * @param labels - les labels du graphique
 * @param title - le titre du graphique
 * @param detail - le détail du graphique
 * @returns - la configuration du graphique
 */
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
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    }
                }
            }
        },
    };
}

/**
 * Permet de récupérer la configuration d'un graphique de type 'line'
 * @param data - les données du graphique
 * @param labels - les labels du graphique
 * @param title - le titre du graphique
 * @returns  - la configuration du graphique
 */
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
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    };
}

/**
 * Permet de récupérer la configuration d'un graphique de type 'doughnut'
 * @param data - les données du graphique
 * @param labels - les labels du graphique
 * @param title - le titre du graphique
 * @param detail - le détail du graphique
 * @returns  - la configuration du graphique
 */
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
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    }
                }
            }
        },
    };
}


// Exportez la fonction pour l'utiliser dans main.js
export {createBarChart, createDoughnutChart, createLineChart, createPieChart };


import {cleanDataSalary} from './dataProcessor.js';
import {getBarChartConfig, getPieChartConfig} from './chartConfigurations.js';
import { MyDataset } from './MyDataset.js';

$(document).ready(function() {
    // Créer les datasets
    const datasetNA = new MyDataset("../../data/survey_results_NA.json");
    const datasetWE = new MyDataset("../../data/survey_results_WE.json");

    function loadBarChart(id, data, labels, title) {
        return new Chart(document.getElementById(id).getContext('2d'), getBarChartConfig(data, labels, title));
    }

    function loadPieChart(id, data, labels, title) {
        return new Chart(document.getElementById(id).getContext('2d'), getPieChartConfig(data, labels, title));
    }



    // Charger les datasets
    datasetNA.loadDataset();
    datasetWE.loadDataset();

    // Récupérer les données des datasets et les afficher dans la console
    datasetNA.getData().then(data => {
        let cleanData = cleanDataSalary(data);
        console.log("NA : ", cleanData);
    }).catch(error => {
        console.error("Erreur:", error);
    });

    datasetWE.getData().then(data => {
        let cleanData = cleanDataSalary(data);
        console.log("WE : ", cleanData);
    }).catch(error => {
        console.error("Erreur:", error);
    });


    loadBarChart("myChart", [
        {
            label: 'Dataset 1',
            data: [10, 20, 30, 40],
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // couleur de fond personnalisée pour ce dataset
            borderColor: 'rgba(255, 99, 132, 1)' // couleur de bordure personnalisée pour ce dataset
        },
        {
            label: 'Dataset 2',
            data: [40, 30, 20, 10],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)'
        }
    ], ['Blue', 'Yellow', 'Red', 'Green'], "My Bar Chart");

    loadPieChart("myChart2", [300, 50, 100], ['Red', 'Blue', 'Yellow'], "My Pie Chart");
});

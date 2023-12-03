import {cleanDataSalary} from './dataProcessor.js';
import {getBarChartConfig, getPieChartConfig, getLineChartConfig, getDoughnutChartConfig } from './chartConfigurations.js';
import { MyDataset } from './MyDataset.js';

$(document).ready(function() {
    // Créer les datasets
    const datasetNA = new MyDataset("../../data/survey_results_NA.json");
    const datasetWE = new MyDataset("../../data/survey_results_WE.json");

    // Créer une variable globale pour stocker les données
    let datasetGlobal = [];

    /**
     * Permet d'ajouter des données à la variable globale datasetGlobal
     * @param newData
     */
    function addData(newData) {
        datasetGlobal = [...datasetGlobal, ...newData];
    }

    /**
     * Permet de supprimer des données de la variable globale datasetGlobal
     * @param datasetIdentifier
     */
    function removeData(datasetIdentifier) {
        datasetGlobal = datasetGlobal.filter(item => item.source !== datasetIdentifier);
    }

    /**
     * Permet de charger les données des datasets sélectionnés
     */
    function loadData() {
        if (document.getElementById('checkboxNA').checked) {
            datasetNA.loadDataset();
            datasetNA.getData().then(data => {
                let cleanData = cleanDataSalary(data).map(item => ({ ...item, source: 'NA' })); // Nettoyer les données et ajouter la source
                removeData('NA');
                addData(cleanData);
                console.log("NA : ", cleanData);
            }).catch(error => {
                console.error("Erreur:", error);
            });
        } else {
            removeData('NA');
        }

        if (document.getElementById('checkboxWE').checked) {
            datasetWE.loadDataset();
            datasetWE.getData().then(data => {
                let cleanData = cleanDataSalary(data).map(item => ({ ...item, source: 'WE' })); // Nettoyer les données et ajouter la source
                removeData('WE');
                addData(cleanData);
                console.log("WE : ", cleanData);
            }).catch(error => {
                console.error("Erreur:", error);
            });
        } else {
            removeData('WE'); // Supprimez les données EUW si non sélectionnées
        }
    }


    function loadBarChart(id, data, labels, title) {
        return new Chart(document.getElementById(id).getContext('2d'), getBarChartConfig(data, labels, title));
    }

    function loadPieChart(id, data, labels, title) {
        return new Chart(document.getElementById(id).getContext('2d'), getPieChartConfig(data, labels, title));
    }

    function loadLineChart(id, data, labels, title) {
        return new Chart(document.getElementById(id).getContext('2d'), getLineChartConfig(data, labels, title));
    }

    function loadDoughnutChart(id, data, labels, title) {
        return new Chart(document.getElementById(id).getContext('2d'), getDoughnutChartConfig(data, labels, title));
    }



    loadData();

    document.getElementById('loadData').addEventListener('click', function() {
        loadData();
    });

    document.getElementById('showGlobalVar').addEventListener('click', function() {
        console.log("Global : ", datasetGlobal);
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

    loadLineChart("myLineChart", [
        {
            label: 'Dataset 1',
            data: [10, 20, 30, 40],
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // utilisé pour la couleur de la ligne
            borderColor: 'rgba(255, 99, 132, 1)' // couleur de la ligne
        },
        {
            label: 'Dataset 2',
            data: [40, 30, 20, 10],
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // utilisé pour la couleur de la ligne
            borderColor: 'rgba(54, 162, 235, 1)' // couleur de la ligne
        }
    ], ['Janvier', 'Février', 'Mars', 'Avril'], "Mon Graphique en Ligne");

    loadDoughnutChart("myDoughnutChart", [300, 50, 100, 200, 150], ['Red', 'Blue', 'Yellow', 'Green', 'Purple'], "Mon Graphique Doughnut");


});

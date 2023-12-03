import {cleanDataSalary} from './dataProcessor.js';
import {getBarChartConfig, getPieChartConfig} from './chartConfigurations.js';
import { MyDataset } from './MyDataset.js';

$(document).ready(function() {
    // Créer les datasets
    const datasetNA = new MyDataset("../../data/survey_results_NA.json");
    const datasetWE = new MyDataset("../../data/survey_results_WE.json");

    // Créer une variable globale pour stocker les données
    let datasetGlobal = [];


    function loadBarChart(id, data, labels, title) {
        return new Chart(document.getElementById(id).getContext('2d'), getBarChartConfig(data, labels, title));
    }

    function loadPieChart(id, data, labels, title) {
        return new Chart(document.getElementById(id).getContext('2d'), getPieChartConfig(data, labels, title));
    }

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
            removeData('EUW'); // Supprimez les données EUW si non sélectionnées
        }
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
});

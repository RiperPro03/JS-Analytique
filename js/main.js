import {cleanDataSalary } from './dataProcessor.js';
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
    // Charge et traite les données pour NA ou WE
    function loadData(datasetIdentifier) {
        if (datasetIdentifier === 'NA' || datasetIdentifier === 'WE') {
            let dataset = datasetIdentifier === 'NA' ? datasetNA : datasetWE;
            dataset.loadDataset();
            dataset.getData().then(data => {
                let cleanData = cleanDataSalary(data).map(item => ({ ...item, source: datasetIdentifier }));
                removeData(datasetIdentifier);
                addData(cleanData);
                console.log(datasetIdentifier + " : ", cleanData);
            }).catch(error => {
                console.error("Erreur lors du chargement des données de " + datasetIdentifier + ":", error);
            });
        } else {
            removeData(datasetIdentifier);
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


    loadData('NA');

    document.getElementById('datasetSelect').addEventListener('change', function() {
        let selectedValue = this.value;

        if (selectedValue === 'NA' || selectedValue === 'BOTH') {
            loadData('NA');
        } else {
            removeData('NA');
        }

        if (selectedValue === 'WE' || selectedValue === 'BOTH') {
            loadData('WE');
        } else {
            removeData('WE');
        }
    });

    document.getElementById('showGlobalVar').addEventListener('click', function() {
        console.log("Global : ", datasetGlobal);
    });

    loadLineChart("SalParExp", [
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
    ], ['Janvier', 'Février', 'Mars', 'Avril'], "Salaire Moyen par année d'expérience");

    loadBarChart("SalParEtu", [
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
    ], ['Blue', 'Yellow', 'Red', 'Green'], "Salaire Moyen par niveau d'étude");

    loadBarChart("SalParPlatCloud", [
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
    ], ['Blue', 'Yellow', 'Red', 'Green'], "Salaire Moyen par plateforme de cloud");

    loadBarChart("SalParFrameWork", [
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
    ], ['Blue', 'Yellow', 'Red', 'Green'], "Salaire Moyen par plateforme de FrameWork");

    loadPieChart("TopOS", [300, 50, 100], ['Red', 'Blue', 'Yellow'], "top des systèmes d’exploitation par métier");

    loadDoughnutChart("TopOutCom", [300, 50, 100], ['Red', 'Blue', 'Yellow'], "top des outils de communication par métier");

});

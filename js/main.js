import {cleanDataSalary, setInputMinMax, addOptionDataList, removeOptionDataList} from './dataProcessor.js';
import {getBarChartConfig, getPieChartConfig, getLineChartConfig, getDoughnutChartConfig } from './chartConfigurations.js';
import { MyDataset } from './MyDataset.js';

$(document).ready(async function () {
    // Créer les datasets
    const datasetNA = new MyDataset("../../data/survey_results_NA.json"); // Chemin relatif par rapport à index.html
    const datasetWE = new MyDataset("../../data/survey_results_WE.json"); // Chemin relatif par rapport à index.html

    // Créer une variable globale pour stocker les données
    let datasetGlobal = [];
    let paysGlobaux = [];
    let metiersGlobaux = [];

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
                let cleanData = cleanDataSalary(data, 1000, 1000000).map(item => ({
                    ...item,
                    source: datasetIdentifier
                }));
                removeData(datasetIdentifier);
                datasetGlobal = [...datasetGlobal, ...cleanData];
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

    async function updateDataset() {
        let selectedValue = document.getElementById('datasetSelect').value;
        try {
            if (selectedValue === 'NA' || selectedValue === 'BOTH') {
                await loadData('NA');
                let paysNA = await datasetNA.getAllPays();
                let metiersNA = await datasetNA.getAllMetiers();
                paysGlobaux = selectedValue === 'BOTH' ? [...paysGlobaux, ...paysNA] : paysNA;
                metiersGlobaux = selectedValue === 'BOTH' ? [...metiersGlobaux, ...metiersNA] : metiersNA;
            }

            if (selectedValue === 'WE' || selectedValue === 'BOTH') {
                await loadData('WE');
                let paysWE = await datasetWE.getAllPays();
                let metiersWE = await datasetWE.getAllMetiers();
                paysGlobaux = selectedValue === 'BOTH' ? [...paysGlobaux, ...paysWE] : paysWE;
                metiersGlobaux = selectedValue === 'BOTH' ? [...metiersGlobaux, ...metiersWE] : metiersWE;
            }

            // Supprimer les doublons
            paysGlobaux = [...new Set(paysGlobaux)];
            metiersGlobaux = [...new Set(metiersGlobaux)];

            removeOptionDataList("pays-List");
            removeOptionDataList("metier-List");
            addOptionDataList("pays-List", paysGlobaux);
            addOptionDataList("metier-List", metiersGlobaux);

        } catch (error) {
            console.error("Une erreur s'est produite :", error);
        }
    }



    document.getElementById('datasetSelect').addEventListener('change', updateDataset);
    await updateDataset();

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
    ], ['Janvier', 'Février', 'Mars', 'Avril'], "Salaire moyen par année d'expérience");

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
    ], ['Blue', 'Yellow', 'Red', 'Green'], "Salaire moyen par niveau d'étude");

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
    ], ['Blue', 'Yellow', 'Red', 'Green'], "Salaire moyen par plateforme de cloud");

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
    ], ['Blue', 'Yellow', 'Red', 'Green'], "Salaire moyen par plateforme de FrameWork");

    loadPieChart("TopOS", [300, 50, 100], ['Red', 'Blue', 'Yellow'], "TOP des systèmes d’exploitation par métier");

    loadDoughnutChart("TopOutCom", [300, 50, 100], ['Red', 'Blue', 'Yellow'], "TOP des outils de communication par métier");



    setInputMinMax("expYearsSalParFrameWork", 0, 50); // Valeurs à set avec les données du dataset
    setInputMinMax("expYearsSalParPlatCloud", 0, 80); // Valeurs à set avec les données du dataset

    let inputsToValidate = document.querySelectorAll('.validate-datalist');

    inputsToValidate.forEach(input => {
        let dataListId = input.getAttribute('list');
        let dataList = document.getElementById(dataListId);

        if (dataList) {
            input.addEventListener('input', function () {
                let valid = Array.from(dataList.options).some(option => option.value === this.value);
                this.classList.toggle('is-invalid', !valid);
            });
        }
    });

});

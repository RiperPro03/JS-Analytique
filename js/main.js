import {
    addOptionDataList,
    cleanDataSalary,
    maxWorkExp,
    minWorkExp,
    moyenneSalaire,
    moyenneSalairePlatFrame,
    removeOptionDataList,
    setInputMinMax,
    topOsCom
} from './dataProcessor.js';
import {
    getBarChartConfig,
    getDoughnutChartConfig,
    getLineChartConfig,
    getPieChartConfig
} from './chartConfigurations.js';
import {MyDataset} from './MyDataset.js';

$(document).ready(async function () {
    // Créer les datasets
    const datasetNA = new MyDataset("../../data/survey_results_NA.json"); // Chemin relatif par rapport à index.html
    const datasetWE = new MyDataset("../../data/survey_results_WE.json"); // Chemin relatif par rapport à index.html

    // Définir les constantes pour prendre en compte que les salaires entre 1000 et 1000000 pour avoir des données pertinentes
    const MAX_SALARY = 1000000;
    const MIN_SALARY = 1000;

    // Créer les variables globales
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
    async function loadData(datasetIdentifier) {
        try {
            if (datasetIdentifier === 'NA' || datasetIdentifier === 'WE') {
                let dataset = datasetIdentifier === 'NA' ? datasetNA : datasetWE;
                await dataset.loadDataset();

                let data = await dataset.getData();
                let cleanData = cleanDataSalary(data, MIN_SALARY, MAX_SALARY).map(item => ({
                    ...item,
                    source: datasetIdentifier
                }));

                removeData(datasetIdentifier);
                datasetGlobal = [...datasetGlobal, ...cleanData];
                console.log(datasetIdentifier + " : ", cleanData);
            } else {
                removeData(datasetIdentifier); // Gérer le cas où l'identifiant n'est ni 'NA' ni 'WE'
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données de " + datasetIdentifier + ":", error);
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

            // Ajouter les données aux datalists pour les inputs pays et métiers
            removeOptionDataList("pays-List");
            removeOptionDataList("metier-List");
            addOptionDataList("pays-List", paysGlobaux);
            addOptionDataList("metier-List", metiersGlobaux);

            // Définir les valeurs min et max des inputs pour l'expérience professionnelle
            let maxWorkExpV = maxWorkExp(datasetGlobal);
            let minWorkExpV = minWorkExp(datasetGlobal);
            console.log("maxWorkExp : ", maxWorkExpV);
            console.log("minWorkExp : ", minWorkExpV);
            setInputMinMax("expYearsSalParFrameWork", minWorkExpV, maxWorkExpV);
            setInputMinMax("expYearsSalParPlatCloud", minWorkExpV, maxWorkExpV);

        } catch (error) {
            console.error("Une erreur s'est produite :", error);
        }
    }



    document.getElementById('datasetSelect').addEventListener('change', updateDataset);
    await updateDataset();

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

    function addListenerToInput1(id, champs, graphVar) {
        document.getElementById(id).addEventListener('change', () => {
            if (document.getElementById(id).checkValidity()) {
                let resultats = moyenneSalaire(datasetGlobal, champs, document.getElementById(id).value);
                let labels = Object.keys(resultats);

                graphVar.data.datasets[0].data = labels.map(label => resultats[label]);
                graphVar.data.labels = labels;
                graphVar.update();
            }
        });
    }

    function addListenerToInput2(id_pays, id_exp, champs, graphVar) {
        function updateGraph() {
            let resultats;
            let labels;

            const paysValid = document.getElementById(id_pays).checkValidity();
            const expValid = document.getElementById(id_exp).checkValidity();

            if (paysValid && expValid) {
                resultats = moyenneSalairePlatFrame(datasetGlobal, champs, document.getElementById(id_pays).value, document.getElementById(id_exp).value);
            } else if (document.getElementById(id_pays).checkValidity()) {
                resultats = moyenneSalairePlatFrame(datasetGlobal, champs, document.getElementById(id_pays).value);
            }

            if (resultats) {
                labels = Object.keys(resultats);
                graphVar.data.datasets[0].data = labels.map(label => resultats[label]);
                graphVar.data.labels = labels;
                graphVar.update();
            }
        }

        document.getElementById(id_pays).addEventListener('change', updateGraph);
        document.getElementById(id_exp).addEventListener('change', updateGraph);
    }

    function addListenerToInput3(id_pays, id_metier, id_top, champs, graphVar) {
        function updateGraph() {
            let resultats;
            let labels;

            const paysValid = document.getElementById(id_pays).checkValidity();
            const metierValid = document.getElementById(id_metier).checkValidity();
            const topValue = document.getElementById(id_top).value;

            if (paysValid && metierValid) {
                resultats = topOsCom(datasetGlobal, champs, document.getElementById(id_pays).value, document.getElementById(id_metier).value, topValue);
            } else if (paysValid) {
                resultats = topOsCom(datasetGlobal, champs, document.getElementById(id_pays).value, null, topValue);
            } else if (metierValid) {
                resultats = topOsCom(datasetGlobal, champs, null,document.getElementById(id_metier).value, topValue);
            }

            if (resultats) {
                labels = Object.keys(resultats).slice(0, topValue); // Récupère les 'top' éléments
                graphVar.data.datasets[0].data = labels.map(label => resultats[label]);
                graphVar.data.labels = labels;
                graphVar.update();
            }
        }

        document.getElementById(id_pays).addEventListener('change', updateGraph);
        document.getElementById(id_metier).addEventListener('change', updateGraph);
        document.getElementById(id_top).addEventListener('change', updateGraph);
    }



    let resultatsSPE = moyenneSalaire(datasetGlobal, "WorkExp");
// Préparation des données pour le graphique
    console.log(resultatsSPE);
    let labelsSPE = Object.keys(resultatsSPE);
    let dataValuesSPE = labelsSPE.map(label => resultatsSPE[label]);
    let SalParExp = loadLineChart("SalParExp", [
        {
            label: 'Dataset 1',
            data: dataValuesSPE,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // utilisé pour la couleur de la ligne
            borderColor: 'rgba(255, 99, 132, 1)' // couleur de la ligne
        }
    ],labelsSPE, "Salaire moyen par année d'expérience");

    addListenerToInput1('parameterSearchSalParExp', 'WorkExp', SalParExp);

    let resultatsSPEtu = moyenneSalaire(datasetGlobal, "EdLevel");
    let labelsSPEtu = Object.keys(resultatsSPEtu);
    let dataValuesSPEtu = labelsSPEtu.map(label => resultatsSPEtu[label]);
    let SalParEtu = loadBarChart("SalParEtu", [
        {
            label: 'Dataset 1',
            data: dataValuesSPEtu,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // couleur de fond personnalisée pour ce dataset
            borderColor: 'rgba(255, 99, 132, 1)' // couleur de bordure personnalisée pour ce dataset
        }
    ], labelsSPEtu, "Salaire moyen par niveau d'étude");

    addListenerToInput1('parameterSearchSalParEtu', 'EdLevel', SalParEtu);


    let resultatsSPlat = moyenneSalairePlatFrame(datasetGlobal, "PlatformHaveWorkedWith");
    let labelsSPlat = Object.keys(resultatsSPlat);
    let dataValuesSPlat = labelsSPlat.map(label => resultatsSPlat[label]);
    let SalParPlatCloud = loadBarChart("SalParPlatCloud", [
        {
            label: 'Dataset 1',
            data: dataValuesSPlat,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // couleur de fond personnalisée pour ce dataset
            borderColor: 'rgba(255, 99, 132, 1)' // couleur de bordure personnalisée pour ce dataset
        }
    ], labelsSPlat, "Salaire moyen par plateforme de cloud");

    addListenerToInput2('parameterSearchSalParPlatCloud', 'expYearsSalParPlatCloud', 'PlatformHaveWorkedWith', SalParPlatCloud);


    let resultatsSFrame = moyenneSalairePlatFrame(datasetGlobal, "WebframeHaveWorkedWith");
    let labelsSFrame = Object.keys(resultatsSFrame);
    let dataValuesSFrame = labelsSFrame.map(label => resultatsSFrame[label]);
    let SalParFrameWork = loadBarChart("SalParFrameWork", [
        {
            label: 'Dataset 1',
            data: dataValuesSFrame,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // couleur de fond personnalisée pour ce dataset
            borderColor: 'rgba(255, 99, 132, 1)' // couleur de bordure personnalisée pour ce dataset
        }
    ], labelsSFrame, "Salaire moyen par plateforme de FrameWork");

    addListenerToInput2('parameterSalParFrameWork', 'expYearsSalParFrameWork', 'WebframeHaveWorkedWith', SalParFrameWork);


    let resultatsTOPOs = topOsCom(datasetGlobal, "OpSysProfessionaluse");
    let labelsTOPOs = Object.keys(resultatsTOPOs);
    let dataValuesTOPOs = labelsTOPOs.map(label => resultatsTOPOs[label]);
    let TopOS = loadPieChart("TopOS", dataValuesTOPOs, labelsTOPOs, "TOP des systèmes d’exploitation par métier");

    addListenerToInput3('parameterSearchTopOS', 'parameterSearchTopOS2', 'dropdownMenuTopOS', 'OpSysProfessionaluse', TopOS);

    let resultatsTOPCom = topOsCom(datasetGlobal, "OpSysProfessionaluse");
    let labelsTOPCom = Object.keys(resultatsTOPCom);
    let dataValuesTOPCom = labelsTOPCom.map(label => resultatsTOPCom[label]);
    let TopOutCom = loadDoughnutChart("TopOutCom", dataValuesTOPCom, labelsTOPCom, "TOP des outils de communication par métier");

    addListenerToInput3('parameterSearchTopOutCom', 'parameterSearchTopOutCom2', 'dropdownMenuTopOutCom', 'OpSysProfessionaluse', TopOutCom);
});

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


    function createBarChart(id, data, labels, title) {
        return new Chart(document.getElementById(id).getContext('2d'), getBarChartConfig(data, labels, title));
    }

    function createPieChart(id, data, labels, title,detail) {
        return new Chart(document.getElementById(id).getContext('2d'), getPieChartConfig(data, labels, title,detail));
    }

    function createLineChart(id, data, labels, title) {
        return new Chart(document.getElementById(id).getContext('2d'), getLineChartConfig(data, labels, title));
    }

    function createDoughnutChart(id, data, labels, title,detail) {
        return new Chart(document.getElementById(id).getContext('2d'), getDoughnutChartConfig(data, labels, title,detail));
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

            const resetButtons = document.querySelectorAll('.reset-button');
            resetButtons.forEach(button => button.click());

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

    function msgErrorGraph(graphVar, dataObject, errorMessageElementId) {
        const isEmptyData = Object.keys(dataObject).length === 0;

        if (isEmptyData) {
            document.getElementById(errorMessageElementId).style.display = "block";
            if (graphVar) graphVar.canvas.style.display = "none";
        } else {
            document.getElementById(errorMessageElementId).style.display = "none";
            if (graphVar) graphVar.canvas.style.display = "block";
        }
    }

    function addListenerToInput1(id, champs, graphVar, errorMessageElementId) {
        document.getElementById(id).addEventListener('change', () => {
            if (document.getElementById(id).checkValidity()) {
                let resultats = moyenneSalaire(datasetGlobal, champs, document.getElementById(id).value);
                msgErrorGraph(graphVar, resultats, errorMessageElementId);
                let labels = Object.keys(resultats);

                graphVar.data.datasets[0].data = labels.map(label => resultats[label]);
                graphVar.data.labels = labels;
                graphVar.update();
            }
        });
    }

    function addListenerToInput2(id_pays, id_exp, champs, graphVar, errorMessageElementId) {
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
            msgErrorGraph(graphVar, resultats, errorMessageElementId);
        }

        document.getElementById(id_pays).addEventListener('change', updateGraph);
        document.getElementById(id_exp).addEventListener('change', updateGraph);
    }

    function addListenerToInput3(id_pays, id_metier, id_top, champs, graphVar, errorMessageElementId) {
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
            msgErrorGraph(graphVar, resultats, errorMessageElementId);
        }

        document.getElementById(id_pays).addEventListener('change', updateGraph);
        document.getElementById(id_metier).addEventListener('change', updateGraph);
        document.getElementById(id_top).addEventListener('change', updateGraph);
    }

    function setupResetButton(buttonId, inputIds) {
        const resetButton = document.getElementById(buttonId);
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                inputIds.forEach(function(inputId) {
                    const inputElement = document.getElementById(inputId);
                    if (inputElement) {
                        inputElement.value = '';
                        inputElement.dispatchEvent(new Event('change'));
                    }
                });
            });
        }
    }


    let resultatsSPE = moyenneSalaire(datasetGlobal, "WorkExp");
    let labelsSPE = Object.keys(resultatsSPE);
    let dataValuesSPE = labelsSPE.map(label => resultatsSPE[label]);
    let SalParExp = createLineChart("SalParExp", [
        {
            label: 'Salaire moyen',
            data: dataValuesSPE,
            backgroundColor: 'rgba(255, 228, 98, 0.75)',
            borderColor: 'rgba(246, 200, 95, 1)'
        }
    ],labelsSPE, "Salaire moyen par année d'expérience");
    msgErrorGraph(SalParExp, resultatsSPE, 'ErrorSalParExp');
    addListenerToInput1('parameterSearchSalParExp', 'WorkExp', SalParExp, 'ErrorSalParExp');
    setupResetButton('resetButtonSalParExp', ['parameterSearchSalParExp']);

    let resultatsSPEtu = moyenneSalaire(datasetGlobal, "EdLevel");
    let labelsSPEtu = Object.keys(resultatsSPEtu);
    let dataValuesSPEtu = labelsSPEtu.map(label => resultatsSPEtu[label]);
    let SalParEtu = createBarChart("SalParEtu", [
        {
            label: 'Salaire moyen',
            data: dataValuesSPEtu,
            backgroundColor: 'rgba(135, 206, 250, 0.75)',
            borderColor: 'rgba(70, 130, 180, 1)'
        }
    ], labelsSPEtu, "Salaire moyen par niveau d'étude");
    msgErrorGraph(SalParEtu, resultatsSPEtu, 'ErrorSalParEtu');
    addListenerToInput1('parameterSearchSalParEtu', 'EdLevel', SalParEtu, 'ErrorSalParEtu');
    setupResetButton('resetButtonSalParEtu', ['parameterSearchSalParEtu']);


    let resultatsSPlat = moyenneSalairePlatFrame(datasetGlobal, "PlatformHaveWorkedWith");
    let labelsSPlat = Object.keys(resultatsSPlat);
    let dataValuesSPlat = labelsSPlat.map(label => resultatsSPlat[label]);
    let SalParPlatCloud = createBarChart("SalParPlatCloud", [
        {
            label: 'Salaire moyen',
            data: dataValuesSPlat,
            backgroundColor: 'rgba(16, 193, 241, 0.75)',
            borderColor: 'rgba(11, 132, 165, 1)'
        }
    ], labelsSPlat, "Salaire moyen par plateforme de cloud");
    msgErrorGraph(SalParPlatCloud, resultatsSPlat, 'ErrorSalParPlatCloud');
    addListenerToInput2('parameterSearchSalParPlatCloud', 'expYearsSalParPlatCloud', 'PlatformHaveWorkedWith', SalParPlatCloud, 'ErrorSalParPlatCloud');
    setupResetButton('resetButtonSalParPlatCloud', ['parameterSearchSalParPlatCloud', 'expYearsSalParPlatCloud']);


    let resultatsSFrame = moyenneSalairePlatFrame(datasetGlobal, "WebframeHaveWorkedWith");
    let labelsSFrame = Object.keys(resultatsSFrame);
    let dataValuesSFrame = labelsSFrame.map(label => resultatsSFrame[label]);
    let SalParFrameWork = createBarChart("SalParFrameWork", [
        {
            label: 'Salaire moyen',
            data: dataValuesSFrame,
            backgroundColor: 'rgba(32, 224, 116, 0.75)',
            borderColor: 'rgba(24, 173, 89, 1)'
        }
    ], labelsSFrame, "Salaire moyen par plateforme de FrameWork");
    msgErrorGraph(SalParFrameWork, resultatsSFrame, 'ErrorSalParFrameWork');
    addListenerToInput2('parameterSalParFrameWork', 'expYearsSalParFrameWork', 'WebframeHaveWorkedWith', SalParFrameWork, 'ErrorSalParFrameWork');
    setupResetButton('resetButtonSalParFrameWork', ['parameterSalParFrameWork', 'expYearsSalParFrameWork']);


    let resultatsTOPOs = topOsCom(datasetGlobal, "OpSysProfessionaluse");
    let labelsTOPOs = Object.keys(resultatsTOPOs);
    let dataValuesTOPOs = labelsTOPOs.map(label => resultatsTOPOs[label]);
    let TopOS = createPieChart("TopOS", dataValuesTOPOs, labelsTOPOs, "TOP des systèmes d’exploitation par métier","Nombre d'utilisation");
    msgErrorGraph(TopOS, resultatsTOPOs, 'ErrorTopOS');
    addListenerToInput3('parameterSearchTopOS', 'parameterSearchTopOS2', 'dropdownMenuTopOS', 'OpSysProfessionaluse', TopOS, 'ErrorTopOS');
    setupResetButton('resetButtonTopOS', ['parameterSearchTopOS', 'parameterSearchTopOS2']);

    let resultatsTOPCom = topOsCom(datasetGlobal, "OfficeStackSyncHaveWorkedWith");
    let labelsTOPCom = Object.keys(resultatsTOPCom);
    let dataValuesTOPCom = labelsTOPCom.map(label => resultatsTOPCom[label]);
    let TopOutCom = createDoughnutChart("TopOutCom", dataValuesTOPCom, labelsTOPCom, "TOP des outils de communication par métier", "Nombre d'utilisation");
    msgErrorGraph(TopOutCom, resultatsTOPCom, 'ErrorTopOutCom');
    addListenerToInput3('parameterSearchTopOutCom', 'parameterSearchTopOutCom2', 'dropdownMenuTopOutCom', 'OfficeStackSyncHaveWorkedWith', TopOutCom, 'ErrorTopOutCom');
    setupResetButton('resetButtonTopOutCom', ['parameterSearchTopOutCom', 'parameterSearchTopOutCom2']);
});

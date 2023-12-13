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
    createBarChart,
    createDoughnutChart,
    createLineChart,
    createPieChart
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
            } else {
                removeData(datasetIdentifier); // Gérer le cas où l'identifiant n'est ni 'NA' ni 'WE'
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données de " + datasetIdentifier + ":", error);
        }
    }

    /**
     * Permet de mettre à jour les datasets
     * @returns {Promise<void>}
     */
    async function updateDataset() {
        let selectedValue = document.getElementById('datasetSelect').value;
        try {
            // Charger les données des datasets sélectionnés
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
            setInputMinMax("expYearsSalParFrameWork", minWorkExpV, maxWorkExpV);
            setInputMinMax("expYearsSalParPlatCloud", minWorkExpV, maxWorkExpV);

            // Réinitialiser les filtres des graphiques
            const resetButtons = document.querySelectorAll('.reset-button');
            resetButtons.forEach(button => button.click());

        } catch (error) {
            console.error("Une erreur s'est produite :", error);
        }
    }

    /**
     * Permet d'afficher un message d'erreur si le graphique est vide
     * @param graphVar - la variable du graphique
     * @param dataObject - l'objet contenant les données
     * @param errorMessageElementId - l'id de l'élément d'erreur
     */
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

    /**
     * Permet d'ajouter un listener aux inputs avec 1 paramètre
     * @param id - l'id de l'input
     * @param champs - le champs à traiter
     * @param graphVar - la variable du graphique
     * @param errorMessageElementId - l'id de l'élément d'erreur
     */
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

    /**
     * Permet d'ajouter un listener aux inputs avec 2 paramètres
     * @param id_pays - l'id de l'input pays
     * @param id_exp - l'id de l'input année d'expérience
     * @param champs - le champs à traiter
     * @param graphVar - la variable du graphique
     * @param errorMessageElementId - l'id de l'élément d'erreur
     */
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

    /**
     * Permet d'ajouter un listener aux inputs avec 3 paramètres
     * @param id_pays - l'id de l'input pays
     * @param id_metier - l'id de l'input métier
     * @param id_top - l'id de l'input top
     * @param champs - le champs à traiter
     * @param graphVar - la variable du graphique
     * @param errorMessageElementId - l'id de l'élément d'erreur
     */
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

    /**
     * Permet de setup le bouton reset
     * @param buttonId
     * @param inputIds
     */
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

    /**
     * Permet de préparer les données pour les graphiques
     * @param moyenneFunction - la fonction de moyenne à utiliser
     * @param dataset - le dataset à traiter
     * @param param - le paramètre à traiter
     * @returns {{dataValues: *[], labels: string[]}}
     */
    function prepareChartData(moyenneFunction, dataset, param) {
        let resultats = moyenneFunction(dataset, param);
        return {
            labels: Object.keys(resultats),
            dataValues: Object.keys(resultats).map(label => resultats[label])
        };
    }

    /**
     * Permet de setup un graphique de type line ou bar
     * @param type - le type de graphique
     * @param containerId - l'id du container
     * @param data - les données du graphique
     * @param backgroundColor - la couleur de fond
     * @param borderColor - la couleur de la bordure
     * @param title - le titre du graphique
     * @param errorMsgContainer - l'id de l'élément d'erreur
     * @param inputParams - les paramètres des inputs
     * @param resetButtonId - l'id du bouton reset
     * @param listenerType - le type de listener
     */
    function setupChart(type, containerId, data, backgroundColor, borderColor, title, errorMsgContainer, inputParams, resetButtonId, listenerType) {
        let chart = type === 'line' ? createLineChart : createBarChart;
        let chartData = {
            label: 'Salaire moyen',
            data: data.dataValues,
            backgroundColor: backgroundColor,
            borderColor: borderColor
        };

        let newChart = chart(containerId, [chartData], data.labels, title);
        msgErrorGraph(newChart, data, errorMsgContainer);

        if (listenerType === 'input1') {
            addListenerToInput1(inputParams[0], inputParams[1], newChart, errorMsgContainer);
        } else if (listenerType === 'input2') {
            addListenerToInput2(inputParams[0], inputParams[1], inputParams[2], newChart, errorMsgContainer);
        }

        setupResetButton(resetButtonId, inputParams.slice(0, -1));
    }

    /**
     * Permet de setup un graphique de type pie ou doughnut
     * @param type - le type de graphique
     * @param containerId - l'id du container
     * @param data - les données du graphique
     * @param title - le titre du graphique
     * @param errorMsgContainer - l'id de l'élément d'erreur
     * @param inputParams - les paramètres des inputs
     * @param resetButtonId - l'id du bouton reset
     */
    function setupPieDoughnutChart(type, containerId, data, title, errorMsgContainer, inputParams, resetButtonId) {
        let chart = type === 'pie' ? createPieChart : createDoughnutChart;
        let newChart = chart(containerId, data.dataValues, data.labels, title);
        msgErrorGraph(newChart, data, errorMsgContainer);
        addListenerToInput3(inputParams[0], inputParams[1], inputParams[2], inputParams[3], newChart, errorMsgContainer);
        setupResetButton(resetButtonId, inputParams.slice(0, 2));
    }

    // ----------------- MAIN -----------------

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

    let dataSalParExp = prepareChartData(moyenneSalaire, datasetGlobal, "WorkExp");
    setupChart('line', 'SalParExp', dataSalParExp, 'rgba(255, 228, 98, 0.75)', 'rgba(246, 200, 95, 1)',
        "Salaire moyen par année d'expérience (€)", 'ErrorSalParExp', ['parameterSearchSalParExp', 'WorkExp'], 'resetButtonSalParExp', 'input1');

    let dataSalParEtu = prepareChartData(moyenneSalaire, datasetGlobal, "EdLevel");
    setupChart('bar', 'SalParEtu', dataSalParEtu, 'rgba(189,135,250,0.75)', 'rgb(131,70,180)',
        "Salaire moyen par niveau d'étude (€)", 'ErrorSalParEtu', ['parameterSearchSalParEtu', 'EdLevel'], 'resetButtonSalParEtu', 'input1');


    let dataSalParPlatCloud = prepareChartData(moyenneSalairePlatFrame, datasetGlobal, "PlatformHaveWorkedWith");
    setupChart('bar', 'SalParPlatCloud', dataSalParPlatCloud, 'rgba(16, 193, 241, 0.75)', 'rgba(11, 132, 165, 1)',
        "Salaire moyen par plateforme de cloud (€)", 'ErrorSalParPlatCloud', ['parameterSearchSalParPlatCloud', 'expYearsSalParPlatCloud', 'PlatformHaveWorkedWith'], 'resetButtonSalParPlatCloud', 'input2');

    let dataSalParFrameWork = prepareChartData(moyenneSalairePlatFrame, datasetGlobal, "WebframeHaveWorkedWith");
    setupChart('bar', 'SalParFrameWork', dataSalParFrameWork, 'rgba(32, 224, 116, 0.75)', 'rgba(24, 173, 89, 1)',
        "Salaire moyen par plateforme de FrameWork (€)", 'ErrorSalParFrameWork', ['parameterSalParFrameWork', 'expYearsSalParFrameWork', 'WebframeHaveWorkedWith'], 'resetButtonSalParFrameWork', 'input2');

    let dataTopOS = prepareChartData(topOsCom, datasetGlobal, "OpSysProfessionaluse");
    setupPieDoughnutChart('pie', 'TopOS', dataTopOS, "TOP des systèmes d’exploitation par métier", 'ErrorTopOS',
        ['parameterSearchTopOS', 'parameterSearchTopOS2', 'dropdownMenuTopOS', 'OpSysProfessionaluse', 'ErrorTopOS'],
        'resetButtonTopOS');

    let dataTopOutCom = prepareChartData(topOsCom, datasetGlobal, "OfficeStackSyncHaveWorkedWith");
    setupPieDoughnutChart('doughnut', 'TopOutCom', dataTopOutCom, "TOP des outils de communication par métier", 'ErrorTopOutCom',
        ['parameterSearchTopOutCom', 'parameterSearchTopOutCom2', 'dropdownMenuTopOutCom', 'OfficeStackSyncHaveWorkedWith', 'ErrorTopOutCom'],
        'resetButtonTopOutCom');
});
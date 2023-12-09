/*
 * Ce fichier contient les fonctions pour traiter les données
 */

/**
 * Permet de nettoyer et de filtrer les données de salaire pour les garder les données pertinentes
 * et les convertir en euros
 * @param data - les données à nettoyer
 * @param minSalary - le salaire minimum
 * @param maxSalary - le salaire maximum
 * @returns {*} - les données nettoyées
 */
function cleanDataSalary(data, minSalary, maxSalary) {

    return data.filter(row => {
        // Vérifier si CompTotal n'est pas 'NA' et est dans la plage de salaire spécifiée
        const isSalaryValid = row.CompTotal !== 'NA' && row.CompTotal >= minSalary && row.CompTotal <= maxSalary;

        if (row.Currency && row.Currency !== 'NA') {
            // Prend la première partie avant tout espace blanc
            const currencyCode = row.Currency.split(/\s+/)[0];
            // Convertir le salaire en euros si CompTotal est valide
            if (isSalaryValid) {
                row.CompTotal = currencyToEur(row.CompTotal, currencyCode);
            }
        }

        // Garder la ligne seulement si le salaire est valide
        return isSalaryValid;
    });
}


/**
 * Permet de convertir une valeur de devise en euros
 * @param value - la valeur à convertir
 * @param currency - la devise de la valeur
 * @returns {number|*} - la valeur convertie en euros
 */
function currencyToEur(value, currency) {
    const exchangeRates = {
        "usd": 0.91505346,
        "cad": 0.66721591,
        "aed": 0.24916364,
        "aud": 0.5995035,
        "ugx": 0.00024212891,
        "crc": 0.0017178792,
        "gbp": 1.1424225,
        "hkd": 0.11738786,
        "bob": 0.13292252,
        "uzs": 0.000074506069,
        "cny": 0.12751318,
        "bam": 0.51129188,
        "inr": 0.010979024,
        "twd": 0.028919455,
        "jpy": 0.0061601497,
        "myr": 0.19595003,
        "sar": 0.24398422,
        "amd": 0.0022914849,
        "ils": 0.24571664,
        "ghs": 0.076588309,
        "pln": 0.22870776,
        "chf": 1.0347302,
        "ang": 0.50961278,
        "xpf": 0.00838,
        "gip": 1.1424867,
        "brl": 0.18644334,
        "all": 0.0096193399,
        "uah": 0.025353731,
        "clp": 0.0010295768,
        "fkp": 1.1425922,
        "lak": 0.000044128093,
        "sll": 0.000040614276,
        "nok": 0.085082368,
        "idr": 0.00005926243,
        "irr": 0.000021678652,
        "afn": 0.013298753,
        "cup": 0.038215611,
        "djf": 0.0051430605,
        "pen": 0.24303475,
        "fjd": 0.40145095,
        "yer": 0.0036552532,
        "awg": 0.51102796,
        "thb": 0.026057263,
        "azn": 0.53809286,
        "qar": 0.25130221,
        "ars": 0.0025845948,
        "huf": 0.0026380392,
        "bif": 0.00032254894,
        "cdf": 0.0003485002,
        "zmw": 0.039341527,
        "zar": 0.049784169,
        "cop": 0.00022354525,
        "bgn": 0.51129188
    };

    if (!currency || currency === "") {
        console.log("Error: la devise n'est pas spécifiée.");
        return;
    }

    if (currency.toLowerCase() === "eur") {
        return parseInt(value);
    }

    let rate = exchangeRates[currency.toLowerCase()];
    if (rate) {
        return value * rate;
    } else {
        console.log("Error: la devise " + currency + " n'est pas supportée.");
        console.log(currency.toLowerCase());
        return;
    }
}

/**
 * Permet de définir les valeurs min et max d'un input
 * @param id - l'id de l'input
 * @param min - la valeur min
 * @param max - la valeur max
 */
function setInputMinMax(id, min, max) {
    let experienceYearsInput = document.getElementById(id);

    experienceYearsInput.min = min;
    experienceYearsInput.max = max;

    experienceYearsInput.addEventListener('input', function () {
        if (!this.checkValidity()) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });
}

/**
 * Permet d'ajouter des valeurs à un input de type datalist
 * @param id - l'id de l'input
 * @param liste - la liste des valeurs à ajouter
 */
function addOptionDataList(id, liste) {
    let dataListPays = document.getElementsByClassName(id);

    liste.forEach(param => {
        let option = document.createElement('option');
        option.value = param;
        Array.from(dataListPays).forEach(dataList => dataList.appendChild(option.cloneNode(true)));
    });
}

/**
 * Permet de supprimer toutes les options des éléments datalist spécifiés par leur classe
 * @param id - l'id de l'input
 */
function removeOptionDataList(id) {
    let dataListElements = document.getElementsByClassName(id);

    Array.from(dataListElements).forEach(dataList => {
        // Supprimer toutes les options du dataList
        while (dataList.firstChild) {
            dataList.removeChild(dataList.firstChild);
        }
    });
}

/**
 * Permet de récupérer la valeur maximale de l'expérience professionnelle
 * @param dataset
 * @returns {*}
 */
function maxWorkExp(dataset) {
    return dataset.reduce((acc, item) => {
        // Assurez-vous que 'WorkExp' est un nombre et pas 'NA' ou une autre valeur non numérique
        let workExp = parseInt(item.WorkExp, 10);
        if (!isNaN(workExp) && workExp > acc) {
            acc = workExp;
        }
        return acc;
    }, 0);
}


/**
 * Permet de récupérer la valeur minimale de l'expérience professionnelle
 * @param dataset
 * @returns {*}
 */
function minWorkExp(dataset) {
    return dataset.reduce((acc, item) => {
        // Convertir 'WorkExp' en un nombre
        let workExp = parseInt(item.WorkExp, 10);
        if (!isNaN(workExp) && workExp < acc) {
            acc = workExp;
        }
        return acc;
    }, Infinity); // Initialiser 'acc' à 'Infinity'
}


function moyenneSalaire(data, champs, pays) {
    let groupes = {};

    data.forEach(entry => {
        if ((!pays || entry.Country === pays) && entry[champs] !== undefined && !isNaN(entry.CompTotal)) {
            const groupeKey = entry[champs];
            groupes[groupeKey] = groupes[groupeKey] || { sum: 0, count: 0 };
            groupes[groupeKey].sum += entry.CompTotal;
            groupes[groupeKey].count += 1;
        }
    });

    let moyennesParGroupe = {};
    for (const groupeKey in groupes) {
        const count = groupes[groupeKey].count;
        moyennesParGroupe[groupeKey] = parseInt(count > 0 ? groupes[groupeKey].sum / count : 0);
    }

    return moyennesParGroupe;
}

// Exportez les fonctions pour les utiliser dans main.js
export {cleanDataSalary, setInputMinMax, addOptionDataList, removeOptionDataList, maxWorkExp, minWorkExp, moyenneSalaire};

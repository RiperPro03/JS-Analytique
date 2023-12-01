/*
 * Ce fichier contient les fonctions pour traiter les données
 */

function processData(data) {
}

/**
 * Récupérer les données depuis un fichier JSON
 * en utilisant une requête AJAX
 * @param cheminUrl - le chemin vers le fichier JSON
 * @returns {Promise<unknown>}
 */
// function getData(cheminUrl) {
//     return $.ajax({
//         type: "GET",
//         url: cheminUrl
//     })
//         .then(function (output) {
//             return output;
//         })
//         .catch(function (http_error) {
//             let server_msg = http_error.responseText;
//             let code = http_error.status;
//             let code_label = http_error.statusText;
//             alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
//         });
// }
function getData(fileContent) {
    try {
        var data = JSON.parse(fileContent);
        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject(error);
    }
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
        "cop": 0.00022354525
    };

    if (!currency || currency === "") {
        console.log("Error: la devise n'est pas spécifiée.");
        return;
    }

    if (currency.toLowerCase() === "eur") {
        return value;
    }

    let rate = exchangeRates[currency.toLowerCase()];
    if (rate) {
        return value * rate;
    } else {
        console.log("Error: la devise " + currency + " n'est pas supportée.");
        return;
    }
}


// Exportez les fonctions pour les utiliser dans main.js
export { processData, getData, currencyToEur };

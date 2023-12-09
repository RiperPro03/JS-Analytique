/**
 * Classe permettant de gérer un dataset
 * @class
 * @param {string} chemin - le chemin du dataset
 */
export class MyDataset {
    constructor(chemin) {
        this.chemin = chemin;
        this.data = null;
    }

    /**
     * Permet de charger le dataset
     */
    loadDataset() {
        this.data = new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: this.chemin
            })
                .then(function (output) {
                    resolve(output);
                })
                .catch(function (http_error) {
                    let server_msg = http_error.responseText;
                    let code = http_error.status;
                    let code_label = http_error.statusText;
                    reject("Erreur " + code + " (" + code_label + ") : " + server_msg);
                });
        });
    }

    /**
     * Permet de récupérer les données du dataset
     * @returns {json} - les données du dataset
     */
    getData() {
        return this.data;
    }

    /**
     * Permet de récupérer la liste des pays sans doublons
     * @returns {array} - la liste des pays
     */
    getAllPays() {
        return this.data.then(data => {
            let allPays = [];
            data.forEach(item => {
                if (!allPays.includes(item.Country)) {
                    allPays.push(item.Country);
                }
            });
            return allPays;
        });
    }

    /**
     * Permet de récupérer la liste des métiers sans doublons
     * @returns {array} - la liste des métiers
     */
    getAllMetiers() {
        return this.data.then(data => {
            let allMetiers = [];
            data.forEach(item => {
                if (!allMetiers.includes(item.DevType)) {
                    allMetiers.push(item.DevType);
                }
            });
            return allMetiers;
        });
    }
}

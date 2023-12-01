export class MyDataset {
    constructor(cheminUrl) {
        this.cheminUrl = cheminUrl;
        this.data = null;
    }

    loadDataset() {
        this.data = new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: this.cheminUrl
            })
                .then(function (output) {
                    // Résoudre la promesse avec les données reçues
                    resolve(output);
                })
                .catch(function (http_error) {
                    // Construire un message d'erreur et rejeter la promesse
                    let server_msg = http_error.responseText;
                    let code = http_error.status;
                    let code_label = http_error.statusText;
                    reject("Erreur " + code + " (" + code_label + ") : " + server_msg);
                });
        });
    }

    getData() {
        return this.data;
    }
}

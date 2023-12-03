export class MyDataset {
    constructor(chemin) {
        this.chemin = chemin;
        this.data = null;
    }

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

    getData() {
        return this.data;
    }
}

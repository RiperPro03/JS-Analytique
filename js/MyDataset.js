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

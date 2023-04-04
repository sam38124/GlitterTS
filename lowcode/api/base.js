export class BaseApi {
    static create(config) {
        return new Promise((resolve, reject) => {
            config.error = (jqXHR, textStatus, errorThrown) => {
                resolve({ result: false, response: jqXHR });
            };
            config.success = (response) => {
                resolve({ result: true, response: response });
            };
            $.ajax(config);
        });
    }
}

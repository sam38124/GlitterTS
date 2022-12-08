const fs = require('fs');
const Axios = require('axios');
var fileDownload = require('js-file-download');
const fsn = require("fs");
const Https = require("https");

async function start() {
    try {
        const src='src/glitterLib'
        if(!fsn.existsSync(src)){
            fs.mkdirSync(src);
        }

        const data = fs.readFileSync('src/glitterDeps.json', 'utf8');
        var json = JSON.parse(data)
        console.log(json)
        for (var a = 0; a < json.dependencies.length; a++) {
            const dd = json.dependencies[a]
            const dir=`${src}/${dd.name}`
            await downloadFile(dd.path,dir)
        }
    } catch
        (err) {
        console.error(err);
    }
}


async function downloadFile (url, targetFile) {
    return await new Promise((resolve, reject) => {
        Https.get(url, response => {
            const code = response.statusCode ?? 0

            if (code >= 400) {
                return reject(new Error(response.statusMessage))
            }

            // handle redirects
            if (code > 300 && code < 400 && !!response.headers.location) {
                return downloadFile(response.headers.location, targetFile)
            }

            // save the file to disk
            const fileWriter = fs
                .createWriteStream(targetFile)
                .on('finish', () => {
                    resolve({})
                })

            response.pipe(fileWriter)
        }).on('error', error => {
            reject(error)
        })
    })
}
 start();
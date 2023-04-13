const fs = require('fs');
const Axios = require('axios');
var fileDownload = require('js-file-download');
const fsn = require("fs");
const Https = require("https");
const fs2 = require("fs-extra");

const  obj={
    create:()=>{
        try {
            var original='node_modules/ts-glitter'
            var src='src'
            process.argv.forEach(function (val, index, array) {
                console.log("for--"+val)
                if(val.indexOf("/create.js")!==-1){
                    original=val.replace('/create.js','/')
                }
            });
            if(fsn.existsSync(src)){
                const checkExists=['glitterDeps.json','index.html','Entry.ts','SEOManager.ts']
                checkExists.map((dd)=>{
                    if(!fsn.existsSync(`${src}/${dd}`)){
                        fs2.copySync(`${original}/lib/${dd}`,`${src}/${dd}`);
                    }
                })
                fs2.copySync(`${original}/lib/glitterBundle`,`${src}/glitterBundle`);
                console.log("Glitter already exist so update glitterBundle ")
            }else{
                fs2.copySync(`${original}/lib`,src);
                fs2.copySync(`${original}/static/tsconfig.json`,'tsconfig.json');
                console.log("Create finish")
            }
        }catch (e){
            console.log(e)
        }
        obj.lib()
    },
    lib:()=>{
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
    }
}
obj.create()

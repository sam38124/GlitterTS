const fs = require("fs");
const path = require("path");
const {exec: exec} = require("child_process");
const outDir = "./";

async function compressJavaScript() {
    const jsFiles = getAllFiles(outDir, ".js");
    new Promise((async (resolve, reject) => {
        const groupSize = 1e3;
        for (const b of chunkArray(jsFiles, groupSize)) {
            let check = groupSize;
            await new Promise(((resolve, reject) => {
                for (const file of b) {
                    const minFile = file.replace(outDir, outDir).replace(/\.js$/, ".js");
                    const cmd = `terser ${file} -o ${minFile}`;
                    console.log(cmd);
                    runAsyncCommand(cmd, {}).then((() => {
                        check = check - 1;
                        if (check === 0) {
                            resolve(true)
                        }
                    })).catch((() => {
                        check = check - 1;
                        if (check === 0) {
                            resolve(true)
                        }
                    }))
                }
            }))
        }
    }))
}

function chunkArray(array, groupSize) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize))
    }
    return result
}

function runAsyncCommand(command, args) {
    return new Promise(((resolve, reject) => {
        try {
            exec(command, ((error, stdout, stderr) => {
                resolve()
            }))
        } catch (e) {
            console.log(e);
            resolve()
        }
    }))
}

function getAllFiles(dir, ext) {
    let files = [];
    fs.readdirSync(dir).forEach((file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (filePath.indexOf("node_modules") === -1) {
                files = files.concat(getAllFiles(filePath, ext))
            }
        } else if (path.extname(file) === ext) {
            files.push(filePath)
        }
    }));
    return files
}

compressJavaScript();
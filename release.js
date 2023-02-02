const fs = require("fs-extra");
const fsn = require("fs");
const path2 = require('path')
try {
    var pathRoot=''
    var src=''
    process.argv.forEach(function (val, index, array) {
        console.log(val)
        if(val.indexOf("path=")!==-1){
            pathRoot=val.replace('path=','')
            console.log(`releasePath:${pathRoot}`);
        }
    });
    fs.copySync('src',pathRoot);
    function readPath(path){
        fsn.readdir(path, (err, files) => {
            files.forEach(file => {
                if(fsn.lstatSync(`${path}/${file}`).isDirectory()){
                    readPath(`${path}/${file}`)
                }else if(path2.extname(`${path}/${file}`)===".ts"){
                    fsn.unlinkSync(`${path}/${file}`);
                }
            });
        });
    }
    readPath(pathRoot)
    console.log("Copy Finish")
}catch (e){}

// fs.copySync('src','/Users/jianzhi.wang/Desktop/square_studio/APP檔案/合宜家居/rtap/rtabmap/app/ios/GlitterUI');
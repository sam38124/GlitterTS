const fs = require("fs-extra");
const fsn = require("fs");
try {
    var original=''
    var src='src'
    process.argv.forEach(function (val, index, array) {
        console.log("for--"+val)
        if(val.indexOf("/create.js")!==-1){
            original=val.replace('/create.js','/')
        }
    });
    console.log(original)
    console.log(src)
    if(fsn.existsSync(src)){
        console.log("Glitter already exist")
    }else{
        fs.copySync(`${original}/lib`,src);
        fs.copySync(`${original}/static/tsconfig.json`,'tsconfig.json');
        console.log("Create finish")
    }
}catch (e){
    console.log(e)
}
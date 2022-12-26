const fs = require('fs-extra');
const fsn = require('fs');
try {
    var original = '.';
    var src = 'src';
    process.argv.forEach(function (val, index, array) {
        console.log('for--' + val);
        if (val.indexOf('/create.js') !== -1) {
            original = val.replace('/create.js', '/');
        }
    });
    if (fsn.existsSync(src)) {
        const checkExists = ['glitterDeps.json', 'index.html', 'Entry.ts'];
        checkExists.map((dd) => {
            if (!fsn.existsSync(`${src}/${dd}`)) {
                fs.copySync(`${original}/lib/${dd}`, `${src}/${dd}`);
            }
        });
        fs.copySync(`${original}/lib/glitterBundle`, `${src}/glitterBundle`);
        console.log('Glitter already exist so update glitterBundle ');
    } else {
        fs.copySync(`${original}/lib`, src);
        fs.copySync(`${original}/static/tsconfig.json`, 'tsconfig.json');
        console.log('Create finish');
    }
    fs.copySync(`${original}/backend_default`, 'backend_default');
} catch (e) {
    console.log(e);
}

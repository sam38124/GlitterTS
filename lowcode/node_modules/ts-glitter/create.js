const fs = require('fs-extra');
const fsn = require('fs');
const path=require('path')
try {
    var original = path.resolve('./node_modules/ts-glitter');
    console.log(original)
    var src = 'src';
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
        fs.copySync(`${original}/backend_default`, 'backend_default');
        console.log('Create finish');
    }

} catch (e) {
    console.log(e);
}

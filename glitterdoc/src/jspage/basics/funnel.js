import { init } from '../../glitterBundle/GVController.js';
import { Doc } from '../../view/doc.js';
import { Items } from '../page-config.js';
import { Galary } from '../../view/galary.js';
init((gvc, glitter, gBundle) => {
    const doc = new Doc(gvc);
    const gallary = new Galary(gvc);
    return {
        onCreateView: () => {
            const topTitle = {
                title: 'Funnel',
                subTitle: 'In GlitterTS, a library that functions effectively used in backend manager',
            };
            const sessions = [
                {
                    id: 'import',
                    title: '<span class="text-danger me-1">★</span> Import',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">First, import funnel class.</h2>
                            ${doc.codePlace(`import { init } from '../../glitterBundle/GVController.js';
import { Funnel } from '../../glitterBundle/funnel.js';

init((gvc) => {
    // new a funnel class
    const funnel = new Funnel(gvc);

    return {
        onCreateView: () => {
            return '<div>Your onCreateView</div>';
        },
    };
});                                
                            `, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'randomString',
                    title: 'Random String',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Print a random string of 10 length.</h2>
                            ${doc.codePlace(`console.log(funnel.randomString(10)); // w2b3ip4gap`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'ObjCompare',
                    title: 'Compare Object',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Checks if two objects are equal.</h2>
                            ${doc.codePlace(`const obj1 = { name: 'West', number: 18 };
const obj2 = { number: 18, name: 'West' };
console.log(funnel.ObjCompare(obj1, obj2)); // true
                            `, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'setFavicon',
                    title: 'Set Head Favorites Icon',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">You can set HTML head icon just use path.</h2>
                            ${doc.codePlace(`funnel.setFavicon('img/funnel_Icon.ico')`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'copyRight',
                    title: 'Copy Right Footer',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Set a copy right sentences in footer (name, url, color).</h2>
                            ${doc.codePlace(`funnel.copyRight('LionDesign', 'https://squarestudio.tw/LionDesign/home', '#6366f1')`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'addQuantile',
                    title: 'Add Quantile',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Let string or number add quantile.</h2>
                            ${doc.codePlace(`console.log(funnel.addQuantile(3165168116)); // 3,165,168,116`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'isUNO',
                    title: 'Is UNO',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Check value is undefined, null, length equals zero.</h2>
                            ${doc.codePlace(`
console.log(funnel.isUNO(0)); // true
console.log(funnel.isUNO(1)); // false

console.log(funnel.isUNO({}));          // true
console.log(funnel.isUNO({ k: 'v' }));  // false

console.log(funnel.isUNO([]));      // true
console.log(funnel.isUNO(['a']));   // false

console.log(funnel.isUNO(''));      // true
console.log(funnel.isUNO('123'));   // false

console.log(funnel.isUNO(null));        // true
console.log(funnel.isUNO(undefined));   // true
                            `, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'isURL',
                    title: 'Is URL',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Check value is a URL.</h2>
                            ${doc.codePlace(`
console.log(funnel.isURL('img/picture.jpg')); // false
console.log(funnel.isURL('127.0.0.1:5500/src/index.html')); // false
console.log(funnel.isURL('ftp://userid:password@ftp.mold.net.tw')); // true
console.log(funnel.isURL('http://127.0.0.1:5500/src/index.html')); // true
console.log(funnel.isURL('https://www.google.com.tw/')); // true
                            `, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'centerImage',
                    title: 'Center Image',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">This method will return a div element, set the image as the background, adjust the scale and center alignment.</h2>
                            ${doc.codePlace(`funnel.centerImage('img/funnel/photo.png')`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'encodeFileBase64',
                    title: 'File to Base64',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Let the file encode to Base64 format.</h2>
                            ${doc.codePlace(`
funnel.encodeFileBase64(file, function (res) {
    const b64_data = res;
});
                            `, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'jsonToCSV',
                    title: 'JSON to CSV & Download File',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Use buildData & downloadCSV methods, it will format JSON to CSV file.</h2>
                            ${doc.codePlace(`
const data = [
    {
        album: 'The White Stripes',
        year: 1999,
        US_peak_chart_post: '-',
    },
    {
        album: 'De Stijl',
        year: 2000,
        US_peak_chart_post: '-',
    },
    {
        album: 'White Blood Cells',
        year: 2001,
        US_peak_chart_post: 61,
    },
    {
        album: 'Elephant',
        year: 2003,
        US_peak_chart_post: 6,
    },
    {
        album: 'Get Behind Me Satan',
        year: 2005,
        US_peak_chart_post: 3,
    },
];

funnel.buildData(data).then((da: any) => {
    funnel.downloadCSV(da, 'getDataCSV'); // "getDataCSV" is file name.
});
                            `, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'optionSreach',
                    title: 'Customizable Select & Option',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Gives you a customizable select box with support for searching, tagging, single or multi select, and callback function.</h2>
                            ${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>Code`,
                                `<i class="bx bx-show-alt fs-base opacity-70 me-2"></i>Single`,
                                `<i class="bx bx-show-alt fs-base opacity-70 me-2"></i>Multi`,
                            ],
                            tab: [
                                doc.codePlace(`
/***
 * path: string; 透過 API 回傳「一個 JSON 陣列」並設為選項的來源，需附帶 URL parameter 作為搜尋的 Key
 * key: string; 陣列中每個物件做為顯示於 HTML Option 的 Key value
 * def: string; 預設 Input 上顯示的值，也就是被 Selected 的值
 * height?: number; 非必要，設定 Select 元素高度，單位為 rem，預設為 8
 * setTime?: number; 非必要，設定在 Input 輸入時敲 API 的間隔時間，預設為 200 毫秒，且必定大於 200 毫秒
 * multi?: boolean; 非必要，使選項能複選，預設為單選
 */

return funnel.optionSreach(
    {
        path: '127.0.0.1/api/order?title=',
        key: 'title',
        def: '001-205-ORDER',
        height: 15,
        setTime: 500,
        multi: true,
    },
    (res) => {
        // 點擊選項的 Callback
        const clickOption = res;
    }
);
                                    `, 'language-typescript'),
                                `<img src="img/opt_single.png" class="rounded-3" style="max-width: 100%;width: 700px;">`,
                                `<img src="img/opt_multi.png" class="rounded-3" style="max-width: 100%;width: 700px;">`,
                            ],
                        })}
                        </section>`;
                    },
                },
                {
                    id: 'encodeFileBase64',
                    title: 'File to Base64',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Let the file encode to Base64 format.</h2>
                            ${doc.codePlace(`
funnel.encodeFileBase64(file, function (res) {
    const b64_data = res;
});
                            `, 'language-typescript')}
                        </section>`;
                    },
                },
            ];
            return doc.create(`
                    <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4">
                        <div
                            class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2"
                        >
                            <div class="me-4">
                                <h1 class="pb-1">${topTitle.title}</h1>
                                <h2 class="fs-lg mb-2 fw-normal fw-500">${topTitle.subTitle}</h2>
                            </div>
                        </div>
                        ${(() => {
                let html = '';
                sessions.map((dd) => (html += dd.html));
                return html;
            })()}
                    </div>
                `, doc.asideScroller(sessions), new Items(topTitle.title, gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});

import { init } from '../../glitterBundle/GVController.js';
import { Doc } from '../../view/doc.js';
import { Items } from '../page-config.js';
import { Galary } from '../../view/galary.js';
init((gvc, glitter, gBundle) => {
    const doc = new Doc(gvc);
    const gallary = new Galary(gvc);
    return {
        onCreateView: () => {
            const sessions = [
                {
                    id: 'create',
                    title: 'Create a Component',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Import GVC, create a basic component.</h2>
${doc.codePlace(`
/* 匯入 GVC */
import { GVC } from '../../glitterBundle/GVController.js';

/* 建立 Hello 的 Class */
export class Hello {
    public sayTheName: (text: string) => string;
    constructor(gvc: GVC) {
        /* 建立方法 sayTheName */
        this.sayTheName = (text: string) => {
            return \`Hello! My name is \${text}\`;
        };
    }
}    
`, 'language-typescript')}
</section>`;
                    },
                },
                {
                    id: 'usage',
                    title: 'Usage',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Import hello.js, new a class and call function.</h2>
${doc.codePlace(`
/* 引入 Hello 的檔案與類別 */
import { init } from '../../glitterBundle/GVController.js';
import { Hello } from './hello.js';

init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            /* 建立與呼叫 */
            const hello = new Hello(gvc);
            return \`Say the name components: \${hello.sayTheName('Andy')}\`;
        },
    };
});
`, 'language-typescript')}
</section>`;
                    },
                },
                {
                    id: 'expand',
                    title: 'Expand Components',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Disassemble the component, different UIs give different methods</h2>
${doc.codePlace(`
    import { GVC } from '../../glitterBundle/GVController.js';

    export class Hello {
        public introduction: (data: { name: string; birthday: string; age: number; text: string; license: boolean }) => string;
        public someDetail: (birthday: string, age: number) => string;
        public drivingLicence = (licence: boolean) => {};
        constructor(gvc: GVC) {
            const self = this;
    
            /* 個人簡介頁面 */
            this.introduction = (data: { name: string; birthday: string; age: number; text: string; license: boolean }) => {
                return /*html*/ \`
                <div>
                    <h1>\${data.name}</h1>
                    \${self.someDetail(data.birthday, data.age)}
                    <div>\${self.drivingLicence(data.license)}</div>
                    <h4>\${data.text}</h4>
                </div>
                \`;
            };
    
            /* 個人詳細資訊的畫面 */
            this.someDetail = (birthday: string, age: number) => {
                return /*html*/ \`
                <div>
                    <h2>\${birthday}</h2>
                    <span>\${age}</span>
                </div>\`;
            };
    
            /* 駕照部分的畫面設計 */
            this.drivingLicence = (licence: boolean) => {
                return /*html*/ \`
                <div>
                    \${(() => {
                        if (licence) {
                            return \`<a class="ok">PASS</a>\`;
                        } else {
                            return \`<a class="notOk">NOT PASS</a>\`;
                        }
                    })()}
                </div>\`;
            };
        }
    }
    
`, 'language-typescript')}
</section>`;
                    },
                },
                {
                    id: 'example',
                    title: 'Show Example',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Get personal infomation (JSON), let code changes can be dynamic and manageable.</h2>
${doc.codePlace(`
import { init } from '../../glitterBundle/GVController.js';
import { Hello } from './hello.js';

init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            const hello = new Hello(gvc);

            /* 獲取資料 (建議格式 JSON) */
            const info = {
                name: 'Jackson Lee',
                birthday: '1998-07-15',
                age: 24,
                license: true,
                text: 'This is my info!',
            };

            /* 回傳正式的個人簡介 HTML */
            return hello.introduction(info);
        },
    };
});

`, 'language-typescript')}
</section>`;
                    },
                },
            ];
            return doc.create(`
                    <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4" style="">
                        <div
                            class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2"
                        >
                            <div class="me-4">
                                <h1 class="pb-1">Components</h1>
                                <h2 class="fs-lg mb-2 fw-normal fw-500">Components are independent and reusable bits of code.</h2>
                            </div>
                        </div>
                        ${(() => {
                let html = '';
                sessions.map((dd) => (html += dd.html));
                return html;
            })()}
                    </div>
                `, doc.asideScroller(sessions), new Items('Components', gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});

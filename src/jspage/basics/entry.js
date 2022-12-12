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
                    id: `SetHome`,
                    title: '<span class="text-danger me-1">★</span>Set Home Page',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">You can write something logic to set home page or do it directly.</h2>
                            ${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>Directly`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>Logic`,
                            ],
                            tab: [
                                doc.codePlace(`'use strict';
import { Glitter } from './glitterBundle/Glitter.js';

export class Entry {
    public static onCreate(glitter: Glitter) {
        // You can set home page directly by absolute path
        glitter.setHome(
            'jspage/' + glitter.getUrlParameter('page') ?? 'jspage/home.js',
            glitter.getUrlParameter('page') ?? 'home',
            {}
        );
    }
}
`, 'language-typescript'),
                                doc.codePlace(`'use strict';
import { Glitter } from './glitterBundle/Glitter.js';

export class Entry {
    public static onCreate(glitter: Glitter) {

        //Use page parameter to determine which page you want to jump and check token exists or switch to login page.
        function needLogin() {
            glitter.setHome('page/LoginPage.js', 'LoginPage', { myData: '5678' });
        }

        switch (glitter.getUrlParameter('page')) {
            case 'MainPage':
                if (glitter.getCookieByName('token') != undefined) {
                    glitter.setHome('page/MainPage.js', 'MainPage', { myData: '12345' });
                } else {
                    needLogin();
                }
                break;
            case 'landing':
                glitter.setHome('page/landing.js', 'landing', { myData: '12345' });
                break;
            case 'LoginPage':
                needLogin();
                break;
            default:
                glitter.setHome('page/landing.js', 'landing', { myData: '12345' });
                break;
        }
    }
}
`, 'language-typescript'),
                            ],
                        })}
                        </section>`;
                    },
                },
                {
                    id: `Option`,
                    title: 'Option - Global Variable',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">You can set value on global env and use it in anywhere.</h2>
${doc.codePlace(`// You can set global value on glitter share obj. 
glitter.share.token = "12345"
glitter.share.myArrayData = ['1','2','3']
glitter.share.myObj = {name:'Fans', target:6, show:true}
        `, 'language-typescript')}
</section>`;
                    },
                },
                {
                    id: `Option1`,
                    title: 'Option - Global Style',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">You can set global style for any page.</h2>
${doc.codePlace(`// String
glitter.addStyleLink('./yourcss.css')

// Array
glitter.addStyleLink(['./yourcss1.css', './yourcss2.css'])

// Style
glitter.addStyle(\`
    html {
        background:black;
    }
    h1 {
        font-weight:700;
    }
\`);
        `, 'language-typescript')}
</section>`;
                    },
                },
                {
                    id: `Option2`,
                    title: 'Option - Global Script',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">You can set global script for any page.</h2>
${doc.codePlace(`glitter.addMtScript(
    ['../bootstrap.min.js', '../moment.min.js'],
    () => {
        // Success callback
    },
    () => {
        // Error callback
    }
);`, 'language-typescript')}
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
                                <h1 class="pb-1">Entry</h1>
                                <h2 class="fs-lg mb-2 fw-normal fw-500">The app entry point is entry.ts</h2>
                            </div>
                        </div>
                        ${(() => {
                let html = '';
                sessions.map((dd) => {
                    html += dd.html;
                });
                return html;
            })()}
                    </div>
                `, doc.asideScroller(sessions), new Items('Entry', gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});

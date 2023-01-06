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
                title: 'Method',
                subTitle: 'Some useful methods can help you to get started with the framework',
            };
            const sessions = [
                {
                    id: 'getUUID',
                    title: 'Get a UUID',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Get a 8-4-4-4-12 format string is based on the record layout for the 16 bytes of the UUID.</h2>
                            ${doc.codePlace(`
const mainID = glitter.getUUID();
console.log(mainID);
`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'cookie',
                    title: 'Cookie',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Use cookie function.</h2>
                            ${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>Set`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>Get`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>Remove`,
                            ],
                            tab: [
                                doc.codePlace(`glitter.setCookie('token', 'qfiqblihjo#qwino@vao&')`, 'language-typescript'),
                                doc.codePlace(`glitter.getCookieByName('token')`, 'language-typescript'),
                                doc.codePlace(`
// Clean All Cookie
glitter.removeCookie();

// Clean Some Cookie
glitter.removeCookie(['name', 'token', 'account']);
                                    `, 'language-typescript'),
                            ],
                        })}
                        </section>`;
                    },
                },
                {
                    id: 'UrlParameter',
                    title: 'URL Parameter',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Use URL Parameter function.</h2>
                            ${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>Set`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>Get`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>Remove`,
                            ],
                            tab: [
                                doc.codePlace(`glitter.setUrlParameter('name', 'John')`, 'language-typescript'),
                                doc.codePlace(`glitter.getUrlParameter('name')`, 'language-typescript'),
                                doc.codePlace(`glitter.removeSearchParam('name')`, 'language-typescript'),
                            ],
                        })}
                        </section>`;
                    },
                },
                {
                    id: 'frSize',
                    title: 'Responsive Web Design & Data',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Get the device width when loading, and then adjust the returned value.</h2>
                            ${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>In HTML`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>In JS / TS`,
                            ],
                            tab: [
                                doc.codePlace(`
<div
    class="\${glitter.ut.frSize({ me: 'm-1' }, 'm-3')}"
></div>
`, 'html'),
                                doc.codePlace(`const vw = glitter.ut.frSize({ lg: '240' }, '160')`, 'language-typescript'),
                            ],
                        })}
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

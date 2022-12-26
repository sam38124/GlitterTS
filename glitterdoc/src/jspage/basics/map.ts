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
                title: 'GVC.Map',
                subTitle: 'Use gvc.map() to render multiple view.',
            };

            const sessions: { id: string; title: string; html: string }[] = [
                {
                    id: 'GVCMAP()',
                    // title: '<span class="text-danger me-1">★</span>',
                    title: 'GVC.map()',
                    get html() {
                        return /*html*/ ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">You can use gvc.map() to generate a list of items.</h2>
                            ${doc.previewCode({
                                previewString: [
                                    `<i class='bx bx-code fs-base opacity-70 me-2'></i>Array Html`,
                                    `<i class="bx bx-code fs-base opacity-70 me-2"></i>Array Data`,
                                ],
                                tab: [
                                    doc.codePlace(`gvc.map([
'<h3>demo1</h3>',
'<h3>demo2</h3>',
'<h3>demo3</h3>'
        ])`, 'language-typescript'),
                                    doc.codePlace(`gvc.map([
            {
                link: 'demo/demo1.html', tit: 'title1'
            },
            {
                link: 'demo/demo2.html', tit: 'title2'
            }
        ].map((dd) => {
            return \`<a href="\${dd.link}">\${dd.tit}</a>\`
        }))`, 'language-typescript'),
                                    `<img src="img/appicons/lion.svg" class="rounded-3" style="max-width: 100%;width: 500px;">`,
                                ],
                            })}
                        </section>`;
                    },
                },
            ];

            return doc.create(
                /*html*/ `
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
                `,
                doc.asideScroller(sessions),
                new Items(topTitle.title, gvc)
            );
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});

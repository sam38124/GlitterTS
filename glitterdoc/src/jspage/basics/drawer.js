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
                title: 'DrawerLayout',
                subTitle: 'Create a side menu by drawer component.',
            };
            const sessions = [
                {
                    id: 'Create',
                    title: 'Create drawer',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Create drawer by glitter.setDrawer.</h2>
                            ${doc.codePlace(`glitter.setDrawer(\`<div class="w-100">Your drawer</div>\`,()=>{
//Initial finish
glitter.openDrawer()
        })`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'Open',
                    title: 'Open drawer',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Open drawer by glitter.openDrawer.</h2>
                            ${doc.codePlace(`glitter.openDrawer()`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'Close',
                    title: 'Close drawer',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Close drawer by glitter.closeDrawer.</h2>
                            ${doc.codePlace(`glitter.closeDrawer()`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'Preview',
                    title: 'Sample',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                                <h2 class="fs-lg mb-2 fw-normal fw-500">Click to show sample.</h2>
                      ${doc.video('./img/sample/drawer.mov')}
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

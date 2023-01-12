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
                title: 'Transition Manager',
                subTitle: 'Add animation when transition event trigger like changePage or openDialog.',
            };
            const sessions = [
                {
                    id: 'DefaultAnimation',
                    title: 'Default animation',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Default animation you can use.</h2>
                            ${doc.codePlace(`//Right to left
glitter.animation.rightToLeft
//Top to bottom                            
glitter.animation.topToBottom
//Fade in
glitter.animation.fade`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'Custom',
                    title: 'Custom animation',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Custom animtion style by youself.</h2>
                          ${doc.codePlace(`    import {AnimationConfig} from "./glitterBundle/module/Animation.js";
                          
                          
     //Define your animation.
     const fade = new AnimationConfig((page: PageConfig, finish: () => void) => {
        page.getElement().css("opacity", "0.1")
        page.getElement().animate({"opacity": "1"}, 500);
        setTimeout(() => {
            finish()
        }, 500)
    }, (page: PageConfig, finish: () => void) => {
        page.getElement().addClass('position-absolute')
        page.getElement().css("opacity", "1.0")
        page.getElement().animate({"opacity": "0.1"}, 500);
        setTimeout(() => {
            finish()
        }, 450)
    })`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'Page',
                    title: 'Page transition',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Set page animation.</h2>
                          ${doc.codePlace(`//Function.1: Set default style for all page
glitter.defaultSetting.pageAnimation = glitter.animation.fade
//Function.2: Set for specific page
glitter.changePage('page/mypage.js','mytag',true,{},{animation:glitter.animation.rightToLeft})`, 'language-typescript')}
                              <h2 class="fs-lg mt-4 mb-4 fw-normal fw-500">Show Sample.</h2>
                              ${doc.video('img/sample/pageTransationS.mov')}
                        </section>`;
                    },
                },
                {
                    id: 'Dialog',
                    title: 'Dialog transition',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Set dialog animation.</h2>
                          ${doc.codePlace(`//Function.1: Set default style for all page
glitter.defaultSetting.dialogAnimation = glitter.animation.fade
//Function.2: Set for specific dialog
glitter.openDiaLog('dialog/myDialog.js','myDialog',{},{animation:glitter.animation.fade})`, 'language-typescript')}
                           <h2 class="fs-lg mt-4 mb-4 fw-normal fw-500">Show Sample.</h2>
                              ${doc.video('img/sample/dialogTransation.mov')}
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
                `, doc.asideScroller(sessions), new Items('TransitionManager', gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});

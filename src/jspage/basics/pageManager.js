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
                    id: 'URL Directly',
                    title: 'URL Directly',
                    get html() {
                        return `
 <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">You can change page by url link directly.</h2>
                            ${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>URL`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>Entry`
                            ],
                            tab: [
                                doc.codePlace(`location.href = 'index.html?page=getting-started/jsinterface';`, 'language-typescript'),
                                doc.codePlace(`'use strict';
import { Glitter } from './glitterBundle/Glitter.js';

export class Entry {
    public static onCreate(glitter: Glitter) {
        // You can set home page directly by absolute path
        glitter.setHome(
            'jspage/' + (glitter.getUrlParameter('page') ?? 'jspage/home') + '.js',
            glitter.getUrlParameter('page') ?? 'home',
            {}
        );
    }
}
`, 'language-typescript'),
                            ],
                        })}
                        </section>`;
                    },
                },
                {
                    id: 'setHome',
                    title: 'Set Home',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Use this function to remove all stacks and put this page on top of the stack.</h2>
${doc.codePlace(`glitter.setHome('page/home.ts', 'home', {});`, 'language-typescript')}
</section>`;
                    },
                },
                {
                    id: 'changePage',
                    title: 'Change Page',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Switch to the specified page and carry the data.</h2>
${doc.codePlace(`glitter.changePage('page/secondPage.ts', 'SecondPage', true, {});`, 'language-typescript')}
</section>`;
                    },
                },
                {
                    id: 'goback',
                    title: 'Back to the Page',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Return to the previous page or enter the tag parameter to return to a specific page.</h2>
${doc.codePlace(`
// 回到上一頁
glitter.goBack();

// 回到指定頁
glitter.goBack('SecondPage');
`, 'language-typescript')}
</section>`;
                    },
                },
                {
                    id: 'removePage',
                    title: 'Remove Page',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Remove the page in stack.</h2>
${doc.codePlace(`
glitter.removePage('SecondPage');
`, 'language-typescript')}
</section>`;
                    },
                },
                {
                    id: 'gomenu',
                    title: 'Go to the Top of Stack',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Back to the home page.</h2>
${doc.codePlace(`glitter.goMenu();`, 'language-typescript')}
</section>`;
                    },
                },
                {
                    id: 'animation',
                    title: 'Option-Animation',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Change page with animation.</h2>
    ${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>Default`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>Custom`
                            ],
                            tab: [
                                doc.codePlace(`    /**
    * The default animation you can use
    * Slide - [glitter.animation.rightToLeft]
    * Fade - [glitter.animation.fade]
    * */
        
    //Function.1: Set default style for all page
    glitter.defaultSetting.pageAnimation = glitter.animation.fade
    //Function.2: Set for specific page
    glitter.changePage('page/mypage.js','mytag',true,{},{animation:glitter.animation.rightToLeft})
                                `, 'language-typescript'),
                                doc.codePlace(`     //Define your animation.
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
    })
    
    //Function.1: Set default style for all page
    glitter.defaultSetting.defaultAnimation = fade
    
    //Function.2: Set for specific page
    glitter.changePage('page/mypage.js','mytag',true,{},{animation:fade})
`, 'language-typescript'),
                            ],
                        })}
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
                                <h1 class="pb-1">Page Manager</h1>
                                <h2 class="fs-lg mb-2 fw-normal fw-500">How to set the home page and switch pages.</h2>
                            </div>
                        </div>
                        ${(() => {
                let html = '';
                sessions.map((dd) => (html += dd.html));
                return html;
            })()}
                    </div>
                `, doc.asideScroller(sessions), new Items('Page Manager', gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});

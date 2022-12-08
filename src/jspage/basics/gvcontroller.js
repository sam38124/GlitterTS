import { init } from '../../glitterBundle/GVController.js';
import { Doc } from "../../view/doc.js";
import { Items } from "../page-config.js";
import { Galary } from "../../view/galary.js";
init((gvc, glitter, gBundle) => {
    const doc = new Doc(gvc);
    const gallary = new Galary(gvc);
    return {
        onCreateView: () => {
            const sessions = [
                {
                    id: `Create_View`,
                    title: '<span class="text-danger me-1">★</span> Create view',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2 ">Create ts file and write your html.</h2>
${doc.codePlace(`import {init} from '../glitterBundle/GVController.js'

init((gvc, glitter, gBundle)=>{
     /***
     * gBundle is parameters that you switch pages carry
     * 1.glitter.setHome('jsPage/yourView.js', 'yourTag', {data:'1234'})
     * 2.glitter.changePage('jsPage/yourView.js', 'yourTag', true,{data:'1234'})
     * gBundle.data=='1234'
     ***/
    return {
        onCreateView:()=>{
            return \`<h1>hello world</h1>\`
        }
    }
})`, 'language-typescript')}
</section>`;
                    }
                },
                {
                    id: `DefineElementId`,
                    title: '<span class="text-danger me-1">★</span> Define element id',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2 ">Please define element id by gvc.id.</h2>
${doc.codePlace(`import {init} from '../glitterBundle/GVController.js'

init((gvc, glitter, gBundle)=>{
    return {
        onCreateView:()=>{
            return \`<h1 id="\${gvc.id("myid")}">hello world</h1>\`
        }
    }
})`, 'language-typescript')}
</section>`;
                    }
                }, {
                    id: `LifeCycle`,
                    title: 'LifeCycle',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2 ">The Lifecycle for this page.</h2>
${doc.codePlace(`import {init} from '../glitterBundle/GVController.js'

init((gvc, glitter, gBundle)=>{
    return {
        //required
        onCreateView:()=>{
            return \`<h1>hello world</h1>\`
        },
        //optional
        onCreate:()=>{
            //when onCreateView finish.
        },
        onResume:()=>{
            //when go back to this page or mobile app is moved to front ground.
        },
        onDestroy:()=>{
            //when this page is removed.
        },
        onPause:()=>{
            //when this page is hidden or mobile app is moved to back ground.
        }
    }
})`, 'language-typescript')}
</section>`;
                    }
                }
            ];
            return doc.create(`
                 <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4" style="">
        <div class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2">
          <div class="me-4">
             <h1 class="pb-1">GVController</h1>
           <h2 class="fs-lg mb-2 fw-normal fw-500">The glitter page is all created by GVController.</h2>
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
            `, doc.asideScroller(sessions), new Items("GVController", gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        }
    };
});

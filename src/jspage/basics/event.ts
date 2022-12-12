import { init } from '../../glitterBundle/GVController.js';
import { Doc } from '../../view/doc.js';
import { Items } from '../page-config.js';
import { Galary } from '../../view/galary.js';

init((gvc, glitter, gBundle) => {
    const doc = new Doc(gvc);
    const gallary = new Galary(gvc);
    return {
        onCreateView: () => {
            const sessions: { id: string; title: string; html: string }[] = [
                {
                    id: `AddEvent`,
                    title: '<span class="text-danger me-1">★</span>Add Event',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">You can use gvc.event to receive event from element.</h2>
${doc.codePlace(
    `import { init } from '../glitterBundle/GVController.js';

init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            const formData: { account: string; password: string } = { account: 'memory account', password: 'memory password' };
            return gvc.bindView({
                bind: glitter.getUUID(),
                view: () => {
                    const changeAccount = gvc.event((e, event) => {
                        formData.account = e.value;
                    });
                    return \`<div class="d-flex flex-column">
                        <input type="text" onchange="\${changeAccount}" placeholder="please enter account" value="\${formData.account}" />
                        <input
                            type="password"
                            onchange="\${gvc.event((e, event) => {
                                    formData.password = e.value
                                })}"
                            placeholder="please enter password"
                            value="\${formData.password}"
                        />
                        <button
                            class="btn"
                            onclick="\${gvc.event(() => console.log(JSON.stringify(formData)))}"
                        >
                            submit
                        </button>
                    </div>\`;
                },
                divCreate: {},
            });
        },
    };
});
`,
    'language-typescript'
)}
</section>`;
                    },
                },
            ];

            return doc.create(
                `
                 <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4" style="">
        <div class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2">
          <div class="me-4">
             <h1 class="pb-1">Event</h1>
           <h2 class="fs-lg mb-2 fw-normal fw-500">Use gvc.event to define element operations.</h2>
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
  
            `,
                doc.asideScroller(sessions),
                new Items('Event', gvc)
            );
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});

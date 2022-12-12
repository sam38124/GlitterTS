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
                    id: `bindView`,
                    title: 'BindView',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Three ways to bind views to data.</h2>
${doc.previewCode({
    previewString: [
        `<i class='bx bx-code fs-base opacity-70 me-2'></i>MVC`,
        `<i class="bx bx-code fs-base opacity-70 me-2"></i>MVVM`,
        `<i class="bx bx-code fs-base opacity-70 me-2"></i>Componentization`,
    ],
    tab: [
        doc.codePlace(
            `import { init } from '../glitterBundle/GVController.js';

init((gvc, glitter, gBundle) => {
    // simulation get data from backend and updated view
    let globalValue = 0;
    setInterval(() => {
        globalValue -= 1;
        gvc.notifyDataChange('globalDiv');
    }, 1000);

    return {
        onCreateView: () => {
            /***
             * You can create view component first and then put value in template string so return value to onCreateView.
             ***/

            // updated view by in function value
            let div1 = gvc.bindView(() => {
                var vm: { loading: boolean; data?: string } = {
                    loading: false,
                    data: undefined,
                };

                function getDataFromApi() {
                    vm.loading = true;
                    gvc.notifyDataChange('manualCreateDiv');
                    setTimeout(() => {
                        vm.loading = false;
                        vm.data = '1234';
                        gvc.notifyDataChange('manualCreateDiv');
                    }, 3000);
                }

                return {
                    bind: gvc.id('manualCreateDiv'),
                    view: () => {
                        if (vm.loading) {
                            return \`<h3>Loading...</h3>\`;
                        } else {
                            return \`<h3>ApiData:\${vm.data}</h3>\`;
                        }
                    },
                    divCreate: { elem: \`div\`, style: \`color:red\`, class: \`class1 class2\` },
                    // triggered when view be created
                    onCreate: () => {
                        if (vm.data == undefined) {
                            getDataFromApi();
                        }
                    },
                };
            });

            // update view by global value
            let div2 = gvc.bindView({
                bind: 'globalDiv',
                view: () => {
                    return \`<h3>Count:\${globalValue}</h3>\`;
                },
                // set outside div css and element
                divCreate: { elem: \`div\`, style: \`color:red\`, class: \`bg-black\` },
                // optional triggered when view be created
                onCreate: () => {},
            });

            return \`
            \${div1}
            \${div2}
            \`;
        },
    };
});
`,
            'language-typescript'
        ),
        doc.codePlace(
            `import { init } from '../glitterBundle/GVController.js';

init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            const mvvm = gvc.bindView(() => {
                let vm = { data: 1 };
                // update data
                setInterval(() => {
                    vm.data += 1;
                }, 1000);
                return {
                    // bindView with data
                    dataList: [{ obj: vm, key: 'data' }],
                    bind: \`mvvm\`,
                    view: () => {
                        return \`<div>\${vm.data}</div>\`;
                    },
                    divCreate: { elem: 'div' },
                };
            });
            return \`\${mvvm}\`;
        },
    };
});
`,
            'language-typescript'
        ),
        `<h2 class="fs-lg mb-2 fw-normal fw-500">Step 1 - Create class and define your components</h2>${doc.codePlace(
            `import { GVC } from '../glitterBundle/GVController.js';

export class Components {
    public counterView: (start: number) => string;
    constructor(gvc: GVC) {
        this.counterView = (start: number) => {
            return gvc.bindView(() => {
                let vm = { data: start };
                // update data
                setInterval(() => {
                    vm.data += 1;
                }, 1000);
                return {
                    // bindView with data
                    dataList: [{ obj: vm, key: 'data' }],
                    bind: \`mvvm\`,
                    view: () => {
                        return \`<div>\${vm.data}</div>\`;
                    },
                    divCreate: { elem: 'div' },
                };
            });
        };
    }
}
`,
            'language-typescript'
        )}<h2 class="fs-lg mb-2 fw-normal fw-500  mt-4">Step 2 - Import view component in GVController</h2>${doc.codePlace(
            `import { init } from '../glitterBundle/GVController.js';
import { Components } from '../view/sample.js';

init((gvc, glitter, gBundle) => {
    const components = new Components(gvc);
    return {
        onCreateView: () => {
            return \`\${components.counterView(20)}\`;
        },
    };
});
`,
            'language-typescript'
        )}`,
    ],
})}
</section>`;
                    },
                },
                {
                    id: `NotifyDataChange`,
                    title: 'Notify Data Change',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500">Use gvc.notifyDataChange to refresh view component.</h2>
${doc.codePlace(
    `gvc.notifyDataChange('view1')
gvc.notifyDataChange(['view2','view1'])`,
    'language-typescript'
)}
</section>`;
                    },
                },
            ];

            return doc.create(
                `
                    <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4" style="">
                        <div
                            class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2"
                        >
                            <div class="me-4">
                                <h1 class="pb-1">BindView</h1>
                                <h2 class="fs-lg mb-2 fw-normal fw-500">Use bindview to manage your view components and data.</h2>
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
                new Items('BindView', gvc)
            );
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});

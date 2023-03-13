import { init } from '../../glitterBundle/GVController.js';
import { Doc } from '../../view/doc.js';
import { Items } from '../page-config.js';
import { Galary } from '../../view/galary.js';
import { PluginManager, Type } from '../plugin/pluginManager.js';
init((gvc, glitter, gBundle) => {
    const doc = new Doc(gvc);
    const gallary = new Galary(gvc);
    const pluginManager = new PluginManager(gvc);
    return {
        onCreateView: () => {
            gvc.addStyle(`.docs-container{padding-right: 0px!important;}`);
            const topTitle = {
                title: 'Official plugin',
                subTitle: 'Here is the useful official plugin for you to developer your application.',
            };
            const sessions = [
                {
                    id: 'ss',
                    title: 'ss',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            ${doc.previewCode({
                            previewString: [
                                `<img class="rounded rounded-circle me-2 bg-white p-1" src="img/android.png" style="width: 30px;height: 30px;"/>Android`,
                                `<img class="rounded rounded-circle me-2 bg-white p-1" src="img/ios.png" style="width: 30px;height: 30px;"/>IOS`
                            ],
                            tab: [
                                pluginManager.getFrameWork(Type.Android),
                                pluginManager.getFrameWork(Type.IOS)
                            ],
                        })}
                        </section>`;
                    },
                }
            ];
            return doc.create(`
                      <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4" style="">
        <div class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 pb-2">
          <div class="me-4">
             <h1 class="pb-1">${topTitle.title}</h1>
           <h2 class="fs-lg mb-2 fw-normal fw-500">${topTitle.subTitle}</h2>
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
                `, `<div class="d-none">${doc.asideScroller(sessions)}</div>`, new Items(topTitle.title, gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});

import { init } from '../glitterBundle/GVController.js';
import { ApiPageConfig } from "../api/pageConfig.js";
init((gvc, glitter, gBundle) => {
    console.log('sss');
    gvc.addStyle(`.nav {
  white-space: nowrap;
  display:block!important;
  flex-wrap: nowrap;
  max-width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch
}
.nav li {
  display: inline-block
}`);
    function getSource(dd) {
        return dd.src.official;
    }
    return {
        onCreateView: () => {
            let viewModel = {
                loading: true,
                pluginList: []
            };
            async function loading() {
                viewModel.loading = true;
                const data = await ApiPageConfig.getPlugin(gBundle.appName);
                if (data.result) {
                    viewModel.loading = false;
                    viewModel.pluginList = data.response.data.pagePlugin;
                    gvc.notifyDataChange([tabID, docID]);
                }
            }
            loading();
            const tabID = glitter.getUUID();
            const docID = glitter.getUUID();
            return `
            <div  class="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background-color: rgba(0,0,0,0.5);" >
            <div class="m-auto bg-white shadow rounded" style="max-width: 100%;max-height: 100%;width: 720px;height: 800px;">
        <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4 " >選擇元件</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
                glitter.closeDiaLog();
            })}"></i>
</div>    
${gvc.bindView({
                bind: tabID,
                view: () => {
                    if (viewModel.loading) {
                        return ``;
                    }
                    return gvc.map(viewModel.pluginList.map((dd, index) => {
                        var _a;
                        viewModel.selectSource = (_a = viewModel.selectSource) !== null && _a !== void 0 ? _a : getSource(dd);
                        return `
                 <li class="nav-item">
    <a class="nav-link ${(viewModel.selectSource === getSource(dd)) ? `active` : ``}" onclick="${gvc.event(() => {
                            viewModel.selectSource = getSource(dd);
                            gvc.notifyDataChange([docID, tabID]);
                        })}">${dd.name}</a>
  </li>
                `;
                    }));
                },
                divCreate: { class: `nav nav-tabs border-bottom px-2 pt-2` }
            })}
<div class="container w-100 pt-2 overflow-scroll" style="height: calc(100% - 180px);">
${gvc.bindView({
                bind: docID,
                view: () => {
                    function tryReturn(fun, defaults) {
                        try {
                            return fun();
                        }
                        catch (e) {
                            return defaults;
                        }
                    }
                    if (!viewModel.selectSource) {
                        return ``;
                    }
                    const obg = glitter.share.htmlExtension[glitter.htmlGenerate.resourceHook(viewModel.selectSource)];
                    if (!obg) {
                        return ``;
                    }
                    return gvc.map(Object.keys(glitter.share.htmlExtension[glitter.htmlGenerate.resourceHook(viewModel.selectSource)]).filter((dd) => {
                        return dd !== 'document';
                    }).map((dd) => {
                        return `
<div class="col-4 p-2">
<div class="card card-hover ">
  <div class="card-body">
    <h5 class="card-title">${tryReturn(() => {
                            return obg[dd].title;
                        }, dd)}</h5>
    <p class="card-text fs-sm" style="white-space: normal;word-break: break-word;overflow-x: hidden;text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
           line-clamp: 2; 
   -webkit-box-orient: vertical;
">${tryReturn(() => {
                            return obg[dd].subContent;
                        }, '')}</p>
    <a onclick="${gvc.event(() => {
                            var _a;
                            const ob = JSON.parse(JSON.stringify(obg));
                            gBundle.callback({
                                'id': glitter.getUUID(),
                                'data': (_a = ob[dd].defaultData) !== null && _a !== void 0 ? _a : {},
                                'style': ob[dd].style,
                                'class': ob[dd].class,
                                'type': dd,
                                'label': tryReturn(() => {
                                    return ob[dd].title;
                                }, dd),
                                'js': viewModel.selectSource
                            });
                            glitter.closeDiaLog();
                        })}" class="btn btn-sm btn-primary w-100">插入</a>
  </div>
</div>
</div>
                
                `;
                    }));
                },
                divCreate: {
                    class: `row w-100 p-0 m-0`
                },
                onCreate: () => {
                    if (viewModel.selectSource) {
                        if (!glitter.share.htmlExtension[glitter.htmlGenerate.resourceHook(viewModel.selectSource)]) {
                            glitter.addMtScript([
                                { src: glitter.htmlGenerate.resourceHook(viewModel.selectSource), type: 'module' }
                            ], () => {
                                gvc.notifyDataChange(docID);
                            }, () => {
                            });
                        }
                    }
                }
            })}
</div>

</div>
</div>
            `;
        }
    };
});

import { EditorConfig } from '../editor-config.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
export class WidgetManager {
    static main(gvc, widget) {
        const html = String.raw;
        const vm = {
            id: gvc.glitter.getUUID(),
            data: {},
            loading: true,
        };
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    return BgWidget.container(html `
                            <div class="d-flex w-100 align-items-start flex-column">
                                ${BgWidget.title('元件樣式')}
                                <div class="flex-fill"></div>
                                ${BgWidget.grayNote('全館 (首頁,隱形賣場,一頁式網頁) 的標頭將預設為以下樣式')}
                            </div>
                            ${BgWidget.container([
                        BgWidget.mainCard([
                            BgWidget.title('網站標頭', 'font-size: 16px;'),
                            gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return [
                                            {
                                                title: '標頭樣式一',
                                                img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1720714686605-Screenshot2024-07-12at12.17.52 AM.jpg',
                                                app: '',
                                                tag: '',
                                            },
                                            {
                                                title: '標頭樣式二',
                                                img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1720714686605-Screenshot2024-07-12at12.17.52 AM.jpg',
                                                app: '',
                                                tag: '',
                                            },
                                            {
                                                title: '標頭樣式三',
                                                img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1720714686605-Screenshot2024-07-12at12.17.52 AM.jpg',
                                                app: '',
                                                tag: '',
                                            },
                                            {
                                                title: '標頭樣式四',
                                                img: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1720714686605-Screenshot2024-07-12at12.17.52 AM.jpg',
                                                app: '',
                                                tag: '',
                                            },
                                        ]
                                            .map((dd) => {
                                            return html `<div class="p-2" style="width: 25%;min-width: 25%;">
                                                                    <div class="d-flex flex-column" style="gap:10px;justify-content: center;">
                                                                        <div
                                                                            class="rounded-3 shadow-sm"
                                                                            style="width: 100%;padding-bottom: 110%;background-image: url('${dd.img}');background-size: cover;background-repeat: no-repeat;background-position: center;"
                                                                        ></div>
                                                                        <div class="w-100 d-flex align-items-center justify-content-center">
                                                                            <h3 class="my-auto tx_title" style="white-space: nowrap;font-size: 16px;font-weight: 500;">${dd.title}</h3>
                                                                        </div>
                                                                    </div>
                                                                </div>`;
                                        })
                                            .join('');
                                    },
                                    divCreate: {
                                        class: `d-flex m-0 mx-n2`,
                                        style: 'overflow-x:auto;',
                                    },
                                };
                            }),
                        ].join('')),
                        BgWidget.mbContainer(240),
                    ].join(BgWidget.mbContainer(24)))}
                        `);
                },
            };
        });
    }
    static item(it) {
        it.gvc.addStyle(`
            .icon {
                width: 50px;
                height: 50px;
            }
            .list_item {
                gap: 10px;
            }
            .bt_primary {
                background: #295ed1;
            }
        `);
        const gvc = it.gvc;
        const html = String.raw;
        return html ` <div class="col-sm-4 col-12 mb-3">
            ${it.gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `
                            <div class="d-flex align-items-center list_item position-relative">
                                <img class="icon" src="${it.icon}" />
                                <div class="d-flex flex-column" style="gap:3px;">
                                    <div class="fs-6 fw-500">${it.title}</div>
                                    <div class=" d-flex align-items-center" style="gap:5px;">
                                        <div class="fs-sm">${it.toggle ? `已啟用` : `已停用`}</div>
                                        <i
                                            class="fa-sharp fa-solid ${it.toggle ? `fa-toggle-on` : `fa-toggle-off`} fs-4"
                                            style="cursor: pointer; color: ${it.toggle ? EditorConfig.editor_layout.main_color : `gray`};"
                                            onclick="${gvc.event(() => {
                        it.toggle = !it.toggle;
                        gvc.notifyDataChange(id);
                        it.toggle_event(it.toggle);
                    })}"
                                        ></i>
                                    </div>
                                </div>
                                <div class="ms-auto" style="right: 0px;top: 0px;">
                                    <div
                                        class="btn-sm bt_primary btn fs-sm fw-normal"
                                        style="height:25px; width:25px;"
                                        onclick="${gvc.event(() => {
                        it.editor_preview_view();
                    })}"
                                    >
                                        設定
                                    </div>
                                </div>
                            </div>
                        `;
                },
                divCreate: {
                    class: 'p-3 bg-white',
                    style: '',
                },
            };
        })}
        </div>`;
    }
}
window.glitter.setModule(import.meta.url, WidgetManager);

import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { GVC } from '../../glitterBundle/GVController.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';

export class FormModule {
    public static editor(gvc: GVC, data: any, title: string, update?: () => void) {
        const html = String.raw;
        const vm: {
            id: string;
            add_btn: boolean;
            data: any;
        } = {
            id: gvc.glitter.getUUID(),
            add_btn: false,
            data: data,
        };
        const option = [
            {
                icon: '<i class="fa-solid fa-text "></i>',
                title: '輸入框',
                key: 'input',
            },
            {
                icon: '<i class="fa-regular fa-square-chevron-down "></i>',
                title: '下拉選單',
                key: 'form-select',
            },
            {
                icon: '<i class="fa-regular fa-circle-dot "></i>',
                title: '單選',
                key: 'check_box',
            },
            {
                icon: '<i class="fa-solid fa-square-check "></i>',
                title: '多選',
                key: 'mutiple_select',
            },
        ];

        return [
            title,
            gvc.bindView(() => {
                gvc.addMtScript(
                    [
                        {
                            src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                        },
                    ],
                    () => {},
                    () => {}
                );
                return {
                    bind: vm.id,
                    view: () => {
                        try {
                            const view=vm.data
                                .map((dd: any, index: number) => {
                                    const opc = option.find((d1) => {
                                        if(dd.page==='multiple_line_text'){
                                            return d1.key === 'input';
                                        }
                                        return d1.key === dd.page;
                                    })!;
                                    if(!opc){
                                        return  ``
                                    }
                                    return html`<li class="w-100 border rounded-3 mb-2" style="overflow: hidden;">
                                    <div
                                        class="d-flex align-items-center w-100 py-2"
                                        style="padding-left: 20px; padding-right: 20px;background: #F7F7F7;cursor: pointer;overflow: hidden;"
                                        onclick="${gvc.event(() => {
                                        dd.toggle = !dd.toggle;
                                        gvc.notifyDataChange(vm.id);
                                    })}"
                                    >
                                        <i class="fa-sharp fa-solid fa-grip-dots-vertical me-3 dragItem "></i>
                                        <div style="width:12px;" class="d-flex align-items-center justify-content-center me-3">
                                            ${(()=>{
                                                switch (dd.form_config.type){
                                                    case 'email':
                                                        return `<i class="fa-solid fa-envelope "></i>`
                                                    case 'phone':
                                                        return `<i class="fa-solid fa-phone "></i>`
                                                    case 'date':
                                                        return `<i class="fa-solid fa-calendar-days "></i>`
                                                    default:
                                                        return opc.icon
                                                }
                                            })()}
                                        </div>${dd.title || opc.title}${(()=>{
                                            if(dd.deletable===false){
                                                return `<div class="ms-2">${BgWidget.blueNote(`系統預設`)}</div>`
                                            }else{
                                                return ``
                                            }
                                        })()}
                                        <div class="flex-fill"></div>
                                        ${dd.toggle ? `<i class="fa-solid fa-angle-up"></i>` : `<i class="fa-solid fa-angle-down"></i>`}
                                    </div>
                                    ${dd.toggle
                                        ? html`
                                              <div class="w-100 p-3">
                                                  ${(() => {
                                                      const editor_option=[ BgWidget.multiCheckboxContainer(gvc, [{ key: 'true', name: '設定為必填項目' }], [`${dd.require ?? ''}` || 'false'], () => {
                                                          if(dd.require){
                                                              const dialog=new ShareDialog(gvc.glitter)
                                                              if(dd.key==='email' && !vm.data.find((dd:any)=>{
                                                                  return dd.key==='phone' && dd.require
                                                              })){
                                                                  dialog.errorMessage({text:'電話或信箱，必須有一個為必填'})
                                                                  gvc.notifyDataChange(vm.id);
                                                                  return
                                                              }else if(dd.key==='phone' && !vm.data.find((dd:any)=>{
                                                                  return dd.key==='email' && dd.require
                                                              })){
                                                                  dialog.errorMessage({text:'電話或信箱，必須有一個為必填'})
                                                                  gvc.notifyDataChange(vm.id);
                                                                  return;
                                                              }
                                                          }
                                                          dd.require = !dd.require;
                                                          if(dd.require){
                                                              dd.hidden=false
                                                          }
                                                          update && update();
                                                          gvc.notifyDataChange(vm.id);
                                                      }),
                                                                      ...(()=>{
                                                                          if(dd.require){
                                                                              return []
                                                                          }else{
                                                                              return  [ BgWidget.multiCheckboxContainer(gvc, [{ key: 'true', name: '隱藏此欄位' }], [`${dd.hidden ?? ''}` || 'false'], () => {
                                                                                  dd.hidden = !dd.hidden;
                                                                                  update && update();
                                                                                  gvc.notifyDataChange(vm.id);
                                                                              })]
                                                                          }
                                                                      })(),
                                                          html`<div class="d-flex align-items-center justify-content-end ${(dd.deletable===false) ? `d-none`:``}">
                                                                      ${BgWidget.cancel(
                                                                  gvc.event(() => {
                                                                      const dialog = new ShareDialog(gvc.glitter);
                                                                      dialog.checkYesOrNot({
                                                                          text: '是否確認刪除欄位?',
                                                                          callback: (response) => {
                                                                              if (response) {
                                                                                  vm.data.splice(index, 1);
                                                                                  gvc.notifyDataChange(vm.id);
                                                                                  update && update();
                                                                              }
                                                                          },
                                                                      });
                                                                  }),
                                                                  '刪除欄位'
                                                          )}
                                                                  </div>`]
                                            switch (dd.page) {
                                                case 'multiple_line_text':
                                                case 'input':
                                                    return [
                                                        (()=>{
                                                            if(dd.deletable===false){
                                                                return []
                                                            }else{
                                                                return  [EditorElem.select({
                                                                    title: html`<div class="tx_normal fw-normal">資料類型</div>`,
                                                                    gvc: gvc,
                                                                    callback: (value) => {
                                                                        dd.form_config.type = value;
                                                                        if (value === 'textArea') {
                                                                            dd.page = 'multiple_line_text';
                                                                        } else {
                                                                            dd.page = 'input';
                                                                        }
                                                                        update && update();
                                                                        gvc.notifyDataChange(vm.id);
                                                                    },
                                                                    def: dd.form_config.type,
                                                                    array: [
                                                                        {
                                                                            key: 'default',
                                                                            name: '單行文字',
                                                                            value: 'text',
                                                                            visible: 'visible',
                                                                        },
                                                                        {
                                                                            key: 'default',
                                                                            name: '多行文字',
                                                                            value: 'textArea',
                                                                            visible: 'visible',
                                                                        },
                                                                        {
                                                                            key: 'default',
                                                                            name: '名稱',
                                                                            value: 'name',
                                                                            visible: 'visible',
                                                                        },
                                                                        {
                                                                            key: 'default',
                                                                            name: '日期',
                                                                            value: 'date',
                                                                            visible: 'visible',
                                                                        },
                                                                        {
                                                                            key: 'default',
                                                                            name: '時間',
                                                                            value: 'time',
                                                                            visible: 'visible',
                                                                        },
                                                                        {
                                                                            key: 'default',
                                                                            name: 'email',
                                                                            value: 'email',
                                                                            visible: 'visible',
                                                                        },
                                                                        {
                                                                            key: 'default',
                                                                            name: '電話',
                                                                            value: 'phone',
                                                                            visible: 'visible',
                                                                        },
                                                                        {
                                                                            key: 'default',
                                                                            name: '顏色',
                                                                            value: 'color',
                                                                            visible: 'visible',
                                                                        },
                                                                        {
                                                                            key: 'default',
                                                                            name: '數字',
                                                                            value: 'number',
                                                                            visible: 'visible',
                                                                        },
                                                                        {
                                                                            key: 'default',
                                                                            name: '地址',
                                                                            value: 'address',
                                                                            visible: 'visible',
                                                                        },
                                                                        {
                                                                            key: 'default',
                                                                            name: '密碼',
                                                                            value: 'password',
                                                                            visible: 'visible',
                                                                        },
                                                                    ].map((dd) => {
                                                                        return {
                                                                            title: dd.name,
                                                                            value: dd.value,
                                                                        };
                                                                    }) as any,
                                                                })]
                                                            }
                                                        })(),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '自訂欄位名稱',
                                                            default: dd.title || '',
                                                            callback: (text) => {
                                                                dd.title = text;
                                                                update && update();
                                                                gvc.notifyDataChange(vm.id);
                                                            },
                                                            placeHolder: '請輸入自訂欄位名稱',
                                                        }),
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '提示文字',
                                                            default: dd.form_config.place_holder || '',
                                                            callback: (text) => {
                                                                dd.form_config.place_holder = text;
                                                                update && update();
                                                                gvc.notifyDataChange(vm.id);
                                                            },
                                                            placeHolder: '請輸入關於這項欄位的描述或指引',
                                                        }),
                                                            ...editor_option
                                                    ].join('<div class="my-2"></div>');
                                                case 'form-select':
                                                case 'check_box':
                                                case 'mutiple_select':
                                                    return [
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '自訂欄位名稱',
                                                            default: dd.title || '',
                                                            callback: (text) => {
                                                                dd.title = text;
                                                                update && update();
                                                                gvc.notifyDataChange(vm.id);
                                                            },
                                                            placeHolder: '請輸入自訂欄位名稱',
                                                        }),
                                                        html`
                                                                      <div class="tx_normal fw-normal mb-2">選項</div>
                                                                      ${gvc.bindView(() => {
                                                            const cVm = {
                                                                id: gvc.glitter.getUUID(),
                                                            };
                                                            return {
                                                                bind: cVm.id,
                                                                view: () => {
                                                                    return (
                                                                        dd.form_config.option
                                                                            .map((d1: any, index: number) => {
                                                                                return html`
                                                                                                  <div class="d-flex align-items-center mb-2" style="gap: 10px;">
                                                                                                      <input
                                                                                                          class="form-control flex-fill"
                                                                                                          placeholder="請輸入選項內容"
                                                                                                          value="${d1.name}"
                                                                                                          onchange="${gvc.event((e, event) => {
                                                                                    d1.value = e.value;
                                                                                    d1.name = e.value;
                                                                                    update && update();
                                                                                    gvc.notifyDataChange(cVm.id);
                                                                                })}"
                                                                                                      />
                                                                                                      <i
                                                                                                          class="fa-solid fa-xmark"
                                                                                                          style="color:#8d8d8d;cursor: pointer; "
                                                                                                          onclick="${gvc.event(() => {
                                                                                    dd.form_config.option.splice(index, 1);
                                                                                    update && update();
                                                                                    gvc.notifyDataChange(cVm.id);
                                                                                })}"
                                                                                                      ></i>
                                                                                                  </div>
                                                                                              `;
                                                                            })
                                                                            .join('') +
                                                                        html` <div
                                                                                          class=""
                                                                                          style="width: 100px; height: 34px; padding: 6px 18px;background: #EAEAEA; border-radius: 10px; overflow: hidden; justify-content: center; align-items: center; gap: 8px; display: inline-flex; cursor: pointer;"
                                                                                          onclick="${gvc.event(() => {
                                                                            dd.form_config.option.push({
                                                                                index: 0,
                                                                                name: '',
                                                                                value: '',
                                                                            });
                                                                            update && update();
                                                                            gvc.notifyDataChange(cVm.id);
                                                                        })}"
                                                                                      >
                                                                                          <div style="color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
                                                                                              新增選項
                                                                                          </div>
                                                                                      </div>`
                                                                    );
                                                                },
                                                            };
                                                        })}
                                                                  `,
                                                        ...editor_option
                                                    ].join('<div class="my-2"></div>');
                                                default:
                                                    return '';
                                            }
                                        })()}
                                              </div>
                                          `
                                        : ''}
                                </li>`;
                                })
                                .join('')
                            return view;
                        }catch (e) {
                            console.log(e)
                            return  e
                        }

                    },
                    divCreate: {
                        elem: 'ul',
                        option: [{ key: 'id', value: vm.id }],
                        class: '',
                    },
                    onCreate: () => {
                        const interval = setInterval(() => {
                            if ((window as any).Sortable) {
                                try {
                                    function swapArr(arr: any, index1: number, index2: number) {
                                        const data = arr[index1];
                                        arr.splice(index1, 1);
                                        arr.splice(index2, 0, data);
                                    }
                                    let startIndex = 0;
                                    //@ts-ignore
                                    Sortable.create(document.getElementById(vm.id), {
                                        group: gvc.glitter.getUUID(),
                                        animation: 100,
                                        handle: '.dragItem',
                                        onChange: function (evt: any) {},
                                        onStart: function (evt: any) {
                                            startIndex = evt.oldIndex;
                                        },
                                        onEnd: (evt: any) => {
                                            swapArr(vm.data, startIndex, evt.newIndex);
                                        },
                                    });
                                } catch (e) {}
                                clearInterval(interval);
                            }
                        }, 100);
                    },
                };
            }),
            BgWidget.plusButton({
                gvc: gvc,
                title: '新增一個欄位',
                options: option.map((dd: any) => {
                    dd.callback = () => {
                        switch (dd.key) {
                            case 'input':
                                vm.data.push({
                                    key: `${new Date().getTime()}`,
                                    page: 'input',
                                    type: 'form_plugin_v2',
                                    group: '',
                                    toggle: true,
                                    title: '',
                                    appName: 'cms_system',
                                    require: 'true',
                                    readonly: 'write',
                                    formFormat: '{}',
                                    style_data: {
                                        input: {
                                            list: [],
                                            class: '',
                                            style: '',
                                            version: 'v2',
                                        },
                                        label: {
                                            list: [],
                                            class: 'form-label fs-base ',
                                            style: '',
                                            version: 'v2',
                                        },
                                        container: {
                                            list: [],
                                            class: '',
                                            style: '',
                                            version: 'v2',
                                        },
                                    },
                                    form_config: {
                                        type: 'text',
                                        title: '',
                                        input_style: {
                                            list: [],
                                            version: 'v2',
                                        },
                                        title_style: {
                                            list: [],
                                            version: 'v2',
                                        },
                                        place_holder: '',
                                    },
                                    col: '12',
                                    col_sm: '12',
                                });
                                break;
                            case 'multiple_line_text':
                                vm.data.push({
                                    key: `${new Date().getTime()}`,
                                    page: 'multiple_line_text',
                                    type: 'form_plugin_v2',
                                    toggle: true,
                                    group: '',
                                    title: '',
                                    appName: 'cms_system',
                                    require: 'true',
                                    readonly: 'write',
                                    formFormat: '{}',
                                    moduleName: '多行文字區塊',
                                    style_data: {
                                        input: {
                                            list: [],
                                            class: '',
                                            style: '',
                                            version: 'v2',
                                        },
                                        label: {
                                            list: [],
                                            class: 'form-label fs-base ',
                                            style: '',
                                            version: 'v2',
                                        },
                                        container: {
                                            list: [],
                                            class: '',
                                            style: '',
                                            version: 'v2',
                                        },
                                    },
                                    form_config: {
                                        type: 'name',
                                        title: '',
                                        place_holder: '',
                                        title_style: {},
                                        input_style: {},
                                    },
                                    col: '12',
                                    col_sm: '12',
                                });

                                break;
                            case 'form-select':
                                vm.data.push({
                                    key: `${new Date().getTime()}`,
                                    page: 'form-select',
                                    type: 'form_plugin_v2',
                                    group: '',
                                    title: '',
                                    appName: 'cms_system',
                                    require: 'true',
                                    readonly: 'write',
                                    formFormat: '{}',
                                    moduleName: '下拉選單',
                                    style_data: {
                                        input: { list: [], class: '', style: '', version: 'v2' },
                                        label: { list: [], class: 'form-label fs-base ', style: '', version: 'v2' },
                                        container: { list: [], class: '', style: '', version: 'v2' },
                                    },
                                    form_config: {
                                        type: 'name',
                                        title: '',
                                        place_holder: '',
                                        title_style: {},
                                        input_style: {},
                                        option: [],
                                    },
                                    col: '12',
                                    col_sm: '12',
                                });
                                break;
                            case 'check_box':
                                vm.data.push({
                                    key: `${new Date().getTime()}`,
                                    page: 'check_box',
                                    type: 'form_plugin_v2',
                                    group: '',
                                    title: '',
                                    appName: 'cms_system',
                                    require: 'true',
                                    readonly: 'write',
                                    formFormat: '{}',
                                    moduleName: '單選題',
                                    style_data: {
                                        input: { list: [], class: '', style: '', version: 'v2' },
                                        label: { list: [], class: 'form-label fs-base ', style: '', version: 'v2' },
                                        container: { list: [], class: '', style: '', version: 'v2' },
                                    },
                                    form_config: {
                                        type: 'name',
                                        title: '',
                                        place_holder: '',
                                        title_style: {},
                                        input_style: {},
                                        option: [],
                                    },
                                    col: '12',
                                    col_sm: '12',
                                });
                                break;
                            case 'mutiple_select':
                                vm.data.push({
                                    key: `${new Date().getTime()}`,
                                    page: 'mutiple_select',
                                    type: 'form_plugin_v2',
                                    group: '',
                                    title: '',
                                    appName: 'cms_system',
                                    require: 'true',
                                    readonly: 'write',
                                    formFormat: '{}',
                                    moduleName: '多選題',
                                    style_data: {
                                        input: { list: [], class: '', style: '', version: 'v2' },
                                        label: { list: [], class: 'form-label fs-base ', style: '', version: 'v2' },
                                        container: { list: [], class: '', style: '', version: 'v2' },
                                    },
                                    form_config: {
                                        type: 'name',
                                        title: '',
                                        place_holder: '',
                                        title_style: {},
                                        input_style: {},
                                        option: [],
                                    },
                                    col: '12',
                                    col_sm: '12',
                                });
                                break;
                        }
                        update && update();
                        gvc.notifyDataChange(vm.id);
                    };
                    return dd;
                }) as any,
            }),
        ].join('<div class="my-3"></div>');
    }
}
(window as any).glitter.setModule(import.meta.url, FormModule);

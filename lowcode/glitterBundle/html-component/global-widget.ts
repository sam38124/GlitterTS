import { GVC } from '../GVController.js';
import { Storage } from '../helper/storage.js';
import { ApiPageConfig } from '../../api/pageConfig.js';
import { ApiUser } from '../../glitter-base/route/user.js';

enum ViewType {
  mobile = 'mobile',
  desktop = 'desktop',
  def = 'def',
}

export interface OptionsItem {
  key: string;
  value: string;
  note?: string;
  image?: string;
}

const html = String.raw;

export class GlobalWidget {
  constructor() {}

  public static glitter_view_type = 'def';

  public static showCaseBar(gvc: GVC, widget: any, refresh: (data: string) => void) {
    if (
      ['mobile', 'desktop'].includes(gvc.glitter.getCookieByName('ViewType')) &&
      GlobalWidget.glitter_view_type !== 'def'
    ) {
      GlobalWidget.glitter_view_type = gvc.glitter.getCookieByName('ViewType');
    }
    return gvc.bindView(() => {
      const id = gvc.glitter.getUUID();
      return {
        bind: id,
        view: () => {
          GlobalWidget.glitter_view_type = GlobalWidget.glitter_view_type ?? 'def';
          return html` <h3 class="my-auto tx_title me-2 ms-2 " style="white-space: nowrap;font-size: 16px;">
              元件顯示樣式
            </h3>
            <div
              style="background:#f1f1f1;border-radius:10px;"
              class="d-flex align-items-center justify-content-center p-1 "
            >
              ${[
                {
                  icon: 'fa-regular fa-border-all guide-user-editor-5-back',
                  type: 'def',
                  title: '預設樣式',
                },
                { icon: 'fa-regular fa-desktop', type: 'desktop', title: '電腦版' },
                { icon: 'fa-regular fa-mobile guide-user-editor-5', type: 'mobile', title: '手機版' },
              ]
                .map(dd => {
                  if (dd.type === GlobalWidget.glitter_view_type) {
                    return html` <div
                      class="d-flex align-items-center justify-content-center bg-white"
                      style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="${dd.title}"
                    >
                      <i class="${dd.icon}"></i>
                    </div>`;
                  } else {
                    return html` <div
                      class="d-flex align-items-center justify-content-center"
                      style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                      onclick="${gvc.event(() => {
                        GlobalWidget.glitter_view_type = dd.type;
                        if (dd.type !== 'def') {
                          Storage.view_type = dd.type as any;
                        } else {
                          Storage.view_type = 'desktop';
                        }
                        refresh(dd.type as any);
                        gvc.glitter.share.loading_dialog.dataLoading({
                          text: '模組加載中...',
                          visible: true,
                        });
                        gvc.notifyDataChange(['docs-container', id]);
                      })}"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-custom-class="custom-tooltip"
                      data-bs-title="${dd.title}"
                    >
                      <i class="${dd.icon}"></i>
                    </div>`;
                  }
                })
                .join('')}
            </div>`;
        },
        divCreate: {
          class: `${gvc.glitter.getUrlParameter('device') === 'mobile' ? `d-none ` : `d-flex`} align-items-center border-bottom mx-n2 mt-n2 p-2 guide-user-editor-4`,
          style: ``,
        },
        onCreate: () => {
          $('.tooltip').remove();
          ($('[data-bs-toggle="tooltip"]') as any).tooltip();
        },
      };
    });
  }

  public static initialShowCaseData(obj: { widget: any; gvc: GVC }) {
    ['mobile', 'desktop'].map(d2 => {
      obj.widget[d2] = obj.widget[d2] ?? { refer: 'def' };
      if (obj.widget[d2].refer === 'custom') {
        obj.widget[d2].data = obj.widget[d2].data ?? JSON.parse(JSON.stringify(obj.widget.data));
        const cp = JSON.parse(JSON.stringify(obj.widget));
        cp['mobile'] = undefined;
        cp['desktop'] = undefined;
        cp.data = obj.widget[d2].data;
        cp.data.setting = obj.widget.data.setting;
        cp.refer = obj.widget[d2].refer;
        obj.widget[d2] = cp;
        obj.widget[d2].refreshComponent = obj.widget.refreshComponent;
        delete obj.widget[d2].formData;
        delete obj.widget[d2].storage;
        delete obj.widget[d2].share;
        delete obj.widget[d2].bundle;
        !obj.widget[d2].formData &&
          Object.defineProperty(obj.widget[d2], 'formData', {
            get: function () {
              return obj.widget.formData;
            },
          });
        !obj.widget[d2].storage &&
          Object.defineProperty(obj.widget[d2], 'storage', {
            get: function () {
              return obj.widget.storage;
            },

            set(v) {
              obj.widget.storage = v;
            },
          });
        !obj.widget[d2].share &&
          Object.defineProperty(obj.widget[d2], 'share', {
            get: function () {
              return obj.widget.share;
            },

            set(v) {
              obj.widget.share = v;
            },
          });
        !obj.widget[d2].bundle &&
          Object.defineProperty(obj.widget[d2], 'bundle', {
            get: function () {
              return obj.widget.bundle;
            },

            set(v) {
              obj.widget.bundle = v;
            },
          });
        obj.widget[d2].editorEvent = obj.widget.editorEvent;
        obj.widget[d2].global = obj.widget.global ?? [];
        obj.widget[d2].global.gvc = obj.gvc;
        obj.widget[d2].global.pageConfig = obj.widget.page_config;
        obj.widget[d2].global.appConfig = obj.widget.app_config;
        obj.widget[d2].globalColor = function (key: string, index: number) {
          return `@{{theme_color.${index}.${key}}}`;
        };
      } else if (obj.widget[d2].refer === 'hide') {
        obj.widget[d2] = { refer: 'hide' };
      } else {
        obj.widget[d2] = { refer: obj.widget[d2].refer };
      }
    });
  }

  static grayButton(text: string, event: string, obj?: { icon?: string; textStyle?: string; class?: string }) {
    return html` <button class="btn btn-gray ${obj?.class || ''}" type="button" onclick="${event}">
      <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}" style="color: #393939"></i>
      ${text.length > 0 ? html`<span class="tx_700" style="${obj?.textStyle ?? ''}">${text}</span>` : ''}
    </button>`;
  }

  static select(obj: {
    gvc: GVC;
    callback: (value: any) => void;
    default: string;
    options: OptionsItem[];
    style?: string;
    title?: string;
    readonly?: boolean;
    place_holder?: string;
  }) {
    return html` ${obj.title ? html` <div class="tx_normal fw-normal mb-2">${obj.title}</div>` : ``}
      <select
        class="c_select c_select_w_100"
        style="${obj.style ?? ''}; ${obj.readonly ? 'background: #f7f7f7;' : ''}"
        onchange="${obj.gvc.event(e => {
          obj.callback(e.value);
        })}"
        ${obj.readonly ? 'disabled' : ''}
      >
        ${obj.gvc.map(
          obj.options.map(
            opt =>
              html` <option class="c_select_option" value="${opt.key}" ${obj.default === opt.key ? 'selected' : ''}>
                ${opt.value}
              </option>`
          )
        )}
        ${(obj.options as any).find((opt: any) => {
          return obj.default === opt.key;
        })
          ? ``
          : `<option class="d-none" selected>${obj.place_holder || `請選擇項目`}</option>`}
      </select>`;
  }

  public static switchButton(gvc: GVC, def: boolean, callback: (value: boolean) => void) {
    return html` <div class="form-check form-switch d-flex align-items-center my-0" style=" cursor: pointer;">
      <input
        class="form-check-input"
        type="checkbox"
        onchange="${gvc.event(e => {
          callback(e.checked);
        })}"
        style="height:17px;width:30px;"
        ${def ? `checked` : ``}
      />
    </div>`;
  }

  public static showCaseEditor(obj: {
    gvc: GVC;
    widget: any;
    view: (widget: any, type: any) => string;
    custom_edit?: boolean;
    toggle_visible?: (result: boolean) => void;
    hide_selector?: boolean;
    hide_ai?: boolean;
  }) {
    const outer_id = obj.gvc.glitter.getUUID();

    const glitter = obj.gvc.glitter;
    const gvc = obj.gvc;
    return gvc.bindView(() => {
      return {
        bind: outer_id,
        view: () => {
          return ``;
        },
        divCreate: {
          class: `${outer_id}`,
        },
        onCreate: async () => {
          let civ: string[] = [];
          const is_sub_page = ['pages/', 'hidden/', 'shop/'].find(dd => {
            return (obj.gvc.glitter.getUrlParameter('page') || '').startsWith(dd);
          });
          const is_shop= [ 'hidden/', 'shop/'].find(dd => {
            return (obj.gvc.glitter.getUrlParameter('page') || '').startsWith(dd);
          });
          if (!glitter.share.c_header_list) {
            glitter.share.c_header_list = (
              await ApiPageConfig.getPageTemplate({
                template_from: 'all',
                page: '0',
                limit: '3000',
                type: 'module',
                tag: '標頭元件',
              })
            ).response.result.data;
          }
          if (
            is_sub_page &&
            glitter.share.c_header_list.find((d1: any) => {
              return d1.tag === obj.widget.data.tag && d1.appName === obj.widget.data.refer_app;
            })
          ) {
            glitter.share.header_refer = glitter.share.header_refer || 'def';
            civ.push(`<div class="mt-2 fs-6 mb-2" style="color: black;margin-bottom: 5px;" >標頭樣式參照</div>`);
            civ.push(
              GlobalWidget.select({
                gvc: gvc,
                callback: (text: any) => {
                  glitter.share.header_refer = text;
                  glitter.share.selectEditorItem();
                },
                default: glitter.share.header_refer,
                options: [
                  {
                    key: 'custom',
                    value: '自定義標頭樣式',
                  },
                  {
                    key: 'def',
                    value: '全站預設樣式',
                  },
                ],
              })
            );

            if (glitter.share.header_refer === 'def') {
              (window.parent as any).document.querySelector('.' + outer_id).outerHTML = civ.join('');
              return;
            }
            civ.push(`<div class="my-2"></div>`);
            civ.push(
              [
                `<div class="fs-6 mb-2" style="color: black;">選單參照內容</div>`,
                gvc.bindView(()=>{
                  const bi=gvc.glitter.getUUID()
                  return {
                    bind:bi,
                    view:async ()=>{
                      const vm:any={
                        tab:'menu',
                        dataList:[]
                      }
                      const tag=vm.tab==='menu' ? 'menu-setting':'footer-setting';
                      let menu_all= (await ApiUser.getPublicConfig('menu-setting-list','manager')).response.value;
                      menu_all.list = menu_all.list ?? [];
                      vm.dataList = [
                        { tag: tag, title: `系統預設
                        ` },
                        ...menu_all.list.filter((d1:any)=>{
                          return d1.tab===tag
                        })
                      ];
                      return  [
                        this.select({
                          gvc: gvc,
                          callback: (text: any) => {
                            obj.widget.data.refer_form_data['menu_refer']=text
                            glitter.share.refresh_global();
                          },
                          default: obj.widget.data.refer_form_data['menu_refer'] ?? tag,
                          options: vm.dataList.map((dd:any)=>{
                            return {
                              key:dd.tag,
                              value:dd.title
                            }
                          })
                        }),
                        this.grayButton(
                          '設定',
                          gvc.event(() => {
                            gvc.glitter.getModule(`${gvc.glitter.root_path}cms-plugin/menus-setting.js`, menu => {
                              gvc.glitter.innerDialog((gvc)=>{
                                return html`
                          <div class="vw-100 vh-100 bg-white">
                            <div class="d-flex align-items-center" style="height: 60px;width: 100vw;border-bottom: solid 1px #DDD;font-size: 16px;font-style: normal;font-weight: 700;color: #393939;">
                              <div class="d-flex" style="padding:19px 32px;gap:8px;cursor: pointer;border-right: solid 1px #DDD;" onclick="${gvc.event(()=>{
                                  gvc.closeDialog()
                                })}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M13.7859 4.96406L8.02969 10.7203C7.69219 11.0578 7.5 11.5219 7.5 12C7.5 12.4781 7.69219 12.9422 8.02969 13.2797L13.7859 19.0359C14.0859 19.3359 14.4891 19.5 14.9109 19.5C15.7875 19.5 16.5 18.7875 16.5 17.9109V15H22.5C23.3297 15 24 14.3297 24 13.5V10.5C24 9.67031 23.3297 9 22.5 9H16.5V6.08906C16.5 5.2125 15.7875 4.5 14.9109 4.5C14.4891 4.5 14.0859 4.66875 13.7859 4.96406ZM7.5 19.5H4.5C3.67031 19.5 3 18.8297 3 18V6C3 5.17031 3.67031 4.5 4.5 4.5H7.5C8.32969 4.5 9 3.82969 9 3C9 2.17031 8.32969 1.5 7.5 1.5H4.5C2.01562 1.5 0 3.51562 0 6V18C0 20.4844 2.01562 22.5 4.5 22.5H7.5C8.32969 22.5 9 21.8297 9 21C9 20.1703 8.32969 19.5 7.5 19.5Z" fill="#393939"></path>
                                </svg>
                                返回
                              </div>
                              <div class="flex-fill" style="padding: 19px 32px;">編輯選單內容</div>
                            </div>
                            <div class="w-100">${
                                  menu.main(gvc, obj.widget)
                                }</div>
                          </div>
`
                              }, 'menus-setting',{
                                dismiss:()=>{
                                  glitter.share.refresh_global();
                                }
                              });
                            });
                          }),
                          {
                          }
                        )
                      ].join('')
                    },
                    divCreate:{
                      class:`d-flex align-items-center`,style:`gap:5px;`
                    }
                  }
                })
              ].join('')
            );
            civ.push(`<div class="mx-n2 border-top mb-2 mt-3"></div>`);
          }
          civ.push(
            (() => {
              GlobalWidget.glitter_view_type = ViewType.desktop;
              if (Storage.view_type === 'mobile') {
                GlobalWidget.glitter_view_type = ViewType.mobile;
              }

              if (
                ['mobile', 'desktop'].includes(obj.gvc.glitter.getCookieByName('ViewType')) &&
                GlobalWidget.glitter_view_type !== 'def'
              ) {
                GlobalWidget.glitter_view_type = obj.gvc.glitter.getCookieByName('ViewType');
              }

              if (GlobalWidget.glitter_view_type === 'def' || obj.gvc.glitter.getUrlParameter('device') === 'mobile') {
                return obj.view(obj.widget, 'def');
              } else {
                const id = obj.gvc.glitter.getUUID();
                const gvc = obj.gvc;
                GlobalWidget.initialShowCaseData({ widget: obj.widget, gvc: obj.gvc });
                let select_bt = 'form_editor';

                function ai_switch() {
                  if (is_sub_page) {
                    return ``;
                  }
                  return `<div class="d-flex align-items-center  shadow border-bottom mt-n2"
                                                     >
                                                    ${(() => {
                                                      const list = [
                                                        {
                                                          key: 'form_editor',
                                                          label: `元件設計`,
                                                          icon: `fa-regular fa-pencil`,
                                                        },
                                                        {
                                                          key: 'ai_editor',
                                                          label: 'AI 設計',
                                                          icon: `fa-regular fa-wand-magic-sparkles`,
                                                        },
                                                      ];
                                                      return list
                                                        .map(dd => {
                                                          if (select_bt === dd.key) {
                                                            return html` <div
                                                              class="d-flex align-items-center justify-content-center fw-bold px-2 py-2 fw-500 select-label-ai-message_ fs-6"
                                                              style="gap:5px;"
                                                            >
                                                              <i class="${dd.icon} "></i>${dd.label}
                                                            </div>`;
                                                          } else {
                                                            return html` <div
                                                              class="d-flex align-items-center justify-content-center fw-bold  px-2 py-2 fw-500 select-btn-ai-message_ fs-6"
                                                              style="gap:5px;"
                                                              onclick="${gvc.event(() => {
                                                                select_bt = dd.key;
                                                                gvc.notifyDataChange(id);
                                                              })}"
                                                            >
                                                              <i class="${dd.icon}"></i>${dd.label}
                                                            </div>`;
                                                          }
                                                        })
                                                        .join(
                                                          `<div class="border-end" style="width:1px;height:39px;"></div>`
                                                        );
                                                    })()}
                                                </div>`;
                }

                function selector(widget: any, key: string) {
                  if (obj.hide_selector) {
                    return ``;
                  }
                  return html` <div class=" mx-n2" >
                    ${[
                      ...(() => {
                        if (obj.hide_ai) {
                          return [];
                        } else {
                          return [ai_switch()];
                        }
                      })(),
                      obj.gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                          bind: id,
                          view: () => {
                            return html` <div
                                class="my-auto tx_title fw-normal d-flex align-items-center"
                                style="white-space: nowrap;font-size: 16px;"
                              >
                                在${(() => {
                                  if (GlobalWidget.glitter_view_type === 'mobile') {
                                    return `手機`;
                                  } else {
                                    return `電腦`;
                                  }
                                })()}版上${obj.widget[key].refer === 'hide' ? `不` : ``}顯示
                              </div>
                              ${GlobalWidget.switchButton(obj.gvc, obj.widget[key].refer !== 'hide', bool => {
                                // vm.data.main = bool;
                                if (bool) {
                                  obj.widget[key].refer = 'def';
                                } else {
                                  obj.widget[key].refer = 'hide';
                                }
                                obj.toggle_visible && obj.toggle_visible(bool);
                                gvc.notifyDataChange(id);
                                setTimeout(() => {
                                  obj.widget.refreshComponent();
                                }, 250);
                              })}`;
                          },
                          divCreate: {
                            class: `d-flex align-content-center px-3`,
                            style: `gap:10px;margin-bottom:18px;margin-top:13px;`,
                          },
                        };
                      }),
                    ]
                      .concat(
                        (() => {
                          if (obj.widget[key].refer === 'hide') {
                            return [];
                          } else {
                            if (obj.custom_edit) {
                              return [];
                            } else {
                              return [
                                obj.gvc.bindView(() => {
                                  const id = gvc.glitter.getUUID();
                                  return {
                                    bind: id,
                                    view: () => {
                                      return `<div class="my-auto tx_title fw-normal d-flex align-items-center" style="white-space: nowrap;font-size: 16px;">顯示獨立樣式</div>
${GlobalWidget.switchButton(obj.gvc, obj.widget[key].refer === 'custom', bool => {
  obj.widget[key].refer = bool ? `custom` : `def`;
  if (obj.widget.refreshComponent) {
    obj.widget.refreshComponent();
  } else if (obj.widget.refreshAll) {
    obj.widget.refreshAll();
  }
})}`;
                                    },
                                    divCreate: {
                                      class: `d-flex align-content-center px-3`,
                                      style: `gap:10px;margin-top:13px;`,
                                    },
                                  };
                                }) +
                                  `<div class="px-3 pt-2" style="white-space: normal;word-break: break-all;color: #8D8D8D; font-size: 14px; font-weight: 400; ">透過設定獨立樣式在${(() => {
                                    if (GlobalWidget.glitter_view_type === 'mobile') {
                                      return `手機`;
                                    } else {
                                      return `電腦`;
                                    }
                                  })()}版上顯示特定設計效果</div>`,
                                `<div class="mx-n3" style="background: #DDD;height: 1px;"></div>`,
                              ].join(`<div style="height:18px;"></div>`);
                            }
                          }
                        })()
                      )
                      .join('<div class="my-3"></div>')}
                  </div>`;
                }

                return obj.gvc.bindView(() => {
                  return {
                    bind: id,
                    view: () => {
                      if (select_bt === 'ai_editor') {
                        return new Promise((resolve, reject) => {
                          gvc.glitter.getModule(
                            gvc.glitter.root_path + 'cms-plugin/ai-generator/editor-ai.js',
                            EditorAi => {
                              resolve([`<div class="mx-n2">${ai_switch()}</div>`, EditorAi.view(gvc)].join(''));
                            }
                          );
                        });
                      }
                      const view = (() => {
                        try {
                          if (GlobalWidget.glitter_view_type === 'mobile') {
                            const view = [selector(obj.widget.mobile, 'mobile')];
                            if (obj.widget.mobile.refer === 'custom') {
                              view.push(obj.view(obj.widget.mobile, 'mobile'));
                            } else {
                              view.push(obj.view(obj.widget, 'def'));
                            }
                            return view.join('');
                          } else if (GlobalWidget.glitter_view_type === 'desktop') {
                            const view = [selector(obj.widget.desktop, 'desktop')];
                            if (obj.widget.desktop.refer === 'custom') {
                              view.push(obj.view(obj.widget.desktop, 'desktop'));
                            } else {
                              view.push(obj.view(obj.widget, 'def'));
                            }
                            return view.join('');
                          } else {
                            return obj.view(obj.widget, 'def');
                          }
                        } catch (e) {
                          console.log(e);
                          return `${e}`;
                        }
                      })();
                      return [view].join('');
                    },
                  };
                });
              }
            })()
          );
          (window.parent as any).document.querySelector('.' + outer_id).outerHTML = civ.join('');
        },
      };
    });
  }

  public static showCaseData(obj: { gvc: GVC; widget: any; empty?: string; view: (widget: any) => string }) {
    GlobalWidget.initialShowCaseData({ widget: obj.widget, gvc: obj.gvc });
    if (obj.gvc.glitter.document.body.clientWidth < 800 && obj.widget.mobile.refer === 'hide') {
      return obj.empty || '';
    } else if (obj.gvc.glitter.document.body.clientWidth >= 800 && obj.widget.desktop.refer === 'hide') {
      return obj.empty || '';
    } else if (obj.gvc.glitter.document.body.clientWidth < 800 && obj.widget.mobile.refer === 'custom') {
      return obj.view(obj.widget.mobile);
    } else if (obj.gvc.glitter.document.body.clientWidth >= 800 && obj.widget.desktop.refer === 'custom') {
      return obj.view(obj.widget.desktop);
    } else {
      return obj.view(obj.widget);
    }
  }
}

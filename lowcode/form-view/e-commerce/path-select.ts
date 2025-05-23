import { GVC } from '../../glitterBundle/GVController.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiPost } from '../../glitter-base/route/post.js';
import { Tool } from '../../modules/tool.js';

interface MenuItem {
  name: string;
  icon: string;
  link: string;
  items?: MenuItem[];
}

interface CollecrtionItem {
  title: string;
  array?: CollecrtionItem[];
  code: string;
}

export class PathSelect {
  public static getData(obj: {
    gvc: GVC;
    title: string;
    default: string;
    placeHolder: string;
    callback: (path: string) => void;
    style?: string;
    readonly?: boolean;
    pattern?: string;
  }) {
    obj.title = obj.title ?? '';
    const html = String.raw;
    const vm = {
      id: obj.gvc.glitter.getUUID(),
      loading: true,
    };
    const linkComp = {
      id: obj.gvc.glitter.getUUID(),
      loading: true,
      text: obj.default ?? '',
    };
    const dropMenu = {
      id: obj.gvc.glitter.getUUID(),
      elementClass: Tool.randomString(5),
      elementWidth: 240,
      loading: true,
      search: '',
      prevList: [] as MenuItem[][],
      recentList: {} as MenuItem[],
      recentParent: [] as string[],
    };

    // 遞迴類別資料的物件
    const setCollectionPath = (target: MenuItem[], data: CollecrtionItem[]) => {
      (data || []).map((item, index) => {
        const { title, array, code } = item;
        target.push({ name: title, icon: '', link: `/collections/${code}` });
        if (array && array.length > 0) {
          target[index].items = [];
          setCollectionPath(target[index].items as MenuItem[], array);
        }
      });
    };

    // 確認網址，回傳icon與父子層陣列
    const findMenuItemPathByLink = (
      items: MenuItem[],
      link: string
    ): { icon: string; nameMap: string[] } | undefined => {
      for (const item of items) {
        if (item.link === link) {
          return { icon: item.icon, nameMap: [item.name] };
        }
        if (item.items) {
          const path = findMenuItemPathByLink(item.items, link);
          if (path?.nameMap) {
            return { icon: item.icon, nameMap: [item.name, ...path?.nameMap] };
          }
        }
      }
      return undefined;
    };

    // 繪製父子層容器 html
    const formatLinkHTML = (icon: string, pathList: string[]) => {
      let pathHTML = '';
      pathList.map((path, index) => {
        pathHTML += html`<span class="mx-1">${path}</span>${index === pathList.length - 1
            ? ''
            : html`<i class="fa-solid fa-chevron-right"></i>`}`;
      });
      return html` <div
        style="display: flex; flex-wrap: wrap; align-items: center; font-size: 16px; font-weight: 500; gap: 6px; line-height: 140%;cursor: default;"
      >
        <div style="width: 28px;height: 28px;display: flex; align-items: center; justify-content:center;">
          <i class="${icon.length > 0 ? icon : 'fa-regular fa-image'}"></i>
        </div>
        ${pathHTML}
      </div>`;
    };

    // 判斷父子層容器或純網址
    const formatLinkText = (text: string) => {
      const firstRound = dropMenu.recentList.find(item => item.link === text);
      if (firstRound) {
        return formatLinkHTML(firstRound.icon, [firstRound.name]);
      }
      const targetItem = findMenuItemPathByLink(dropMenu.recentList, text);
      if (targetItem) {
        return formatLinkHTML(targetItem.icon, targetItem.nameMap);
      }
      return text;
    };

    // 重新刷新元件
    const componentFresh = () => {
      const notify = () => {
        obj.gvc.notifyDataChange(dropMenu.id);
        obj.gvc.notifyDataChange(linkComp.id);
      };
      linkComp.loading = !linkComp.loading;
      dropMenu.loading = !dropMenu.loading;
      if (dropMenu.loading) {
        notify();
      } else {
        const si = setInterval(() => {
          const inputElement = obj.gvc.glitter.document.getElementById(dropMenu.elementClass);
          if (inputElement) {
            dropMenu.elementWidth = inputElement.clientWidth;
            notify();
            clearInterval(si);
          }
        }, 100);
      }
    };

    // callback 完整事件
    const callbackEvent = (data: any) => {
      linkComp.text = data.link;
      obj.callback(data.link);
      componentFresh();
    };

    // 新增 elementClass style
    obj.gvc.addStyle(`
            #${dropMenu.elementClass} {
                margin-top: 8px;
                white-space: normal;
                word-break: break-all;
            }
        `);

    console.log('========= 這是舊的路徑選擇元件 =========');
    return obj.gvc.bindView({
      bind: vm.id,
      view: () => {
        if (vm.loading) {
          return '';
        } else {
          let dataList = JSON.parse(JSON.stringify(dropMenu.recentList)) as MenuItem[];
          return html`${obj.title ? html` <div class="tx_normal fw-normal">${obj.title}</div>` : ``}
            <div style="position: relative">
              ${obj.gvc.bindView({
                bind: linkComp.id,
                view: () => {
                  if (linkComp.loading) {
                    return html` <div
                      class="bgw-input border rounded-3"
                      style="${linkComp.text.length > 0 ? '' : 'padding: 9.5px 12px;'} ${obj.style ?? ''}"
                      id="${dropMenu.elementClass}"
                      onclick="${obj.gvc.event(() => {
                        componentFresh();
                      })}"
                    >
                      ${linkComp.text.length > 0
                        ? formatLinkText(linkComp.text)
                        : html`<span style="color: #777777">${obj.placeHolder}</span>`}
                    </div>`;
                  } else {
                    return html`
                      <div class="d-flex align-items-center" style="margin-top: 8px;">
                        <input
                          class="form-control"
                          style="${obj.style ?? ''}"
                          type="text"
                          placeholder="${obj.placeHolder}"
                          onchange="${obj.gvc.event(e => {
                            callbackEvent({ link: e.value });
                          })}"
                          oninput="${obj.gvc.event(e => {
                            if (obj.pattern) {
                              const value = e.value;
                              const regex = new RegExp(`[^${obj.pattern}]`, 'g');
                              const validValue = value.replace(regex, '');
                              if (value !== validValue) {
                                e.value = validValue;
                              }
                            }
                          })}"
                          value="${linkComp.text}"
                          ${obj.readonly ? `readonly` : ``}
                        />
                        <span style="margin: 0 0.75rem"
                          ><i
                            class="fa-solid fa-xmark text-dark cursor_pointer fs-5"
                            onclick="${obj.gvc.event(() => {
                              componentFresh();
                            })}"
                          ></i
                        ></span>
                      </div>
                    `;
                  }
                },
                divCreate: {},
                onCreate: () => {},
              })}
              ${obj.gvc.bindView({
                bind: dropMenu.id,
                view: () => {
                  if (dropMenu.loading) {
                    return '';
                  } else {
                    let h1 = '';
                    if (dropMenu.prevList.length > 0) {
                      h1 += html` <div
                          class="m-3 cursor_pointer"
                          style="font-size: 16px; font-weight: 500; gap: 6px; line-height: 140%;"
                          onclick=${obj.gvc.event(() => {
                            dataList = dropMenu.prevList[dropMenu.prevList.length - 1];
                            dropMenu.prevList.pop();
                            dropMenu.recentParent.pop();
                            dropMenu.search = '';
                            obj.gvc.notifyDataChange(dropMenu.id);
                          })}
                        >
                          <i class="fa-solid fa-chevron-left me-2 hoverF2"></i>
                          <span>${dropMenu.recentParent[dropMenu.recentParent.length - 1]}</span>
                        </div>
                        <input
                          class="form-control m-2"
                          style="width: calc(100% - 16.875px)"
                          type="text"
                          placeholder="搜尋"
                          onchange="${obj.gvc.event(e => {
                            dropMenu.search = e.value;
                            obj.gvc.notifyDataChange(dropMenu.id);
                          })}"
                          oninput="${obj.gvc.event(e => {
                            if (obj.pattern) {
                              const value = e.value;
                              const regex = new RegExp(`[^${obj.pattern}]`, 'g');
                              const validValue = value.replace(regex, '');
                              if (value !== validValue) {
                                e.value = validValue;
                              }
                            }
                          })}"
                          value="${dropMenu.search}"
                        />`;
                    }
                    let h2 = '';
                    dataList
                      .filter(tag => {
                        return tag.name.includes(dropMenu.search);
                      })
                      .map(tag => {
                        h2 += html`
                          <div
                            class="m-2"
                            style="cursor:pointer;display: flex; align-items: center; justify-content: space-between;"
                          >
                            <div
                              class="w-100 p-1 link-item-container hoverF2 cursor_pointer text-wrap"
                              onclick=${obj.gvc.event(() => {
                                if (tag.link && tag.link.length > 0) {
                                  callbackEvent(tag);
                                } else {
                                  dropMenu.prevList.push(dataList);
                                  dropMenu.recentParent.push(tag.name);
                                  tag.items && (dataList = tag.items);
                                  obj.gvc.notifyDataChange(dropMenu.id);
                                }
                              })}
                            >
                              <div
                                style="min-width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;"
                              >
                                ${(() => {
                                  if (tag.icon.includes('https://')) {
                                    return html` <div
                                      style="
                                                                                width: 25px; height: 25px;
                                                                                background-image: url('${tag.icon}');
                                                                                background-position: center;
                                                                                background-size: cover;
                                                                                background-repeat: no-repeat;
                                                                            "
                                    ></div>`;
                                  }
                                  return html`<i
                                    class="${tag.icon.length > 0 ? tag.icon : 'fa-regular fa-image'}"
                                  ></i>`;
                                })()}
                              </div>
                              ${tag.name}
                            </div>
                            <div
                              class="py-1 px-3 hoverF2 ${tag.items && tag.items.length > 0 ? '' : 'd-none'}"
                              onclick=${obj.gvc.event(() => {
                                dropMenu.prevList.push(dataList);
                                dropMenu.recentParent.push(tag.name);
                                tag.items && (dataList = tag.items);
                                obj.gvc.notifyDataChange(dropMenu.id);
                              })}
                            >
                              <i class="fa-solid fa-chevron-right cursor_pointer"></i>
                            </div>
                          </div>
                        `;
                      });
                    return html`
                      <div class="border border-2 rounded-2 p-2" style="width: ${dropMenu.elementWidth}px;">
                        ${h1}
                        <div style="overflow-y: auto; max-height: 42.5vh;">${h2}</div>
                      </div>
                    `;
                  }
                },

                divCreate: {
                  style: 'position: absolute; top: 44px; left: 0; z-index: 1; background-color: #fff;',
                },
              })}
            </div>`;
        }
      },
      divCreate: {},
      onCreate: () => {
        if (vm.loading) {
          const acticleList: MenuItem[] = [];
          const collectionList: MenuItem[] = [];
          const productList: MenuItem[] = [];

          Promise.all([
            new Promise<void>(resolve => {
              ApiShop.getCollection().then((data: any) => {
                setCollectionPath(
                  collectionList,
                  data.response && data.response.value.length > 0 ? data.response.value : []
                );
                resolve();
              });
            }),
            new Promise<void>(resolve => {
              ApiShop.getProduct({ page: 0, limit: 50000, search: '' }).then((data: any) => {
                if (data.result) {
                  (data.response.data || []).map(
                    (item: { content: { id: string; title: string; preview_image: string[] } }) => {
                      const { id, title, preview_image } = item.content;
                      const icon = preview_image && preview_image[0] ? preview_image[0] : '';
                      productList.push({
                        name: title,
                        icon: icon,
                        link: `/products?product_id=${id}`,
                      });
                    }
                  );
                  resolve();
                }
              });
            }),
            new Promise<void>(resolve => {
              ApiPost.getManagerPost({ page: 0, limit: 20, type: 'article' }).then(data => {
                if (data.result) {
                  data.response.data.map((item: { content: { name: string; tag: string } }) => {
                    const { name, tag } = item.content;
                    if (name) {
                      acticleList.push({ name: name, icon: '', link: `/pages/${tag}` });
                    }
                  });
                }
                resolve();
              });
            }),
          ]).then(() => {
            dropMenu.recentList = [
              { name: '首頁', icon: 'fa-regular fa-house', link: '/index' },
              { name: '所有商品', icon: 'fa-regular fa-tag', link: '/all-product', items: productList },
              { name: '商品分類', icon: 'fa-regular fa-tags', link: '', items: collectionList },
              { name: '網誌文章', icon: 'fa-regular fa-newspaper', link: '/blogs', items: acticleList },
            ].filter(menu => {
              if (menu.items === undefined) return true;
              return menu.items.length > 0 || menu.link.length > 0;
            });
            vm.loading = false;
            obj.gvc.notifyDataChange(vm.id);
          });
        }
      },
    });
  }

  static randomString(max: number) {
    let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
}

(window as any).glitter.setModule(import.meta.url, PathSelect);

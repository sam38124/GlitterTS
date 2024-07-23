import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiPost } from '../../glitter-base/route/post.js';
export class PathSelect {
    static getData(obj) {
        var _a, _b;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : '';
        const html = String.raw;
        const appName = window.appName;
        const vm = {
            id: obj.gvc.glitter.getUUID(),
            loading: true,
        };
        const linkComp = {
            id: obj.gvc.glitter.getUUID(),
            loading: true,
            text: (_b = obj.default) !== null && _b !== void 0 ? _b : '',
        };
        const dropMenu = {
            id: obj.gvc.glitter.getUUID(),
            loading: true,
            search: '',
            prevList: [],
            recentList: {},
            recentParent: [],
        };
        const setCollectionPath = (target, data) => {
            data.map((item, index) => {
                const { title, array } = item;
                target.push({ name: title, icon: '', link: `./?appName=${appName}&collection=${title}&page=all-product` });
                if (array && array.length > 0) {
                    target[index].items = [];
                    setCollectionPath(target[index].items, array);
                }
            });
        };
        const findMenuItemPathByLink = (items, link) => {
            for (const item of items) {
                if (item.link === link) {
                    return { icon: item.icon, nameMap: [item.name] };
                }
                if (item.items) {
                    const path = findMenuItemPathByLink(item.items, link);
                    if (path === null || path === void 0 ? void 0 : path.nameMap) {
                        return { icon: item.icon, nameMap: [item.name, ...path === null || path === void 0 ? void 0 : path.nameMap] };
                    }
                }
            }
            return undefined;
        };
        const formatLinkHTML = (icon, pathList) => {
            let pathHTML = '';
            pathList.map((path, index) => {
                pathHTML += html `<span class="mx-1">${path}</span>${index === pathList.length - 1 ? '' : html `<i class="fa-solid fa-chevron-right"></i>`}`;
            });
            return html ` <div style="display: flex; flex-wrap: wrap; align-items: center; font-size: 16px; font-weight: 500; gap: 6px; line-height: 140%;cursor: default;">
                <div style="width: 28px;height: 28px;display: flex; align-items: center; justify-content:center;">
                    <i class="${icon.length > 0 ? icon : 'fa-regular fa-image'}"></i>
                </div>
                ${pathHTML}
            </div>`;
        };
        const formatLinkText = (text) => {
            const firstRound = dropMenu.recentList.find((item) => item.link === text);
            if (firstRound) {
                return formatLinkHTML(firstRound.icon, [firstRound.name]);
            }
            const targetItem = findMenuItemPathByLink(dropMenu.recentList, text);
            if (targetItem) {
                return formatLinkHTML(targetItem.icon, targetItem.nameMap);
            }
            return text;
        };
        const componentFresh = () => {
            linkComp.loading = !linkComp.loading;
            dropMenu.loading = !dropMenu.loading;
            obj.gvc.notifyDataChange(dropMenu.id);
            obj.gvc.notifyDataChange(linkComp.id);
        };
        const callbackEvent = (data) => {
            linkComp.text = data.link;
            obj.callback(data.link);
            componentFresh();
        };
        return obj.gvc.bindView({
            bind: vm.id,
            view: () => {
                if (vm.loading) {
                    return '';
                }
                else {
                    obj.gvc.addStyle(`
                        .link-item-container {
                            display: flex;
                            align-items: center;
                            font-size: 16px;
                            font-weight: 500;
                            gap: 6px;
                            line-height: 140%;
                            cursor: default;
                        }
                    `);
                    let dataList = JSON.parse(JSON.stringify(dropMenu.recentList));
                    return html `${obj.title ? html `<div class="tx_normal fw-normal">${obj.title}</div>` : ``}
                        <div style="position: relative">
                            ${obj.gvc.bindView({
                        bind: linkComp.id,
                        view: () => {
                            var _a, _b;
                            if (linkComp.loading) {
                                return html `<div
                                            class="form-control"
                                            style="margin-top:8px; white-space: normal; word-break: break-all; ${(_a = obj.style) !== null && _a !== void 0 ? _a : ''}"
                                            onclick="${obj.gvc.event(() => {
                                    componentFresh();
                                })}"
                                        >
                                            ${linkComp.text.length > 0 ? formatLinkText(linkComp.text) : `<span style="color: #b4b7c9">${obj.placeHolder}</span>`}
                                        </div>`;
                            }
                            else {
                                return html `
                                            <div class="d-flex align-items-center" style="margin-top: 8px;">
                                                <input
                                                    class="form-control"
                                                    style="${(_b = obj.style) !== null && _b !== void 0 ? _b : ''}"
                                                    type="text"
                                                    placeholder="${obj.placeHolder}"
                                                    onchange="${obj.gvc.event((e) => {
                                    callbackEvent({ link: e.value });
                                })}"
                                                    oninput="${obj.gvc.event((e) => {
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
                                                <span class="ms-2"
                                                    ><i
                                                        class="fa-solid fa-xmark text-dark cursor_pointer"
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
                        onCreate: () => { },
                    })}
                            ${obj.gvc.bindView({
                        bind: dropMenu.id,
                        view: () => {
                            if (dropMenu.loading) {
                                return html ``;
                            }
                            else {
                                let h1 = '';
                                if (dropMenu.prevList.length > 0) {
                                    h1 += html ` <div
                                                    class="m-3"
                                                    style="font-size: 16px; font-weight: 500; gap: 6px; line-height: 140%;cursor: pointer;"
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
                                                    style="width: 92%"
                                                    type="text"
                                                    placeholder="搜尋"
                                                    onchange="${obj.gvc.event((e) => {
                                        dropMenu.search = e.value;
                                        obj.gvc.notifyDataChange(dropMenu.id);
                                    })}"
                                                    oninput="${obj.gvc.event((e) => {
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
                                    .filter((item) => {
                                    return item.name.includes(dropMenu.search);
                                })
                                    .map((tag) => {
                                    h2 += html `
                                                    <div class="m-3" style="display: flex; align-items: center; justify-content: space-between;">
                                                        <div
                                                            class="link-item-container ${tag.link && tag.link.length > 0 ? 'hoverF2' : ''}"
                                                            style="cursor: pointer;"
                                                            onclick=${obj.gvc.event(() => {
                                        tag.link && tag.link.length > 0 && callbackEvent(tag);
                                    })}
                                                        >
                                                            <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                                                ${(() => {
                                        if (tag.icon.includes('https://')) {
                                            return html `<div
                                                                            style="
                                                                                width: 25px; height: 25px;
                                                                                background-image: url('${tag.icon}');
                                                                                background-position: center;
                                                                                background-size: cover;
                                                                                background-repeat: no-repeat;
                                                                            "
                                                                        ></div>`;
                                        }
                                        return html `<i class="${tag.icon.length > 0 ? tag.icon : 'fa-regular fa-image'}"></i>`;
                                    })()}
                                                            </div>
                                                            ${tag.name}
                                                        </div>
                                                        <div
                                                            class="hoverF2"
                                                            onclick=${obj.gvc.event(() => {
                                        dropMenu.prevList.push(dataList);
                                        dropMenu.recentParent.push(tag.name);
                                        tag.items && (dataList = tag.items);
                                        obj.gvc.notifyDataChange(dropMenu.id);
                                    })}
                                                        >
                                                            <i class="fa-solid fa-chevron-right ${tag.items && tag.items.length > 0 ? '' : 'd-none'}" style="cursor: pointer;"></i>
                                                        </div>
                                                    </div>
                                                `;
                                });
                                return html `
                                            <div class="border border-2 rounded-2 p-2" style="width: 240px">
                                                ${h1}
                                                <div style="overflow-y: auto; max-height: 42.5vh;">${h2}</div>
                                            </div>
                                        `;
                            }
                        },
                        divCreate: { style: 'position: absolute; top: 42.5px; right: 0; z-index: 1; background-color: #fff;' },
                    })}
                        </div>`;
                }
            },
            divCreate: {},
            onCreate: () => {
                if (vm.loading) {
                    const acticleList = [];
                    const collectionList = [];
                    const productList = [];
                    Promise.all([
                        new Promise((resolve) => {
                            ApiShop.getCollection().then((data) => {
                                setCollectionPath(collectionList, data.length > 0 ? data.response.value : []);
                                resolve();
                            });
                        }),
                        new Promise((resolve) => {
                            ApiShop.getProduct({ page: 0, limit: 50000, search: '' }).then((data) => {
                                if (data.result) {
                                    data.response.data.map((item) => {
                                        const { id, title, preview_image } = item.content;
                                        const icon = preview_image && preview_image[0] ? preview_image[0] : '';
                                        productList.push({ name: title, icon: icon, link: `/products?product_id=${id}` });
                                    });
                                    resolve();
                                }
                            });
                        }),
                        new Promise((resolve) => {
                            ApiPost.getManagerPost({ page: 0, limit: 20, type: 'article' }).then((data) => {
                                if (data.result) {
                                    data.response.data.map((item) => {
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
                            { name: '首頁', icon: 'fa-regular fa-house', link: './?page=index' },
                            { name: '商品', icon: 'fa-regular fa-tag', link: './?page=all-product', items: productList },
                            { name: '商品分類', icon: 'fa-regular fa-tags', link: '', items: collectionList },
                            { name: '網誌文章', icon: 'fa-regular fa-newspaper', link: '/blogs', items: acticleList }
                        ].filter((menu) => {
                            if (menu.items === undefined)
                                return true;
                            return menu.items.length > 0 || menu.link.length > 0;
                        });
                        vm.loading = false;
                        obj.gvc.notifyDataChange(vm.id);
                    });
                }
            },
        });
    }
}
window.glitter.setModule(import.meta.url, PathSelect);

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { FilterOptions } from '../cms-plugin/filter-options.js';
import { Tool } from './tool.js';
const html = String.raw;
const css = String.raw;
export class imageLibrary {
    static fileSystem(cf) {
        const gvc = cf.gvc;
        const vm = {
            id: cf.gvc.glitter.getUUID(),
            footer_id: gvc.glitter.getUUID(),
            link: [],
            selected: false,
            loading: true,
            query: '',
            orderString: 'created_time_desc',
            type: 'file',
            newFolder: {
                selected: false,
                title: '',
                data: [],
                items: [],
                type: 'folder',
                tag: [],
                id: gvc.glitter.getUUID(),
            },
        };
        const ids = {
            classPrefix: 'image-library-dialog',
            selectBarID: gvc.glitter.getUUID(),
        };
        if (cf.key == 'folderEdit') {
            vm.tag = cf.tag;
            vm.type = 'folderEdit';
        }
        function changeWindowsName(name) {
            var _a, _b;
            let titleContent = (_b = (_a = window === null || window === void 0 ? void 0 : window.parent) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.querySelector('.dialog-title div');
            if (titleContent) {
                titleContent.textContent = name;
            }
        }
        function changeCancelBTNName(name) {
            var _a, _b;
            let backBTN = (_b = (_a = window === null || window === void 0 ? void 0 : window.parent) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.querySelector('.btn-snow span');
            if (backBTN) {
                backBTN.textContent = name;
            }
        }
        function gClass(className) {
            return ids.classPrefix + '-' + className;
        }
        function getSelectCount(dd) {
            let count = 0;
            if (dd.selected) {
                count++;
            }
            return dd.filter((d) => {
                return d.selected;
            }).length;
        }
        function getPublicConfig(callback) {
            ApiUser.getPublicConfig('image-manager', 'manager').then((data) => {
                if (data.response.value) {
                    const tagDiv = window.parent.document.querySelector('.tag-title');
                    vm.link = data.response.value;
                    if (tagDiv) {
                        const tag = tagDiv.getAttribute('data-tag');
                        if (tag) {
                            console.log('vm.link.filter(item => item.tag.includes(tag)) -- ', vm.link.filter(item => item.tag.includes(tag)));
                            vm.link
                                .filter(item => item.tag.includes(tag))
                                .forEach(item => {
                                item.selected = true;
                            });
                        }
                    }
                    function loop(array) {
                        array.map(dd => {
                            var _a;
                            if (dd.type === 'folder') {
                                loop((_a = dd.items) !== null && _a !== void 0 ? _a : []);
                            }
                        });
                    }
                    loop(vm.link);
                    vm.loading = false;
                    callback();
                }
                else {
                    vm.loading = false;
                    callback();
                }
            });
        }
        const dialog = new ShareDialog(cf.gvc.glitter);
        function clearNoNeedData(items) {
            items.map(dd => {
                if (dd.selected) {
                    dd.selected = undefined;
                }
                clearNoNeedData(dd.items || []);
            });
        }
        function save(finish) {
            clearNoNeedData(vm.link);
            dialog.dataLoading({ visible: true });
            ApiUser.setPublicConfig({
                key: 'image-manager',
                value: vm.link,
                user_id: 'manager',
            }).then(data => {
                dialog.dataLoading({ visible: false });
                dialog.successMessage({ text: '儲存成功' });
                finish();
            });
        }
        function closeFolderView(returnPage = 'folder') {
            changeWindowsName('圖片庫');
            changeCancelBTNName('取消');
        }
        const isSafari = (() => {
            const userAgent = navigator.userAgent.toLowerCase();
            return userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('edg');
        })();
        return BgWidget.imageLibraryDialog({
            gvc: gvc,
            title: cf.title,
            innerHTML: (gvc) => {
                const that = this;
                function renderItems(array, opt) {
                    const id = gvc.glitter.getUUID();
                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                try {
                                    let editArray = [];
                                    let sortArray = array.map(dd => {
                                        return dd;
                                    });
                                    switch (vm.orderString) {
                                        case 'created_time_desc': {
                                            sortArray.reverse();
                                            break;
                                        }
                                        case 'created_time_asc': {
                                            break;
                                        }
                                        case 'name_AtoZ': {
                                            sortArray.sort((a, b) => {
                                                return a.title.localeCompare(b.title);
                                            });
                                            break;
                                        }
                                        case 'name_ZtoA': {
                                            sortArray.sort((b, a) => {
                                                return a.title.localeCompare(b.title);
                                            });
                                            break;
                                        }
                                        default:
                                            break;
                                    }
                                    return sortArray
                                        .map((fileItem, index) => {
                                        var _a;
                                        const passType = ['file', 'folderView', 'folderEdit', 'folderADD'];
                                        const noImageURL = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
                                        const originImageURL = passType.includes(vm.type)
                                            ? fileItem.data
                                            : (_a = vm.link.find(data => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.tag) === null || _a === void 0 ? void 0 : _a.includes(fileItem.title); })) === null || _a === void 0 ? void 0 : _a.data;
                                        const originImageSplit = (originImageURL || '').split('/');
                                        const imageBoxClass = Tool.randomString(5);
                                        fileItem.title = fileItem.title || originImageSplit.pop() || '圖片尚未命名';
                                        if (editArray.length < index + 1) {
                                            editArray.push(false);
                                        }
                                        if (!fileItem.title.toLowerCase().includes(vm.query.toLowerCase())) {
                                            return;
                                        }
                                        let viewID = gvc.glitter.getUUID();
                                        return gvc.bindView({
                                            bind: viewID,
                                            view: () => {
                                                try {
                                                    const imageUrl = originImageURL !== null && originImageURL !== void 0 ? originImageURL : noImageURL;
                                                    function itemClick() {
                                                        var _a;
                                                        if (vm.type == 'folderView') {
                                                            function updateLinkList(replaceId, newItem) {
                                                                const replaceItemIndex = vm.link.findIndex(i => i.id === replaceId);
                                                                console.log(replaceItemIndex);
                                                                if (replaceItemIndex < 0)
                                                                    return;
                                                                if (newItem)
                                                                    vm.link[replaceItemIndex] = newItem;
                                                                else
                                                                    vm.link.splice(replaceItemIndex, 1);
                                                                save(() => gvc.notifyDataChange(vm.id));
                                                            }
                                                            cf.edit(fileItem, (replace) => {
                                                                var _a;
                                                                updateLinkList((_a = replace === null || replace === void 0 ? void 0 : replace.id) !== null && _a !== void 0 ? _a : fileItem.id, replace);
                                                            }, {
                                                                deleteStyle: 1,
                                                                tag: (_a = vm.tag) !== null && _a !== void 0 ? _a : '',
                                                            });
                                                        }
                                                        else {
                                                            cf.edit(fileItem, replace => {
                                                                if (!replace) {
                                                                    let selectData = vm.link.findIndex(data => {
                                                                        return data.id == fileItem.id;
                                                                    });
                                                                    vm.link.splice(selectData, 1);
                                                                    save(() => {
                                                                        gvc.notifyDataChange(vm.id);
                                                                    });
                                                                }
                                                                else {
                                                                    let replaceIndex = vm.link.findIndex(data => data.id == replace.id);
                                                                    vm.link[replaceIndex] = replace;
                                                                    save(() => {
                                                                        gvc.notifyDataChange(vm.id);
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }
                                                    return html `
                              <div
                                style="padding: 10px 12px;position: relative;${fileItem.selected
                                                        ? `border-radius: 10px;border: 2px solid #393939;background: #F7F7F7;box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.10);`
                                                        : editArray[index]
                                                            ? `border-radius: 10px;border: 1px solid #DDD;background: #F7F7F7;`
                                                            : ``}"
                                onclick="${gvc.event((e, event) => {
                                                        let defaultSelect = fileItem.selected;
                                                        if (vm.type == 'folder') {
                                                            array = [];
                                                            vm.type = 'folderView';
                                                            vm.tag = fileItem.title;
                                                            gvc.notifyDataChange(vm.id);
                                                            return;
                                                        }
                                                        if (opt === null || opt === void 0 ? void 0 : opt.onlyRead) {
                                                            return;
                                                        }
                                                        if (!cf.mul) {
                                                            array.forEach(data => {
                                                                data.selected = false;
                                                            });
                                                        }
                                                        fileItem.selected = !defaultSelect;
                                                        gvc.notifyDataChange([viewID, ids.selectBarID]);
                                                        event.stopPropagation();
                                                    })}"
                                ${!gvc.glitter.isTouchDevice()
                                                        ? `onmouseenter="${gvc.event(() => {
                                                            if ((opt === null || opt === void 0 ? void 0 : opt.onlyRead) || cf.key == 'album') {
                                                                return;
                                                            }
                                                            if (!editArray[index]) {
                                                                editArray[index] = true;
                                                                gvc.notifyDataChange(viewID);
                                                            }
                                                        })}"onmouseleave="${gvc.event((e, event) => {
                                                            if (opt === null || opt === void 0 ? void 0 : opt.onlyRead)
                                                                return;
                                                            if (isSafari) {
                                                                const target = event.relatedTarget;
                                                                const imageBoxClassList = [imageBoxClass];
                                                                const targetClassList = Array.from(target.classList);
                                                                const isOutBorder = imageBoxClassList.every(cls => targetClassList.includes(cls)) &&
                                                                    targetClassList.every(cls => imageBoxClassList.includes(cls));
                                                                const isTitle = targetClassList.includes(`${imageBoxClass}-title`);
                                                                const isInside = targetClassList.length === 0;
                                                                const isOutOfViewContainer = target.dataset.viewContainer === 'true';
                                                                const isUL = target.tagName === 'UL';
                                                                if ((isOutBorder || isTitle || isInside) && !(isOutOfViewContainer || isUL)) {
                                                                    return;
                                                                }
                                                            }
                                                            editArray[index] = false;
                                                            gvc.notifyDataChange(viewID);
                                                        })}"
                                                             `
                                                        : ``}
                              >
                                <div
                                  class="${editArray[index] && !fileItem.selected
                                                        ? `d-flex`
                                                        : `d-none`}  align-items-center justify-content-center"
                                  style="height:24px;width:24px;border-radius: 3px;background: rgba(0, 0, 0, 0.80);position: absolute;right: 8.15px;top: 8px;"
                                  onclick="${gvc.event((e, event) => {
                                                        event.stopPropagation();
                                                        itemClick();
                                                    })}"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                  >
                                    <g clip-path="url(#clip0_13619_1920)">
                                      <path
                                        d="M0.852963 8.45864L0.3139 10.2891L0.0232751 11.2782C-0.0353187 11.4774 0.0185876 11.6907 0.1639 11.836C0.309213 11.9813 0.522494 12.0352 0.719369 11.979L1.71078 11.686L3.54124 11.1469C3.78499 11.0766 4.01234 10.9594 4.21156 10.8071L4.21859 10.8118L4.23031 10.793C4.26312 10.7672 4.29359 10.7415 4.32406 10.7157C4.35687 10.6875 4.38734 10.6571 4.41781 10.6266L11.5475 3.49927C12.0608 2.98599 12.1241 2.19614 11.7397 1.61255C11.6858 1.53052 11.6202 1.45083 11.5475 1.37817L10.6241 0.452393C10.0381 -0.133545 9.0889 -0.133545 8.50296 0.452393L1.37328 7.58208C1.31468 7.64067 1.25843 7.70395 1.20687 7.76958L1.18812 7.7813L1.19281 7.78833C1.04046 7.98755 0.925619 8.21489 0.852963 8.45864ZM8.9764 4.47661L4.6264 8.82661L3.4639 8.53599L3.17327 7.37349L7.52328 3.02349L8.9764 4.47661ZM2.27328 8.41177L2.45374 9.13833C2.50296 9.33989 2.66234 9.49692 2.8639 9.54849L3.59046 9.72895L3.41703 9.99145C3.35609 10.0243 3.29281 10.0524 3.22718 10.0711L2.67874 10.2329L1.39203 10.6079L1.76937 9.32349L1.93109 8.77505C1.94984 8.70942 1.97796 8.6438 2.01078 8.5852L2.27328 8.41177ZM7.38968 5.12583C7.53499 4.98052 7.53499 4.74145 7.38968 4.59614C7.24437 4.45083 7.00531 4.45083 6.85999 4.59614L4.60999 6.84614C4.46468 6.99146 4.46468 7.23052 4.60999 7.37583C4.75531 7.52114 4.99437 7.52114 5.13968 7.37583L7.38968 5.12583Z"
                                        fill="white"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_13619_1920">
                                        <rect width="12" height="12" fill="white" />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </div>
                                <div
                                  class="position-absolute ${fileItem.selected ? `d-blok` : `d-none`} "
                                  style="transform: translate(-50%,-50%);left: 50%;top:50%;"
                                >
                                  ${BgWidget.darkButton('編輯圖片', gvc.event(() => {
                                                        itemClick();
                                                    }))}
                                </div>
                                <div
                                  class="${fileItem.selected ? `d-flex` : `d-none`}  "
                                  style="height:24px;width:24px;border-radius: 3px;position: absolute;right: 8.15px;top: 8px;"
                                >
                                  <i class="fa-solid fa-square-check " style="color: #393939;font-size: 24px;"></i>
                                </div>
                                <div
                                  style="width:100%;padding-top: 100%;background:50%/contain url('${imageUrl}') no-repeat;border-radius: 5px;border: 0.938px solid #DDD;background: ;"
                                ></div>
                                <div
                                  class="w-100 text-center font-size: 16px;font-style: normal;font-weight: 400;text-overflow: ellipsis;"
                                  style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;"
                                  onchange="${gvc.event((e) => { })}"
                                >
                                  ${fileItem.title}
                                </div>
                              </div>
                            `;
                                                }
                                                catch (e) {
                                                    console.error(e);
                                                    return ``;
                                                }
                                            },
                                            divCreate: {
                                                style: `${gvc.glitter.ut.frSize({
                                                    sm: `width:15%;`,
                                                }, `width:49%;`)}cursor:pointer;`,
                                            },
                                        });
                                    })
                                        .join('');
                                }
                                catch (e) {
                                    console.error(`error=>`, e);
                                    return ``;
                                }
                            },
                            divCreate: {
                                elem: 'ul',
                                class: `w-100 my-2 flex-wrap `,
                                style: `display:flex;gap:${gvc.glitter.ut.frSize({
                                    sm: `17`,
                                }, `0`)}px;${document.body.clientWidth < 800 ? `justify-content: space-between;` : ``}`,
                            },
                            onCreate: () => {
                                gvc.glitter.addMtScript([
                                    {
                                        src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                    },
                                ], () => { }, () => { });
                                const interval = setInterval(() => {
                                    if (window.Sortable) {
                                        try {
                                            gvc.addStyle(css `
                        ul {
                          list-style: none;
                          padding: 0;
                        }
                      `);
                                            function swapArr(arr, index1, index2) {
                                                const data = arr[index1];
                                                arr.splice(index1, 1);
                                                arr.splice(index2, 0, data);
                                            }
                                            let startIndex = 0;
                                            window.create(gvc.getBindViewElem(id).get(0), {
                                                group: id,
                                                animation: 100,
                                                handle: '.dragItem',
                                                onChange: function (evt) { },
                                                onEnd: (evt) => {
                                                    swapArr(array, startIndex, evt.newIndex);
                                                    gvc.notifyDataChange(id);
                                                },
                                                onStart: function (evt) {
                                                    startIndex = evt.oldIndex;
                                                },
                                            });
                                        }
                                        catch (e) { }
                                        clearInterval(interval);
                                    }
                                }, 100);
                            },
                        };
                    });
                }
                getPublicConfig(() => {
                    const tagDiv = document.querySelector('.tag-title');
                    gvc.notifyDataChange(vm.id);
                });
                return gvc.bindView(() => {
                    return {
                        bind: vm.id,
                        view: () => __awaiter(this, void 0, void 0, function* () {
                            var _a, _b, _c;
                            const dialog = new ShareDialog(cf.gvc.glitter);
                            gvc.notifyDataChange(vm.footer_id);
                            function drawBreadcrumb() {
                                return html `
                  <div class="d-flex" style="margin-bottom:12px;">
                    <div class="breadcrumb-item">
                      <div
                        class="cursor_pointer"
                        onclick="${gvc.event(() => {
                                    closeFolderView();
                                    vm.type = 'file';
                                    cf.key = 'file';
                                    gvc.notifyDataChange(vm.id);
                                })}"
                      >
                        我的圖庫
                      </div>
                    </div>
                    <div class="breadcrumb-item">
                      <div
                        class="cursor_pointer"
                        onclick="${gvc.event(() => {
                                    closeFolderView();
                                    vm.type = 'folder';
                                    gvc.notifyDataChange(vm.id);
                                })}"
                      >
                        相簿
                      </div>
                    </div>
                    <div class="breadcrumb-item">
                      <div>${vm.tag}</div>
                    </div>
                  </div>
                `;
                            }
                            function pageBTN() {
                                let key = [
                                    {
                                        key: 'file',
                                        value: '全部圖片',
                                    },
                                    {
                                        key: 'folder',
                                        value: '相簿',
                                    },
                                ];
                                return key
                                    .map(data => {
                                    return html `
                      <div
                        style="color:${vm.type == data.key
                                        ? '#393939'
                                        : '#8D8D8D'};display: flex;padding:6px 18px;justify-content: center;align-items: center;border-radius: 10px;border: 2px solid ${vm.type ==
                                        data.key
                                        ? '#393939'
                                        : '#8D8D8D'};background: #FFF;font-weight: ${vm.type == data.key
                                        ? '700'
                                        : '500'};cursor: pointer;"
                        onclick="${gvc.event(e => {
                                        if (vm.type == data.key)
                                            return;
                                        else
                                            vm.link.forEach(item => (item.selected = false));
                                        vm.type = data.key;
                                        vm.query = '';
                                        gvc.notifyDataChange(vm.id);
                                    })}"
                      >
                        ${data.value}
                      </div>
                    `;
                                })
                                    .join('');
                            }
                            function pushFolder(folder, imageArray) {
                                imageArray.forEach(image => {
                                    image.selected = false;
                                });
                                folder.data.push(...imageArray.filter(image => !folder.data.some((existingImage) => existingImage.id === image.id)));
                                return folder.data;
                            }
                            function pushDataToFolder(selectData) {
                                selectData.map(data => {
                                    let matchingElement = vm.link.find(item2 => item2.id === data.id);
                                    if (matchingElement) {
                                        if (!matchingElement.tag) {
                                            matchingElement.tag = [];
                                        }
                                        if (!matchingElement.tag.includes(vm.tag)) {
                                            matchingElement.tag.push(vm.tag);
                                        }
                                    }
                                    data.selected = false;
                                });
                            }
                            function drawAlbumInsertImage(callback) {
                                return html `
                  <div class="w-100 ${gClass('new-album-add-block')}">
                    <div
                      class="btn1"
                      onclick="${gvc.event(() => {
                                    that.selectImageLibrary(gvc, selectData => {
                                        callback(selectData);
                                    }, `<div class="d-flex flex-column tag-title" data-tag="${vm.tag}"  style="border-radius: 10px 10px 0 0;background: #F2F2F2;">${vm.tag}</div>`, {
                                        key: 'album',
                                        mul: true,
                                    });
                                })}"
                    >
                      從圖庫中選擇
                    </div>
                    <div
                      class="btn1"
                      onclick="${gvc.event(() => {
                                    cf.plus(gvc, fileArray => {
                                        vm.link.push(...fileArray);
                                        callback(fileArray);
                                        save(() => {
                                            gvc.notifyDataChange(vm.id);
                                        });
                                    }, 'file');
                                })}"
                    >
                      上傳新圖片
                    </div>
                  </div>
                `;
                            }
                            function drawSelectBar(data) {
                                return gvc.bindView({
                                    bind: ids.selectBarID,
                                    view: () => {
                                        const selectCount = getSelectCount(data);
                                        return html `
                      <div class="${selectCount ? `` : `d-none`} ${gClass('select-bar-text')}">
                        已選取${selectCount}項
                      </div>
                      <div class="ms-auto ${gClass('search-raw')}">上傳時間舊>新</div>
                    `;
                                    },
                                    divCreate: {
                                        class: `w-100 ${gClass('select-bar')} `,
                                    },
                                });
                            }
                            if (vm.type == 'folderADD') {
                                const copyLink = structuredClone(vm.link);
                                return html `
                  <div class="d-flex flex-column ${gClass('new-album-title-bar')}">
                    相簿名稱
                    <input
                      class="w-100"
                      value="${(_a = vm.tag) !== null && _a !== void 0 ? _a : ''}"
                      placeholder="請輸入相簿名稱"
                      onchange="${gvc.event(e => {
                                    vm.tag = e.value;
                                })}"
                    />
                  </div>
                  ${drawAlbumInsertImage((selectData) => {
                                    pushFolder(vm.newFolder, selectData);
                                    vm.link.push(vm.newFolder);
                                    gvc.notifyDataChange('folderItemGroup');
                                })}
                  ${gvc.bindView({
                                    bind: `folderItemGroup`,
                                    view: () => {
                                        return renderItems(vm.newFolder.data, { onlyRead: true });
                                    },
                                    divCreate: {},
                                })}
                `;
                            }
                            if (vm.type == 'folderView') {
                                changeWindowsName((_b = vm.tag) !== null && _b !== void 0 ? _b : 'folder');
                                changeCancelBTNName('返回');
                                const group = vm.link.filter(item2 => {
                                    var _a;
                                    return item2.tag && item2.tag.includes((_a = vm.tag) !== null && _a !== void 0 ? _a : '');
                                });
                                return html `
                  ${drawBreadcrumb()}
                  <div class="d-flex w-100" style="gap:14px;margin-top: 12px;">
                    ${BgWidget.searchFilter(gvc.event(e => {
                                    vm.query = e.value;
                                    gvc.notifyDataChange(vm.id);
                                }), vm.query || '', '搜尋圖片')}
                    ${BgWidget.updownFilter({
                                    gvc,
                                    callback: (value) => {
                                        vm.orderString = value;
                                        gvc.notifyDataChange(vm.id);
                                    },
                                    default: vm.orderString || 'default',
                                    options: FilterOptions.imageLibraryOrderBy,
                                })}
                  </div>
                  ${drawSelectBar(group)}
                  ${gvc.bindView({
                                    bind: `folderItemGroup`,
                                    view: () => {
                                        if (vm.tag) {
                                            return renderItems(group);
                                        }
                                        return ``;
                                    },
                                    divCreate: {},
                                })}
                `;
                            }
                            if (vm.type == 'folderEdit') {
                                return html `
                  <div class="d-flex flex-column ${gClass('album-title')}">
                    相簿名稱
                    <input
                      class="w-100"
                      value="${(_c = vm.tag) !== null && _c !== void 0 ? _c : ''}"
                      placeholder="請輸入相簿名稱"
                      style="height: 40px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                      onchange="${gvc.event(e => {
                                    vm.tag = e.value;
                                })}"
                    />
                  </div>
                  ${drawAlbumInsertImage((selectData) => {
                                    pushDataToFolder(selectData);
                                    save(() => {
                                        gvc.notifyDataChange('folderItemGroup');
                                    });
                                })}
                  <div class="d-flex w-100 justify-content-end" style="gap:12px;margin-top: 18px;">
                    ${drawSelectBar(vm.link)}
                  </div>
                  <div>
                    ${gvc.bindView({
                                    bind: `folderItemGroup`,
                                    view: () => {
                                        if (vm.tag) {
                                            return renderItems(vm.link.filter(item2 => {
                                                var _a;
                                                return item2.tag && item2.tag.includes((_a = vm.tag) !== null && _a !== void 0 ? _a : '');
                                            }));
                                        }
                                        return ``;
                                    },
                                    divCreate: {},
                                })}
                  </div>
                `;
                            }
                            function drawSelectImg() {
                                const css = String.raw;
                                gvc.addStyle(css `
                  .fixed-top-section {
                    display: flex;
                    flex-direction: column;
                    height: auto; /* 設定一個固定的高度 (或用 auto 讓內容決定) */
                    flex-shrink: 0;
                    box-sizing: border-box; /* padding 不影響宣告的高度 */
                    width: 100%;
                    gap: 12px;
                    position: sticky;
                    background: #fff;
                    left: 0;
                    top: 0;
                    z-index: 2;
                  }

                  .scrollable-bottom-section {
                    flex-grow: 1; /* 重要：讓此區塊佔滿所有剩餘的垂直空間 */
                    overflow-y: auto; /* 關鍵：當內容垂直溢出時，只在此區塊顯示垂直滾動條 */
                    width: 100%;
                    box-sizing: border-box;
                  }

                  .${ids.classPrefix}-content {
                    left: 0;
                    top: 0;
                    position: relative;
                  }

                  .${ids.classPrefix}-select-bar {
                    border-radius: 10px;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 8px;
                    display: ${cf.mul ? `inline-flex` : `none`};
                    margin-top: 18px;
                    margin-bottom: 8px;
                  }
                  .${ids.classPrefix}-select-bar-text {
                    flex: 1 1 0;
                    color: #393939;
                    font-size: 14px;
                    font-weight: 700;
                    word-wrap: break-word;
                  }

                  .${ids.classPrefix}-new-album-title-bar {
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    gap: 12px;
                  }

                  .${ids.classPrefix}-new-album-title-bar input {
                    height: 40px;
                    padding: 9px 18px;
                    border-radius: 10px;
                    border: 1px solid #ddd;
                  }

                  .${ids.classPrefix}-new-album-add-block {
                    margin-top: 12px;
                    padding: 39px 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 10px;
                    border: 1px solid #ddd;
                    background: #fff;
                    gap: 12px;
                  }

                  .${ids.classPrefix}-new-album-add-block .btn1 {
                    padding: 10px 18px;
                    border-radius: 10px;
                    border: 1px solid #ddd;
                    background: #fff;
                    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                  }

                  .${ids.classPrefix}-album-title {
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    gap: 8px;
                  }

                  .${ids.classPrefix}-album-title input {
                    height: 40px;
                    padding: 9px 18px;
                    border-radius: 10px;
                    border: 1px solid #ddd;
                  }

                  .${ids.classPrefix}-search-raw {
                    color: #393939;
                    text-align: right;
                    font-size: 14px;
                    font-weight: 400;
                  }
                `);
                                return html `
                  <div
                    class="w-100 d-inline-flex flex-column justify-content-start align-items-start ${gClass('content')}"
                  >
                    <div class="fixed-top-section">
                      <div class=" ${cf.key != 'album' ? `d-flex` : `d-none`}" style="gap:14px;">${pageBTN()}</div>
                      <div class="d-flex w-100" style="gap:14px;">
                        ${BgWidget.searchFilter(gvc.event(e => {
                                    vm.query = e.value;
                                    gvc.notifyDataChange(vm.id);
                                }), vm.query || '', cf.key == 'album-manager' || vm.type == 'file' ? `搜尋圖片` : `搜尋相簿`)}
                        ${BgWidget.updownFilter({
                                    gvc,
                                    callback: (value) => {
                                        vm.orderString = value;
                                        gvc.notifyDataChange(vm.id);
                                    },
                                    default: vm.orderString || 'default',
                                    options: FilterOptions.imageLibraryOrderBy,
                                })}
                      </div>
                      ${drawSelectBar(vm.link)}
                    </div>
                    <div class="scrollable-bottom-section d-flex flex-column">
                      <div
                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex"
                      >
                        ${(() => {
                                    let viewData = vm.link.filter(data => {
                                        return data.type == vm.type;
                                    });
                                    if (viewData.length == 0) {
                                        return html `
                              <div
                                class="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                                style="padding-top: 106px;"
                              >
                                ${vm.type == 'file'
                                            ? html ` <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="80"
                                      height="80"
                                      viewBox="0 0 80 80"
                                      fill="none"
                                    >
                                      <path
                                        d="M10 10C7.23438 10 5 12.2344 5 15V51.4688L15.5781 40.8906C18.0156 38.4531 21.9688 38.4531 24.4219 40.8906L35 51.4688L55.5781 30.8906C58.0156 28.4531 61.9688 28.4531 64.4219 30.8906L75 41.4688V15C75 12.2344 72.7656 10 70 10H10ZM5 58.5312V65C5 67.7656 7.23438 70 10 70H16.4688L31.4688 55L20.8906 44.4219C20.4062 43.9375 19.6094 43.9375 19.125 44.4219L5 58.5312ZM60.8906 34.4219C60.4063 33.9375 59.6094 33.9375 59.125 34.4219L23.5312 70H70C72.7656 70 75 67.7656 75 65V48.5312L60.8906 34.4219ZM0 15C0 9.48438 4.48438 5 10 5H70C75.5156 5 80 9.48438 80 15V65C80 70.5156 75.5156 75 70 75H10C4.48438 75 0 70.5156 0 65V15ZM25 22.5C25 21.837 24.7366 21.2011 24.2678 20.7322C23.7989 20.2634 23.163 20 22.5 20C21.837 20 21.2011 20.2634 20.7322 20.7322C20.2634 21.2011 20 21.837 20 22.5C20 23.163 20.2634 23.7989 20.7322 24.2678C21.2011 24.7366 21.837 25 22.5 25C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5ZM15 22.5C15 20.5109 15.7902 18.6032 17.1967 17.1967C18.6032 15.7902 20.5109 15 22.5 15C24.4891 15 26.3968 15.7902 27.8033 17.1967C29.2098 18.6032 30 20.5109 30 22.5C30 24.4891 29.2098 26.3968 27.8033 27.8033C26.3968 29.2098 24.4891 30 22.5 30C20.5109 30 18.6032 29.2098 17.1967 27.8033C15.7902 26.3968 15 24.4891 15 22.5Z"
                                        fill="#393939"
                                      />
                                    </svg>`
                                            : html ` <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="80"
                                      height="80"
                                      viewBox="0 0 80 80"
                                      fill="none"
                                    >
                                      <path
                                        d="M10 10C7.23438 10 5 12.2344 5 15V65C5 67.7656 7.23438 70 10 70H70C72.7656 70 75 67.7656 75 65V25C75 22.2344 72.7656 20 70 20H45.6094C42.9531 20 40.4062 18.9531 38.5312 17.0781L32.9219 11.4688C31.9844 10.5312 30.7188 10 29.3906 10H10ZM0 15C0 9.48438 4.48438 5 10 5H29.3906C32.0469 5 34.5938 6.04688 36.4688 7.92188L42.0781 13.5312C43.0156 14.4688 44.2812 15 45.6094 15H70C75.5156 15 80 19.4844 80 25V65C80 70.5156 75.5156 75 70 75H10C4.48438 75 0 70.5156 0 65V15Z"
                                        fill="#393939"
                                      />
                                    </svg>`}
                                <div
                                  style="color: #8D8D8D;font-size: 18px;font-weight: 400;margin-top: 12px;margin-bottom: 24px;"
                                >
                                  ${vm.type == 'file' ? `尚未上傳任何圖片` : `尚未建立任何相簿`}
                                </div>
                                <div
                                  style="color: #FFF;font-weight: 700;font-size: 16px;padding: 6px 18px;border-radius: 10px;background: #393939;cursor: pointer;"
                                  onclick="${gvc.event(() => {
                                            if (vm.type == 'file') {
                                                cf.plus(gvc, file => {
                                                    vm.link.push(...file);
                                                    save(() => {
                                                        gvc.notifyDataChange(vm.id);
                                                    });
                                                }, 'file');
                                            }
                                            else {
                                                vm.tag = '';
                                                vm.type = 'folderADD';
                                                vm.newFolder = {
                                                    selected: false,
                                                    title: '',
                                                    data: [],
                                                    items: [],
                                                    type: 'folder',
                                                    tag: [],
                                                    id: gvc.glitter.getUUID(),
                                                };
                                                gvc.notifyDataChange(vm.id);
                                            }
                                        })}"
                                >
                                  ${vm.type == 'file' ? `上傳圖片` : `建立相簿`}
                                </div>
                              </div>
                            `;
                                    }
                                    return html `
                            <div
                              class="w-100 ${vm.type == 'file' || vm.type == 'folder'
                                        ? `d-flex`
                                        : `d-none`} align-items-center justify-content-center"
                              style="padding: 39px 0;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                            >
                              <div
                                style="padding:6px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);font-size: 16px;font-weight: 400;cursor:pointer;"
                                onclick="${gvc.event(() => {
                                        if (vm.type == 'file') {
                                            cf.plus(gvc, file => {
                                                vm.link.push(...file);
                                                save(() => {
                                                    gvc.notifyDataChange(vm.id);
                                                });
                                            }, 'file');
                                        }
                                        else {
                                            vm.tag = '';
                                            vm.type = 'folderADD';
                                            vm.newFolder = {
                                                selected: false,
                                                title: '',
                                                data: [],
                                                items: [],
                                                type: 'folder',
                                                tag: [],
                                                id: gvc.glitter.getUUID(),
                                            };
                                            gvc.notifyDataChange(vm.id);
                                        }
                                    })}"
                              >
                                ${vm.type == 'file' ? '上傳新照片' : '新增相簿'}
                              </div>
                            </div>
                            ${renderItems(viewData)}
                          `;
                                })()}
                      </div>
                    </div>
                  </div>
                `;
                            }
                            if (vm.loading) {
                                dialog.dataLoading({
                                    visible: true,
                                });
                                return ``;
                            }
                            dialog.dataLoading({
                                visible: false,
                            });
                            return drawSelectImg();
                        }),
                        divCreate: {
                            class: `w-100 h-100`,
                            style: `padding: 8px;`,
                        },
                    };
                });
            },
            footer_html: (gvc) => {
                const footerType = vm.type;
                const dialog = new ShareDialog(cf.gvc.glitter);
                function clearNoNeedData(items) {
                    items.map(dd => {
                        if (dd.selected) {
                            dd.selected = undefined;
                        }
                        clearNoNeedData(dd.items || []);
                    });
                }
                function save(finish, text) {
                    clearNoNeedData(vm.link);
                    dialog.dataLoading({ visible: true });
                    ApiUser.setPublicConfig({
                        key: 'image-manager',
                        value: vm.link,
                        user_id: 'manager',
                    }).then(data => {
                        dialog.dataLoading({ visible: false });
                        dialog.successMessage({ text: text !== null && text !== void 0 ? text : '儲存成功' });
                        changeWindowsName('圖片庫');
                        finish();
                    });
                }
                function getFolderEditButtons(gvc, save) {
                    return [
                        {
                            type: 'cancel',
                            label: '返回',
                            onClick: () => {
                                if (cf.cancelEvent) {
                                    changeWindowsName('圖片庫');
                                    cf.cancelEvent();
                                }
                                gvc.closeDialog();
                            },
                        },
                        {
                            type: 'danger',
                            label: '刪除相簿',
                            onClick: () => {
                                new ShareDialog(gvc.glitter).checkYesOrNot({
                                    text: `您確定要永久刪除此資料夾嗎？刪除後將取消這些照片間的關聯。`,
                                    callback: yes => {
                                        if (!yes)
                                            return;
                                        vm.link.forEach(item => {
                                            var _a;
                                            if ((_a = item.tag) === null || _a === void 0 ? void 0 : _a.includes(vm.tag)) {
                                                item.selected = false;
                                                item.tag = item.tag.filter(t => t !== vm.tag);
                                            }
                                        });
                                        const idx = vm.link.findIndex(d => d.title === vm.tag && d.type === 'folder');
                                        vm.link.splice(idx, 1);
                                        cf.getSelect(vm.link);
                                        save(() => {
                                            changeWindowsName('圖片庫');
                                            gvc.closeDialog();
                                        }, '刪除成功');
                                    },
                                });
                            },
                        },
                        {
                            type: 'save',
                            label: '確定變更',
                            onClick: () => {
                                cf.getSelect(vm.link);
                                save(() => gvc.closeDialog());
                            },
                        },
                    ];
                }
                function getDefaultButtons(gvc, save, dialog) {
                    const finishLabel = cf.key === 'album' ? '建立' : '完成';
                    const cancelLabel = cf.key === 'album' ? '返回' : '取消';
                    return [
                        {
                            type: 'cancel',
                            label: cancelLabel,
                            onClick: () => {
                                cf.key = 'file';
                                if (cf.cancelEvent)
                                    cf.cancelEvent();
                                if (vm.type === 'folderView' || vm.type === 'folderADD') {
                                    closeFolderView();
                                    vm.type = 'folder';
                                    gvc.notifyDataChange(vm.id);
                                }
                                else if (vm.type === 'folderEdit') {
                                    closeFolderView();
                                    vm.type = 'folderView';
                                    gvc.notifyDataChange(vm.id);
                                }
                                else {
                                    gvc.closeDialog();
                                }
                            },
                        },
                        {
                            type: 'edit',
                            label: '編輯',
                            onClick: () => {
                                vm.type = 'folderEdit';
                                cf.key = 'album';
                                gvc.notifyDataChange(vm.id);
                            },
                        },
                        {
                            type: 'save',
                            label: finishLabel,
                            onClick: () => {
                                const selected = [];
                                (function walk(arr) {
                                    arr.forEach(d => {
                                        if (d.type === 'folder')
                                            walk(d.items || []);
                                        else if (d.selected)
                                            selected.push(d);
                                    });
                                })(vm.link);
                                if (vm.type === 'folderADD') {
                                    if (!vm.tag) {
                                        dialog.infoMessage({ text: '相簿尚未命名' });
                                        return;
                                    }
                                    vm.newFolder.title = vm.tag;
                                    vm.newFolder.data.forEach((data) => {
                                        var _a;
                                        const findImage = vm.link.find(image => image.id === data.id);
                                        if (findImage) {
                                            findImage.tag.push((_a = vm.tag) !== null && _a !== void 0 ? _a : '');
                                        }
                                    });
                                    vm.newFolder.data = [];
                                    vm.link.push(vm.newFolder);
                                    save(() => {
                                        vm.type = 'folder';
                                        gvc.notifyDataChange(vm.id);
                                    });
                                    return;
                                }
                                if (cf.key === 'album') {
                                    dialog.successMessage({ text: '相簿建立成功' });
                                    cf.getSelect(selected);
                                    return;
                                }
                                if (['image-manager', 'folderEdit'].includes(cf.key)) {
                                    if (selected.length || cf.edit_only) {
                                        save(() => {
                                            cf.getSelect(selected);
                                            gvc.closeDialog();
                                        });
                                    }
                                    else {
                                        dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                    }
                                }
                                else {
                                    cf.getSelect(selected);
                                    gvc.closeDialog();
                                }
                            },
                        },
                    ];
                }
                const defs = vm.type === 'folderEdit' ? getFolderEditButtons(gvc, save) : getDefaultButtons(gvc, save, dialog);
                return gvc.bindView({
                    bind: vm.footer_id,
                    view: () => {
                        return defs
                            .map(d => {
                            const widget = d.type === 'cancel' || d.type === 'edit'
                                ? BgWidget.cancel
                                : d.type === 'danger'
                                    ? BgWidget.danger
                                    : BgWidget.save;
                            if (d.type == 'edit') {
                                if (vm.type == 'folderView') {
                                    return widget(gvc.event(d.onClick), d.label);
                                }
                                return '';
                            }
                            else {
                                return widget(gvc.event(d.onClick), d.label);
                            }
                        })
                            .join('');
                    },
                    divCreate: {
                        class: 'w-100 d-flex align-items-center justify-content-end',
                        style: 'gap:14px',
                    },
                });
            },
            closeCallback: () => {
                if (cf.cancelEvent) {
                    cf.cancelEvent();
                }
            },
        });
    }
    static selectImageFromArray(imageArray, cf) {
        const gvc = cf.gvc;
        gvc.addStyle(`
            .imageHover {
                border: 2px solid #393939;box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.10);
            }
        `);
        let selected = undefined;
        BgWidget.imageLibraryDialog({
            gvc: gvc,
            title: cf.title,
            innerHTML: (gvc) => {
                let editArray = [];
                imageArray.forEach(item => {
                    editArray.push(false);
                });
                return html `
          <div class="w-100 d-flex flex-column">
            <div style="font-size: 13px;">您只能選擇圖片當作子類媒體</div>
            <div class="d-flex flex-wrap w-100" style="gap: 0.5rem;margin-top:1rem;">
              ${gvc.bindView({
                    bind: 'imageArray',
                    view: () => {
                        const isSafari = (() => {
                            const userAgent = navigator.userAgent.toLowerCase();
                            return userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('edg');
                        })();
                        return [
                            html ` <div
                      class="col-2 d-flex align-items-center justify-content-center "
                      style="border-radius:10px;cursor: pointer;border:1px solid #DDD;"
                      onclick="${gvc.event(() => {
                                EditorElem.uploadFileFunction({
                                    gvc: gvc,
                                    callback: (text) => {
                                        let allData = {};
                                        const updateData = {
                                            title: text[0].split('_')[3],
                                            data: text[0],
                                            items: [],
                                            type: 'file',
                                            tag: [],
                                            id: gvc.glitter.getUUID(),
                                        };
                                        const dialog = new ShareDialog(gvc.glitter);
                                        dialog.dataLoading({
                                            visible: true,
                                        });
                                        function getPublicConfig(callback) {
                                            ApiUser.getPublicConfig('image-manager', 'manager').then((data) => {
                                                if (data.response.value) {
                                                    allData = data.response.value;
                                                    function loop(array) {
                                                        if (array.length > 0) {
                                                            array.map(dd => {
                                                                var _a;
                                                                if (dd.type === 'folder') {
                                                                    loop((_a = dd.items) !== null && _a !== void 0 ? _a : []);
                                                                }
                                                            });
                                                        }
                                                    }
                                                    loop(data);
                                                    callback();
                                                }
                                                else {
                                                    callback();
                                                }
                                            });
                                        }
                                        getPublicConfig(() => {
                                            allData.push(updateData);
                                            ApiUser.setPublicConfig({
                                                key: 'image-manager',
                                                value: allData,
                                                user_id: 'manager',
                                            }).then(data => {
                                                imageArray.push(text[0]);
                                                dialog.dataLoading({
                                                    visible: false,
                                                });
                                                gvc.notifyDataChange('imageArray');
                                            });
                                        });
                                    },
                                    return_array: true,
                                    multiple: true,
                                });
                            })}"
                    >
                      <div
                        style="padding:6px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);font-size: 16px;font-weight: 400;cursor:pointer;"
                      >
                        新增圖片
                      </div>
                    </div>`,
                            imageArray
                                .map((image, index) => {
                                return html `
                          <div
                            class="col-2 position-relative imageHover"
                            style="padding: 10px 12px;position: relative;${selected == index
                                    ? `border-radius: 10px;border: 2px solid #393939;background: #F7F7F7;box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.10);`
                                    : editArray[index]
                                        ? `border-radius: 10px;border: 1px solid #DDD;background: #F7F7F7;`
                                        : ``}"
                            onclick="${gvc.event(() => {
                                    selected = index;
                                    gvc.notifyDataChange('imageArray');
                                })}"
                            onmouseenter="${gvc.event(() => {
                                    if (!editArray[index]) {
                                        editArray[index] = true;
                                        gvc.notifyDataChange('imageArray');
                                    }
                                })}"
                            onmouseleave="${gvc.event((e, event) => {
                                    if (isSafari) {
                                        const imageBoxClass = Tool.randomString(5);
                                        const target = event.relatedTarget;
                                        const imageBoxClassList = [imageBoxClass];
                                        const targetClassList = Array.from(target.classList);
                                        const isOutBorder = imageBoxClassList.every(cls => targetClassList.includes(cls)) &&
                                            targetClassList.every(cls => imageBoxClassList.includes(cls));
                                        const isTitle = targetClassList.includes(`${imageBoxClass}-title`);
                                        const isInside = targetClassList.length === 0;
                                        const isOutOfViewContainer = target.dataset.viewContainer === 'true';
                                        const isUL = target.tagName === 'UL';
                                        if ((isOutBorder || isTitle || isInside) && !(isOutOfViewContainer || isUL)) {
                                            return;
                                        }
                                    }
                                    editArray[index] = false;
                                    gvc.notifyDataChange('imageArray');
                                })}"
                          >
                            <div
                              class="w-100"
                              style="background: url('${image}') 50%/cover;padding-bottom:100%;border-radius: 10px;"
                            ></div>
                          </div>
                        `;
                            })
                                .join(``),
                        ].join(``);
                    },
                    divCreate: { class: `d-flex flex-wrap w-100`, style: `gap: 0.5rem;margin-top:1rem;` },
                })}
            </div>
          </div>
        `;
            },
            footer_html: (gvc) => {
                const dialog = new ShareDialog(cf.gvc.glitter);
                return BgWidget.save(gvc.event(() => {
                    gvc.closeDialog();
                    cf.getSelect(imageArray[selected]);
                }));
            },
            closeCallback: () => {
                if (cf.cancelEvent) {
                    cf.cancelEvent();
                }
            },
        });
    }
    static selectImageLibrary(gvc, callback, title, opt, edit_only) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let alt = '';
            let saveAlt = function () { };
            function editorView(gvc, item) {
                var _a, _b;
                if (item.type === 'folder') {
                    return BgWidget.editeInput({
                        gvc: gvc,
                        title: `資料夾標題`,
                        default: item.title,
                        placeHolder: `請輸入資料夾標題`,
                        callback: text => {
                            item.title = text;
                        },
                    });
                }
                else {
                    item.data = (_a = item.data) !== null && _a !== void 0 ? _a : {};
                    return `<div>${[
                        BgWidget.editeInput({
                            gvc: gvc,
                            title: `圖片標題`,
                            default: item.title,
                            placeHolder: `請輸入圖片標題`,
                            callback: text => {
                                item.title = text;
                            },
                        }),
                        EditorElem.uploadImageContainer({
                            gvc: gvc,
                            title: `圖片資源`,
                            def: (_b = item.data) !== null && _b !== void 0 ? _b : '',
                            callback: text => {
                                item.data = text;
                            },
                        }),
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => __awaiter(this, void 0, void 0, function* () {
                                    const tag = gvc.glitter.generateCheckSum(item.data, 9);
                                    alt = (yield ApiUser.getPublicConfig(`alt_` + tag, 'manager')).response.value || { alt: '' };
                                    saveAlt = () => __awaiter(this, void 0, void 0, function* () {
                                        ApiUser.setPublicConfig({
                                            key: `alt_` + tag,
                                            value: alt,
                                            user_id: 'manager',
                                        });
                                    });
                                    return BgWidget.textArea({
                                        gvc: gvc,
                                        title: `ALT描述`,
                                        default: alt.alt,
                                        placeHolder: `請輸入ALT描述`,
                                        callback: text => {
                                            alt.alt = text;
                                        },
                                    });
                                }),
                            };
                        }),
                    ].join('<div class="my-2"></div>')}</div>`;
                }
            }
            imageLibrary.fileSystem({
                getSelect: callback,
                edit_only: edit_only,
                gvc: gvc,
                key: opt ? ((_a = opt.key) !== null && _a !== void 0 ? _a : 'image-manager') : 'image-manager',
                title: title,
                tag: (_b = opt === null || opt === void 0 ? void 0 : opt.tag) !== null && _b !== void 0 ? _b : '',
                mul: opt ? ((_c = opt.mul) !== null && _c !== void 0 ? _c : false) : false,
                plus: (gvc, callback) => {
                    const item = {
                        selected: false,
                        title: '',
                        data: {},
                        items: [],
                        type: 'file',
                        tag: [],
                        id: gvc.glitter.getUUID(),
                    };
                    let count = 1;
                    EditorElem.uploadFileFunction({
                        gvc: gvc,
                        callback: (text) => {
                            callback(text.map((item) => {
                                return {
                                    title: item.split('_')[item.split('_').length - 1],
                                    data: item,
                                    items: [],
                                    type: 'file',
                                    tag: [],
                                    id: gvc.glitter.getUUID(),
                                };
                            }));
                        },
                        return_array: true,
                        multiple: true,
                    });
                },
                edit: (item, callback, obj) => {
                    item = JSON.parse(JSON.stringify(item));
                    BgWidget.settingDialog({
                        gvc: gvc,
                        title: '更新圖片',
                        innerHTML: (gvc) => {
                            return editorView(gvc, item);
                        },
                        footer_html: (gvc) => {
                            return [
                                BgWidget.danger(gvc.event(() => {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    function deleteImage() {
                                        const text = item.type == 'folder'
                                            ? `此操作不可復原。確定要刪除相簿${item.title}嗎？`
                                            : '刪除此圖片後，所有使用它的頁面與商品將無法顯示。<br>是否確定？';
                                        dialog.checkYesOrNotWithCustomWidth({
                                            width: '432',
                                            text: text,
                                            icon: '<i class="fa-solid fa-info"></i>',
                                            callback: response => {
                                                if (response) {
                                                    callback(undefined);
                                                    gvc.closeDialog();
                                                }
                                            },
                                        });
                                    }
                                    function deleteAlbumTag() {
                                        item.tag = item.tag.filter(t => t !== (obj === null || obj === void 0 ? void 0 : obj.tag));
                                        callback(item);
                                        gvc.closeDialog();
                                    }
                                    switch (obj === null || obj === void 0 ? void 0 : obj.deleteStyle) {
                                        case 1: {
                                            gvc.glitter.innerDialog(() => {
                                                const prefixClass = 'deleteWindows';
                                                function closeThisDialog() {
                                                    gvc.glitter.closeDiaLog('deleteWindows');
                                                }
                                                function gClass(className) {
                                                    return prefixClass + '-' + className;
                                                }
                                                gvc.addStyle(css `
                          .${prefixClass}-window {
                            width: 452px;
                            height: 281px;
                            border-radius: 10px;
                            background: #fff;
                            position: relative;
                            display: inline-flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 24px;
                            padding: 36px 46px;
                          }

                          .${prefixClass}-window .fa-xmark-large {
                            position: absolute;
                            top: 17px;
                            right: 20px;
                            cursor: pointer;
                          }

                          .${prefixClass}-text-block {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 8px;
                            text-align: center;
                            font-size: 16px;
                            font-weight: 400;
                            line-height: 160%; /* 25.6px */
                          }

                          .${prefixClass}-text-block .button {
                            display: flex;
                            padding: 6px 18px;
                            justify-content: center;
                            align-items: center;
                            gap: 8px;
                            border-radius: 10px;
                            border: 1px solid #ddd;
                            background: #fff;
                            color: #393939;
                            cursor: pointer;
                          }
                        `);
                                                return html `
                          <div class="${gClass('window')}">
                            <i
                              class="fa-regular fa-xmark-large"
                              onclick="${gvc.event(() => {
                                                    closeThisDialog();
                                                })}"
                            ></i>
                            <i class="fa-regular fa-circle-exclamation mb-1" style="font-size: 4rem;"></i>
                            <div class="${gClass('text-block')}">
                              <div>請選擇刪除方式：</div>
                              <div
                                class="button"
                                onclick="${gvc.event(() => {
                                                    deleteAlbumTag();
                                                    closeThisDialog();
                                                })}"
                              >
                                僅從此相簿移除
                              </div>
                              <div
                                class="button"
                                onclick="${gvc.event(() => {
                                                    deleteImage();
                                                    closeThisDialog();
                                                })}"
                              >
                                從圖庫中永久刪除
                              </div>
                            </div>
                          </div>
                        `;
                                            }, `deleteWindows`);
                                            break;
                                        }
                                        default: {
                                            deleteImage();
                                            break;
                                        }
                                    }
                                })),
                                BgWidget.cancel(gvc.event(() => {
                                    gvc.closeDialog();
                                })),
                                BgWidget.save(gvc.event(() => {
                                    callback(item);
                                    saveAlt();
                                    gvc.closeDialog();
                                }), '確定'),
                            ].join('');
                        },
                        closeCallback: () => { },
                    });
                },
                cancelEvent: () => {
                    if (opt === null || opt === void 0 ? void 0 : opt.cancelEvent) {
                        opt.cancelEvent();
                    }
                },
            });
        });
    }
}

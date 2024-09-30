var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiUser } from "../glitter-base/route/user.js";
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
import { BgWidget } from "../backend-manager/bg-widget.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { FilterOptions } from "../cms-plugin/filter-options.js";
const html = String.raw;
export class imageLibrary {
    static fileSystem(cf) {
        const gvc = cf.gvc;
        const vm = {
            id: cf.gvc.glitter.getUUID(),
            link: [],
            selected: false,
            loading: true,
            query: "",
            orderString: "created_time_desc",
            type: "file",
        };
        if (cf.key == "folderEdit") {
            vm.tag = cf.tag;
            vm.type = "folderEdit";
        }
        function getSelectCount(dd) {
            let count = 0;
            if (dd.selected) {
                count++;
            }
            return dd.items.filter((d) => {
                return d.selected;
            }).length;
        }
        function getPublicConfig(callback) {
            ApiUser.getPublicConfig('image-manager', 'manager').then((data) => {
                if (data.response.value) {
                    vm.link = data.response.value;
                    function loop(array) {
                        array.map((dd) => {
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
            });
        }
        const dialog = new ShareDialog(cf.gvc.glitter);
        function clearNoNeedData(items) {
            items.map((dd) => {
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
                key: "image-manager",
                value: vm.link,
                user_id: 'manager',
            }).then((data) => {
                dialog.dataLoading({ visible: false });
                dialog.successMessage({ text: '儲存成功' });
                finish();
            });
        }
        BgWidget.imageLibraryDialog({
            gvc: gvc,
            title: cf.title,
            innerHTML: (gvc) => {
                const that = this;
                function renderItems(array, opt) {
                    const id = gvc.glitter.getUUID();
                    return (gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                let editArray = [];
                                let sortArray = array;
                                switch (vm.orderString) {
                                    case "created_time_desc": {
                                        sortArray = array.reverse();
                                        break;
                                    }
                                    case "created_time_asc": {
                                        break;
                                    }
                                    case "name_AtoZ": {
                                        sortArray.sort((a, b) => {
                                            return a.title.localeCompare(b.title);
                                        });
                                        break;
                                    }
                                    case "name_ZtoA": {
                                        sortArray.sort((b, a) => {
                                            return a.title.localeCompare(b.title);
                                        });
                                        break;
                                    }
                                }
                                return array.map((dd, index) => {
                                    if (editArray.length < index + 1) {
                                        editArray.push(false);
                                    }
                                    if (!dd.title.toLowerCase().includes(vm.query.toLowerCase())) {
                                        return;
                                    }
                                    let viewID = gvc.glitter.getUUID();
                                    return gvc.bindView({
                                        bind: viewID,
                                        view: () => {
                                            var _a, _b;
                                            const passType = ["file", "folderView", "folderEdit", "folderADD"];
                                            const noImageURL = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
                                            const imageUrl = (passType.includes(vm.type))
                                                ? dd.data
                                                : ((_b = (_a = vm.link.find(data => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.tag) === null || _a === void 0 ? void 0 : _a.includes(dd.title); })) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : noImageURL);
                                            return html `
                                                    <div class=""
                                                         style="padding: 10px 12px;position: relative;${(dd.selected) ? `border-radius: 10px;border: 2px solid #393939;background: #F7F7F7;box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.10);` : editArray[index] ? `border-radius: 10px;border: 1px solid #DDD;background: #F7F7F7;` : ``}"
                                                         onclick="${gvc.event((e, event) => {
                                                let defaultSelect = dd.selected;
                                                if (vm.type == "folder") {
                                                    array = [];
                                                    vm.type = "folderView";
                                                    vm.tag = dd.title;
                                                    gvc.notifyDataChange(vm.id);
                                                    return;
                                                }
                                                if (opt === null || opt === void 0 ? void 0 : opt.onlyRead) {
                                                    return;
                                                }
                                                if (!cf.mul) {
                                                    array.forEach((data) => {
                                                        data.selected = false;
                                                    });
                                                }
                                                dd.selected = !defaultSelect;
                                                gvc.notifyDataChange(vm.id);
                                                event.stopPropagation();
                                            })}"
                                                         onmouseenter="${gvc.event(() => {
                                                if ((opt === null || opt === void 0 ? void 0 : opt.onlyRead) || cf.key == "album") {
                                                    return;
                                                }
                                                if (!editArray[index]) {
                                                    editArray[index] = true;
                                                    gvc.notifyDataChange(viewID);
                                                }
                                            })}"
                                                         onmouseleave="${gvc.event(() => {
                                                if (opt === null || opt === void 0 ? void 0 : opt.onlyRead) {
                                                    return;
                                                }
                                                editArray[index] = false;
                                                gvc.notifyDataChange(viewID);
                                            })}">
                                                        <div class="${(editArray[index] && !dd.selected) ? `d-flex` : `d-none`}  align-items-center justify-content-center"
                                                             style="height:24px;width:24px;border-radius: 3px;background: rgba(0, 0, 0, 0.80);position: absolute;right: 8.15px;top: 8px;"
                                                             onclick="${gvc.event((e, event) => {
                                                event.stopPropagation();
                                                if (vm.type == "folder") {
                                                    vm.tag = dd.title;
                                                    that.selectImageLibrary(gvc, (selectData) => {
                                                        vm.link = selectData;
                                                        gvc.notifyDataChange(vm.id);
                                                    }, `<div class="d-flex flex-column" style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">${vm.tag}</div>`, {
                                                        key: 'folderEdit',
                                                        mul: true,
                                                        tag: dd.title,
                                                    });
                                                }
                                                else {
                                                    cf.edit(dd, (replace) => {
                                                        if (!replace) {
                                                            let selectData = vm.link.findIndex(data => { return data.id == dd.id; });
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
                                            })}">
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                 width="12"
                                                                 height="12"
                                                                 viewBox="0 0 12 12"
                                                                 fill="none">
                                                                <g clip-path="url(#clip0_13619_1920)">
                                                                    <path d="M0.852963 8.45864L0.3139 10.2891L0.0232751 11.2782C-0.0353187 11.4774 0.0185876 11.6907 0.1639 11.836C0.309213 11.9813 0.522494 12.0352 0.719369 11.979L1.71078 11.686L3.54124 11.1469C3.78499 11.0766 4.01234 10.9594 4.21156 10.8071L4.21859 10.8118L4.23031 10.793C4.26312 10.7672 4.29359 10.7415 4.32406 10.7157C4.35687 10.6875 4.38734 10.6571 4.41781 10.6266L11.5475 3.49927C12.0608 2.98599 12.1241 2.19614 11.7397 1.61255C11.6858 1.53052 11.6202 1.45083 11.5475 1.37817L10.6241 0.452393C10.0381 -0.133545 9.0889 -0.133545 8.50296 0.452393L1.37328 7.58208C1.31468 7.64067 1.25843 7.70395 1.20687 7.76958L1.18812 7.7813L1.19281 7.78833C1.04046 7.98755 0.925619 8.21489 0.852963 8.45864ZM8.9764 4.47661L4.6264 8.82661L3.4639 8.53599L3.17327 7.37349L7.52328 3.02349L8.9764 4.47661ZM2.27328 8.41177L2.45374 9.13833C2.50296 9.33989 2.66234 9.49692 2.8639 9.54849L3.59046 9.72895L3.41703 9.99145C3.35609 10.0243 3.29281 10.0524 3.22718 10.0711L2.67874 10.2329L1.39203 10.6079L1.76937 9.32349L1.93109 8.77505C1.94984 8.70942 1.97796 8.6438 2.01078 8.5852L2.27328 8.41177ZM7.38968 5.12583C7.53499 4.98052 7.53499 4.74145 7.38968 4.59614C7.24437 4.45083 7.00531 4.45083 6.85999 4.59614L4.60999 6.84614C4.46468 6.99146 4.46468 7.23052 4.60999 7.37583C4.75531 7.52114 4.99437 7.52114 5.13968 7.37583L7.38968 5.12583Z"
                                                                          fill="white"/>
                                                                </g>
                                                                <defs>
                                                                    <clipPath
                                                                            id="clip0_13619_1920">
                                                                        <rect width="12"
                                                                              height="12"
                                                                              fill="white"/>
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                        </div>
                                                        <div class="${(dd.selected) ? `d-flex` : `d-none`}  "
                                                             style="height:24px;width:24px;border-radius: 3px;position: absolute;right: 8.15px;top: 8px;"
                                                        >
                                                            <i class="fa-solid fa-square-check "
                                                               style="color: #393939;font-size: 24px;"></i>

                                                        </div>

                                                        <div style="width:100%;padding-top: 100%;background:50%/contain url('${imageUrl}') no-repeat;border-radius: 5px;border: 0.938px solid #DDD;background: ;"></div>
                                                        <div class="w-100 text-center font-size: 16px;font-style: normal;font-weight: 400;text-overflow: ellipsis;"
                                                             style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;"
                                                             contenteditable="true"
                                                             onchange="${gvc.event((e) => {
                                            })}">
                                                            ${dd.title}
                                                        </div>
                                                    </div>
                                                `;
                                        },
                                        divCreate: { style: `width:15%;cursor:pointer;` }
                                    });
                                }).join('');
                            },
                            divCreate: {
                                elem: 'ul',
                                class: `w-100 my-2 flex-wrap `,
                                style: `display:flex;gap:17px;`,
                            },
                            onCreate: () => {
                                gvc.glitter.addMtScript([
                                    {
                                        src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                    },
                                ], () => {
                                }, () => {
                                });
                                const interval = setInterval(() => {
                                    if (window.Sortable) {
                                        try {
                                            gvc.addStyle(`
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
                                            Sortable.create(gvc.getBindViewElem(id).get(0), {
                                                group: id,
                                                animation: 100,
                                                handle: '.dragItem',
                                                onChange: function (evt) {
                                                },
                                                onEnd: (evt) => {
                                                    swapArr(array, startIndex, evt.newIndex);
                                                    gvc.notifyDataChange(id);
                                                },
                                                onStart: function (evt) {
                                                    startIndex = evt.oldIndex;
                                                },
                                            });
                                        }
                                        catch (e) {
                                        }
                                        clearInterval(interval);
                                    }
                                }, 100);
                            },
                        };
                    }));
                }
                getPublicConfig(() => {
                    gvc.notifyDataChange(vm.id);
                });
                return gvc.bindView(() => {
                    return {
                        bind: vm.id,
                        view: () => __awaiter(this, void 0, void 0, function* () {
                            var _a, _b, _c;
                            const dialog = new ShareDialog(cf.gvc.glitter);
                            function pageBTN() {
                                let key = [
                                    {
                                        key: "file",
                                        value: "全部圖片",
                                    },
                                    {
                                        key: "folder",
                                        value: "相簿",
                                    },
                                ];
                                return key.map((data) => {
                                    return html `
                                        <div style="color:${vm.type == data.key ? '#393939' : '#8D8D8D'};display: flex;padding:6px 18px;justify-content: center;align-items: center;border-radius: 10px;border: 2px solid ${vm.type == data.key ? '#393939' : '#8D8D8D'};background: #FFF;font-weight: ${vm.type == data.key ? '700' : '500'};cursor: pointer;"
                                             onclick="${gvc.event((e) => {
                                        vm.type = data.key;
                                        vm.query = "";
                                        gvc.notifyDataChange(vm.id);
                                    })}">
                                            ${data.value}
                                        </div>
                                    `;
                                }).join('');
                            }
                            if (vm.type == "folderADD") {
                                return html `
                                    <div class="d-flex flex-column"
                                         style="font-size: 16px;font-style: normal;font-weight: 400;gap:8px;">
                                        相簿名稱
                                        <input class="w-100" value="${(_a = vm.tag) !== null && _a !== void 0 ? _a : ""}" placeholder="請輸入相簿名稱"
                                               style="height: 40px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                               onchange="${gvc.event((e) => {
                                    vm.tag = e.value;
                                })}">
                                    </div>
                                    <div class="w-100 "
                                         style="margin-top:18px;padding: 39px 0;display: flex;justify-content: center;align-items: center;border-radius: 10px;border: 1px solid #DDD;background: #FFF;gap:14px;">
                                        <div style="padding: 10px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);cursor: pointer;"
                                             onclick="${gvc.event(() => {
                                    if (!vm.tag) {
                                        const dialog = new ShareDialog(cf.gvc.glitter);
                                        dialog.errorMessage({ text: "請先輸入相簿名稱" });
                                        return;
                                    }
                                    this.selectImageLibrary(gvc, (selectData) => {
                                        var _a;
                                        const folder = {
                                            title: (_a = vm.tag) !== null && _a !== void 0 ? _a : "folder",
                                            data: [],
                                            items: selectData,
                                            type: "folder",
                                            tag: [],
                                            id: gvc.glitter.getUUID()
                                        };
                                        selectData.map((data) => {
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
                                        vm.link.push(folder);
                                        vm.type = "folder";
                                        gvc.notifyDataChange(vm.id);
                                        save(() => {
                                            gvc.notifyDataChange(vm.id);
                                        });
                                    }, `<div class="d-flex flex-column" style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">${vm.tag}</div>`, {
                                        key: 'album',
                                        mul: true,
                                    });
                                })}">從圖庫中選擇
                                        </div>
                                        <div style="padding: 10px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);cursor: pointer;"
                                             onclick="${gvc.event(() => {
                                    if (!vm.tag) {
                                        const dialog = new ShareDialog(cf.gvc.glitter);
                                        dialog.errorMessage({ text: "請先輸入相簿名稱" });
                                        return;
                                    }
                                    cf.plus(gvc, (fileArray) => {
                                        var _a;
                                        const folder = {
                                            title: (_a = vm.tag) !== null && _a !== void 0 ? _a : "folder",
                                            data: [],
                                            items: [],
                                            type: "folder",
                                            tag: [],
                                            id: gvc.glitter.getUUID()
                                        };
                                        fileArray.forEach(item => {
                                            item.tag = [];
                                            item.tag.push(vm.tag);
                                            vm.link.push(item);
                                        });
                                        vm.link.push(folder);
                                        gvc.notifyDataChange(vm.id);
                                    }, "file");
                                })}">上傳新圖片
                                        </div>
                                    </div>
                                    <div class="">
                                        ${gvc.bindView({
                                    bind: `folderItemGroup`,
                                    view: () => {
                                        if (vm.tag) {
                                            let group = vm.link.filter((item2) => {
                                                var _a;
                                                return item2.tag && item2.tag.includes((_a = vm.tag) !== null && _a !== void 0 ? _a : "");
                                            });
                                            return renderItems(group, { onlyRead: true });
                                        }
                                        return ``;
                                    }, divCreate: {}
                                })}
                                    </div>
                                `;
                            }
                            if (vm.type == "folderView") {
                                return html `
                                    <div class="d-flex flex-column"
                                         style="font-size: 16px;font-style: normal;font-weight: 400;gap:8px;">
                                        <input class="w-100" value="${(_b = vm.tag) !== null && _b !== void 0 ? _b : ""}" placeholder="請輸入相簿名稱"
                                               style="height: 40px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                               onchange="${gvc.event((e) => {
                                    vm.tag = e.value;
                                })}">
                                    </div>
                                    <div class="d-flex w-100" style="gap:14px;margin-top: 12px;">
                                        ${BgWidget.searchFilter(gvc.event((e) => {
                                    vm.query = e.value;
                                    gvc.notifyDataChange(vm.id);
                                }), vm.query || '', "搜尋圖片")}
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
                                    <div class="">
                                        ${gvc.bindView({
                                    bind: `folderItemGroup`,
                                    view: () => {
                                        if (vm.tag) {
                                            let group = vm.link.filter((item2) => {
                                                var _a;
                                                return item2.tag && item2.tag.includes((_a = vm.tag) !== null && _a !== void 0 ? _a : "");
                                            });
                                            console.log("array -- ", group);
                                            return renderItems(group);
                                        }
                                        return ``;
                                    }, divCreate: {}
                                })}
                                    </div>
                                `;
                            }
                            if (vm.type == "folderEdit") {
                                return html `
                                    <div class="d-flex flex-column"
                                         style="font-size: 16px;font-style: normal;font-weight: 400;gap:8px;">
                                        相簿名稱
                                        <input class="w-100" value="${(_c = vm.tag) !== null && _c !== void 0 ? _c : ""}" placeholder="請輸入相簿名稱"
                                               style="height: 40px;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                               onchange="${gvc.event((e) => {
                                    vm.tag = e.value;
                                })}">
                                    </div>
                                    <div class="d-flex w-100" style="gap:14px;margin-top: 12px;">
                                        ${BgWidget.searchFilter(gvc.event((e) => {
                                    vm.query = e.value;
                                    gvc.notifyDataChange(vm.id);
                                }), vm.query || '', "搜尋圖片")}
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
                                    <div class="d-flex w-100 justify-content-end" style="gap:12px;margin-top: 18px;">
                                        <div style="margin-right: auto; color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word">
                                                已選取${getSelectCount({
                                    items: vm.link,
                                })}項
                                        </div>
                                        ${BgWidget.grayButton("刪除", gvc.event(() => {
                                    let selectedData = vm.link.filter(item => item.selected);
                                    selectedData.forEach(item => {
                                        item.selected = false;
                                        item.tag = item.tag.filter((tag) => {
                                            return tag !== vm.tag;
                                        });
                                    });
                                    let folder = vm.link.find((dd) => {
                                        return (dd.title == vm.tag && dd.type == "folder");
                                    });
                                    gvc.notifyDataChange(vm.id);
                                }))}
                                        ${BgWidget.grayButton("新增圖片", gvc.event(() => {
                                    const thatGVC = gvc;
                                    gvc.glitter.innerDialog((gvc) => {
                                        return html `
                                                    <div style="width: 445px;height: 255px;border-radius: 10px;background: #FFF;">
                                                        <div class="d-flex" style="color:#393939;display: flex;padding: 12px 20px;align-items: center;gap: 10px;">新增圖片
                                                            <span class="d-flex align-items-center justify-content-center" style="margin-left: auto;cursor: pointer;" onclick="${gvc.event(() => {
                                            gvc.glitter.closeDiaLog('add');
                                        })}">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                  <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round"/>
                                                                  <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round"/>
                                                                </svg>
                                                            </span>
                                                        </div>
                                                        <div class="d-flex justify-content-center" style="padding-top:61px;gap:14px;">
                                                            <div style="padding: 10px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);cursor: pointer;"
                                                                 onclick="${gvc.event(() => {
                                            this.selectImageLibrary(gvc, (selectData) => {
                                                selectData.map((data) => {
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
                                                gvc.glitter.closeDiaLog('add');
                                                thatGVC.notifyDataChange(vm.id);
                                            }, `<div class="d-flex flex-column" style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">${vm.tag}</div>`, {
                                                key: 'album',
                                                mul: true,
                                            });
                                        })}">從圖庫中選擇
                                                            </div>
                                                            <div style="padding: 10px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);cursor: pointer;"
                                                                 onclick="${gvc.event(() => {
                                            cf.plus(gvc, (fileArray) => {
                                                fileArray.forEach(item => {
                                                    item.tag = [];
                                                    item.tag.push(vm.tag);
                                                    vm.link.push(item);
                                                });
                                                gvc.glitter.closeDiaLog('add');
                                                thatGVC.notifyDataChange(vm.id);
                                            }, "file");
                                        })}">上傳新圖片
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                    }, 'add');
                                }))}
                                    </div>
                                    <div class="">
                                        ${gvc.bindView({
                                    bind: `folderItemGroup`,
                                    view: () => {
                                        if (vm.tag) {
                                            return renderItems(vm.link.filter((item2) => {
                                                var _a;
                                                return item2.tag && item2.tag.includes((_a = vm.tag) !== null && _a !== void 0 ? _a : "");
                                            }));
                                        }
                                        return ``;
                                    }, divCreate: {}
                                })}
                                    </div>
                                `;
                            }
                            function drawSelectImg() {
                                return html `
                                    <div style="">
                                        <div style="width: 100%;  position: relative">
                                            <div style="width: 100%;  left: 0px; top: 0px;  flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex">
                                                <div class=" ${(cf.key == 'album') ? `d-none` : `d-flex`}"
                                                     style="gap:14px;">
                                                    ${pageBTN()}
                                                </div>
                                                <div class="d-flex w-100" style="gap:14px;">
                                                    ${BgWidget.searchFilter(gvc.event((e) => {
                                    vm.query = e.value;
                                    gvc.notifyDataChange(vm.id);
                                }), vm.query || '', cf.key == 'album-manager' || vm.type == "file" ? `搜尋圖片` : `搜尋相簿`)}
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
                                                <div
                                                        class="w-100  ${getSelectCount({
                                    items: vm.link,
                                }) > 0 && vm.type == "file"
                                    ? ``
                                    : `d-none`}"
                                                        style="height: 40px; padding: 12px 18px;background: #F7F7F7; border-radius: 10px; justify-content: flex-end; align-items: center; gap: 8px; display: inline-flex"
                                                >
                                                    <div style="flex: 1 1 0; color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word">
                                                            已選取${getSelectCount({
                                    items: vm.link,
                                })}項
                                                    </div>

                                                </div>
                                                <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
                                                    ${(() => {
                                    let viewData = vm.link.filter((data) => {
                                        return data.type == vm.type;
                                    });
                                    if (viewData.length == 0) {
                                        return html `
                                                                <div class="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                                                                     style="padding-top: 106px;">
                                                                    ${vm.type == "file" ? html `
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="80"
                                                                             height="80" viewBox="0 0 80 80"
                                                                             fill="none">
                                                                            <path d="M10 10C7.23438 10 5 12.2344 5 15V51.4688L15.5781 40.8906C18.0156 38.4531 21.9688 38.4531 24.4219 40.8906L35 51.4688L55.5781 30.8906C58.0156 28.4531 61.9688 28.4531 64.4219 30.8906L75 41.4688V15C75 12.2344 72.7656 10 70 10H10ZM5 58.5312V65C5 67.7656 7.23438 70 10 70H16.4688L31.4688 55L20.8906 44.4219C20.4062 43.9375 19.6094 43.9375 19.125 44.4219L5 58.5312ZM60.8906 34.4219C60.4063 33.9375 59.6094 33.9375 59.125 34.4219L23.5312 70H70C72.7656 70 75 67.7656 75 65V48.5312L60.8906 34.4219ZM0 15C0 9.48438 4.48438 5 10 5H70C75.5156 5 80 9.48438 80 15V65C80 70.5156 75.5156 75 70 75H10C4.48438 75 0 70.5156 0 65V15ZM25 22.5C25 21.837 24.7366 21.2011 24.2678 20.7322C23.7989 20.2634 23.163 20 22.5 20C21.837 20 21.2011 20.2634 20.7322 20.7322C20.2634 21.2011 20 21.837 20 22.5C20 23.163 20.2634 23.7989 20.7322 24.2678C21.2011 24.7366 21.837 25 22.5 25C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5ZM15 22.5C15 20.5109 15.7902 18.6032 17.1967 17.1967C18.6032 15.7902 20.5109 15 22.5 15C24.4891 15 26.3968 15.7902 27.8033 17.1967C29.2098 18.6032 30 20.5109 30 22.5C30 24.4891 29.2098 26.3968 27.8033 27.8033C26.3968 29.2098 24.4891 30 22.5 30C20.5109 30 18.6032 29.2098 17.1967 27.8033C15.7902 26.3968 15 24.4891 15 22.5Z"
                                                                                  fill="#393939"/>
                                                                        </svg>` : html `
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="80" height="80" viewBox="0 0 80 80"
                                                                             fill="none">
                                                                            <path d="M10 10C7.23438 10 5 12.2344 5 15V65C5 67.7656 7.23438 70 10 70H70C72.7656 70 75 67.7656 75 65V25C75 22.2344 72.7656 20 70 20H45.6094C42.9531 20 40.4062 18.9531 38.5312 17.0781L32.9219 11.4688C31.9844 10.5312 30.7188 10 29.3906 10H10ZM0 15C0 9.48438 4.48438 5 10 5H29.3906C32.0469 5 34.5938 6.04688 36.4688 7.92188L42.0781 13.5312C43.0156 14.4688 44.2812 15 45.6094 15H70C75.5156 15 80 19.4844 80 25V65C80 70.5156 75.5156 75 70 75H10C4.48438 75 0 70.5156 0 65V15Z"
                                                                                  fill="#393939"/>
                                                                        </svg>`}
                                                                    <div style="color: #8D8D8D;font-size: 18px;font-weight: 400;margin-top: 12px;margin-bottom: 24px;">
                                                                        ${vm.type == "file" ? `尚未上傳任何圖片` : `尚未建立任何相簿`}
                                                                    </div>
                                                                    <div style="color: #FFF;font-weight: 700;font-size: 16px;padding: 6px 18px;border-radius: 10px;background: #393939;cursor: pointer;"
                                                                         onclick="${gvc.event(() => {
                                            if (vm.type == "file") {
                                                cf.plus(gvc, (file) => {
                                                    vm.link.push(...file);
                                                    save(() => {
                                                        gvc.notifyDataChange(vm.id);
                                                    });
                                                }, "file");
                                            }
                                            else {
                                                vm.tag = "";
                                                vm.type = "folderADD";
                                                gvc.notifyDataChange(vm.id);
                                            }
                                        })}">
                                                                        ${vm.type == "file" ? `上傳圖片` : `建立相簿`}
                                                                    </div>
                                                                </div>
                                                            `;
                                    }
                                    return html `
                                                            <div class="w-100 ${(cf.key == 'album') ? `d-none` : `d-flex`} align-items-center justify-content-center"
                                                                 style="padding: 39px 0;border-radius: 10px;border: 1px solid #DDD;background: #FFF;">
                                                                <div style="padding:6px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);font-size: 16px;font-weight: 400;cursor:pointer;"
                                                                     onclick="${gvc.event(() => {
                                        if (vm.type == "file") {
                                            cf.plus(gvc, (file) => {
                                                vm.link.push(...file);
                                                save(() => {
                                                    gvc.notifyDataChange(vm.id);
                                                });
                                            }, "file");
                                        }
                                        else {
                                            vm.tag = "";
                                            vm.type = "folderADD";
                                            gvc.notifyDataChange(vm.id);
                                        }
                                    })}">${vm.type == "file" ? "上傳新照片" : "上傳相簿"}
                                                                </div>
                                                            </div>
                                                            ${renderItems(viewData)}
                                                        `;
                                })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }
                            if (vm.loading) {
                                dialog.dataLoading({
                                    visible: true
                                });
                                return ``;
                            }
                            dialog.dataLoading({
                                visible: false
                            });
                            return drawSelectImg();
                        }),
                        divCreate: {
                            style: ``,
                        },
                    };
                });
            },
            footer_html: (gvc) => {
                const dialog = new ShareDialog(cf.gvc.glitter);
                function clearNoNeedData(items) {
                    items.map((dd) => {
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
                        key: "image-manager",
                        value: vm.link,
                        user_id: 'manager',
                    }).then((data) => {
                        dialog.dataLoading({ visible: false });
                        dialog.successMessage({ text: '儲存成功' });
                        finish();
                    });
                }
                switch (cf.key) {
                    case "folderEdit": {
                        return [BgWidget.cancel(gvc.event(() => {
                                gvc.closeDialog();
                            })),
                            BgWidget.danger(gvc.event(() => {
                                const dialog = new ShareDialog(gvc.glitter);
                                dialog.checkYesOrNot({
                                    text: `刪除後使用此資源的內容將被取消關聯，是否確認刪除?`,
                                    callback: (response) => {
                                        if (response) {
                                            let selectedData = vm.link.filter(item => { var _a, _b; return ((item === null || item === void 0 ? void 0 : item.tag) && ((_a = item === null || item === void 0 ? void 0 : item.tag) === null || _a === void 0 ? void 0 : _a.includes((_b = vm.tag) !== null && _b !== void 0 ? _b : ""))); });
                                            selectedData.forEach(item => {
                                                item.selected = false;
                                                item.tag = item.tag.filter((tag) => {
                                                    return tag !== vm.tag;
                                                });
                                            });
                                            let folder = vm.link.findIndex((dd) => {
                                                return (dd.title == vm.tag && dd.type == "folder");
                                            });
                                            vm.link.splice(folder, 1);
                                            cf.getSelect(vm.link);
                                            save(() => {
                                                gvc.closeDialog();
                                            });
                                        }
                                    }
                                });
                            }), "刪除相簿"),
                            BgWidget.save(gvc.event(() => {
                                cf.getSelect(vm.link);
                                save(() => {
                                    gvc.closeDialog();
                                });
                            }), '確定變更')].join('');
                    }
                    default: {
                        let finishBTN = (cf.key == 'album') ? '建立' : '完成';
                        return [BgWidget.cancel(gvc.event(() => {
                                if (vm.type == "folderView" || vm.type == "folderADD") {
                                    vm.type = "folder";
                                    gvc.notifyDataChange(vm.id);
                                }
                                else {
                                    gvc.closeDialog();
                                }
                            })), BgWidget.save(gvc.event(() => {
                                let select = [];
                                function loop(array) {
                                    array.map((dd) => {
                                        if (dd.type === 'folder') {
                                            loop(dd.items || []);
                                        }
                                        else {
                                            if (dd.selected) {
                                                select.push(dd);
                                            }
                                        }
                                    });
                                }
                                loop(vm.link);
                                if (cf.key == 'album') {
                                    dialog.successMessage({
                                        text: '相簿建立成功'
                                    });
                                }
                                if (cf.key == 'image-manager' || cf.key == 'folderEdit') {
                                    if (select.length > 0) {
                                        save(() => {
                                            cf.getSelect(select);
                                            gvc.closeDialog();
                                        });
                                    }
                                    else {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                    }
                                }
                                else {
                                    cf.getSelect(select);
                                    gvc.closeDialog();
                                }
                            }), finishBTN)].join('');
                    }
                }
            }
        });
    }
    static selectImageLibrary(gvc, callback, title, opt) {
        var _a, _b, _c;
        function editorView(gvc, item) {
            var _a, _b;
            if (item.type === 'folder') {
                return BgWidget.editeInput({
                    gvc: gvc,
                    title: `資料夾標題`,
                    default: item.title,
                    placeHolder: `請輸入資料夾標題`,
                    callback: (text) => {
                        item.title = text;
                    }
                });
            }
            else {
                item.data = (_a = item.data) !== null && _a !== void 0 ? _a : {};
                return [BgWidget.editeInput({
                        gvc: gvc,
                        title: `圖片標題`,
                        default: item.title,
                        placeHolder: `請輸入圖片標題`,
                        callback: (text) => {
                            item.title = text;
                        }
                    }), EditorElem.uploadImageContainer({
                        gvc: gvc,
                        title: `圖片內容`,
                        def: (_b = item.data) !== null && _b !== void 0 ? _b : '',
                        callback: (text) => {
                            item.data = text;
                        },
                    })].join('');
            }
        }
        imageLibrary.fileSystem({
            getSelect: callback,
            gvc: gvc,
            key: opt ? ((_a = opt.key) !== null && _a !== void 0 ? _a : 'image-manager') : 'image-manager',
            title: title,
            tag: (_b = opt === null || opt === void 0 ? void 0 : opt.tag) !== null && _b !== void 0 ? _b : "",
            mul: opt ? ((_c = opt.mul) !== null && _c !== void 0 ? _c : false) : false,
            plus: (gvc, callback) => {
                const item = {
                    title: '',
                    data: {},
                    items: [],
                    type: 'file',
                    tag: [],
                    id: gvc.glitter.getUUID()
                };
                let count = 1;
                EditorElem.uploadFileFunction({
                    gvc: gvc,
                    callback: (text) => {
                        callback(text.map((item) => {
                            return {
                                title: item.split('_')[3],
                                data: item,
                                items: [],
                                type: 'file',
                                tag: [],
                                id: gvc.glitter.getUUID()
                            };
                        }));
                    },
                    return_array: true,
                    multiple: true
                });
            },
            edit: (item, callback) => {
                item = JSON.parse(JSON.stringify(item));
                BgWidget.settingDialog({
                    gvc: gvc,
                    title: '更新圖片',
                    innerHTML: (gvc) => {
                        return editorView(gvc, item);
                    },
                    footer_html: (gvc) => {
                        return [BgWidget.danger(gvc.event(() => {
                                const dialog = new ShareDialog(gvc.glitter);
                                dialog.checkYesOrNot({
                                    text: `刪除後使用此資源的內容將被取消關聯，是否確認刪除?`,
                                    callback: (response) => {
                                        if (response) {
                                            callback(undefined);
                                            gvc.closeDialog();
                                        }
                                    }
                                });
                            })), BgWidget.cancel(gvc.event(() => {
                                gvc.closeDialog();
                            })), BgWidget.save(gvc.event(() => {
                                callback(item);
                                gvc.closeDialog();
                            }), '確定')].join('');
                    },
                    closeCallback: () => {
                    }
                });
            }
        });
    }
}

import { PageSplit } from "./splitPage.js";
export class BgWidget {
    static table(obj) {
        const gvc = obj.gvc;
        const glitter = obj.gvc.glitter;
        const html = String.raw;
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const ps = new PageSplit(gvc);
            const vm = {
                loading: true,
                callback: () => {
                    vm.stateText = vm.data.length > 0 ? '資料載入中 ....' : '查無資料';
                    vm.loading = false;
                    gvc.notifyDataChange(id);
                },
                page: 1,
                data: [],
                pageSize: 0,
                editData: [],
                stateText: '資料載入中 ....',
            };
            const getData = () => {
                obj.getData(vm);
            };
            return {
                bind: id,
                view: () => {
                    var _a;
                    if (vm.loading) {
                        return html `<div class="py-3 fs-2 text-center">${vm.stateText}</div>`;
                    }
                    else {
                        return html `
                           ${(_a = obj.filter) !== null && _a !== void 0 ? _a : ""}
                            <div class="card-body p-0 " style="overflow-x:scroll;">
                                        <div class="tableHTML">
                                            <table
                                                class="table table-centered table-nowrap mb-0 text-center table-hover fw-500 fs-7"
                                                style="overflow-x:scroll;"
                                            >
                                                <thead class="table-light" style="">
                                                    ${vm.data.length === 0
                            ? ''
                            : html `<tr>
                                                              ${vm.data[0]
                                .map((dd) => {
                                var _a;
                                return html `<th
                                                                              class="${(_a = dd.position) !== null && _a !== void 0 ? _a : 'text-start'}"
                                                                              style="background:#eaeaea !important;"
                                                                          >
                                                                              ${dd.key}
                                                                          </th>`;
                            })
                                .join('')}
                                                          </tr>`}
                                                </thead>

                                                <tbody>
                                                    ${vm.data.length === 0
                            ? html `<div class="py-3 fs-2 text-center">${vm.stateText}</div>`
                            : html `${vm.data
                                .map((dd, index) => {
                                return html `<tr style="${(obj.rowClick) ? `cursor:pointer;` : ``};color:#303030;" onclick="${gvc.event(() => {
                                    obj.rowClick && obj.rowClick(dd, index);
                                })}">
                                                                      ${dd
                                    .map((d3) => {
                                    var _a;
                                    return html `<td
                                                                                      class="${(_a = d3.position) !== null && _a !== void 0 ? _a : 'text-start'}  "
                                                                                      ${d3.key === '●' || d3.stopDialog
                                        ? ''
                                        : html ` onclick="${gvc.event(() => {
                                        })}"`}
                                                                     style="color:#303030 !important;"             >
                                                                                     <div class="my-auto"> ${d3.value}</div>
                                                                                  </td>`;
                                })
                                    .join('')}
                                                                  </tr>`;
                            })
                                .join('')}`}
                                                </tbody>
                                            </table>
                                            <div>
                                                ${vm.data.length === 0
                            ? ''
                            : ps.pageSplit(vm.pageSize, vm.page, (page) => {
                                (vm.data = []),
                                    (vm.editData = []),
                                    (vm.page = page);
                                (vm.loading = true), gvc.notifyDataChange(id);
                            }, false)}
                                            </div>
                                        </div>
                                    </div>`;
                    }
                },
                divCreate: { class: `card`, style: `border-radius:16px;width:100%;overflow:hidden;` },
                onCreate: () => {
                    if (vm.loading) {
                        getData(), (vm.loading = false), gvc.notifyDataChange(id);
                    }
                },
            };
        });
    }
}

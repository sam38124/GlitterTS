'use strict';
import { GVC } from '../glitterBundle/GVController.js';

export class PageSplit {
    public pageSplit: (countPage: number, nowPage: number, callback: (p: number) => void, gotoInput?: boolean) => any;
    constructor(gvc: GVC) {
        const glitter = gvc.glitter;
        const $ = (window as any).$;
        const html = String.raw;
        this.pageSplit = (countPage: number, nowPage: number, callback: (p: number) => void, gotoInput?: boolean) => {
            const generator = (n: number) => {
                return html`<li class="page-item">
                    <a class="page-link" style="cursor:pointer" onclick="${gvc.event(() => callback(n))}">${n}</a>
                </li>`;
            };

            let vm = {
                id: glitter.getUUID(),
                loading: false,
                dataList: <any>[],
            };

            return gvc.bindView({
                bind: vm.id,
                view: () => {
                    if (vm.loading) {
                        return `<div class="w-100 d-flex align-items-center justify-content-center p-3">
<div class="spinner-border"></div>
</div`;
                    } else {
                        return html`
                            <nav class="d-flex my-3 justify-content-center">
                                <ul class="pagination pagination-rounded mb-0">
                                    <li class="page-item">
                                        <a
                                            class="page-link"
                                            aria-label="Previous"
                                            style="cursor:pointer"
                                            onclick="${gvc.event(() => {
                                                nowPage - 1 > 0 && callback(nowPage - 1);
                                            })}"
                                        >
                                            <span aria-hidden="true">&laquo;</span>
                                        </a>
                                    </li>
                                    ${glitter.print(() => {
                                        if (nowPage - 2 > 0) {
                                            return generator(nowPage - 2) + generator(nowPage - 1);
                                        } else if (nowPage - 1 > 0) {
                                            return generator(nowPage - 1);
                                        } else {
                                            return ``;
                                        }
                                    })}
                                    <li class="page-item active" style="border-radius: 100%"><a class="page-link">${nowPage}</a></li>
                                    ${glitter.print(() => {
                                        if (nowPage + 2 <= countPage) {
                                            return generator(nowPage + 1) + generator(nowPage + 2);
                                        } else if (nowPage + 1 <= countPage) {
                                            return generator(nowPage + 1);
                                        } else {
                                            return ``;
                                        }
                                    })}
                                    <li class="page-item">
                                        <a
                                            class="page-link"
                                            aria-label="Next"
                                            style="cursor:pointer"
                                            onclick="${gvc.event(() => {
                                                nowPage + 1 <= countPage && callback(nowPage + 1);
                                            })}"
                                        >
                                            <span aria-hidden="true">&raquo;</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                            ${glitter.print(() => {
                                if (gotoInput) {
                                    return html`
                                        <div class="d-flex justify-content-center">
                                            <div class="input-group mb-2 mx-4" style="width: 30%">
                                                <div class="input-group-text">前往</div>
                                                <input type="number" class="form-control" id="gotoPage" />
                                                <div class="input-group-text">頁</div>
                                                <button
                                                    type="button"
                                                    class="btn btn-primary ms-3"
                                                    onclick="${gvc.event(() => {
                                                        if (!($(`#gotoPage`).val() === undefined || $(`#gotoPage`).val() == '')) {
                                                            let goto = parseInt($(`#gotoPage`).val(), 10);
                                                            goto < 1 && (goto = 1);
                                                            goto > countPage && (goto = countPage);
                                                            callback(goto);
                                                        }
                                                    })}"
                                                >
                                                    GO
                                                </button>
                                            </div>
                                        </div>
                                    `;
                                } else {
                                    return ``;
                                }
                            })}
                        `;
                    }
                },
                divCreate: {},
                onCreate: () => {
                    if (vm.loading) {
                        (vm.loading = false);
                        gvc.notifyDataChange(vm.id);
                    } else {
                        $(`#gotoPage`).on('keydown', function (e: any) {
                            ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
                            $(`#gotoPage`).val() < 0 && $(`#gotoPage`).val(1);
                        });
                    }
                },
            });
        };
    }
}

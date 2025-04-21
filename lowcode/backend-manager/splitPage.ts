import { GVC } from '../glitterBundle/GVController.js';

const html = String.raw;

export class PageSplit {
  public pageSplit: (countPage: number, nowPage: number, callback: (p: number) => void, gotoInput?: boolean) => any;

  public pageSplitV2: (countPage: number, nowPage: number, callback: (p: number) => void, gotoInput?: boolean) => any;

  constructor(gvc: GVC) {
    const glitter = gvc.glitter;
    const $ = (window as any).$;
    this.pageSplit = (countPage: number, nowPage: number, callback: (p: number) => void, gotoInput?: boolean) => {
      const generator = (n: number) => {
        const color = glitter.share.globalValue['theme_color.0.solid-button-bg']
          ? `color: ${glitter.share.globalValue['theme_color.0.title']};`
          : `color: black;`;
        return html` <div
          class="d-flex align-items-center justify-content-center fw-500"
          style="width: 36px; height: 36px; border-radius: 100%; cursor: pointer; ${color}"
          onclick="${gvc.event(() => callback(n))}"
        >
          ${n}
        </div>`;
      };

      const vm = {
        id: glitter.getUUID(),
        loading: false,
        dataList: <any>[],
      };

      return gvc.bindView({
        bind: vm.id,
        view: () => {
          if (vm.loading) {
            return html`<div class="w-100 d-flex align-items-center justify-content-center p-3">
              <div class="spinner-border"></div>
            </div>`;
          } else {
            return html`
              <nav class="d-flex my-3 justify-content-center">
                <ul class="pagination pagination-rounded mb-0">
                  <div
                    class="page-item d-flex align-items-center justify-content-center ${nowPage - 1 > 0
                      ? ''
                      : 'd-none'}"
                    style="height: 36px;width: 36px;cursor: pointer;"
                  >
                    <a
                      onclick="${gvc.event(() => {
                        nowPage - 1 > 0 && callback(nowPage - 1);
                      })}"
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </div>
                  ${glitter.print(() => {
                    if (nowPage - 2 > 0) {
                      return generator(nowPage - 2) + generator(nowPage - 1);
                    } else if (nowPage - 1 > 0) {
                      return generator(nowPage - 1);
                    } else {
                      return '';
                    }
                  })}
                  <div
                    class="d-flex align-items-center justify-content-center fw-500"
                    style="width: 36px; height: 36px; border-radius: 100%; cursor: pointer; ${(() => {
                      if (glitter.share.globalValue['theme_color.0.solid-button-bg']) {
                        return `
                          background: ${glitter.share.globalValue['theme_color.0.solid-button-bg']};
                          color: ${glitter.share.globalValue['theme_color.0.solid-button-text']};
                        `;
                      } else {
                        return '';
                      }
                    })()};"
                  >
                    ${nowPage}
                  </div>
                  ${glitter.print(() => {
                    if (nowPage + 2 <= countPage) {
                      return generator(nowPage + 1) + generator(nowPage + 2);
                    } else if (nowPage + 1 <= countPage) {
                      return generator(nowPage + 1);
                    } else {
                      return '';
                    }
                  })}
                  <div
                    class="page-item d-flex align-items-center justify-content-center ${nowPage + 1 <= countPage
                      ? ''
                      : 'd-none'}"
                    style="height: 36px; width: 36px; cursor: pointer;"
                  >
                    <a
                      onclick="${gvc.event(() => {
                        nowPage + 1 <= countPage && callback(nowPage + 1);
                      })}"
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </div>
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
                  return '';
                }
              })}
            `;
          }
        },
        onCreate: () => {
          if (vm.loading) {
            vm.loading = false;
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
    this.pageSplitV2 = (countPage: number, nowPage: number, callback: (p: number) => void, gotoInput?: boolean) => {
      const generator = (n: number) => {
        return html`<li class="page-item my-0 mx-0">
          <div class="page-link-v2" onclick="${gvc.event(() => callback(n))}">${n}</div>
        </li>`;
      };

      const vm = {
        id: glitter.getUUID(),
        loading: false,
        dataList: <any>[],
      };

      return gvc.bindView({
        bind: vm.id,
        view: () => {
          if (vm.loading) {
            return html`<div class="w-100 d-flex align-items-center justify-content-center p-3">
              <div class="spinner-border"></div>
            </div>`;
          } else {
            return html`
              <nav class="d-flex my-3 justify-content-center">
                <ul class="pagination pagination-rounded mb-0">
                  <li class="page-item me-0">
                    <div
                      class="page-link-v2 page-link-prev"
                      aria-label="Previous"
                      style="cursor:pointer"
                      onclick="${gvc.event(() => {
                        nowPage - 1 > 0 && callback(nowPage - 1);
                      })}"
                    >
                      <i class="fa-solid fa-angle-left angle-style"></i>
                    </div>
                  </li>
                  ${glitter.print(() => {
                    let result = '';
                    // 產生前面四頁的按鈕
                    for (let i = Math.max(1, nowPage - 4); i < nowPage; i++) {
                      result += generator(i);
                    }
                    return result;
                  })}
                  <li class="page-item active mx-0" style="border-radius: 100%">
                    <div class="page-link-v2 page-link-active">${nowPage}</div>
                  </li>
                  ${glitter.print(() => {
                    let result = '';
                    // 產生後面四頁的按鈕
                    for (let i = nowPage + 1; i <= Math.min(nowPage + 4, countPage); i++) {
                      result += generator(i);
                    }
                    return result;
                  })}
                  <li class="page-item ms-0">
                    <div
                      class="page-link-v2 page-link-next"
                      aria-label="Next"
                      style="cursor:pointer"
                      onclick="${gvc.event(() => {
                        nowPage + 1 <= countPage && callback(nowPage + 1);
                      })}"
                    >
                      <i class="fa-solid fa-angle-right angle-style"></i>
                    </div>
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
                  return '';
                }
              })}
            `;
          }
        },
        onCreate: () => {
          if (vm.loading) {
            vm.loading = false;
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

var ViewType;
(function (ViewType) {
    ViewType["mobile"] = "mobile";
    ViewType["desktop"] = "desktop";
})(ViewType || (ViewType = {}));
export class Editor {
    constructor(gvc, data) {
        var _a;
        const glitter = gvc.glitter;
        const $ = gvc.glitter.$;
        gvc.addStyle(`
            .tab-pane {
                word-break: break-word;
                white-space: normal;
            }
        `);
        gvc.addStyle(`
            .accordion-body {
                word-break: break-word;
                white-space: normal;
            }
            h1,
            h2,
            h3,
            h4 {
                white-space: normal;
                word-break: break-word;
            }
        `);
        gvc.addStyle(`div{word-break: break-word;white-space: nowrap;}`);
        const viewModel = {
            "type": (_a = glitter.getCookieByName("ViewType")) !== null && _a !== void 0 ? _a : ViewType.desktop
        };
        this.create = (left, right) => {
            return `
                <div class="position-relative vh-100 vw-100 " style="word-break: break-word;white-space: nowrap;">
                    <!-- Navbar -->
                    <header
                        class="header navbar navbar-expand navbar-light bg-light border-bottom border-light shadow fixed-top"
                        data-scroll-header
                     style="height: 56px;">
                        <div class="container-fluid pe-lg-4">
                            <div class="d-flex align-items-center">
                                <a href="index.html" class="navbar-brand flex-shrink-0 py-1 py-lg-2">
                                    <div
                                        class="bg-white  rounded-circle d-flex align-items-center justify-content-center me-2"
                                        style="box-sizing: border-box;width: 50px;height: 50px;"
                                    >
                                        <img src="assets/img/glitter (1).png" width="30" alt="Silicon" />
                                    </div>
                                    GUI Editor
                                </a>
                                <span class="badge bg-warning">Cross-platform</span>
                            </div>
                            <div class="d-flex align-items-center w-100">
                                <div class="flex-fill"></div>
                                ${gvc.bindView({
                dataList: [{ obj: viewModel, key: "type" }],
                bind: `showViewIcon`,
                view: () => {
                    glitter.setCookie("ViewType", viewModel.type);
                    if (viewModel.type === ViewType.mobile) {
                        return `<i class="fa-regular fa-mobile text-white mt-1" style="font-size: 24px;cursor: pointer;" onclick="${gvc.event(() => {
                            viewModel.type = ViewType.desktop;
                        })}"></i>`;
                    }
                    else {
                        return `<i class="fa-solid fa-desktop text-white mt-1" style="font-size: 24px;cursor: pointer;" onclick="${gvc.event(() => {
                            viewModel.type = ViewType.mobile;
                        })}"></i>`;
                    }
                },
                divCreate: {}
            })}
                                <div class="ms-4 me-2" style="width: 1px;height: 56px;background-color: white;"></div>
                                <button class="btn-primary btn ms-2" style="height: 36px;width: 60px;" onclick="${gvc.event(() => {
                glitter.htmlGenerate.saveEvent();
            })}">儲存</button>
                            </div>
                        </div>
                       
                    </header>
                    <!-- Main sidebar navigation -->
                    <aside
                        id="componentsNav"
                        class="offcanvas offcanvas-start offcanvas-expand-lg position-fixed top-0 start-0 vh-100 bg-light border-end-lg"
                        style="width: 21rem;"
                    >
                        <div class="offcanvas-header d-none d-lg-flex justify-content-start border-bottom" style="height: 56px;">
                            <div  class="navbar-brand text-dark d-none d-lg-flex py-0">
                            <i class="fa-solid fa-arrow-right-from-bracket" onclick="location.href='index.html'" style="cursor: pointer;"></i>
                            <div class="bg-white" style="width: 1px;height: 40px;margin-left: 15px;"></div>
                                <div
                                    class="bg-white  rounded-circle d-flex align-items-center justify-content-center me-2"
                                    style="box-sizing: border-box;width: 40px;height: 40px;margin-left: 15px;"
                                >
                                    <img src="assets/img/glitter (1).png" width="30" alt="Silicon" style="height: 25px!important;"/>
                                </div>
                                GUI designer
                            </div>
                        </div>
                        <div class="offcanvas-header d-block d-lg-none border-bottom">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="d-lg-none mb-0">Menu</h5>
                                <button type="button" class="btn-close d-lg-none" data-bs-dismiss="offcanvas"></button>
                            </div>

                            <div class="d-flex mt-4">
                                <div class="form-check form-switch mode-switch pe-lg-1 ms-lg-auto d-sm-none" data-bs-toggle="mode">
                                    <input type="checkbox" class="form-check-input" id="theme-mode" />
                                    <label class="form-check-label  d-sm-block d-lg-none d-xl-block" for="theme-mode">Light</label>
                                    <label class="form-check-label  d-sm-block d-lg-none d-xl-block" for="theme-mode">Dark</label>
                                </div>
                            </div>
                            <div class=" d-sm-none mt-3">
                                <a
                                    class="github-button  me-3"
                                    href="https://github.com/sam38124"
                                    data-color-scheme="no-preference: light; light: dark; dark: dark;"
                                    data-size="large"
                                    data-show-count="true"
                                    aria-label="Follow @sam38124 on GitHub"
                                    >Follow @sam38124</a
                                >
                            </div>
                        </div>
                       ${left}
                    </aside>
                    <!-- Page container -->
                    <main class="docs-container pt-5" >${gvc.bindView({
                dataList: [{ obj: viewModel, key: "type" }],
                bind: `showView`,
                view: () => {
                    if (viewModel.type === ViewType.mobile) {
                        return `<div class="d-flex align-items-center justify-content-center flex-column mx-auto" style="width: 375px;height: calc(100vh - 50px);padding-top: 20px;">
                 <div class="bg-white" style="width:calc(100% - 40px);height: calc(100% - 50px);">
                 <iframe class="w-100 h-100 rounded" src="index.html?page=htmlEditor"></iframe>
                </div>`;
                    }
                    else {
                        return `<div class="d-flex align-items-center justify-content-center flex-column" style="width: 100%;height: calc(100vh - 50px);padding-top: 20px;">
                 <div class="bg-white" style="width:calc(100% - 40px);height: calc(100% - 50px);">
                 <iframe class="w-100 h-100 rounded" src="index.html?page=htmlEditor"></iframe>
                </div>`;
                    }
                },
                divCreate: {}
            })}</main>
                    <aside
                id="jumpToNav"
                class="side-nav side-nav-end d-none d-xxl-block position-fixed top-0 end-0 vh-100 py-5 px-2"
                style="width: 20rem;background-color: #1a183a;overflow-y: scroll;"
            >
            <div class="w-100" style="padding-top: 20px;">
             ${right}
</div>
               
            </aside>
                  
                    <!-- Back to top button -->
                    <a href="#top" class="btn-scroll-top" data-scroll>
                        <span class="btn-scroll-top-tooltip text-muted fs-sm me-2">Top</span>
                        <i class="btn-scroll-top-icon bx bx-chevron-up"></i>
                    </a>
                </div>
            `;
        };
    }
}

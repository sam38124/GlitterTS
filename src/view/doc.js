export class Doc {
    constructor(gvc) {
        const glitter = gvc.glitter;
        gvc.addStyle(`
    .tab-pane{
    word-break: break-word;white-space: normal;
    }
    `);
        gvc.addStyle(`
    .accordion-body{
    word-break: break-word;white-space: normal;
    }
    h1,h2,h3,h4{
      white-space: normal;word-break: break-word;
    }
  
    `);
        gvc.addStyle(`div{word-break: break-word;white-space: nowrap;}`);
        this.create = (html, aside, it) => {
            var items = it.items;
            return ` 
    <div class="position-relative vh-100 vw-100"  style="word-break: break-word;white-space: nowrap;">
    <!-- Navbar -->
    <header class="header navbar navbar-expand navbar-light bg-light border-bottom border-light shadow fixed-top" data-scroll-header>
      <div class="container-fluid pe-lg-4">
        <div class="d-flex align-items-center">
            <a href="index.html" class="navbar-brand flex-shrink-0 py-1 py-lg-2">
          <div class="bg-white  rounded-circle d-flex align-items-center justify-content-center me-2" style="box-sizing: border-box;width: 50px;height: 50px;"><img src="assets/img/glitter (1).png"  width="30" alt="Silicon"></div>          
          GliiterTS
        </a>
          <span class="badge bg-warning">Cross-platform</span>
        </div>
         <div class="d-flex align-items-center w-100">
          <ul class="navbar-nav d-none d-lg-flex" style="padding-left: 5.75rem;">
            <div class="d-flex me-3 align-items-center">
                   <h2 class="h4 mb-0 me-3">Contributors</h2>
                  <div class="d-flex align-items-center justify-content-center bg-white rounded-circle" style="width: 52px; height: 52px;">
                    <img src="https://avatars.githubusercontent.com/u/45378692?v=4" class="rounded-circle" width="48" alt="Avatar">
                  </div>
                  <div class="d-flex align-items-center justify-content-center bg-white rounded-circle ms-n3" style="width: 52px; height: 52px;">
                    <img src="https://squarestudio.tw/LionDesign/page/plugin/lionDesign/img/index/lin.jpg" class="rounded-circle" width="48" alt="Avatar">
                  </div>
                   <div class="d-flex align-items-center justify-content-center bg-white rounded-circle ms-n3" style="width: 52px; height: 52px;">
                    <img src=" https://avatars.githubusercontent.com/u/116696497?v=4" class="rounded-circle" width="48" alt="Avatar">
                  </div>
                </div>
          </ul>
          <div class="flex-fill"></div>
          <div class="form-check form-switch mode-switch pe-lg-1 ms-lg-auto d-none d-sm-flex" data-bs-toggle="mode">
            <input type="checkbox" class="form-check-input" id="theme-mode">
            <label class="form-check-label d-none d-sm-block d-lg-none d-xl-block" for="theme-mode">Light</label>
            <label class="form-check-label d-none d-sm-block d-lg-none d-xl-block" for="theme-mode">Dark</label>
          </div>
         <div class="me-3 mt-1 ms-4 d-none d-sm-block"> <a class="github-button  me-3" href="https://github.com/sam38124" data-color-scheme="no-preference: light; light: dark; dark: dark;" data-size="large" data-show-count="true" aria-label="Follow @sam38124 on GitHub">Follow @sam38124</a></div>
       <button type="button" class="navbar-toggler d-block d-lg-none ms-auto me-4" data-bs-toggle="offcanvas" data-bs-target="#componentsNav" aria-controls="componentsNav" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </header>
    <!-- Main sidebar navigation -->
    <aside id="componentsNav" class="offcanvas offcanvas-start offcanvas-expand-lg position-fixed top-0 start-0 vh-100 bg-light border-end-lg" style="width: 21rem;">
      <div class="offcanvas-header d-none d-lg-flex justify-content-start">
        <a href="index.html" class="navbar-brand text-dark d-none d-lg-flex py-0">
          <div class="bg-white  rounded-circle d-flex align-items-center justify-content-center me-2" style="box-sizing: border-box;width: 50px;height: 50px;"><img src="assets/img/glitter (1).png"  width="30" alt="Silicon"></div>          
          GliiterTS
        </a>
        <span class="badge bg-warning d-none d-lg-inline-block">Cross-platform</span>
      </div>
      <div class="offcanvas-header d-block d-lg-none border-bottom">
        <div class="d-flex align-items-center justify-content-between">
          <h5 class="d-lg-none mb-0">Menu</h5>
          <button type="button" class="btn-close d-lg-none" data-bs-dismiss="offcanvas"></button>
        </div>
        
        <div class="d-flex mt-4">
         <div class="form-check form-switch mode-switch pe-lg-1 ms-lg-auto d-sm-none" data-bs-toggle="mode">
            <input type="checkbox" class="form-check-input" id="theme-mode">
            <label class="form-check-label  d-sm-block d-lg-none d-xl-block" for="theme-mode">Light</label>
            <label class="form-check-label  d-sm-block d-lg-none d-xl-block" for="theme-mode">Dark</label>
          </div>
</div>
<div class=" d-sm-none mt-3"> <a class="github-button  me-3" href="https://github.com/sam38124" data-color-scheme="no-preference: light; light: dark; dark: dark;" data-size="large" data-show-count="true" aria-label="Follow @sam38124 on GitHub">Follow @sam38124</a></div>
          
        
      </div>
      <div class="offcanvas-body swiper scrollbar-hover overflow-hidden w-100 p-4" data-swiper-options='{
        "direction": "vertical",
        "slidesPerView": "auto",
        "freeMode": true,
        "scrollbar": {
          "el": ".swiper-scrollbar"
        },
        "mousewheel": true
      }'>
        <div class="swiper-wrapper">
          ${gvc.bindView(() => {
                const id = glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        var html = '';
                        function clearActive() {
                            items.map((dd) => {
                                dd.option.map((d3) => {
                                    d3.select = false;
                                });
                            });
                        }
                        items.map((dd) => {
                            html += `<h3 class="fs-lg">${dd.title}</h3>`;
                            html += ` <div class="list-group list-group-flush border-bottom pb-3 mb-4 mx-n4">
                                ${(() => {
                                let innerHtml = '';
                                dd.option.map((d2) => {
                                    innerHtml += `<a  class="list-group-item list-group-item-action border-0 py-2 px-4 ${d2.select ? `active` : ``}" onclick="${gvc.event(() => {
                                        d2.click();
                                    })}">${d2.text}</a>`;
                                });
                                return innerHtml;
                            })()}
                                </div>`;
                        });
                        return html;
                    },
                    divCreate: {
                        class: `swiper-slide h-auto`,
                    }
                };
            })}
        </div>
        <div class="swiper-scrollbar end-0"></div>

      </div>
    </aside>
    <!-- Page container -->
    <main class="docs-container pt-5">
    ${html}
    </main>  
    ${aside}
    <!-- Back to top button -->
    <a href="#top" class="btn-scroll-top" data-scroll>
      <span class="btn-scroll-top-tooltip text-muted fs-sm me-2">Top</span>
      <i class="btn-scroll-top-icon bx bx-chevron-up"></i>
    </a>


  </div>
       <!-- Vendor Scripts -->
<!--    <script src="assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js"></script>-->
<!--    <script src="assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js"></script>-->
<!--    <script src="assets/vendor/swiper/swiper-bundle.min.js"></script>-->
<!--    <script src="assets/vendor/prismjs/components/prism-core.min.js"></script>-->
<!--    <script src="assets/vendor/prismjs/components/prism-markup.min.js"></script>-->
<!--    <script src="assets/vendor/prismjs/components/prism-clike.min.js"></script>-->
<!--    <script src="assets/vendor/prismjs/plugins/toolbar/prism-toolbar.min.js"></script>-->
<!--    <script src="assets/vendor/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>-->
<!--    <script src="assets/vendor/prismjs/plugins/line-numbers/prism-line-numbers.min.js"></script>-->
<!--<script src="https://buttons.github.io/buttons.js"></script>-->
    <!-- Main Theme Script -->
<!--    <script src="assets/js/theme.min.js"></script>-->

`;
        };
        this.addScript = () => {
            gvc.addMtScript([
                './assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js',
                './assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js',
                './assets/vendor/swiper/swiper-bundle.min.js',
                './assets/vendor/prismjs/components/prism-core.min.js',
                './assets/vendor/prismjs/components/prism-markup.min.js',
                './assets/vendor/prismjs/components/prism-clike.min.js',
                './assets/vendor/prismjs/plugins/toolbar/prism-toolbar.min.js',
                './assets/vendor/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js',
                './assets/vendor/prismjs/plugins/line-numbers/prism-line-numbers.min.js',
                './assets/js/theme.min.js',
                './glitterLib/highlight.js',
                'https://buttons.github.io/buttons.js'
            ].map((url) => {
                return { src: url };
            }), () => {
                try {
                    setTimeout(() => {
                        document.querySelectorAll('pre code').forEach((el) => {
                            window.hljs.highlightElement(el);
                        });
                    }, 100);
                }
                catch (_a) {
                }
            }, () => {
            });
        };
        this.asideScroller = (item) => {
            let html = '';
            item.map((d3) => {
                html += `  <li class="nav-item">
          <a href="#${d3.id}" class="nav-link" data-scroll data-scroll-offset="-6">${d3.title}</a>
        </li>`;
            });
            return `<aside id="jumpToNav" class="side-nav side-nav-end d-none d-xxl-block position-fixed top-0 end-0 vh-100 py-5" style="width: 20rem;">
      <h3 class="fs-lg mt-5 pt-5">Jump to</h3>
      <ul class="nav">
           ${html}
      </ul>
    </aside>`;
        };
        this.codePlace = (text, type) => {
            return `
${gvc.bindView(() => {
                let id = glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return `
            <pre class="line-numbers language-html" tabindex="0">
<code id="${id}code" class="${type}">${this.escape(text)}
</code></pre>
<div class="toolbar"><div class="toolbar-item"><button class="copy-to-clipboard-button" type="button" data-copy-state="copy"><span>Copy</span></button></div></div>
            `;
                    },
                    divCreate: { class: `code-toolbar pt-2` },
                    onCreate: () => {
                    }
                };
            })}`;
        };
        this.previewCode = (data) => {
            const id = glitter.getUUID();
            return `<div class="d-table">
            <ul class="nav nav-tabs-alt" role="tablist">
              ${(() => {
                var html = '';
                data.previewString.map((dd, index) => {
                    html += `<li class="nav-item">
                <a class="nav-link ${(index == 0) ? "active" : ""}" href="#preview_${index}_${id}" data-bs-toggle="tab" role="tab" aria-controls="code_${index}_${id}" aria-selected="${index == 0}">
                  ${dd}
                </a>
              </li>`;
                });
                return html;
            })()}
            </ul>
          </div>
          <div class="tab-content pt-1">
             ${(() => {
                var html = '';
                data.tab.map((dd, index) => {
                    html += `<div class="tab-pane fade ${(index == 0) ? "active" : ""} ${(index == 0) ? "show" : ""}" id="preview_${index}_${id}" role="tabpanel">
              ${dd}
            </div>`;
                });
                return html;
            })()}
          </div>`;
        };
        this.escape = (text) => {
            return text.replace(/&/g, "&")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "'");
        };
    }
}

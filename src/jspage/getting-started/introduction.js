import { init } from '../../glitterBundle/GVController.js';
import { Doc } from '../../view/doc.js';
import { Items } from '../page-config.js';
import { Galary } from '../../view/galary.js';
init((gvc, glitter, gBundle) => {
    const gallary = new Galary(gvc);
    const doc = new Doc(gvc);
    return {
        onCreateView: () => {
            const sessions = [
                {
                    id: `About`,
                    title: 'About',
                    get html() {
                        return `<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
          <h2 class="h4">${this.title}</h2>
          <h3 class="fs-lg fw-normal fw-500" style="white-space: normal;word-break: break-all;">
          Glitter is a cross-platform development framework what use JSCore to bridge native code.
          </h3>
          <div class="alert alert-primary p-4">
           ${(() => {
                            var html = '';
                            var item = [
                                'Build encapsulated components that manage their own lifecycle, then compose them to make complex UIs',
                                'Using the SPA development mode it solves the high latency problem of embedded browsers with WebView.',
                                'Support MVC / MVVM / Databinding.',
                                '100% compatible - All JS/TS and native libraries like (SwiftPackage/JetPack/CocoPods) can be used through the Glitter javascript interface.',
                                'Glitter plugins can also be called on native code such as java / kotlin / swift / Objetive-C.',
                                'You can write additional plugins for your application for all development needs',
                                'Very easy to do SEO management',
                                'Very lightweight and easy to use'
                            ];
                            item.map((d3) => {
                                html += `<h3 class="fs-lg fw-normal fw-500" style="line-height: 30px;">
<i class='bx bxs-star text-warning' style="font-size: 20px;">

</i>
          ${d3}
          </h3>`;
                            });
                            return html;
                        })()}
</div>
</section>`;
                    },
                },
                {
                    id: `Flow`,
                    title: 'Flow Chart',
                    get html() {
                        return `<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
          <h2 class="h4">${this.title}</h2>
          <div class="m-2">
          ${gallary.imagePreview(glitter.ut.frSize({
                            sm: `img/glitter_process.png`,
                        }, 'img/glitter_process_v.png'))}</div>
        </section>`;
                    },
                },
                {
                    id: `Who`,
                    title: 'Who is Using',
                    get html() {
                        return `<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
         <h2 class="h4">${this.title}</h2>
        <div class="swiper mx-n2 swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden" data-swiper-options="{
          &quot;slidesPerView&quot;: 2,
          &quot;pagination&quot;: {
            &quot;el&quot;: &quot;.swiper-pagination&quot;,
            &quot;clickable&quot;: true
          },
          &quot;breakpoints&quot;: {
            &quot;500&quot;: {
              &quot;slidesPerView&quot;: 3,
              &quot;spaceBetween&quot;: 8
            },
            &quot;650&quot;: {
              &quot;slidesPerView&quot;: 4,
              &quot;spaceBetween&quot;: 8
            },
            &quot;900&quot;: {
              &quot;slidesPerView&quot;: 5,
              &quot;spaceBetween&quot;: 8
            },
            &quot;1100&quot;: {
              &quot;slidesPerView&quot;: 5,
              &quot;spaceBetween&quot;: 8
            }
          }
        }">
            <div class="swiper-wrapper" id="swiper-wrapper-5fa6577aa9a310abb" aria-live="polite" style="transform: translate3d(0px, 0px, 0px); transition-duration: 0ms;">
                    ${(() => {
                            let html = '';
                            let item = ['萊恩設計', '橙的電子', '高雄醫學大學', '御天科技', '緒玹科技', '奇樂旅遊', '星澄基地', 'HOMEEAI'];
                            item.map((dd, index) => {
                                html += `<div
                                class="swiper-slide py-3 swiper-slide-active"
                                role="group"
                                aria-label="${index + 1} / ${item.length}"
                                style="width: 212px; margin-right: 8px;cursor: grab"
                            >
                                <div class="card card-body card-hover px-2 mx-2" style="min-width: 154px;min-height: 100px;">
                                    <span class="d-block mx-auto my-2 fw-bold fs-3" style="">${dd}</span>
                                </div>
                            </div>`;
                            });
                            return html;
                        })()}     
            </div>

            <!-- Pagination (bullets) -->
            <div class="swiper-pagination position-relative pt-2 mt-4 swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal swiper-pagination-lock"><span class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" role="button" aria-label="Go to slide 1" aria-current="true"></span></div>
            <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
          <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
</section>`;
                    },
                },
                {
                    id: `Contributors`,
                    title: 'Contributors',
                    get html() {
                        return `<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
         <h2 class="h4">${this.title}</h2>
         <div class="row">  ${gvc.map([{
                                name: "Jianzhi Wang",
                                career: "Team leader",
                                src: 'img/developer/S__2162716.jpg',
                                social: ` <div class="d-flex justify-content-center">
    <div class="btn btn-icon btn-outline-secondary btn-facebook btn-sm me-2" onclick="${gvc.event(() => {
                                    glitter.openNewTab(`https://www.facebook.com/sam38124/`);
                                })}">
      <i class="bx bxl-facebook"></i>
    </div>
  <div  class="btn btn-icon btn-outline-secondary btn-github btn-sm me-2" onclick="${gvc.event(() => {
                                    glitter.openNewTab(`https://github.com/sam38124`);
                                })}">
  <i class="bx bxl-github"></i>
</div>

  </div>`
                            }, {
                                name: "Daniel",
                                career: "Developer",
                                src: 'https://squarestudio.tw/LionDesign/page/plugin/lionDesign/img/index/lin.jpg',
                                social: ``
                            }, {
                                name: "Zack",
                                career: "Developer",
                                src: 'img/developer/messageImage_1673540198329.jpg',
                                social: ``
                            }].map((dd) => {
                            return `<div class="card card-body card-hover bg-light border-0 text-center col-12 col-sm-4">
 
  <div class="d-block rounded-circle mx-auto mb-3" style="background: 50% / cover url('${dd.src}');height: 200px;width: 200px;"></div>
  <h5 class="fw-medium fs-lg mb-1 text-primary">${dd.name}</h5>
  <p class="fs-sm mb-3 fw-bold text-light">${dd.career}</p>
 ${dd.social}
</div>`;
                        }))}</div>
     
</section>`;
                    },
                },
                {
                    id: `App`,
                    title: 'Developed by this Framework',
                    get html() {
                        return `<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <div class="row mt-4">
                                ${(() => {
                            let html = '';
                            let item = [
                                { title: `萊恩設計`, src: `img/appicons/lion.svg` },
                                {
                                    title: `Petstagram`,
                                    src: `https://sam38124.github.io/Glitter_DOC.github.io/img/logo_%E8%89%B2%E7%A8%BF.png`,
                                },
                                { title: `HOMEE`, src: `img/appicons/homee.png` },
                                {
                                    title: `高醫校友會`,
                                    src: `https://sam38124.github.io/Glitter_DOC.github.io/images/scholl.png`
                                },
                                {
                                    title: `無線胎檢系統`,
                                    src: `https://sam38124.github.io/Glitter_DOC.github.io/images/ixontruxk.png`,
                                },
                                {
                                    title: `O-Genius`,
                                    src: `https://github.com/sam38124/JzFrameWork/blob/master/App%20icon/icon_default_logo.png?raw=true`,
                                },
                                {
                                    title: `OBD Dongles`,
                                    src: `https://github.com/sam38124/JzFrameWork/blob/0802/App%20icon/Obdicon.png?raw=true`,
                                },
                                {
                                    title: `USB TPMS`,
                                    src: `https://github.com/sam38124/JzFrameWork/blob/0802/App%20icon/icon.png?raw=true`,
                                },
                                {
                                    title: `Ornage TPMS`,
                                    src: `https://github.com/sam38124/JzFrameWork/blob/0802/App%20icon/tpms_logo.jpg?raw=true`,
                                },
                                {
                                    title: `HT470A`,
                                    src: `https://play-lh.googleusercontent.com/l4zj_O9NgqQ1HIGqTxC-x2Jk3DQ7uPIYiBOK1fLefPALWzlxSA5JyLubZp-JvgTDtw=w240-h480-rw`,
                                },
                                {
                                    title: `TPMS HT-BLE`,
                                    src: `https://play-lh.googleusercontent.com/ThvmdJ5eyktgKg5ABGaW5AbTPgGsMF-BXs5PXitNkYneC3fqMayGsPYgDXyvWLmVZRz2=s64-rw`,
                                },
                                {
                                    title: `宇通汽車`,
                                    src: `https://github.com/sam38124/JzFrameWork/blob/0802/App%20icon/btn_icon.png?raw=true`,
                                },
                                {
                                    title: `御天科技`,
                                    src: `https://github.com/sam38124/JzFrameWork/blob/0802/App%20icon/gotit_icon.png?raw=true`,
                                },
                                { title: `建大輪胎`, src: `img/appicons/kenda.png` },
                                { title: `Proshake`, src: `img/appicons/proshake.png` },
                                {
                                    title: `奇樂旅行社`,
                                    src: `https://sam38124.github.io/Glitter_DOC.github.io/images/kilo.png`
                                },
                                { title: `百壽理`, src: `https://sam38124.github.io/Glitter_DOC.github.io/img/biosole.png` },
                                {
                                    title: `t-sport體育平台`,
                                    src: `https://github.com/sam38124/JzFrameWork/blob/master/App%20icon/tsporticon.png?raw=true`,
                                },
                                {
                                    title: `啡日常`,
                                    src: `https://github.com/sam38124/JzFrameWork/blob/master/App%20icon/coffee.png?raw=true`,
                                },
                                { title: `Glitter`, src: `https://squarestudio.tw/Glitter/page/assets/img/glitter.png` },
                            ];
                            item.map((dd, index) => {
                                html += ` <div
                                            class="col-3 col-sm-2 col-md-2 col-xl-2 col-xxl-2 mb-4 d-flex flex-column align-items-center justify-content-center"
                                        >
                                            <img src="${dd.src}" class="bg-white rounded-3 shadow-lg" style="width: 65px;height: 65px;" />
                                            <span class="fw-500" style="font-size: 13px;">${dd.title}</span>
                                        </div>`;
                            });
                            return html;
                        })()}
                            </div>
                        </section>`;
                    },
                },
            ];
            return doc.create(`
                    <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4" style="">
                        <div
                            class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2"
                        >
                            <div class="">
                                <img class="rounded mx-auto" style="max-width: 100%;max-height: 80vh;" src="img/glitterBanner.png">
                               
                                <h2 class="fs-lg mb-2 fw-normal fw-500 mt-4">
                                    A powerful framework to let you use typescript to creat your
                                    <span class="text-success fw-bold">Android</span> / <span class="text-danger bold fw-bold">IOS</span> /
                                    <span class="text-primary bold fw-bold">WEB</span> applications at once time.
                                </h2>
                            </div>
                        </div>
                        ${(() => {
                let html = '';
                sessions.map((dd) => (html += dd.html));
                return html;
            })()}
                    </div>
                `, doc.asideScroller(sessions), new Items('Introduction', gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});

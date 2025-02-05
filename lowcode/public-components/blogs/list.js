import { Article } from "../../glitter-base/route/article.js";
import { Language } from "../../glitter-base/global/language.js";
const html = String.raw;
const css = String.raw;
export class BlogList {
    static getThemeColor(glitter) {
        var _a, _b, _c;
        return {
            title: (_a = glitter.share.globalValue['theme_color.0.title']) !== null && _a !== void 0 ? _a : '#333333',
            solid_bg: (_b = glitter.share.globalValue['theme_color.0.solid-button-bg']) !== null && _b !== void 0 ? _b : '#333333',
            solid_text: (_c = glitter.share.globalValue['theme_color.0.solid-button-text']) !== null && _c !== void 0 ? _c : '#333333',
        };
    }
    static main(obj) {
        const glitter = obj.gvc.glitter;
        const font_theme = ((glitter).share.font_theme[0] && (glitter).share.font_theme[0].value) || "Noto Sans TC";
        const gvc = obj.gvc;
        const theme_color = BlogList.getThemeColor(obj.gvc.glitter);
        glitter.addStyle(css `
           .ellipsis_desc {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
    }
            .card-image-fit-center{
                display: block;
                position: absolute;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            }
        `);
        return obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            const vm = {
                loading: true,
                data: []
            };
            function loadData() {
                Article.get({
                    limit: 15,
                    page: 0,
                    for_index: "true"
                }).then((res) => {
                    vm.data = res.response.data.map((dd) => {
                        var _a;
                        const created_time = dd.created_time;
                        dd = dd.content;
                        return {
                            title: (dd.language_data && dd.language_data[Language.getLanguage()].title) || dd.title,
                            desc: (dd.language_data && dd.language_data[Language.getLanguage()].description) || dd.description,
                            image: dd.preview_image,
                            collection: (_a = dd.collection) !== null && _a !== void 0 ? _a : [],
                            created_time: created_time,
                            tag: dd.tag
                        };
                    });
                    vm.loading = false;
                    gvc.notifyDataChange(id);
                    console.log(`res.response=>`, res.response);
                });
            }
            loadData();
            return {
                bind: id,
                view: () => {
                    const map_v = [
                        `<div class="col-12">
                          <div class="d-flex align-items-center py-5 px-2" >
                              <h1 class="m-0 w-100 text-center" style="color:${theme_color.title};font-size:${document.body.clientWidth > 800 ? `32px` : `24px`};font-weight: 800;">網誌列表</h1>
                          </div>
                       </div>`
                    ];
                    if (vm.data.length) {
                        map_v.push(vm.data.map((dd) => {
                            return ` <a class="col-12 col-md-6 mb-4 mb-lg-5 px-lg-3" style="cursor: pointer;" href="blogs/${dd.tag}" onclick="${gvc.event((e, event) => {
                                event.preventDefault();
                                gvc.glitter.href = `blogs/${dd.tag}`;
                            })}">

                               <!-- Card -->
                               <div class="card mb-7">

                                   <!-- Image -->
                                   <div class="w-100" style="padding-bottom: 56%;position: relative;">
                                   <img class="card-img-top card-image-fit-center" src="${dd.image}" style="  ">
</div>

                                   <!-- Body -->
                                   <div class="card-body px-0">

                                       <!-- Heading -->
                                       <h5 class="fw-bolder mx-3 text-start mb-0 ellipsis_desc" style="text-decoration: underline;">${dd.title}</h5>
  <div class="d-flex align-items-center text-muted mx-3 my-3">
  <div class="d-flex align-items-center" style="gap: 5px;">
  <i class="fa-regular fa-clock"></i>
  ${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd')}
</div>
<div class="d-flex align-items-center ms-2" style="gap: 5px;">
${dd.collection.map((dd) => {
                                return `<div class="badge fs-sm text-white text-decoration-none" style="cursor: pointer; 
background:${theme_color.solid_bg};
color:${theme_color.solid_text};" >${dd.title}</div>`;
                            }).join('')}
</div>
</div>
                                       <!-- Text -->
                                       <p class="mb-0 fw-500 ellipsis_desc mx-3 text-start" style="color: ${theme_color.title};">
                                          ${dd.desc}
                                       </p>

                                     

                                   </div>

                               </div>

                           </a>`;
                        }).join(''));
                    }
                    else if (vm.loading) {
                        map_v.push(`<div class="col-12 d-flex align-items-center justify-content-center p-3">
<div class="spinner-border"></div>
</div>`);
                    }
                    else {
                        map_v.push(`<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
                                                          <lottie-player
                                                              style="max-width: 100%;width: 300px;"
                                                              src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                              speed="1"
                                                              loop="true"
                                                              background="transparent"
                                                          ></lottie-player>
                                                          <span class="mb-5 fs-5">${Language.text('no_related_blogs')}</span>
                                                      </div>`);
                    }
                    return map_v.join('');
                },
                divCreate: {
                    class: `row container mx-auto mb-5 px-0`, style: css `font-family: 'Source Sans Pro', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', 'STHeiti', 'WenQuanYi Micro Hei', SimSun, sans-serif;max-width:1140px;`
                }
            };
        });
    }
}
window.glitter.setModule(import.meta.url, BlogList);

import { GVC } from '../../glitterBundle/GVController.js';
import { Glitter } from '../../glitterBundle/Glitter.js';
import { Article } from '../../glitter-base/route/article.js';
import { Language } from '../../glitter-base/global/language.js';
import { ApiUser } from '../../glitter-base/route/user.js';

const html = String.raw;

export class BlogList {
  static pageSplitV2 = (gvc: GVC, countPage: number, nowPage: number, callback: (p: number) => void) => {
    const generator = (n: number) => {
      return html` <li class="page-item my-0 mx-0">
        <div class="page-link-v2" onclick="${gvc.event(() => callback(n))}">${n}</div>
      </li>`;
    };
    const glitter = gvc.glitter;

    let vm = {
      id: glitter.getUUID(),
      loading: false,
      dataList: <any>[],
    };

    gvc.addStyle(`
      .page-link-v2 {
        display: inline-flex;
        height: 32px;
        padding: 10px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        background: #fff;
        border: 1px solid #393939;
        color: #393939;
      }

      .page-link-prev {
        border-radius: 7px 0px 0px 7px;
        border: 1px solid #393939;
        background: #fff;
        color: #393939;
      }

      .page-link-next {
        border-radius: 0px 7px 7px 0px;
        border: 1px solid #393939;
        background: #fff;
        color: #393939;
      }

      .page-link-active {
        background: #393939;
        color: #fff;
      }

      .angle-style {
        font-size: 12px;
        color: #393939;
      }
    `);

    return gvc.bindView({
      bind: vm.id,
      view: () => {
        if (vm.loading) {
          return html` <div class="w-100 d-flex align-items-center justify-content-center p-3">
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
          `;
        }
      },
      onCreate: () => {
        if (vm.loading) {
          vm.loading = false;
          gvc.notifyDataChange(vm.id);
        }
      },
    });
  };

  static getThemeColor(glitter: Glitter) {
    return {
      title: glitter.share.globalValue['theme_color.0.title'] ?? '#333333',
      solid_bg: glitter.share.globalValue['theme_color.0.solid-button-bg'] ?? '#333333',
      solid_text: glitter.share.globalValue['theme_color.0.solid-button-text'] ?? '#333333',
    };
  }

  static main(obj: { gvc: GVC; widget: any; subData: any }) {
    const glitter = obj.gvc.glitter;
    const gvc = obj.gvc;
    const theme_color = BlogList.getThemeColor(obj.gvc.glitter);

    glitter.addStyle(`
      .ellipsis_desc {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
      }

      .card-image-fit-center {
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
      const vm: {
        data: {
          title: string;
          desc: string;
          image: string;
          collection: { link: string; title: string }[];
          created_time: string;
          tag: string;
        }[];
        pageSize: number;
        pageIndex: number;
        loading: boolean;
        limit: number;
        collection: { link: string; title: string }[];
        seo: any;
      } = {
        loading: true,
        data: [],
        limit: 6,
        pageIndex: 1,
        pageSize: 0,
        collection: [],
        seo: {},
      };

      async function loadData() {
        vm.loading = true;
        vm.data = [];
        if (vm.pageIndex < 1) {
          vm.pageIndex = 1;
        }
        vm.collection = (await ApiUser.getPublicConfig('blog_collection', 'manager')).response.value;
        vm.seo = (
          await ApiUser.getPublicConfig(`article_seo_data_${Language.getLanguage()}`, 'manager')
        ).response.value;
        gvc.notifyDataChange(id);
        Article.get({
          limit: vm.limit,
          page: vm.pageIndex - 1,
          for_index: 'true',
          label: gvc.glitter.getUrlParameter('collection'),
          search: gvc.glitter.getUrlParameter('search'),
        }).then(res => {
          vm.data = res.response.data.map((dd: any) => {
            const created_time = dd.created_time;
            dd = dd.content;
            return {
              title: (dd.language_data && dd.language_data[Language.getLanguage()].title) || dd.title,
              desc: (dd.language_data && dd.language_data[Language.getLanguage()].description) || dd.description,
              image:
                dd.seo && dd.seo.image
                  ? dd.seo.image
                  : dd.preview_image ||
                    'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
              collection: dd.collection ?? [],
              created_time: created_time,
              tag: dd.tag,
            };
          });
          vm.loading = false;
          vm.pageSize = Math.ceil(res.response.total / parseInt(vm.limit as any, 10));
          if (parseInt(`${vm.pageIndex}`, 10) > vm.pageSize) {
            vm.pageIndex = vm.pageSize - 1;
          }
          gvc.notifyDataChange(id);
        });
      }

      loadData();
      return {
        bind: id,
        view: () => {
          const collection_title = vm.collection.find(dd => {
            return dd.link === gvc.glitter.getUrlParameter('collection');
          });
          const map_v: string[] = [
            html` <div class="col-12 px-0">
              <div class="d-flex align-items-center flex-column justify-content-center py-4 pt-lg-5 px-2" >
                <h1
                  class="m-0 w-100 text-center"
                  style="color:${theme_color.title};font-size:${document.body.clientWidth > 800
                    ? `32px`
                    : `24px`};font-weight: 800;"
                >
                  ${(collection_title && collection_title.title) ||
                  gvc.glitter.getUrlParameter('collection') ||
                  vm.seo.title ||
                  Language.text('blog_list')}
                </h1>
                <div
                  class="w-100 d-flex align-items-center rounded-2 mt-3 border"
                  style="height: 50px;background: #fafafa;overflow: hidden;"
                >
                  <input
                    class="flex-fill  px-3"
                    style="background: none;outline:none;border: 0;"
                    placeholder="${Language.text('search_article')}"
                    onchange="${gvc.event((e, event) => {
                      gvc.glitter.setUrlParameter('search', e.value);
                      loadData();
                    })}"
                    value="${gvc.glitter.getUrlParameter('search') || ''}"
                  />
                  <div
                    class="d-flex align-items-center justify-content-center"
                    style="width: 48px;height: 48px;background:${theme_color.solid_bg}; color:${theme_color.solid_text};"
                  >
                    <i class="fa-solid fa-magnifying-glass fs-5"></i>
                  </div>
                </div>
                <div
                  class="${vm.collection.length ? `d-flex` : `d-none`} mt-3 flex-wrap  align-items-center w-100"
                  style="gap:10px;"
                >
                  ${(gvc.glitter.getUrlParameter('collection') || gvc.glitter.getUrlParameter('search')
                    ? [
                        {
                          link: '',
                          title: Language.text('all_article'),
                        },
                      ]
                    : []
                  )
                    .concat(vm.collection as any)
                    .map((dd: any) => {
                      return html`<div
                        class="fs-sm  text-decoration-none d-flex align-items-center justify-content-center px-3 fw-bold"
                        style="cursor: pointer; background:${theme_color.solid_bg}; color:${theme_color.solid_text}; height: 30px; border-radius: 15px;"
                        onclick="${gvc.event(() => {
                          if (dd.link) {
                            gvc.glitter.setUrlParameter('collection', dd.link);
                          } else {
                            gvc.glitter.setUrlParameter('collection', undefined);
                            gvc.glitter.setUrlParameter('search', undefined);
                          }

                          loadData();
                        })}"
                      >
                        ${dd.title}
                      </div>`;
                    })
                    .join('')}
                </div>
              </div>
            </div>`,
          ];
          if (vm.data.length) {
            map_v.push(
              vm.data
                .map(dd => {
                  return html`<a
                    class="col-12 col-md-6 col-lg-4 mb-4 mb-lg-5 px-lg-3"
                    style="cursor: pointer;color:${theme_color.title} !important;text-decoration:none !important;"
                    href="blogs/${dd.tag}"
                    onclick="${gvc.event((e, event) => {
                      event.preventDefault();
                      gvc.glitter.href = `/blogs/${dd.tag}`;
                    })}"
                  >
                    <!-- Card -->
                    <div class="card mb-7">
                      <!-- Image -->
                      <div class="w-100" style="padding-bottom: 56%;position: relative;">
                        <img class="card-img-top card-image-fit-center" src="${dd.image}" style="  " />
                      </div>

                      <!-- Body -->
                      <div class="card-body px-0">
                        <!-- Heading -->
                        <h5 class="fw-bolder mx-3 text-start mb-0 ellipsis_desc" style="text-decoration: underline;">
                          ${dd.title}
                        </h5>
                        <div class="d-flex align-items-center text-muted mx-3 my-3">
                          <div class="d-flex align-items-center" style="gap: 5px;">
                            <i class="fa-regular fa-clock"></i>
                            ${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd')}
                          </div>
                          <div class="d-flex align-items-center ms-2" style="gap: 5px;">
                            ${dd.collection
                              .map(dd => {
                                return `<div class="badge fs-sm text-white text-decoration-none" style="cursor: pointer; 
background:${theme_color.solid_bg};
color:${theme_color.solid_text};" >${dd.title}</div>`;
                              })
                              .join('')}
                          </div>
                        </div>
                        <!-- Text -->
                        <p class="mb-0 fw-500 ellipsis_desc mx-3 text-start" style="color: ${theme_color.title};">
                          ${dd.desc}
                        </p>
                      </div>
                    </div>
                  </a>`;
                })
                .join('')
            );
            map_v.push(
              this.pageSplitV2(gvc, vm.pageSize, vm.pageIndex, p => {
                vm.pageIndex = p;
                loadData();
                (document.querySelector('html') as any).scrollTo(0, 0);
              })
            );
          } else if (vm.loading) {
            return html`<div class="col-12 d-flex align-items-center justify-content-center p-3">
              <div class="spinner-border"></div>
            </div>`;
          } else {
            map_v.push(
              html`<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
                <lottie-player
                  style="max-width: 100%;width: 300px;"
                  src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                  speed="1"
                  loop="true"
                  background="transparent"
                ></lottie-player>
                <span class="mb-5 fs-5">${Language.text('no_related_blogs')}</span>
              </div>`
            );
          }
          return map_v.join('');
        },
        divCreate: {
          class: 'row container mx-auto mb-5 px-0',
          style: `
            font-family: 'Source Sans Pro', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, 'Hiragino Sans GB',
              'Microsoft YaHei', '微软雅黑', 'STHeiti', 'WenQuanYi Micro Hei', SimSun, sans-serif;
            max-width: 1140px;
          `,
        },
      };
    });
  }
}

(window as any).glitter.setModule(import.meta.url, BlogList);

import { GVC } from '../../glitterBundle/GVController.js';
import { Color } from '../public/color.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { LanguageView } from '../public/language-view.js';
import { Language } from '../../glitter-base/global/language.js';
import { FooterInitial } from './footer-initial.js';
import { Footer } from '../../app-component/footer.js';
import { PdClass } from '../product/pd-class.js';

const html = String.raw;

type FooterObject = {
  title: string;
  link: string;
};

type FooterItem = {
  title: string;
  link: string;
  items: FooterObject[];
};

export class Footer01 {
  static main(gvc: GVC, widget: any, subData: any) {
    return FooterInitial.initial({
      browser: () => {
        const formData = widget.formData;
        const colors = Color.getTheme(gvc, formData);
        const footer = {
          list: [],
        };
        const css = String.raw;
        gvc.addStyle(`
          .f-title {
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.64px;
            word-break: break-all;
            color: ${colors.title};
          }

          .f-ul {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .f-li {
            color: ${colors.content};
          }

          .f-aclass {
            color: ${colors.content} !important;
          }

          .f-bgr {
            background: ${colors.bgr};
          }

          .f-container {
            margin-left: 10px;
            margin-right: 10px;
          }

          .f-title-container {
            margin-bottom: 18px;
          }

          .f-content-container {
            display: flex;
            justify-content: space-around;
            margin-bottom: 10px;
          }

          .f-copyright {
            font-size: 14px;
            color: ${colors.content};
            border-top: 1px solid ${colors.content};
            padding: 6px 0;
          }

          .f-icon-div {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .f-icon-image {
            color: #ffffff;
            width: 30px;
            height: 30px;
          }

          .f-intro {
            margin-top: 12px;
            font-size: 14px;
            font-weight: 400;
            line-height: 160%;
            letter-spacing: 0.56px;
            color: ${colors.content};
          }
        `);
        gvc.addStyle(`
          .f-copyright {
            font-size: 14px;
            color: ${colors.content};
            border-top: 1px solid ${colors.content};
            padding: 6px 0;
          }

          .f-h4 {
            color: ${colors.title};
            font-size: 32px;
            font-weight: 700;
          }

          .f-icon-list {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
          }

          .f-icon {
            color: ${colors.content};
          }
        `);
        return html` <!-- Footer 01 -->
          <footer class="f-bgr border-top">
            <div class="border-gray-700 f-padding-top">
              <div class="container">
                <div class="row py-sm-5 f-container ">
                  <div
                    class="col-12 col-md-3 col-lg-4 f-title-container pt-3 pt-sm-0 ${document.body.clientWidth < 800
                      ? ` d-flex flex-column align-items-center justify-content-center`
                      : ``}"
                  >
                    <img src="${formData.logo}" style="max-height: 90px" />
                    ${((window as any).store_info.language_setting.support.length > 1 ||
                      (window as any).store_info.multi_currency) &&
                    document.body.clientWidth < 800
                      ? LanguageView.selectLanguage(gvc, colors)
                      : ``}
                    <ul class="d-flex list-unstyled list-inline mt-3 mb-md-0 text-gray-350">
                      ${(() => {
                        try {
                          return formData.kkk.link
                            .map((item: { link: string; type: string }) => {
                              return html` <li class="list-inline-item f-icon-list">
                                <div class="f-icon-div">
                                  <div
                                    onclick="${gvc.event(() => {
                                      gvc.glitter.href = item.link;
                                    })}"
                                  >
                                    <img
                                      class="f-icon-image"
                                      src="${(() => {
                                        switch (item.type) {
                                          case 'fb':
                                            return 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722847285395-img_facebook.svg';
                                          case 'youtube':
                                            return 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722847654029-771382_channel_circle_logo_media_social_icon.png';
                                          case 'twitter':
                                            return 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722847853494-m2i8K9K9N4b1G6H7.png';
                                          case 'ig':
                                            return 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722847430108-social.png';
                                          case 'line':
                                            return 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722847342584-img_line.svg';
                                          default:
                                            return '';
                                        }
                                      })()}"
                                    />
                                  </div>
                                </div>
                              </li>`;
                            })
                            .join('');
                        } catch (error) {
                          return '';
                        }
                      })()}
                    </ul>
                    <div>
                      <h4 class="f-intro mb-0">${formData.intro ? formData.intro.replace(/\n/g, '<br/>') : ''}</h4>
                    </div>
                    ${((window as any).store_info.language_setting.support.length > 1 ||
                      (window as any).store_info.multi_currency) &&
                    document.body.clientWidth >= 800
                      ? LanguageView.selectLanguage(gvc, colors)
                      : ``}
                  </div>
                  <div class="col f-content-container ${document.body.clientWidth > 768 ? '' : 'row'}">
                    ${(() => {
                      try {
                        return gvc.bindView(
                          (() => {
                            const id = gvc.glitter.getUUID();
                            let loading = true;
                            return {
                              bind: id,
                              view: async () => {
                                if (loading) {
                                  return '';
                                } else {
                                  const userData = await ApiUser.getUserData(gvc.glitter.share.GlobalUser.token, 'me');

                                  return footer.list
                                    .map((data: FooterItem) => {
                                      if (!PdClass.menuVisibleVerify(userData, data)) {
                                        return '';
                                      }

                                      return html` <div class="${document.body.clientWidth > 768 ? '' : 'col-12 mt-3'}">
                                        <h6
                                          class="heading-xxs mb-3 f-title"
                                          onclick="${gvc.event(() => {
                                            if (data.link) {
                                              gvc.glitter.href = data.link;
                                            }
                                          })}"
                                        >
                                          ${data.title}
                                        </h6>
                                        <ul class="list-unstyled mb-7 f-ul">
                                          ${data.items
                                            .map(chi => {
                                              if (!PdClass.menuVisibleVerify(userData, chi)) {
                                                return '';
                                              }
                                              return html` <li
                                                class="f-li"
                                                style="${chi.link ? 'cursor: pointer;' : ''}"
                                                onclick="${gvc.event(() => {
                                                  if (chi.link) {
                                                    gvc.glitter.href = chi.link;
                                                  }
                                                })}"
                                              >
                                                <a
                                                  class="f-aclass"
                                                  title="${chi.title}"
                                                  onclick="${gvc.event((e, event) => {
                                                    event.preventDefault();
                                                  })}"
                                                  href="${chi.link}"
                                                  >${chi.title}</a
                                                >
                                              </li>`;
                                            })
                                            .join('')}
                                        </ul>
                                      </div>`;
                                    })
                                    .join('');
                                }
                              },
                              divCreate: {
                                class: document.body.clientWidth > 768 ? 'd-flex gap-5' : 'row p-0',
                              },
                              onCreate: () => {
                                if (loading) {
                                  ApiUser.getPublicConfig(
                                    widget.formData.menu_refer || 'footer-setting',
                                    'manager'
                                  ).then(data => {
                                    if (data.result && data.response.value) {
                                      footer.list = data.response.value[Language.getLanguage()];
                                    }
                                    loading = false;
                                    gvc.notifyDataChange(id);
                                  });
                                }
                              },
                            };
                          })()
                        );
                      } catch (error) {
                        return '';
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
            <div class="py-6">
              <div class="container">
                ${formData.copy_right
                  ? html` <div class="row">
                      <div class="col text-center">
                        <p class="my-2 f-copyright">${formData.copy_right}</p>
                      </div>
                    </div>`
                  : ''}
              </div>
            </div>
          </footer>`;
      },
      mobile: () => {
        return Footer.main({
          gvc: gvc,
          formData: {},
          key: '',
          widget: widget,
          callback: () => {},
        });
      },
      gvc: gvc,
    });
  }
}

(window as any).glitter.setModule(import.meta.url, Footer01);

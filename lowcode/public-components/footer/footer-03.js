import { Color } from '../public/color.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { Language } from '../../glitter-base/global/language.js';
import { LanguageView } from '../public/language-view.js';
import { FooterInitial } from './footer-initial.js';
import { Footer } from '../../app-component/footer.js';
const html = String.raw;
export class Footer02 {
    static main(gvc, widget, subData) {
        return FooterInitial.initial({
            browser: () => {
                var _a, _b;
                const formData = widget.formData;
                const colors = Color.getTheme(gvc, formData);
                const footer = {
                    list: [],
                };
                gvc.addStyle(`
            .f-title {
                font-size: 16px;
                letter-spacing: 0.64px;
                word-break: break-all;
                color: ${colors.title};
            }

            .f-content {
                margin-top: 12px;
                font-size: 14px;
                font-weight: 400;
                line-height: 160%;
                letter-spacing: 0.56px;
                color: ${colors.content};
            }

            .f-copyright {
                font-size: 14px;
                color: ${colors.content};
                border-top: 1px solid ${colors.content};
                padding: 6px 0;
            }

            .f-ul-div {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
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

            .f-padding-top {
                padding-top: 38px;
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

            .f-row {
                max-width: 800px;
                margin: 0 auto;
            }
        `);
                return html ` <footer class="f-bgr border-top">
          <div class="border-gray-700 f-padding-top">
            <div class="container my-5">
              <div class="d-flex flex-column align-items-center justify-content-center gap-2 mb-3">
                <div>
                  <img src="${(_a = formData.logo) !== null && _a !== void 0 ? _a : ''}" style="min-height: 40px; max-height: 60px;" />
                </div>
                <div>
                  <h4 class="f-content">${formData.intro ? formData.intro.replace(/\n/g, '<br/>') : ''}</h4>
                </div>
                ${window.store_info.language_setting.support.length > 1 ||
                    window.store_info.multi_currency
                    ? html ` <div class="col-12 d-flex justify-content-center mb-3">
                      ${LanguageView.selectLanguage(gvc, colors)}
                    </div>`
                    : ``}
                <div class="d-flex justify-content-center gap-2 p-0 pb-3">
                  ${(() => {
                    try {
                        return formData.kkk.link
                            .map((item) => {
                            return html ` <div class="f-icon-div">
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
                          </div>`;
                        })
                            .join('');
                    }
                    catch (error) {
                        return '';
                    }
                })()}
                </div>
              </div>
              <div class="row f-row">
                ${(() => {
                    try {
                        return gvc.bindView((() => {
                            const id = gvc.glitter.getUUID();
                            let loading = true;
                            return {
                                bind: id,
                                view: () => {
                                    if (loading) {
                                        return '';
                                    }
                                    else {
                                        return footer.list
                                            .map((data) => {
                                            return html ` <div class="f-ul-div col-12 col-md-3 col-lg-4 mt-2">
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
                                                return html ` <li
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
                                    class: document.body.clientWidth > 768 ? 'd-flex justify-content-center gap-2' : '',
                                },
                                onCreate: () => {
                                    if (loading) {
                                        ApiUser.getPublicConfig('footer-setting', 'manager').then(data => {
                                            if (data.result && data.response.value) {
                                                footer.list = data.response.value[Language.getLanguage()];
                                            }
                                            loading = false;
                                            gvc.notifyDataChange(id);
                                        });
                                    }
                                },
                            };
                        })());
                    }
                    catch (error) {
                        return '';
                    }
                })()}
              </div>
            </div>
          </div>
          <div class="py-6">
            <div class="container">
              <div class="row">
                <div class="col text-center">
                  <p class="my-2 f-copyright">${(_b = formData.note) !== null && _b !== void 0 ? _b : ''}</p>
                </div>
              </div>
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
                    callback: () => { }
                });
            },
            gvc: gvc,
        });
    }
}
window.glitter.setModule(import.meta.url, Footer02);

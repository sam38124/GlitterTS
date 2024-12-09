import { FtClass } from './ft-class.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { Language } from "../../glitter-base/global/language.js";
const html = String.raw;
export class Footer02 {
    static main(gvc, widget, subData) {
        var _a;
        const formData = widget.formData;
        const colors = FtClass.getColor(gvc, formData);
        const footer = {
            list: [],
        };
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
        return html `<footer class="f-bgr border-top">
            <div class="border-gray-700 pt-4 pt-md-0">
                <div class="container px-0">
                    <div class="row py-sm-5 f-container">
                        <div class="col ${document.body.clientWidth > 768 ? '' : 'row'} f-content-container">
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
                                    return html ` <div class="${document.body.clientWidth > 768 ? '' : 'col-12'} mt-2">
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
                                        .map((chi) => {
                                        return html `<li
                                                                                    class="f-li"
                                                                                    style="${chi.link ? 'cursor: pointer;' : ''}"
                                                                                    onclick="${gvc.event(() => {
                                            if (chi.link) {
                                                gvc.glitter.href = chi.link;
                                            }
                                        })}"
                                                                                >
                                                                                    <a class="f-aclass">${chi.title}</a>
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
                            class: document.body.clientWidth > 768 ? 'd-flex gap-5' : '',
                        },
                        onCreate: () => {
                            if (loading) {
                                ApiUser.getPublicConfig('footer-setting', 'manager').then((data) => {
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
                        <div class="col-12 col-md-3 col-lg-6 f-title-container d-flex flex-column ms-auto">
                            <div class="d-flex gap-2 p-0 pb-3 justify-content-${document.body.clientWidth > 768 ? 'end' : 'center'}">
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
                            <div class="d-none d-sm-block f-intro text-end">${formData.intro ? formData.intro.replace(/\n/g, '<br/>') : ''}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="py-6">
                <div class="container">
                    <div class="row">
                        <div class="col text-center">
                            <p class="my-2 f-copyright">${(_a = formData.note) !== null && _a !== void 0 ? _a : ''}</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>`;
    }
}
window.glitter.setModule(import.meta.url, Footer02);

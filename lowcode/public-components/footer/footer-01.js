import { FtClass } from './ft-class.js';
import { ApiUser } from '../../glitter-base/route/user.js';
const html = String.raw;
export class Footer01 {
    static main(gvc, widget, subData) {
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

            .f-padding-top {
                padding-top: 38px;
            }

            .f-container {
                margin-left: 10px;
                margin-right: 10px;
            }

            .f-title-container {
                margin-bottom: 18px;
                padding-right: 192px;
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
        return html ` <footer class="f-bgr border-top">
            <div class="border-gray-700 f-padding-top">
                <div class="container">
                    <div class="row py-sm-5 f-container">
                        <div class="col-12 col-md-6 f-title-container">
                            <img src="${formData.logo}" style="max-height: 90px" />
                            <ul class="d-flex list-unstyled list-inline mt-3 mb-md-0 text-gray-350">
                                ${(() => {
            try {
                return formData.kkk.link
                    .map((item) => {
                    return html ` <li class="list-inline-item f-icon-list">
                                                    <div
                                                        class="text-reset"
                                                        onclick="${gvc.event(() => {
                        gvc.glitter.href = item.link;
                    })}"
                                                    >
                                                        ${(() => {
                        switch (item.type) {
                            case 'fb':
                                return html `<i class="fab fa-facebook-f f-icon"></i>`;
                            case 'youtube':
                                return html `<i class="fab fa-youtube f-icon"></i>`;
                            case 'twitter':
                                return html `<i class="fab fa-twitter f-icon"></i>`;
                            case 'ig':
                                return html `<i class="fab fa-instagram f-icon"></i>`;
                            default:
                                return '';
                        }
                    })()}
                                                    </div>
                                                </li>`;
                })
                    .join('');
            }
            catch (error) {
                return '';
            }
        })()}
                            </ul>
                        </div>
                        <div class="col f-content-container ${document.body.clientWidth > 768 ? '' : 'row'}">
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
                                    return html ` <div class="${document.body.clientWidth > 768 ? '' : 'col-12 mt-2cs'}">
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
                                        return html ` <li
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
                                        footer.list = data.response.value;
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
            </div>
            <div class="py-6">
                <div class="container">
                    <div class="row">
                        <div class="col text-center">
                            <p class="my-2 f-copyright">
                                ${(() => {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            return `${currentYear} © ${formData.logo} , LTD. ALL RIGHTS RESERVED.`;
        })()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>`;
    }
}
window.glitter.setModule(import.meta.url, Footer01);

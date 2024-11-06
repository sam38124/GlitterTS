import { GVC } from '../../glitterBundle/GVController.js';
import { FtClass } from './ft-class.js';

const html = String.raw;

export class Footer01 {
    static main(gvc: GVC, widget: any, subData: any) {
        const formData = widget.formData;
        const colors = FtClass.getColor(gvc, formData);

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

        let changePage = (index: string, type: 'page' | 'home', subData: any) => {};
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = cl.changePage;
        });

        return html`<footer class="f-bgr">
            <div class="border-gray-700 f-padding-top">
                <div class="container">
                    <div class="row py-sm-5 f-container">
                        <div class="col-12 col-md-6 f-title-container">
                            <h4 class="mb-0 f-h4">${formData.logo}</h4>
                            <ul class="d-flex list-unstyled list-inline mt-2 mb-md-0 text-gray-350">
                                ${(() => {
                                    try {
                                        return formData.kkk.link
                                            .map((item: { link: string; type: string }) => {
                                                return html`<li class="list-inline-item f-icon-list">
                                                    <div
                                                        class="text-reset"
                                                        onclick="${gvc.event(() => {
                                                            changePage(item.link, 'page', {});
                                                        })}"
                                                    >
                                                        ${(() => {
                                                            switch (item.type) {
                                                                case 'fb':
                                                                    return html`<i class="fab fa-facebook-f f-icon"></i>`;
                                                                case 'youtube':
                                                                    return html`<i class="fab fa-youtube f-icon"></i>`;
                                                                case 'twitter':
                                                                    return html`<i class="fab fa-twitter f-icon"></i>`;
                                                                case 'ig':
                                                                    return html`<i class="fab fa-instagram f-icon"></i>`;
                                                                default:
                                                                    return '';
                                                            }
                                                        })()}
                                                    </div>
                                                </li>`;
                                            })
                                            .join('');
                                    } catch (error) {
                                        return '';
                                    }
                                })()}
                            </ul>
                        </div>
                        <div class="col f-content-container ${document.body.clientWidth > 768 ? '' : 'row'}">
                            ${(() => {
                                try {
                                    return formData.list
                                        .map((item: { title: string; child: { title: string; page?: string }[] }) => {
                                            return html`<div class="${document.body.clientWidth > 768 ? '' : 'col-12 mt-2cs'}">
                                                <h6 class="heading-xxs mb-3 f-title">${item.title}</h6>
                                                <ul class="list-unstyled mb-7 f-ul">
                                                    ${item.child
                                                        .map((chi) => {
                                                            return html`<li
                                                                class="f-li"
                                                                style="${chi.page ? 'cursor: pointer;' : ''}"
                                                                onclick="${gvc.event(() => {
                                                                    if (chi.page) {
                                                                        changePage(chi.page, 'page', {});
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
(window as any).glitter.setModule(import.meta.url, Footer01);

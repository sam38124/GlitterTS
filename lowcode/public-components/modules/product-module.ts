import { GVC } from '../../glitterBundle/GVController.js';

const html = String.raw;

export class ProductModule {
  static titleFontColor: string = '';

  static tab(
    data: {
      title: string;
      key: string;
    }[],
    gvc: GVC,
    select: string,
    callback: (key: string) => void,
    style?: string
  ) {
    return html` <div
      style="width: 100%; justify-content: center; align-items: flex-start; gap: 22px; display: inline-flex;cursor: pointer;margin-top: 24px;margin-bottom: 24px;font-size: 18px; ${style ??
      ''};"
    >
      ${data
        .map(dd => {
          if (select === dd.key) {
            return html` <div
              style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex"
            >
              <div
                style="align-self: stretch; text-align: center; color: ${this
                  .titleFontColor}; font-family: Noto Sans; font-weight: 700; line-height: 18px; word-wrap: break-word;white-space: nowrap;margin: 0 20px;"
                onclick="${gvc.event(() => {
                  callback(dd.key);
                })}"
              >
                ${dd.title}
              </div>
              <div style="align-self: stretch; height: 0px; border: 1px ${this.titleFontColor} solid"></div>
            </div>`;
          } else {
            return html` <div
              style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex"
              onclick="${gvc.event(() => {
                callback(dd.key);
              })}"
            >
              <div
                style="align-self: stretch; text-align: center; color: #8D8D8D; font-family: Noto Sans; font-weight: 400; line-height: 18px; word-wrap: break-word;white-space: nowrap;margin: 0 20px;"
              >
                ${dd.title}
              </div>
              <div style="align-self: stretch; height: 0px"></div>
            </div>`;
          }
        })
        .join('')}
    </div>`;
  }
}

import { BgWidget } from '../backend-manager/bg-widget.js';
import { DataAnalyzeModule, DataAnalyzeModuleCart } from './data-analyze-module.js';
const html = String.raw;
export class DataAnalyze {
    static main(gvc) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const vm = {
                loading: true,
                data: {},
                filter_date: 'week',
                come_from: 'all',
                switch: false,
                startDate: '',
                endDate: '',
            };
            gvc.glitter.addMtScript([
                {
                    src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1714105121170-apexcharts.min.js',
                },
            ], () => { }, () => { });
            return {
                bind: id,
                view: () => {
                    try {
                        return html `
              <div class="title-container ms-lg-3">${BgWidget.title('營運分析')}</div>
              <div class="row mx-0 mt-4">
                <div class="col-12 mb-3">
                  ${DataAnalyzeModuleCart.filterCart(gvc, vm, () => {
                            gvc.notifyDataChange(id);
                        })}
                </div>
                ${[
                            DataAnalyzeModule.salesAmount(gvc, vm),
                            DataAnalyzeModule.orderAmount(gvc, vm),
                            DataAnalyzeModule.orderAverage(gvc, vm),
                            DataAnalyzeModule.viewPeople(gvc, vm),
                            DataAnalyzeModule.registerPeople(gvc, vm),
                            DataAnalyzeModule.transferRatio(gvc, vm),
                        ]
                            .map(dd => {
                            return html `<div class="col-12 col-lg-4 col-md-6 mb-3 px-2">${dd}</div>`;
                        })
                            .join('')}
                ${[DataAnalyzeModule.hotProducts(gvc), DataAnalyzeModule.hotCollection(gvc)]
                            .map(dd => {
                            return html `<div class="col-12 col-lg-6 col-md-6 mb-3 px-2">${dd}</div>`;
                        })
                            .join('')}
              </div>
            `;
                    }
                    catch (e) {
                        console.error(e);
                        return `${e}`;
                    }
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, DataAnalyze);

import { GVC } from '../glitterBundle/GVController.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { DataAnalyzeModule } from './data-analyze-module.js';

const html = String.raw;

export class DataAnalyze {
    public static main(gvc: GVC) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const vm: {
                loading: boolean;
                data: any;
            } = {
                loading: true,
                data: {},
            };

            gvc.glitter.addMtScript(
                [
                    {
                        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1714105121170-apexcharts.min.js',
                    },
                ],
                () => {},
                () => {}
            );

            ApiShop.ecDataAnalyze('active_recent_2week,active_recent_year,recent_register_today,order_today,sales_per_month_1_month'.split(',')).then(async (res) => {
                vm.loading = false;
                vm.data = res.response;
                gvc.notifyDataChange(id);
            });

            return {
                bind: id,
                view: () => {
                    try {
                        if (vm.loading) {
                            return BgWidget.spinner({
                                text: {
                                    value: '正在載入分析資料 ...',
                                },
                            });
                        }
                        return html`
                            <div class="row m-0">
                                <div
                                    class="col-12"
                                    style="width: 100%; padding: 24px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); border-radius: 10px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex;margin-top: 24px;"
                                >
                                    <div
                                        class="d-flex flex-column flex-xl-row"
                                        style="align-self: stretch; flex: 1 1 0; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex;"
                                    >
                                        <div style="flex: 1 1 0; align-self: stretch; flex-direction: column; justify-content: center; align-items: flex-start; gap: 8px; display: inline-flex;">
                                            <div style="align-self: stretch; color: #393939; font-size: 20px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word;">營運狀況總覽</div>
                                            <div style="align-self: stretch; color: #8D8D8D; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word;">查看目前的業務情形</div>
                                            ${BgWidget.aiChatButton({
                                                gvc,
                                                select: 'order_analysis',
                                            })}
                                        </div>
                                        <div class="row p-0" style="width: 896px; max-width: 100%; gap:15px 0px; ">
                                            ${[
                                                {
                                                    title: '今日瀏覽人數',
                                                    value: html`${vm.data.active_recent_2week.count_array
                                                        .map((dd: any) => {
                                                            return dd;
                                                        })
                                                        .reverse()[0]
                                                        .toLocaleString()}
                                                    ${BgWidget.grayNote(
                                                        `(本月: ${vm.data.active_recent_year.count_array
                                                            .map((dd: any) => {
                                                                return dd;
                                                            })
                                                            .reverse()[0]
                                                            .toLocaleString()})`,
                                                        'font-weight: 500;'
                                                    )}`,
                                                    icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/users-duotone-solid.svg',
                                                },
                                                {
                                                    title: '今日會員註冊',
                                                    value: html`${vm.data.recent_register_today['today'].toLocaleString()}
                                                    ${BgWidget.grayNote(
                                                        `(本月: ${vm.data.recent_register_today['count_register']
                                                            .map((dd: any) => {
                                                                return dd;
                                                            })
                                                            .reverse()[0]
                                                            .toLocaleString()})`,
                                                        'font-weight: 500;'
                                                    )}`,
                                                    icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/user-group-crown-solid.svg',
                                                },
                                                {
                                                    title: '今日成交總額',
                                                    value: `${vm.data.order_today.total_amount.toLocaleString()} ${BgWidget.grayNote(
                                                        `(本月: $${(() => {
                                                            return vm.data.sales_per_month_1_month.countArray;
                                                        })()
                                                            .map((dd: any) => {
                                                                return dd;
                                                            })
                                                            .reverse()[0]
                                                            .toLocaleString()})`,
                                                        'font-weight: 500;'
                                                    )}`,
                                                    icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716565784156-coins-light.svg',
                                                },
                                                {
                                                    title: '今日成交訂單',
                                                    value: vm.data.order_today.total_count,
                                                    icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                                                },
                                                {
                                                    title: '未出貨訂單',
                                                    value: vm.data.order_today.un_shipment,
                                                    icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560713871-truck-light 1.svg',
                                                },
                                                {
                                                    title: '未付款訂單',
                                                    value: vm.data.order_today.un_pay,
                                                    icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560798255-credit-card-light 1.svg',
                                                },
                                            ]
                                                .map((dd) => {
                                                    return html` <div
                                                        class="w-100 px-3 py-3"
                                                        style="align-self: stretch; background: white; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.10); border-radius: 10px; overflow: hidden; flex-direction: column; justify-content: center; align-items: flex-start; gap: 10px; display: inline-flex;"
                                                    >
                                                        <div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 16px; display: inline-flex;">
                                                            <div style="flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: center; gap: 2px; display: inline-flex;">
                                                                <div style="align-self: stretch; color: #393939; font-size: 18px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word;">
                                                                    ${dd.value}
                                                                </div>
                                                                <div style="align-self: stretch; color: #8D8D8D; font-size: 16px; font-family: Noto Sans; font-weight: 500; word-wrap: break-word;">
                                                                    ${dd.title}
                                                                </div>
                                                            </div>
                                                            <img style="width:30px;height: 30px;" src="${dd.icon}" />
                                                        </div>
                                                    </div>`;
                                                })
                                                .map((dd) => {
                                                    return html` <div class="col-sm-4 col-lg-4 col-12 px-0 px-sm-2">${dd}</div>`;
                                                })
                                                .join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="my-3"></div>
                            <div class="row">
                                ${[
                                    DataAnalyzeModule.salesAmount(gvc),
                                    DataAnalyzeModule.orderAmount(gvc),
                                    DataAnalyzeModule.orderAverage(gvc),
                                    DataAnalyzeModule.viewPeople(gvc),
                                    DataAnalyzeModule.registerPeople(gvc),
                                    DataAnalyzeModule.transferRatio(gvc),
                                ]
                                    .map((dd) => {
                                        return `<div class="col-12 col-lg-4 col-md-6 mb-3">${dd}</div>`;
                                    })
                                    .join('')}
                            </div>
                        `;
                    } catch (e) {
                        console.error(e);
                        return `${e}`;
                    }
                },
                divCreate: {
                    class: `mx-auto`,
                    style: `width:100%;`,
                },
            };
        });
    }
}

function getPastMonths(numMonths: number): string[] {
    const months: string[] = [];
    const currentDate = new Date();
    let year = currentDate.getFullYear() - 2000; // 取年份後兩位
    let month = currentDate.getMonth() + 2; // 月份從0開始，並往後一個月，所以加2

    for (let i = 0; i < numMonths; i++) {
        month--; // 每次迴圈減少一個月
        if (month === 0) {
            year--; // 如果月份減至0，則回到上一年
            month = 12; // 調整為12月
        }
        const formattedMonth = `${year}.${month.toString().padStart(2, '0')}`; // 格式化為兩位數字的月份
        months.unshift(formattedMonth); // 新增到陣列開頭
    }

    return months;
}

function getPastDays(numDays: number) {
    const days = [];
    const currentDate = new Date();

    for (let i = 0; i < numDays; i++) {
        const pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - i);
        const month = pastDate.getMonth() + 1; // 月份從0開始，所以要加1
        const day = pastDate.getDate();
        const dateString = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
        days.unshift(dateString); // 將日期添加到陣列的開頭
    }

    return days;
}

(window as any).glitter.setModule(import.meta.url, DataAnalyze);

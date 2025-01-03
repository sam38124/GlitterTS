import {GVC} from "../glitterBundle/GVController.js";
import {BgWidget} from "../backend-manager/bg-widget.js";
import {ApiShop} from "../glitter-base/route/shopping.js";

const html = String.raw
const css = String.raw
//共用樣式
const globalStyle = {
    header_title: css`color: #393939;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;`,
    sub_title: css`color: #393939;
        font-size: 24px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;`,
    sub_14: css`color: #393939;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;`,
    chart_width: 223,
    select_date: css`
        color: #393939;
        font-size: 14.497px;
        font-style: normal;
        cursor: pointer;
        font-weight: 700;
        line-height: normal;`,
    un_select_date: css`
        color: #8D8D8D;
        cursor: pointer;
        font-size: 14.497px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;`,
}
export const GlobalStyle=globalStyle

class GlobalStruct {
    //卡片結構
    static cardStructure(text: string, className: string, color: string, unit?: string, append?: string) {
        return html`
            <div class="bg-white rounded-3" style="padding:20px;">
                <div class="d-flex align-items-center justify-content-center w-100 mb-3">
                    <h4 class="header-title">${text}</h4>
                    <div class="flex-fill"></div>
                    ${unit ? BgWidget.grayNote(unit) : ''}
                </div>
                <div dir="ltr" class="mx-n2">
                    <div id="line-chart-zoomable" class="${className}" data-colors="${color}"
                         style="min-height:${globalStyle.chart_width}px;">
                        <div class="d-flex align-items-center w-100 flex-column ${className}-loading" style="gap:10px;">
                            <div class="spinner-border"></div>
                            載入中...
                        </div>
                    </div>
                </div>
                ${append || ''}
            </div>`;
    }

    //取得日期結構
    static getPastDays(numDays: number, with_date: boolean = true) {
        const days = [];
        const currentDate = new Date();

        for (let i = 0; i < numDays; i++) {
            const pastDate = new Date(currentDate);
            pastDate.setDate(currentDate.getDate() - i);
            const month = pastDate.getMonth() + 1; // 月份從0開始，所以要加1
            const day = pastDate.getDate();
            if (with_date) {
                const dateString = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
                days.unshift(dateString); // 將日期添加到陣列的開頭
            } else {
                days.unshift((day < 10 ? '0' : '') + day); // 將日期添加到陣列的開頭
            }

        }

        return days;
    }

    //去得月份結構
    static getPastMonths(numMonths: number): string[] {
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
}

export class DataAnalyzeModule {

    //銷售總額
    static salesAmount(gvc: GVC, option: {
        filter_date?: 'week' | 'year' | 'custom',
        come_from?: 'all' | 'website' | 'store',
        switch?: boolean
    } = {
        filter_date: 'week',
        come_from: 'all',
        switch: true
    }) {
        return gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID(),
                sum_id: gvc.glitter.getUUID(),
                list_id: gvc.glitter.getUUID(),
                sum: 0,
                sum_pos: 0,
                sum_web: 0,
                loading: true,
                select: option.filter_date
            }
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">總銷售額</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                switch (option.come_from) {
                                    case 'all':
                                        return `$${vm.sum.toLocaleString()}`
                                    case 'website':
                                        return `$${vm.sum_web.toLocaleString()}`
                                    case 'store':
                                        return `$${vm.sum_pos.toLocaleString()}`
                                }
                                return `$${vm.sum.toLocaleString()}`
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        }
                    })}
</div>`, vm.id, '#fa6767,#FFAC46', `
<div class="${!option.switch ? `d-none` : `d-flex`} align-items-center" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'week'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'year'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一月</div></div>
`, gvc.bindView(() => {
                        return {
                            bind: vm.list_id,
                            view: () => {
                                if (option.come_from !== 'all') {
                                    return ``
                                }
                                return [
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">官網銷售總額</div>
<div style="${globalStyle.sub_title}">$${vm.sum_web.toLocaleString()}</div>
</div>`,
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">門市銷售總額</div>
<div style="${globalStyle.sub_title}">$${vm.sum_pos.toLocaleString()}</div>
</div>`
                                ].join(`<div class="w-100 border-top my-2"></div>`)
                            },
                            divCreate: {}
                        }
                    }));
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze(
                            'sales_per_month_2_weak'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.sales_per_month_2_weak.countArray ?? []).slice(0, 7).reverse();
                                    const array_pos = (res.response.sales_per_month_2_weak.countArrayPos ?? []).slice(0, 7).reverse();
                                    const array_web = (res.response.sales_per_month_2_weak.countArrayWeb ?? []).slice(0, 7).reverse();
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_pos = array_pos.reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_web = array_web.reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: (() => {
                                                switch (option.come_from) {
                                                    case 'all':
                                                        return [
                                                            {
                                                                name: '官網銷售額',
                                                                data: array_web,
                                                            },
                                                            {
                                                                name: 'POS銷售額',
                                                                data: array_pos,
                                                            },
                                                        ]
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: 'POS銷售額',
                                                                data: array_pos,
                                                            }
                                                        ]
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網銷售額',
                                                                data: array_web,
                                                            }
                                                        ]
                                                }
                                            })(),
                                            title: {text: '', align: 'top'},
                                            xaxis: {categories: GlobalStruct.getPastDays(7)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    } else {
                        ApiShop.ecDataAnalyze(
                            'sales_per_month_1_year'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.sales_per_month_1_year.countArray ?? []).slice(0, 12).reverse();
                                    const array_pos = (res.response.sales_per_month_1_year.countArrayPos ?? []).slice(0, 12).reverse();
                                    const array_web = (res.response.sales_per_month_1_year.countArrayWeb ?? []).slice(0, 12).reverse();
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_pos = array_pos.reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_web = array_web.reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: (() => {
                                                switch (option.come_from) {
                                                    case 'all':
                                                        return [
                                                            {
                                                                name: '官網銷售額',
                                                                data: array_web,
                                                            },
                                                            {
                                                                name: 'POS銷售額',
                                                                data: array_pos,
                                                            },
                                                        ]
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: 'POS銷售額',
                                                                data: array_pos,
                                                            }
                                                        ]
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網銷售額',
                                                                data: array_web,
                                                            }
                                                        ]
                                                }
                                            })(),
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastMonths(12)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    }


                },
                divCreate: {
                    class: `w-100`,
                },
            };
        })
    }

    //訂單平均金額
    static orderAverage(gvc: GVC,option: {
        filter_date?: 'week' | 'year' | 'custom',
        come_from?: 'all' | 'website' | 'store',
        switch?: boolean
    } = {
        filter_date: 'week',
        come_from: 'all',
        switch: true
    }) {
        return gvc.bindView(() => {

            const vm = {
                id: gvc.glitter.getUUID(),
                sum_id: gvc.glitter.getUUID(),
                list_id: gvc.glitter.getUUID(),
                sum: 0,
                sum_pos: 0,
                sum_web: 0,
                loading: true,
                select: option.filter_date
            }
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">平均訂單金額</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                switch (option.come_from) {
                                    case 'all':
                                        return `$${vm.sum.toLocaleString()}`
                                    case 'website':
                                        return `$${vm.sum_web.toLocaleString()}`
                                    case 'store':
                                        return `$${vm.sum_pos.toLocaleString()}`
                                }
                                return `$${vm.sum.toLocaleString()}`
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        }
                    })}
</div>`, vm.id, '#507FC5,#FFAC46', `
<div class="${!option.switch ? `d-none` : `d-flex`} align-items-center" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'week'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'year'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一月</div></div>
`, gvc.bindView(() => {
                        return {
                            bind: vm.list_id,
                            view: () => {
                                if (option.come_from !== 'all') {
                                    return ``
                                }
                                return [
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">官網平均訂單金額</div>
<div style="${globalStyle.sub_title}">$${vm.sum_web.toLocaleString()}</div>
</div>`,
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">門市平均訂單金額</div>
<div style="${globalStyle.sub_title}">$${vm.sum_pos.toLocaleString()}</div>
</div>`
                                ].join(`<div class="w-100 border-top my-2"></div>`)
                            },
                            divCreate: {}
                        }
                    }));
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze(
                            'order_avg_sale_price'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.order_avg_sale_price.countArray ?? []).slice(0, 7).reverse();
                                    const array_pos = (res.response.order_avg_sale_price.countArrayPos ?? []).slice(0, 7).reverse();
                                    const array_web = (res.response.order_avg_sale_price.countArrayWeb ?? []).slice(0, 7).reverse();
                                    vm.sum = Math.floor(array.reduce((acc: any, val: any) => acc + val, 0) / 7);
                                    vm.sum_pos = Math.floor(array_pos.reduce((acc: any, val: any) => acc + val, 0) / 7);
                                    vm.sum_web = Math.floor(array_web.reduce((acc: any, val: any) => acc + val, 0) / 7);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                        series:(() => {
                                            switch (option.come_from) {
                                                case 'all':
                                                    return [
                                                        {
                                                            name: '官網平均銷售額',
                                                            data: array_web.map((dd: any) => {
                                                                return dd || 0
                                                            }),
                                                        },
                                                        {
                                                            name: 'POS平均銷售額',
                                                            data: array_pos.map((dd: any) => {
                                                                return dd || 0
                                                            }),
                                                        },
                                                    ]
                                                case 'store':
                                                    return [
                                                        {
                                                            name: 'POS平均銷售額',
                                                            data: array_pos.map((dd: any) => {
                                                                return dd || 0
                                                            }),
                                                        }
                                                    ]
                                                case 'website':
                                                    return [
                                                        {
                                                            name: '官網平均銷售額',
                                                            data: array_web.map((dd: any) => {
                                                                return dd || 0
                                                            }),
                                                        }
                                                    ]
                                            }
                                        })(),
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastDays(7)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    } else {
                        ApiShop.ecDataAnalyze(
                            'order_avg_sale_price_year'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.order_avg_sale_price_year.countArray ?? []).slice(0, 12).reverse();
                                    const array_pos = (res.response.order_avg_sale_price_year.countArrayPos ?? []).slice(0, 12).reverse();
                                    const array_web = (res.response.order_avg_sale_price_year.countArrayWeb ?? []).slice(0, 12).reverse();
                                    vm.sum = Math.floor(array.reduce((acc: any, val: any) => acc + val, 0) / 12);
                                    vm.sum_pos = Math.floor(array_pos.reduce((acc: any, val: any) => acc + val, 0) / 12);
                                    vm.sum_web = Math.floor(array_web.reduce((acc: any, val: any) => acc + val, 0) / 12);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series:(() => {
                                                switch (option.come_from) {
                                                    case 'all':
                                                        return [
                                                            {
                                                                name: '官網平均銷售額',
                                                                data: array_web.map((dd: any) => {
                                                                    return dd || 0
                                                                }),
                                                            },
                                                            {
                                                                name: 'POS平均銷售額',
                                                                data: array_pos.map((dd: any) => {
                                                                    return dd || 0
                                                                }),
                                                            },
                                                        ]
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: 'POS平均銷售額',
                                                                data: array_pos.map((dd: any) => {
                                                                    return dd || 0
                                                                }),
                                                            }
                                                        ]
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網平均銷售額',
                                                                data: array_web.map((dd: any) => {
                                                                    return dd || 0
                                                                }),
                                                            }
                                                        ]
                                                }
                                            })(),
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastMonths(12)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    }


                },
                divCreate: {
                    class: `w-100`,
                },
            };
        })
    }

    //訂單總量
    static orderAmount(gvc: GVC, option: {
        filter_date?: 'week' | 'year' | 'custom',
        come_from?: 'all' | 'website' | 'store',
        switch?: boolean
    } = {
        filter_date: 'week',
        come_from: 'all',
        switch: true
    }) {
        return gvc.bindView(() => {

            const vm = {
                id: gvc.glitter.getUUID(),
                sum_id: gvc.glitter.getUUID(),
                list_id: gvc.glitter.getUUID(),
                sum: 0,
                sum_pos: 0,
                sum_web: 0,
                loading: true,
                select: option.filter_date
            }
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">總訂單量</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                switch (option.come_from) {
                                    case 'all':
                                        return `${vm.sum.toLocaleString()}`
                                    case 'website':
                                        return `${vm.sum_web.toLocaleString()}`
                                    case 'store':
                                        return `${vm.sum_pos.toLocaleString()}`
                                }
                                return `${vm.sum.toLocaleString()}`
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        }
                    })}
</div>`, vm.id, '#ffbc00,#FA6767', `
<div class="d-flex align-items-center ${!option.switch ? `d-none` : `d-flex`}" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'week'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'year'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一月</div></div>
`, gvc.bindView(() => {
                        return {
                            bind: vm.list_id,
                            view: () => {
                                if (option.come_from !== 'all') {
                                    return ``
                                }
                                return [
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">官網總訂單量</div>
<div style="${globalStyle.sub_title}">${vm.sum_web.toLocaleString()}</div>
</div>`,
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">門市總訂單量</div>
<div style="${globalStyle.sub_title}">${vm.sum_pos.toLocaleString()}</div>
</div>`
                                ].join(`<div class="w-100 border-top my-2"></div>`)
                            },
                            divCreate: {}
                        }
                    }));
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze(
                            'orders_per_month_2_weak'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.orders_per_month_2_weak.countArray ?? []).slice(0, 7).reverse();
                                    const array_pos = (res.response.orders_per_month_2_weak.countArrayPos ?? []).slice(0, 7).reverse();
                                    const array_web = (res.response.orders_per_month_2_weak.countArrayWeb ?? []).slice(0, 7).reverse();
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_pos = array_pos.reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_web =array_web.reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: (() => {
                                                switch (option.come_from) {
                                                    case 'all':
                                                        return [
                                                            {
                                                                name: '官網訂單數',
                                                                data: array_web,
                                                            },
                                                            {
                                                                name: 'POS訂單數',
                                                                data: array_pos,
                                                            },
                                                        ]
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: 'POS訂單數',
                                                                data: array_pos,
                                                            }
                                                        ]
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網訂單數',
                                                                data: array_web,
                                                            }
                                                        ]
                                                }
                                            })(),
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastDays(7)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    } else {
                        ApiShop.ecDataAnalyze(
                            'orders_per_month_1_year'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.orders_per_month_1_year.countArray ?? []).slice(0, 12).reverse();
                                    const array_pos = (res.response.orders_per_month_1_year.countArrayPos ?? []).slice(0, 12).reverse();
                                    const array_web = (res.response.orders_per_month_1_year.countArrayWeb ?? []).slice(0, 12).reverse();
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_pos = array_pos.reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_web =array_web.reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: (() => {
                                                switch (option.come_from) {
                                                    case 'all':
                                                        return [
                                                            {
                                                                name: '官網訂單數',
                                                                data: array_web,
                                                            },
                                                            {
                                                                name: 'POS訂單數',
                                                                data: array_pos,
                                                            },
                                                        ]
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: 'POS訂單數',
                                                                data: array_pos,
                                                            }
                                                        ]
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網訂單數',
                                                                data: array_web,
                                                            }
                                                        ]
                                                }
                                            })(),
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastMonths(12)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    }


                },
                divCreate: {
                    class: `w-100`,
                },
            };
        })
    }

    //瀏覽人數
    static viewPeople(gvc: GVC) {
        return gvc.bindView(() => {

            const vm = {
                id: gvc.glitter.getUUID(),
                sum_id: gvc.glitter.getUUID(),
                list_id: gvc.glitter.getUUID(),
                sum: 0,
                sum_pos: 0,
                sum_web: 0,
                loading: true,
                select: 'week'
            }
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">瀏覽人數</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `${vm.sum.toLocaleString()}`
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        }
                    })}
</div>`, vm.id, '#39afd1', `
<div class="d-flex align-items-center" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'week'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'year'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一月</div></div>
`);
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze(
                            'active_recent_2weak'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.active_recent_2weak.count_array ?? []).reverse().slice(0, 7).reverse();
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '瀏覽量',
                                                    data: array,
                                                },
                                            ],
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastDays(7)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    } else {
                        ApiShop.ecDataAnalyze(
                            'active_recent_year'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.active_recent_year.count_array ?? []).reverse().slice(0, 12).reverse();
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '瀏覽量',
                                                    data: array,
                                                },
                                            ],
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastMonths(12)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    }


                },
                divCreate: {
                    class: `w-100`,
                },
            };
        })
    }

    //註冊人數
    static registerPeople(gvc: GVC) {
        return gvc.bindView(() => {

            const vm = {
                id: gvc.glitter.getUUID(),
                sum_id: gvc.glitter.getUUID(),
                list_id: gvc.glitter.getUUID(),
                sum: 0,
                sum_pos: 0,
                sum_web: 0,
                loading: true,
                select: 'week'
            }
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">註冊數</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `${vm.sum.toLocaleString()}`
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        }
                    })}
</div>`, vm.id, '#ff6c02', `
<div class="d-flex align-items-center" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'week'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'year'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一月</div></div>
`);
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze(
                            'recent_register'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.recent_register.count_2_weak_register ?? []).reverse().slice(0, 7).reverse();
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '註冊量',
                                                    data: array,
                                                },
                                            ],
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastDays(7)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    } else {
                        ApiShop.ecDataAnalyze(
                            'recent_register'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.recent_register.count_register ?? []).reverse().slice(0, 12).reverse();
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '註冊數',
                                                    data: array,
                                                },
                                            ],
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastMonths(12)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    }


                },
                divCreate: {
                    class: `w-100`,
                },
            };
        })
    }

    //轉換率
    static transferRatio(gvc: GVC) {
        return gvc.bindView(() => {

            const vm = {
                id: gvc.glitter.getUUID(),
                sum_id: gvc.glitter.getUUID(),
                list_id: gvc.glitter.getUUID(),
                sum: 0,
                sum_pos: 0,
                sum_web: 0,
                loading: true,
                select: 'week'
            }
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">轉換率</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `${0}%`
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        }
                    })}
</div>`, vm.id, '#ffbc00', `
<div class="d-flex align-items-center" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'week'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${
                        gvc.event(() => {
                            vm.select = 'year'
                            gvc.notifyDataChange(vm.id)
                        })
                    }">一月</div></div>
`);
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze(
                            'recent_register'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = [0, 0, 0, 0, 0, 0, 0];
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '轉換率',
                                                    data: array,
                                                },
                                            ],
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastDays(7)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    } else {
                        ApiShop.ecDataAnalyze(
                            'recent_register'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '轉換率',
                                                    data: array,
                                                },
                                            ],
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastMonths(12)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    }


                },
                divCreate: {
                    class: `w-100`,
                },
            };
        })
    }
}

export class DataAnalyzeModuleCart {
    //Filter
    static filterCart(gvc: GVC, option: {
        filter_date: 'week' | 'year' | 'custom',
        come_from: 'all' | 'website' | 'store'
    }, callback: () => void) {

        return BgWidget.card(gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return html`
                        <div style="${globalStyle.header_title}">報表篩選條件</div>
                        <div class="d-flex flex-wrap align-items-end" style="margin-top:18px;gap:18px;">
                            <div class="d-flex flex-column">
                                <div>銷售平台</div>
                                ${BgWidget.select({
                                    gvc: gvc,
                                    default: option.come_from,
                                    callback: (key) => {
                                        option.come_from = key
                                        callback()
                                    },
                                    options: [
                                        {key: 'all', value: "官網及門市"},
                                        {key: 'website', value: "官網"},
                                        {key: 'store', value: "門市"}
                                    ],
                                    style: 'margin: 8px 0;',
                                })}
                            </div>
                            <div class="d-flex flex-column">
                                <div>統計時間</div>
                                ${BgWidget.select({
                                    gvc: gvc,
                                    default: option.filter_date,
                                    callback: (key) => {
                                        option.filter_date = key
                                        callback()
                                    },
                                    options: [
                                        {key: 'week', value: "近7日"},
                                        {key: 'year', value: "近12個月"},
                                        // {key: 'custom', value: "自訂日期區間"}
                                    ],
                                    style: 'margin: 8px 0;',
                                })}
                            </div>
                        </div>
                    `
                },
                divCreate: {}
            }
        }))
    }
    static filterCartV2(gvc: GVC, option: {
        filter_date: 'week' | 'year' | 'custom' | 'today',
        come_from: 'all' | 'website' | 'store'
    }, callback: () => void) {

        return BgWidget.card(gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return html`
                        <div style="${globalStyle.header_title}">報表篩選條件</div>
                        <div class="d-flex flex-wrap align-items-end" style="margin-top:18px;gap:18px;">
                            <div class="d-flex flex-column">
                                <div>銷售平台</div>
                                ${BgWidget.select({
                        gvc: gvc,
                        default: option.come_from,
                        callback: (key) => {
                            option.come_from = key
                            callback()
                        },
                        options: [
                            {key: 'all', value: "官網及門市"},
                            {key: 'website', value: "官網"},
                            {key: 'store', value: "所有門市"}
                        ],
                        style: 'margin: 8px 0;',
                    })}
                            </div>
                            <div class="d-flex flex-column">
                                <div>統計時間</div>
                                ${BgWidget.select({
                        gvc: gvc,
                        default: option.filter_date,
                        callback: (key) => {
                            option.filter_date = key
                            callback()
                        },
                        options: [
                            {key: 'today', value: "今日"},
                            {key: 'week', value: "近七日"},
                            {key: 'year', value: "近12個月"},
                            // {key: 'custom', value: "自訂日期區間"}
                        ],
                        style: 'margin: 8px 0;',
                    })}
                            </div>
                        </div>
                    `
                },
                divCreate: {}
            }
        }))
    }

    //銷售總額
    static salesAmount(gvc: GVC) {
        return gvc.bindView(() => {

            const vm = {
                id: gvc.glitter.getUUID(),
                sum_id: gvc.glitter.getUUID(),
                list_id: gvc.glitter.getUUID(),
                sum: 0,
                sum_pos: 0,
                sum_web: 0,
                loading: true,
                select: 'week'
            }
            return {
                bind: vm.id,
                view: () => {
                    return html`
                        <div class="d-flex align-items-center w-100">
                            <div class="d-flex flex-column">
                                <div style="${globalStyle.sub_14}">總銷售額</div>
                                <div style="${globalStyle.sub_title}">$47,400</div>
                            </div>
                            <div class="flex-fill"></div>
                        </div>
                    `
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze(
                            'sales_per_month_2_weak'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.sales_per_month_2_weak.countArray ?? []).slice(0, 7).reverse();
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_pos = (res.response.sales_per_month_2_weak.countArrayPos ?? []).slice(0, 7).reverse().reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_web = (res.response.sales_per_month_2_weak.countArrayWeb ?? []).slice(0, 7).reverse().reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '銷售額',
                                                    data: array,
                                                },
                                            ],
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastDays(7)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    } else {
                        ApiShop.ecDataAnalyze(
                            'sales_per_month_1_year'.split(
                                ','
                            )
                        ).then((res) => {
                            function loop() {
                                if ((window as any).ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = (res.response.sales_per_month_1_year.countArray ?? []).slice(0, 12).reverse();
                                    vm.sum = array.reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_pos = (res.response.sales_per_month_1_year.countArrayPos ?? []).slice(0, 12).reverse().reduce((acc: any, val: any) => acc + val, 0);
                                    vm.sum_web = (res.response.sales_per_month_1_year.countArrayWeb ?? []).slice(0, 12).reverse().reduce((acc: any, val: any) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id])
                                    const options = {
                                            chart: {height: globalStyle.chart_width, type: 'area', zoom: {enabled: !1}},
                                            dataLabels: {enabled: false},
                                            stroke: {width: 3, curve: 'smooth'},
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '銷售額',
                                                    data: array,
                                                },
                                            ],
                                            title: {text: '', align: 'center'},
                                            xaxis: {categories: GlobalStruct.getPastMonths(12)},
                                            yaxis: {opposite: !1},
                                            legend: {horizontalAlign: 'left'},
                                            grid: {borderColor: '#f1f3fa'},
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: {chart: {toolbar: {show: false}}, legend: {show: false}},
                                                },
                                            ],
                                        },
                                        //@ts-ignore
                                        chart = new window.ApexCharts(document.querySelector(class_name), options);
                                    document.querySelector(class_name + '-loading')!.remove()
                                    chart.render();
                                } else {
                                    setTimeout(() => {
                                        loop()
                                    }, 100)
                                }
                            }

                            loop()
                        })
                    }


                },
                divCreate: {
                    class: `w-100`,
                },
            };
        })
    }
}
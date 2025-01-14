import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { StockStores } from './stock-stores.js';
const html = String.raw;
const css = String.raw;
const globalStyle = {
    header_title: `
        color: #393939;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    `,
    sub_title: `
        color: #393939;
        font-size: 24px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    `,
    sub_14: `
        color: #393939;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    `,
    chart_width: 223,
    select_date: `
        color: #393939;
        font-size: 14.497px;
        font-style: normal;
        cursor: pointer;
        font-weight: 700;
        line-height: normal;
    `,
    un_select_date: `
        color: #8d8d8d;
        cursor: pointer;
        font-size: 14.497px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    `,
};
export const GlobalStyle = globalStyle;
class GlobalStruct {
    static cardStructure(text, className, color, unit, append) {
        return html ` <div class="bg-white rounded-3" style="padding:20px;">
            <div class="d-flex align-items-center justify-content-center w-100 mb-3">
                <h4 class="header-title">${text}</h4>
                <div class="flex-fill"></div>
                ${unit ? BgWidget.grayNote(unit) : ''}
            </div>
            <div dir="ltr" class="mx-n2">
                <div id="line-chart-zoomable" class="${className}" data-colors="${color}" style="min-height:${globalStyle.chart_width}px;">
                    <div class="d-flex align-items-center w-100 flex-column ${className}-loading" style="gap:10px;">
                        <div class="spinner-border"></div>
                        載入中...
                    </div>
                </div>
            </div>
            ${append || ''}
        </div>`;
    }
    static getPastDays(numDays, with_date = true, startDate) {
        const days = [];
        const currentDate = startDate ? new Date(startDate) : new Date();
        for (let i = 0; i < numDays; i++) {
            const pastDate = new Date(currentDate);
            pastDate.setDate(currentDate.getDate() - i);
            const month = pastDate.getMonth() + 1;
            const day = pastDate.getDate();
            if (with_date) {
                const dateString = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
                days.unshift(dateString);
            }
            else {
                days.unshift((day < 10 ? '0' : '') + day);
            }
        }
        return days;
    }
    static getPastMonths(numMonths) {
        const months = [];
        const currentDate = new Date();
        let year = currentDate.getFullYear() - 2000;
        let month = currentDate.getMonth() + 2;
        for (let i = 0; i < numMonths; i++) {
            month--;
            if (month === 0) {
                year--;
                month = 12;
            }
            const formattedMonth = `${year}.${month.toString().padStart(2, '0')}`;
            months.unshift(formattedMonth);
        }
        return months;
    }
}
export class DataAnalyzeModule {
    static salesAmount(gvc, option = {
        filter_date: 'week',
        come_from: 'all',
        switch: true,
        startDate: '',
        endDate: '',
    }) {
        return gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID(),
                sum_id: gvc.glitter.getUUID(),
                list_id: gvc.glitter.getUUID(),
                sum: 0,
                sum_pos: 0,
                sum_web: 0,
                sum_store: 0,
                loading: true,
                select: option.filter_date,
                startDate: option.startDate,
                endDate: option.endDate,
            };
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(html `<div class="d-flex flex-column">
                            <div style="${globalStyle.header_title}">總銷售額</div>
                            ${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                switch (option.come_from) {
                                    case 'all':
                                        return `$${vm.sum.toLocaleString()}`;
                                    case 'website':
                                        return `$${vm.sum_web.toLocaleString()}`;
                                    case 'store':
                                        return `$${vm.sum_pos.toLocaleString()}`;
                                    default:
                                        return `$${vm.sum_store.toLocaleString()}`;
                                }
                            },
                            divCreate: {
                                style: globalStyle.sub_title,
                            },
                        };
                    })}
                        </div>`, vm.id, '#fa6767,#FFAC46', html `
                            <div class="${!option.switch ? `d-none` : `d-flex`} align-items-center" style="gap:5px;">
                                <div
                                    style="${vm.select === 'week' ? globalStyle.select_date : globalStyle.un_select_date}"
                                    onclick="${gvc.event(() => {
                        vm.select = 'week';
                        gvc.notifyDataChange(vm.id);
                    })}"
                                >
                                    一週
                                </div>
                                /
                                <div
                                    style="${vm.select !== 'week' ? globalStyle.select_date : globalStyle.un_select_date}"
                                    onclick="${gvc.event(() => {
                        vm.select = 'year';
                        gvc.notifyDataChange(vm.id);
                    })}"
                                >
                                    一月
                                </div>
                            </div>
                        `, gvc.bindView(() => {
                        return {
                            bind: vm.list_id,
                            view: () => {
                                if (option.come_from !== 'all') {
                                    return ``;
                                }
                                return [
                                    html `<div class="d-flex flex-column">
                                            <div style="${globalStyle.sub_14}">官網銷售總額</div>
                                            <div style="${globalStyle.sub_title}">$${vm.sum_web.toLocaleString()}</div>
                                        </div>`,
                                    html `<div class="d-flex flex-column">
                                            <div style="${globalStyle.sub_14}">門市銷售總額</div>
                                            <div style="${globalStyle.sub_title}">$${vm.sum_pos.toLocaleString()}</div>
                                        </div>`,
                                ].join(`<div class="w-100 border-top my-2"></div>`);
                            },
                            divCreate: {},
                        };
                    }));
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    const queryJsonString = () => {
                        return JSON.stringify({
                            come_from: option.come_from,
                            start: vm.startDate ? new Date(vm.startDate).toISOString() : '',
                            end: vm.startDate ? new Date(vm.endDate).toISOString() : '',
                        });
                    };
                    switch (vm.select) {
                        case 'custom':
                            ApiShop.ecDataAnalyze(['sales_per_month_custom'], queryJsonString()).then((res) => {
                                const startDateObj = new Date(vm.startDate);
                                const endDateObj = new Date(vm.endDate);
                                const diffDays = diffDates(startDateObj, endDateObj);
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.sales_per_month_custom.countArray) !== null && _a !== void 0 ? _a : []).reverse();
                                        const array_pos = ((_b = res.response.sales_per_month_custom.countArrayPos) !== null && _b !== void 0 ? _b : []).reverse();
                                        const array_web = ((_c = res.response.sales_per_month_custom.countArrayWeb) !== null && _c !== void 0 ? _c : []).reverse();
                                        const array_store = ((_d = res.response.sales_per_month_custom.countArrayStore) !== null && _d !== void 0 ? _d : []).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        vm.sum_pos = array_pos.reduce((acc, val) => acc + val, 0);
                                        vm.sum_web = array_web.reduce((acc, val) => acc + val, 0);
                                        vm.sum_store = array_store.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
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
                                                                name: '門市銷售額',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市銷售額',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網銷售額',
                                                                data: array_web,
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市銷售額',
                                                                data: array_store,
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'top' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(diffDays, true, vm.endDate),
                                                labels: {
                                                    show: diffDays < 15,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'week':
                            ApiShop.ecDataAnalyze(['sales_per_month_2_week'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.sales_per_month_2_week.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 7).reverse();
                                        const array_pos = ((_b = res.response.sales_per_month_2_week.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 7).reverse();
                                        const array_web = ((_c = res.response.sales_per_month_2_week.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 7).reverse();
                                        const array_store = ((_d = res.response.sales_per_month_2_week.countArrayStore) !== null && _d !== void 0 ? _d : []).slice(0, 7).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        vm.sum_pos = array_pos.reduce((acc, val) => acc + val, 0);
                                        vm.sum_web = array_web.reduce((acc, val) => acc + val, 0);
                                        vm.sum_store = array_store.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
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
                                                                name: '門市銷售額',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市銷售額',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網銷售額',
                                                                data: array_web,
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市銷售額',
                                                                data: array_store,
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'top' },
                                            xaxis: { categories: GlobalStruct.getPastDays(7) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'year':
                            ApiShop.ecDataAnalyze(['sales_per_month_1_year'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.sales_per_month_1_year.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 12).reverse();
                                        const array_pos = ((_b = res.response.sales_per_month_1_year.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 12).reverse();
                                        const array_web = ((_c = res.response.sales_per_month_1_year.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 12).reverse();
                                        const array_store = ((_d = res.response.sales_per_month_1_year.countArrayStore) !== null && _d !== void 0 ? _d : []).slice(0, 12).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        vm.sum_pos = array_pos.reduce((acc, val) => acc + val, 0);
                                        vm.sum_web = array_web.reduce((acc, val) => acc + val, 0);
                                        vm.sum_store = array_store.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
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
                                                                name: '門市銷售額',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市銷售額',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網銷售額',
                                                                data: array_web,
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市銷售額',
                                                                data: array_store,
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'center' },
                                            xaxis: { categories: GlobalStruct.getPastMonths(12) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case '1m':
                            ApiShop.ecDataAnalyze(['sales_per_month_1_month'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.sales_per_month_1_month.countArray) !== null && _a !== void 0 ? _a : []).reverse();
                                        const array_pos = ((_b = res.response.sales_per_month_1_month.countArrayPos) !== null && _b !== void 0 ? _b : []).reverse();
                                        const array_web = ((_c = res.response.sales_per_month_1_month.countArrayWeb) !== null && _c !== void 0 ? _c : []).reverse();
                                        const array_store = ((_d = res.response.sales_per_month_1_month.countArrayStore) !== null && _d !== void 0 ? _d : []).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        vm.sum_pos = array_pos.reduce((acc, val) => acc + val, 0);
                                        vm.sum_web = array_web.reduce((acc, val) => acc + val, 0);
                                        vm.sum_store = array_store.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
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
                                                                name: '門市銷售額',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市銷售額',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網銷售額',
                                                                data: array_web,
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市銷售額',
                                                                data: array_store,
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'top' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(30),
                                                labels: {
                                                    show: false,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        const si = setInterval(() => {
                                            const loadHTML = document.querySelector(class_name + '-loading');
                                            if (loadHTML) {
                                                clearInterval(si);
                                                loadHTML.remove();
                                                chart.render();
                                            }
                                        }, 500);
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static orderAverage(gvc, option = {
        filter_date: 'week',
        come_from: 'all',
        switch: true,
        startDate: '',
        endDate: '',
    }) {
        return gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID(),
                sum_id: gvc.glitter.getUUID(),
                list_id: gvc.glitter.getUUID(),
                sum: 0,
                sum_pos: 0,
                sum_web: 0,
                sum_store: 0,
                loading: true,
                select: option.filter_date,
                startDate: option.startDate,
                endDate: option.endDate,
            };
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(html `<div class="d-flex flex-column">
                            <div style="${globalStyle.header_title}">平均訂單金額</div>
                            ${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                switch (option.come_from) {
                                    case 'all':
                                        return `$${vm.sum.toLocaleString()}`;
                                    case 'website':
                                        return `$${vm.sum_web.toLocaleString()}`;
                                    case 'store':
                                        return `$${vm.sum_pos.toLocaleString()}`;
                                    default:
                                        return `$${vm.sum_store.toLocaleString()}`;
                                }
                            },
                            divCreate: {
                                style: globalStyle.sub_title,
                            },
                        };
                    })}
                        </div>`, vm.id, '#fa6767,#FFAC46', html `
                            <div class="${!option.switch ? `d-none` : `d-flex`} align-items-center" style="gap:5px;">
                                <div
                                    style="${vm.select === 'week' ? globalStyle.select_date : globalStyle.un_select_date}"
                                    onclick="${gvc.event(() => {
                        vm.select = 'week';
                        gvc.notifyDataChange(vm.id);
                    })}"
                                >
                                    一週
                                </div>
                                /
                                <div
                                    style="${vm.select !== 'week' ? globalStyle.select_date : globalStyle.un_select_date}"
                                    onclick="${gvc.event(() => {
                        vm.select = 'year';
                        gvc.notifyDataChange(vm.id);
                    })}"
                                >
                                    一月
                                </div>
                            </div>
                        `, gvc.bindView(() => {
                        return {
                            bind: vm.list_id,
                            view: () => {
                                if (option.come_from !== 'all') {
                                    return ``;
                                }
                                return [
                                    html `<div class="d-flex flex-column">
                                            <div style="${globalStyle.sub_14}">官網平均訂單金額</div>
                                            <div style="${globalStyle.sub_title}">$${vm.sum_web.toLocaleString()}</div>
                                        </div>`,
                                    html `<div class="d-flex flex-column">
                                            <div style="${globalStyle.sub_14}">門市平均訂單金額</div>
                                            <div style="${globalStyle.sub_title}">$${vm.sum_pos.toLocaleString()}</div>
                                        </div>`,
                                ].join(`<div class="w-100 border-top my-2"></div>`);
                            },
                            divCreate: {},
                        };
                    }));
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    const queryJsonString = () => {
                        return JSON.stringify({
                            come_from: option.come_from,
                            start: vm.startDate ? new Date(vm.startDate).toISOString() : '',
                            end: vm.startDate ? new Date(vm.endDate).toISOString() : '',
                        });
                    };
                    switch (vm.select) {
                        case 'custom':
                            ApiShop.ecDataAnalyze(['order_avg_sale_price_custom'], queryJsonString()).then((res) => {
                                const startDateObj = new Date(vm.startDate);
                                const endDateObj = new Date(vm.endDate);
                                const diffDays = diffDates(startDateObj, endDateObj);
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.order_avg_sale_price_custom.countArray) !== null && _a !== void 0 ? _a : []).reverse();
                                        const array_pos = ((_b = res.response.order_avg_sale_price_custom.countArrayPos) !== null && _b !== void 0 ? _b : []).reverse();
                                        const array_web = ((_c = res.response.order_avg_sale_price_custom.countArrayWeb) !== null && _c !== void 0 ? _c : []).reverse();
                                        const array_store = ((_d = res.response.order_avg_sale_price_custom.countArrayStore) !== null && _d !== void 0 ? _d : []).reverse();
                                        vm.sum = Math.floor(array.reduce((acc, val) => acc + val, 0) / diffDays);
                                        vm.sum_pos = Math.floor(array_pos.reduce((acc, val) => acc + val, 0) / diffDays);
                                        vm.sum_web = Math.floor(array_web.reduce((acc, val) => acc + val, 0) / diffDays);
                                        vm.sum_store = Math.floor(array_store.reduce((acc, val) => acc + val, 0) / diffDays);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: (() => {
                                                switch (option.come_from) {
                                                    case 'all':
                                                        return [
                                                            {
                                                                name: '官網平均銷售額',
                                                                data: array_web.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_pos.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_pos.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網平均銷售額',
                                                                data: array_web.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_store.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'center' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(diffDays, true, vm.endDate),
                                                labels: {
                                                    show: diffDays < 15,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'week':
                            ApiShop.ecDataAnalyze(['order_avg_sale_price'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.order_avg_sale_price.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 7).reverse();
                                        const array_pos = ((_b = res.response.order_avg_sale_price.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 7).reverse();
                                        const array_web = ((_c = res.response.order_avg_sale_price.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 7).reverse();
                                        const array_store = ((_d = res.response.order_avg_sale_price.countArrayStore) !== null && _d !== void 0 ? _d : []).slice(0, 7).reverse();
                                        vm.sum = Math.floor(array.reduce((acc, val) => acc + val, 0) / 7);
                                        vm.sum_pos = Math.floor(array_pos.reduce((acc, val) => acc + val, 0) / 7);
                                        vm.sum_web = Math.floor(array_web.reduce((acc, val) => acc + val, 0) / 7);
                                        vm.sum_store = Math.floor(array_store.reduce((acc, val) => acc + val, 0) / 7);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: (() => {
                                                switch (option.come_from) {
                                                    case 'all':
                                                        return [
                                                            {
                                                                name: '官網平均銷售額',
                                                                data: array_web.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_pos.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_pos.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網平均銷售額',
                                                                data: array_web.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_store.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'center' },
                                            xaxis: { categories: GlobalStruct.getPastDays(7) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'year':
                            ApiShop.ecDataAnalyze(['order_avg_sale_price_year'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.order_avg_sale_price_year.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 12).reverse();
                                        const array_pos = ((_b = res.response.order_avg_sale_price_year.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 12).reverse();
                                        const array_web = ((_c = res.response.order_avg_sale_price_year.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 12).reverse();
                                        const array_store = ((_d = res.response.order_avg_sale_price_year.countArrayStore) !== null && _d !== void 0 ? _d : []).slice(0, 12).reverse();
                                        vm.sum = Math.floor(array.reduce((acc, val) => acc + val, 0) / 12);
                                        vm.sum_pos = Math.floor(array_pos.reduce((acc, val) => acc + val, 0) / 12);
                                        vm.sum_web = Math.floor(array_web.reduce((acc, val) => acc + val, 0) / 12);
                                        vm.sum_store = Math.floor(array_store.reduce((acc, val) => acc + val, 0) / 12);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: (() => {
                                                switch (option.come_from) {
                                                    case 'all':
                                                        return [
                                                            {
                                                                name: '官網平均銷售額',
                                                                data: array_web.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_pos.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_pos.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網平均銷售額',
                                                                data: array_web.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_store.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'center' },
                                            xaxis: { categories: GlobalStruct.getPastMonths(12) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case '1m':
                            ApiShop.ecDataAnalyze(['order_avg_sale_price_month'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        const diffDays = 30;
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.order_avg_sale_price_month.countArray) !== null && _a !== void 0 ? _a : []).reverse();
                                        const array_pos = ((_b = res.response.order_avg_sale_price_month.countArrayPos) !== null && _b !== void 0 ? _b : []).reverse();
                                        const array_web = ((_c = res.response.order_avg_sale_price_month.countArrayWeb) !== null && _c !== void 0 ? _c : []).reverse();
                                        const array_store = ((_d = res.response.order_avg_sale_price_month.countArrayStore) !== null && _d !== void 0 ? _d : []).reverse();
                                        vm.sum = Math.floor(array.reduce((acc, val) => acc + val, 0) / diffDays);
                                        vm.sum_pos = Math.floor(array_pos.reduce((acc, val) => acc + val, 0) / diffDays);
                                        vm.sum_web = Math.floor(array_web.reduce((acc, val) => acc + val, 0) / diffDays);
                                        vm.sum_store = Math.floor(array_store.reduce((acc, val) => acc + val, 0) / diffDays);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: (() => {
                                                switch (option.come_from) {
                                                    case 'all':
                                                        return [
                                                            {
                                                                name: '官網平均銷售額',
                                                                data: array_web.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_pos.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_pos.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網平均銷售額',
                                                                data: array_web.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市平均銷售額',
                                                                data: array_store.map((dd) => {
                                                                    return dd || 0;
                                                                }),
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'center' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(diffDays),
                                                labels: {
                                                    show: diffDays < 15,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static orderAmount(gvc, option = {
        filter_date: 'week',
        come_from: 'all',
        switch: true,
        startDate: '',
        endDate: '',
    }) {
        return gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID(),
                sum_id: gvc.glitter.getUUID(),
                list_id: gvc.glitter.getUUID(),
                sum: 0,
                sum_pos: 0,
                sum_web: 0,
                sum_store: 0,
                loading: true,
                select: option.filter_date,
                startDate: option.startDate,
                endDate: option.endDate,
            };
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(html `<div class="d-flex flex-column">
                            <div style="${globalStyle.header_title}">總訂單量</div>
                            ${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                switch (option.come_from) {
                                    case 'all':
                                        return `${vm.sum.toLocaleString()}`;
                                    case 'website':
                                        return `${vm.sum_web.toLocaleString()}`;
                                    case 'store':
                                        return `${vm.sum_pos.toLocaleString()}`;
                                    default:
                                        return `${vm.sum_store.toLocaleString()}`;
                                }
                            },
                            divCreate: {
                                style: globalStyle.sub_title,
                            },
                        };
                    })}
                        </div>`, vm.id, '#fa6767,#FFAC46', html `
                            <div class="d-flex align-items-center ${!option.switch ? `d-none` : `d-flex`}" style="gap:5px;">
                                <div
                                    style="${vm.select === 'week' ? globalStyle.select_date : globalStyle.un_select_date}"
                                    onclick="${gvc.event(() => {
                        vm.select = 'week';
                        gvc.notifyDataChange(vm.id);
                    })}"
                                >
                                    一週
                                </div>
                                /
                                <div
                                    style="${vm.select !== 'week' ? globalStyle.select_date : globalStyle.un_select_date}"
                                    onclick="${gvc.event(() => {
                        vm.select = 'year';
                        gvc.notifyDataChange(vm.id);
                    })}"
                                >
                                    一月
                                </div>
                            </div>
                        `, gvc.bindView(() => {
                        return {
                            bind: vm.list_id,
                            view: () => {
                                if (option.come_from !== 'all') {
                                    return ``;
                                }
                                return [
                                    html `<div class="d-flex flex-column">
                                            <div style="${globalStyle.sub_14}">官網總訂單量</div>
                                            <div style="${globalStyle.sub_title}">${vm.sum_web.toLocaleString()}</div>
                                        </div>`,
                                    html `<div class="d-flex flex-column">
                                            <div style="${globalStyle.sub_14}">門市總訂單量</div>
                                            <div style="${globalStyle.sub_title}">${vm.sum_pos.toLocaleString()}</div>
                                        </div>`,
                                ].join(`<div class="w-100 border-top my-2"></div>`);
                            },
                            divCreate: {},
                        };
                    }));
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    const queryJsonString = () => {
                        return JSON.stringify({
                            come_from: option.come_from,
                            start: vm.startDate ? new Date(vm.startDate).toISOString() : '',
                            end: vm.startDate ? new Date(vm.endDate).toISOString() : '',
                        });
                    };
                    switch (vm.select) {
                        case 'week':
                            ApiShop.ecDataAnalyze(['orders_per_month_2_week'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.orders_per_month_2_week.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 7).reverse();
                                        const array_pos = ((_b = res.response.orders_per_month_2_week.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 7).reverse();
                                        const array_web = ((_c = res.response.orders_per_month_2_week.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 7).reverse();
                                        const array_store = ((_d = res.response.orders_per_month_2_week.countArrayStore) !== null && _d !== void 0 ? _d : []).slice(0, 7).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        vm.sum_pos = array_pos.reduce((acc, val) => acc + val, 0);
                                        vm.sum_web = array_web.reduce((acc, val) => acc + val, 0);
                                        vm.sum_store = array_store.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
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
                                                                name: '門市訂單數',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市訂單數',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網訂單數',
                                                                data: array_web,
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市訂單數',
                                                                data: array_store,
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'center' },
                                            xaxis: { categories: GlobalStruct.getPastDays(7) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'year':
                            ApiShop.ecDataAnalyze(['orders_per_month_1_year'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.orders_per_month_1_year.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 12).reverse();
                                        const array_pos = ((_b = res.response.orders_per_month_1_year.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 12).reverse();
                                        const array_web = ((_c = res.response.orders_per_month_1_year.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 12).reverse();
                                        const array_store = ((_d = res.response.orders_per_month_1_year.countArrayStore) !== null && _d !== void 0 ? _d : []).slice(0, 12).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        vm.sum_pos = array_pos.reduce((acc, val) => acc + val, 0);
                                        vm.sum_web = array_web.reduce((acc, val) => acc + val, 0);
                                        vm.sum_store = array_store.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
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
                                                                name: '門市訂單數',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市訂單數',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網訂單數',
                                                                data: array_web,
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市訂單數',
                                                                data: array_store,
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'center' },
                                            xaxis: { categories: GlobalStruct.getPastMonths(12) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case '1m':
                            ApiShop.ecDataAnalyze(['orders_per_month'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.orders_per_month.countArray) !== null && _a !== void 0 ? _a : []).reverse();
                                        const array_pos = ((_b = res.response.orders_per_month.countArrayPos) !== null && _b !== void 0 ? _b : []).reverse();
                                        const array_web = ((_c = res.response.orders_per_month.countArrayWeb) !== null && _c !== void 0 ? _c : []).reverse();
                                        const array_store = ((_d = res.response.orders_per_month.countArrayStore) !== null && _d !== void 0 ? _d : []).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        vm.sum_pos = array_pos.reduce((acc, val) => acc + val, 0);
                                        vm.sum_web = array_web.reduce((acc, val) => acc + val, 0);
                                        vm.sum_store = array_store.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
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
                                                                name: '門市訂單數',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市訂單數',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網訂單數',
                                                                data: array_web,
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市訂單數',
                                                                data: array_store,
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'center' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(30),
                                                labels: {
                                                    show: false,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'custom':
                            ApiShop.ecDataAnalyze(['orders_per_month_custom'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a, _b, _c, _d;
                                    if (window.ApexCharts) {
                                        const startDateObj = new Date(vm.startDate);
                                        const endDateObj = new Date(vm.endDate);
                                        const diffDays = diffDates(startDateObj, endDateObj);
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.orders_per_month_custom.countArray) !== null && _a !== void 0 ? _a : []).reverse();
                                        const array_pos = ((_b = res.response.orders_per_month_custom.countArrayPos) !== null && _b !== void 0 ? _b : []).reverse();
                                        const array_web = ((_c = res.response.orders_per_month_custom.countArrayWeb) !== null && _c !== void 0 ? _c : []).reverse();
                                        const array_store = ((_d = res.response.orders_per_month_custom.countArrayStore) !== null && _d !== void 0 ? _d : []).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        vm.sum_pos = array_pos.reduce((acc, val) => acc + val, 0);
                                        vm.sum_web = array_web.reduce((acc, val) => acc + val, 0);
                                        vm.sum_store = array_store.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
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
                                                                name: '門市訂單數',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'store':
                                                        return [
                                                            {
                                                                name: '門市訂單數',
                                                                data: array_pos,
                                                            },
                                                        ];
                                                    case 'website':
                                                        return [
                                                            {
                                                                name: '官網訂單數',
                                                                data: array_web,
                                                            },
                                                        ];
                                                    default:
                                                        return [
                                                            {
                                                                name: '門市訂單數',
                                                                data: array_store,
                                                            },
                                                        ];
                                                }
                                            })(),
                                            title: { text: '', align: 'center' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(diffDays, true, vm.endDate),
                                                labels: {
                                                    show: diffDays < 15,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static viewPeople(gvc, option = {
        filter_date: 'week',
        come_from: 'all',
        switch: true,
        startDate: '',
        endDate: '',
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
                select: option.filter_date,
                startDate: option.startDate,
                endDate: option.endDate,
            };
            return {
                bind: vm.id,
                view: () => {
                    if (option.come_from !== 'all' && option.come_from !== 'website') {
                        return '';
                    }
                    return GlobalStruct.cardStructure(html `<div class="d-flex flex-column">
                            <div style="${globalStyle.header_title}">瀏覽人數</div>
                            ${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `${vm.sum.toLocaleString()}`;
                            },
                            divCreate: {
                                style: globalStyle.sub_title,
                            },
                        };
                    })}
                        </div>`, vm.id, '#39afd1', html ``);
                },
                onCreate: () => {
                    if (option.come_from !== 'all' && option.come_from !== 'website') {
                        return;
                    }
                    const class_name = '.' + vm.id;
                    const queryJsonString = () => {
                        return JSON.stringify({
                            come_from: option.come_from,
                            start: vm.startDate ? new Date(vm.startDate).toISOString() : '',
                            end: vm.startDate ? new Date(vm.endDate).toISOString() : '',
                        });
                    };
                    switch (vm.select) {
                        case 'week':
                            ApiShop.ecDataAnalyze(['active_recent_2week'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.active_recent_2week.count_array) !== null && _a !== void 0 ? _a : []).reverse().slice(0, 7).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '瀏覽量',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: { categories: GlobalStruct.getPastDays(7) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case '1m':
                            ApiShop.ecDataAnalyze(['active_recent_month'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.active_recent_month.count_array) !== null && _a !== void 0 ? _a : []).reverse().slice(0, 30).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '瀏覽量',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(30),
                                                labels: {
                                                    show: false,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'year':
                            ApiShop.ecDataAnalyze(['active_recent_year'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.active_recent_year.count_array) !== null && _a !== void 0 ? _a : []).reverse().slice(0, 12).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '瀏覽量',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: { categories: GlobalStruct.getPastMonths(12) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'custom':
                            ApiShop.ecDataAnalyze(['active_recent_custom'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a;
                                    if (window.ApexCharts) {
                                        const startDateObj = new Date(vm.startDate);
                                        const endDateObj = new Date(vm.endDate);
                                        const diffDays = diffDates(startDateObj, endDateObj);
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.active_recent_custom.count_array) !== null && _a !== void 0 ? _a : []).reverse().slice(0, diffDays).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '瀏覽量',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(diffDays),
                                                labels: {
                                                    show: diffDays < 15,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static registerPeople(gvc, option = {
        filter_date: 'week',
        come_from: 'all',
        switch: true,
        startDate: '',
        endDate: '',
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
                select: option.filter_date,
                startDate: option.startDate,
                endDate: option.endDate,
            };
            return {
                bind: vm.id,
                view: () => {
                    if (option.come_from !== 'all' && option.come_from !== 'website') {
                        return '';
                    }
                    return GlobalStruct.cardStructure(html `<div class="d-flex flex-column">
                            <div style="${globalStyle.header_title}">註冊數</div>
                            ${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `${vm.sum.toLocaleString()}`;
                            },
                            divCreate: {
                                style: globalStyle.sub_title,
                            },
                        };
                    })}
                        </div>`, vm.id, '#ff6c02', html ``);
                },
                onCreate: () => {
                    if (option.come_from !== 'all' && option.come_from !== 'website') {
                        return;
                    }
                    const class_name = '.' + vm.id;
                    const queryJsonString = () => {
                        return JSON.stringify({
                            come_from: option.come_from,
                            start: vm.startDate ? new Date(vm.startDate).toISOString() : '',
                            end: vm.startDate ? new Date(vm.endDate).toISOString() : '',
                        });
                    };
                    switch (vm.select) {
                        case 'custom':
                            ApiShop.ecDataAnalyze(['recent_register_custom'], queryJsonString()).then((res) => {
                                const startDateObj = new Date(vm.startDate);
                                const endDateObj = new Date(vm.endDate);
                                const diffDays = diffDates(startDateObj, endDateObj);
                                function loop() {
                                    var _a;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.recent_register_custom.countArray) !== null && _a !== void 0 ? _a : []).reverse().slice(0, diffDays).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '註冊量',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(diffDays),
                                                labels: {
                                                    show: diffDays < 15,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'week':
                            ApiShop.ecDataAnalyze(['recent_register_week'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.recent_register_week.count_2_week_register) !== null && _a !== void 0 ? _a : []).reverse().slice(0, 7).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '註冊量',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: { categories: GlobalStruct.getPastDays(7) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'year':
                            ApiShop.ecDataAnalyze(['recent_register_year'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.recent_register_year.count_register) !== null && _a !== void 0 ? _a : []).reverse().slice(0, 12).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '註冊數',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: { categories: GlobalStruct.getPastMonths(12) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case '1m':
                            ApiShop.ecDataAnalyze(['recent_register_month'], queryJsonString()).then((res) => {
                                function loop() {
                                    var _a;
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = ((_a = res.response.recent_register_month.countArray) !== null && _a !== void 0 ? _a : []).reverse().slice(0, 30).reverse();
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '註冊量',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(30),
                                                labels: {
                                                    show: false,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static transferRatio(gvc, option = {
        filter_date: 'week',
        come_from: 'all',
        switch: true,
        startDate: '',
        endDate: '',
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
                select: option.filter_date,
                startDate: option.startDate,
                endDate: option.endDate,
            };
            return {
                bind: vm.id,
                view: () => {
                    if (option.come_from !== 'all' && option.come_from !== 'website') {
                        return '';
                    }
                    return GlobalStruct.cardStructure(html `<div class="d-flex flex-column">
                            <div style="${globalStyle.header_title}">轉換率</div>
                            ${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `${0}%`;
                            },
                            divCreate: {
                                style: globalStyle.sub_title,
                            },
                        };
                    })}
                        </div>`, vm.id, '#ffbc00', html ``);
                },
                onCreate: () => {
                    if (option.come_from !== 'all' && option.come_from !== 'website') {
                        return;
                    }
                    const class_name = '.' + vm.id;
                    const queryJsonString = () => {
                        return JSON.stringify({
                            come_from: option.come_from,
                            start: vm.startDate ? new Date(vm.startDate).toISOString() : '',
                            end: vm.startDate ? new Date(vm.endDate).toISOString() : '',
                        });
                    };
                    switch (vm.select) {
                        case 'custom':
                            ApiShop.ecDataAnalyze(['recent_register_week'], queryJsonString()).then((res) => {
                                const startDateObj = new Date(vm.startDate);
                                const endDateObj = new Date(vm.endDate);
                                const diffDays = diffDates(startDateObj, endDateObj);
                                function loop() {
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = [...new Array(diffDays)].fill(0);
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '轉換率',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(diffDays, true, vm.endDate),
                                                labels: {
                                                    show: diffDays < 15,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'week':
                            ApiShop.ecDataAnalyze(['recent_register_week'], queryJsonString()).then((res) => {
                                function loop() {
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = [0, 0, 0, 0, 0, 0, 0];
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '轉換率',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: { categories: GlobalStruct.getPastDays(7) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case 'year':
                            ApiShop.ecDataAnalyze(['recent_register_week'], queryJsonString()).then((res) => {
                                function loop() {
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '轉換率',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: { categories: GlobalStruct.getPastMonths(12) },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                        case '1m':
                            ApiShop.ecDataAnalyze(['recent_register_week'], queryJsonString()).then((res) => {
                                function loop() {
                                    if (window.ApexCharts) {
                                        let colors = ['#ffffff'];
                                        const dataColors = $(class_name).data('colors');
                                        dataColors && (colors = dataColors.split(','));
                                        const array = [...new Array(30)].fill(0);
                                        vm.sum = array.reduce((acc, val) => acc + val, 0);
                                        gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                        const options = {
                                            chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                            dataLabels: { enabled: false },
                                            stroke: { width: 3, curve: 'smooth' },
                                            colors: colors,
                                            series: [
                                                {
                                                    name: '轉換率',
                                                    data: array,
                                                },
                                            ],
                                            title: { text: '', align: 'center' },
                                            xaxis: {
                                                categories: GlobalStruct.getPastDays(30),
                                                labels: {
                                                    show: false,
                                                },
                                            },
                                            yaxis: { opposite: !1 },
                                            legend: { horizontalAlign: 'left' },
                                            grid: { borderColor: '#f1f3fa' },
                                            responsive: [
                                                {
                                                    breakpoint: 600,
                                                    options: { chart: { toolbar: { show: false } }, legend: { show: false } },
                                                },
                                            ],
                                        }, chart = new window.ApexCharts(document.querySelector(class_name), options);
                                        document.querySelector(class_name + '-loading').remove();
                                        chart.render();
                                    }
                                    else {
                                        setTimeout(() => {
                                            loop();
                                        }, 100);
                                    }
                                }
                                loop();
                            });
                            break;
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
}
function diffDates(startDateObj, endDateObj) {
    var timeDiff = Math.abs(endDateObj.getTime() - startDateObj.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
}
function checkDates(gvc, startDate, endDate, cb) {
    const dialog = new ShareDialog(gvc.glitter);
    if (startDate && endDate) {
        var startDateObj = new Date(startDate);
        var endDateObj = new Date(endDate);
        if (startDateObj <= endDateObj && diffDates(startDateObj, endDateObj) <= 90) {
            cb();
        }
        else {
            dialog.errorMessage({ text: '開始時間必須小於等於結束時間，且兩者之間最多相差 90 天。' });
        }
    }
    else {
        dialog.errorMessage({ text: '開始時間與結束時間必須填寫' });
    }
}
export class DataAnalyzeModuleCart {
    static filterCart(gvc, option, callback) {
        return BgWidget.card(gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const dateId = gvc.glitter.getUUID();
            let storeList = [];
            let loading = true;
            return {
                bind: id,
                view: () => {
                    if (loading) {
                        BgWidget.spinner({
                            circle: { visible: false },
                            container: { style: 'margin: 3rem 0;' },
                        });
                    }
                    return html `
                            <div style="${globalStyle.header_title}">報表篩選條件</div>
                            <div class="d-flex flex-wrap align-items-end" style="margin-top:18px;gap:18px;">
                                <div class="d-flex flex-column">
                                    <div>銷售平台</div>
                                    ${BgWidget.select({
                        gvc: gvc,
                        default: option.come_from,
                        callback: (key) => {
                            option.come_from = key;
                            callback();
                        },
                        options: [
                            { key: 'all', value: '所有銷售平台' },
                            { key: 'website', value: '官網' },
                            { key: 'store', value: '所有門市' },
                            ...storeList
                                .filter((item) => item.is_shop)
                                .map((item) => {
                                return { key: item.id, value: `[門市]${item.name}` };
                            }),
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
                            option.filter_date = key;
                            gvc.notifyDataChange(dateId);
                            if (key !== 'custom') {
                                callback();
                            }
                        },
                        options: [
                            { key: 'week', value: '近7日' },
                            { key: '1m', value: '近1個月' },
                            { key: 'year', value: '近12個月' },
                            { key: 'custom', value: '自訂日期區間' },
                        ],
                        style: 'margin: 8px 0;',
                    })}
                                </div>
                                ${gvc.bindView({
                        bind: dateId,
                        view: () => {
                            return html ` <div class="d-flex ${document.body.clientWidth < 768 ? 'flex-column' : ''} ${option.filter_date === 'custom' ? '' : 'd-none'}" style="gap: 12px">
                                            <div class="d-flex flex-column">
                                                <div>開始日期</div>
                                                ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                type: 'date',
                                style: 'display: block; width: 160px; height: 38px;',
                                default: option.startDate ? option.startDate.slice(0, 10) : '',
                                placeHolder: '',
                                callback: (text) => {
                                    option.startDate = text ? `${text} 00:00:00` : '';
                                },
                            })}
                                            </div>
                                            <div class="d-flex flex-column">
                                                <div>結束日期</div>
                                                ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                type: 'date',
                                style: 'display: block; width: 160px; height: 38px;',
                                default: option.endDate ? option.endDate.slice(0, 10) : '',
                                placeHolder: '',
                                callback: (text) => {
                                    option.endDate = text ? `${text} 23:59:59` : '';
                                },
                            })}
                                            </div>
                                            <div class="d-flex align-items-center justify-content-center">
                                                ${BgWidget.grayButton('查詢', gvc.event(() => {
                                checkDates(gvc, option.startDate, option.endDate, callback);
                            }))}
                                            </div>
                                        </div>`;
                        },
                    })}
                            </div>
                        `;
                },
                divCreate: {},
                onCreate: () => {
                    if (loading) {
                        StockStores.getPublicData().then((data) => {
                            if (data.list && data.list.length > 0) {
                                storeList = data.list;
                            }
                            loading = false;
                            gvc.notifyDataChange(id);
                        });
                    }
                },
            };
        }));
    }
    static filterCartV2(gvc, option, callback) {
        return BgWidget.card(gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            const dateId = gvc.glitter.getUUID();
            let storeList = [];
            let loading = true;
            return {
                bind: id,
                view: () => {
                    if (loading) {
                        BgWidget.spinner({
                            circle: { visible: false },
                            container: { style: 'margin: 3rem 0;' },
                        });
                    }
                    return html `
                            <div style="${globalStyle.header_title}">報表篩選條件</div>
                            <div class="d-flex flex-wrap align-items-end" style="margin-top:18px;gap:18px;">
                                <div class="d-flex flex-column">
                                    <div>銷售平台</div>
                                    ${BgWidget.select({
                        gvc: gvc,
                        default: option.come_from,
                        callback: (key) => {
                            option.come_from = key;
                            gvc.notifyDataChange(dateId);
                            if (key !== 'custom') {
                                callback();
                            }
                        },
                        options: [
                            { key: 'all', value: '所有銷售平台' },
                            { key: 'website', value: '官網' },
                            { key: 'store', value: '所有門市' },
                            ...storeList
                                .filter((item) => item.is_shop)
                                .map((item) => {
                                return { key: item.id, value: `[門市]${item.name}` };
                            }),
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
                            option.filter_date = key;
                            callback();
                        },
                        options: [
                            { key: 'today', value: '今日' },
                            { key: 'week', value: '近7日' },
                            { key: '1m', value: '近1個月' },
                            { key: 'year', value: '近12個月' },
                            { key: 'custom', value: '自訂日期區間' },
                        ],
                        style: 'margin: 8px 0;',
                    })}
                                </div>
                                ${gvc.bindView({
                        bind: dateId,
                        view: () => {
                            return html ` <div class="d-flex ${document.body.clientWidth < 768 ? 'flex-column' : ''} ${option.filter_date === 'custom' ? '' : 'd-none'}" style="gap: 12px">
                                            <div class="d-flex flex-column">
                                                <div>開始日期</div>
                                                ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                type: 'date',
                                style: 'display: block; width: 160px; height: 38px;',
                                default: option.startDate ? option.startDate.slice(0, 10) : '',
                                placeHolder: '',
                                callback: (text) => {
                                    option.startDate = text ? `${text} 00:00:00` : '';
                                },
                            })}
                                            </div>
                                            <div class="d-flex flex-column">
                                                <div>結束日期</div>
                                                ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                type: 'date',
                                style: 'display: block; width: 160px; height: 38px;',
                                default: option.endDate ? option.endDate.slice(0, 10) : '',
                                placeHolder: '',
                                callback: (text) => {
                                    option.endDate = text ? `${text} 23:59:59` : '';
                                },
                            })}
                                            </div>
                                            <div class="d-flex align-items-center justify-content-center">
                                                ${BgWidget.grayButton('查詢', gvc.event(() => {
                                checkDates(gvc, option.startDate, option.endDate, callback);
                            }))}
                                            </div>
                                        </div>`;
                        },
                    })}
                            </div>
                        `;
                },
                divCreate: {},
                onCreate: () => {
                    if (loading) {
                        StockStores.getPublicData().then((data) => {
                            if (data.list && data.list.length > 0) {
                                storeList = data.list;
                            }
                            loading = false;
                            gvc.notifyDataChange(id);
                        });
                    }
                },
            };
        }));
    }
}

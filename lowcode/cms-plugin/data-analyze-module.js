import { BgWidget } from "../backend-manager/bg-widget.js";
import { ApiShop } from "../glitter-base/route/shopping.js";
const html = String.raw;
const css = String.raw;
const globalStyle = {
    header_title: css `color: #393939;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;`,
    sub_title: css `color: #393939;
        font-size: 24px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;`,
    sub_14: css `color: #393939;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;`,
    chart_width: 223,
    select_date: css `
        color: #393939;
        font-size: 14.497px;
        font-style: normal;
        cursor: pointer;
        font-weight: 700;
        line-height: normal;`,
    un_select_date: css `
        color: #8D8D8D;
        cursor: pointer;
        font-size: 14.497px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;`,
};
class GlobalStruct {
    static cardStructure(text, className, color, unit, append) {
        return html `
            <div class="bg-white rounded-3" style="padding:20px;">
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
    static getPastDays(numDays, with_date = true) {
        const days = [];
        const currentDate = new Date();
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
    static salesAmount(gvc) {
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
            };
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">總銷售額</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `$${vm.sum.toLocaleString()}`;
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        };
                    })}
</div>`, vm.id, '#fa6767', `
<div class="d-flex align-items-center" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'week';
                        gvc.notifyDataChange(vm.id);
                    })}">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'year';
                        gvc.notifyDataChange(vm.id);
                    })}">一月</div></div>
`, gvc.bindView(() => {
                        return {
                            bind: vm.list_id,
                            view: () => {
                                return [
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">官網銷售總額</div>
<div style="${globalStyle.sub_title}">$${vm.sum_web.toLocaleString()}</div>
</div>`,
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">門市銷售總額</div>
<div style="${globalStyle.sub_title}">$${vm.sum_pos.toLocaleString()}</div>
</div>`
                                ].join(`<div class="w-100 border-top my-2"></div>`);
                            },
                            divCreate: {}
                        };
                    }));
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze('sales_per_month_2_weak'.split(',')).then((res) => {
                            function loop() {
                                var _a, _b, _c;
                                if (window.ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = ((_a = res.response.sales_per_month_2_weak.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 7).reverse();
                                    vm.sum = array.reduce((acc, val) => acc + val, 0);
                                    vm.sum_pos = ((_b = res.response.sales_per_month_2_weak.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 7).reverse().reduce((acc, val) => acc + val, 0);
                                    vm.sum_web = ((_c = res.response.sales_per_month_2_weak.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 7).reverse().reduce((acc, val) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                    const options = {
                                        chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                        dataLabels: { enabled: false },
                                        stroke: { width: 3, curve: 'smooth' },
                                        colors: colors,
                                        series: [
                                            {
                                                name: '銷售額',
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
                    }
                    else {
                        ApiShop.ecDataAnalyze('sales_per_month_1_year'.split(',')).then((res) => {
                            function loop() {
                                var _a, _b, _c;
                                if (window.ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = ((_a = res.response.sales_per_month_1_year.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 12).reverse();
                                    vm.sum = array.reduce((acc, val) => acc + val, 0);
                                    vm.sum_pos = ((_b = res.response.sales_per_month_1_year.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 12).reverse().reduce((acc, val) => acc + val, 0);
                                    vm.sum_web = ((_c = res.response.sales_per_month_1_year.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 12).reverse().reduce((acc, val) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                    const options = {
                                        chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                        dataLabels: { enabled: false },
                                        stroke: { width: 3, curve: 'smooth' },
                                        colors: colors,
                                        series: [
                                            {
                                                name: '銷售額',
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
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static orderAverage(gvc) {
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
            };
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">平均訂單金額</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `$${vm.sum.toLocaleString()}`;
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        };
                    })}
</div>`, vm.id, '#507FC5', `
<div class="d-flex align-items-center" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'week';
                        gvc.notifyDataChange(vm.id);
                    })}">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'year';
                        gvc.notifyDataChange(vm.id);
                    })}">一月</div></div>
`, gvc.bindView(() => {
                        return {
                            bind: vm.list_id,
                            view: () => {
                                return [
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">官網平均訂單金額</div>
<div style="${globalStyle.sub_title}">$${vm.sum_web.toLocaleString()}</div>
</div>`,
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">門市平均訂單金額</div>
<div style="${globalStyle.sub_title}">$${vm.sum_pos.toLocaleString()}</div>
</div>`
                                ].join(`<div class="w-100 border-top my-2"></div>`);
                            },
                            divCreate: {}
                        };
                    }));
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze('order_avg_sale_price'.split(',')).then((res) => {
                            function loop() {
                                var _a, _b, _c;
                                if (window.ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = ((_a = res.response.order_avg_sale_price.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 7).reverse();
                                    vm.sum = Math.floor(array.reduce((acc, val) => acc + val, 0) / 7);
                                    vm.sum_pos = Math.floor(((_b = res.response.order_avg_sale_price.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 7).reverse().reduce((acc, val) => acc + val, 0) / 7);
                                    vm.sum_web = Math.floor(((_c = res.response.order_avg_sale_price.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 7).reverse().reduce((acc, val) => acc + val, 0) / 7);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                    const options = {
                                        chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                        dataLabels: { enabled: false },
                                        stroke: { width: 3, curve: 'smooth' },
                                        colors: colors,
                                        series: [
                                            {
                                                name: '平均',
                                                data: array.map((dd) => { return dd || 0; }),
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
                    }
                    else {
                        ApiShop.ecDataAnalyze('order_avg_sale_price_year'.split(',')).then((res) => {
                            function loop() {
                                var _a, _b, _c;
                                if (window.ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = ((_a = res.response.order_avg_sale_price_year.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 12).reverse();
                                    vm.sum = Math.floor(array.reduce((acc, val) => acc + val, 0) / 12);
                                    vm.sum_pos = Math.floor(((_b = res.response.order_avg_sale_price_year.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 12).reverse().reduce((acc, val) => acc + val, 0) / 12);
                                    vm.sum_web = Math.floor(((_c = res.response.order_avg_sale_price_year.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 12).reverse().reduce((acc, val) => acc + val, 0) / 12);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                    const options = {
                                        chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                        dataLabels: { enabled: false },
                                        stroke: { width: 3, curve: 'smooth' },
                                        colors: colors,
                                        series: [
                                            {
                                                name: '銷售額',
                                                data: array.map((dd) => { return dd || 0; }),
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
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static orderAmount(gvc) {
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
            };
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">總訂單量</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `${vm.sum.toLocaleString()}`;
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        };
                    })}
</div>`, vm.id, '#ffbc00', `
<div class="d-flex align-items-center" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'week';
                        gvc.notifyDataChange(vm.id);
                    })}">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'year';
                        gvc.notifyDataChange(vm.id);
                    })}">一月</div></div>
`, gvc.bindView(() => {
                        return {
                            bind: vm.list_id,
                            view: () => {
                                return [
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">官網總訂單量</div>
<div style="${globalStyle.sub_title}">${vm.sum_web.toLocaleString()}</div>
</div>`,
                                    `<div class="d-flex flex-column">
<div style="${globalStyle.sub_14}">門市總訂單量</div>
<div style="${globalStyle.sub_title}">${vm.sum_pos.toLocaleString()}</div>
</div>`
                                ].join(`<div class="w-100 border-top my-2"></div>`);
                            },
                            divCreate: {}
                        };
                    }));
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze('orders_per_month_2_weak'.split(',')).then((res) => {
                            function loop() {
                                var _a, _b, _c;
                                if (window.ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = ((_a = res.response.orders_per_month_2_weak.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 7).reverse();
                                    vm.sum = array.reduce((acc, val) => acc + val, 0);
                                    vm.sum_pos = ((_b = res.response.orders_per_month_2_weak.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 7).reverse().reduce((acc, val) => acc + val, 0);
                                    vm.sum_web = ((_c = res.response.orders_per_month_2_weak.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 7).reverse().reduce((acc, val) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                    const options = {
                                        chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                        dataLabels: { enabled: false },
                                        stroke: { width: 3, curve: 'smooth' },
                                        colors: colors,
                                        series: [
                                            {
                                                name: '訂單數',
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
                    }
                    else {
                        ApiShop.ecDataAnalyze('orders_per_month_1_year'.split(',')).then((res) => {
                            function loop() {
                                var _a, _b, _c;
                                if (window.ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = ((_a = res.response.orders_per_month_1_year.countArray) !== null && _a !== void 0 ? _a : []).slice(0, 12).reverse();
                                    vm.sum = array.reduce((acc, val) => acc + val, 0);
                                    vm.sum_pos = ((_b = res.response.orders_per_month_1_year.countArrayPos) !== null && _b !== void 0 ? _b : []).slice(0, 12).reverse().reduce((acc, val) => acc + val, 0);
                                    vm.sum_web = ((_c = res.response.orders_per_month_1_year.countArrayWeb) !== null && _c !== void 0 ? _c : []).slice(0, 12).reverse().reduce((acc, val) => acc + val, 0);
                                    gvc.notifyDataChange([vm.list_id, vm.sum_id]);
                                    const options = {
                                        chart: { height: globalStyle.chart_width, type: 'area', zoom: { enabled: !1 } },
                                        dataLabels: { enabled: false },
                                        stroke: { width: 3, curve: 'smooth' },
                                        colors: colors,
                                        series: [
                                            {
                                                name: '訂單數',
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
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static viewPeople(gvc) {
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
            };
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">瀏覽人數</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `${vm.sum.toLocaleString()}`;
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        };
                    })}
</div>`, vm.id, '#39afd1', `
<div class="d-flex align-items-center" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'week';
                        gvc.notifyDataChange(vm.id);
                    })}">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'year';
                        gvc.notifyDataChange(vm.id);
                    })}">一月</div></div>
`);
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze('active_recent_2weak'.split(',')).then((res) => {
                            function loop() {
                                var _a;
                                if (window.ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = ((_a = res.response.active_recent_2weak.count_array) !== null && _a !== void 0 ? _a : []).reverse().slice(0, 7).reverse();
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
                    }
                    else {
                        ApiShop.ecDataAnalyze('active_recent_year'.split(',')).then((res) => {
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
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static registerPeople(gvc) {
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
            };
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">註冊數</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `${vm.sum.toLocaleString()}`;
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        };
                    })}
</div>`, vm.id, '#ff6c02', `
<div class="d-flex align-items-center" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'week';
                        gvc.notifyDataChange(vm.id);
                    })}">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'year';
                        gvc.notifyDataChange(vm.id);
                    })}">一月</div></div>
`);
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze('recent_register'.split(',')).then((res) => {
                            function loop() {
                                var _a;
                                if (window.ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = ((_a = res.response.recent_register.count_2_weak_register) !== null && _a !== void 0 ? _a : []).reverse().slice(0, 7).reverse();
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
                    }
                    else {
                        ApiShop.ecDataAnalyze('recent_register'.split(',')).then((res) => {
                            function loop() {
                                var _a;
                                if (window.ApexCharts) {
                                    let colors = ['#ffffff'];
                                    const dataColors = $(class_name).data('colors');
                                    dataColors && (colors = dataColors.split(','));
                                    const array = ((_a = res.response.recent_register.count_register) !== null && _a !== void 0 ? _a : []).reverse().slice(0, 12).reverse();
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
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
    static transferRatio(gvc) {
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
            };
            return {
                bind: vm.id,
                view: () => {
                    return GlobalStruct.cardStructure(`<div class="d-flex flex-column">
<div style="${globalStyle.header_title}">轉換率</div>
${gvc.bindView(() => {
                        return {
                            bind: vm.sum_id,
                            view: () => {
                                return `${0}%`;
                            },
                            divCreate: {
                                style: globalStyle.sub_title
                            }
                        };
                    })}
</div>`, vm.id, '#ffbc00', `
<div class="d-flex align-items-center" style="gap:5px;"><div style="${(vm.select === 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'week';
                        gvc.notifyDataChange(vm.id);
                    })}">一週</div>/<div style="${(vm.select !== 'week') ? globalStyle.select_date : globalStyle.un_select_date}" onclick="${gvc.event(() => {
                        vm.select = 'year';
                        gvc.notifyDataChange(vm.id);
                    })}">一月</div></div>
`);
                },
                onCreate: () => {
                    const class_name = '.' + vm.id;
                    if (vm.select === 'week') {
                        ApiShop.ecDataAnalyze('recent_register'.split(',')).then((res) => {
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
                    }
                    else {
                        ApiShop.ecDataAnalyze('recent_register'.split(',')).then((res) => {
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
                    }
                },
                divCreate: {
                    class: `w-100`,
                },
            };
        });
    }
}

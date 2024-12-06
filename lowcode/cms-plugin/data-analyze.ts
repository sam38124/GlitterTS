import { GVC } from '../glitterBundle/GVController.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { BgWidget } from '../backend-manager/bg-widget.js';

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

            ApiShop.ecDataAnalyze(
                'active_recent_year,active_recent_2weak,order_today,order_avg_sale_price_year,hot_products_today,recent_register,sales_per_month_2_weak,sales,orders,orders_per_month,recent_active_user,recent_sales,recent_orders,hot_products,order_avg_sale_price,sales_per_month_1_year,orders_per_month_2_weak,orders_per_month_1_year'.split(
                    ','
                )
            ).then(async (res) => {
                vm.loading = false;
                vm.data = res.response;
                gvc.notifyDataChange(id);
            });

            function cardStructure(text: string, className: string, color: string) {
                return html` <div class="card">
                    <div class="card-body">
                        <h4 class="header-title mb-4">${text}</h4>
                        <div dir="ltr">
                            <div id="line-chart-zoomable" class="${className}" data-colors="${color}"></div>
                        </div>
                    </div>
                </div>`;
            }

            return {
                bind: id,
                view: () => {
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
                                                value: html`${vm.data.active_recent_2weak.count_array
                                                    .map((dd: any) => {
                                                        return dd;
                                                    })
                                                    .reverse()[0]
                                                    .toLocaleString()}
                                                ${BgWidget.grayNote(
                                                    `(本月:${vm.data.active_recent_year.count_array
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
                                                value: html`${vm.data.recent_register['today'].toLocaleString()}
                                                ${BgWidget.grayNote(
                                                    `(本月:${vm.data.recent_register['count_register']
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
                                                    `(本月:${vm.data.sales_per_month_1_year.countArray
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
                                                return html`<div
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
                                                return html`<div class="col-sm-4 col-lg-4 col-12 px-0 px-sm-2">${dd}</div>`;
                                            })
                                            .join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="my-3">${BgWidget.alertInfo(html`<div class="fs-6">提示: 列表僅會顯示已付款的訂單分析</div>`)}</div>
                        <div class="row">
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('當日熱銷商品', 'today-popular', '#39afd1');
                                    },
                                    onCreate: () => {
                                        const class_name = '.today-popular';
                                        const interval = setInterval(function () {
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#39afd1'],
                                                    dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 388, type: 'bar', toolbar: { show: !0 } },
                                                        plotOptions: { bar: { horizontal: !0 } },
                                                        dataLabels: { enabled: !1 },
                                                        series: [
                                                            {
                                                                name: '銷售數量',
                                                                data: vm.data.hot_products_today.series ?? [],
                                                            },
                                                        ],
                                                        colors: colors,
                                                        xaxis: { categories: vm.data.hot_products_today.categories ?? [] },
                                                        states: { hover: { filter: 'none' } },
                                                        grid: { borderColor: '#f1f3fa' },
                                                    },
                                                    //@ts-ignore
                                                    chart = new ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('當月熱銷商品', 'month-popular', '#39afd1');
                                    },
                                    onCreate: () => {
                                        const class_name = '.month-popular';
                                        const interval = setInterval(function () {
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#39afd1'],
                                                    dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 388, type: 'bar', toolbar: { show: !0 } },
                                                        plotOptions: { bar: { horizontal: !0 } },
                                                        dataLabels: { enabled: !1 },
                                                        series: [
                                                            {
                                                                name: '銷售數量',
                                                                data: vm.data.hot_products.series ?? [],
                                                            },
                                                        ],
                                                        colors: colors,
                                                        xaxis: { categories: vm.data.hot_products.categories ?? [] },
                                                        states: { hover: { filter: 'none' } },
                                                        grid: { borderColor: '#f1f3fa' },
                                                    },
                                                    //@ts-ignore
                                                    chart = new ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('每日銷售總額', 'day-month-data', '#fa6767');
                                    },
                                    onCreate: () => {
                                        const class_name = '.day-month-data';
                                        const interval = setInterval(function () {
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#ffffff'];
                                                const dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 380, type: 'area', zoom: { enabled: !1 } },
                                                        dataLabels: { enabled: !1 },
                                                        stroke: { width: 3, curve: 'smooth' },
                                                        colors: colors,
                                                        series: [
                                                            {
                                                                name: '銷售額',
                                                                data: vm.data.sales_per_month_2_weak.countArray ?? [],
                                                            },
                                                        ],
                                                        title: { text: '', align: 'center' },
                                                        xaxis: { categories: getPastDays(14) },
                                                        yaxis: { opposite: !1 },
                                                        legend: { horizontalAlign: 'left' },
                                                        grid: { borderColor: '#f1f3fa' },
                                                        responsive: [
                                                            {
                                                                breakpoint: 600,
                                                                options: { chart: { toolbar: { show: !1 } }, legend: { show: !1 } },
                                                            },
                                                        ],
                                                    },
                                                    //@ts-ignore
                                                    chart = new window.ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('每月銷售總額', 'year-month-data', '#fa6767');
                                    },
                                    onCreate: () => {
                                        const class_name = '.year-month-data';
                                        const interval = setInterval(function () {
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#ffffff'];
                                                const dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 380, type: 'area', zoom: { enabled: !1 } },
                                                        dataLabels: { enabled: !1 },
                                                        stroke: { width: 3, curve: 'smooth' },
                                                        colors: colors,
                                                        series: [
                                                            {
                                                                name: '銷售額',
                                                                data: vm.data.sales_per_month_1_year.countArray ?? [],
                                                            },
                                                        ],
                                                        title: { text: '', align: 'center' },
                                                        xaxis: { categories: getPastMonths(12) },
                                                        yaxis: { opposite: !1 },
                                                        legend: { horizontalAlign: 'left' },
                                                        grid: { borderColor: '#f1f3fa' },
                                                        responsive: [
                                                            {
                                                                breakpoint: 600,
                                                                options: { chart: { toolbar: { show: !1 } }, legend: { show: !1 } },
                                                            },
                                                        ],
                                                    },
                                                    //@ts-ignore
                                                    chart = new window.ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('每日訂單平均消費金額', 'today-average', '#39afd1');
                                    },
                                    onCreate: () => {
                                        function formatter(e: any) {
                                            return 'Session Duration' === e ? e + ' (mins)' : 'Page Views' === e ? e + ' per session' : e;
                                        }

                                        const class_name = '.today-average';

                                        const interval = setInterval(function () {
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#6c757d', '#0acf97', '#39afd1'],
                                                    dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 380, type: 'line', zoom: { enabled: !1 } },
                                                        dataLabels: { enabled: !1 },
                                                        stroke: {
                                                            width: [3, 5, 3],
                                                            curve: 'smooth',
                                                            dashArray: [0, 8, 5],
                                                            colors: ['#507FC5'],
                                                        },
                                                        series: [
                                                            {
                                                                name: '平均消費金額',
                                                                data: vm.data.order_avg_sale_price.countArray,
                                                            },
                                                        ],
                                                        markers: { size: 0, style: 'hollow' },
                                                        xaxis: { categories: getPastDays(14) },
                                                        colors: colors,
                                                        tooltip: { y: { title: { formatter: (e: any) => formatter(e) } } },
                                                        grid: { borderColor: '#f1f3fa' },
                                                        legend: { offsetY: 7 },
                                                    },
                                                    //@ts-ignore
                                                    chart = new ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('每月訂單平均消費金額', 'month-average', '#39afd1');
                                    },
                                    onCreate: () => {
                                        function formatter(e: any) {
                                            return 'Session Duration' === e ? e + ' (mins)' : 'Page Views' === e ? e + ' per session' : e;
                                        }

                                        const class_name = '.month-average';

                                        const interval = setInterval(function () {
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#6c757d', '#0acf97', '#39afd1'],
                                                    dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 380, type: 'line', zoom: { enabled: !1 } },
                                                        dataLabels: { enabled: !1 },
                                                        stroke: {
                                                            width: [3, 5, 3],
                                                            curve: 'smooth',
                                                            dashArray: [0, 8, 5],
                                                            colors: ['#507FC5'],
                                                        },
                                                        series: [
                                                            {
                                                                name: '平均消費金額',
                                                                data: vm.data.order_avg_sale_price_year.countArray,
                                                            },
                                                        ],
                                                        markers: { size: 0, style: 'hollow' },
                                                        xaxis: { categories: getPastMonths(12) },
                                                        colors: colors,
                                                        tooltip: { y: { title: { formatter: (e: any) => formatter(e) } } },
                                                        grid: { borderColor: '#f1f3fa' },
                                                        legend: { offsetY: 7 },
                                                    },
                                                    //@ts-ignore
                                                    chart = new ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('每日訂單總量', 'sales_per_month_2_weak', '#ffbc00');
                                    },
                                    onCreate: () => {
                                        const class_name = '.sales_per_month_2_weak';
                                        const interval = setInterval(function () {
                                            const element = document.querySelector(class_name);
                                            if (element) {
                                                clearInterval(interval);
                                                let colors = ['#ffbc00'],
                                                    dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 380, type: 'line', zoom: { enabled: !1 } },
                                                        dataLabels: { enabled: !1 },
                                                        colors: colors,
                                                        stroke: { width: [4], curve: 'smooth' },
                                                        series: [
                                                            {
                                                                name: '訂單量',
                                                                data: vm.data.orders_per_month_2_weak.countArray ?? [],
                                                            },
                                                        ],
                                                        title: { text: '', align: 'center' },
                                                        grid: {
                                                            row: { colors: ['transparent', 'transparent'], opacity: 0.2 },
                                                            borderColor: '#f1f3fa',
                                                        },
                                                        xaxis: { categories: getPastDays(14) },
                                                        responsive: [
                                                            {
                                                                breakpoint: 600,
                                                                options: { chart: { toolbar: { show: !1 } }, legend: { show: !1 } },
                                                            },
                                                        ],
                                                    },
                                                    //@ts-ignore
                                                    chart = new ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('每月訂單總量', 'total-order', '#ffbc00');
                                    },
                                    onCreate: () => {
                                        const class_name = '.total-order';
                                        const interval = setInterval(function () {
                                            const element = document.querySelector(class_name);
                                            if (element) {
                                                clearInterval(interval);
                                                let colors = ['#ffbc00'],
                                                    dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 380, type: 'line', zoom: { enabled: !1 } },
                                                        dataLabels: { enabled: !1 },
                                                        colors: colors,
                                                        stroke: { width: [4], curve: 'smooth' },
                                                        series: [
                                                            {
                                                                name: '訂單量',
                                                                data: vm.data.orders_per_month_1_year.countArray ?? [],
                                                            },
                                                        ],
                                                        title: { text: '', align: 'center' },
                                                        grid: {
                                                            row: { colors: ['transparent', 'transparent'], opacity: 0.2 },
                                                            borderColor: '#f1f3fa',
                                                        },
                                                        xaxis: { categories: getPastMonths(12) },
                                                        responsive: [
                                                            {
                                                                breakpoint: 600,
                                                                options: { chart: { toolbar: { show: !1 } }, legend: { show: !1 } },
                                                            },
                                                        ],
                                                    },
                                                    //@ts-ignore
                                                    chart = new ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('每日註冊會員', 'month-member', '#ff6c02');
                                    },
                                    onCreate: () => {
                                        const class_name = '.month-member';
                                        const interval = setInterval(function () {
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#ffffff'];
                                                const dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 380, type: 'area', zoom: { enabled: !1 } },
                                                        dataLabels: { enabled: !1 },
                                                        stroke: { width: 3, curve: 'smooth' },
                                                        colors: colors,
                                                        series: [
                                                            {
                                                                name: '會員數量',
                                                                data: vm.data.recent_register.count_2_weak_register ?? [],
                                                            },
                                                        ],
                                                        title: { text: '', align: 'center' },
                                                        xaxis: { categories: getPastDays(14) },
                                                        yaxis: { opposite: !1 },
                                                        legend: { horizontalAlign: 'left' },
                                                        grid: { borderColor: '#f1f3fa' },
                                                        responsive: [
                                                            {
                                                                breakpoint: 600,
                                                                options: { chart: { toolbar: { show: !1 } }, legend: { show: !1 } },
                                                            },
                                                        ],
                                                    },
                                                    //@ts-ignore
                                                    chart = new window.ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('每月註冊會員', 'year-month-member', '#ff6c02');
                                    },
                                    onCreate: () => {
                                        const class_name = '.year-month-member';
                                        const interval = setInterval(function () {
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#ffffff'];
                                                const dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 380, type: 'area', zoom: { enabled: !1 } },
                                                        dataLabels: { enabled: !1 },
                                                        stroke: { width: 3, curve: 'smooth' },
                                                        colors: colors,
                                                        series: [
                                                            {
                                                                name: '會員數量',
                                                                data: vm.data.recent_register.count_register ?? [],
                                                            },
                                                        ],
                                                        title: { text: '', align: 'center' },
                                                        xaxis: { categories: getPastMonths(12) },
                                                        yaxis: { opposite: !1 },
                                                        legend: { horizontalAlign: 'left' },
                                                        grid: { borderColor: '#f1f3fa' },
                                                        responsive: [
                                                            {
                                                                breakpoint: 600,
                                                                options: { chart: { toolbar: { show: !1 } }, legend: { show: !1 } },
                                                            },
                                                        ],
                                                    },
                                                    //@ts-ignore
                                                    chart = new window.ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('每日不重複瀏覽人數', 'day-active', '#39afd1');
                                    },
                                    onCreate: () => {
                                        const class_name = '.day-active';
                                        const interval = setInterval(function () {
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#ffffff'];
                                                const dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 380, type: 'area', zoom: { enabled: !1 } },
                                                        dataLabels: { enabled: !1 },
                                                        stroke: { width: 3, curve: 'smooth' },
                                                        colors: colors,
                                                        series: [
                                                            {
                                                                name: '每日不重複瀏覽人數',
                                                                data: vm.data.active_recent_2weak.count_array ?? [],
                                                            },
                                                        ],
                                                        title: { text: '', align: 'center' },
                                                        xaxis: { categories: getPastDays(14) },
                                                        yaxis: { opposite: !1 },
                                                        legend: { horizontalAlign: 'left' },
                                                        grid: { borderColor: '#f1f3fa' },
                                                        responsive: [
                                                            {
                                                                breakpoint: 600,
                                                                options: { chart: { toolbar: { show: !1 } }, legend: { show: !1 } },
                                                            },
                                                        ],
                                                    },
                                                    //@ts-ignore
                                                    chart = new window.ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return cardStructure('每月不重複瀏覽人數', 'month-active-member', '#39afd1');
                                    },
                                    onCreate: () => {
                                        const class_name = '.month-active-member';
                                        const interval = setInterval(function () {
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#ffffff'];
                                                const dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 380, type: 'area', zoom: { enabled: !1 } },
                                                        dataLabels: { enabled: !1 },
                                                        stroke: { width: 3, curve: 'smooth' },
                                                        colors: colors,
                                                        series: [
                                                            {
                                                                name: '每月不重複瀏覽人數',
                                                                data: vm.data.active_recent_year.count_array ?? [],
                                                            },
                                                        ],
                                                        title: { text: '', align: 'center' },
                                                        xaxis: { categories: getPastMonths(12) },
                                                        yaxis: { opposite: !1 },
                                                        legend: { horizontalAlign: 'left' },
                                                        grid: { borderColor: '#f1f3fa' },
                                                        responsive: [
                                                            {
                                                                breakpoint: 600,
                                                                options: { chart: { toolbar: { show: !1 } }, legend: { show: !1 } },
                                                            },
                                                        ],
                                                    },
                                                    //@ts-ignore
                                                    chart = new window.ApexCharts(document.querySelector(class_name), options);
                                                chart.render();
                                            }
                                        }, 500);
                                    },
                                    divCreate: {
                                        class: `col-12 col-sm-6 mb-2`,
                                    },
                                };
                            })}
                        </div>
                    `;
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
        const formattedMonth = `${year}年${month.toString().padStart(2, '0')}月`; // 格式化為兩位數字的月份
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

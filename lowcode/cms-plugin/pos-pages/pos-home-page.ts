import { GVC } from '../../glitterBundle/GVController.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';

const html = String.raw;

export class PosHomePage {
    public static main(gvc: GVC) {
        //ecDataAnalyze
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
                'order_today,hot_products_today,sales,orders,orders_per_month,recent_active_user,recent_sales,recent_orders,hot_products,order_avg_sale_price,sales_per_month_1_year,orders_per_month_1_year'.split(
                    ','
                )
            ).then(async (res) => {
                vm.loading = false;
                vm.data = res.response;
                gvc.notifyDataChange(id);
            });
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return `<div class="w-100 d-flex align-items-center justify-content-center p-3"><div class="spinner-border "></div></div>`;
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
                                    <div  style="flex: 1 1 0; align-self: stretch; flex-direction: column; justify-content: center; align-items: flex-start; gap: 8px; display: inline-flex;">
                                        <div  style="align-self: stretch; color: #393939; font-size: 20px; font-weight: 700; word-wrap: break-word;">營運狀況總覽</div>
                                        <div  style="align-self: stretch; color: #8D8D8D; font-size: 16px; font-weight: 400; word-wrap: break-word;">查看目前的業務情形</div>
                                    </div>
                                    <div
                                        class="d-flex flex-column flex-sm-row"
                                        style="width: 896px;    max-width: 100%; align-self: stretch; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex;"
                                    >
                                        ${[
                                            {
                                                title: '今日成交總額',
                                                value: vm.data.order_today.total_amount,
                                                icon: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716565784156-coins-light.svg`,
                                            },
                                            {
                                                title: '今日成交訂單',
                                                value: vm.data.order_today.total_count,
                                                icon: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg`,
                                            },
                                            {
                                                title: '未出貨訂單',
                                                value: vm.data.order_today.un_shipment,
                                                icon: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560713871-truck-light 1.svg`,
                                            },
                                            {
                                                title: '未付款訂單',
                                                value: vm.data.order_today.un_pay,
                                                icon: `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560798255-credit-card-light 1.svg`,
                                            },
                                        ]
                                            .map((dd) => {
                                                return ` <div 
                                             style="flex: 1 1 0; align-self: stretch; padding-left: 32px; padding-right: 32px; padding-top: 47px; padding-bottom: 47px; background: white; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.10); border-radius: 10px; overflow: hidden; flex-direction: column; justify-content: center; align-items: flex-start; gap: 10px; display: inline-flex;"
                                        >
                                            <div 
                                                 style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 16px; display: inline-flex;"
                                            >
                                                <div 
                                                     style="flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: center; gap: 2px; display: inline-flex;"
                                                >
                                                    <div 
                                                         style="align-self: stretch; color: #393939; font-size: 18px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word;"
                                                    >${dd.value}
                                                    </div>
                                                    <div 
                                                         style="align-self: stretch; color: #8D8D8D; font-size: 16px; font-family: Noto Sans; font-weight: 500; word-wrap: break-word;"
                                                    >${dd.title}
                                                    </div>
                                                </div>
                                                <img  style="width:30px;height: 30px;"
                                                     src="${dd.icon}">
                                            </div>
                                        </div>`;
                                            })
                                            .join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return `<div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">當日熱銷商品</h4>
                                        <div dir="ltr">
                                            <div id="line-chart-zoomable" class="today-popular" data-colors="#39afd1"></div>
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>`;
                                    },
                                    onCreate: () => {
                                        const class_name = '.today-popular';
                                        const interval = setInterval(function () {
                                            const element = document.querySelector(class_name);
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#39afd1'],
                                                    dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 388, type: 'bar', toolbar: { show: !0 } },
                                                        plotOptions: { bar: { horizontal: !0 } },
                                                        dataLabels: { enabled: !1 },
                                                        series: [{ name: '銷售數量', data: vm.data.hot_products_today.series ?? [] }],
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
                                        return ` <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">當月熱銷商品</h4>
                                        <div dir="ltr">
                                            <div id="line-chart-zoomable" class="month-popular" data-colors="#39afd1"></div>
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>`;
                                    },
                                    onCreate: () => {
                                        function getPastMonths(numMonths: any) {
                                            const months = [];
                                            const currentDate = new Date();
                                            let currentYear = currentDate.getFullYear() - 2000;
                                            let currentMonth = currentDate.getMonth() + 2; // 月份從0開始，並記錄當月，所以要加2

                                            for (let i = 0; i < numMonths; i++) {
                                                currentMonth--; // 從當前月份開始往前推
                                                if (currentMonth === 0) {
                                                    currentYear--; // 如果月份為0，代表上一年的12月
                                                    currentMonth = 12; // 將月份調整為12月
                                                }
                                                months.unshift(currentYear + '年' + (currentMonth < 10 ? '0' : '') + currentMonth + '月'); // 將年月添加到陣列的開頭
                                            }

                                            return months;
                                        }
                                        const class_name = '.month-popular';
                                        const interval = setInterval(function () {
                                            const element = document.querySelector(class_name);
                                            if ((window as any).ApexCharts) {
                                                clearInterval(interval);
                                                let colors = ['#39afd1'],
                                                    dataColors = $(class_name).data('colors');
                                                dataColors && (colors = dataColors.split(','));
                                                const options = {
                                                        chart: { height: 388, type: 'bar', toolbar: { show: !0 } },
                                                        plotOptions: { bar: { horizontal: !0 } },
                                                        dataLabels: { enabled: !1 },
                                                        series: [{ name: '銷售數量', data: vm.data.hot_products.series ?? [] }],
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
                                        // hot_products_today
                                        return ` <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">每月銷售總額</h4>
                                        <div dir="ltr">
                                            <div id="line-chart-zoomable" class="year-month-data" data-colors="#fa6767"></div>
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>`;
                                    },
                                    onCreate: () => {
                                        function getPastMonths(numMonths: any) {
                                            const months = [];
                                            const currentDate = new Date();
                                            let currentYear = currentDate.getFullYear() - 2000;
                                            let currentMonth = currentDate.getMonth() + 2; // 月份從0開始，並記錄當月，所以要加2

                                            for (let i = 0; i < numMonths; i++) {
                                                currentMonth--; // 從當前月份開始往前推
                                                if (currentMonth === 0) {
                                                    currentYear--; // 如果月份為0，代表上一年的12月
                                                    currentMonth = 12; // 將月份調整為12月
                                                }
                                                months.unshift(currentYear + '年' + (currentMonth < 10 ? '0' : '') + currentMonth + '月'); // 將年月添加到陣列的開頭
                                            }

                                            return months;
                                        }
                                        const class_name = '.year-month-data';
                                        const interval = setInterval(function () {
                                            const element = document.querySelector(class_name);
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
                                                        series: [{ name: '銷售額', data: vm.data.sales_per_month_1_year.countArray ?? [] }],
                                                        title: { text: '每月銷售額', align: 'center' },
                                                        xaxis: { categories: getPastMonths(12) },
                                                        yaxis: { opposite: !1 },
                                                        legend: { horizontalAlign: 'left' },
                                                        grid: { borderColor: '#f1f3fa' },
                                                        responsive: [{ breakpoint: 600, options: { chart: { toolbar: { show: !1 } }, legend: { show: !1 } } }],
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
                                        return ` <div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">每日訂單平均消費金額</h4>
                                        <div dir="ltr">
                                            <div id="line-chart-zoomable" class="today-average" data-colors="#39afd1"></div>
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>`;
                                    },
                                    onCreate: () => {
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
                                                        stroke: { width: [3, 5, 3], curve: 'smooth', dashArray: [0, 8, 5], colors: ['#507FC5'] },
                                                        series: [{ name: '平均消費金額', data: vm.data.order_avg_sale_price.countArray }],
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
                                        return `<div class="card">
                                    <div class="card-body">
                                        <h4 class="header-title mb-4">每月訂單總量</h4>
                                        <div dir="ltr">
                                            <div id="line-chart-zoomable" class="total-order" data-colors="#ffbc00"></div>
                                        </div>
                                    </div>
                                    <!-- end card body-->
                                </div>`;
                                    },
                                    onCreate: () => {
                                        function getPastMonths(numMonths: number) {
                                            const months = [];
                                            const currentDate = new Date();
                                            let currentYear = currentDate.getFullYear() - 2000;
                                            let currentMonth = currentDate.getMonth() + 2; // 月份從0開始，並記錄當月，所以要加2

                                            for (let i = 0; i < numMonths; i++) {
                                                currentMonth--; // 從當前月份開始往前推
                                                if (currentMonth === 0) {
                                                    currentYear--; // 如果月份為0，代表上一年的12月
                                                    currentMonth = 12; // 將月份調整為12月
                                                }
                                                months.unshift(currentYear + '年' + (currentMonth < 10 ? '0' : '') + currentMonth + '月'); // 將年月添加到陣列的開頭
                                            }

                                            return months;
                                        }

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
                                                        series: [{ name: '訂單量', data: vm.data.orders_per_month_1_year.countArray ?? [] }],
                                                        title: { text: '每月訂單數', align: 'center' },
                                                        grid: { row: { colors: ['transparent', 'transparent'], opacity: 0.2 }, borderColor: '#f1f3fa' },
                                                        xaxis: { categories: getPastMonths(12) },
                                                        responsive: [{ breakpoint: 600, options: { chart: { toolbar: { show: !1 } }, legend: { show: !1 } } }],
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
                        </div>
                    `;
                },
                divCreate: {
                    class: `mx-auto`,
                    style: `width:1200px;max-width:calc(100% - 20px);`,
                },
            };
        });
    }
}

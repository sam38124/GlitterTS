import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { Storage } from '../../glitterBundle/helper/storage.js';
import { ApiPageConfig } from '../../api/pageConfig.js';
import { NormalPageEditor } from '../../editor/normal-page-editor.js';
import { AddComponent } from '../../editor/add-component.js';
import { EditorConfig } from '../../editor-config.js';

export class Setting_editor {
    public static pluginUrl = '';

    public static left(gvc: GVC, viewModel: any, createID: string, gBundle: any) {
        const html = String.raw;
        const glitter = gvc.glitter;

        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    Storage.select_bg_btn = 'custom';
                    return [
                        (() => {
                            return html` <div class="d-flex p-3 bg-white border-bottom align-items-end d-sm-none">
                                    <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1718986163099-logo.svg" />
                                    <span class="ms-1 " style="font-size: 11px;color: orange;">${glitter.share.editerVersion}</span>
                                </div>
                                <div class="w-100 bg-white" style="overflow-y:auto; ${document.body.offsetWidth < 800 ? '' : `padding-top: ${EditorConfig.getPaddingTop(gvc)}px;`}">
                                    ${(() => {
                                        return gvc.bindView(() => {
                                            const id = gvc.glitter.getUUID();
                                            let items: any = [];

                                            let mustItem = [
                                                {
                                                    icon: '',
                                                    page: 'home_page',
                                                    group: '首頁',
                                                    title: '首頁',
                                                    appName: 'cms_system',
                                                    groupIcon: ' https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716559696051-Component 56.svg',
                                                    moduleName: '首頁',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'shop_information',
                                                    group: '商店設定',
                                                    title: '商店訊息',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
                                                    moduleName: '商店設計',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'setFinanceWay',
                                                    group: '商店設定',
                                                    title: '金流設定',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
                                                    moduleName: '金流 / 物流 / 發票',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'shippment_setting',
                                                    group: '商店設定',
                                                    title: '配送設定',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
                                                    moduleName: '金流 / 物流 / 發票',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'shippment-setting',
                                                    group: '商店設定',
                                                    title: '運費設定',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
                                                    moduleName: '運費設定',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'rebate_setting',
                                                    group: '商店設定',
                                                    title: '購物金設定',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
                                                    moduleName: '購物金設定',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'invoice_setting',
                                                    group: '商店設定',
                                                    title: '電子發票',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
                                                    moduleName: '金流 / 物流 / 發票',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'product-manager',
                                                    group: '商品管理',
                                                    title: '商品列表',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652645450-boxes-stacked-regular (1).svg',
                                                    moduleName: '商品管理',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'collection_v2',
                                                    group: '商品管理',
                                                    title: '商品分類',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652645450-boxes-stacked-regular (1).svg',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'stock',
                                                    group: '商品管理',
                                                    title: '庫存管理',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652645450-boxes-stacked-regular (1).svg',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'order_list',
                                                    group: '訂單管理',
                                                    title: '訂單列表',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652949790-Component 56 (3).svg',
                                                    moduleName: '訂單列表',
                                                },

                                                {
                                                    icon: '',
                                                    page: 'out-delivery',
                                                    group: '訂單管理',
                                                    title: '退貨單',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652949790-Component 56 (3).svg',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'member_manager',
                                                    group: '顧客管理',
                                                    title: '顧客設定',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
                                                    moduleName: '會員設定',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'user_list',
                                                    group: '顧客管理',
                                                    title: '顧客列表',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713360844009-Component 56 (1).svg',
                                                    moduleName: '用戶列表',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'member_group',
                                                    group: '顧客管理',
                                                    title: '顧客分群',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713360844009-Component 56 (1).svg',
                                                    moduleName: '用戶列表',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'member_level',
                                                    group: '顧客管理',
                                                    title: '會員等級',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713360844009-Component 56 (1).svg',
                                                    moduleName: '用戶列表',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'discount_setting',
                                                    group: '優惠促銷',
                                                    title: '優惠券管理',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713370923228-Component 56 (3).svg',
                                                    moduleName: '優惠券管理',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'rebate',
                                                    group: '優惠促銷',
                                                    title: '購物金紀錄',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713370923228-Component 56 (3).svg',
                                                    moduleName: '購物金紀錄',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'hidden-shop',
                                                    group: '行銷推廣',
                                                    title: '隱形賣場',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722230748790-Component 56.svg',
                                                    moduleName: 'dashboard_ec',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'single-shop',
                                                    group: '行銷推廣',
                                                    title: '一頁式商店',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722230748790-Component 56.svg',
                                                    moduleName: 'dashboard_ec',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'distribution_list',
                                                    group: '行銷推廣',
                                                    title: '分銷連結',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722230748790-Component 56.svg',
                                                    moduleName: 'dashboard_ec',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'dashboard_ec',
                                                    group: '數據分析',
                                                    title: '數據總覽',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716653099307-Component 56 (4).svg',
                                                    moduleName: 'dashboard_ec',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'auto_send',
                                                    group: '信件群發',
                                                    title: '自動寄件',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713375442916-Component 56 (4).svg',
                                                    moduleName: '已訂閱郵件',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'manual_send',
                                                    group: '信件群發',
                                                    title: '手動寄件',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713375442916-Component 56 (4).svg',
                                                    moduleName: '群發設定',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'send_mail',
                                                    group: '信件群發',
                                                    title: '信件樣式',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713375442916-Component 56 (4).svg',
                                                    moduleName: '群發設定',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'send_mail_history',
                                                    group: '信件群發',
                                                    title: '歷史寄件紀錄',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713375442916-Component 56 (4).svg',
                                                    moduleName: '群發設定',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'customer_message',
                                                    group: '顧客管理',
                                                    title: '客服系統',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713514549253-calendar-lines-pen-regular.svg',
                                                    moduleName: '表單管理',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'form_receive',
                                                    group: '顧客管理',
                                                    title: '表單收集',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713514549253-calendar-lines-pen-regular.svg',
                                                    moduleName: '表單管理',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'web_theme',
                                                    group: '品牌官網',
                                                    title: '佈景主題',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716654741305-Component 56 (5).svg',
                                                    moduleName: '商店設計',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'blog_manager',
                                                    group: '品牌官網',
                                                    title: '網誌文章',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716654741305-Component 56 (5).svg',
                                                    moduleName: '網誌管理',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'page_manager',
                                                    group: '品牌官網',
                                                    title: '分頁列表',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716654741305-Component 56 (5).svg',
                                                    moduleName: '網誌管理',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'menus-setting',
                                                    group: '品牌官網',
                                                    title: '選單管理',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716654741305-Component 56 (5).svg',
                                                    moduleName: '網誌管理',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'ios_upload',
                                                    group: 'APP',
                                                    title: 'APP上架',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716655243577-Component 56 (6).svg',
                                                    moduleName: 'IOS應用上架',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'cloud_subscrible',
                                                    group: 'APP',
                                                    title: '推播訂閱裝置',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713414599944-Component 56 (5).svg',
                                                    moduleName: '訂閱裝置管理',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'notify_message_list',
                                                    group: 'APP',
                                                    title: '推播訊息管理',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713414599944-Component 56 (5).svg',
                                                    moduleName: '推播訊息管理',
                                                },
                                                {
                                                    icon: '',
                                                    page: 'member_plan',
                                                    group: '方案管理',
                                                    title: '方案管理',
                                                    appName: 'cms_system',
                                                    groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1719982993525-credit-card-regular.svg',
                                                    moduleName: '方案管理',
                                                },
                                            ];
                                            if ((window as any).memberType === 'noLimit') {
                                                mustItem = mustItem.concat([
                                                    {
                                                        icon: '',
                                                        page: 'code_info',
                                                        group: '擴充套件',
                                                        title: 'Graph Api',
                                                        appName: 'cms_system',
                                                        groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713419947572-code-solid.svg',
                                                        moduleName: '結帳事件',
                                                    },
                                                    {
                                                        icon: '',
                                                        page: 'web_hook_checkout',
                                                        group: '擴充套件',
                                                        title: '結帳事件',
                                                        appName: 'cms_system',
                                                        groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713419947572-code-solid.svg',
                                                        moduleName: '結帳事件',
                                                    },
                                                    {
                                                        icon: '',
                                                        page: 'seo_custom',
                                                        group: '擴充套件',
                                                        title: 'SEO自訂',
                                                        appName: 'cms_system',
                                                        groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713419947572-code-solid.svg',
                                                        moduleName: '結帳事件',
                                                    },

                                                    {
                                                        icon: '',
                                                        page: 'site_map',
                                                        group: '擴充套件',
                                                        title: 'SiteMap自訂',
                                                        appName: 'cms_system',
                                                        groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713419947572-code-solid.svg',
                                                        moduleName: '後端代碼事件',
                                                    },
                                                    {
                                                        icon: '',
                                                        page: 'template_upload',
                                                        group: '擴充套件',
                                                        title: '模板發佈',
                                                        appName: 'cms_system',
                                                        groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713418629944-Component 56 (7).svg',
                                                        moduleName: '模板發佈',
                                                    },
                                                    // {
                                                    //     icon: '',
                                                    //     page: 'wallet-list',
                                                    //     group: '顧客管理',
                                                    //     title: '電子錢包紀錄',
                                                    //     appName: 'cms_system',
                                                    //     groupIcon:
                                                    //             'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713371719908-wallet-regular.svg',
                                                    //     moduleName: '增減紀錄',
                                                    // },
                                                    // {
                                                    //     icon: '',
                                                    //     page: 'withdrawRequest',
                                                    //     group: '顧客管理',
                                                    //     title: '錢包提領請求',
                                                    //     appName: 'cms_system',
                                                    //     groupIcon:
                                                    //             'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713371719908-wallet-regular.svg',
                                                    //     moduleName: '提領請求',
                                                    // },
                                                ]);
                                            }
                                            mustItem.map((dd, index) => {
                                                if (dd.page === glitter.getUrlParameter('tab')) {
                                                    Storage.select_item = index;
                                                }
                                            });

                                            ApiPageConfig.getPrivateConfigV2('backend_list').then((res) => {
                                                res.response.result[0] && (items = res.response.result[0].value);
                                                items = items.filter((dd: any) => {
                                                    return dd;
                                                });
                                                items.map((d1: any) => {
                                                    if (
                                                        !mustItem.find((dd: any) => {
                                                            return `${dd.appName}-${dd.page}` === `${d1.appName}-${d1.page}`;
                                                        })
                                                    ) {
                                                        mustItem.push(d1);
                                                    }
                                                });
                                                items = mustItem;
                                                if (parseInt(Storage.select_item, 10) >= items.length) {
                                                    Storage.select_item = '0';
                                                }
                                                gvc.notifyDataChange(id);
                                            });
                                            return {
                                                bind: id,
                                                view: () => {
                                                    function renderItems(items: any) {
                                                        let list: any = [];

                                                        function click_item(index: any) {
                                                            if (['page_layout', 'dev_mode'].indexOf(items[parseInt(index)].page) !== -1) {
                                                                const url = new URL(location.href);
                                                                if (items[parseInt(index)].page === 'page_layout') {
                                                                    url.searchParams.set('function', 'user-editor');
                                                                } else {
                                                                    Storage.view_type = 'col3';
                                                                    url.searchParams.set('function', 'page-editor');
                                                                }
                                                                location.href = url.href;
                                                            } else {
                                                                Storage.select_item = index;
                                                                (window as any).editerData = undefined;
                                                                glitter.setUrlParameter('tab', items[parseInt(index)].page);
                                                                const url = new URL('./' + items[parseInt(index)].page, glitter.root_path);
                                                                url.searchParams.set('appName', items[parseInt(index)].appName);
                                                                url.searchParams.set('cms', 'true');
                                                                url.searchParams.set('page', items[parseInt(index)].page);
                                                                $('#editerCenter').html(`<iframe src="${url.href}" style="border: none;height: calc(100%);"></iframe>`);
                                                                glitter.closeDrawer();
                                                            }
                                                            return true;
                                                        }

                                                        items
                                                            .filter((dd: any) => {
                                                                if ((window as any).memberType === 'noLimit') {
                                                                    return true;
                                                                } else {
                                                                    return ['code_info', 'web_hook_checkout', 'template_upload'].indexOf(dd.page) === -1;
                                                                }
                                                            })
                                                            .map((dd: any, index: number) => {
                                                                let container = list;
                                                                const group = dd.group.split('/');
                                                                if (dd.group) {
                                                                    group.map((d3: any) => {
                                                                        if (
                                                                            !container.find((dd: any) => {
                                                                                return dd.title === d3;
                                                                            })
                                                                        ) {
                                                                            container.push({
                                                                                type: 'container',
                                                                                title: d3,
                                                                                child: [],
                                                                                toggle: false,
                                                                                icon: dd.groupIcon,
                                                                            });
                                                                        }
                                                                        if (Storage.select_item === `${index}`) {
                                                                            container.find((dd: any) => {
                                                                                return dd.title === d3 && dd.type === 'container';
                                                                            }).toggle = true;
                                                                        }
                                                                        container = container.find((dd: any) => {
                                                                            return dd.title === d3 && dd.type === 'container';
                                                                        }).child;
                                                                    });
                                                                    if (dd.groupIcon) {
                                                                        items
                                                                            .filter((d2: any) => {
                                                                                return d2.group === dd.group;
                                                                            })
                                                                            .map((d1: any) => {
                                                                                d1.groupIcon = dd.groupIcon;
                                                                            });
                                                                    }
                                                                }
                                                                if (Storage.select_item === `${index}`) {
                                                                    if (['page_layout', 'dev_mode'].indexOf(items[index].page) !== -1) {
                                                                        Storage.select_item = `5`;
                                                                        click_item(Storage.select_item);
                                                                    } else {
                                                                        click_item(index);
                                                                    }
                                                                }
                                                                container.push({
                                                                    title: dd.title,
                                                                    index: index,
                                                                    info: dd,
                                                                    toggle: Storage.select_item === `${index}`,
                                                                });
                                                            });

                                                        function refreshContainer() {
                                                            gvc.notifyDataChange(id);
                                                        }

                                                        list.map((dd: any, index: number) => {
                                                            if (dd.type === 'container' && dd.child.length == 1) {
                                                                dd.child[0].icon = dd.icon;
                                                                list[index] = dd.child[0];
                                                            }
                                                        });

                                                        function renderItems(list: any) {
                                                            return gvc.bindView(() => {
                                                                const id = gvc.glitter.getUUID();
                                                                return {
                                                                    bind: id,
                                                                    view: () => {
                                                                        return list
                                                                            .map((dd: any, index: any) => {
                                                                                return html`
                                                                                    ${dd.title === '品牌官網' ? `<div class="my-4 border-top"></div>` : ``}
                                                                                    <li>
                                                                                        <div
                                                                                            class="w-100 fw-500 d-flex align-items-center  fs-6 hoverBtn h_item  rounded px-2 tx_700"
                                                                                            style="gap:7px;color:#393939;${dd.toggle ? `border-radius: 5px;background: #F2F2F2;` : ``}"
                                                                                            onclick="${gvc.event(() => {
                                                                                                if (dd.type === 'container') {
                                                                                                    list.map((d1: any) => {
                                                                                                        d1.toggle = false;
                                                                                                    });
                                                                                                    dd.toggle = !dd.toggle;
                                                                                                    gvc.notifyDataChange(id);
                                                                                                } else {
                                                                                                    if (
                                                                                                        click_item(dd.index) &&
                                                                                                        ['page_layout', 'dev_mode'].indexOf(items[parseInt(dd.index)].page) === -1
                                                                                                    ) {
                                                                                                        dd.toggle = true;
                                                                                                        refreshContainer();
                                                                                                    }
                                                                                                }
                                                                                            })}"
                                                                                        >
                                                                                            ${dd.icon ? `<img src="${dd.icon}" style="width:18px;height:18px;">` : ``}
                                                                                            <span>${dd.title}</span>
                                                                                            <div class="flex-fill"></div>
                                                                                            ${dd.type === 'container'
                                                                                                ? !dd.toggle
                                                                                                    ? html` <i class="fa-regular fa-angle-right hoverBtn me-1" aria-hidden="true"></i> `
                                                                                                    : html` <i class="fa-regular fa-angle-down hoverBtn me-1" aria-hidden="true"></i>`
                                                                                                : html`
                                                                                                      ${dd.info && dd.info.icon ? `<img src="${dd.info.icon}" style="width:18px;height:18px;">` : ``}
                                                                                                  `}
                                                                                        </div>
                                                                                        ${dd.type === 'container'
                                                                                            ? html` <div class="ps-4 pt-2 pb-2 ${dd.toggle ? `` : `d-none`}">${renderItems(dd.child)}</div>`
                                                                                            : ``}
                                                                                    </li>
                                                                                `;
                                                                            })
                                                                            .join('<div class="my-1"></div>');
                                                                    },
                                                                    divCreate: {
                                                                        elem: 'ul',
                                                                        class: `m-0 `,
                                                                        option: [
                                                                            {
                                                                                key: 'id',
                                                                                value: id,
                                                                            },
                                                                        ],
                                                                    },
                                                                    onCreate: () => {},
                                                                };
                                                            });
                                                        }

                                                        return html` <div class="p-2">${renderItems(list)}</div>`;
                                                    }

                                                    return renderItems(items);
                                                },
                                            };
                                        });
                                    })()}
                                </div>`;
                        })(),
                        html` <div
                            class="bg-white w-100 align-items-center  d-flex editor_item_title  start-0  z-index-9 ps-2  border-bottom border-top position-absolute bottom-0 border-end d-none"
                            style="z-index: 999;border:none;"
                        >
                            <div
                                class="hoverBtn d-flex align-items-center justify-content-center   border  me-2"
                                style="height:30px;width:30px;border-radius:5px;cursor:pointer;color:#151515;"
                                onclick="${gvc.event(() => {
                                    Setting_editor.addPlugin(gvc, () => {
                                        gvc.notifyDataChange(id);
                                    });
                                })}"
                            >
                                <i class="fa-solid fa-puzzle-piece-simple" aria-hidden="true"></i>
                            </div>
                        </div>`,
                    ].join('');
                },
                divCreate: { style: `` },
            };
        });
    }

    public static center(gvc: GVC, viewModel: any, createID: string) {}

    public static addPlugin(gvc: GVC, callback: () => void) {
        const saasConfig: {
            config: any;
            api: any;
        } = (window as any).saasConfig;
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        let items: any = [];

        function addPlugin(updateModel?: any) {
            let postMd = updateModel || {
                icon: '',
                title: '',
                group: '',
                page: '',
                groupIcon: '',
                appName: '',
                moduleName: '',
            };

            return gvc.bindView(() => {
                const postId = gvc.glitter.getUUID();
                return {
                    bind: postId,
                    view: () => {
                        return html`
                            <div class="position-relative bgf6 d-flex align-items-center p-2 border-bottom shadow">
                                <span class="fs-6 fw-bold " style="color:black;">${updateModel ? `插件設定` : '新增插件'}</span>
                                <div class="flex-fill"></div>
                                <button
                                    class="btn btn-primary-c ${updateModel ? `d-none` : ``}"
                                    style="height: 28px;width:40px;font-size:14px;"
                                    onclick="${gvc.event(() => {
                                        items.push(postMd);
                                        NormalPageEditor.back();
                                    })}"
                                >
                                    儲存
                                </button>
                            </div>
                            <div class="p-2">
                                ${[
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '標題',
                                        default: postMd.title,
                                        placeHolder: '請輸入插件標題',
                                        callback: (text) => {
                                            postMd.title = text;
                                        },
                                    }),
                                    EditorElem.searchInput({
                                        gvc: gvc,
                                        title: html`群組分類
                                            <div class="alert alert-info p-2 mt-2 fs-base fw-500 mb-0" style="word-break: break-all;white-space:normal">
                                                加入 / 進行分類:<br />例如:頁面/登入/註冊設定
                                            </div>`,
                                        def: postMd.group,
                                        array: (() => {
                                            let array: any = [];
                                            items.map((dd: any) => {
                                                if (
                                                    !array.find((d1: any) => {
                                                        return d1 === dd.group;
                                                    })
                                                ) {
                                                    array.push(dd.group);
                                                }
                                            });
                                            return array;
                                        })(),
                                        placeHolder: '請輸入群組分類',
                                        callback: (text) => {
                                            postMd.group = text;
                                            if (
                                                items.find((dd: any) => {
                                                    return dd.group === text && dd.groupIcon;
                                                })
                                            ) {
                                                postMd.groupIcon = items.find((dd: any) => {
                                                    return dd.group === text && dd.groupIcon;
                                                }).groupIcon;
                                            }
                                            gvc.notifyDataChange(postId);
                                        },
                                    }),
                                    EditorElem.uploadImage({
                                        title: '群組ICON',
                                        gvc: gvc,
                                        def: postMd.groupIcon || '',
                                        callback: (icon) => {
                                            postMd.groupIcon = icon;
                                        },
                                    }),
                                    EditorElem.buttonPrimary(
                                        postMd.moduleName || '選擇模塊',
                                        gvc.event(() => {
                                            NormalPageEditor.toggle({
                                                visible: true,
                                                view: gvc.bindView(() => {
                                                    return {
                                                        bind: gvc.glitter.getUUID(),
                                                        view: () => {
                                                            return new Promise((resolve, reject) => {
                                                                resolve(
                                                                    AddComponent.addModuleView(
                                                                        gvc,
                                                                        'backend',
                                                                        (tData: any) => {
                                                                            postMd.appName = tData.copyApp;
                                                                            postMd.page = tData.copy;
                                                                            postMd.moduleName = tData.title;
                                                                            NormalPageEditor.back();
                                                                        },
                                                                        false,
                                                                        true
                                                                    )
                                                                );
                                                            });
                                                        },
                                                    };
                                                }),
                                                title: '選擇插件',
                                            });
                                        })
                                    ),
                                ].join('')}
                            </div>
                        `;
                    },
                };
            });
        }

        NormalPageEditor.closeEvent = () => {
            gvc.recreateView();
        };

        NormalPageEditor.toggle({
            visible: true,
            title: '設定CMS插件',
            view: (() => {
                const viewComponent = {
                    add_plus: (title: string, event: string) => {
                        return html` <div class="w-100 fw-500 d-flex align-items-center justify-content-center fs-6 hoverBtn h_item border rounded" style="gap:5px;color:#3366BB;" onclick="${event}">
                            <i class="fa-solid fa-plus"></i>
                            <span>${title}</span>
                        </div>`;
                    },
                };
                return gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    let select = '';
                    ApiPageConfig.getPrivateConfigV2('backend_list').then((res) => {
                        res.response.result[0] && (items = res.response.result[0].value);
                        items = items.filter((dd: any) => {
                            return dd;
                        });
                        gvc.notifyDataChange(id);
                    });
                    return {
                        bind: id,
                        view: () => {
                            const list: any = [];
                            items.map((dd: any, index: number) => {
                                let container = list;
                                const group = dd.group.split('/');
                                if (dd.group) {
                                    group.map((d3: any) => {
                                        if (
                                            !container.find((dd: any) => {
                                                return dd.title === d3;
                                            })
                                        ) {
                                            container.push({
                                                type: 'container',
                                                title: d3,
                                                child: [],
                                                toggle: select === dd,
                                                icon: dd.groupIcon,
                                            });
                                        }
                                        container = container.find((dd: any) => {
                                            return dd.title === d3 && dd.type === 'container';
                                        }).child;
                                    });
                                    if (dd.groupIcon) {
                                        items
                                            .filter((d2: any) => {
                                                return d2.group === dd.group;
                                            })
                                            .map((d1: any) => {
                                                d1.groupIcon = dd.groupIcon;
                                            });
                                    }
                                }
                                container.push({
                                    title: dd.title,
                                    index: index,
                                    info: dd,
                                });
                            });

                            function refreshContainer() {
                                gvc.notifyDataChange(id);
                            }

                            function renderItems(list: any) {
                                return gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return list
                                                .map((dd: any, index: any) => {
                                                    return html`
                                                        <li>
                                                            <div
                                                                class="w-100 fw-500 d-flex align-items-center  fs-6 hoverBtn h_item  rounded px-2"
                                                                style="gap:5px;color:#393939;"
                                                                onclick="${gvc.event(() => {
                                                                    if (dd.type === 'container') {
                                                                        dd.toggle = !dd.toggle;
                                                                        gvc.notifyDataChange(id);
                                                                    } else {
                                                                    }
                                                                })}"
                                                            >
                                                                ${dd.type === 'container'
                                                                    ? !dd.toggle
                                                                        ? html` <i class="fa-regular fa-angle-right hoverBtn me-1" aria-hidden="true"></i> `
                                                                        : html`<i class="fa-regular fa-angle-down hoverBtn me-1" aria-hidden="true"></i>`
                                                                    : html` ${dd.info && dd.info.icon ? `<img src="${dd.info.icon}" style="width:18px;height:18px;">` : ``} `}
                                                                ${dd.icon ? `<img src="${dd.icon}" style="width:18px;height:18px;">` : ``}
                                                                <span>${dd.title}</span>
                                                                <div class="flex-fill"></div>
                                                                ${dd.type === 'container'
                                                                    ? ``
                                                                    : html`
                                                                          <i
                                                                              class="fa-solid fa-pencil text-black hoverBtn me-2 child"
                                                                              onclick="${gvc.event(() => {
                                                                                  select = dd.info;
                                                                                  NormalPageEditor.toggle({
                                                                                      visible: true,
                                                                                      view: addPlugin(select),
                                                                                      title: dd.title,
                                                                                  });
                                                                              })}"
                                                                          ></i>
                                                                          <i
                                                                              class="fa-sharp fa-solid fa-trash-can text-black hoverBtn me-2 child"
                                                                              onclick="${gvc.event(() => {
                                                                                  const dialog = new ShareDialog(gvc.glitter);
                                                                                  dialog.checkYesOrNot({
                                                                                      callback: (response) => {
                                                                                          if (response) {
                                                                                              items = items.filter((d2: any, index: any) => {
                                                                                                  return index !== dd.index;
                                                                                              });
                                                                                              list.splice(index, 1);
                                                                                              if (list.length === 0) {
                                                                                                  refreshContainer();
                                                                                              } else {
                                                                                                  gvc.notifyDataChange(id);
                                                                                              }
                                                                                          }
                                                                                      },
                                                                                      text: '是否確認刪除插件?',
                                                                                  });
                                                                              })}"
                                                                          ></i>
                                                                      `}
                                                                <i class="fa-solid fa-grip-dots-vertical"></i>
                                                            </div>
                                                            ${dd.type === 'container' ? `<div class="ps-2 ${dd.toggle ? `` : `d-none`}">${renderItems(dd.child)}</div>` : ``}
                                                        </li>
                                                    `;
                                                })
                                                .join('');
                                        },
                                        divCreate: {
                                            elem: 'ul',
                                            option: [
                                                {
                                                    key: 'id',
                                                    value: id,
                                                },
                                            ],
                                        },
                                        onCreate: () => {
                                            function swapArr(arr: any, index1: number, index2: number) {
                                                const data = arr[index1];
                                                arr.splice(index1, 1);
                                                arr.splice(index2, 0, data);
                                            }

                                            let startIndex = 0;
                                            //@ts-ignore
                                            Sortable.create(document.getElementById(id), {
                                                group: gvc.glitter.getUUID(),
                                                animation: 100,
                                                // Called when dragging element changes position
                                                onChange: function (evt: any) {
                                                    // swapArr(original, startIndex, evt.newIndex)
                                                },
                                                onEnd: (evt: any) => {
                                                    let changeItemStart = 0;
                                                    let changeItemEnd = 0;

                                                    function findStartIndex(it: any) {
                                                        if (it.type === 'container') {
                                                            findStartIndex(it.child[0]);
                                                        } else {
                                                            changeItemStart = it.index;
                                                        }
                                                    }

                                                    findStartIndex(list[startIndex]);

                                                    function findEndIndex(it: any) {
                                                        if (it.type === 'container') {
                                                            findEndIndex(it.child[0]);
                                                        } else {
                                                            changeItemEnd = it.index;
                                                        }
                                                    }

                                                    findEndIndex(list[evt.newIndex]);
                                                    swapArr(items, changeItemStart, changeItemEnd);
                                                    swapArr(list, startIndex, evt.newIndex);
                                                },
                                                onStart: function (evt: any) {
                                                    startIndex = evt.oldIndex;
                                                },
                                            });
                                        },
                                    };
                                });
                            }

                            return html`
                                <div class=" position-relative bgf6 d-flex align-items-center   p-2 border-bottom shadow">
                                    <span class="fs-6 fw-bold " style="color:black;">插件設定</span>
                                    <div class="flex-fill"></div>
                                    <button
                                        class="btn btn-primary-c "
                                        style="height: 28px;width:40px;font-size:14px;"
                                        onclick="${gvc.event(() => {
                                            dialog.dataLoading({ visible: true });
                                            ApiPageConfig.setPrivateConfigV2({
                                                key: 'backend_list',
                                                value: JSON.stringify(items),
                                            }).then((res) => {
                                                dialog.dataLoading({ visible: false });
                                                if (res.result) {
                                                    dialog.successMessage({ text: '儲存成功' });
                                                } else {
                                                    dialog.errorMessage({ text: '伺服器異常' });
                                                }
                                            });
                                        })}"
                                    >
                                        儲存
                                    </button>
                                </div>
                                <div class="container pt-2">
                                    ${renderItems(list)}
                                    <div class="my-1"></div>
                                    ${[
                                        viewComponent.add_plus(
                                            '新增插件',
                                            gvc.event(() => {
                                                NormalPageEditor.toggle({
                                                    visible: true,
                                                    view: addPlugin(),
                                                    title: '新增插件',
                                                });
                                            })
                                        ),
                                    ].join(``)}
                                </div>
                            `;
                        },
                        divCreate: {
                            class: `w-100`,
                        },
                    };
                });
            })(),
            width: 350,
        });

        //         gvc.glitter.innerDialog((gvc: GVC) => {
        //             const vm: {
        //                 loading: boolean,
        //                 data: any
        //             } = {
        //                 loading: true,
        //                 data: {
        //                     array: []
        //                 },
        //
        //             }
        //             const did = gvc.glitter.getUUID()
        //             saasConfig.api.getPrivateConfig(saasConfig.config.appName, "glitter_backend_plugin").then((r: { response: any, result: boolean }) => {
        //                 if (r.response.result[0]) {
        //                     vm.data = r.response.result[0].value
        //                 }
        //                 vm.loading = false
        //                 gvc.notifyDataChange(did)
        //             });
        //             return gvc.bindView(() => {
        //                 return {
        //                     bind: did,
        //                     view: () => {
        //                         return ` <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        //         <h3 class="modal-title fs-4">客製化後台套件</h3>
        //         <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        //         onclick="${gvc.event(() => {
        //                             gvc.closeDialog()
        //                         })}"></i>
        // </div>
        //
        // <div class="mt-2 border border-white p-2 fw-500 fs-6">
        // <div class="alert alert-info " style="white-space:normal;">
        // 您可以透過添加插件來拓展你的後台系統應用．
        // </div>
        // ${(() => {
        //                             if (vm.loading) {
        //                                 return `  <div class="w-100 d-flex align-items-center justify-content-center">
        //   <div class="spinner-border " role="status">
        //   <span class="sr-only"></span>
        // </div>
        // </div>`
        //                             } else {
        //                                 return gvc.bindView(() => {
        //                                     const id = gvc.glitter.getUUID()
        //                                     return {
        //                                         bind: id,
        //                                         view: () => {
        //                                             return EditorElem.arrayItem({
        //                                                 originalArray: vm.data.array,
        //                                                 gvc: gvc,
        //                                                 title: '後台套件設定',
        //                                                 array: () => {
        //                                                     return vm.data.array.map((obj: any, index: number) => {
        //                                                         return {
        //                                                             title: obj.title ?? `第${index + 1}個後台插件`,
        //                                                             expand: obj,
        //                                                             innerHtml: (gvc: GVC) => {
        //                                                                 const selectID = gvc.glitter.getUUID()
        //                                                                 return gvc.bindView(() => {
        //                                                                     return {
        //                                                                         bind: selectID,
        //                                                                         view: () => {
        //                                                                             return [
        //                                                                                 EditorElem.fontawesome({
        //                                                                                     title: 'ICON圖示',
        //                                                                                     gvc: gvc,
        //                                                                                     def: obj.icon ?? "",
        //                                                                                     callback: (text) => {
        //                                                                                         obj.icon = text
        //                                                                                     }
        //                                                                                 }),
        //                                                                                 EditorElem.editeInput({
        //                                                                                     gvc: gvc,
        //                                                                                     title: "插件名稱",
        //                                                                                     default: obj.title ?? "",
        //                                                                                     placeHolder: "請輸入插件名稱",
        //                                                                                     callback: (text) => {
        //                                                                                         obj.title = text
        //                                                                                     }
        //                                                                                 }),
        //                                                                                 EditorElem.pageSelect(gvc, '選擇頁面', obj.page ?? "", (data) => {
        //                                                                                     obj.page = data
        //                                                                                 }, (dd) => {
        //                                                                                     return dd.page_type === 'backend'
        //                                                                                 })
        //                                                                             ].join('')
        //                                                                         },
        //                                                                         divCreate: {
        //                                                                             class:`mb-2`
        //                                                                         }
        //                                                                     }
        //                                                                 })
        //                                                             },
        //                                                             saveEvent: () => {
        //                                                                 gvc.notifyDataChange(id)
        //                                                             },
        //                                                             minus: gvc.event(() => {
        //                                                                 vm.data.array.splice(index, 1);
        //                                                                 gvc.notifyDataChange(did)
        //                                                             }),
        //                                                             width: "400px"
        //                                                         };
        //                                                     })
        //                                                 },
        //                                                 expand: {expand: true},
        //                                                 plus: {
        //                                                     title: '添加後台插件',
        //                                                     event: gvc.event(() => {
        //                                                         vm.data.array.push({});
        //                                                         gvc.notifyDataChange(did)
        //                                                     }),
        //                                                 },
        //                                                 refreshComponent: () => {
        //                                                     gvc.notifyDataChange(id)
        //                                                 }
        //                                             })
        //                                         },
        //                                         divCreate: {
        //                                             class: `mx-n2`
        //                                         }
        //                                     }
        //                                 })
        //                             }
        //                         })()}
        // </div>
        // <div class="d-flex pb-2 px-2 justify-content-end">
        // <button class="btn btn-primary-c d-flex align-items-center " style="height:40px;" onclick="${gvc.event(() => {
        //                             const dialog = new ShareDialog(gvc.glitter)
        //                             dialog.dataLoading({text: '設定中', visible: true})
        //                             saasConfig.api.setPrivateConfig(saasConfig.config.appName, "glitter_backend_plugin", vm.data).then((r: { response: any, result: boolean }) => {
        //                                 dialog.dataLoading({visible: false})
        //                                 if (r.response) {
        //                                     callback()
        //                                     dialog.successMessage({text: "儲存成功"})
        //                                 } else {
        //                                     dialog.errorMessage({text: "儲存失敗"})
        //                                 }
        //                             })
        //                         })}"><i class="fa-solid fa-floppy-disk me-2"></i>儲存</button>
        // </div>
        // `
        //                     },
        //                     divCreate: {
        //                         class: `m-auto bg-white shadow rounded overflow-auto`,
        //                         style: `max-width: 100%;max-height: calc(100% - 20px);width:400px;`
        //                     }
        //                 }
        //             })
        //         }, 'addPlugin')
    }
}

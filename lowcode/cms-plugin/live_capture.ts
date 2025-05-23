import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { FilterOptions } from './filter-options.js';
import { Tool } from '../modules/tool.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { ProductSetting } from './module/product-setting.js';
import { ApiLiveInteraction } from '../glitter-base/route/live-purchase-interactions.js';
import { BgCustomerMessage } from '../backend-manager/bg-customer-message';
import { ApiFbService } from '../glitter-base/route/fb-service.js';

interface ViewModel {
  id: string;
  filterId: string;
  type: 'list' | 'add' | 'replace' | 'viewAllowance';
  data: any;
  dataList: any;
  query?: string;
  queryType?: string;
  orderString?: string;
  filter?: any;
}

interface Comment {
  "created_time": string,
  "from": {
    "name": string,
    "id": string
  },
  "message": string,
  "id": string
}

interface CommentList {
  "data": Comment[],
  "paging": {
    "cursors": {
      "before": string,
      "after": string
    },
    "previous": string,
  }
}

interface StreamingData {
  orders: number;
  page_id: string;
  live_id: string;
  title: string;
  accessToken:string,
  comments: Comment[],
  amount: number,
  after:string
}

const html = String.raw;

export class LiveCapture {
  public static main(gvc: GVC, group_buy?: boolean) {
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(gvc.glitter);

    const vm: ViewModel = {
      id: glitter.getUUID(),
      type: 'list',
      data: {},
      dataList: undefined,
      query: '',
      queryType: '',
      orderString: '',
      filter: {},
      filterId: glitter.getUUID(),
    };
    const ListComp = new BgListComponent(gvc, vm, FilterOptions.invoiceFilterFrame);

    return gvc.bindView({
      bind: vm.id,
      dataList: [{ obj: vm, key: 'type' }],
      view: () => {
        if (vm.type === 'list') {
          return BgWidget.container(html`
            <div class="title-container">
              ${BgWidget.title(group_buy ? '團購列表' : '直播列表')}
              <div class="flex-fill"></div>
              <div style="display: flex; gap: 14px;">
                ${BgWidget.darkButton(
                  '建立',
                  gvc.event(() => {
                    vm.type = 'add';
                  })
                )}
              </div>
            </div>
            <div style="margin-top: 24px;"></div>
            ${BgWidget.mainCard(
              [
                (() => {
                  const id = glitter.getUUID();
                  return gvc.bindView({
                    bind: id,
                    view: () => {
                      const selectFilterDefault = vm.queryType || group_buy ? `group_buy_name` : 'fb_live_name';
                      const filterList = [
                        BgWidget.selectFilter({
                          gvc,
                          callback: (value: any) => {
                            vm.queryType = value;
                            gvc.notifyDataChange(vm.id);
                          },
                          default: vm.queryType || 'fb_live_name',
                          options: FilterOptions.fbLiveSelect,
                        }),
                        BgWidget.searchFilter(
                          gvc.event(e => {
                            vm.query = `${e.value}`.trim();
                            gvc.notifyDataChange(vm.id);
                          }),
                          vm.query || '',
                          group_buy ? '搜尋團購' : '搜尋直播'
                        ),
                      ];

                      const filterTags = ListComp.getFilterTags(FilterOptions.invoiceFunnel);

                      if (document.body.clientWidth < 768) {
                        // 手機版
                        return html` <div
                            style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between"
                          >
                            <div>${filterList[0]}</div>
                            <div style="display: flex;">
                              ${filterList[2] ? `<div class="me-2">${filterList[2]}</div>` : ''} ${filterList[3] ?? ''}
                            </div>
                          </div>
                          <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                          <div>${filterTags}</div>`;
                      } else {
                        // 電腦版
                        return html` <div style="display: flex; align-items: center; gap: 10px;">
                            ${filterList.join('')}
                          </div>
                          <div>${filterTags}</div>`;
                      }
                    },
                  });
                })(),
                BgWidget.tableV3({
                  gvc: gvc,
                  getData: vmi => {
                    const limit = 20;
                    vmi.loading = true;
                    ApiLiveInteraction.getScheduled({
                      type: group_buy?'group_buy':'stream_shout',
                      page: vmi.page - 1,
                      limit: limit,
                      search: vm.query || '',
                      searchType: vm.queryType ?? 'name',
                      orderString: vm.orderString,
                      filter: vm.filter,
                    }).then(data => {
                      function getDatalist() {
                        return data.response.data.map((dd: any) => {
                          return [
                            {
                              key: '團購名稱',
                              value: dd.name,
                            },
                            {
                              key: '團購時間',
                              value: glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd'),
                            },
                            {
                              key: '平台',
                              value: (() => {
                                if (dd.content.platform == 'LINE') {
                                  return html` <i class="fa-brands fa-line" style="color: #3ACE00"></i> `;
                                }
                                return html` <i class="fa-brands fa-facebook"></i> `;
                              })(),
                            },
                            {
                              key: '團購群組/粉絲專頁',
                              value: dd.content.lineGroup.groupName,
                            },
                            {
                              key: '跟團人數',
                              value: dd.content?.pending_order?.length ?? 0,
                            },
                            {
                              key: '總銷售額',
                              value: dd.content?.pending_order_total ?? 0,
                            },
                            {
                              key: '狀態',
                              value: (() => {
                                console.log(dd.status);
                                switch (dd.status ?? '0') {
                                  // case -1:
                                  //     return BgWidget.notifyInsignia('已作廢');
                                  // case 0:
                                  //     return BgWidget.warningInsignia('處理中');
                                  case 1:
                                    return BgWidget.infoInsignia('開團中');
                                  case 2:
                                    return html` <div class="insignia" style="background: #FEE4C3;">結帳中</div> `;
                                  case 3:
                                    return html` <div class="insignia" style="background: #DDD;">已結束</div> `;
                                }
                              })(),
                            },
                          ].map((dd: any) => {
                            dd.value = html` <div style="line-height:40px;">${dd.value}</div>`;
                            return dd;
                          });
                        });
                      }

                      vm.dataList = data.response.data;
                      vmi.pageSize = Math.ceil(data.response.total / limit);
                      vmi.originalData = vm.dataList;
                      vmi.tableData = getDatalist();
                      vmi.loading = false;
                      vmi.callback();
                    });
                  },
                  rowClick: (data, index) => {
                    vm.data = vm.dataList[index];
                    vm.type = 'replace';
                  },
                  filter: [
                    // 放批量編輯的地方
                  ],
                }),
              ].join('')
            )}
            ${BgWidget.mbContainer(240)}
          `);
        } else if (vm.type === 'add') {
          return this.create(gvc, vm, group_buy);
        } else if (vm.type === 'replace') {
          return this.replace(gvc, vm, group_buy);
        }
        return ``;
      },
    });
  }

  public static create(gvc: GVC, vm: any, group_buy?: boolean) {
    let newOrder: any = {
      id: gvc.glitter.getUUID(),
      productArray: [],
      productCheck: [],
      productTemp: [],
      orderProductArray: [],
      orderString: '',
      query: '',
    };

    // 取得指定天數後的日期
    function getFutureDate(days: number): string {
      const date = new Date();
      date.setDate(date.getDate() + days); // 計算指定天數後的日期

      // 格式化為 YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    }

    const dialog = new ShareDialog(gvc.glitter);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let viewModel: {
      lineGroupLoading: boolean;
      lineGroup: any;
      formData: {
        id:string;
        type: string;
        purpose: string;
        name: string;
        streamer: string;
        platform: string;
        item_list: any[];
        stock: {
          reserve: boolean;
          expiry_date: string;
          period: string;
        };
        discount_set: string;
        lineGroup: {
          groupId: string;
          groupName: string;
        };
        start_date: any;
        start_time: any;
        end_date: any;
        end_time: any;
      };
      summaryType: 'normal' | 'prepare' | 'streaming';
    } = {
      lineGroupLoading: true,
      lineGroup: [],
      formData: {
        id:"",
        type: group_buy ? 'group_buy' : 'stream_shout',
        purpose: 'self',
        name: '',
        streamer: '',
        platform: group_buy ? 'LINE' : 'Facebook',
        item_list: [],
        stock: {
          reserve: true,
          expiry_date: getFutureDate(1),
          period: '1',
        },
        discount_set: 'false',
        lineGroup: {
          groupId: '',
          groupName: '',
        },
        start_date: now.toISOString().split('T')[0],
        start_time: now.toTimeString().split(' ')[0].slice(0, 5),
        end_date: tomorrow.toISOString().split('T')[0],
        end_time: tomorrow.toTimeString().split(' ')[0].slice(0, 5),
      },
      summaryType: 'normal',
    };
    const testData = {
      "id": "1",
      "type": "stream_shout",
      "purpose": "self",
      "name": "直播名稱",
      "streamer": "直播人",
      "platform": "Facebook",
      "item_list": [
        {
          "id": 1066,
          "userID": 122538856,
          "content": {
            "id": 1066,
            "seo": {
              "title": "",
              "domain": "冬季衣 團購庫存測試",
              "content": "",
              "keywords": ""
            },
            "type": "product",
            "unit": {
              "en-US": "",
              "zh-CN": "",
              "zh-TW": ""
            },
            "specs": [
              {
                "title": "顏色",
                "option": [
                  {
                    "title": "白",
                    "expand": true
                  },
                  {
                    "title": "米白",
                    "expand": true
                  },
                  {
                    "title": "灰",
                    "expand": true
                  }
                ]
              }
            ],
            "title": "冬季衣 團購庫存測試",
            "token": {
              "exp": 1773595079,
              "iat": 1742059079,
              "userID": 122538856,
              "account": "rdtest",
              "userData": {}
            },
            "status": "active",
            "channel": [
              "normal",
              "pos"
            ],
            "content": "<html><head></head><body><p id=\"isPasted\"><strong>&nbsp;</strong></p><div class=\"d-flex flex-column\"><strong><div class=\"d-flex flex-column\"><img src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.17.28-AcozyHershikfabricsingle-seatersofawithamodernyetcomfortabledesign.Thesofaisupholsteredinhigh-qualityfabricinasoft,neutralcol.webp\" class=\"fr-fil fr-dib\" alt=\"\">&nbsp;<img src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.18.59-AnelegantElizabethsolidwoodwardrobewithaclassic,timelessdesign.Thewardrobefeatureshigh-qualitywoodconstructionwithapolishedfinis.webp\" class=\"fr-fil fr-dib\" alt=\"\">&nbsp;<img src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp\" class=\"fr-fil fr-dib\" alt=\"\"></div></strong></div><div><strong>擁抱冬日的溫暖舒適感！</strong></div><div>【冬季新品】加絨寬鬆保暖睡衣專為寒冷季節設計，選用柔軟加絨面料，提供絕佳的保暖效果與親膚觸感。經典寬鬆版型，不僅穿著舒適自在，還讓居家時光更加溫馨愜意。時尚簡約的設計風格，兼具實用與美感，是冬季居家的必備單品。</div><p><br></p><hr><h4><strong><sub>商品特色：</sub></strong></h4><ul><li style=\"list-style: revert;\"><strong>加絨面料</strong>：內層細膩加絨，保暖升級，觸感柔軟不刺激肌膚。</li><li style=\"list-style: revert;\"><strong>寬鬆版型</strong>：不拘束活動，輕鬆自在，適合各種身型。</li><li style=\"list-style: revert;\"><strong>防靜電處理</strong>：有效減少靜電干擾，讓穿著更舒適安心。</li><li style=\"list-style: revert;\"><strong>時尚配色</strong>：多款冬季流行色可選，提升居家質感。</li><li style=\"list-style: revert;\"><strong>易清潔材質</strong>：耐洗耐用，不易變形與褪色，長時間保持柔軟。<br><br><br></li><li style=\"list-style: revert;\"><h4 id=\"isPasted\"><strong><sub>材質與清潔方式：</sub></strong></h4><ul><li style=\"list-style: revert;\"><strong>材質</strong>：80%聚酯纖維，20%棉</li><li style=\"list-style: revert;\"><strong>清潔建議</strong>：可機洗，使用冷水及中性洗滌劑，避免高溫烘乾。</li></ul></li><li style=\"list-style: revert;\"><p>讓【冬季新品】加絨寬鬆保暖睡衣陪伴您度過每個溫暖的冬夜！</p></li></ul></body></html>",
            "visible": "true",
            "comments": [],
            "template": "",
            "variants": [
              {
                "sku": "",
                "cost": 0,
                "spec": [
                  "白"
                ],
                "type": "variants",
                "stock": -3,
                "profit": 0,
                "weight": "0.1",
                "barcode": "",
                "v_width": "15",
                "v_height": "3",
                "v_length": "15",
                "stockList": {
                  "store_wsmcwg": {
                    "count": -3
                  },
                  "store_ufqm8w": {
                    "count": 0
                  },
                  "store_bopfha": {
                    "count": 0
                  },
                  "store_kqtwki": {
                    "count": 0
                  },
                  "store_gdon2o": {
                    "count": 0
                  },
                  "store_u8u57z": {
                    "count": 0
                  },
                  "store_cg7dcv": {
                    "count": 0
                  }
                },
                "product_id": 1066,
                "sale_price": 590,
                "save_stock": 100,
                "origin_price": 590,
                "compare_price": 590,
                "preview_image": "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_s6s9s5s6s0s6s8sd_O1CN01iqOErA1h3GmntlOY2_!!2869234221-0-cib.jpg",
                "shipment_type": "volume",
                "show_understocking": "true",
                "sold_out": 3,
                "selected": true,
                "live_model": {
                  "stock": -3,
                  "available_Qty": -3,
                  "original_price": 590,
                  "live_price": 590,
                  "limit": 1
                },
                "live_keyword": [
                  "a01",
                  "A01"
                ]
              },
              {
                "sku": "",
                "cost": 0,
                "spec": [
                  "米白"
                ],
                "type": "variants",
                "stock": 95,
                "profit": 0,
                "weight": "0.1",
                "barcode": "",
                "v_width": "15",
                "v_height": "3",
                "v_length": "15",
                "stockList": {
                  "store_wsmcwg": {
                    "count": 95
                  },
                  "store_ufqm8w": {
                    "count": 0
                  },
                  "store_bopfha": {
                    "count": 0
                  },
                  "store_kqtwki": {
                    "count": 0
                  },
                  "store_gdon2o": {
                    "count": 0
                  },
                  "store_u8u57z": {
                    "count": 0
                  },
                  "store_cg7dcv": {
                    "count": 0
                  }
                },
                "product_id": 1066,
                "sale_price": 590,
                "save_stock": 100,
                "origin_price": 590,
                "compare_price": 590,
                "preview_image": "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_s7s7s8scs8scs0sa_O1CN01bn739s1h3GmpNmHzO_!!2869234221-0-cib.jpg",
                "shipment_type": "volume",
                "show_understocking": "true",
                "sold_out": 2,
                "selected": true,
                "live_model": {
                  "stock": 95,
                  "available_Qty": 95,
                  "original_price": 590,
                  "live_price": 590,
                  "limit": 1
                },
                "live_keyword": [
                  "a02",
                  "A02"
                ]
              },
              {
                "sku": "",
                "cost": 0,
                "spec": [
                  "灰"
                ],
                "type": "variants",
                "stock": 0,
                "profit": 0,
                "weight": "0.1",
                "barcode": "",
                "v_width": "15",
                "v_height": "3",
                "v_length": "15",
                "stockList": {
                  "store_wsmcwg": {
                    "count": 0
                  },
                  "store_ufqm8w": {
                    "count": 0
                  },
                  "store_bopfha": {
                    "count": 0
                  },
                  "store_kqtwki": {
                    "count": 0
                  },
                  "store_gdon2o": {
                    "count": 0
                  },
                  "store_u8u57z": {
                    "count": 0
                  },
                  "store_cg7dcv": {
                    "count": 0
                  }
                },
                "product_id": 1066,
                "sale_price": 590,
                "save_stock": 100,
                "origin_price": 999,
                "compare_price": 999,
                "preview_image": "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_sbs2s1s6s8s6s8s4_O1CN01rrLx3J1h3GmpzUrLl_!!2869234221-0-cib.jpg",
                "shipment_type": "volume",
                "show_understocking": "true",
                "sold_out": 0,
                "selected": true,
                "live_model": {
                  "stock": 0,
                  "available_Qty": 0,
                  "original_price": 590,
                  "live_price": 590,
                  "limit": 1
                },
                "live_keyword": [
                  "a03",
                  "A03"
                ]
              }
            ],
            "hideIndex": "false",
            "max_price": 590,
            "min_price": 590,
            "sub_title": "",
            "collection": [
              ""
            ],
            "productType": {
              "product": true,
              "giveaway": false,
              "addProduct": false
            },
            "product_tag": {
              "language": {
                "en-US": [],
                "zh-CN": [],
                "zh-TW": []
              }
            },
            "total_sales": 0,
            "content_json": [],
            "in_wish_list": false,
            "content_array": [],
            "language_data": {
              "en-US": {
                "seo": {
                  "title": "",
                  "domain": "",
                  "content": "",
                  "keywords": ""
                },
                "title": "",
                "content": "",
                "content_array": []
              },
              "zh-CN": {
                "seo": {
                  "title": "",
                  "domain": "",
                  "content": "",
                  "keywords": ""
                },
                "title": "",
                "content": "",
                "content_array": []
              },
              "zh-TW": {
                "seo": {
                  "title": "",
                  "domain": "冬季衣 團購庫存測試",
                  "content": "",
                  "keywords": ""
                },
                "title": "冬季衣 團購庫存測試",
                "content": "<html><head></head><body><p id=\"isPasted\"><strong>&nbsp;</strong></p><div class=\"d-flex flex-column\"><strong><div class=\"d-flex flex-column\"><img src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.17.28-AcozyHershikfabricsingle-seatersofawithamodernyetcomfortabledesign.Thesofaisupholsteredinhigh-qualityfabricinasoft,neutralcol.webp\" class=\"fr-fil fr-dib\" alt=\"\">&nbsp;<img src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.18.59-AnelegantElizabethsolidwoodwardrobewithaclassic,timelessdesign.Thewardrobefeatureshigh-qualitywoodconstructionwithapolishedfinis.webp\" class=\"fr-fil fr-dib\" alt=\"\">&nbsp;<img src=\"https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/DALL·E2024-11-0514.20.13-AsophisticatedWindermerecoffeetablewithamodernyetclassicdesign.Thetablefeaturesasolidwoodconstructionwithasmooth,polishedsurfa.webp\" class=\"fr-fil fr-dib\" alt=\"\"></div></strong></div><div><strong>擁抱冬日的溫暖舒適感！</strong></div><div>【冬季新品】加絨寬鬆保暖睡衣專為寒冷季節設計，選用柔軟加絨面料，提供絕佳的保暖效果與親膚觸感。經典寬鬆版型，不僅穿著舒適自在，還讓居家時光更加溫馨愜意。時尚簡約的設計風格，兼具實用與美感，是冬季居家的必備單品。</div><p><br></p><hr><h4><strong><sub>商品特色：</sub></strong></h4><ul><li style=\"list-style: revert;\"><strong>加絨面料</strong>：內層細膩加絨，保暖升級，觸感柔軟不刺激肌膚。</li><li style=\"list-style: revert;\"><strong>寬鬆版型</strong>：不拘束活動，輕鬆自在，適合各種身型。</li><li style=\"list-style: revert;\"><strong>防靜電處理</strong>：有效減少靜電干擾，讓穿著更舒適安心。</li><li style=\"list-style: revert;\"><strong>時尚配色</strong>：多款冬季流行色可選，提升居家質感。</li><li style=\"list-style: revert;\"><strong>易清潔材質</strong>：耐洗耐用，不易變形與褪色，長時間保持柔軟。<br><br><br></li><li style=\"list-style: revert;\"><h4 id=\"isPasted\"><strong><sub>材質與清潔方式：</sub></strong></h4><ul><li style=\"list-style: revert;\"><strong>材質</strong>：80%聚酯纖維，20%棉</li><li style=\"list-style: revert;\"><strong>清潔建議</strong>：可機洗，使用冷水及中性洗滌劑，避免高溫烘乾。</li></ul></li><li style=\"list-style: revert;\"><p>讓【冬季新品】加絨寬鬆保暖睡衣陪伴您度過每個溫暖的冬夜！</p></li></ul></body></html>",
                "sub_title": "",
                "content_json": [],
                "content_array": [],
                "preview_image": [
                  "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_s7s7s8scs8scs0sa_O1CN01bn739s1h3GmpNmHzO_!!2869234221-0-cib.jpg",
                  "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_sbs2s1s6s8s6s8s4_O1CN01rrLx3J1h3GmpzUrLl_!!2869234221-0-cib.jpg",
                  "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_s3ses5s5s1s3s2s5_O1CN01e4dkpv1h3GmqgUV8c_!!2869234221-0-cib.jpg",
                  "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_s6s9s5s6s0s6s8sd_O1CN01iqOErA1h3GmntlOY2_!!2869234221-0-cib.jpg",
                  "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_sbs9sbs9sbsasas2_O1CN01MyawEe1h3Gmq5MSH4_!!2869234221-0-cib.jpg",
                  "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_s1s1s9sfs1seses5_O1CN01JOq8A41h3GmpU8pmg_!!2869234221-0-cib.jpg"
                ]
              }
            },
            "preview_image": [
              "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_s7s7s8scs8scs0sa_O1CN01bn739s1h3GmpNmHzO_!!2869234221-0-cib.jpg",
              "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_sbs2s1s6s8s6s8s4_O1CN01rrLx3J1h3GmpzUrLl_!!2869234221-0-cib.jpg",
              "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_s3ses5s5s1s3s2s5_O1CN01e4dkpv1h3GmqgUV8c_!!2869234221-0-cib.jpg",
              "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_s6s9s5s6s0s6s8sd_O1CN01iqOErA1h3GmntlOY2_!!2869234221-0-cib.jpg",
              "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_sbs9sbs9sbsasas2_O1CN01MyawEe1h3Gmq5MSH4_!!2869234221-0-cib.jpg",
              "https://d3jnmi1tfjgtti.cloudfront.net/file/779474634/size1440_s*px$_s1s1s9sfs1seses5_O1CN01JOq8A41h3GmpU8pmg_!!2869234221-0-cib.jpg"
            ],
            "about_vouchers": [
              {
                "id": 1080,
                "for": "all",
                "code": "D0M8AL",
                "rule": "min_price",
                "type": "voucher",
                "title": "demo 0321",
                "value": "50",
                "device": [
                  "normal"
                ],
                "forKey": [],
                "method": "fixed",
                "status": 1,
                "target": "all",
                "userID": 122538856,
                "endDate": "",
                "endTime": "",
                "overlay": false,
                "trigger": "code",
                "counting": "single",
                "ruleValue": 1000,
                "startDate": "2025-03-27",
                "startTime": "13:00",
                "reBackType": "discount",
                "targetList": [],
                "end_ISO_Date": "",
                "macroLimited": 0,
                "microLimited": 0,
                "rebateEndDay": "30",
                "conditionType": "order",
                "start_ISO_Date": "2025-03-27T05:00:00.000Z",
                "includeDiscount": "before",
                "productOffStart": "price_desc"
              },
              {
                "id": 1076,
                "for": "all",
                "code": "",
                "rule": "min_price",
                "type": "voucher",
                "title": "demo 0320",
                "value": "30",
                "device": [
                  "normal"
                ],
                "forKey": [],
                "method": "fixed",
                "status": 1,
                "target": "all",
                "userID": 122538856,
                "endDate": "",
                "endTime": "",
                "overlay": true,
                "trigger": "auto",
                "counting": "single",
                "ruleValue": 1680,
                "startDate": "2025-03-20",
                "startTime": "11:00",
                "reBackType": "discount",
                "targetList": [],
                "end_ISO_Date": "",
                "macroLimited": 0,
                "microLimited": 0,
                "rebateEndDay": "30",
                "conditionType": "order",
                "start_ISO_Date": "2025-03-20T03:00:00.000Z",
                "includeDiscount": "before",
                "productOffStart": "price_desc"
              },
              {
                "id": 1060,
                "for": "all",
                "code": "SLV192",
                "rule": "min_price",
                "type": "voucher",
                "title": "滿額一千折200元優惠券",
                "value": "200",
                "device": [
                  "normal",
                  "pos"
                ],
                "forKey": [],
                "method": "fixed",
                "status": 1,
                "target": "all",
                "userID": 122538856,
                "endDate": "",
                "endTime": "",
                "overlay": false,
                "trigger": "code",
                "counting": "single",
                "ruleValue": 1000,
                "startDate": "2025-03-05",
                "startTime": "16:00",
                "reBackType": "discount",
                "targetList": [],
                "end_ISO_Date": "",
                "macroLimited": 0,
                "microLimited": 0,
                "rebateEndDay": "30",
                "conditionType": "order",
                "start_ISO_Date": "2025-03-05T08:00:00.000Z",
                "includeDiscount": "before",
                "productOffStart": "price_desc"
              }
            ],
            "ai_description": "",
            "active_schedule": {
              "startDate": "2025-02-21",
              "startTime": "10:00",
              "start_ISO_Date": "2025-02-21T02:00:00.000Z"
            },
            "multi_sale_price": [
              {
                "key": "s9sas5s5s0s3s8s6",
                "type": "level",
                "variants": [
                  {
                    "spec": [
                      "白"
                    ],
                    "price": 590
                  },
                  {
                    "spec": [
                      "米白"
                    ],
                    "price": 590
                  },
                  {
                    "spec": [
                      "灰"
                    ],
                    "price": 590
                  }
                ]
              },
              {
                "key": "s3s8s5s2sbsas9sd",
                "type": "level",
                "variants": [
                  {
                    "spec": [
                      "白"
                    ],
                    "price": 590
                  },
                  {
                    "spec": [
                      "米白"
                    ],
                    "price": 590
                  },
                  {
                    "spec": [
                      "灰"
                    ],
                    "price": 590
                  }
                ]
              },
              {
                "key": "store_kqtwki",
                "type": "store",
                "variants": [
                  {
                    "spec": [
                      "白"
                    ],
                    "price": 561
                  },
                  {
                    "spec": [
                      "米白"
                    ],
                    "price": 561
                  },
                  {
                    "spec": [
                      "灰"
                    ],
                    "price": 561
                  }
                ]
              },
              {
                "key": "store_gdon2o",
                "type": "store",
                "variants": [
                  {
                    "spec": [
                      "白"
                    ],
                    "price": 581
                  },
                  {
                    "spec": [
                      "米白"
                    ],
                    "price": 581
                  },
                  {
                    "spec": [
                      "灰"
                    ],
                    "price": 581
                  }
                ]
              }
            ],
            "product_category": "commodity",
            "relative_product": [],
            "designated_logistics": {
              "list": [],
              "type": "all"
            },
            "live_model": {
              "stock": 92,
              "available_Qty": 92,
              "min_price": 590,
              "max_price": null,
              "min_live_price": 590,
              "max_live_price": 590,
              "min_limit": 1,
              "max_limit": 590
            }
          },
          "created_time": "2025-03-19T03:44:06.000Z",
          "updated_time": "2025-03-19T03:44:06.000Z",
          "status": 1,
          "total_sales": 5,
          "halfSelected": true,
          "selected": false,
          "expand": true
        }
      ],
      "stock": {
        "reserve": true,
        "expiry_date": "2025-03-28",
        "period": "1"
      },
      "discount_set": "false",
      "lineGroup": {
        "groupId": "",
        "groupName": ""
      },
      "start_date": "2025-03-27",
      "start_time": "14:09",
      "end_date": "2025-03-28",
      "end_time": "14:09"
    }
    viewModel.formData = testData;
    let streamingData: StreamingData = {
      orders:0,
      page_id:"",
      live_id:"",
      title:"",
      accessToken:"",
      comments:[],
      amount:0,
      after:"",
    };
    let options: { value: any; title: any }[] = [];
    let collectLoading = true;
    let dialogShow = false;
    let editItemList = false;
    let pageLoading = true;
    const stockExpired = [
      {
        title: '一日',
        value: '1',
      },
      {
        title: '三日',
        value: '3',
      },
      {
        title: '自定到期日',
        value: '-1',
      },
    ];
    const htmlText = {
      title: group_buy ? '建立團購' : '建立直播',
      section: {
        title: group_buy ? '團購設定' : '直播設定',
      },
    };

    function drawPurposeSelect() {
      return (
        BgWidget.mainCard(html`
          <div  style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
            ${gvc.bindView({
              bind: `purposeSelect`,
              view: () => {
                const dataArray = [
                  {
                    text: '商家自用',
                    hint: '自行進行團購',
                    value: 'self',
                  },
                  {
                    text: '合作推廣',
                    hint: '與網紅、KOL及創作者等合作推廣並提升銷售',
                    value: 'collaboration',
                  },
                ];
                const icon = '';
                return dataArray
                  .map(data => {
                    return html`
                      <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 4px;">
                        <div style="display: flex;align-items: center;gap: 6px;">
                          <div
                            style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;background: #FFF;cursor: pointer;"
                          ></div>
                          <div>${data.text}</div>
                        </div>
                        <div
                          style="color: #8D8D8D;display: flex;padding-left: 22px;align-items: flex-start;gap: 14px;align-self: stretch;"
                        >
                          ${data.hint}
                        </div>
                      </div>
                    `;
                  })
                  .join('');
              },
              divCreate: {
                style: `display: flex;flex-direction: column;align-items: flex-start;gap: 12px;`,
              },
            })}
          </div>
        `) + `<div style="margin-top:24px"></div>`
      );
    }

    return BgWidget.container(html`
      <div class="title-container">
        ${BgWidget.goBack(
          gvc.event(() => {
            vm.type = 'list';
          })
        )}
        ${BgWidget.title(htmlText.title)}
      </div>
      ${BgWidget.container1x2(
        {
          html: html`
            ${BgWidget.mainCard(html`
              ${gvc.bindView({
                bind: `setting`,
                view: () => {
                  if (group_buy) {
                    return html`
                      <div style="font-size: 16px;font-weight: 700;">${htmlText.section.title}</div>
                      <div style="display: flex;align-items: flex-start;gap: 18px;align-self: stretch;">
                        <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;flex: 1 0 0;">
                          <div style="font-size: 16px;font-style: normal;font-weight: 400;">團購名稱</div>
                          <input
                            style="display: flex;padding:9px 18px;align-items: center;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;"
                            value="${viewModel.formData.name ?? ''}"
                            placeholder="請輸入團購名稱"
                            onchange="${gvc.event(e => {
                              viewModel.formData.name = e.value;
                              gvc.notifyDataChange('summary');
                            })}"
                          />
                        </div>
                        <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;flex: 1 0 0;">
                          <div style="font-size: 16px;font-style: normal;">團購平台</div>
                          <div class="w-100" style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;">
                            <select class="w-100 border-0">
                              <option value="LINE">LINE</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div
                        style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;"
                      >
                        <div
                          style="display: flex;flex-direction: column;align-items: flex-start;gap: 4px;align-self: stretch;"
                        >
                          <div
                            class="d-flex "
                            style="color:#393939;font-size: 16px;font-weight: 400;gap:5px;align-items: end;"
                          >
                            團購群組
                            <div
                              
                              style="color: #4D86DB;font-size: 14px;font-weight: 400; line-height: normal;cursor: pointer;"
                              onclick="${gvc.event(() => {
                                vm.type = 'add';
                              })}"
                            >
                              刷新群組
                            </div>
                          </div>
                          <div style="display: flex;align-items: flex-start;gap: 4px;align-self: stretch;">
                            <div
                              class="w-100"
                              style="display: flex;align-items: flex-start;gap: 4px;align-self: stretch;"
                            >
                              <div
                                style="flex: 1 0 0;color: #8D8D8D;font-size: 14px; font-weight: 400; line-height: normal;"
                              >
                                請先將團購小幫手新增至欲進行團購的群組並完成綁定
                              </div>
                              <div
                                style="color: #4D86DB;font-size: 14px;font-weight: 400; line-height: normal;cursor: pointer;"
                                onclick="${gvc.event(() => {
                                  let code = '搜尋中...';
                                  gvc.glitter.innerDialog((gvc: GVC) => {
                                    ApiShop.getVerificationCode().then((r: any) => {
                                      code = r.response;
                                      gvc.notifyDataChange('oauth');
                                    });
                                    return gvc.bindView({
                                      bind: `oauth`,
                                      view: () => {
                                        return html`
                                          <div
                                            class="position-relative d-flex align-items-center justify-content-center"
                                            style="width: 499px;height: 411px;border-radius: 10px;background: #FFF;"
                                          >
                                            <svg
                                              style="position: absolute;right: 20px;top:17px;"
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              onclick="${gvc.event(() => {
                                                gvc.closeDialog();
                                              })}"
                                            >
                                              <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round" />
                                              <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round" />
                                            </svg>
                                            <div
                                              style="display: flex;width: 247px;flex-direction: column;align-items: center;gap: 24px;"
                                            >
                                              <div style="font-size: 24px;font-weight: 700;">團購小幫手QRcode</div>
                                              <img
                                                src="https://qr-official.line.me/sid/L/413ehous.png"
                                                ,
                                                alt="QRCode"
                                              />
                                              <div
                                                style="display: flex;flex-direction: column;justify-content: center;align-items: center;gap: 2px;"
                                              >
                                                <div style="display: flex;align-items: center;gap: 6px;">
                                                  <div style="font-size: 16px;font-weight: 400;">驗證碼 : ${code}</div>
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="15"
                                                    height="17"
                                                    viewBox="0 0 15 17"
                                                    fill="none"
                                                    onclick="${gvc.event(() => {
                                                      navigator.clipboard.writeText(code);
                                                      dialog.successMessage({ text: '已複製至剪貼簿' });
                                                    })}"
                                                  >
                                                    <g clip-path="url(#clip0_17404_206209)">
                                                      <path
                                                        d="M10.6277 2.3825L10.621 2.37581H10.6115H6.28145C5.99691 2.37581 5.76386 2.60663 5.76386 2.88927V10.7354C5.76386 11.0181 5.99691 11.2489 6.28145 11.2489H12.2155C12.5001 11.2489 12.7331 11.0181 12.7331 10.7354V4.47996V4.47034L12.7263 4.46357L10.6277 2.3825ZM13.7415 3.45733L13.7415 3.45734C14.0154 3.72892 14.1705 4.09696 14.1705 4.47996V10.7354C14.1705 11.8044 13.294 12.6739 12.2155 12.6739H6.28145C5.20301 12.6739 4.3265 11.8044 4.3265 10.7354V2.88927C4.3265 1.82029 5.20301 0.950811 6.28145 0.950811H10.6146C11.0009 0.950811 11.3722 1.10469 11.646 1.37627L13.7415 3.45733ZM0.370459 6.81235C0.370459 5.74336 1.24696 4.87389 2.3254 4.87389H3.29134V6.29889H2.3254C2.04086 6.29889 1.80782 6.52971 1.80782 6.81235V14.6585C1.80782 14.9411 2.04086 15.172 2.3254 15.172H8.25947C8.54401 15.172 8.77705 14.9411 8.77705 14.6585V13.7008H10.2144V14.6585C10.2144 15.7275 9.33791 16.597 8.25947 16.597H2.3254C1.24696 16.597 0.370459 15.7275 0.370459 14.6585V6.81235Z"
                                                        fill="#393939"
                                                        stroke="white"
                                                        stroke-width="0.0461539"
                                                      />
                                                    </g>
                                                    <defs>
                                                      <clipPath id="clip0_17404_206209">
                                                        <rect
                                                          width="13.8462"
                                                          height="15.6923"
                                                          fill="white"
                                                          transform="translate(0.346542 0.925781)"
                                                        />
                                                      </clipPath>
                                                    </defs>
                                                  </svg>
                                                </div>
                                                <div style="color: #8D8D8D;font-size: 14px;font-weight: 400;">
                                                  將用於綁定LINE群組和商店的驗證碼
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        `;
                                      },
                                      divCreate: {
                                        class: `h-100 w-100 d-flex align-items-center justify-content-center`,
                                      },
                                    });
                                  }, 'oauth');
                                })}"
                              >
                                團購小幫手QRcode
                              </div>
                            </div>
                          </div>
                        </div>
                        ${gvc.bindView({
                          bind: 'getLineGroup',
                          view: () => {
                            if (viewModel.lineGroupLoading) {
                              ApiShop.getLineGroup().then((r: any) => {
                                viewModel.lineGroup = r.response;
                                viewModel.lineGroupLoading = false;
                                viewModel.formData.lineGroup.groupId = viewModel.lineGroup[0].group_id;
                                viewModel.formData.lineGroup.groupName = viewModel.lineGroup[0].group_name;
                                gvc.notifyDataChange(['getLineGroup', 'summary']);
                              });
                              return html`
                                <select class="border-0 w-100" >
                                  <option>團購群組搜尋中</option>
                                </select>
                              `;
                            } else {
                              return html`
                                <select
                                  class="border-0 w-100"
                                  
                                  onchange="${gvc.event(e => {
                                    viewModel.formData.lineGroup.groupId = viewModel.lineGroup[e.value].group_id;
                                    viewModel.formData.lineGroup.groupName = viewModel.lineGroup[e.value].group_name;
                                    gvc.notifyDataChange('summary');
                                  })}"
                                >
                                  ${(() => {
                                    if (viewModel.lineGroup.length == 0) {
                                      return html` <option>此商店尚未綁定LINE群組</option>`;
                                    }
                                    return viewModel.lineGroup
                                      .map((group: any, index: number) => {
                                        return html` <option value="${index}">${group.group_name}</option> `;
                                      })
                                      .join('');
                                  })()}
                                </select>
                              `;
                            }
                          },
                          divCreate: {
                            style:
                              'display: flex;padding: 9px 18px;align-items: flex-start;gap: 10px;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;',
                          },
                        })}
                      </div>
                      <div
                        style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;gap: 18px;flex: 1 0 0;"
                      >
                        <div
                          style="display: flex;flex-direction: column;align-items: flex-start;gap: 4px;font-size: 16px;font-weight: 700;"
                        >
                          團購時間
                        </div>
                        <div
                          style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;align-self: stretch;"
                        >
                          <div style="font-size: 16px;font-weight: 400;">開始時間</div>
                          <div style="display: flex;align-items: flex-start;gap: 18px;align-self: stretch;">
                            <input
                              style="display: flex;padding: 9px 18px;align-items: center;flex: 1 0 0;border-radius: 10px;border: 1px solid #DDD;"
                              value="${viewModel.formData.start_date}"
                              type="date"
                              onchange="${gvc.event(e => {
                                viewModel.formData.start_date = e.value;
                                gvc.notifyDataChange('summary');
                              })}"
                              disabled
                            />
                            <input
                              style="display: flex;padding: 9px 18px;align-items: center;flex: 1 0 0;border-radius: 10px;border: 1px solid #DDD;"
                              value="${viewModel.formData.start_time}"
                              type="time"
                              onchange="${gvc.event(e => {
                                viewModel.formData.start_time = e.value;
                                gvc.notifyDataChange('summary');
                              })}"
                              disabled
                            />
                          </div>
                        </div>
                        <div
                          style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;align-self: stretch;"
                        >
                          <div style="font-size: 16px;font-weight: 400;">結束時間</div>
                          <div style="display: flex;align-items: flex-start;gap: 18px;align-self: stretch;">
                            <input
                              style="display: flex;padding: 9px 18px;align-items: center;flex: 1 0 0;border-radius: 10px;border: 1px solid #DDD;"
                              value="${viewModel.formData.end_date}"
                              type="date"
                              onchange="${gvc.event(e => {
                                viewModel.formData.end_date = e.value;
                                gvc.notifyDataChange('summary');
                              })}"
                            />
                            <input
                              style="display: flex;padding: 9px 18px;align-items: center;flex: 1 0 0;border-radius: 10px;border: 1px solid #DDD;"
                              value="${viewModel.formData.end_time}"
                              type="time"
                              onchange="${gvc.event(e => {
                                viewModel.formData.end_time = e.value;
                                gvc.notifyDataChange('summary');
                              })}"
                            />
                          </div>
                        </div>
                      </div>
                    `;
                  } else {
                    return html` <div style="font-size: 16px;font-weight: 700;">${htmlText.section.title}</div>
                      <div style="display: flex;align-items: flex-start;gap: 18px;">
                        ${(() => {
                          const data = [
                            {
                              title: '直播名稱',
                              name: 'name',
                              placeholder: '請輸入直播名稱',
                            },
                            {
                              title: '直播主',
                              name: 'streamer',
                              placeholder: '請輸入直播主',
                            },
                          ];
                          return data.map(dd => {
                            return html`
                              <div
                                style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;flex: 1 0 0;"
                              >
                                <div style="font-size: 16px;font-weight: 400;">${dd.title}</div>
                                <input
                                  style="display: flex;padding:9px 18px;align-items: center;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;"
                                  placeholder="${dd.placeholder}"
                                  onchange="${gvc.event(e => {
                                    (viewModel.formData as any)[dd.name] = e.value;
                                    gvc.notifyDataChange('summary');
                                  })}"
                                />
                              </div>
                            `;
                          });
                        })()}
                      </div>
                      <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                        <div style="font-size: 16px;font-style: normal;">直播平台</div>
                        <div class="w-100" style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;">
                          <select class="w-100 border-0">
                            <option value="Facebook">Facebook</option>
                          </select>
                        </div>
                      </div>`;
                  }
                },
                divCreate: {
                  class: `d-flex flex-column`,
                  style: `gap: 18px;`,
                },
              })}
            `)}
            <div style="margin-top:24px"></div>
            ${BgWidget.mainCard(
              gvc.bindView({
                bind: 'itemBlock',
                view: () => {
                  return html`
                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 4px;">
                      <div style="font-size: 16px;font-style: normal;font-weight: 700;">
                        ${group_buy ? `團購商品` : `直播商品`}
                      </div>
                      <div style="color: #8D8D8D;font-size: 14px;font-weight: 400; line-height: normal;">
                        若想為此次直播建立獨家商品，請先前往「隱形商品」新增
                      </div>
                    </div>
                    <div
                      style="display: flex;padding: 0 0 12px 4px;justify-content: center;align-items: center;gap: 18px;align-self: stretch;border-bottom: 1px solid #DDD;background: #FFF;"
                    >
                      ${(() => {
                        editItemList = viewModel.formData.item_list.filter(item => item.selected).length > 0;
                        if (editItemList) {
                          return html`
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              style="cursor: pointer;"
                              viewBox="0 0 16 16"
                              fill="none"
                              onclick="${gvc.event(() => {
                                viewModel.formData.item_list.map((item: any) => {
                                  item.selected = false;
                                });
                                editItemList = false;
                                gvc.notifyDataChange('itemBlock');
                              })}"
                            >
                              <rect width="16" height="16" rx="3" fill="#393939" />
                              <path
                                d="M4.5 8.5L7 11L11.5 5"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                            <div class="flex-grow-1" style="font-size: 14px;font-style: normal;font-weight: 700;">
                              已選取${viewModel.formData.item_list.filter(item => item.selected).length}項
                            </div>
                            <div class="d-flex" style="font-size: 14px;gap:12px;">
                              <div
                                style="padding: 4px 14px;border-radius: 7px;border: 1px solid #DDD;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);cursor: pointer;"
                                onclick="${gvc.event(() => {
                                  ProductSetting.showBatchEditDialogWithLive({
                                    gvc: gvc,
                                    selected: viewModel.formData.item_list.filter(item => item.selected),
                                    callback: () => {
                                      gvc.notifyDataChange('itemBlock');
                                    },
                                  });
                                })}"
                              >
                                批量編輯
                              </div>
                              <div
                                style="padding: 4px 14px;border-radius: 7px;border: 1px solid #DDD;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.10);cursor: pointer;"
                                onclick="${gvc.event(() => {
                                  viewModel.formData.item_list = viewModel.formData.item_list.filter(
                                    item => !item.selected
                                  );
                                  gvc.notifyDataChange('itemBlock');
                                })}"
                              >
                                刪除
                              </div>
                            </div>
                          `;
                        } else {
                          return html`
                            <div
                              style="width: 16px;height: 16px;flex-shrink: 0;border-radius: 3px;border: 1px solid #DDD;cursor: pointer;"
                              onclick="${gvc.event(() => {
                                if (viewModel.formData.item_list.length > 0) {
                                  viewModel.formData.item_list.map((item: any) => {
                                    item.selected = true;
                                  });
                                  editItemList = true;
                                  gvc.notifyDataChange('itemBlock');
                                }
                              })}"
                            ></div>
                            <div
                              class="flex-grow-1"
                              style="color: #393939;font-size: 16px; font-weight: 400; line-height: normal;"
                            >
                              商品名稱
                            </div>
                            <div
                              class="position-relative"
                              style="display: flex;width: 100px;height: 34px;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;background: #EAEAEA;font-size: 16px;font-style: normal;font-weight: 400;cursor:pointer;"
                              onclick="${gvc.event(() => {
                                dialogShow = !dialogShow;
                                gvc.notifyDataChange('selectProductType');
                              })}"
                            >
                              選擇商品
                              ${gvc.bindView({
                                bind: `selectProductType`,
                                view: () => {
                                  let type = 'product';

                                  function setItemList(item_list: any) {
                                    viewModel.formData.item_list.push(...item_list);
                                    viewModel.formData.item_list = item_list;
                                    gvc.notifyDataChange('item_list');
                                  }

                                  function selectProductType(itemList: any) {
                                    let confirm = true;
                                    let searchLoading: any = false;
                                    (window.parent as any).glitter.innerDialog(
                                      (gvc: GVC) => {
                                        newOrder.query = '';
                                        newOrder.search = '';
                                        newOrder.productArray = [];
                                        let viewModel = {
                                          step: 1,
                                          collection: '',
                                          id: gvc.glitter.getUUID(),
                                        };
                                        return gvc.bindView({
                                          bind: 'addDialog',
                                          dataList: [
                                            {
                                              obj: viewModel,
                                              key: 'step',
                                            },
                                          ],
                                          view: () => {
                                            function replaceProducts(oriData: any, replaceData: any) {
                                              replaceData.forEach((data: any) => {
                                                let findProduct = oriData.find((item: any) => item.id == data.id);
                                                findProduct.selected =
                                                  findProduct.content.variants.length == data.content.variants.length;
                                                data.content.variants.forEach((variant: any) => {
                                                  let index = findProduct.content.variants.findIndex(
                                                    (item: any) => item.spec.join('') == variant.spec.join('')
                                                  );
                                                  if (index !== -1) {
                                                    findProduct.content.variants[index] = variant;
                                                  }
                                                });
                                              });
                                            }

                                            let width = window.innerWidth > 1100 ? '80vw' : '70vw';
                                            let gap = window.innerWidth > 1100 ? '32' : '24';
                                            let step1Check = false;

                                            switch (viewModel.step) {
                                              case 3: {
                                                let autoGenerate = false;
                                                let gap = window.innerWidth > 1100 ? '70' : '50';
                                                return html` <div
                                                  style="display: flex;width: ${width};flex-direction: column;align-items: flex-start;gap: 18px;border-radius: 10px;background: #FFF;"
                                                >
                                                  <div
                                                    class="w-100"
                                                    style="display: flex;height: 46px;padding: 20px 20px 12px;align-items: center;align-self: stretch;color: #393939;font-size: 16px;font-weight: 700;"
                                                  >
                                                    步驟3. 新增關鍵字
                                                    <div
                                                      class="ms-auto"
                                                      style="cursor: pointer;"
                                                      onclick="${gvc.event(() => {
                                                        gvc.glitter.closeDiaLog();
                                                      })}"
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 14 14"
                                                        fill="none"
                                                      >
                                                        <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round" />
                                                        <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round" />
                                                      </svg>
                                                    </div>
                                                  </div>
                                                  <div
                                                    class="w-100 d-flex align-items-center justify-content-between"
                                                    style="padding: 0 20px;"
                                                  >
                                                    <div class="d-flex align-items-center" style="gap:6px">
                                                      <div style="font-size: 16px;font-weight: 400;">
                                                        可手動輸入關鍵字，或選擇快速生成
                                                      </div>
                                                      ${BgWidget.generateTooltipButton(
                                                        gvc,
                                                        html`
                                                          <div class="d-flex flex-column">
                                                            <div
                                                              
                                                              style="width: 100vw;height: 100vh;position: fixed;left: 0;top: 0"
                                                              onclick="${gvc.event(() => {})}"
                                                            ></div>
                                                            <div
                                                              style="width: 521px;padding: 10px;border-radius: 10px;background: #393939;display: flex;padding: 10px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 16px;"
                                                            >
                                                              <div class="tx_normal  text-white text-wrap">
                                                                <div class="text-wrap ">
                                                                  關鍵字用於快速下單，建議精簡，例如：使用字母表示商品、數字區分規格（如
                                                                  A01），並同時設置大小寫（如 A01 ,
                                                                  a01）以降低輸入錯誤率，也可加入簡短的商品名稱，利於辨識。
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        `
                                                      )}
                                                    </div>
                                                    <div
                                                      style="display: flex;align-items: center;gap: 4px;cursor:pointer"
                                                      onclick="${gvc.event(() => {
                                                        if (autoGenerate) {
                                                          return;
                                                        }
                                                        autoGenerate = true;
                                                        for (let i = 0; i < newOrder.productTemp.length; i++) {
                                                          const lowerCase = String.fromCharCode(97 + i);
                                                          const upperCase = String.fromCharCode(65 + i);
                                                          for (
                                                            let j = 0;
                                                            j < newOrder.productTemp[i].content.variants.length;
                                                            j++
                                                          ) {
                                                            newOrder.productTemp[i].content.variants[j].live_keyword =
                                                              [];
                                                            newOrder.productTemp[i].content.variants[
                                                              j
                                                            ].live_keyword.push(`${lowerCase}0${j + 1}`);
                                                            newOrder.productTemp[i].content.variants[
                                                              j
                                                            ].live_keyword.push(`${upperCase}0${j + 1}`);
                                                          }
                                                        }
                                                        gvc.notifyDataChange('productArray');
                                                      })}"
                                                    >
                                                      <div
                                                        style="color: #4D86DB;font-size: 16px;font-weight: 400; line-height: normal;"
                                                      >
                                                        快速生成
                                                      </div>
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 16 16"
                                                        fill="none"
                                                      >
                                                        <g clip-path="url(#clip0_16519_2703)">
                                                          <path
                                                            d="M6.51944 2.07478L5.47222 2.46645C5.38889 2.49701 5.33333 2.57756 5.33333 2.66645C5.33333 2.75534 5.38889 2.83589 5.47222 2.86645L6.51944 3.25812L6.91111 4.30534C6.94167 4.38867 7.02222 4.44423 7.11111 4.44423C7.2 4.44423 7.28056 4.38867 7.31111 4.30534L7.70278 3.25812L8.75 2.86645C8.83333 2.83589 8.88889 2.75534 8.88889 2.66645C8.88889 2.57756 8.83333 2.49701 8.75 2.46645L7.70278 2.07478L7.31111 1.02756C7.28056 0.944227 7.2 0.888672 7.11111 0.888672C7.02222 0.888672 6.94167 0.944227 6.91111 1.02756L6.51944 2.07478ZM12.8167 2.22201L13.7778 3.18312L10.7278 6.23034L9.76667 5.26923L12.8167 2.22201ZM2.22222 12.8164L8.825 6.21367L9.78611 7.17478L3.18333 13.7776L2.22222 12.8164ZM11.8722 1.28034L1.28056 11.872C0.761111 12.3914 0.761111 13.2359 1.28056 13.7581L2.24167 14.7192C2.76111 15.2387 3.60556 15.2387 4.12778 14.7192L14.7194 4.12478C15.2389 3.60534 15.2389 2.76089 14.7194 2.23867L13.7583 1.28034C13.2389 0.760894 12.3944 0.760894 11.8722 1.28034ZM0.208333 4.14423C0.0833333 4.19145 0 4.31089 0 4.44423C0 4.57756 0.0833333 4.69701 0.208333 4.74423L1.77778 5.33312L2.36667 6.90256C2.41389 7.02756 2.53333 7.11089 2.66667 7.11089C2.8 7.11089 2.91944 7.02756 2.96667 6.90256L3.55556 5.33312L5.125 4.74423C5.25 4.69701 5.33333 4.57756 5.33333 4.44423C5.33333 4.31089 5.25 4.19145 5.125 4.14423L3.55556 3.55534L2.96667 1.98589C2.91944 1.86089 2.8 1.77756 2.66667 1.77756C2.53333 1.77756 2.41389 1.86089 2.36667 1.98589L1.77778 3.55534L0.208333 4.14423ZM9.98611 11.2553C9.86111 11.3026 9.77778 11.422 9.77778 11.5553C9.77778 11.6887 9.86111 11.8081 9.98611 11.8553L11.5556 12.4442L12.1444 14.0137C12.1917 14.1387 12.3111 14.222 12.4444 14.222C12.5778 14.222 12.6972 14.1387 12.7444 14.0137L13.3333 12.4442L14.9028 11.8553C15.0278 11.8081 15.1111 11.6887 15.1111 11.5553C15.1111 11.422 15.0278 11.3026 14.9028 11.2553L13.3333 10.6664L12.7444 9.097C12.6972 8.972 12.5778 8.88867 12.4444 8.88867C12.3111 8.88867 12.1917 8.972 12.1444 9.097L11.5556 10.6664L9.98611 11.2553Z"
                                                            fill="#4D86DB"
                                                          />
                                                        </g>
                                                        <defs>
                                                          <clipPath id="clip0_16519_2703">
                                                            <rect
                                                              width="16"
                                                              height="14.2222"
                                                              fill="white"
                                                              transform="translate(0 0.888672)"
                                                            />
                                                          </clipPath>
                                                        </defs>
                                                      </svg>
                                                    </div>
                                                  </div>
                                                  <div
                                                    class="w-100"
                                                    style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;"
                                                  >
                                                    <div
                                                      class="w-100"
                                                      style="display: flex;padding: 0 24px;flex-direction: column;align-items: center;gap: 18px;"
                                                    >
                                                      ${gvc.bindView({
                                                        bind: viewModel.id,
                                                        view: () => {
                                                          return gvc.bindView({
                                                            bind: 'productArray',
                                                            view: () => {
                                                              if (newOrder.productTemp.length == 0) {
                                                                return html` <div
                                                                  class="w-100 h-100 d-flex align-items-center justify-content-center"
                                                                  style="color:#8D8D8D;"
                                                                >
                                                                  沒選擇任何商品，請退往上一步
                                                                </div>`;
                                                              }
                                                              const titleRow = [
                                                                {
                                                                  width: '400px',
                                                                  title: '商品名稱',
                                                                  align: 'left',
                                                                },
                                                                {
                                                                  width: '70px',
                                                                  title: '商品規格',
                                                                },
                                                                {
                                                                  width: '50%',
                                                                  title: '每人限購',
                                                                  align: 'left',
                                                                },
                                                              ];

                                                              return html`
                                                                <div
                                                                  class="d-flex w-100 align-items-center flex-column"
                                                                  style="height: 40px;padding: 9px 4px;gap: 18px;flex-shrink: 0;"
                                                                >
                                                                  <div
                                                                    class="d-flex w-100 align-items-center"
                                                                    style="padding: 12px 4px;gap: ${gap}px;border-bottom: 1px solid #DDD;"
                                                                  >
                                                                    ${titleRow
                                                                      .map((item, index) => {
                                                                        return html`
                                                                          <div
                                                                            class=" ${index == 2
                                                                              ? `flex-fill ms-2`
                                                                              : `flex-shrink-0`}"
                                                                            style="width: ${item.width};text-align: ${item.align
                                                                              ? item.align
                                                                              : 'center'}"
                                                                          >
                                                                            ${index == 2
                                                                              ? html`
                                                                                  <div
                                                                                    class="w-100"
                                                                                    style="color: #393939;font-size: 16px;"
                                                                                  >
                                                                                    關鍵字
                                                                                    <span
                                                                                      style="color: #8D8D8D;font-size: 14px;"
                                                                                      >(輸入完請按enter)</span
                                                                                    >
                                                                                  </div>
                                                                                `
                                                                              : item.title}
                                                                          </div>
                                                                        `;
                                                                      })
                                                                      .join('')}
                                                                  </div>

                                                                  ${newOrder.productTemp
                                                                    .map((product: any, productIndex: number) => {
                                                                      return gvc.bindView({
                                                                        bind: `product${productIndex}`,
                                                                        view: () => {
                                                                          const variants = product.content.variants;

                                                                          function drawRow(variant?: any) {
                                                                            return html`
                                                                              <div
                                                                                class=" text-left d-flex align-items-center flex-shrink-0"
                                                                                style="width: ${titleRow[0]
                                                                                  .width};${variant
                                                                                  ? 'padding-left:38px;'
                                                                                  : ''}"
                                                                              >
                                                                                <div
                                                                                  class="flex-shrink-0"
                                                                                  style="width: 50px;height: 50px;border-radius: 5px;background: url('${variant
                                                                                    ? variant.preview_image
                                                                                    : product.content
                                                                                        .preview_image[0]}') lightgray 50% / cover no-repeat;"
                                                                                ></div>
                                                                                <div
                                                                                  class="flex-fill h-100 d-flex align-items-center  text-left"
                                                                                  style="color:#393939;font-size: 16px;font-weight: 400;margin-bottom: 4px;padding-left:12px;white-space: normal;word-break: break-all;"
                                                                                >
                                                                                  ${variant
                                                                                    ? variant.spec.join(',')
                                                                                    : product.content.title}
                                                                                </div>
                                                                                ${(() => {
                                                                                  if (!variant) {
                                                                                    if (variants.length > 1) {
                                                                                      if (product.expand) {
                                                                                        return html`
                                                                                          <div
                                                                                            class="h-100 flex-shrink-0 d-flex align-items-center"
                                                                                            style="width:22px;cursor: pointer;padding-left:8px;"
                                                                                            onclick="${gvc.event(() => {
                                                                                              product.expand = false;
                                                                                              gvc.notifyDataChange(
                                                                                                `product${productIndex}`
                                                                                              );
                                                                                            })}"
                                                                                          >
                                                                                            <svg
                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                              width="13"
                                                                                              height="8"
                                                                                              viewBox="0 0 13 8"
                                                                                              fill="none"
                                                                                            >
                                                                                              <path
                                                                                                d="M12 6.5L6.5 1.5L1 6.5"
                                                                                                stroke="#393939"
                                                                                                stroke-width="2"
                                                                                                stroke-linecap="round"
                                                                                                stroke-linejoin="round"
                                                                                              />
                                                                                            </svg>
                                                                                          </div>
                                                                                        `;
                                                                                      } else {
                                                                                        return html`
                                                                                          <div
                                                                                            class="h-100 flex-shrink-0 d-flex align-items-center"
                                                                                            style="width:22px;cursor: pointer;padding-left:8px;"
                                                                                            onclick="${gvc.event(() => {
                                                                                              product.expand = true;

                                                                                              gvc.notifyDataChange(
                                                                                                `product${productIndex}`
                                                                                              );
                                                                                            })}"
                                                                                          >
                                                                                            <svg
                                                                                              style=" cursor: pointer;"
                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                              width="13"
                                                                                              height="8"
                                                                                              viewBox="0 0 13 8"
                                                                                              fill="none"
                                                                                            >
                                                                                              <path
                                                                                                d="M12 1.5L6.5 6.5L1 1.5"
                                                                                                stroke="#393939"
                                                                                                stroke-width="2"
                                                                                                stroke-linecap="round"
                                                                                                stroke-linejoin="round"
                                                                                              />
                                                                                            </svg>
                                                                                          </div>
                                                                                        `;
                                                                                      }
                                                                                    } else {
                                                                                      return html`
                                                                                        <div
                                                                                          class="h-100 flex-shrink-0"
                                                                                          style="width:52px;cursor: pointer;"
                                                                                        ></div>
                                                                                      `;
                                                                                    }
                                                                                  } else {
                                                                                    return ``;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                              <!--   規格                                                                                                                                             商品規格-->
                                                                              <div
                                                                                class="text-center flex-shrink-0 h-100 d-flex align-items-center justify-content-center text-center"
                                                                                style="width: ${titleRow[1]
                                                                                  .width};font-size: 16px;font-style: normal;font-weight: 400;"
                                                                              >
                                                                                ${(() => {
                                                                                  if (variant) {
                                                                                    return `-`;
                                                                                  } else if (variants.length > 1) {
                                                                                    return html`${variants.length}個規格`;
                                                                                  } else {
                                                                                    return html`單一規格`;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                              <!--   關鍵字(輸入完請按enter)                                                                                                                                             商品規格-->
                                                                              <div
                                                                                class="h-100 d-flex flex-fill align-items-center justify-content-center text-center ms-2"
                                                                                style="width: ${titleRow[2]
                                                                                  .width};font-size: 16px;font-style: normal;font-weight: 400;${!variant &&
                                                                                variants.length > 1
                                                                                  ? ''
                                                                                  : 'border-radius: 10px;border: 1px solid #DDD;cursor: pointer;'} "
                                                                              >
                                                                                ${(() => {
                                                                                  if (!variant && variants.length > 1) {
                                                                                    return html` <div
                                                                                      class="w-100"
                                                                                    ></div>`;
                                                                                  } else {
                                                                                    return html` ${(() => {
                                                                                        const keywords = variant
                                                                                          ? (variant?.live_keyword ??
                                                                                            [])
                                                                                          : (variants[0]
                                                                                              ?.live_keyword ?? []);
                                                                                        if (keywords.length > 0) {
                                                                                          return html`
                                                                                            <div
                                                                                              class="d-flex justify-content-center"
                                                                                              style="gap:10px;padding: 0 18px;"
                                                                                            >
                                                                                              ${(() => {
                                                                                                return keywords
                                                                                                  .map(
                                                                                                    (keyword: any) => {
                                                                                                      return html` <div
                                                                                                        style="display: flex;padding: 1px 6px;justify-content: center;align-items: center;gap: 4px;border-radius: 5px;background: #F7F7F7;"
                                                                                                      >
                                                                                                        <div>
                                                                                                          ${keyword}
                                                                                                        </div>
                                                                                                        <div
                                                                                                          class="fa-solid fa-xmark ms-1 fs-5"
                                                                                                        ></div>
                                                                                                      </div>`;
                                                                                                    }
                                                                                                  )
                                                                                                  .join('');
                                                                                              })()}
                                                                                            </div>
                                                                                          `;
                                                                                        } else {
                                                                                          return '';
                                                                                        }
                                                                                      })()}
                                                                                      <input
                                                                                        class="w-100 border-0"
                                                                                        style="display: flex;height: 40px;align-items: center;border-radius: 10px;background: #FFF;"
                                                                                        placeholder=" 例如 : A01 , a01 , 商品名稱"
                                                                                        onkeydown="${gvc.event(
                                                                                          (e, event) => {
                                                                                            if (
                                                                                              event.key === 'Enter' &&
                                                                                              e.value.length > 1
                                                                                            ) {
                                                                                              if (variant) {
                                                                                                if (
                                                                                                  !variant?.live_keyword
                                                                                                ) {
                                                                                                  variant.live_keyword =
                                                                                                    [];
                                                                                                }
                                                                                                variant.live_keyword.push(
                                                                                                  e.value
                                                                                                );
                                                                                              } else if (
                                                                                                variants.length == 1
                                                                                              ) {
                                                                                                if (
                                                                                                  !variants[0]
                                                                                                    ?.live_keyword
                                                                                                ) {
                                                                                                  variants[0].live_keyword =
                                                                                                    [];
                                                                                                }
                                                                                                variants[0].live_keyword.push(
                                                                                                  e.value
                                                                                                );
                                                                                              }
                                                                                              gvc.notifyDataChange(
                                                                                                `product${productIndex}`
                                                                                              );
                                                                                            }
                                                                                          }
                                                                                        )}"
                                                                                      />`;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                            `;
                                                                          }

                                                                          return html`
                                                                            <div
                                                                              class="d-flex w-100"
                                                                              style="gap:${gap}px;"
                                                                            >
                                                                              ${drawRow()}
                                                                            </div>

                                                                            ${(() => {
                                                                              //打開expand 而且有規格
                                                                              if (
                                                                                variants.length > 1 &&
                                                                                product.expand
                                                                              ) {
                                                                                return variants
                                                                                  .map((variant: any) => {
                                                                                    return html`
                                                                                      <div
                                                                                        class="d-flex w-100"
                                                                                        style="margin-top:18px;gap:${gap}px;"
                                                                                      >
                                                                                        ${drawRow(variant)}
                                                                                      </div>
                                                                                    `;
                                                                                  })
                                                                                  .join('');
                                                                              } else {
                                                                                // 空的不需要
                                                                                return ``;
                                                                              }
                                                                            })()}
                                                                          `;
                                                                        },
                                                                        divCreate: {
                                                                          class: `flex-column`,
                                                                          style: `display: flex;padding: 0px 4px;align-items: center;align-self: stretch;`,
                                                                        },
                                                                      });
                                                                    })
                                                                    .join('')}
                                                                </div>
                                                              `;
                                                            },
                                                            divCreate: {
                                                              class: `d-flex flex-column h-100`,
                                                              style: `gap: 18px;width:100%;`,
                                                            },
                                                          });
                                                        },
                                                        divCreate: {
                                                          style: `height:450px;display: flex;justify-content: center;align-items: flex-start;padding-right: 24px;align-self: stretch;overflow-y: scroll;`,
                                                        },
                                                      })}
                                                    </div>
                                                    <div
                                                      class="w-100"
                                                      style="display: flex;padding: 12px 20px;align-items: center;justify-content: end;gap: 10px;"
                                                    >
                                                      ${BgWidget.cancel(
                                                        gvc.event(() => {
                                                          viewModel.step--;
                                                        }),
                                                        '上一步'
                                                      )}
                                                      ${BgWidget.save(
                                                        gvc.event(() => {
                                                          newOrder.productTemp.forEach((product: any) => {
                                                            product.selected = false;
                                                          });
                                                          setItemList(newOrder.productTemp);
                                                          gvc.closeDialog();
                                                        })
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>`;
                                              }
                                              case 2: {
                                                return html` <div
                                                  style="display: flex;width: ${width};flex-direction: column;align-items: flex-start;gap: 18px;border-radius: 10px;background: #FFF;"
                                                >
                                                  <div
                                                    class="w-100"
                                                    style="display: flex;height: 46px;padding: 20px 20px 12px;align-items: center;align-self: stretch;color: #393939;font-size: 16px;font-weight: 700;"
                                                  >
                                                    步驟2. 選擇直播商品
                                                    <div
                                                      class="ms-auto"
                                                      style="cursor: pointer;"
                                                      onclick="${gvc.event(() => {
                                                        gvc.glitter.closeDiaLog();
                                                      })}"
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 14 14"
                                                        fill="none"
                                                      >
                                                        <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round" />
                                                        <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round" />
                                                      </svg>
                                                    </div>
                                                  </div>
                                                  <div
                                                    class="w-100"
                                                    style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;"
                                                  >
                                                    <div
                                                      class="w-100"
                                                      style="display: flex;padding: 0 24px;flex-direction: column;align-items: center;gap: 18px;"
                                                    >
                                                      ${gvc.bindView({
                                                        bind: viewModel.id,
                                                        view: () => {
                                                          return gvc.bindView({
                                                            bind: 'productArray',
                                                            view: () => {
                                                              console.log(
                                                                'newOrder.productTemp -- ',
                                                                newOrder.productTemp
                                                              );
                                                              if (newOrder.productTemp.length == 0) {
                                                                return html` <div
                                                                  class="w-100 h-100 d-flex align-items-center justify-content-center"
                                                                  style="color:#8D8D8D;"
                                                                >
                                                                  沒選擇任何商品，請退往上一步
                                                                </div>`;
                                                              }
                                                              const titleRow = [
                                                                {
                                                                  width: '30%',
                                                                  title: '商品名稱',
                                                                  align: 'left',
                                                                },
                                                                {
                                                                  width: '70px',
                                                                  title: '商品規格',
                                                                },
                                                                {
                                                                  width: '7%',
                                                                  title: '庫存',
                                                                },
                                                                {
                                                                  width: '10%',
                                                                  title: '可售數量',
                                                                  align: 'left',
                                                                },
                                                                {
                                                                  width: '10%',
                                                                  title: '原售價',
                                                                },
                                                                {
                                                                  width: '10%',
                                                                  title: '直播售價',
                                                                  align: 'left',
                                                                },
                                                                {
                                                                  width: '10%',
                                                                  title: '每人限購',
                                                                  align: 'left',
                                                                },
                                                              ];
                                                              let gap = 28;
                                                              return html`
                                                                <div
                                                                  class="d-flex w-100 align-items-center flex-column"
                                                                  style="height: 40px;padding: 9px 4px;gap: 18px;flex-shrink: 0;"
                                                                >
                                                                  <div
                                                                    class="d-flex w-100 align-items-center"
                                                                    style="padding: 12px 4px;gap: ${gap}px;border-bottom: 1px solid #DDD;"
                                                                  >
                                                                    ${titleRow
                                                                      .map((item, index) => {
                                                                        return html`
                                                                          <div
                                                                            class="${index == 0
                                                                              ? 'flex-fill'
                                                                              : 'flex-shrink-0'}"
                                                                            style="width: ${item.width};text-align: ${item.align
                                                                              ? item.align
                                                                              : 'center'}"
                                                                          >
                                                                            ${item.title}
                                                                          </div>
                                                                        `;
                                                                      })
                                                                      .join('')}
                                                                  </div>

                                                                  ${newOrder.productTemp
                                                                    .map((product: any, productIndex: number) => {
                                                                      const variants = product.content.variants;
                                                                      product.content.live_model =
                                                                        product.content.live_model ?? {};
                                                                      variants.map((variant: any) => {
                                                                        if (!variant.live_model) {
                                                                          variant.live_model = variant.live_model ?? {};
                                                                          variant.live_model.stock = variant.stock;
                                                                          variant.live_model.available_Qty = parseInt(
                                                                            variant.stock
                                                                          );
                                                                          variant.live_model.original_price =
                                                                            variant.sale_price;
                                                                          variant.live_model.live_price =
                                                                            variant.sale_price;
                                                                          variant.live_model.limit = 1;
                                                                        }
                                                                      });
                                                                      return gvc.bindView({
                                                                        bind: `product${productIndex}`,
                                                                        view: () => {
                                                                          function drawRow(variant?: any) {
                                                                            let showModel: any = variant
                                                                              ? variant.live_model
                                                                              : product.content.specs.length > 0
                                                                                ? product.content.live_model
                                                                                : variants[0].live_model;
                                                                            //單一規格 或是規格的細項走
                                                                            if (
                                                                              !variant &&
                                                                              product.content.specs.length > 0
                                                                            ) {
                                                                              showModel.stock = 0;
                                                                              showModel.available_Qty = 0;

                                                                              showModel.min_price =
                                                                                variants[0].sale_price;
                                                                              showModel.max_price = 0;

                                                                              showModel.min_live_price =
                                                                                variants[0].min_live_price ??
                                                                                variants[0].sale_price;
                                                                              showModel.max_live_price = 0;

                                                                              showModel.min_limit =
                                                                                variants[0].limit ?? 1;
                                                                              showModel.max_limit = 1;

                                                                              variants.map((variant: any) => {
                                                                                showModel.stock += variant.stock;
                                                                                showModel.available_Qty +=
                                                                                  parseInt(
                                                                                    variant.live_model.available_Qty
                                                                                  ) ?? parseInt(variant.stock);
                                                                                showModel.min_price = Math.min(
                                                                                  showModel.min_price,
                                                                                  variant.sale_price
                                                                                );
                                                                                showModel.max_price = Math.max(
                                                                                  showModel.max_price,
                                                                                  variant.live_model.sale_price
                                                                                );

                                                                                showModel.min_live_price = Math.min(
                                                                                  showModel.min_live_price,
                                                                                  variant.live_model.min_live_price ??
                                                                                    variant.sale_price
                                                                                );
                                                                                showModel.max_live_price = Math.max(
                                                                                  showModel.max_live_price,
                                                                                  variant.live_model.minLivePrice ??
                                                                                    variant.sale_price
                                                                                );

                                                                                showModel.min_limit = Math.min(
                                                                                  showModel.min_limit,
                                                                                  variant.live_model.limit
                                                                                );
                                                                                showModel.max_limit = Math.max(
                                                                                  showModel.max_limit,
                                                                                  variant.sale_price
                                                                                );
                                                                              });
                                                                            }

                                                                            return html`
                                                                              ${variant
                                                                                ? html` <div
                                                                                    style="margin-left:6px;"
                                                                                  ></div>`
                                                                                : ``}
                                                                              <div
                                                                                class="flex-fill text-left d-flex align-items-center"
                                                                                
                                                                              >
                                                                                <div
                                                                                  class="flex-shrink-0"
                                                                                  style="width: 50px;height: 50px;border-radius: 5px;background: url('${variant
                                                                                    ? variant.preview_image
                                                                                    : product.content
                                                                                        .preview_image[0]}') lightgray 50% / cover no-repeat;"
                                                                                ></div>
                                                                                <div
                                                                                  class="flex-fill h-100 d-flex align-items-center  text-left"
                                                                                  style="color:#393939;font-size: 16px;font-weight: 400;margin-bottom: 4px;padding-left:12px;white-space: normal;word-break: break-all;"
                                                                                >
                                                                                  ${variant
                                                                                    ? variant.spec.join(',')
                                                                                    : product.content.title}
                                                                                </div>
                                                                                ${(() => {
                                                                                  if (!variant) {
                                                                                    if (
                                                                                      product.content.specs.length > 0
                                                                                    ) {
                                                                                      if (product.expand) {
                                                                                        return html`
                                                                                          <div
                                                                                            class="h-100 flex-shrink-0 d-flex align-items-center"
                                                                                            style="width:22px;cursor: pointer;padding-left:8px;"
                                                                                            onclick="${gvc.event(() => {
                                                                                              product.expand = false;
                                                                                              gvc.notifyDataChange(
                                                                                                `product${productIndex}`
                                                                                              );
                                                                                            })}"
                                                                                          >
                                                                                            <svg
                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                              width="13"
                                                                                              height="8"
                                                                                              viewBox="0 0 13 8"
                                                                                              fill="none"
                                                                                            >
                                                                                              <path
                                                                                                d="M12 6.5L6.5 1.5L1 6.5"
                                                                                                stroke="#393939"
                                                                                                stroke-width="2"
                                                                                                stroke-linecap="round"
                                                                                                stroke-linejoin="round"
                                                                                              />
                                                                                            </svg>
                                                                                          </div>
                                                                                        `;
                                                                                      } else {
                                                                                        return html`
                                                                                          <div
                                                                                            class="h-100 flex-shrink-0 d-flex align-items-center"
                                                                                            style="width:22px;cursor: pointer;padding-left:8px;"
                                                                                            onclick="${gvc.event(() => {
                                                                                              product.expand = true;

                                                                                              gvc.notifyDataChange(
                                                                                                `product${productIndex}`
                                                                                              );
                                                                                            })}"
                                                                                          >
                                                                                            <svg
                                                                                              style=" cursor: pointer;"
                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                              width="13"
                                                                                              height="8"
                                                                                              viewBox="0 0 13 8"
                                                                                              fill="none"
                                                                                            >
                                                                                              <path
                                                                                                d="M12 1.5L6.5 6.5L1 1.5"
                                                                                                stroke="#393939"
                                                                                                stroke-width="2"
                                                                                                stroke-linecap="round"
                                                                                                stroke-linejoin="round"
                                                                                              />
                                                                                            </svg>
                                                                                          </div>
                                                                                        `;
                                                                                      }
                                                                                    } else {
                                                                                      return html`
                                                                                        <div
                                                                                          class="h-100 flex-shrink-0"
                                                                                          style="width:52px;cursor: pointer;"
                                                                                        ></div>
                                                                                      `;
                                                                                    }
                                                                                  } else {
                                                                                    return ``;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                              <!--   規格                                                                                                                                             商品規格-->
                                                                              <div
                                                                                class="text-center flex-shrink-0 h-100 d-flex align-items-center justify-content-center text-center"
                                                                                style="width: ${titleRow[1]
                                                                                  .width};font-size: 16px;font-style: normal;font-weight: 400;"
                                                                              >
                                                                                ${(() => {
                                                                                  if (variant) {
                                                                                    return `-`;
                                                                                  } else if (
                                                                                    product.content.specs.length > 0
                                                                                  ) {
                                                                                    return html`${variants.length}個規格`;
                                                                                  } else {
                                                                                    return html`單一規格`;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                              <!--   庫存                                                                                                                                             SKU-->
                                                                              <div
                                                                                class="text-center flex-shrink-0 h-100 d-flex align-items-center justify-content-center text-center"
                                                                                style="width: ${titleRow[2]
                                                                                  .width};font-size: 16px;font-style: normal;font-weight: 400;"
                                                                              >
                                                                                ${(() => {
                                                                                  if (variant) {
                                                                                    return showModel.stock;
                                                                                  } else if (
                                                                                    product.content.specs.length > 0
                                                                                  ) {
                                                                                    let count = 0;
                                                                                    variants.forEach((variant: any) => {
                                                                                      count += variant.stock;
                                                                                    });
                                                                                    return count;
                                                                                  } else {
                                                                                    return variants[0].stock;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                              <!--   可售數量                                                                                                                                             售價-->
                                                                              <div
                                                                                class="text-center flex-shrink-0 h-100 d-flex align-items-center justify-content-center text-center"
                                                                                style="width: ${titleRow[3]
                                                                                  .width};font-size: 16px;font-style: normal;font-weight: 400;"
                                                                              >
                                                                                ${(() => {
                                                                                  if (
                                                                                    !variant &&
                                                                                    product.content.specs.length > 0
                                                                                  ) {
                                                                                    return html`
                                                                                      <input
                                                                                        class="w-100"
                                                                                        style="height: 40px;padding: 0 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;${showModel.live_price
                                                                                          ? ''
                                                                                          : 'color: #8D8D8D;'}"
                                                                                        value="${showModel.available_Qty}"
                                                                                        type="number"
                                                                                        disabled
                                                                                      />
                                                                                    `;
                                                                                  } else {
                                                                                    return html`
                                                                                      <input
                                                                                        class="w-100 testBTN"
                                                                                        style="height: 40px;padding: 0 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;${showModel.live_price
                                                                                          ? ''
                                                                                          : 'color: #8D8D8D;'}"
                                                                                        value="${showModel.available_Qty}"
                                                                                        ${showModel.live_price
                                                                                          ? `max = "${showModel?.stock}"`
                                                                                          : ''}
                                                                                        type="number"
                                                                                        ${showModel.live_price
                                                                                          ? ''
                                                                                          : 'disabled'}
                                                                                        onchange="${gvc.event(e => {
                                                                                          showModel.available_Qty =
                                                                                            e.value;
                                                                                        })}"
                                                                                      />
                                                                                    `;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                              <!--   原售價                                                                                                                                    庫存-->
                                                                              <div
                                                                                class="text-center flex-shrink-0 h-100 d-flex align-items-center justify-content-center text-center"
                                                                                style="width: ${titleRow[4]
                                                                                  .width};font-size: 16px;font-style: normal;font-weight: 400;"
                                                                              >
                                                                                ${(() => {
                                                                                  if (
                                                                                    variant ||
                                                                                    product.content.specs.length == 0
                                                                                  ) {
                                                                                    return (
                                                                                      `$` +
                                                                                      showModel.original_price.toLocaleString()
                                                                                    );
                                                                                  } else if (
                                                                                    product.content.specs.length > 0
                                                                                  ) {
                                                                                    if (
                                                                                      showModel.min_price ==
                                                                                      showModel.max_price
                                                                                    ) {
                                                                                      return `$` + showModel.min_price;
                                                                                    }
                                                                                    return html`$${showModel.min_price.toLocaleString()}起`;
                                                                                  } else {
                                                                                    return showModel.original_price.toLocaleString();
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                              <!--   直播售價                                                                                                                                             庫存-->
                                                                              <div
                                                                                class="text-center flex-shrink-0 h-100 d-flex align-items-center justify-content-center text-center"
                                                                                style="width: ${titleRow[5]
                                                                                  .width};font-size: 16px;font-style: normal;font-weight: 400;"
                                                                              >
                                                                                <input
                                                                                  class="w-100"
                                                                                  style="height: 40px;padding: 0 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;${showModel.live_price
                                                                                    ? ''
                                                                                    : 'color: #8D8D8D;'}"
                                                                                  value=${showModel.live_price
                                                                                    ? showModel.live_price
                                                                                    : `${showModel.min_live_price}~${showModel.max_live_price}`}
                                                                                  type=${showModel.live_price
                                                                                    ? 'number'
                                                                                    : 'text'}
                                                                                  ${showModel.live_price
                                                                                    ? ''
                                                                                    : 'disabled'}
                                                                                  onchange="${gvc.event(e => {
                                                                                    showModel.live_price = e.value;
                                                                                  })}"
                                                                                />
                                                                              </div>
                                                                              <!--   每人限購                                                                                                                                             庫存-->
                                                                              <div
                                                                                class="text-center flex-shrink-0 h-100 d-flex align-items-center justify-content-center text-center"
                                                                                style="width: ${titleRow[6]
                                                                                  .width};font-size: 16px;font-style: normal;font-weight: 400;"
                                                                              >
                                                                                <input
                                                                                  class="w-100"
                                                                                  style="height: 40px;padding: 0 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;${showModel.live_price
                                                                                    ? ''
                                                                                    : 'color: #8D8D8D;'}"
                                                                                  value="${showModel.limit
                                                                                    ? showModel.limit
                                                                                    : 1}"
                                                                                  type="number"
                                                                                  ${showModel.live_price
                                                                                    ? ''
                                                                                    : 'disabled'}
                                                                                  onchange="${gvc.event(e => {
                                                                                    showModel.limit = e.value;
                                                                                  })}}"
                                                                                />
                                                                              </div>
                                                                            `;
                                                                          }

                                                                          return html`
                                                                            <div
                                                                              class="d-flex w-100"
                                                                              style="gap:${gap}px;"
                                                                            >
                                                                              ${drawRow()}
                                                                            </div>

                                                                            ${(() => {
                                                                              //打開expand 而且有規格
                                                                              if (
                                                                                product.content.specs.length > 0 &&
                                                                                product.expand
                                                                              ) {
                                                                                return variants
                                                                                  .map((variant: any) => {
                                                                                    return html`
                                                                                      <div
                                                                                        class="d-flex w-100"
                                                                                        style="margin-top:18px;gap:${gap}px;"
                                                                                      >
                                                                                        ${drawRow(variant)}
                                                                                      </div>
                                                                                    `;
                                                                                  })
                                                                                  .join('');
                                                                              } else {
                                                                                // 空的不需要
                                                                                return ``;
                                                                              }
                                                                            })()}
                                                                          `;
                                                                        },
                                                                        divCreate: {
                                                                          class: `flex-column`,
                                                                          style: `display: flex;padding: 0px 4px;align-items: center;align-self: stretch;`,
                                                                        },
                                                                      });
                                                                    })
                                                                    .join('')}
                                                                </div>
                                                              `;
                                                            },
                                                            divCreate: {
                                                              class: `d-flex flex-column h-100`,
                                                              style: `gap: 18px;width:100%;`,
                                                            },
                                                          });
                                                        },
                                                        divCreate: {
                                                          style: `height:450px;display: flex;justify-content: center;align-items: flex-start;padding-right: 24px;align-self: stretch;overflow-y: scroll;`,
                                                        },
                                                      })}
                                                    </div>
                                                    <div
                                                      class="w-100"
                                                      style="display: flex;padding: 12px 20px;align-items: center;justify-content: end;gap: 10px;"
                                                    >
                                                      ${BgWidget.cancel(
                                                        gvc.event(() => {
                                                          viewModel.step = 1;
                                                        }),
                                                        '上一步'
                                                      )}
                                                      ${BgWidget.save(
                                                        gvc.event(() => {
                                                          if (group_buy) {
                                                            newOrder.productTemp.forEach((product: any) => {
                                                              product.selected = false;
                                                            });
                                                            setItemList(newOrder.productTemp);
                                                            gvc.closeDialog();
                                                          } else {
                                                            newOrder.productTemp.forEach((product: any) => {
                                                              if (product.content.variants.length > 1) {
                                                                product.expand = true;
                                                              }
                                                            });
                                                            viewModel.step = 3;
                                                          }
                                                        }),
                                                        '下一步'
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>`;
                                              }
                                              case 1:
                                              default: {
                                                return html` <div
                                                  style="display: flex;width: ${width};flex-direction: column;align-items: flex-start;gap: 18px;border-radius: 10px;background: #FFF;"
                                                >
                                                  <div
                                                    class="w-100"
                                                    style="display: flex;height: 46px;padding: 20px 20px 12px;align-items: center;align-self: stretch;color: #393939;font-size: 16px;font-weight: 700;background: #F2F2F2;border-radius: 10px 10px 0px 0px;"
                                                  >
                                                    步驟1. 選擇直播商品
                                                    <div
                                                      class="ms-auto"
                                                      style="cursor: pointer;"
                                                      onclick="${gvc.event(() => {
                                                        gvc.glitter.closeDiaLog();
                                                      })}"
                                                    >
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 14 14"
                                                        fill="none"
                                                      >
                                                        <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round" />
                                                        <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round" />
                                                      </svg>
                                                    </div>
                                                  </div>
                                                  <div
                                                    class="w-100"
                                                    style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;"
                                                  >
                                                    <div
                                                      class="w-100"
                                                      style="display: flex;padding: 0px 20px;flex-direction: column;align-items: center;gap: 18px;"
                                                    >
                                                      <div
                                                        style="display: flex;justify-content: center;align-items: flex-start;gap: 12px;align-self: stretch;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                      >
                                                        ${gvc.bindView({
                                                          bind: 'selectProductCollection',
                                                          view: () => {
                                                            if (collectLoading) {
                                                              ApiShop.getCollection().then(r => {
                                                                collectLoading = false;
                                                                r.response.value.map((item: any) => {
                                                                  if (item.array.length > 0) {
                                                                    options.push({
                                                                      value: item.title,
                                                                      title: html`${item.title}`,
                                                                    });
                                                                    item.array.forEach((item2: any) => {
                                                                      const icon = html` <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="7"
                                                                        height="14"
                                                                        viewBox="0 0 7 14"
                                                                        fill="none"
                                                                      >
                                                                        <path
                                                                          d="M1 1.5L6 7L1 12.5"
                                                                          stroke="#393939"
                                                                          stroke-width="2"
                                                                          stroke-linecap="round"
                                                                          stroke-linejoin="round"
                                                                        />
                                                                      </svg>`;
                                                                      options.push({
                                                                        value: item2.title,
                                                                        title: html`${item.title} ${icon} ${item2.title}`,
                                                                      });
                                                                    });
                                                                  } else {
                                                                    options.push({
                                                                      value: item.title,
                                                                      title: item.title,
                                                                    });
                                                                  }
                                                                });
                                                                gvc.notifyDataChange('selectProductCollection');
                                                              });
                                                            }

                                                            return html`
                                                              <select
                                                                class="w-100 border-0"
                                                                onchange="${gvc.event(e => {
                                                                  viewModel.collection = e.value;
                                                                  searchLoading = false;
                                                                  gvc.notifyDataChange('productArray');
                                                                })}"
                                                              >
                                                                <option value="" selected>未分類</option>
                                                                ${options
                                                                  .map(item => {
                                                                    return html`
                                                                      <option value="${item.value}">
                                                                        ${item.title}
                                                                      </option>
                                                                    `;
                                                                  })
                                                                  .join('')}
                                                              </select>
                                                            `;
                                                          },
                                                          divCreate: { class: 'w-100' },
                                                        })}
                                                      </div>
                                                      <div
                                                        style="display: flex;justify-content: center;align-items: flex-start;gap: 12px;align-self: stretch;border-radius: 10px;"
                                                      >
                                                        <div class="w-100 position-relative">
                                                          <i
                                                            class="fa-regular fa-magnifying-glass"
                                                            style="font-size: 18px; color: #A0A0A0; position: absolute; left: 18px; top: 50%; transform: translateY(-50%);"
                                                            aria-hidden="true"
                                                          ></i>
                                                          <input
                                                            class="form-control h-100"
                                                            style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;"
                                                            placeholder="輸入商品名稱或商品貨號"
                                                            oninput="${gvc.event(e => {
                                                              searchLoading = false;
                                                              newOrder.query = e.value;
                                                              newOrder.productArray = [];
                                                              gvc.notifyDataChange('productArray');
                                                            })}"
                                                            value="${newOrder.query ?? ''}"
                                                          />
                                                        </div>

                                                        ${BgWidget.updownFilter({
                                                          gvc,
                                                          callback: (value: any) => {
                                                            searchLoading = false;
                                                            newOrder.orderString = value;
                                                            newOrder.productArray = [];
                                                            gvc.notifyDataChange('productArray');
                                                          },
                                                          default: newOrder.orderString || 'default',
                                                          options: FilterOptions.productOrderBy,
                                                        })}
                                                      </div>
                                                      ${gvc.bindView({
                                                        bind: viewModel.id,
                                                        view: () => {
                                                          return gvc.bindView({
                                                            bind: 'productArray',
                                                            view: () => {
                                                              if (!searchLoading) {
                                                                ApiShop.getProduct({
                                                                  page: 0,
                                                                  limit: 20,
                                                                  search: newOrder.query,
                                                                  orderBy: newOrder.orderString,
                                                                  collection: viewModel.collection,
                                                                  productType: type,
                                                                }).then(data => {
                                                                  searchLoading = true;

                                                                  replaceProducts(data.response.data, itemList);
                                                                  newOrder.productArray = data.response.data;
                                                                  gvc.notifyDataChange('productArray');
                                                                });
                                                                return BgWidget.spinner();
                                                              }
                                                              if (newOrder.productArray.length == 0) {
                                                                return html` <div
                                                                  class="w-100 h-100 d-flex align-items-center justify-content-center"
                                                                  style="color:#8D8D8D;"
                                                                >
                                                                  查無此商品
                                                                </div>`;
                                                              }
                                                              const titleRow = [
                                                                {
                                                                  width: '30%',
                                                                  title: '商品名稱',
                                                                },
                                                                {
                                                                  width: '15%',
                                                                  title: '商品規格',
                                                                },
                                                                {
                                                                  width: '20%',
                                                                  title: '存貨單位(SKU)',
                                                                },
                                                                {
                                                                  width: '15%',
                                                                  title: '售價',
                                                                },
                                                                {
                                                                  width: '15%',
                                                                  title: '庫存',
                                                                },
                                                              ];
                                                              return html`
                                                                <div
                                                                  class="d-flex w-100 align-items-center flex-column"
                                                                  style="height: 40px;padding: 9px 4px;gap: 18px;flex-shrink: 0;"
                                                                >
                                                                  <div
                                                                    class="d-flex w-100 align-items-center"
                                                                    style="padding: 12px 4px;border-bottom: 1px solid #DDD;"
                                                                  >
                                                                    ${(() => {
                                                                      if (step1Check) {
                                                                        return html`
                                                                          <svg
                                                                            class="flex-shrink-0"
                                                                            style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;cursor: pointer;margin-right: 18px;"
                                                                            onclick="${gvc.event(() => {
                                                                              newOrder.productArray.forEach(
                                                                                (product: any) => {
                                                                                  product.selected = false;
                                                                                }
                                                                              );
                                                                              step1Check = false;
                                                                              gvc.notifyDataChange(viewModel.id);
                                                                            })}"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            viewBox="0 0 16 16"
                                                                            fill="none"
                                                                          >
                                                                            <rect
                                                                              width="16"
                                                                              height="16"
                                                                              rx="3"
                                                                              fill="#393939"
                                                                            />
                                                                            <path
                                                                              d="M4.5 8.5L7 11L11.5 5"
                                                                              stroke="white"
                                                                              stroke-width="2"
                                                                              stroke-linecap="round"
                                                                              stroke-linejoin="round"
                                                                            />
                                                                          </svg>
                                                                        `;
                                                                      } else {
                                                                        return html`
                                                                          <div
                                                                            class="flex-shrink-0"
                                                                            style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;cursor: pointer;margin-right: 18px;"
                                                                            onclick="${gvc.event(() => {
                                                                              newOrder.productArray.forEach(
                                                                                (product: any) => {
                                                                                  product.selected = true;
                                                                                }
                                                                              );
                                                                              step1Check = true;
                                                                              gvc.notifyDataChange(viewModel.id);
                                                                            })}"
                                                                          ></div>
                                                                        `;
                                                                      }
                                                                    })()}
                                                                    ${titleRow
                                                                      .map((item, index) => {
                                                                        return html`
                                                                          <div
                                                                            class="${index == 0
                                                                              ? 'flex-fill text-left'
                                                                              : 'text-center  flex-shrink-0'}"
                                                                            style="width: ${item.width}"
                                                                          >
                                                                            ${item.title}
                                                                          </div>
                                                                        `;
                                                                      })
                                                                      .join('')}
                                                                  </div>
                                                                  ${newOrder.productArray
                                                                    .map((product: any, productIndex: number) => {
                                                                      return gvc.bindView({
                                                                        bind: `product${productIndex}`,
                                                                        view: () => {
                                                                          const variants = product.content.variants;

                                                                          function drawRow(variant?: any) {
                                                                            if (variant && product.selected) {
                                                                              variant.selected = true;
                                                                            }
                                                                            let select = variant
                                                                              ? variant.selected
                                                                              : product.selected;
                                                                            return html`
                                                                              ${variant
                                                                                ? html` <div
                                                                                    style="margin-left:38px;"
                                                                                  ></div>`
                                                                                : ``}
                                                                              <div
                                                                                class="flex-shrink-0 d-flex align-items-center justify-content-center"
                                                                                style="width:18px; height:60px;"
                                                                              >
                                                                                ${(() => {
                                                                                  if (select) {
                                                                                    return html` <svg
                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                      width="15"
                                                                                      height="15"
                                                                                      viewBox="0 0 15 15"
                                                                                      fill="none"
                                                                                      onclick="${gvc.event(() => {
                                                                                        product.selected = false;
                                                                                        if (variant) {
                                                                                          variant.selected = false;
                                                                                        }
                                                                                        if (
                                                                                          !variant &&
                                                                                          product.content.variants
                                                                                            .length > 1
                                                                                        ) {
                                                                                          variants.forEach(
                                                                                            (dd: any) => {
                                                                                              dd.selected = false;
                                                                                            }
                                                                                          );
                                                                                        }
                                                                                        console.log(
                                                                                          'variants -- ',
                                                                                          variants
                                                                                        );
                                                                                        if (
                                                                                          variants.every(
                                                                                            (dd: any) =>
                                                                                              dd.selected !== true
                                                                                          )
                                                                                        ) {
                                                                                          product.halfSelected = false;
                                                                                          product.selected = false;
                                                                                        }
                                                                                        gvc.notifyDataChange(
                                                                                          `product${productIndex}`
                                                                                        );
                                                                                      })}"
                                                                                    >
                                                                                      <rect
                                                                                        width="15"
                                                                                        height="15"
                                                                                        rx="3"
                                                                                        fill="#393939"
                                                                                      />
                                                                                      <path
                                                                                        d="M4.5 8.5L7 11L11.5 5"
                                                                                        stroke="white"
                                                                                        stroke-width="2"
                                                                                        stroke-linecap="round"
                                                                                        stroke-linejoin="round"
                                                                                      />
                                                                                    </svg>`;
                                                                                  } else {
                                                                                    if (
                                                                                      !variant &&
                                                                                      product.halfSelected
                                                                                    ) {
                                                                                      return html`
                                                                                        <div
                                                                                          style="display: flex;align-items: center;justify-content: center;height: 60px;width: 18px;cursor: pointer;"
                                                                                          onclick="${gvc.event(() => {
                                                                                            variants.forEach(
                                                                                              (dd: any) => {
                                                                                                dd.selected = true;
                                                                                              }
                                                                                            );
                                                                                            product.selected = true;
                                                                                            gvc.notifyDataChange(
                                                                                              `product${productIndex}`
                                                                                            );
                                                                                          })}"
                                                                                        >
                                                                                          <div
                                                                                            style="width: 18px;height: 18px;padding:4px;border-radius: 3px;border: 1px solid #DDD;cursor: pointer;"
                                                                                          >
                                                                                            <div
                                                                                              class="w-100 h-100"
                                                                                              style="background-color: #393939;"
                                                                                            ></div>
                                                                                          </div>
                                                                                        </div>
                                                                                      `;
                                                                                    }
                                                                                    return html`
                                                                                      <div
                                                                                        style="display: flex;align-items: center;justify-content: center;height: 60px;width: 15px;cursor: pointer;"
                                                                                        onclick="${gvc.event(() => {
                                                                                          if (variant) {
                                                                                            variant.selected = true;
                                                                                            if (
                                                                                              variants.every(
                                                                                                (dd: any) =>
                                                                                                  dd.selected === true
                                                                                              )
                                                                                            ) {
                                                                                              product.selected = true;
                                                                                            } else {
                                                                                              product.halfSelected =
                                                                                                true;
                                                                                            }
                                                                                          } else {
                                                                                            product.halfSelected = true;
                                                                                            product.selected = true;
                                                                                          }
                                                                                          if (
                                                                                            !variant &&
                                                                                            product.content.variants
                                                                                              .length > 1
                                                                                          ) {
                                                                                            variants.forEach(
                                                                                              (dd: any) => {
                                                                                                dd.selected = true;
                                                                                              }
                                                                                            );
                                                                                          }
                                                                                          gvc.notifyDataChange(
                                                                                            `product${productIndex}`
                                                                                          );
                                                                                        })}"
                                                                                      >
                                                                                        <div
                                                                                          style="width: 15px;height: 15px;border-radius: 3px;border: 1px solid #DDD;cursor: pointer;"
                                                                                        ></div>
                                                                                      </div>
                                                                                    `;
                                                                                  }
                                                                                })()}
                                                                              </div>

                                                                              <div
                                                                                class="flex-fill text-left d-flex align-items-center"
                                                                                style="margin-left:18px;"
                                                                              >
                                                                                <div
                                                                                  class="flex-shrink-0"
                                                                                  style="width: 50px;height: 50px;border-radius: 5px;background: url('${variant
                                                                                    ? variant.preview_image
                                                                                    : product.content
                                                                                        .preview_image[0]}') lightgray 50% / cover no-repeat;"
                                                                                ></div>
                                                                                <div
                                                                                  class="flex-fill h-100 d-flex align-items-center  text-left"
                                                                                  style="color:#393939;font-size: 16px;font-weight: 400;margin-bottom: 4px;padding-left:12px;white-space: normal;word-break: break-all;"
                                                                                >
                                                                                  ${variant
                                                                                    ? variant.spec.join(',')
                                                                                    : product.content.title}
                                                                                </div>
                                                                                ${(() => {
                                                                                  if (!variant) {
                                                                                    if (variants.length > 1) {
                                                                                      if (product.expand) {
                                                                                        return html`
                                                                                          <div
                                                                                            class="h-100 flex-shrink-0 d-flex align-items-center"
                                                                                            style="width:22px;cursor: pointer;padding-left:8px;"
                                                                                            onclick="${gvc.event(() => {
                                                                                              product.expand = false;
                                                                                              gvc.notifyDataChange(
                                                                                                `product${productIndex}`
                                                                                              );
                                                                                            })}"
                                                                                          >
                                                                                            <svg
                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                              width="13"
                                                                                              height="8"
                                                                                              viewBox="0 0 13 8"
                                                                                              fill="none"
                                                                                            >
                                                                                              <path
                                                                                                d="M12 6.5L6.5 1.5L1 6.5"
                                                                                                stroke="#393939"
                                                                                                stroke-width="2"
                                                                                                stroke-linecap="round"
                                                                                                stroke-linejoin="round"
                                                                                              />
                                                                                            </svg>
                                                                                          </div>
                                                                                        `;
                                                                                      } else {
                                                                                        return html`
                                                                                          <div
                                                                                            class="h-100 flex-shrink-0 d-flex align-items-center"
                                                                                            style="width:22px;cursor: pointer;padding-left:8px;"
                                                                                            onclick="${gvc.event(() => {
                                                                                              product.expand = true;

                                                                                              gvc.notifyDataChange(
                                                                                                `product${productIndex}`
                                                                                              );
                                                                                            })}"
                                                                                          >
                                                                                            <svg
                                                                                              style=" cursor: pointer;"
                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                              width="13"
                                                                                              height="8"
                                                                                              viewBox="0 0 13 8"
                                                                                              fill="none"
                                                                                            >
                                                                                              <path
                                                                                                d="M12 1.5L6.5 6.5L1 1.5"
                                                                                                stroke="#393939"
                                                                                                stroke-width="2"
                                                                                                stroke-linecap="round"
                                                                                                stroke-linejoin="round"
                                                                                              />
                                                                                            </svg>
                                                                                          </div>
                                                                                        `;
                                                                                      }
                                                                                    } else {
                                                                                      return html`
                                                                                        <div
                                                                                          class="h-100 flex-shrink-0"
                                                                                          style="width:52px;cursor: pointer;"
                                                                                        ></div>
                                                                                      `;
                                                                                    }
                                                                                  } else {
                                                                                    return ``;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                              <!--                                                                                                                                                商品規格-->
                                                                              <div
                                                                                class="text-center flex-shrink-0 h-100 d-flex align-items-center justify-content-center text-center"
                                                                                style="width: 15%;font-size: 16px;font-style: normal;font-weight: 400;"
                                                                              >
                                                                                ${(() => {
                                                                                  if (variant) {
                                                                                    return `-`;
                                                                                  } else if (variants.length > 1) {
                                                                                    return html`${variants.length}個規格`;
                                                                                  } else {
                                                                                    return html`單一規格`;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                              <!--                                                                                                                                                SKU-->
                                                                              <div
                                                                                class="text-center flex-shrink-0 h-100 d-flex align-items-center justify-content-center text-center"
                                                                                style="width: 20%;font-size: 16px;font-style: normal;font-weight: 400;"
                                                                              >
                                                                                ${(() => {
                                                                                  if (variant) {
                                                                                    return variant.sku;
                                                                                  } else if (variants.length > 1) {
                                                                                    return html`-`;
                                                                                  } else {
                                                                                    return variants[0].sku;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                              <!--                                                                                                                                                售價-->
                                                                              <div
                                                                                class="text-center flex-shrink-0 h-100 d-flex align-items-center justify-content-center text-center"
                                                                                style="width: 15%;font-size: 16px;font-style: normal;font-weight: 400;"
                                                                              >
                                                                                ${(() => {
                                                                                  if (variant) {
                                                                                    return variant.sale_price;
                                                                                  } else if (variants.length > 1) {
                                                                                    let price = variants[0].sale_price;
                                                                                    variants.map((variant: any) => {
                                                                                      price = Math.min(
                                                                                        variant.sale_price,
                                                                                        price
                                                                                      );
                                                                                    });
                                                                                    return price;
                                                                                  } else {
                                                                                    return variants[0].sale_price;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                              <!--                                                                                                                                                庫存-->
                                                                              <div
                                                                                class="text-center flex-shrink-0 h-100 d-flex align-items-center justify-content-center text-center"
                                                                                style="width: 15%;font-size: 16px;font-style: normal;font-weight: 400;"
                                                                              >
                                                                                ${(() => {
                                                                                  if (variant) {
                                                                                    return variant.stock;
                                                                                  } else if (variants.length > 1) {
                                                                                    let stock = 0;
                                                                                    variants.map((variant: any) => {
                                                                                      stock += parseInt(variant.stock);
                                                                                    });
                                                                                    return stock;
                                                                                  } else {
                                                                                    return variants[0].stock;
                                                                                  }
                                                                                })()}
                                                                              </div>
                                                                            `;
                                                                          }

                                                                          return html`
                                                                            <div class="d-flex w-100">${drawRow()}</div>

                                                                            ${(() => {
                                                                              //打開expand 而且有規格
                                                                              if (
                                                                                variants.length > 1 &&
                                                                                product.expand
                                                                              ) {
                                                                                return variants
                                                                                  .map((variant: any) => {
                                                                                    return html`
                                                                                      <div class="d-flex w-100">
                                                                                        ${drawRow(variant)}
                                                                                      </div>
                                                                                    `;
                                                                                  })
                                                                                  .join('');
                                                                              } else {
                                                                                // 空的不需要
                                                                                return ``;
                                                                              }
                                                                            })()}
                                                                          `;
                                                                        },
                                                                        divCreate: {
                                                                          class: `flex-column`,
                                                                          style: `display: flex;padding: 0px 4px;align-items: center;align-self: stretch;`,
                                                                        },
                                                                      });
                                                                    })
                                                                    .join('')}
                                                                </div>
                                                              `;
                                                            },
                                                            divCreate: {
                                                              class: `d-flex flex-column h-100`,
                                                              style: `gap: 18px;width:100%;`,
                                                            },
                                                          });
                                                        },
                                                        divCreate: {
                                                          style: `height:450px;display: flex;justify-content: center;align-items: flex-start;padding-right: 24px;align-self: stretch;overflow-y: scroll;`,
                                                        },
                                                      })}
                                                    </div>
                                                    <div
                                                      class="w-100"
                                                      style="display: flex;padding: 12px 20px;align-items: center;justify-content: end;gap: 10px;"
                                                    >
                                                      ${BgWidget.cancel(
                                                        gvc.event(() => {
                                                          confirm = false;
                                                          gvc.closeDialog();
                                                        })
                                                      )}
                                                      ${BgWidget.save(
                                                        gvc.event(() => {
                                                          confirm = true;
                                                          newOrder.productTemp = [];

                                                          newOrder.productArray.map((product: any) => {
                                                            let localTemp = JSON.parse(JSON.stringify(product));
                                                            localTemp.expand = true;
                                                            if (product.selected) {
                                                              newOrder.productTemp.push(localTemp);
                                                            } else {
                                                              localTemp.content.variants = [];
                                                              product.content.variants.forEach((data: any) => {
                                                                if (data.selected) {
                                                                  localTemp.content.variants.push(data);
                                                                }
                                                              });

                                                              if (localTemp.content.variants.length > 0) {
                                                                newOrder.productTemp.push(localTemp);
                                                              }
                                                            }
                                                          });
                                                          if (newOrder.productTemp.length) {
                                                            viewModel.step = 2;
                                                          } else {
                                                            dialog.infoMessage({
                                                              text: '請至少選擇一項商品',
                                                            });
                                                          }
                                                        }),
                                                        '下一步'
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>`;
                                              }
                                            }
                                          },
                                          divCreate: {},
                                        });
                                      },
                                      'addProduct',
                                      {
                                        dismiss: () => {},
                                      }
                                    );
                                  }

                                  gvc.addStyle(`
                                                        .productType:hover{
                                                            background: #EAEAEA;  
                                                        }
                                                    `);
                                  if (!dialogShow) {
                                    return ``;
                                  }
                                  return html`
                                    <div
                                      style="position: absolute;left:0;top:calc(100% + 20px);display: flex;width: 146px;padding: 24px;flex-direction: column;align-items: flex-start;gap: 10px;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);"
                                    >
                                      <div
                                        class="productType w-100"
                                        onclick="${gvc.event(() => {
                                          type = 'product';
                                          selectProductType(viewModel.formData.item_list);
                                        })}"
                                      >
                                        官網商品
                                      </div>
                                      <div
                                        class="productType w-100"
                                        onclick="${gvc.event(() => {
                                          type = 'hidden';
                                          selectProductType(viewModel.formData.item_list);
                                        })}"
                                      >
                                        隱形商品
                                      </div>
                                    </div>
                                  `;
                                },
                                divCreate: {
                                  style: ``,
                                  class: ``,
                                },
                              })}
                            </div>
                          `;
                        }
                      })()}
                    </div>
                    ${gvc.bindView({
                      bind: 'item_list',
                      view: () => {
                        if (viewModel.formData.item_list.length > 0) {
                          return viewModel.formData.item_list
                            .map((item: any) => {
                              function drawRow(variant: any) {
                                return html`
                                  <div class="d-flex align-items-center flex-shrink-0" style="width:25%;">
                                    $${variant.live_model.live_price}
                                  </div>
                                  <div class="d-flex align-items-center flex-shrink-0" style="width:25%;">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                    >
                                      <g clip-path="url(#clip0_15901_65796)">
                                        <path
                                          d="M10.6667 2.21233C10.9111 2.21233 11.1111 2.41267 11.1111 2.65753V6.21917H12.4444V2.65753C12.4444 1.6753 11.6472 0.876709 10.6667 0.876709H5.33333C4.35278 0.876709 3.55556 1.6753 3.55556 2.65753V6.21917H4.88889V2.65753C4.88889 2.41267 5.08889 2.21233 5.33333 2.21233H6.88889V3.99315C6.88889 4.23801 7.08889 4.43835 7.33333 4.43835H8.66667C8.91111 4.43835 9.11111 4.23801 9.11111 3.99315V2.21233H10.6667ZM9.1 15.1233H14.2222C15.2028 15.1233 16 14.3247 16 13.3425V8.89041C16 7.90817 15.2028 7.10959 14.2222 7.10959H9.1C9.42778 7.47688 9.65833 7.936 9.74167 8.4452H10.4444V10.226C10.4444 10.4709 10.6444 10.6712 10.8889 10.6712H12.2222C12.4667 10.6712 12.6667 10.4709 12.6667 10.226V8.4452H14.2222C14.4667 8.4452 14.6667 8.64554 14.6667 8.89041V13.3425C14.6667 13.5873 14.4667 13.7877 14.2222 13.7877H9.74167C9.65556 14.2969 9.42778 14.756 9.1 15.1233ZM7.11111 8.4452C7.35556 8.4452 7.55556 8.64554 7.55556 8.89041V13.3425C7.55556 13.5873 7.35556 13.7877 7.11111 13.7877H1.77778C1.53333 13.7877 1.33333 13.5873 1.33333 13.3425V8.89041C1.33333 8.64554 1.53333 8.4452 1.77778 8.4452H3.33333V10.226C3.33333 10.4709 3.53333 10.6712 3.77778 10.6712H5.11111C5.35556 10.6712 5.55556 10.4709 5.55556 10.226V8.4452H7.11111ZM1.77778 7.10959C0.797222 7.10959 0 7.90817 0 8.89041V13.3425C0 14.3247 0.797222 15.1233 1.77778 15.1233H7.11111C8.09167 15.1233 8.88889 14.3247 8.88889 13.3425V8.89041C8.88889 7.90817 8.09167 7.10959 7.11111 7.10959H1.77778Z"
                                          fill="#393939"
                                        />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_15901_65796">
                                          <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                    ${variant.live_model.available_Qty}
                                  </div>
                                `;
                              }

                              function drawKeyword(variant: any) {
                                if (variant.live_keyword && variant.live_keyword.length > 0) {
                                  return html`
                                    <div class="d-flex" style="gap:4px;">
                                      ${variant.live_keyword
                                        .map((keyword: string) => {
                                          return html` <div
                                            style="display: flex;height: 22px;padding: 4px 6px;justify-content: center;align-items: center;gap: 10px;border-radius: 7px;background: #EAEAEA;"
                                          >
                                            ${keyword}
                                          </div>`;
                                        })
                                        .join('')}
                                    </div>
                                  `;
                                } else {
                                  return ``;
                                }
                              }

                              return html`
                                <div style="display: flex;flex-direction: column;">
                                  <div
                                    style="display: flex;height: 48px;padding-left: 4px;align-items: center;gap: 12px;"
                                  >
                                    <div style="display: flex;align-items: center;gap: 18px;">
                                      ${(() => {
                                        if (item.selected) {
                                          return html`
                                            <svg
                                              style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;cursor:pointer"
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              viewBox="0 0 16 16"
                                              fill="none"
                                              onclick="${gvc.event(() => {
                                                item.selected = false;
                                                editItemList = false;
                                                gvc.notifyDataChange('itemBlock');
                                              })}"
                                            >
                                              <rect width="16" height="16" rx="3" fill="#393939" />
                                              <path
                                                d="M4.5 8.5L7 11L11.5 5"
                                                stroke="white"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                              />
                                            </svg>
                                          `;
                                        }
                                        return html`
                                          <div
                                            style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;cursor:pointer"
                                            onclick="${gvc.event(() => {
                                              item.selected = true;
                                              editItemList = true;
                                              gvc.notifyDataChange('itemBlock');
                                            })}"
                                          ></div>
                                        `;
                                      })()}
                                      <div style="display: flex;align-items: center;gap: 8px;">
                                        <div
                                          style="width: 50px;height: 50px;border-radius: 5px;background: url('${item
                                            .content.preview_image[0] ??
                                          'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg'}') lightgray 50% / cover no-repeat;"
                                        ></div>
                                      </div>
                                    </div>
                                    <div style="display: flex;height: 40px;gap: 4px;flex: 1 0 0;align-items: center;">
                                      <div
                                        class="d-flex flex-column flex-shrink-0"
                                        style="font-size: 16px;font-style: normal;font-weight: 400;width:250px;"
                                      >
                                        <div>${item.content.title}</div>
                                        ${(() => {
                                          if (item.content.specs.length > 0) {
                                            return drawKeyword(item.content.variants[0]);
                                          } else {
                                            return ``;
                                          }
                                        })()}
                                      </div>
                                      ${(() => {
                                        if (item.content.specs.length == 0) {
                                          return drawRow(item.content.variants[0]);
                                        } else {
                                          return ``;
                                        }
                                      })()}
                                    </div>
                                  </div>
                                  <!--                                                            variant -->
                                  ${(() => {
                                    if (item.content.specs.length > 0) {
                                      return item.content.variants
                                        .map((variant: any) => {
                                          return html`
                                            <div
                                              class="w-100 "
                                              style="display: flex;padding-left: 100px;align-items: center;align-self: stretch;gap:4px;margin-top:8px;"
                                            >
                                              <div
                                                class="d-flex flex-column flex-shrink-0"
                                                style="font-size: 16px;font-style: normal;font-weight: 400;width:250px;gap:4px;"
                                              >
                                                <div>${variant.spec.join(',')}</div>
                                                ${drawKeyword(variant)}
                                              </div>
                                              ${drawRow(variant)}
                                            </div>
                                          `;
                                        })
                                        .join('');
                                    } else {
                                      return ``;
                                    }
                                  })()}
                                </div>
                              `;
                            })
                            .join('');
                        }
                        return ``;
                      },
                      divCreate: {
                        class: `w-100 d-flex flex-column`,
                        style: `gap:18px;`,
                      },
                    })}
                  `;
                },
                divCreate: {
                  class: 'd-flex',
                  style: 'flex-direction: column;align-items: flex-start;gap: 18px;',
                },
              })
            )}
            <div style="margin-top:24px"></div>
            ${BgWidget.mainCard(html`
              <div style="display: flex;flex-direction: column;">
                <div style="font-size: 16px;font-weight: 700;">庫存設定</div>
                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 12px;">
                  <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 4px;">
                    <div style="display: flex;align-items: center;gap: 4px;">
                      <div style="font-size: 16px;font-weight: 400;">保留庫存</div>
                      <div class="cursor_pointer form-check form-switch" style="margin-top: 10px;">
                        <input
                          class="form-check-input cursor_pointer"
                          type="checkbox"
                          onchange="${gvc.event((e, event) => {
                            viewModel.formData.stock.reserve = e.value;
                            gvc.notifyDataChange(['datePicker', 'summary']);
                          })}"
                          checked
                        />
                      </div>
                    </div>
                    <div style="color: #8D8D8D;font-size: 14px;font-weight: 400;">
                      啟用後，系統會在消費者喊單成功時暫時保留庫存，若超過指定時間未完成下單，庫存將自動釋放
                    </div>
                  </div>
                  <div class="w-100" style="display: flex;align-items: flex-start;gap: 18px;">
                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;flex: 1 0 0;">
                      <div style="font-size: 16px;font-weight: 400;">保留期限</div>
                      <div
                        class="w-100"
                        style="display: flex;height: 40px;padding: 9px 18px;align-items: center;gap: 10px;flex: 1 0 0;border-radius: 10px;border: 1px solid #DDD;"
                      >
                        <select
                          class="border-0 w-100"
                          
                          onchange="${gvc.event(e => {
                            viewModel.formData.stock.period = e.value;
                            if (e.value >= 0) {
                              viewModel.formData.stock.expiry_date = getFutureDate(parseInt(e.value));
                            }

                            gvc.notifyDataChange(['summary']);
                          })}"
                        >
                          ${(() => {
                            return stockExpired.map(dd => {
                              return html` <option value="${dd.value}">${dd.title}</option> `;
                            });
                          })()}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `)}
            <div style="margin-top:24px"></div>
            ${gvc.bindView({
              bind: `discount`,
              view: () => {
                return BgWidget.mainCard(html`
                  <div style="display: flex;padding: 20px;flex-direction: column;gap: 18px;">
                    <div style="font-size: 16px;font-style: normal;font-weight: 700;">優惠折扣</div>
                    <div class="d-flex flex-column">
                      ${(() => {
                        const data = [
                          {
                            title: '不套用折扣',
                            value: 'false',
                          },
                          {
                            title: '套用折扣',
                            value: 'true',
                          },
                        ];
                        return data
                          .map(dd => {
                            return html`
                              <div
                                class="d-flex align-items-center"
                                style="gap: 6px;cursor: pointer;"
                                onclick="${gvc.event(() => {
                                  viewModel.formData.discount_set = dd.value;
                                  gvc.notifyDataChange(['summary', 'discount']);
                                })}}"
                              >
                                ${viewModel.formData.discount_set == dd.value
                                  ? html` <div
                                      style="width: 16px;height: 16px;border-radius: 20px;border:solid 4px #393939"
                                    ></div>`
                                  : `<div style="height: 16px;width: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                <div style="font-size: 16px;font-style: normal;font-weight: 400;">${dd.title}</div>
                              </div>
                            `;
                          })
                          .join('');
                      })()}
                      <div class="d-flex" style="gap:6px;"></div>
                      <div></div>
                    </div>
                  </div>
                `);
              },
              divCreate: {},
            })}
            <div class="w-100" style="margin-bottom: 120px;"></div>
          `,
          ratio: 70,
        },
        {
          html: html`
            ${gvc.bindView({
              bind: 'summary',
              dataList: [
                {
                  obj: viewModel,
                  key: 'summaryType',
                },
              ],
              view: () => {
                if (viewModel.summaryType == `streaming`){
                  return BgWidget.mainCard(html`
                    <div class="d-flex flex-column" style="gap:12px;">
                      <div class="d-flex align-items-center" style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input class="border-0" style="margin-left:6px;" placeholder="搜尋顧客名稱、訊息內容">
                      </div>
                      ${gvc.bindView({
                        bind:"board",
                        view:()=>{
                          return streamingData.comments.map((comment)=>{
                            return html`
                            <div class="flex-column" style="display: flex;padding: 12px 16px;border-radius: 10px;background: #F7F7F7;gap: 6px;">
                              <div style="font-size: 14px;font-weight: 400;">${comment.from.name}</div>
                              <div style="font-size: 16px;font-weight: 400;">${comment.message}</div>
                            </div>
                            `
                          }).join('')
                        },divCreate:{class:"w-100 d-flex flex-column",style:"gap:12px;height:650px;overflow:auto;"},
                        onCreate:()=>{
                          clearInterval(gvc.glitter.share.catch_comment_timer || 0)
                          gvc.glitter.share.catch_comment_timer=setInterval(()=>{
                            ApiFbService.getLiveComments(viewModel.formData.id, streamingData.live_id, streamingData.accessToken , streamingData.after).then(r =>{
                              const commentData = r.response.data;
                              streamingData.comments.push(...commentData);
                              // if (r.response.paging?.cursors){
                              //   streamingData.after = r.response.paging.cursors.after;
                              // }
                              gvc.notifyDataChange(['board']);
                            })
                          },5000)
                          
                        },onDestroy:()=>{
                          clearInterval(gvc.glitter.share.hsahj_timer)
                        }
                      })}
                      <div class="d-flex flex-fill">
                        
                      </div>
                      <div style="display: flex;padding: 20px;flex-direction: column;align-items: center;gap: 10px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;">
                        <div class="w-100" style="display: flex;align-items: flex-start;gap: 12px;">
                          <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 3px;flex: 1 0 0;border-right: 1px #DDD solid;">
                            <div>留言數</div>
                            <div>${streamingData?.comments?.length??0}</div>
                          </div>
                          <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 3px;flex: 1 0 0;">
                            <div>喊單數</div>
                            <div>${streamingData?.orders??0}</div>
                          </div>
                        </div>
                        <div class="w-100" style="height: 1px;width: 100%;background: #DDD"></div>
                        <div class="w-100" style="display: flex;align-items: flex-start;gap: 3px;flex-direction: column;">
                          <div>總銷售額</div>
                          <div>${streamingData.amount}</div>
                        </div>
                      </div>
                    </div>
                    
                  `)
                }
                return BgWidget.mainCard(html`
                  <div
                    style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;font-size: 16px;font-weight: 400;"
                  >
                    <div style="font-size: 16px;font-weight: 700;">摘要</div>
                    ${group_buy
                      ? html`
                          <div style="display: flex;flex-direction: column;gap: 8px;">
                            <div>
                              團購名稱 :
                              ${viewModel.formData.name.length > 0
                                ? viewModel.formData.name
                                : html` <span style="color: #8D8D8D;">尚未輸入團購名稱</span>`}
                            </div>
                            <div>團購平台 : ${viewModel.formData.platform}</div>
                            <div>
                              團購群組 :
                              ${viewModel.formData.lineGroup.groupName
                                ? viewModel.formData.lineGroup.groupName
                                : html` <span style="color: #8D8D8D;">尚未選擇團購群組</span>`}
                            </div>
                            <div>
                              團購時間 : ${viewModel.formData.start_date} -${viewModel.formData.start_time}
                              ~${viewModel.formData.end_date} -${viewModel.formData.end_time}
                            </div>
                          </div>
                        `
                      : html`
                          <div style="display: flex;flex-direction: column;gap: 8px;">
                            <div>
                              直播名稱 :
                              ${viewModel.formData.name.length > 0
                                ? viewModel.formData.name
                                : html` <span style="color: #8D8D8D;">尚未輸入直播名稱</span>`}
                            </div>
                            <div>
                              直播主 :
                              ${viewModel.formData.streamer.length > 0
                                ? viewModel.formData.streamer
                                : html` <span style="color: #8D8D8D;">尚未輸入直播主</span>`}
                            </div>
                            <div>直播平台 : ${viewModel.formData.platform}</div>
                          </div>
                        `}

                    <div class="w-100 " style="height: 1px; background-color: #DDD"></div>
                    <div style="display: flex;flex-direction: column;gap: 8px;">
                      ${(() => {
                        if (viewModel.formData.stock.reserve) {
                          const date = stockExpired.find(date => {
                            return date.value == viewModel.formData.stock.period;
                          });
                          return html` <div>
                            保留庫存 : ${date?.title}, 期限至${viewModel.formData.stock.expiry_date}
                          </div>`;
                        } else {
                          return ``;
                        }
                      })()}

                      <div>${viewModel.formData.discount_set ? '套用' : '不套用'}折扣</div>
                    </div>
                  </div>
                `);
              },
              divCreate: {},
            })}
          `,
          ratio: 30,
        }
      )}
      <div class="update-bar-container">
        ${BgWidget.cancel(
          gvc.event(() => {
            vm.type = 'list';
          })
        )}
        ${BgWidget.save(
          gvc.event(async () => {
            function getIncompleteFields() {
              for (const [key, value] of Object.entries(viewModel.formData)) {
                switch (key) {
                  case 'name': {
                    if (!value) {
                      dialog.infoMessage({
                        text: '名稱未輸入',
                      });
                      return false;
                    }
                    break;
                  }
                  case 'item_list': {
                    if (value.length == 0) {
                      dialog.infoMessage({
                        text: '商品不可為空',
                      });
                      return false;
                    }
                    break;
                  }
                  default: {
                  }
                }
              }
              return true;
            }
            if (getIncompleteFields()) {
              dialog.dataLoading({
                visible: true,
              });
              ApiLiveInteraction.createScheduled(viewModel.formData).then(response => {
                viewModel.formData.id = response.response.message.insertId;
                dialog.dataLoading({
                  visible: false,
                });
                if (!group_buy) {
                  interface Page{
                    title: string;
                    name:string;
                    access_token: string;
                    id: string;
                    picture: string;
                    select: boolean;
                    live_video:{
                      data:{
                        broadcast_start_time:string,
                        id:string,
                        title:string,
                        status:string
                      }[],
                      paging:{
                        cursors:{
                          before:string,
                          after:string
                        }
                      }
                    }
                  }
                  let pageList:Page[] = []
                  const formatDateString = (dateStr:string) => {
                    const date = new Date(dateStr);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');

                    let hours = date.getHours();
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12 || 12;

                    return `${year}-${month}-${day} ${hours}:${minutes}${ampm}`;
                  };

                  gvc.glitter.innerDialog(gvc => {
                    return gvc.bindView({
                      bind: 'pageList',
                      view: () => {
                        function togglePageSelection(page:Page, selected:boolean) {
                          pageList.forEach((page:Page) => page.select = false);
                          page.select = selected;
                          gvc.notifyDataChange('pageList');
                        }
                        function renderPageItem(page:Page) {
                          const uncheckbox = html`
                        <div
                          style="width: 16px; height: 16px; border-radius: 3px; border: 1px solid #DDD; cursor: pointer;"
                          onclick="${gvc.event(() => togglePageSelection(page, true))}"
                        ></div>
                      `;
                          const checkbox = html`
                        <i
                          class="fa-solid fa-square-check"
                          style="width: 16px; height: 16px; border-radius: 3px; font-size: 16px; cursor: pointer;"
                          onclick="${gvc.event(() => togglePageSelection(page, false))}"
                        ></i>
                      `;

                          return html`
                        <div class="d-flex flex-column" style="gap: 20px;">
                          <div class="d-flex align-items-center" style="gap: 8px">
                            <img
                              src="${page.picture}"
                              style="width: 18px;height: 18px; border-radius: 5px;"
                              alt="page"
                            />
                            <div class="d-flex flex-column" style="font-size: 16px; font-weight: 700;">
                              <div>${page.name}</div>
                            </div>
                          </div>
                          <div class="d-flex flex-column" style="gap: 10px;">
                           ${page.live_video.data.map((video)=>{
                            return html`
                              <div class="d-flex align-items-center">
                                <div class="d-flex flex-column" style="font-size: 16px;font-weight: 400;">
                                  <div>${video.title}<span style="font-size: 14px;font-weight: 400;width: 54px;height: 22px;padding: 4px 6px;border-radius: 7px;background: #D8ECDA;">直播中</span></div>
                                  <div style="font-size: 14px;">${formatDateString(video.broadcast_start_time)}</div>
                                </div>
                                <div class="ms-auto cursor_pointer" style="display: flex;height: 36px;padding: 6px 18px;justify-content: center;align-items: center;gap: 8px;border-radius: 10px;background:#393939;font-size: 16px;font-weight: 700;color: #FFF;" onclick="${gvc.event(()=>{
                              streamingData.page_id = page.id;
                              streamingData.live_id = video.id;
                              streamingData.title = page.title;
                              streamingData.comments = [];
                              streamingData.orders = 0;
                              streamingData.accessToken = page.access_token;
                              viewModel.summaryType = 'streaming';

                              gvc.closeDialog();
                            })}">
                                  連接
                                </div>
                              </div>
                             `
                          }).join('')}
                          </div>
                        </div>
                        
                      `;
                        }

                        dialog.dataLoading({
                          visible: true
                        })
                        if (pageLoading){
                          pageLoading = false
                          ApiFbService.getPageAuthList().then((response)=>{
                            pageList = response.response;
                            gvc.notifyDataChange('pageList');
                          })

                          return ``
                        }
                        dialog.dataLoading({
                          visible: false
                        })

                        return html`
                      <div
                        style="width: 573px;border-radius: 10px;background: #FFF;"
                        onclick="${gvc.event(() => {
                          event!.stopPropagation();
                          return;
                        })}"
                      >
                        <div
                          class="w-100"
                          style="display: inline-flex;padding: 12px 20px;justify-content: center;align-items: center;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                        >
                          <div style="font-size: 16px;font-weight: 700;">連接Facebook直播</div>
                          <i
                            class="fa-regular fa-xmark-large ms-auto cursor_pointer"
                            onclick="${gvc.event(() => {
                          gvc.closeDialog();
                        })}"
                          ></i>
                        </div>
                        <div class="w-100 d-flex flex-column" style="gap: 12px;padding: 20px;">
                          <div class="d-flex justify-content-end" style="font-size: 16px;font-weight: 400;">
                            還沒有看到直播？<span style="color: #4D86DB;cursor: pointer;margin-left:5px;" onclick="${gvc.event(()=>{
                              pageLoading = true;
                              gvc.notifyDataChange(`pageList`);
                            })}">重整<i class="fa-solid fa-repeat"></i></span>
                          </div>
                          <div class="d-flex flex-column" style="gap: 12px;">
                            <div class="d-none" style="font-size: 16px;font-weight: 400;">請選擇要直播的粉絲專頁</div>
                            ${pageList.map((page:Page) => renderPageItem(page)).join('')}
                          </div>
                          <div class="d-none justify-content-end">
                            ${BgWidget.save(gvc.event(()=>{
                              const data = pageList.find(page => page.select) || {};
                              
                            }),'確認')}
                          </div>
                        </div>
                      </div>
                    `;
                      },
                      divCreate: {
                        class: 'd-flex align-items-center justify-content-center',
                        style: 'height: 100vh;width: 100vw;',
                        option: [
                          {
                            key: 'onclick',
                            value: gvc.event(() => {
                              gvc.closeDialog();
                            }),
                          },
                        ],
                      },
                    });
                  }, 'pageList');
                  
                }else {
                  vm.type = 'list';
                }
                
              });
            }
          }),
          group_buy ? '舉行團購' : '建立直播'
        )}
      </div>
      ,
    `);
  }

  public static replace(gvc: GVC, vm: any, group_buy?: boolean) {
    vm.data.content;
    //todo 這邊只有拿前100個
    ApiLiveInteraction.getRealCart(vm.data.content.pending_order).then(r => {
      viewModel.realOrder = r.response;
      viewModel.realOrder.forEach((order: any) => {
        viewModel.realTotal += order.orderData.total;
      });
      gvc.notifyDataChange('mainView');
    });
    const dialog = new ShareDialog(gvc.glitter);
    let viewModel: {
      tempCartLoading: boolean;
      lineGroupLoading: boolean;
      lineGroup: any;
      formData: {
        schedule_id: string;
        type: string;
        purpose: string;
        name: string;
        streamer: string;
        platform: string;
        item_list: any[];
        stock: {
          reserve: boolean;
          expiry_date: string;
          period: string;
        };
        discount_set: string;
        lineGroup: {
          groupId: string;
          groupName: string;
        };
        start_date: any;
        start_time: any;
        end_date: any;
        end_time: any;
        status: number;
        pending_order: string[];
        pending_order_total: number;
      };
      cartList: any;
      summaryType: 'normal' | 'prepare' | 'streaming';
      pageLabel: string; //"overview" | "performance" | "product"
      realOrder?: any;
      realTotal: number;
    } = {
      tempCartLoading: true,
      lineGroupLoading: true,
      lineGroup: [],
      cartList: [],
      formData: {
        schedule_id: vm.data.id,
        type: vm.data.type,
        purpose: vm.data.content.purpose,
        name: vm.data.name,
        streamer: vm.data.content.streamer,
        platform: vm.data.content.platform,
        item_list: vm.data.content.item_list,
        stock: vm.data.content.stock,
        discount_set: vm.data.content.discount_set,
        lineGroup: vm.data.content.lineGroup,
        start_date: vm.data.content.start_date,
        start_time: vm.data.content.start_time,
        end_date: vm.data.content.end_date,
        end_time: vm.data.content.end_time,
        status: vm.data.status,
        pending_order: vm.data.content?.pending_order ?? [],
        pending_order_total: vm.data.content?.pending_order_total ?? 0,
      },
      summaryType: 'normal',
      pageLabel: 'overview',
      realOrder: [],
      realTotal: 0,
    };

    function drawPurposeSelect() {
      return (
        BgWidget.mainCard(html`
          <div  style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
            ${gvc.bindView({
              bind: `purposeSelect`,
              view: () => {
                const dataArray = [
                  {
                    text: '商家自用',
                    hint: '自行進行團購',
                    value: 'self',
                  },
                  {
                    text: '合作推廣',
                    hint: '與網紅、KOL及創作者等合作推廣並提升銷售',
                    value: 'collaboration',
                  },
                ];
                const icon = '';
                return dataArray
                  .map(data => {
                    return html`
                      <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 4px;">
                        <div style="display: flex;align-items: center;gap: 6px;">
                          <div
                            style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;background: #FFF;cursor: pointer;"
                          ></div>
                          <div>${data.text}</div>
                        </div>
                        <div
                          style="color: #8D8D8D;display: flex;padding-left: 22px;align-items: flex-start;gap: 14px;align-self: stretch;"
                        >
                          ${data.hint}
                        </div>
                      </div>
                    `;
                  })
                  .join('');
              },
              divCreate: {
                style: `display: flex;flex-direction: column;align-items: flex-start;gap: 12px;`,
              },
            })}
          </div>
        `) + `<div style="margin-top:24px"></div>`
      );
    }

    function drawInsignia(status: number) {
      switch (status) {
        case 1:
          return BgWidget.infoInsignia('開團中');
        case 2:
          return html` <div class="insignia" style="background: #FEE4C3;">結帳中</div> `;
        case 3:
        default:
          return html` <div class="insignia" style="background: #DDD;">已結束</div> `;
      }
    }

    return BgWidget.container(html`
      <div class="title-container ">
        ${BgWidget.goBack(
          gvc.event(() => {
            vm.type = 'list';
          })
        )}
        ${BgWidget.title(viewModel.formData.name)}
        <div style="margin-left: 10px;">${drawInsignia(viewModel.formData.status)}</div>
        <div class="flex-fill"></div>
      </div>
      ${gvc.bindView({
        bind: `pageControl`,
        view: () => {
          const dataSet = [
            {
              label: group_buy ? '團購概覽' : '直播概覽',
              value: 'overview',
            },
            {
              label: group_buy ? '團購成效' : '直播成效',
              value: 'performance',
            },
            // {
            //     label: "商品成效",
            //     value: "product"
            // },
          ];
          return html`
            <div style="display: flex;align-items: center;gap: 22px;">
              ${dataSet
                .map(data => {
                  if (viewModel.pageLabel == data.value) {
                    return html`
                      <div
                        style="display: flex;flex-direction: column;align-items: center;cursor: pointer;"
                        onclick="${gvc.event(e => {
                          viewModel.pageLabel = data.value;
                          viewModel.tempCartLoading = true;
                          gvc.notifyDataChange([`pageControl`]);
                        })}"
                      >
                        <div
                          style="color: #393939;text-align: center;font-size: 18px; font-weight: 700; line-height: 100%;margin-bottom: 8px;"
                        >
                          ${data.label}
                        </div>
                        <div style="width: 100%;height: 2px;background-color: #393939"></div>
                      </div>
                    `;
                  }
                  return html`
                    <div
                      style="display: flex;flex-direction: column;align-items: center;cursor: pointer;"
                      onclick="${gvc.event(e => {
                        viewModel.pageLabel = data.value;
                        gvc.notifyDataChange([`pageControl`]);
                      })}"
                    >
                      <div
                        style="color: #8D8D8D;text-align: center;font-size: 18px; font-weight: 700; line-height: 100%;margin-bottom: 8px;"
                      >
                        ${data.label}
                      </div>
                    </div>
                  `;
                })
                .join('')}
            </div>
          `;
        },
        divCreate: {
          style: 'margin:18px 0;',
        },
      })}
      ${gvc.bindView({
        bind: 'mainView',
        dataList: [
          {
            obj: viewModel,
            key: 'pageLabel',
          },
        ],
        view: () => {
          function drawTopCView() {
            return html`
              ${BgWidget.mainCard(html`
                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                  <div class="w-100" style="display: flex;align-items: center;gap: 26px;">
                    ${(() => {
                      const dateSet = [
                        {
                          title: '團購名稱',
                          value: viewModel.formData.name,
                        },
                        {
                          title: '團購平台',
                          value:
                            viewModel.formData.platform == 'LINE'
                              ? `<i class="fa-brands fa-line" style="color: #3ACE00"></i>`
                              : ``,
                        },
                        {
                          title: '團購群組',
                          value: viewModel.formData.lineGroup.groupName,
                        },
                        {
                          title: '團購時間',
                          value: html` <div >
                            ${viewModel.formData.start_date} ${viewModel.formData.start_time}<br />${viewModel.formData
                              .end_date}
                            ${viewModel.formData.end_time}
                          </div>`,
                        },
                      ];
                      return dateSet
                        .map(data => {
                          return html` <div
                            style="display: flex;flex-direction: column;align-items: flex-start;gap: 8px;flex: 1 0 0;align-self: stretch;"
                          >
                            <div style="font-size: 16px;font-weight: 700;">${data.title}</div>
                            <div style="display: flex;justify-content: center;align-items:center;flex: 1 0 0;">
                              ${data.value}
                            </div>
                          </div>`;
                        })
                        .join('');
                    })()}
                  </div>
                  <div class="w-100" style="display: flex;align-items: center;">
                    ${(() => {
                      const dateSet = [
                        {
                          title: '保留庫存',
                          value: viewModel.formData.stock.reserve
                            ? `期限至${viewModel.formData.stock.expiry_date}`
                            : '不保留庫存',
                        },
                        {
                          title: '優惠折扣',
                          value: viewModel.formData.discount_set ? `套用折扣` : `不套用折扣`,
                        },
                      ];
                      return dateSet
                        .map(data => {
                          return html` <div
                            style="width:25%;display: flex;flex-direction: column;align-items: flex-start;align-self: stretch;gap:8px;"
                          >
                            <div style="font-size: 16px;font-weight: 700;">${data.title}</div>
                            <div style="display: flex;justify-content: center;">${data.value}</div>
                          </div>`;
                        })
                        .join('');
                    })()}
                  </div>
                </div>
              `)}
              <div style="display: flex;align-items: center;gap: 20px;">
                ${(() => {
                  console.log(viewModel);
                  const dataSet = [
                    {
                      title: '跟團人數',
                      value: viewModel.formData.pending_order.length,
                    },
                    {
                      title: '跟團總金額',
                      value: viewModel.formData.pending_order_total,
                    },
                    {
                      title: '實際下單數量',
                      value: viewModel.realOrder.length,
                    },
                    {
                      title: '實際下單總金額',
                      value: viewModel.realTotal,
                    },
                  ];
                  return dataSet
                    .map(data => {
                      return BgWidget.mainCard(html`
                        <div style="display: flex;flex-direction: column;align-items: start;gap: 2.636px;flex: 1 0 0;">
                          <div style="font-size: 14px;font-style: normal;font-weight: 400;">${data.title}</div>
                          <div style="font-size: 24px;font-style: normal;font-weight: 500;">${data.value}</div>
                        </div>
                      `);
                    })
                    .join('');
                })()}
              </div>
            `;
          }

          switch (viewModel.pageLabel) {
            case 'product': {
              break;
            }
            case 'performance': {
              gvc.addStyle(html`
                .copy-text { flex-grow: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } /* 複製圖示
                */ .copy-icon { width: 20px; height: 20px; margin-left: 10px; transition: transform 0.2s; } /* 複製圖示
                */ .copy-icon { width: 20px; height: 20px; transition: transform 0.2s; } /* 點擊時的圖示動畫 */
                .copy-container:active .copy-icon { transform: scale(0.9); }
              `);
              return BgWidget.container(html`
                <div class="d-flex flex-column" style="gap:24px;">
                  ${drawTopCView()}
                  ${BgWidget.mainCard(html`
                    <div style="display: flex;flex-direction: column;gap: 18px;">
                      <div class="d-flex d-none" style="font-size: 16px;font-style: normal;font-weight: 700;gap:10px;">
                        <select class="c_select h-100" style="display: flex;align-items: center;gap: 6px;">
                          <option value="name">跟團者名稱</option>
                        </select>
                        <div class="flex-grow-1 position-relative">
                          <i
                            class="fa-regular fa-magnifying-glass"
                            style="font-size: 18px; color: #A0A0A0; position: absolute; left: 18px; top: 50%; transform: translateY(-50%);"
                          ></i>
                          <input
                            class="form-control flex-grow-1 h-100"
                            style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;"
                            placeholder="搜尋跟團者"
                            value=""
                          />
                        </div>
                        <div class="c_filter_view">
                          <i class="fa-regular fa-filter" aria-hidden="true"></i>
                        </div>
                        <div class="c_filter_view">
                          <i class="fa-regular fa-arrow-up-arrow-down" aria-hidden="true"></i>
                        </div>
                      </div>
                      ${gvc.bindView({
                        bind: 'orderList',
                        view: () => {
                          const dataSet = [
                            {
                              text: '跟團者',
                              width: 'width:10%;',
                            },
                            {
                              text: '跟團商品數',
                              width: '',
                              align: 'justify-content: center;',
                            },
                            {
                              text: '商品總價',
                              width: '',
                            },
                            {
                              text: '訂單編號',
                              width: '',
                              color: 'color: #4D86DB;',
                            },
                            {
                              text: '付款狀態',
                              width: '',
                              align: 'justify-content: center;',
                            },
                            {
                              text: '訂單狀態',
                              width: '',
                              align: 'justify-content: center;',
                            },
                            {
                              text: '購物車紀錄',
                              width: '',
                              align: 'justify-content: center;',
                            },
                          ];
                          if (viewModel.tempCartLoading) {
                            ApiLiveInteraction.getCartList(viewModel.formData.schedule_id).then(r => {
                              viewModel.cartList = r.response.data;
                              viewModel.tempCartLoading = false;
                              gvc.notifyDataChange(['orderList']);
                            });
                          }
                          return html`
                            <div class="d-flex align-items-center" style="margin-bottom:5px;">
                              <div
                                class="fa-light fa-square "
                                style="color: #393939; font-size: 22px;margin-right: 18px;"
                              ></div>
                              <div  style="font-size: 16px;font-weight: 700;${dataSet[0].width}">
                                ${dataSet[0].text}
                              </div>
                              <div class="d-flex flex-grow-1" style="gap:68px;">
                                ${dataSet
                                  .map((data, index) => {
                                    if (index != 0) {
                                      return html`
                                        <div
                                          class="d-flex align-items-center"
                                          style="${data.align ??
                                          ''}width:10%;font-size: 16px;font-style: normal;font-weight: 700;"
                                        >
                                          ${data.text}
                                        </div>
                                      `;
                                    }
                                    return ``;
                                  })
                                  .join('')}
                              </div>
                            </div>
                            ${viewModel.tempCartLoading
                              ? html` <div class="d-flex align-items-center">資料讀取中</div> `
                              : viewModel.cartList.length == 0
                                ? html` <div class="d-flex align-items-center">查無相關資料</div> `
                                : viewModel.cartList
                                    .map((cart: any) => {
                                      console.log('cart -- ', cart);

                                      // {
                                      //     key: '付款狀態',
                                      //             value: (() => {
                                      //     switch (dd.status) {
                                      //         case 0:
                                      //             if (dd.orderData.proof_purchase) {
                                      //                 return BgWidget.warningInsignia('待核款');
                                      //             }
                                      //             if (dd.orderData.customer_info.payment_select == 'cash_on_delivery') {
                                      //                 return BgWidget.warningInsignia('貨到付款');
                                      //             }
                                      //             return BgWidget.notifyInsignia('未付款');
                                      //         case 3:
                                      //             return BgWidget.warningInsignia('部分付款');
                                      //         case 1:
                                      //             return BgWidget.infoInsignia('已付款');
                                      //         case -1:
                                      //             return BgWidget.notifyInsignia('付款失敗');
                                      //         case -2:
                                      //             return BgWidget.notifyInsignia('已退款');
                                      //     }
                                      // })(),
                                      // },
                                      // {
                                      //     key: '訂單狀態',
                                      //             value: (() => {
                                      //
                                      //     switch (dd.orderData.orderStatus ?? '0') {
                                      //         case '-1':
                                      //             return BgWidget.notifyInsignia('已取消');
                                      //         case '0':
                                      //             return BgWidget.warningInsignia('處理中');
                                      //         case '1':
                                      //             return BgWidget.infoInsignia('已完成');
                                      //     }
                                      // })(),
                                      // },

                                      return html` <div class="d-flex align-items-center">
                                        <div
                                          class="fa-light fa-square "
                                          style="color: #393939; font-size: 22px;margin-right: 18px;"
                                        ></div>
                                        <div
                                          class="d-flex align-items-center"
                                          style="font-size: 16px;font-weight: 700;${dataSet[0].width}"
                                        >
                                          <img
                                            style="width: 40px;height: 40px;border-radius: 100px;margin-right:12px;"
                                            src="${cart.content.from.user_photo}"
                                            alt="photo"
                                          />
                                          ${cart.content.from.user_name}
                                        </div>
                                        <div class="d-flex flex-grow-1" style="gap:68px;">
                                          ${dataSet
                                            .map((data, index) => {
                                              function drawOrderRaw(index: number) {
                                                const link = cart.content.cart_data
                                                  ? cart.content.cart_data.order_id
                                                  : html` <div
                                                      style="cursor:pointer"
                                                      onclick="${gvc.event(() => {
                                                        const dialog = new ShareDialog(gvc.glitter);
                                                        navigator.clipboard.writeText(cart.content.checkUrl);
                                                        dialog.successMessage({ text: '已複製此客戶的結帳資訊' });
                                                      })}"
                                                    >
                                                      <i style="color:#393939;" class="fa-solid fa-copy copy-icon"></i
                                                      >連結
                                                    </div>`;
                                                const showData = [
                                                  cart.content.from.user_name,
                                                  cart.content.cart.length,
                                                  `$${cart.content.total}`,
                                                  link,
                                                  '未付款',
                                                  '處理中',
                                                ];
                                                switch (index) {
                                                  case 3: {
                                                    return html`
                                                      <div
                                                        class="d-flex align-items-center "
                                                        style="${data.color ?? ''}${data.align ??
                                                        ''}width:10%;font-size: 16px;font-style: normal;font-weight: 700;"
                                                      >
                                                        ${showData[index]}
                                                      </div>
                                                    `;
                                                  }
                                                  case 4:
                                                  case 5: {
                                                    if (cart.content.cart_data) {
                                                      if (index == 4) {
                                                        return html`
                                                          <div
                                                            class="d-flex align-items-center justify-content-center"
                                                            style="width:10%;font-size: 16px;font-style: normal;font-weight: 700;"
                                                          >
                                                            ${(() => {
                                                              switch (cart.checkoutInfo.status) {
                                                                case 0:
                                                                  if (cart.checkoutInfo.orderData.proof_purchase) {
                                                                    return BgWidget.warningInsignia('待核款');
                                                                  }
                                                                  if (
                                                                    cart.checkoutInfo.orderData.customer_info
                                                                      .payment_select == 'cash_on_delivery'
                                                                  ) {
                                                                    return BgWidget.warningInsignia('貨到付款');
                                                                  }
                                                                  return BgWidget.notifyInsignia('未付款');
                                                                case 3:
                                                                  return BgWidget.warningInsignia('部分付款');
                                                                case 1:
                                                                  return BgWidget.infoInsignia('已付款');
                                                                case -1:
                                                                  return BgWidget.notifyInsignia('付款失敗');
                                                                case -2:
                                                                  return BgWidget.notifyInsignia('已退款');
                                                              }
                                                            })()}
                                                          </div>
                                                        `;
                                                      } else {
                                                        return html`
                                                          <div
                                                            class="d-flex align-items-center justify-content-center"
                                                            style="width:10%;font-size: 16px;font-style: normal;font-weight: 700;"
                                                          >
                                                            ${(() => {
                                                              switch (cart.checkoutInfo.orderData.orderStatus ?? '0') {
                                                                case '-1':
                                                                  return BgWidget.notifyInsignia('已取消');
                                                                case '0':
                                                                  return BgWidget.warningInsignia('處理中');
                                                                case '1':
                                                                  return BgWidget.infoInsignia('已完成');
                                                              }
                                                            })()}
                                                          </div>
                                                        `;
                                                      }
                                                      return;
                                                    } else {
                                                      return html`
                                                        <div
                                                          class="d-flex align-items-center justify-content-center"
                                                          style="${data.align ??
                                                          ''}width:10%;font-size: 16px;font-style: normal;font-weight: 700;"
                                                        >
                                                          -
                                                        </div>
                                                      `;
                                                    }
                                                  }
                                                  case 6: {
                                                    return html`
                                                      <div
                                                        class="align-items-center justify-content-center"
                                                        style="width:10%;display: flex;padding: 6px 18px;border-radius: 10px;background: #F7F7F7;font-size: 16px;font-weight: 400;"
                                                      >
                                                        查閱
                                                      </div>
                                                    `;
                                                  }
                                                  case 1:
                                                  case 2:
                                                  default: {
                                                    return html`
                                                      <div
                                                        class="d-flex align-items-center "
                                                        style="${data.align ??
                                                        ''}width:10%;font-size: 16px;font-style: normal;font-weight: 700;"
                                                      >
                                                        ${showData[index]}
                                                      </div>
                                                    `;
                                                  }
                                                }
                                              }

                                              if (index != 0) {
                                                return drawOrderRaw(index);
                                              }
                                              return ``;
                                            })
                                            .join('')}
                                        </div>
                                      </div>`;
                                    })
                                    .join('')}
                          `;
                        },
                        divCreate: { class: `d-flex flex-column`, style: `gap:18px` },
                      })}
                    </div>
                  `)}
                </div>
              `);
              break;
            }
            case 'overview':
            default: {
              if (group_buy) {
                return BgWidget.container(html`
                  <div class="d-flex flex-column" style="gap:24px;">
                    ${drawTopCView()}
                    ${BgWidget.mainCard(html`
                      <div style="display: flex;flex-direction: column;gap: 18px;">
                        <div style="font-size: 16px;font-style: normal;font-weight: 700;">團購商品</div>
                        ${gvc.bindView({
                          bind: 'itemList',
                          view: () => {
                            const dataSet = [
                              {
                                text: '商品名稱',
                                width: 'width:35%;padding-right:8px;',
                              },
                              {
                                text: '價格',
                                width: 'width:25%;',
                              },
                              {
                                text: '可售數量',
                                width: 'width:20%;',
                              },
                              {
                                text: '售出數量',
                                width: 'width:20%;',
                              },
                            ];
                            return html`
                              <div class="d-flex w-100 flex-column" style="gap:18px;">
                                <div class="d-flex" style="padding-bottom:12px;border-bottom: 1px solid #DDD;">
                                  ${dataSet
                                    .map(data => {
                                      return html`
                                        <div style="${data.width} font-size: 16px;font-style: normal;font-weight: 400;">
                                          ${data.text}
                                        </div>
                                      `;
                                    })
                                    .join('')}
                                </div>

                                ${viewModel.formData.item_list
                                  .map((item: any) => {
                                    //多規格
                                    if (item.content.specs.length > 0) {
                                      return html`
                                        <div class="d-flex flex-column">
                                          <div class="d-flex align-items-center w-100 " >
                                            <div class="d-flex flex-column w-100" style="gap: 8px;">
                                              ${item.content.variants
                                                .map((variant: any) => {
                                                  //todo 這邊前端顯示和設計圖不一致
                                                  return html`
                                                    <div class="d-flex align-items-center w-100">
                                                      <div
                                                        class="d-flex"
                                                        style="${dataSet[0]
                                                          .width};font-size: 16px;font-weight: 400;gap:12px;"
                                                      >
                                                        <img
                                                          style="width: 40px;height: 40px;border-radius: 10px;"
                                                          src="${item.content.preview_image[0]}"
                                                          alt="preview"
                                                        />
                                                        <div
                                                          class="d-flex align-items-center"
                                                          style="font-size: 16px;font-style: normal;font-weight: 400;"
                                                        >
                                                          ${Tool.truncateString(item.content.title, 8)} /
                                                          ${variant.specs.join(',')}
                                                        </div>
                                                      </div>
                                                      <div
                                                        style="${dataSet[1].width};font-size: 14px;font-weight: 400;"
                                                      >
                                                        $ ${variant.live_model.live_price}
                                                      </div>
                                                      <div
                                                        style="${dataSet[2].width};font-size: 14px;font-weight: 400;"
                                                      >
                                                        ${variant.live_model.available_Qty}
                                                      </div>
                                                      <div
                                                        style="${dataSet[3].width};font-size: 14px;font-weight: 400;"
                                                      >
                                                        ${variant.live_model?.sold ?? 0}
                                                      </div>
                                                    </div>
                                                  `;
                                                })
                                                .join('')}
                                            </div>
                                          </div>
                                        </div>
                                      `;
                                      //單一規格
                                    } else {
                                      return html`
                                        <div class="d-flex flex-column">
                                          <div class=" d-flex align-items-center" style="${dataSet[0].width};gap:12px;">
                                            <img
                                              style="width: 40px;height: 40px;border-radius: 10px;"
                                              src="${item.content.preview_image[0]}"
                                              alt="preview"
                                            />
                                            <div
                                              class="d-flex align-items-center"
                                              style="font-size: 16px;font-style: normal;font-weight: 400;"
                                            >
                                              ${item.content.title}
                                            </div>
                                          </div>
                                          <div class="d-flex align-items-center w-100 " >
                                            <div class="d-flex flex-column w-100" style="gap: 8px;">
                                              ${item.content.variants
                                                .map((variant: any) => {
                                                  return html`
                                                    <div class="d-flex align-items-center w-100">
                                                      <div
                                                        style="${dataSet[0]
                                                          .width};padding-left: 52px;font-size: 16px;font-weight: 400;"
                                                      >
                                                        ${variant.spec.join('')}
                                                      </div>
                                                      <div
                                                        style="${dataSet[1].width};font-size: 14px;font-weight: 400;"
                                                      >
                                                        $ ${variant.live_model.live_price}
                                                      </div>
                                                      <div
                                                        style="${dataSet[2].width};font-size: 14px;font-weight: 400;"
                                                      >
                                                        ${variant.live_model.available_Qty}
                                                      </div>
                                                      <div
                                                        style="${dataSet[3].width};font-size: 14px;font-weight: 400;"
                                                      >
                                                        ${variant.live_model?.sold ?? 0}
                                                      </div>
                                                    </div>
                                                  `;
                                                })
                                                .join('')}
                                            </div>
                                          </div>
                                        </div>
                                      `;
                                    }
                                  })
                                  .join('')}
                              </div>
                            `;
                          },
                          divCreate: {},
                        })}
                      </div>
                    `)}
                  </div>
                `);
              }
              return BgWidget.container1x2(
                {
                  html: html`
                    <div style="display: flex;flex-direction: column;gap: 24px;">
                      ${BgWidget.mainCard(html`
                        <div style="display: flex;align-items: center;gap: 26px;">
                          ${(() => {
                            const dateSet = [{}];
                            return '';
                          })()}
                        </div>
                        <div style="display: flex;align-items: flex-start;gap: 36px;"></div>
                      `)}
                    </div>
                  `,
                  ratio: 70,
                },
                { html: '', ratio: 30 }
              );
            }
          }
          return ``;
        },
        divCreate: {},
      })}
      <div style="margin-top:240px;"></div>
      <div class="update-bar-container" >
        ${BgWidget.cancel(
          gvc.event(() => {
            vm.type = 'list';
          }),
          '返回'
        )}
        ${viewModel.formData.status == 1
          ? BgWidget.save(
              gvc.event(async () => {
                dialog.dataLoading({
                  visible: true,
                });
                await ApiLiveInteraction.closeSchedule(vm.data.id);
                vm.data.status = 2;
                dialog.dataLoading({
                  visible: false,
                });
                vm.type = 'replace';
              }),
              '結束團購'
            )
          : ``}
        ${viewModel.formData.status == 2
          ? BgWidget.save(
              gvc.event(async () => {
                dialog.dataLoading({
                  visible: true,
                });
                await ApiLiveInteraction.finishSchedule(vm.data.id);
                vm.data.status = 3;
                dialog.dataLoading({
                  visible: false,
                });
                vm.type = 'replace';
              }),
              '確認收單'
            )
          : ``}
      </div>
    `);
  }

  public static inputVerificationCode(gvc: GVC) {
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(gvc.glitter);
    let code = '';
    gvc.addStyle(`.verification-container {
            max-width: 400px;
            margin: 80px auto;
            padding: 30px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .btn-primary {
            background-color: #007bff;
            border: none;
        }
        .btn-primary:hover {
            background-color: #0056b3;
        }`);
    return html` <div class="container" >
      <div class="verification-container text-center">
        <h2 class="mb-3">🔐 驗證您的帳號</h2>
        <p class="text-muted">請輸入您的 <strong>Shopnex</strong> 驗證碼以完成綁定。</p>

        <input
          type="text"
          id="verificationCode"
          class="form-control text-center mb-3"
          maxlength="8"
          placeholder="輸入 8 碼驗證碼"
          onchange="${gvc.event(e => {
            code = e.value;
          })}"
        />

        <p id="errorMessage" class="text-danger" style="display: none;">請輸入 8 碼驗證碼</p>

        <button
          class="btn btn-primary w-100"
          onclick="${gvc.event(() => {
            const groupId = glitter.getUrlParameter('groupId');
            ApiShop.verifyVerificationCode({
              code: code,
              groupId: groupId,
            }).then(r => {
              if (r.response.result == 'error') {
                dialog.errorMessage({
                  text: r.response.data,
                  callback: () => {},
                });
              } else {
                dialog.successMessage({
                  text: '綁定成功，已可關閉視窗',
                });
              }
            });
          })}"
        >
          確認驗證
        </button>
      </div>
    </div>`;
  }
}

(window as any).glitter.setModule(import.meta.url, LiveCapture);

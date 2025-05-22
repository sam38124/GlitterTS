import { GVC } from '../glitterBundle/GVController.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiWallet } from '../glitter-base/route/wallet.js';
import { UserList } from './user-list.js';
import { Tool } from '../modules/tool.js';
import { FilterOptions } from '../cms-plugin/filter-options.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiMarket } from '../glitter-base/route/market';
const html=String.raw;
const css = String.raw;

interface Banner {
  image: string;
  link: string;
}
interface App {
  name: string;
  image: string;
  link: string;
  rate: number;
  rate_count: number;
  description: string;
  tag: string[];
  price: number;
}
export class AppMarket {
  public static main(gvc: GVC) {
    const glitter = gvc.glitter;
    const vm: {
      id: string;
      type: 'landing' | 'detail';
      banner : Banner;
      app_list: App[];
      show_app_list:App[];
      tag_list:string[];
    } = {
      id: glitter.getUUID(),
      type: 'landing',
      banner:{
        image:"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_ses9s7s5sbs5sbse_%E5%AE%B6%E5%85%B7banner2.png",
        link:"",
      },
      app_list: [],
      show_app_list:[],
      tag_list:[]
    };
    const dialog = new ShareDialog(gvc.glitter);
    function drawBanner() {
      gvc.addStyle(css`
        .banner {
          background-image: url("${vm.banner.image}");
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          height: 250px;
          width: 100%;
          
        }

        .banner h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }

        .banner p {
          font-size: 16px;
          margin-bottom: 20px;
        }

        .btn {
          background-color: #fff;
          color: #4CAF50;
          padding: 10px 20px;
          font-size: 16px;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .btn:hover {
          background-color: #45a049; /* Darker green on hover */
          color: white;
        }
      `)
      return html`<!-- Banner Section -->
        <div class="banner">
         
        </div>
      `
    }
    function getAppList() {
      ApiMarket.getAppList().then((dd: any) => {
        console.log("dd -- " , dd);
      })
      vm.app_list = [
        {
          name: 'ShopNex',
          image: 'https://example.com/images/shopnex.jpg',
          link: 'https://www.shopnex.com',
          rate: 3.5,
          rate_count: 557,
          description: 'An all-in-one e-commerce platform with AI-powered tools.',
          tag: ['e-commerce', 'AI', 'business'],
          price: 638
        },
        {
          name: 'QuickShop',
          image: 'https://example.com/images/quickshop.jpg',
          link: 'https://www.quickshop.com',
          rate: 3.2,
          rate_count: 7338,
          description: 'A fast and easy platform to set up online stores.',
          tag: ['shopping', 'fast', 'platform'],
          price: 951
        },
        {
          name: 'ShopMaster',
          image: 'https://example.com/images/shopmaster.jpg',
          link: 'https://www.shopmaster.com',
          rate: 4.4,
          rate_count: 1675,
          description: 'ShopMaster helps you manage all your online sales in one place.',
          tag: ['management', 'e-commerce', 'business'],
          price: 48
        },
        {
          name: 'EasyCart',
          image: 'https://example.com/images/easycart.jpg',
          link: 'https://www.easycart.com',
          rate: 4.7,
          rate_count: 2558,
          description: 'EasyCart is an intuitive shopping cart solution for businesses.',
          tag: ['shopping', 'cart', 'business'],
          price: 284
        },
        {
          name: 'MarketPro',
          image: 'https://example.com/images/marketpro.jpg',
          link: 'https://www.marketpro.com',
          rate: 3.7,
          rate_count: 5630,
          description: 'MarketPro is a comprehensive marketing automation tool for online stores.',
          tag: ['marketing', 'automation', 'e-commerce'],
          price: 1672
        },
        {
          name: 'EasyShop',
          image: 'https://example.com/images/easyshop.jpg',
          link: 'https://www.easyshop.com',
          rate: 4.0,
          rate_count: 5041,
          description: 'A simple and intuitive shopping app for all your needs.',
          tag: ['shopping', 'simple', 'easy'],
          price: 79
        },
        {
          name: 'ShopifyPlus',
          image: 'https://example.com/images/shopifyplus.jpg',
          link: 'https://www.shopifyplus.com',
          rate: 4.5,
          rate_count: 6995,
          description: 'Advanced e-commerce platform for growing businesses.',
          tag: ['e-commerce', 'enterprise', 'business'],
          price: 2948
        },
        {
          name: 'CartQuick',
          image: 'https://example.com/images/cartquick.jpg',
          link: 'https://www.cartquick.com',
          rate: 4.5,
          rate_count: 3409,
          description: 'Boost your sales with quick and easy cart management.',
          tag: ['sales', 'cart', 'boost'],
          price: 51
        },
        {
          name: 'SwiftBuy',
          image: 'https://example.com/images/swiftbuy.jpg',
          link: 'https://www.swiftbuy.com',
          rate: 3.9,
          rate_count: 2347,
          description: 'A fast, user-friendly online shopping experience.',
          tag: ['shopping', 'fast', 'user-friendly'],
          price: 190
        },
        {
          name: 'PayMaster',
          image: 'https://example.com/images/paymaster.jpg',
          link: 'https://www.paymaster.com',
          rate: 3.6,
          rate_count: 5730,
          description: 'Manage your payments and sales efficiently.',
          tag: ['payment', 'management', 'business'],
          price: 241
        },
        {
          name: 'FastTrack',
          image: 'https://example.com/images/fasttrack.jpg',
          link: 'https://www.fasttrack.com',
          rate: 3.6,
          rate_count: 3841,
          description: 'A rapid e-commerce platform for fast-growing businesses.',
          tag: ['e-commerce', 'growth', 'business'],
          price: 481
        },
        {
          name: 'GlobalMarket',
          image: 'https://example.com/images/globalmarket.jpg',
          link: 'https://www.globalmarket.com',
          rate: 4.9,
          rate_count: 840,
          description: 'Global marketplace for a wide range of products.',
          tag: ['marketplace', 'global', 'e-commerce'],
          price: 913
        }
      ];
      filterAppTag()
      gvc.notifyDataChange(vm.id);
    }
    function drawCard(app:App) {
      gvc.addStyle(css`
        .app-card{
          border-radius: 10px;
          border: 1px solid #DDD;
          background: #FFF;
        }
      `)
      return html`
        <div class="d-flex flex-column app-card " style="width: 23%;">
          <img style="height: 176px;width: 100%;" src="${app.image}" alt="${app.name}">
          <div class="d-flex flex-column " style="gap:10px;padding: 12px;">
            <div class="d-flex flex-column" style="gap: 6px;">
              <div class="d-flex flex-column" style="gap: 2px">
                <div class="tx_700 tx_normal">
                  ${app.name}
                </div>
                <div class="d-flex" style="gap:4px">
                  <div class="d-flex flex-fill align-items-center" style="gap: 4px;">
                    <i class="fa-solid fa-star" style="color: #FFB21C;"></i>
                    <div class="tx_">${app.rate}</div>
                    <div class="tx_gray_12">(${app.rate_count})</div>
                  </div>
                  <div class="tx_gray_14" style="letter-spacing: 0.28px;">
                    ${(app.price == 0)?"免費":app.price}
                  </div>
                </div>
              </div>
              <div class="tx_normal_14 text-break" style="letter-spacing: 0.28px;">
                ${Tool.truncateString(app.description , 12)}
              </div>
            </div>
            <div class="d-flex" style="gap: 6px"></div>
          </div>
        </div>
      `
    }
    function filterAppTag(){
      vm.app_list.forEach(app=>{
        app.tag.forEach(tag=>{
          if(vm.tag_list.indexOf(tag) == -1){
            vm.tag_list.push(tag);
          }
        })
      })
    }
    function drawTag(){
      return html``
    }
    return gvc.bindView(() => {
      return {
        bind: vm.id,
        dataList: [{ obj: vm, key: 'type' }],
        view: () => {
          if (vm.type === 'landing') {
            if (vm.app_list.length === 0) {
              getAppList()
            }
            vm.show_app_list = vm.show_app_list.length ? vm.show_app_list : vm.app_list;
            return html`
            ${drawBanner()}
            ${BgWidget.mainCard(
              gvc.bindView({
                bind:"",
                view:()=>{
                  return ``
                },divCreate:{
                  class:'d-flex w-100 overflow-scroll',
                  style:'gap:10px'
                }
              })+
              ``+
              gvc.bindView({
                bind:"",
                view:()=>{
                  return vm.show_app_list.map(app => {
                    return drawCard(app);
                  }).join('')
                },divCreate:{
                  class:'d-flex flex-wrap justify-content-between',
                  style:'gap:18px'
                }
              })
              
            )}
          `;
          }else {
            return ``
          }

        },divCreate:{
          class:'d-flex flex-column',
          style:'gap: 24px;'
        },
      };
    });
  }

}

(window as any).glitter.setModule(import.meta.url, AppMarket);

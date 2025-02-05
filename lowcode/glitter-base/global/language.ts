export class Language {
    public static languageSupport() {
        const sup = [
            {
                key: 'en-US',
                value: 'English',
            },
            {
                key: 'zh-CN',
                value: '简体中文',
            },
            {
                key: 'zh-TW',
                value: '繁體中文',
            },
        ];
        return sup
            .filter((dd) => {
                return (window.parent as any).store_info.language_setting.support.includes(dd.key);
            })
            .sort((dd: any) => {
                return dd.key === (window.parent as any).store_info.language_setting.def ? -1 : 1;
            });
    }

    public static getLanguage() {
        if ((window as any).glitter.getUrlParameter('function') === 'backend-manger') {
            return `zh-TW`;
        }
        let last_select = localStorage.getItem('select_language_' + (window as any).appName) || navigator.language;
        if (!(window as any).store_info.language_setting.support.includes(last_select)) {
            last_select = (window as any).store_info.language_setting.def;
        }
        return last_select;
    }

    public static getLanguageLinkPrefix(pre: boolean = true, compare?: string, d_window?: Window) {
        const lan = (() => {
            if ((compare || Language.getLanguage()) !== (d_window || (window as any)).store_info.language_setting.def) {
                switch (compare || Language.getLanguage()) {
                    case 'en-US':
                        return `en`;
                    case 'zh-CN':
                        return `cn`;
                    case 'zh-TW':
                        return `tw`;
                }
            }
            return '';
        })();
        if (lan) {
            if (pre) {
                return `${lan}/`;
            } else {
                return `/${lan}`;
            }
        } else {
            return ``;
        }
    }

    public static getLanguageText(cf: { local?: boolean; compare?: string }) {
        const sup = [
            {
                key: 'en-US',
                value: cf.local ? 'English' : '英',
            },
            {
                key: 'zh-CN',
                value: cf.local ? '简体中文' : '简',
            },
            {
                key: 'zh-TW',
                value: cf.local ? '繁體中文' : '繁',
            },
        ];
        return sup.find((dd) => {
            return dd.key === (cf.compare || Language.getLanguage());
        })?.value;
    }

    public static setLanguage(value: any) {
        localStorage.setItem('select_language_' + (window as any).appName, value);
    }

    public static text(key: string) {
        const find_ = this.languageDataList().find((dd) => {
            return dd.key === key;
        }) as any;
        if (!find_) {
            return undefined;
        }
        return find_[
            (() => {
                switch (Language.getLanguage()) {
                    case 'zh-TW':
                        return 'tw';
                    case 'zh-CN':
                        return 'cn';
                    case 'en-US':
                        return 'en';
                    default:
                        return `en`;
                }
            })()
        ];
    }

    public static checkKeys() {
        const arr = this.languageDataList();
        const keySet = new Set();

        for (const item of arr) {
            if (keySet.has(item.key)) {
                alert(`重複值: ${item.key}`);
                return;
            } else {
                keySet.add(item.key);
            }
        }

        alert('沒有重複值');
        return;
    }

    public static languageDataList() {
        return [
            {
                key: 'c_cancel_order',
                tw: '請問確定要取消此訂單嗎?',
                cn: '请问确定要取消此订单吗?',
                en: `Are you sure you want to cancel this order?`,
            },
            { key: 's_cancel_order', tw: '取消訂單成功', cn: '取消订单成功', en: `Order canceled successfully` },
            { key: 'newWebPay', tw: '藍新金流', cn: '蓝新金流', en: `NewebPay` },
            { key: 'ecPay', tw: '綠界金流', cn: '绿界金流', en: `EcPay` },
            { key: 'paypal', tw: 'Paypal', cn: 'Paypal', en: `Paypal` },
            { key: 'line_pay', tw: 'Line Pay', cn: 'Line Pay', en: `Line Pay` },
            { key: 'atm', tw: 'ATM 轉帳', cn: 'ATM 转帐', en: `ATM Transfer` },
            { key: 'line', tw: 'Line 轉帳', cn: 'Line 转帐', en: `Line Bank` },
            { key: 'cash_on_delivery', tw: '貨到付款', cn: '货到付款', en: `Cash on delivery` },
            { key: 'country', tw: '國家', cn: '国家', en: `Country` },
            { key: 'select_country', tw: '選擇國家', cn: '选择国家', en: `Select country` },
            { key: 'stock_count', tw: '商品庫存', cn: '商品库存', en: `Stock quantity` },
            { key: 'birth', tw: '生日', cn: '生日', en: `Birth` },
            { key: 'buy_it_now', tw: '立即購買', cn: '立即购买', en: `Buy it now` },
            { key: 'cart', tw: '購物車', cn: '购物车', en: `Cart` },
            {
                key: 'min_p_count_d',
                tw: '_p_ 最少購買數量為_c_件',
                cn: '_p_ 最少购买数量为_c_件',
                en: `_p_ Minimum purchase quantity is _c_ pieces.`,
            },
            {
                key: 'max_p_count_d',
                tw: '_p_ 最多購買數量為_c_件',
                cn: '_p_ 最多购买数量为_c_件',
                en: `_p_ Maximum purchase quantity is _c_ pieces.`,
            },
            {
                key: 'min_p_count',
                tw: '此商品最少購買數量為_c_件',
                cn: '此商品最少购买数量为_c_件',
                en: `Minimum purchase quantity is _c_ pieces.`,
            },
            {
                key: 'max_p_count',
                tw: '此商品最多購買數量為_c_件',
                cn: '此商品最多购买数量为_c_件',
                en: `Maximum purchase quantity is _c_ pieces.`,
            },
            { key: 'ship_global_express', tw: '國際快遞', cn: '国际快递', en: `International express` },
            { key: 'ship_HILIFEC2C', tw: '萊爾富店到店', cn: '莱尔富店到店', en: `Hi-Life Store-to-Store Delivery` },
            { key: 'ship_OKMARTC2C', tw: 'OK超商店到店', cn: 'OK超商店到店', en: `OK Mart Store-to-Store Delivery` },
            {
                key: 'ship_UNIMARTC2C',
                tw: '7-ELEVEN超商交貨便',
                cn: '7-ELEVEN便利店送货便',
                en: `7-ELEVEN Store Delivery Service`,
            },
            { key: 'ship_shop', tw: '實體門市取貨', cn: '实体门市取货', en: `In-Store Pickup` },
            { key: 'ship_FAMIC2C', tw: '全家店到店', cn: '全家店到店', en: `FamilyMart Store-to-Store Delivery` },
            { key: 'ship_black_cat', tw: '黑貓到府', cn: '黑猫到府', en: `Black Cat Home Delivery` },
            { key: 'ship_normal', tw: '中華郵政', cn: '中华邮政', en: `Chunghwa Post` },
            { key: 'next', tw: '下一步', cn: '下一步', en: `Next` },
            { key: 'please_wait', tw: '請稍候...', cn: '請稍候...', en: `Please wait...` },
            { key: 'related_products', tw: '相關商品', cn: '相關商品', en: 'Related Products' },
            { key: 'product_description', tw: '商品描述', cn: '商品描述', en: 'Product Description' },
            { key: 'switch_language', tw: '切換語言', cn: '切换语言', en: 'Switch language' },
            { key: 'shopping_details', tw: '購物明細', cn: '购物明细', en: 'Shopping details' },
            { key: 'your_shopping_cart', tw: '您的購物車', cn: '您的购物车', en: 'Your shopping cart' },
            { key: 'product_name', tw: '商品名稱', cn: '商品名称', en: 'Product name' },
            { key: 'specification', tw: '規格', cn: '规格', en: 'Specification' },
            { key: 'unit_price', tw: '單價', cn: '单价', en: 'Unit price' },
            { key: 'quantity', tw: '數量', cn: '数量', en: 'Quantity' },
            { key: 'subtotal', tw: '小計', cn: '小计', en: 'Subtotal' },
            { key: 'total', tw: '合計', cn: '合计', en: 'Total' },
            { key: 'out_of_stock', tw: '庫存不足', cn: '庫存不足', en: 'Out of Stock' },
            { key: 'total_products', tw: '商品總計', cn: '商品总计', en: 'Total products' },
            { key: 'shipping_fee', tw: '運費', cn: '运费', en: 'Shipping fee' },
            { key: 'discount_coupon', tw: '優惠券折抵', cn: '优惠券折抵', en: 'Discount coupon' },
            { key: 'promo_code', tw: '優惠代碼', cn: '优惠码', en: 'Coupon code' },
            { key: 'discount', tw: '折抵', cn: '折抵', en: 'Discount' },
            { key: 'remaining_balance', tw: '您目前剩餘', cn: '您目前剩余', en: 'Your remaining balance' },
            { key: 'point', tw: '點', cn: '点', en: '' },
            {
                key: 'max_discount_order',
                tw: '此份訂單最多可折抵',
                cn: '此份订单最多可折抵',
                en: 'Maximum discount for this order',
            },
            { key: 'total_amount', tw: '總金額', cn: '总金额', en: 'Total amount' },
            { key: 'additional_purchase_items', tw: '可加購商品', cn: '可加购商品', en: 'Additional purchase items' },
            {
                key: 'payment_and_shipping_methods',
                tw: '付款及配送方式',
                cn: '付款及配送方式',
                en: 'Payment and shipping',
            },
            { key: 'payment_method', tw: '付款方式', cn: '付款方式', en: 'Payment method' },
            { key: 'shipping_method', tw: '配送方式', cn: '配送方式', en: 'Shipping method' },
            { key: 'shipping_address', tw: '配送地址', cn: '配送地址', en: 'Shipping address' },
            { key: 'customer_info', tw: '顧客資料', cn: '顾客资料', en: 'Customer information' },
            { key: 'name', tw: '姓名', cn: '姓名', en: 'Name' },
            { key: 'contact_number', tw: '聯絡電話', cn: '联系电话', en: 'Contact number' },
            { key: 'email', tw: '電子信箱', cn: '电子邮箱', en: 'Email' },
            { key: 'recipient_info', tw: '收件人資料', cn: '收件人资料', en: 'Recipient information' },
            { key: 'invoice_recipient', tw: '發票開立對象', cn: '发票开立对象', en: 'Invoice recipient' },
            { key: 'invoice_method', tw: '開立方式', cn: '开立方式', en: 'Invoice method' },
            { key: 'delivery_notes', tw: '送貨備註', cn: '送货备注', en: 'Delivery notes' },
            {
                key: 'enter_delivery_notes',
                tw: '請輸入送貨備註',
                cn: '请输入送货备注',
                en: 'Please enter delivery notes',
            },
            { key: 'send_to_user_email', tw: '傳送至用戶信箱', cn: '传送至用户邮箱', en: 'Send to user email' },
            { key: 'mobile_barcode_device', tw: '手機條碼載具', cn: '手机条码载具', en: 'Mobile barcode device' },
            { key: 'add_to_cart', tw: '加入購物車', cn: '加入购物车', en: 'Add to Cart' },
            { key: 'add_to_cart_success', tw: '加入成功', cn: '加入成功', en: 'Added successfully' },
            {
                key: 'empty_cart_message',
                tw: '購物車是空的，趕快前往挑選您心儀的商品',
                cn: '购物车是空的，赶快前往挑选您心仪的商品',
                en: 'Your shopping cart is empty. Quickly go pick out your favorite items',
            },
            {
                key: 'same_as_buyer_info',
                tw: '收件人同購買人資料',
                cn: '收件人同购买人资料',
                en: 'Recipient same as buyer information',
            },
            { key: 'personal', tw: '個人', cn: '个人', en: 'Personal' },
            { key: 'company', tw: '公司', cn: '公司', en: 'Company' },
            { key: 'donate_invoice', tw: '捐贈發票', cn: '捐赠发票', en: 'Donate invoice' },
            { key: 'carrier_number', tw: '載具號碼', cn: '载具号码', en: 'Carrier number' },
            { key: 'company_name', tw: '公司名稱', cn: '公司名称', en: 'Company name' },
            { key: 'company_tax_id', tw: '公司統一編號', cn: '公司统一编码', en: 'Company tax ID' },
            { key: 'donation_code', tw: '捐贈碼', cn: '捐赠码', en: 'Donation code' },
            { key: 'add', tw: '新增', cn: '新增', en: 'Add' },
            { key: 'available_coupons', tw: '可使用的優惠券', cn: '可使用的优惠券', en: 'Available coupons' },
            { key: 'enter_code', tw: '輸入代碼', cn: '输入代码', en: 'Enter code' },
            { key: 'coupon_name', tw: '優惠券名稱', cn: '优惠券名称', en: 'Coupon name' },
            { key: 'coupon_code', tw: '優惠券代碼', cn: '优惠券代码', en: 'Coupon code' },
            { key: 'expiration_date', tw: '使用期限', cn: '使用期限', en: 'Expiration date' },
            { key: 'no_expiration', tw: '無使用期限', cn: '无使用期限', en: 'No expiration' },
            { key: 'select_to_use', tw: '選擇使用', cn: '选择使用', en: 'Select to use' },
            {
                key: 'not_meet_usage_criteria',
                tw: '未達使用標準',
                cn: '未达使用标准',
                en: 'Does not meet usage criteria',
            },
            { key: 'code_unusable', tw: '此代碼無法使用', cn: '此代码无法使用', en: 'This code cannot be used' },
            { key: 'enter_promo_code', tw: '請輸入優惠代碼', cn: '请输入优惠代码', en: 'Please enter coupon code' },
            { key: 'confirm', tw: '確認', cn: '确认', en: 'Confirm' },
            { key: 'enter_value', tw: '請輸入數值', cn: '请输入数值', en: 'Please enter a value' },
            { key: 'apply', tw: '套用', cn: '应用', en: 'Apply' },
            { key: 'can_use_now', tw: '即可使用', cn: '即可使用', en: 'Can use now' },
            { key: 'select_pickup_store', tw: '選擇配送門市', cn: '选择配送门市', en: 'Select pickup store' },
            { key: 'click_to_reselct_store', tw: '點擊重選門市', cn: '点击重选门市', en: 'Click to reselect store' },
            { key: 'please_enter', tw: '請輸入', cn: '请输入', en: 'Please enter' },
            {
                key: 'city',
                tw: '城市',
                cn: '城市',
                en: 'City',
            },
            {
                key: 'state',
                tw: '州/省',
                cn: '州/省',
                en: 'State/Province',
            },
            {
                key: 'postal_code',
                tw: '郵遞區號',
                cn: '邮政编码',
                en: 'Postal code',
            },

            {
                key: 'please_enter_delivery_address',
                tw: '請輸入配送地址',
                cn: '请输入配送地址',
                en: 'Please enter delivery address',
            },
            {
                key: 'please_enter_contact_number',
                tw: '請輸入聯絡電話',
                cn: '请输入联系电话',
                en: 'Please enter contact number',
            },
            { key: 'please_enter_name', tw: '請輸入姓名', cn: '请输入姓名', en: 'Please enter name' },
            { key: 'please_enter_email', tw: '請輸入電子信箱', cn: '请输入电子邮箱', en: 'Please enter email' },
            { key: 'please_enter_phone', tw: '請輸入手機號碼', cn: '请输入手机号码', en: 'Please enter phone number' },
            { key: 'please_enter_birth', tw: '請輸入生日', cn: '请输入生日', en: 'Please enter birthdate' },
            {
                key: 'please_enter_carrier_number',
                tw: '請輸入載具號碼',
                cn: '请输入载具号码',
                en: 'Please enter carrier number',
            },
            {
                key: 'please_enter_company_name',
                tw: '請輸入公司名稱',
                cn: '请输入公司名称',
                en: 'Please enter company name',
            },
            {
                key: 'please_enter_company_tax_id',
                tw: '請輸入公司統一編號',
                cn: '请输入公司统一编码',
                en: 'Please enter company tax ID',
            },
            {
                key: 'please_enter_donation_code',
                tw: '請輸入捐贈碼',
                cn: '请输入捐赠码',
                en: 'Please enter donation code',
            },
            {
                key: 'name_length_restrictions',
                tw: '姓名請設定為4~10字元(中文2~5個字, 英文4~10個字, 不得含指定特殊符號)',
                cn: '姓名请设置为4~10字元(中文2~5个字, 英文4~10个字, 不得含指定特殊符号)',
                en: 'Name should be set to 4-10 characters (2-5 characters for Chinese, 4-10 characters for English, no designated special symbols)',
            },
            {
                key: 'address_length_requirements',
                tw: '地址長度需大於6個字元，且不可超過60個字元',
                cn: '地址长度需大于6个字元，且不可超过60个字元',
                en: 'Address length should be greater than 6 characters and not exceed 60 characters',
            },
            {
                key: 'select_delivery_store',
                tw: '請選擇「配送門市」',
                cn: '请选择「配送门市」',
                en: 'Please select "Delivery Store"',
            },
            { key: 'please_select_gift', tw: '請選擇「贈品」', cn: '请选择「赠品」', en: 'Please select "Gift"' },
            { key: 'customer_name', tw: '顧客姓名', cn: '顾客姓名', en: 'Customer name' },
            { key: 'customer_phone', tw: '顧客電話', cn: '顾客电话', en: 'Customer phone' },
            { key: 'phone', tw: '電話', cn: '电话', en: 'Phone Number' },
            { key: 'customer_email', tw: '顧客信箱', cn: '顾客邮箱', en: 'Customer email' },
            { key: 'recipient_name', tw: '收件人姓名', cn: '收件人姓名', en: 'Recipient name' },
            { key: 'recipient_phone', tw: '收件人電話', cn: '收件人电话', en: 'Recipient phone' },
            { key: 'recipient_email', tw: '收件人信箱', cn: '收件人邮箱', en: 'Recipient email' },
            { key: 'format_error', tw: '格式錯誤', cn: '格式错误', en: 'Format error' },
            {
                key: 'phone_format_starting_with_09',
                tw: '09 開頭的手機格式',
                cn: '以 09 開头的手机格式',
                en: 'Phone format starting with 09',
            },
            { key: 'addon', tw: '加購品', cn: '加购品', en: 'Addon' },
            { key: 'gift', tw: '贈品', cn: '赠品', en: 'Gift' },
            { key: 'hidden_goods', tw: '隱形商品', cn: '隐形商品', en: 'Hidden goods' },
            { key: 'selected', tw: '已選擇', cn: '已选择', en: 'Selected' },
            { key: 'change_gift', tw: '更換贈品', cn: '更换赠品', en: 'Change gift' },
            { key: 'select_gift', tw: '選擇贈品', cn: '选择赠品', en: 'Select gift' },
            { key: 'shopping_credit', tw: '購物金', cn: '购物金', en: 'Shopping credit' },
            {
                key: 'distance_from_target_amount',
                tw: '距離目標金額還差',
                cn: '距离目标金额还差',
                en: 'Amount remaining to target',
            },
            { key: 'member_login', tw: '會員登入', cn: '会员登录', en: 'Login' },
            { key: 'member_register', tw: '會員註冊', cn: '会员注册', en: 'Register' },
            { key: 'login', tw: '登入', cn: '登录', en: 'Login' },
            { key: 'register', tw: '註冊', cn: '注册', en: 'Register' },
            { key: 'input_product_keyword', tw: '輸入商品關鍵字', cn: '输入商品关键字', en: 'Enter Product Keyword' },
            { key: 'find_product', tw: '找商品', cn: '找商品', en: 'Find Product' },
            { key: 'delete_success', tw: '刪除成功', cn: '删除成功', en: 'Delete Successful' },
            { key: 'add_success', tw: '新增成功', cn: '新增成功', en: 'Add Successful' },
            { key: 'loading', tw: '載入中', cn: '加载中', en: 'Loading' },
            { key: 'ai_choose', tw: 'AI 選品', cn: 'AI 选品', en: 'AI Choose' },
            { key: 'search', tw: '搜尋', cn: '搜索', en: 'Search' },
            { key: 'all_products', tw: '所有商品', cn: '所有商品', en: 'All Products' },
            { key: 'product_categories', tw: '商品分類', cn: '商品分类', en: 'Product Categories' },
            { key: 'products', tw: '單一商品', cn: '单一商品', en: 'Products' },
            { key: 'filter', tw: '篩選', cn: '筛选', en: 'Filter' },
            { key: 'sort_by_date', tw: '依照上架時間', cn: '按上架时间排序', en: 'Sort by Date' },
            { key: 'sort_by_price_asc', tw: '價格由低至高', cn: '价格由低到高', en: 'Price Low to High' },
            { key: 'sort_by_price_desc', tw: '價格由高至低', cn: '价格由高到低', en: 'Price High to Low' },
            { key: 'sort_by_sales_desc', tw: '依照銷售量高', cn: '按销售量高', en: 'Sales High to Low' },
            { key: 'no_related_products', tw: '查無相關商品', cn: '暂无相关商品', en: 'No Related Products' },
            { key: 'my', tw: '我的', cn: '我的', en: 'My' },
            { key: 'my_coupons', tw: '我的優惠券', cn: '我的优惠券', en: 'Coupons' },
            { key: 'order_history', tw: '訂單記錄', cn: '订单记录', en: 'Order History' },
            { key: 'wishlist', tw: '心願單', cn: '心愿单', en: 'Wishlist' },
            { key: 'add_to_wishlist', tw: '添加至心願單', cn: '添加至心愿单', en: 'Add to Wishlist' },
            { key: 'remove_to_wishlist', tw: '從心願單移除', cn: '從心願单移除', en: 'Remove from Wishlist' },
            { key: 'reset_password', tw: '重設密碼', cn: '重设密码', en: 'Reset Password' },
            { key: 'logout', tw: '登出', cn: '登出', en: 'Logout' },
            { key: 'reset_password_event', tw: '重設密碼事件', cn: '重设密码事件', en: 'Reset Password Event' },
            { key: 'password', tw: '密碼', cn: '密码', en: 'Password' },
            { key: 'new_password', tw: '新密碼', cn: '新密码', en: 'New Password' },
            { key: 'confirm_password', tw: '確認密碼', cn: '确认密码', en: 'Confirm Password' },
            { key: 'please_enter_password', tw: '請輸入密碼', cn: '请输入密码', en: 'Please enter password' },
            { key: 'please_enter_new_password', tw: '請輸入新密碼', cn: '请输入新密码', en: 'Please enter new password' },
            {
                key: 'please_enter_password_again',
                tw: '請再次輸入密碼',
                cn: '请再次输入密码',
                en: 'Please enter password again',
            },
            {
                key: 'email_phone_placeholder',
                tw: '請輸入信箱或電話',
                cn: '请输入邮箱或电话',
                en: 'Please enter email or phone number',
            },
            { key: 'email_phone', tw: '信箱或電話', cn: '邮箱或电话', en: 'Email or Phone Number' },
            { key: 'email_placeholder', tw: '請輸入信箱', cn: '请输入邮箱', en: 'Please enter email' },
            {
                key: 'please_enter_verification_code',
                tw: '請輸入驗證碼',
                cn: '请输入验证码',
                en: 'Please enter verification code',
            },
            {
                key: 'please_enter_email_verification_code',
                tw: '請輸入信箱驗證碼',
                cn: '请输入邮箱验证码',
                en: 'Please enter email verification code',
            },
            {
                key: 'please_enter_sms_verification_code',
                tw: '請輸入簡訊驗證碼',
                cn: '请输入短信验证码',
                en: 'Please enter sms verification code',
            },
            {
                key: 'enter_website_password',
                tw: '請輸入網站密碼',
                cn: '请输入网站密码',
                en: 'Please enter website password',
            },
            {
                key: 'enter_your_bank_name',
                tw: '請輸入您的銀行名稱',
                cn: '请输入您的银行名称',
                en: 'Please enter your bank name',
            },
            {
                key: 'enter_your_bank_account_name',
                tw: '請輸入您的銀行戶名',
                cn: '请输入您的银行户名',
                en: 'Please enter your bank account name',
            },
            { key: 'enter_five_digits', tw: '請輸入五位數字', cn: '请输入五位数字', en: 'Please enter five digits' },
            { key: 'new_password_placeholder', tw: '請輸入新密碼', cn: '请输入新密码', en: 'Please enter New Password' },
            {
                key: 'enter_phone_number',
                tw: '請輸入手機號碼',
                cn: '请输入手机号码',
                en: 'Please enter your phone number',
            },
            {
                key: 'enter_valid_email',
                tw: '請輸入有效電子信箱',
                cn: '请输入有效电子邮箱',
                en: 'Please enter a valid email address',
            },
            {
                key: 'enter_valid_phone_number',
                tw: '請輸入有效手機號碼',
                cn: '请输入有效手机号码',
                en: 'Please enter a valid phone number',
            },
            { key: 'enter_verification_code', tw: '輸入驗證碼', cn: '输入验证码', en: 'Enter Verification Code' },
            {
                key: 'reset_password_verification_code',
                tw: '重設密碼驗證碼',
                cn: '重设密码验证码',
                en: 'Reset Password Verification Code',
            },
            {
                key: 'verification_code_sent_to',
                tw: '驗證碼已發送至',
                cn: '验证码已发送至',
                en: 'Verification Code Sent to',
            },
            {
                key: 'password_min_length',
                tw: '密碼必須大於8位數',
                cn: '密码必须大于8位数',
                en: 'Password must be greater than 8 characters',
            },
            {
                key: 'please_confirm_password_again',
                tw: '請再次輸入確認密碼',
                cn: '请再次输入确认密码',
                en: 'Please enter confirm password again',
            },
            {
                key: 'email_verification_code_incorrect',
                tw: '信箱驗證碼輸入錯誤',
                cn: '邮箱验证码输入错误',
                en: 'Email verification code entered incorrectly',
            },
            {
                key: 'sms_verification_code_incorrect',
                tw: '簡訊驗證碼輸入錯誤',
                cn: '短信验证码输入错误',
                en: 'SMS verification code entered incorrectly',
            },
            {
                key: 'phone_number_already_exists',
                tw: '此電話號碼已存在',
                cn: '此电话号码已存在',
                en: 'This phone number already exists',
            },
            { key: 'email_already_exists', tw: '此信箱已存在', cn: '此邮箱已存在', en: 'This email already exists' },
            { key: 'update_exception', tw: '更新異常', cn: '更新异常', en: 'Update Exception' },
            { key: 'change_success', tw: '更改成功', cn: '更改成功', en: 'Change Success' },
            { key: 'confirm_reset', tw: '確認重設', cn: '确认重设', en: 'Confirm Reset' },
            { key: 'member_management', tw: '會員管理', cn: '会员管理', en: 'My Profile' },
            { key: 'my_profile', tw: '個人資料', cn: '个人资料', en: 'My Profile' },
            { key: 'account', tw: '我的帳號', cn: '我的帐号', en: 'Account' },
            { key: 'normal_member', tw: '一般會員', cn: '普通会员', en: 'Regular Member' },
            { key: 'membership_expiry_date', tw: '會員到期日至', cn: '会员到期日至', en: 'Membership Expiry Date' },
            { key: 'renewal_criteria_met', tw: '已達成續會條件', cn: '已达成续会条件', en: 'Renewal Criteria Met' },
            { key: 'spend_again', tw: '再消費', cn: '再消费', en: 'Spend Again' },
            { key: 'single_purchase_over', tw: '單筆消費滿', cn: '单笔消费满', en: 'Single Purchase Over' },
            {
                key: 'can_meet_renewal_criteria',
                tw: '即可達成續會條件',
                cn: '即可达成续会条件',
                en: 'Can Meet Renewal Criteria',
            },
            { key: 'single_purchase_reaches', tw: '單筆消費達', cn: '单笔消费达', en: 'Single Purchase Reaches' },
            {
                key: 'accumulated_spending_reaches',
                tw: '累積消費額達',
                cn: '累积消费额达',
                en: 'Accumulated Spending Reaches',
            },
            { key: 'upgrade_to', tw: '即可升級至', cn: '即可升级至', en: 'Upgrade To' },
            { key: 'days', tw: '天', cn: '天', en: 'Days' },
            { key: 'rules_explanation', tw: '規則說明', cn: '规则说明', en: 'Rules Explanation' },
            { key: 'membership_level_rules', tw: '會員等級規則', cn: '会员等级规则', en: 'Membership Level Rules' },
            {
                key: 'if_renewal_criteria_not_met_within_membership_period',
                tw: '會籍期效內若沒達成續會條件，將會自動降級',
                cn: '会籍期效内若没达成续会条件，将会自动降级',
                en: 'If renewal criteria are not met within the membership period, automatic downgrade will occur',
            },
            {
                key: 'view_membership_level_rules',
                tw: '查看會員級數規則',
                cn: '查看会员级数规则',
                en: 'View Membership Level Rules',
            },
            { key: 'membership_barcode', tw: '會員條碼', cn: '会员条码', en: 'Membership Barcode' },
            {
                key: 'present_membership_barcode',
                tw: '出示會員條碼',
                cn: '出示会员条码',
                en: 'Present Membership Barcode',
            },
            {
                key: 'current_accumulated_spending_amount',
                tw: '目前累積消費金額',
                cn: '当前累积消费金额',
                en: 'Current Accumulated Spending Amount',
            },
            { key: 'can_upgrade', tw: '即可升級', cn: '即可升级', en: 'Can Upgrade' },
            { key: 'edit_profile', tw: '編輯個人資料', cn: '编辑个人资料', en: 'Edit Profile' },
            { key: 'email_verification_code', tw: '信箱驗證碼', cn: '邮箱验证码', en: 'Email Verification Code' },
            { key: 'sms_verification_code', tw: '簡訊驗證碼', cn: '短信验证码', en: 'SMS Verification Code' },
            { key: 'not_filled_in_yet', tw: '尚未填寫', cn: '尚未填写', en: 'Not Filled In Yet' },
            { key: 'no_current_obtain', tw: '目前沒有取得', cn: '目前没有取得', en: 'Currently Not Obtained' },
            { key: 'no_current_orders', tw: '目前沒有訂單', cn: '目前没有订单', en: 'No Current Orders' },
            { key: 'order_number', tw: '訂單編號', cn: '订单编号', en: 'Order Number' },
            { key: 'order_date', tw: '訂單日期', cn: '订单日期', en: 'Order Date' },
            { key: 'order_amount', tw: '訂單金額', cn: '订单金额', en: 'Order Amount' },
            { key: 'order_status', tw: '訂單狀態', cn: '订单状态', en: 'Order Status' },
            { key: 'no_number_order', tw: '無編號訂單', cn: '无编号订单', en: 'No Number Order' },
            { key: 'unpaid', tw: '尚未付款', cn: '尚未付款', en: 'Unpaid' },
            { key: 'shipping', tw: '配送中', cn: '配送中', en: 'Shipping' },
            { key: 'delivered', tw: '已送達', cn: '已送达', en: 'Delivered' },
            { key: 'preparing', tw: '準備中', cn: '准备中', en: 'Preparing' },
            { key: 'view', tw: '查看', cn: '查看', en: 'View' },
            { key: 'creation_date', tw: '建立日期', cn: '创建日期', en: 'Creation date' },
            { key: 'source', tw: '來源', cn: '来源', en: 'Source' },
            { key: 'received_amount', tw: '獲得款項', cn: '获得款项', en: 'Amount' },
            { key: 'balance', tw: '餘額', cn: '余额', en: 'Balance' },
            { key: 'no_expiry', tw: '無期限', cn: '无期限', en: 'No Expiry' },
            { key: 'about_to_expire', tw: '即將到期', cn: '即将到期', en: 'About to Expire' },
            { key: 'order', tw: '訂單', cn: '订单', en: 'Order' },
            { key: 'obtain', tw: '獲得', cn: '获取', en: 'Obtain' },
            { key: 'use', tw: '使用', cn: '使用', en: 'Use' },
            { key: 'manual_adjustment', tw: '手動增減', cn: '手动增减', en: 'Manual Adjustment' },
            {
                key: 'no_coupons_available',
                tw: '目前沒有任何優惠券',
                cn: '目前没有任何优惠券',
                en: 'Currently no coupons available',
            },
            { key: 'show_qr_code', tw: '顯示 QR code', cn: '显示 QR code', en: 'Show QR Code' },
            { key: 'coupon_qr_code', tw: '優惠券 QR code', cn: '优惠券 QR code', en: 'Coupon QR Code' },
            { key: 'view_details', tw: '詳細內容', cn: '详细内容', en: 'View Details' },
            { key: 'coupon_details', tw: '優惠券詳細內容', cn: '优惠券详细内容', en: 'Coupon Details' },
            {
                key: 'no_items_added',
                tw: '目前沒有加入任何商品',
                cn: '目前没有添加任何商品',
                en: 'Currently there are no items added',
            },
            { key: 'error', tw: '發生錯誤', cn: '發生錯誤', en: 'Error' },
            {
                key: 'ai_assisted_shopping',
                tw: '透過 AI 可以協助你快速找到喜歡的商品',
                cn: '通过AI可以帮助您快速找到喜欢的商品',
                en: 'AI can assist you in quickly finding products you like.',
            },
            { key: 'product_list', tw: '產品列表', cn: '产品列表', en: 'Product List' },
            { key: 'save', tw: '儲存', cn: '保存', en: 'Save' },
            {
                key: 'incorrect_website_password',
                tw: '網站密碼輸入錯誤',
                cn: '网站密码输入错误',
                en: 'Incorrect website password entered',
            },
            { key: 'no_access_permission', tw: '無訪問權限', cn: '无访问权限', en: 'No access permission' },
            { key: 'payment_time', tw: '付款時間', cn: '付款时间', en: 'Payment Time' },
            { key: 'my_bank_name', tw: '我的銀行名稱', cn: '我的银行名称', en: 'My Bank Name' },
            { key: 'my_bank_account_name', tw: '我的銀行戶名', cn: '我的银行户名', en: 'My Bank Account Name' },
            {
                key: 'last_five_digits_of_bank_account',
                tw: '銀行帳號後五碼',
                cn: '银行账号后五码',
                en: 'Last Five Digits of Bank Account',
            },
            { key: 'bank_name', tw: '銀行名稱', cn: '银行名称', en: 'Bank Name' },
            { key: 'bank_code', tw: '銀行代碼', cn: '银行代码', en: 'Bank Code' },
            { key: 'remittance_account_name', tw: '匯款戶名', cn: '汇款户名', en: 'Remittance Account Name' },
            { key: 'remittance_account_number', tw: '匯款帳號', cn: '汇款帐号', en: 'Remittance Account Number' },
            { key: 'remittance_amount', tw: '匯款金額', cn: '汇款金额', en: 'Remittance Amount' },
            { key: 'payment_instructions', tw: '付款說明', cn: '付款说明', en: 'Payment Instructions' },
            { key: 'payment_time_not_filled', tw: '付款時間未填寫', cn: '付款时间未填写', en: 'Payment time not filled' },
            { key: 'bank_name_not_filled', tw: '銀行名稱未填寫', cn: '银行名称未填写', en: 'Bank name not filled' },
            {
                key: 'bank_account_name_not_filled',
                tw: '銀行戶名未填寫',
                cn: '银行户名未填写',
                en: 'Bank account name not filled',
            },
            {
                key: 'last_five_digits_five_digits',
                tw: '銀行帳號後五碼需為五位數字',
                cn: '银行账号后五码需为五位数字',
                en: 'Last five digits of bank account must be five digits',
            },
            { key: 'file_upload', tw: '檔案上傳', cn: '文件上传', en: 'File Upload' },
            { key: 'payment_info', tw: '付款資訊', cn: '付款信息', en: 'Payment Information' },
            { key: 'payment_proof', tw: '付款證明', cn: '付款凭证', en: 'Payment Proof' },
            {
                key: 'please_confirm_bank_account_details',
                tw: '請確認您的匯款銀行帳戶資料是否正確，以確保付款順利完成',
                cn: '请确认您的汇款银行账户资料是否正确，以确保付款顺利完成',
                en: 'Please confirm that your remittance bank account details are correct to ensure successful payment',
            },
            {
                key: 'upload_screenshot_for_verification',
                tw: '請上傳截圖，以便我們進行核款',
                cn: '请上传截图，以便我们进行核款',
                en: 'Please upload a screenshot for verification',
            },
            {
                key: 'upload_screenshot_or_transfer_proof',
                tw: '請上傳截圖或輸入轉帳證明，例如: 帳號末五碼，與付款人資訊',
                cn: '请上传截图或输入转账证明，例如: 账号末五码，与付款人信息',
                en: 'Please upload a screenshot or enter transfer proof, e.g., last five digits of the account, along with payer information',
            },
            { key: 'data_submitting', tw: '資料送出中', cn: '数据提交中', en: 'Data submitting' },
            { key: 'submit', tw: '送出', cn: '提交', en: 'Submit' },
            { key: 'return_to_order_details', tw: '返回訂單詳情', cn: '返回订单详情', en: 'Return to order details' },
            { key: 'order_details', tw: '訂單明細', cn: '订单明细', en: 'Order Details' },
            { key: 'product_not_found', tw: '找不到此產品', cn: '找不到此产品', en: 'Product not found' },
            { key: 'single_specification', tw: '單一規格', cn: '单一规格', en: 'Single Specification' },
            { key: 'subtotal_amount', tw: '小計總額', cn: '小计总额', en: 'Subtotal amount' },
            { key: 'shopping_credit_offset', tw: '購物金折抵', cn: '购物金折抵', en: 'Shopping credit offset' },
            { key: 'special_discount', tw: '優惠折扣', cn: '优惠折扣', en: 'Discount' },
            {
                key: 'reupload_checkout_proof',
                tw: '重新上傳結帳證明',
                cn: '重新上传结账证明',
                en: 'Reupload checkout proof',
            },
            { key: 'upload_checkout_proof', tw: '上傳結帳證明', cn: '上传结账证明', en: 'Upload checkout proof' },
            { key: 'order_information', tw: '訂單資訊', cn: '订单信息', en: 'Order Information' },
            { key: 'payment_status', tw: '付款狀態', cn: '付款状态', en: 'Payment Status' },
            { key: 'cancel', tw: '取消', cn: '取消', en: 'Cancel' },
            { key: 'cancelled', tw: '已取消', cn: '已取消', en: 'Cancelled' },
            { key: 'completed', tw: '已完成', cn: '已完成', en: 'Completed' },
            { key: 'deleted', tw: '已刪除', cn: '已删除', en: 'Deleted' },
            { key: 'processing', tw: '處理中', cn: '处理中', en: 'Processing' },
            { key: 'cash_on_delivery', tw: '貨到付款', cn: '货到付款', en: 'Cash on Delivery' },
            { key: 'awaiting_verification', tw: '等待核款', cn: '等待核款', en: 'Awaiting Verification' },
            { key: 'paid', tw: '已付款', cn: '已付款', en: 'Paid' },
            { key: 'payment_failed', tw: '付款失敗', cn: '付款失败', en: 'Payment Failed' },
            { key: 'refunded', tw: '已退款', cn: '已退款', en: 'Refunded' },
            { key: 'proceed_to_checkout', tw: '前往結帳', cn: '前往结账', en: 'Checkout' },
            { key: 'cancel_order', tw: '取消訂單', cn: '取消订单', en: 'Cancel order' },
            { key: 'customer_information', tw: '顧客資訊', cn: '顾客信息', en: 'Customer Information' },
            { key: 'shipping_information', tw: '配送資訊', cn: '配送信息', en: 'Shipping Information' },
            { key: 'store_number', tw: '門市店號', cn: '门市店号', en: 'Store Number' },
            { key: 'store_name', tw: '門市名稱', cn: '门市名称', en: 'Store Name' },
            { key: 'store_address', tw: '門市地址', cn: '门市地址', en: 'Store Address' },
            { key: 'receiving_address', tw: '收件地址', cn: '收件地址', en: 'Shipping Address' },
            { key: 'shipping_status', tw: '配送狀態', cn: '配送状态', en: 'Shipping status' },
            { key: 'shipped', tw: '已出貨', cn: '已出货', en: 'Shipped' },
            { key: 'picked_up', tw: '已取貨', cn: '已取货', en: 'Picked Up' },
            { key: 'returned', tw: '已退貨', cn: '已退货', en: 'Returned' },
            { key: 'picking', tw: '揀貨中', cn: '拣货中', en: 'Picking' },
            { key: 'shipping_instructions', tw: '配送說明', cn: '配送说明', en: 'Shipping Instructions' },
            { key: 'shipping_notes', tw: '配送備註', cn: '配送备注', en: 'Shipping Notes' },
            { key: 'return_to_order_list', tw: '返回訂單列表', cn: '返回订单列表', en: 'Return to Order List' },
            { key: 'order_not_found', tw: '查無此訂單', cn: '查无此订单', en: 'Order not found' },
            { key: 'expired', tw: '已過期', cn: '已过期', en: 'Expired' },
            { key: 'not_yet_shipped', tw: '尚未出貨', cn: '尚未出货', en: 'Not yet shipped' },
            { key: 'get_verification_code', tw: '取得驗證碼', cn: '获取验证码', en: 'Get Verification Code' },
            { key: 'verification_code', tw: '驗證碼', cn: '验证码', en: 'Verification Code' },
            { key: 'forgot_password', tw: '忘記密碼', cn: '忘记密码', en: 'Forgot Password' },
            {
                key: 'member_exists_prompt',
                tw: '已經有會員了？前往',
                cn: '已经有会员了？前往',
                en: 'Already have an account? Go to',
            },
            {
                key: 'member_not_exists_prompt',
                tw: '還沒有成為會員？前往',
                cn: '还没有成为会员？前往',
                en: 'Not a member yet? Go to',
            },
            {
                key: 'registration_terms_agreement',
                tw: '註冊完成時，即代表您同意我們的',
                cn: '注册完成时，即代表您同意我们的',
                en: 'By completing the registration, you agree to our',
            },
            { key: 'terms_of_service', tw: '服務條款', cn: '服务条款', en: 'Terms of Service' },
            { key: 'privacy_policy', tw: '隱私條款', cn: '隐私政策', en: 'Privacy Policy' },
            {
                key: 'login_terms_agreement',
                tw: '登入完成時，即代表您同意我們的',
                cn: '登录完成时，即代表您同意我们的',
                en: 'By completing the login, you agree to our',
            },
            { key: 'and', tw: '和', cn: '和', en: 'and' },
            { key: 'or', tw: '或', cn: '或', en: 'or' },
            { key: 'login_success', tw: '登入成功', cn: '登录成功', en: 'Login successful' },
            { key: 'login_failure', tw: '登入失敗', cn: '登录失败', en: 'Login failed' },
            { key: 'page_redirecting', tw: '頁面跳轉中', cn: '页面跳转中', en: 'Page redirecting' },
            { key: 'back_to_login_page', tw: '回到登入頁', cn: '返回登录页面', en: 'Back to login page' },
            {
                key: 'password_mismatch',
                tw: '密碼與確認密碼不符',
                cn: '密码与确认密码不符',
                en: 'Passwords do not match',
            },
            { key: 'registration_success', tw: '註冊成功', cn: '注册成功', en: 'Registration successful' },
            { key: 'registration_failure', tw: '註冊失敗', cn: '注册失败', en: 'Registration failed' },
            {
                key: 'existing_user',
                tw: '此為已註冊的使用者',
                cn: '此为已注册的用户',
                en: 'This user is already registered',
            },
            {
                key: 'incorrect_credentials',
                tw: '帳號或密碼錯誤',
                cn: '帐号或密码错误',
                en: 'Incorrect account or password',
            },
            {
                key: 'verification_code_sent',
                tw: '成功寄送驗證碼',
                cn: '成功发送验证码',
                en: 'Verification code sent successfully',
            },
            { key: 'system_error', tw: '系統錯誤', cn: '系统错误', en: 'System error' },
            { key: 'password_change_success', tw: '更換密碼成功', cn: '更换密码成功', en: 'Password change successful' },
            { key: 'password_change_failure', tw: '更換密碼失敗', cn: '更换密码失败', en: 'Password change failed' },
            {
                key: 'resend_code_timer',
                tw: 'xxx秒後可重新取得驗證碼',
                cn: 'xxx秒后可重新获取验证码',
                en: 'Resend the verification code in xxx seconds',
            },
            { key: 'form_name', tw: '姓名', cn: '名字', en: 'Name' },
            { key: 'form_email', tw: '信箱 / 帳號', cn: '邮箱 / 账号', en: 'Email' },
            { key: 'form_phone', tw: '手機', cn: '手机', en: 'Phone' },
            { key: 'form_birth', tw: '生日', cn: '生日', en: 'Birthdate' },
            { key: 'privacy', tw: '隱私權政策', cn: '隐私权政策', en: 'Privacy policy' },
            { key: 'term', tw: '服務條款', cn: '服务条款', en: 'Terms of Service' },
            { key: 'refund', tw: '退換貨政策', cn: '退換貨政策', en: 'Refund policy' },
            { key: 'delivery', tw: '購買與配送須知', cn: '配送须知', en: 'Shipping instructions' },
            { key: 'pieces', tw: '件', cn: '件', en: 'Pieces' },
        ];
    }

    //用戶自訂義多國語言
    public static getLanguageCustomText(text: string) {
        if (Array.isArray(text)) {
            text = text.join('');
        }
        const pattern = /#{{(.*?)}}/g;
        // 使用正则表达式的 exec 方法来提取匹配项
        let match;
        let convert = text || '';
        while ((match = pattern.exec(text)) !== null) {
            const placeholder = match[0]; // 完整的匹配项，例如 "@{{value}}"
            const value = match[1]; // 提取的值，例如 "value"
            const find_ = (window.parent as any).language_list.find((dd: any) => {
                return dd.tag === value;
            });
            if (find_) {
                convert = convert || '';
                convert = convert.replace(placeholder, find_[Language.getLanguage()]);
            }
        }
        return convert;
    }
}

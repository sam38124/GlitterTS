import { VoucherContent } from '../public-components/user-manager/um-voucher';

export interface Variant {
  save_stock?: string;
  sale_price: number;
  compare_price: number;
  origin_price: number;
  cost: number;
  spec: string[];
  profit: number;
  v_length: number;
  v_width: number;
  v_height: number;
  weight: number;
  shipment_type: 'weight' | 'none' | 'volume';
  sku: string;
  barcode: string;
  stock: number;
  stockList: {};
  preview_image: string;
  show_understocking: string;
  type: string;
  checked?: any;
}

export interface LanguageData {
  title: string;
  seo: {
    domain: string;
    title: string;
    content: string;
    keywords: string;
  };
}

export type ActiveSchedule = {
  start_ISO_Date?: string;
  end_ISO_Date?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
};

export interface Product {
  sync_shopee_stock?: boolean;
  shopee_id: number;
  tax?: string;
  label: any;
  sort_weight:number;
  shipment_type?: string;
  v_length?: string;
  v_width?: string;
  v_height?: string;
  weight?: string;
  id?: string;
  title: string;
  ai_description: string;
  productType: {
    product: boolean;
    addProduct: boolean;
    giveaway: boolean;
  };
  product_category: 'course' | 'commodity' | 'kitchen';
  visible: 'true' | 'false';
  content: string;
  preview_image: string[];
  relative_product: string[];
  email_notice?: string;
  product_tag: {
    language: {
      'en-US': string[];
      'zh-CN': string[];
      'zh-TW': string[];
    };
  };
  product_customize_tag: string[];
  unit: {
    'en-US': string;
    'zh-CN': string;
    'zh-TW': string;
  };
  hideIndex: string;
  collection: string[];
  status: 'active' | 'draft' | 'schedule';
  specs: {
    title: string;
    option: any;
    language_title?: {
      'en-US': string;
      'zh-CN': string;
      'zh-TW': string;
    };
  }[];
  variants: Variant[];
  seo: {
    domain: string;
    title: string;
    content: string;
    keywords: string;
  };
  template: string;
  content_array: string[];
  language_data: {
    'en-US': LanguageData;
    'zh-CN': LanguageData;
    'zh-TW': LanguageData;
  };
  content_json: {
    id: string;
    list: { key: string; value: string }[];
  }[];
  active_schedule: ActiveSchedule;
  channel: ('normal' | 'pos')[];
  min_qty?: number;
  max_qty?: number;
  match_by_with?: string[];
  legacy_by_with?: string[];
  designated_logistics: {
    type: 'all' | 'designated';
    list: string[];
  };
  about_vouchers: VoucherContent[];
  comments: any[];
  multi_sale_price?: MultiSalePrice[];
}

export type MultiSaleType = 'store' | 'level' | 'tags';

export type MultiSalePrice = {
  type: MultiSaleType;
  key: string;
  variants: {
    spec: string[];
    price: number;
  }[];
};

export class ProductInitial {
  public static initial(postMD: any) {
    postMD.product_tag = postMD.product_tag ?? {};
    //商品標籤檢查
    postMD.product_tag = {
      language: {
        'en-US': [],
        'zh-CN': [],
        'zh-TW': [],
        ...postMD.product_tag.language,
      },
    };
    //單位檢查
    postMD.unit = {
      'en-US': '',
      'zh-CN': '',
      'zh-TW': '',
      ...postMD.unit,
    };
  }
}

export declare class ApiShop {
    static getGuideable(): Promise<{
        result: boolean;
        response: any;
    }>;
    static getFEGuideable(): Promise<{
        result: boolean;
        response: any;
    }>;
    static setGuideable(json: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static setFEGuideable(json: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static getGuide(): Promise<{
        result: boolean;
        response: any;
    }>;
    static setGuide(json: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static getEditorGuide(): Promise<{
        result: boolean;
        response: any;
    }>;
    static setEditorGuide(json: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static getFEGuideLeave(): Promise<{
        result: boolean;
        response: any;
    }>;
    static setFEGuideLeave(): Promise<{
        result: boolean;
        response: any;
    }>;
    static postProduct(cf: {
        data: any;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static postMultiProduct(cf: {
        data: any;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static putProduct(cf: {
        data: any;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static putCollections(cf: {
        data: any;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static sortCollections(cf: {
        data: any;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getCollectionProducts(cf: {
        tagString?: string;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getCollectionProductVariants(cf: {
        tagString?: string;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteCollections(cf: {
        data: any;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getRebate(query: {
        userID?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getPaymentMethod(query: {
        userID?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static postWishList(wishList: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteWishList(wishList: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getWishList(): Promise<{
        result: boolean;
        response: any;
    }>;
    static checkWishList(product_id: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getShippingMethod(): Promise<{
        result: boolean;
        response: any;
    }>;
    static getProduct(json: {
        limit: number;
        page: number;
        search?: string;
        searchType?: string;
        domain?: string;
        id?: string;
        collection?: string;
        accurate_search_collection?: boolean;
        accurate_search_text?: boolean;
        maxPrice?: string;
        minPrice?: string;
        status?: string;
        channel?: string;
        whereStore?: string;
        schedule?: boolean;
        orderBy?: string;
        id_list?: string;
        with_hide_index?: string;
        productType?: string;
        filter_visible?: string;
        app_name?: string;
        show_hidden?: boolean;
        view_source?: string;
        distribution_code?: string;
        product_category?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getProductDomain(json: {
        id?: string;
        search?: string;
        domain?: string;
        app_name?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static orderListFilterString(obj: any): string[];
    static returnOrderListFilterString(obj: any): string[];
    static invoiceListFilterString(obj: any): string[];
    static allowanceListFilterString(obj: any): string[];
    static getOrder(json: {
        limit: number;
        page: number;
        search?: string;
        email?: string;
        phone?: number;
        searchType?: string;
        id?: string;
        data_from?: 'user' | 'manager';
        status?: number;
        order?: string;
        orderString?: string;
        filter?: any;
        is_pos?: boolean;
        archived?: string;
        distribution_code?: string;
        returnSearch?: 'true';
        valid?: boolean;
        is_shipment?: boolean;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getSearchReturnOrder(json: {
        limit: number;
        page: number;
        search?: string;
        email?: string;
        searchType?: string;
        id?: string;
        data_from?: 'user' | 'manager';
        status?: number;
        order?: string;
        orderString?: string;
        filter?: any;
        archived?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static searchOrderExist(orderId: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static putVoucher(json: {
        'postData': any;
        token?: string;
        type?: 'normal' | 'manager';
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static postVoucher(json: {
        'postData': any;
        token?: string;
        type: 'normal' | 'manager';
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getVoucher(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
        date_confirm?: boolean;
        user_email?: string;
        data_from?: 'user' | 'manager';
        voucher_type?: 'rebate' | 'discount' | 'shipment_free' | 'add_on_items' | 'giveaway';
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static putOrder(json: {
        id: string;
        order_data: any;
        status?: any;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static cancelOrder(id: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static delete(json: {
        id: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteOrders(json: {
        id: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static ecPayBrushOrders(json: {
        'tradNo': string;
        'orderID': string;
        'total': string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static deleteVoucher(json: {
        id: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static combineOrder(json: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static setCollection(json: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static getCollection(): Promise<{
        result: boolean;
        response: any;
    }>;
    static getInvoice(json: {
        limit: number;
        page: number;
        search?: string;
        searchType?: string;
        orderString?: string;
        filter?: any;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getAllowance(json: {
        limit: number;
        page: number;
        search?: string;
        searchType?: string;
        orderString?: string;
        filter?: any;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getInvoiceType(): Promise<{
        result: boolean;
        response: any;
    }>;
    static getLoginForOrder(): Promise<{
        result: boolean;
        response: any;
    }>;
    static setShowList(json: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static getShowList(): Promise<{
        result: boolean;
        response: any;
    }>;
    static toCheckout(json: {
        line_items: {
            id: number;
            spec: string[];
            count: number;
        }[];
        return_url: string;
        user_info?: {
            name?: string;
            phone?: string;
            address?: string;
            email?: string;
        };
        customer_info?: {
            name?: string;
            phone?: string;
            email?: string;
        };
        code?: string;
        use_rebate?: number;
        custom_form_format?: any;
        custom_receipt_form?: any;
        custom_receipt_data?: any;
        custom_form_data?: any;
        distribution_code?: string;
        give_away?: any;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static postComment(json: {
        product_id: number;
        rate: number;
        title: string;
        comment: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getCheckout(json: {
        line_items: {
            id: number;
            spec: string[];
            count: number;
        }[];
        code?: string;
        checkOutType?: 'manual' | 'auto' | 'POS';
        pos_store?: string;
        use_rebate?: number;
        distribution_code?: string;
        user_info?: any;
        code_array?: string[];
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static getManualCheckout(json: {
        line_items: {
            id: number;
            spec: string[];
            count: number;
        }[];
        user_info: {
            shipment: string;
        };
        code?: string;
        use_rebate?: number;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static toManualCheckout(passData: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static toPOSCheckout(passData: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static toPOSLinePay(passData: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static getOrderPaymentMethod(): Promise<{
        result: boolean;
        response: any;
    }>;
    static proofPurchase(order_id: string, text: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static repay(order_id: string, return_url: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static app_subscription(receipt: string, app_name: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static rebateID: string;
    static voucherID: string;
    static cartID: string;
    static ecDataAnalyze(tagArray: string[], query?: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static getShippingStatusArray(): {
        title: string;
        value: string;
    }[];
    static getOrderStatusArray(): {
        title: string;
        value: string;
    }[];
    static getVariants(json: {
        limit: number;
        page: number;
        search?: string;
        searchType?: string;
        id?: string;
        id_list?: string;
        collection?: string;
        accurate_search_collection?: boolean;
        orderBy?: string;
        status?: string;
        stockCount?: {
            key: string;
            value: string;
        };
        productType?: 'product' | 'addProduct' | 'giveaway' | 'hidden' | 'all';
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static putVariants(cf: {
        data: any;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static recoverVariants(cf: {
        data: any;
        token?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static postReturnOrder(passData: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static putReturnOrder(passData: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static postInvoice(passData: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static voidInvoice(invoiceNo: string, voidReason: string, createDate: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static postAllowance(passData: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static voidAllowance(invoiceNo: string, allowanceNo: string, voidReason: string): Promise<{
        result: boolean;
        response: any;
    }>;
}

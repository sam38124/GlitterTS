export declare class ApiShop {
    static getGuideable(): Promise<{
        result: boolean;
        response: any;
    }>;
    static setGuideable(json: any): Promise<{
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
    static getProduct(json: {
        limit: number;
        page: number;
        search?: string;
        searchType?: string;
        id?: string;
        collection?: string;
        accurate_search_collection?: boolean;
        accurate_search_text?: boolean;
        maxPrice?: string;
        minPrice?: string;
        status?: string;
        orderBy?: string;
        id_list?: string;
        with_hide_index?: string;
        productType?: string;
    }): Promise<{
        result: boolean;
        response: any;
    }>;
    static orderListFilterString(obj: any): string[];
    static returnOrderListFilterString(obj: any): string[];
    static getOrder(json: {
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
        is_pos?: boolean;
        archived?: string;
        returnSearch?: 'true';
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
    static getVoucher(json: {
        limit: number;
        page: number;
        search?: string;
        id?: string;
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
    static deleteVoucher(json: {
        id: string;
    }): Promise<{
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
        custom_form_data?: any;
        distribution_code?: string;
        give_away?: any;
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
    static proofPurchase(order_id: string, text: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static repay(order_id: string, return_url: string): Promise<{
        result: boolean;
        response: any;
    }>;
    static rebateID: string;
    static voucherID: string;
    static cartID: string;
    static ecDataAnalyze(tagArray: string[]): Promise<{
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
    static postReturnOrder(passData: any): Promise<{
        result: boolean;
        response: any;
    }>;
    static putReturnOrder(passData: any): Promise<{
        result: boolean;
        response: any;
    }>;
}

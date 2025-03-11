export declare class FilterOptions {
    static userFilterFrame: {
        created_time: string[];
        birth: never[];
        tags: never[];
        rebate: {
            key: string;
            value: string;
        };
        total_amount: {
            key: string;
            value: string;
        };
        total_count: {
            key: string;
            value: string;
        };
        last_order_time: string[];
        last_order_total: {
            key: string;
            value: string;
        };
    };
    static getUserFunnel(): Promise<({
        key: string;
        type: string;
        name: string;
        data: {
            centerText: string;
            list: {
                key: string;
                type: string;
                placeHolder: string;
            }[];
        };
    } | {
        key: string;
        type: string;
        name: string;
        data: {
            key: number;
            name: string;
        }[];
    } | {
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
        }[];
    } | {
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
            type: string;
            placeHolder: string;
            unit: string;
        }[];
    })[]>;
    static userOrderBy: {
        key: string;
        value: string;
    }[];
    static userSelect: {
        key: string;
        value: string;
    }[];
    static orderFilterFrame: {
        orderStatus: never[];
        payload: never[];
        progress: never[];
        payment_select: never[];
        shipment: never[];
        created_time: string[];
    };
    static returnOrderFilterFrame: {
        progress: never[];
        refund: never[];
        created_time: string[];
    };
    static invoiceFilterFrame: {
        invoice_type: never[];
        issue_method: never[];
        status: never[];
        created_time: string[];
    };
    static allowanceFilterFrame: {
        status: never[];
        created_time: string[];
    };
    static fbLiveFilterFrame: {
        status: never[];
        created_time: string[];
    };
    static orderStatusOptions: {
        key: string;
        name: string;
    }[];
    static payloadStatusOptions: {
        key: string;
        name: string;
    }[];
    static progressOptions: {
        key: string;
        name: string;
    }[];
    static getOrderFunnel(): Promise<({
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
        }[];
    } | {
        key: string;
        type: string;
        name: string;
        data: {
            centerText: string;
            list: {
                key: string;
                type: string;
                placeHolder: string;
            }[];
        };
    })[]>;
    static returnOrderFunnel: ({
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
        }[];
    } | {
        key: string;
        type: string;
        name: string;
        data: {
            centerText: string;
            list: {
                key: string;
                type: string;
                placeHolder: string;
            }[];
        };
    })[];
    static invoiceFunnel: ({
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
        }[];
    } | {
        key: string;
        type: string;
        name: string;
        data: {
            centerText: string;
            list: {
                key: string;
                type: string;
                placeHolder: string;
            }[];
        };
    })[];
    static allowanceFunnel: ({
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
        }[];
    } | {
        key: string;
        type: string;
        name: string;
        data: {
            centerText: string;
            list: {
                key: string;
                type: string;
                placeHolder: string;
            }[];
        };
    })[];
    static orderOrderBy: {
        key: string;
        value: string;
    }[];
    static returnOrderOrderBy: {
        key: string;
        value: string;
    }[];
    static invoiceOrderBy: {
        key: string;
        value: string;
    }[];
    static allowanceOrderBy: {
        key: string;
        value: string;
    }[];
    static orderSelect: {
        key: string;
        value: string;
    }[];
    static returnOrderSelect: {
        key: string;
        value: string;
    }[];
    static invoiceSelect: {
        key: string;
        value: string;
    }[];
    static allowanceSelect: {
        key: string;
        value: string;
    }[];
    static fbLiveSelect: {
        key: string;
        value: string;
    }[];
    static productFilterFrame: {
        status: never[];
        channel: never[];
        collection: never[];
    };
    static productFunnel: {
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
        }[];
    }[];
    static productOrderBy: {
        key: string;
        value: string;
    }[];
    static productListOrderBy: {
        key: string;
        value: string;
    }[];
    static imageLibraryOrderBy: {
        key: string;
        value: string;
    }[];
    static productSelect: {
        key: string;
        value: string;
    }[];
    static stockFilterFrame: {
        status: never[];
        collection: never[];
        count: {
            key: string;
            value: string;
        };
    };
    static stockSelect: {
        key: string;
        value: string;
    }[];
    static stockFunnel: ({
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
        }[];
    } | {
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
            type: string;
            placeHolder: string;
            unit: string;
        }[];
    })[];
    static stockOrderBy: {
        key: string;
        value: string;
    }[];
    static emailFilterFrame: {
        status: never[];
        mailType: never[];
    };
    static emailSelect: {
        key: string;
        value: string;
    }[];
    static snsSelect: {
        key: string;
        value: string;
    }[];
    static emailOptions: {
        key: string;
        value: string;
    }[];
    static emailFunnel: {
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
        }[];
    }[];
    static snsFunnel: {
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
        }[];
    }[];
    static recommendUserFilterFrame: {};
    static recommendUserSelect: {
        key: string;
        value: string;
    }[];
    static recommendUserOrderBy: {
        key: string;
        value: string;
    }[];
    static permissionFilterFrame: {
        status: never[];
    };
    static permissionSelect: {
        key: string;
        value: string;
    }[];
    static permissionFunnel: {
        key: string;
        type: string;
        name: string;
        data: {
            key: string;
            name: string;
        }[];
    }[];
    static permissionOrderBy: {
        key: string;
        value: string;
    }[];
    static storesFilterFrame: {};
    static storesSelect: {
        key: string;
        value: string;
    }[];
    static storesFunnel: never[];
    static storesOrderBy: never[];
    static vendorsFilterFrame: {};
    static vendorsSelect: {
        key: string;
        value: string;
    }[];
    static vendorsFunnel: never[];
    static vendorsOrderBy: never[];
    static stockHistoryFilterFrame: {};
    static stockHistorySelect: {
        key: string;
        value: string;
    }[];
    static stockHistoryFunnel: never[];
    static stockHistoryOrderBy: never[];
    static stockHistoryCheckFilterFrame: {};
    static stockHistoryCheckSelect: {
        key: string;
        value: string;
    }[];
    static stockHistoryCheckFunnel: never[];
    static stockHistoryCheckOrderBy: never[];
    static exhibitionFilterFrame: {};
    static exhibitionSelect: {
        key: string;
        value: string;
    }[];
    static exhibitionFunnel: never[];
    static exhibitionOrderBy: never[];
}

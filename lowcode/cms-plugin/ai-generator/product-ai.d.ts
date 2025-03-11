import { GVC } from "../../glitterBundle/GVController.js";
export declare class ProductAi {
    static schema: {
        name: string;
        strict: boolean;
        schema: {
            type: string;
            properties: {
                name: {
                    type: string;
                    description: string;
                };
                spec_define: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            value: {
                                type: string;
                                description: string;
                            };
                            spec_define: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: {
                                        value: {
                                            type: string;
                                            description: string;
                                        };
                                    };
                                    additionalProperties: boolean;
                                    required: string[];
                                };
                                description: string;
                            };
                        };
                        additionalProperties: boolean;
                        required: string[];
                    };
                    description: string;
                };
                spec: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            value: {
                                type: string;
                                items: {
                                    type: string;
                                    properties: {
                                        value: {
                                            type: string;
                                            description: string;
                                        };
                                    };
                                    additionalProperties: boolean;
                                    required: string[];
                                };
                                description: string;
                            };
                            original_price: {
                                type: string;
                                description: string;
                            };
                            sale_price: {
                                type: string;
                                description: string;
                            };
                        };
                        additionalProperties: boolean;
                        required: string[];
                    };
                    description: string;
                };
                content: {
                    type: string;
                    description: string;
                };
                seo_title: {
                    type: string;
                    description: string;
                };
                seo_content: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
    };
    static setProduct(gvc: GVC, product_data: any, refresh: () => void): string;
    static generateRichText(gvc: GVC, callback: (text: string) => void): void;
}

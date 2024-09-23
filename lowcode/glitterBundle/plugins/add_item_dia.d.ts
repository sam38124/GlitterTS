import { GVC } from "../GVController.js";
declare class Add_item_dia {
    static view(gvc: GVC): string;
    static userMode(gvc: GVC, id: string, searchText: string): string;
    static add_official_plugin(gvc: GVC, search: string): Promise<{
        left: string;
        right: string;
    }>;
    static add_unit_component(gvc: GVC, search: string): Promise<{
        left: string;
        right: string;
    }>;
    static add_code_component(gvc: GVC): Promise<{
        left: string;
        right: string;
    }>;
    static add_ai_micro_phone(gvc: GVC): Promise<{
        left: string;
        right: string;
    }>;
    static past_data(gvc: GVC): Promise<{
        left: string;
        right: string;
    }>;
    static add_content_folder(gvc: GVC, tagType: string, callback?: (data: any) => void): string;
    static add_style(gvc: GVC, callback?: (data: any) => void): string;
    static add_script(gvc: GVC, callback?: (data: any) => void): string;
}
export default Add_item_dia;

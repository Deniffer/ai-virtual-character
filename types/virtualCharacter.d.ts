import { User } from "./user";

export interface VirtualCharacter {
    id?: number;
    user_email: string;
    img_description: string;
    img_size: string;
    img_url: string;
    llm_name: string;
    llm_params?: any;
    created_user?: User;
    created_at: string;
}

//登录
export interface UserLoginParams {
    login_name: string;
    password: string;
}
export interface UserLoginType {
    token: string;
    login_name: string;
}

export interface UserMenuListItem {
    menu_id: number;
    menu_name: string;
    parent_id: number;
    order_num: number;
    path: string;
    normal: string;
    menu_type: string;
    menu_location: string;
    icon: string;
    created_at: number;
    updated_at: number;
    created_name: string;
    updated_name: string;
    opcode: number;
    depart_ids: string[];
    children: UserMenuListItem[];
}

//重置密码
export interface UserUpdatePassWordParams {
    password?: string;
    type: number; //1密码 2操作码 3谷歌验证码
}

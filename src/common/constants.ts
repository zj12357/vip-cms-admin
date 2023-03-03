const {
    REACT_APP_NAME,
    REACT_APP_API_URL,
    REACT_APP_APP_ENV,
    REACT_APP_VERSION,
} = process.env;

export const LANGUAGE_MENU = {
    zh: '🇨🇳 简体中文',
    tw: '🇭🇰 繁體中文',
    en: '🇺🇸 English',
};

export const ADMIN_NAME = REACT_APP_NAME;
export const ADMIN_HTTP = REACT_APP_API_URL;
export const ADMIN_ENV = REACT_APP_APP_ENV;
export const VERSION = REACT_APP_VERSION;

//AES加密key
export const ACCOUNT_AES_KEY = 'V!7e@gaS^Y#KSRvc'; //户口授权人密码
export const API_AES_KEY = 'ABCDABCDABCDABCD';

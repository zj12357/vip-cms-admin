const {
    REACT_APP_NAME,
    REACT_APP_API_URL,
    REACT_APP_APP_ENV,
    REACT_APP_VERSION,
} = process.env;

export const LANGUAGE_MENU = {
    zh: 'ð¨ð³ ç®ä½ä¸­æ',
    tw: 'ð­ð° ç¹é«ä¸­æ',
    en: 'ðºð¸ English',
};

export const ADMIN_NAME = REACT_APP_NAME;
export const ADMIN_HTTP = REACT_APP_API_URL;
export const ADMIN_ENV = REACT_APP_APP_ENV;
export const VERSION = REACT_APP_VERSION;

//AESå å¯key
export const ACCOUNT_AES_KEY = 'V!7e@gaS^Y#KSRvc'; //æ·å£ææäººå¯ç 
export const API_AES_KEY = 'ABCDABCDABCDABCD';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';
import { getLocalStorage } from '@/utils/localStorage';
import cn from './zh-CN';
import en from './en-GB';

const resources = {
    cn: {
        translation: {
            ...cn.menu,
        },
    },
    en: {
        translation: {
            ...en.menu,
        },
    },
};

const detectorOptions = {
    // order and from where user language should be detected
    order: [
        'querystring',
        'cookie',
        'localStorage',
        'sessionStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain',
    ],

    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    // cache user language on
    caches: ['localStorage', 'sessionStorage'],
    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
};

i18n.use(detector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        detection: detectorOptions,
        resources,
        lng: getLocalStorage('i18nextLng') ?? 'cn',
        fallbackLng: getLocalStorage('i18nextLng') ?? 'cn', // use en if detected lng is not available
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;

export const getLanguage = () => {
    return getLocalStorage('i18nextLng') ?? 'cn';
};

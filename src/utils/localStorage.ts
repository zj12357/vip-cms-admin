import store from 'store2';
const asyncSetLocalStorage = async (key: string, value: any) => {
    return store.set(key, value);
};

const asyncGetLocalStorage = async (key: string) => {
    return store.get(key);
};

const asyncRemoveLocalStorage = async (key: string) => {
    return store.remove(key);
};
const asyncRemoveAllLocalStorage = async () => {
    return store.clear();
};

const setLocalStorage = (key: string, value: any) => {
    store.set(key, value);
};

const getLocalStorage = (key: string) => {
    return store.get(key);
};

const removeLocalStorage = (key: string) => {
    store.remove(key);
};

const removeAllLocalStorage = () => {
    store.clear();
};

export {
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
    removeAllLocalStorage,
    asyncSetLocalStorage,
    asyncGetLocalStorage,
    asyncRemoveLocalStorage,
    asyncRemoveAllLocalStorage,
};

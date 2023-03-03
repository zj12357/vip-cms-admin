const { REACT_APP_API_URL, REACT_APP_WS_URL } = process.env;
const commonConfig = {
    changeOrigin: true,
    logLevel: 'debug',
    headers: {
        Cookie: '',
    },
    pathRewrite: {
        '^': '',
    },
};
module.exports = {
    proxy: {
        '/api': {
            target: REACT_APP_API_URL,
            ...commonConfig,
        },
        '/ws': {
            target: REACT_APP_WS_URL,
            ws: true,
        },
    },
};

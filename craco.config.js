const path = require('path');
const resolve = (dir) => path.resolve(__dirname, dir);
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const WebpackBar = require('webpackbar');
const CracoAntDesignPlugin = require('craco-antd');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const Jarvis = require('webpack-jarvis');
const getRepoInfo = require('git-repo-info');
const { proxy } = require('./proxy');

const { NODE_ENV } = process.env;
const smp = new SpeedMeasurePlugin();

const repoInfo = getRepoInfo();

module.exports = {
    reactScriptsVersion: 'react-scripts' /* (default value) */,
    style: {
        modules: {
            localIdentName: '',
        },
        sass: {
            loaderOptions: {
                additionalData: `@import '@/assets/scss/index.scss';`, //设置公共scss
            },
        },
        postcss: {
            mode: 'extends' /* (default value) */ || 'file',
            plugins: [autoprefixer],

            loaderOptions: {},
        },
    },
    eslint: {
        enable: true /* (default value) */,
        mode: 'extends' /* (default value) */ || 'file',
        configure: {
            /* Any eslint configuration options: https://eslint.org/docs/user-guide/configuring */
        },
        configure: (eslintConfig, { env, paths }) => {
            return eslintConfig;
        },
        pluginOptions: {
            /* Any eslint plugin configuration options: https://github.com/webpack-contrib/eslint-webpack-plugin#options. */
        },
        pluginOptions: (eslintOptions, { env, paths }) => {
            return eslintOptions;
        },
    },
    typescript: {
        enableTypeChecking: true /* (default value)  */,
    },
    babel: {
        presets: [['@babel/preset-env'], ['@babel/preset-react']],
        plugins: [
            // AntDesign 按需加载
            [
                'import',
                {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true,
                },
                'antd',
            ],
            [
                '@babel/plugin-proposal-decorators',
                {
                    legacy: true,
                },
            ], // 用来支持装饰器
            [
                '@babel/plugin-transform-runtime',
                {
                    useESModules: true,
                    regenerator: true,
                },
            ],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-proposal-private-methods', { loose: true }],
            [
                '@babel/plugin-proposal-private-property-in-object',
                { loose: true },
            ],
        ],
        loaderOptions: {
            /* Any babel-loader configuration options: https://github.com/babel/babel-loader. */

            //babel-loader开启缓存
            cacheDirectory: true,
        },
    },
    devServer: {
        publicPath: '/',
        port: 8000,
        hot: true,
        overlay: true,
        proxy: proxy,
    },
    //配置别名
    webpack: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
        alias: {
            '@': resolve('src'),
        },
        configure: (webpackConfig, { env, paths }) => {
            // 修改build的生成文件名称
            paths.appBuild = 'dist';
            webpackConfig.output = {
                ...webpackConfig.output,
                path: resolve('dist'),
                publicPath: '/',
                pathinfo: false,
            };

            if (NODE_ENV === 'production') {
                webpackConfig.mode = 'development';
                webpackConfig.devtool = 'eval-cheap-module-source-map';
                webpackConfig.plugins = webpackConfig.plugins.concat(
                    //打包体积分析
                    // new BundleAnalyzerPlugin(),

                    //开启Gzip
                    new CompressionPlugin({
                        algorithm: 'gzip',
                        threshold: 10240,
                        minRatio: 0.8,
                    }),

                    //纯 CSS 在全局范围内使用，并且导入的顺序很重要，因为最后导入的 CSS 类会覆盖它之前的任何内容，由于CSS模块的范围仅限于组件，因此导入的顺序无关紧要,删除警告。
                    new FilterWarningsPlugin({
                        exclude:
                            /mini-css-extract-plugin[^]*Conflicting order. Following module has been added:/,
                    }),
                );

                webpackConfig.optimization = {
                    ...webpackConfig.optimization,
                    minimize: true,
                    minimizer: [
                        // 压缩JS代码
                        new TerserPlugin({
                            terserOptions: {
                                output: {
                                    comments: false, //删除注释
                                },
                                compress: {
                                    //去除console
                                    drop_console: true,
                                    drop_debugger: true,
                                },
                            },
                            extractComments: false,
                            minify: TerserPlugin.swcMinify,
                            parallel: true, //开启并行压缩
                            cache: true,
                        }),
                        // 去重压缩css
                        new CssMinimizerPlugin(),
                    ],
                    runtimeChunk: true,
                };
            } else {
                //构建 webpack 所需的所有相关信息  打开：localhost:1337
                webpackConfig.plugins = webpackConfig.plugins.concat(
                    new Jarvis({
                        port: 1337,
                    }),
                    //可以识别webpack中的某些类别的错误
                    new FriendlyErrorsWebpackPlugin(),
                );
            }

            // 打包时间，大小分析
            // return smp.wrap(webpackConfig);

            return webpackConfig;
        },
        //开发和生产通用插件
        plugins: [
            new WebpackBar({
                profile: true,
                name: 'webpack',
                color: 'green',
            }),

            //获取git信息
            new webpack.DefinePlugin({
                'process.env.REACT_APP_TAG': JSON.stringify(repoInfo.tag),
                'process.env.REACT_APP_COMMITHASH': JSON.stringify(
                    repoInfo.sha,
                ),
                'process.env.REACT_APP_BRANCH': JSON.stringify(repoInfo.branch),
            }),
        ],
    },
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeTheme: {
                    '@primary-color': '#b3893d',
                    '@btn-primary-bg': '#181818',
                    '@success-color': '#52c41a',
                    '@warning-color': '#faad14',
                    '@error-color': '#f5222d',
                    '@text-color': 'rgba(0, 0, 0, 0.65)',
                    '@disabled-color': 'rgba(0, 0, 0, 0.5)',
                    '@disabled-bg': '#d5d5d5',
                    '@border-color-base': '#d9d9d9',
                },
            },
        },

        {
            plugin: require('craco-plugin-scoped-css'),
        },
    ],
};

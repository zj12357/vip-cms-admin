/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/

var $protobuf = require('protobufjs/light');

var $root = (
    $protobuf.roots['default'] ||
    ($protobuf.roots['default'] = new $protobuf.Root())
).addJSON({
    resultmodel: {
        options: {
            go_package: './;resultmodel',
        },
        nested: {
            Method: {
                methods: {
                    Post: {
                        requestType: 'Para',
                        responseType: 'Res',
                    },
                },
            },
            Para: {
                fields: {
                    action: {
                        type: 'string',
                        id: 1,
                    },
                    token: {
                        type: 'string',
                        id: 2,
                    },
                    data: {
                        type: 'string',
                        id: 3,
                    },
                },
            },
            Res: {
                fields: {
                    code: {
                        type: 'int32',
                        id: 1,
                    },
                    msg: {
                        type: 'string',
                        id: 2,
                    },
                    count: {
                        type: 'int64',
                        id: 3,
                    },
                    data: {
                        type: 'string',
                        id: 4,
                    },
                },
            },
        },
    },
});

module.exports = $root;

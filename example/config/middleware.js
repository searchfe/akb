/**
 * @file middlewares
 * @author sekiyika (pengxing@baidu.com)
 */

module.exports = {

    'dir': './app/middlewares',

    'all': [
        'init', // 初始化工作
        [
            'a',
            'b'
        ],
        'useSession',
        'render'
    ],

    'dynamic': [],

    'static': []

};

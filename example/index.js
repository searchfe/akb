/**
 * @file index
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';
const app = require('../index')({appdir: './example', configdir: 'config'});

app.on('close', function (e) {
    console.log('server closed');
});

app.run();

/**
 * @file component.js
 * @author sekiyika(pengxing@baidu.com)
 */

'use strict';

const path = require('path');
const util = require('../util');

module.exports = async function (app) {

    let {dir: componentDir, components} = app.config.component;

    // 处理为绝对地址
    componentDir = util.resolve(app.config.appdir, componentDir);

    /**
     * component store
     *
     * @type {Map}
     */
    let store = new Map();

    // 加载所有组件
    for (let name of components) {
        let filepath;
        if (typeof name === 'string') {
            filepath = path.join(componentDir, name);
        }
        else if (typeof name === 'object') {
            filepath = path.join(componentDir, name.filepath);
            name = name.name;
        }

        let component = require(filepath)(app);
        // 如果是 Promise，则等待
        if (component instanceof Promise) {
            component = await component;
        }
        // cache component
        store.set(name, component);

        app[name] = component;
    }

    /*
    // 加载所有组件
    components.forEach(name => {
        let filepath;
        if (typeof name === 'string') {
            filepath = path.join(componentDir, name);
        }
        else if (typeof name === 'object') {
            filepath = path.join(componentDir, name.filepath);
            name = name.name;
        }

        let component = require(filepath)(app);
        // cache component
        store.set(name, component);

        app[name] = component;
    });
    */

    return {

        /**
         * 销毁所有组件
         */
        dispose() {
            for (let component of store.values()) {
                if (component && component.dispose && typeof component.dispose === 'function') {
                    component.dispose();
                }
            }

            store.clear();
        }

    };

};

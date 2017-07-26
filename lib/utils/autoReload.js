/**
 * @file autoReload
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

const chokidar = require('chokidar');
const fs = require('fs');
const crypto = require('crypto');
const sysModule = require('module');

const NODE_MODULES = 'node_modules';

let fileSha1sumList = new Map();
let load = sysModule._load;

sysModule._load = (request, parent, isMain) => {
    let exportsObj = load(request, parent, isMain);
    if (!parent) {
        return exportsObj;
    }
    if (isMain || parent.filename.indexOf(NODE_MODULES) > -1) {
        return exportsObj;
    }

    if (request === 'internal/repl' || request === 'repl') {
        return exportsObj;
    }

    // 重写load，解决二次require不会被添加到parent的children的问题
    try {
        let filename = sysModule._resolveFilename(request, parent);
        let cachedModule = sysModule._cache[filename];
        if (cachedModule && parent.children.indexOf(cachedModule) === -1) {
            parent.children.push(cachedModule);
        }
    }
    catch (e) {}

    return exportsObj;
};

module.exports = async function (app) {
    // 只监控已经加载到内存且非node_modules文件夹下的js文件
    let cachedFiles = Object.keys(require.cache).filter(valid);

    await Promise.all(cachedFiles.map(addFileSha1sumList));

    // 监控cache里的文件
    let watcher = chokidar.watch(cachedFiles);

    let load = sysModule._load;
    // 这里重写load是在因为之后加载的模块需要让watcher监控
    sysModule._load = (request, parent, isMain) => {
        let exportsObj = load(request, parent, isMain);
        let filename = sysModule._resolveFilename(request, parent);
        addFileSha1sumList(filename).then(sum => sum && watcher.add(filename));
        return exportsObj;
    };

    watcher
        .on('change', change)
        .on('unlink', unlink)
        .on('error', err => {
            app.logger.error(err);
        });

    async function change(file) {
        let sum = await sha1sum(file);
        if (fileSha1sumList.get(file) === sum) {
            return;
        }

        fileSha1sumList.set(file, sum);
        cleanCache(file);
        await app.reload();
    }

    async function unlink(file) {
        fileSha1sumList.delete(file);
        cleanCache(file);
        await app.reload();
    }

     /**
     * clean module
     *
     * @param  {string} file module file path
     */
    function cleanCache(file) {
        let mod = require.cache[file];
        if (!mod) {
            return;
        }

        if (mod.children) {
            mod.children.length = 0;
        }

        for (let cacheFile of Object.keys(require.cache)) {
            if (file === cacheFile) {
                continue;
            }

            let cacheMod = require.cache[cacheFile];
            if (cacheMod && cacheMod.children && cacheMod.children.indexOf(mod) > -1) {
                cleanCache(cacheFile);
            }
        }

        app.logger.info('Reload file: ' + file);
        require.cache[file] = null;
    }
};

function valid(file) {
    return /\.js$/.test(file) && file.indexOf(NODE_MODULES) === -1;
}

function sha1sum(filename) {
    return new Promise(resolve => {
        let hash = crypto.createHash('sha1').setEncoding('hex');
        fs.createReadStream(filename).on('end', () => {
            hash.end();
            resolve(hash.read());
        }).pipe(hash);
    });
}

async function addFileSha1sumList(filename) {
    if (fileSha1sumList.get(filename) || !valid(filename)) {
        return;
    }

    fileSha1sumList.set(filename, null);
    let sum = await sha1sum(filename);
    fileSha1sumList.set(filename, sum);
    return sum;
}


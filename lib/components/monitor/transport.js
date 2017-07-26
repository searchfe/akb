/**
 * @file monitor transport (http)
 * @author wangyisheng@baidu.com (wangyisheng)
 **/

const domain = require('domain');
const {existsSync, readFileSync} = require('fs');
const gzip = require('zlib').gzip;
const Transport = require('winston').Transport;

/**
 * MonitorTransport
 *
 * @class 监控transport
 * @extends {Transport}
 */
class MonitorTransport extends Transport {

    /**
     * 构造函数
     *
     * @constructor
     * @public
     * @param  {Object} opts 初始化参数
     */
    constructor(opts) {
        super();

        this.name = 'monitor';
        this.level = 'info';
        Object.assign(this, opts.config);
        this.app = opts.app;
        this.msgArr = [];
        this.sendTimer;
        this.sendUrl = `${this.host}:${this.port}${this.path}`;
        if (!this.sendUrl.startsWith('http://')) {
            this.sendUrl = 'http://' + this.sendUrl;
        }

        let hostNameFile = '/proc/sys/kernel/hostname';
        if (existsSync(hostNameFile)) {
            let hostName = readFileSync(hostNameFile, 'utf-8');
            if (hostName.endsWith('\n')) {
                hostName = hostName.substring(0, hostName.length - 1);
            }
            this.hostName = hostName;
        }
        else {
            this.hostName = process.env.HOSTNAME || process.env.USERNAME || process.env.USER || 'unknown';
        }

        this.app.on('close', () => {
            if (this.sendTimer) {
                clearInterval(this.sendTimer);
            }
        });
    }

    /**
     * 记录日志方法
     *
     * @public
     * @param  {string}   level    日志等级
     * @param  {string}   msg      日志内容
     * @param  {Object}   meta     meta
     * @param  {Function} callback 回调
     */
    log(level, msg, meta, callback) {
        this.msgArr.push(`[${this.hostName}] [${getDisplayTime()}] [${level}] ${msg}`);
        if (!this.sendTimer) {
            this.sendTimer = setInterval(() => {
                let d = domain.create();

                d.on('error', err => console.error(err));
                d.run(() => this.send());
            }, this.sendInterval);
        }

        callback && callback(null, true);
    }

    /**
     * 发送日志(http)
     *
     * @public
     */
    send() {
        if (this.msgArr.length === 0) {
            return;
        }

        let gzipFlag = this.msgArr.length > 50;
        let msg = this.msgArr.join('\n');
        let data = {
            msg,
            idc: this.idc
        };
        this.msgArr = [];

        if (gzipFlag) {
            gzip(msg, (err, body) => {
                if (err) {
                    return;
                }

                body = Buffer.from(body, 'binary').toString('base64');
                data.gzip = 1;
                data.msg = body;

                sendInner(this.app.ral, data);
            });
        }
        else {
            sendInner(this.app.ral, data);
        }

        function sendInner(ral, data) {
            ral('AKB_MONITOR', {data}).catch(() => {});
        }
    }

    close() {
        if (this.sendTimer) {
            clearInterval(this.sendTimer);
        }
    }

}

function getDisplayTime() {
    let date = new Date();
    return `${date.getMonth() + 1}-${date.getDate()} `
        + `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

module.exports = MonitorTransport;

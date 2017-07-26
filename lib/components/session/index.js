/**
 * @file index.js
 * @author clarkt(tanglei02@baidu.com) es6 overwrite
 */


const crypto = require('crypto');
const MemoryStore = require('./memoryStore');

class Session {

    /**
     * Session constructor
     *
     * @param {Akb} app instance
     * @constructor
     */
    constructor(app) {
        if (!app.config.session.enable) {
            return;
        }

        const config = app.config.session;
        let sessConfig = Object.assign({}, config.session);

        if (!app.keys || !app.keys.length) {
            if (app.config.globals.env === 'production') {
                throw new Error('Session keys must be identified!');
            }
            else {
                app.keys = config.keys = generateSecret();
            }
        }

        sessConfig.store = config.store || new MemoryStore();
        this.config = sessConfig;
    }

    /**
     * get session by sid
     *
     * @param {string|number} sid sid
     * @return {*} session
     */
    get(sid) {
        return this.config.store.get(sid);
    }

    /**
     * set session
     *
     * @param {string|number} sid sid
     * @param {*} session session
     * @return {Promise} promise
     */
    set(sid, session) {
        return this.config.store.set(sid, session);
    }

    /**
     * destroy session
     *
     * @param {string|number} sid sid
     * @return {Promise} promise
     */
    destroy(sid) {
        return this.config.store.destroy(sid);
    }
}

module.exports = function session(app) {
    return new Session(app);
};


/**
 * generate secret keys
 *
 * @return {Array.<string>} keys
 */
function generateSecret() {
    // Combine random and case-specific factors into a base string
    let basestring = [
        // creationDate:
        Date.now(),
        // random:
        Math.random() * (Math.random() * 1000),
        // nodeVersion:
        process.version
    ].join('');

    // Build hash
    return [crypto.createHash('md5').update(basestring).digest('hex')];
}

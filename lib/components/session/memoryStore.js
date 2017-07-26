/**
 * @file memoryStore.js
 * @author clarkt(tanglei@baidu.com)
 */

'use strict';

class MemoryStore {
    constructor() {
        this.sessions = new Map();
    }

    async get(sid) {
        return this.sessions.get(sid);
    }

    async set(sid, val) {
        this.sessions.set(sid, val);
    }

    async destroy(sid) {
        this.sessions.delete(sid);
    }
}

module.exports = MemoryStore;

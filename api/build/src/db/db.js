"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const knex_1 = require("knex");
const knexStringcase = require('knex-stringcase');
const config_1 = require("../config");
const knexConfig = {
    client: 'pg',
    connection: {
        database: config_1.config.pg.database,
        host: config_1.config.pg.host,
        password: config_1.config.pg.password,
        port: config_1.config.pg.port,
        user: config_1.config.pg.username,
    },
};
const options = knexStringcase(knexConfig);
const db = (0, knex_1.default)(options);
exports.db = db;
//# sourceMappingURL=db.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
(0, app_1.createApp)().then(({ app, logger }) => {
    app.listen(config_1.config.port, () => {
        logger.info(`${config_1.config.service.name} server listening on port ${config_1.config.port}`);
    });
});
//# sourceMappingURL=index.js.map
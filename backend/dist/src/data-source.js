"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "better-sqlite3",
    database: "db.sqlite",
    logging: true,
    synchronize: true, // ONLY FOR DEV, will scrap db each restart
    entities: ["src/entity/*.ts"],
    subscribers: [],
    migrations: [],
});

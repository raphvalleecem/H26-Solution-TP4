import {DataSource} from "typeorm";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "db.sqlite",
    logging: true,
    synchronize: true, // ONLY FOR DEV, will scrap db each restart
    entities: ["src/entity/*.ts"],
    subscribers: [],
    migrations: [],
})

export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    logging: true,
    //synchronize: true, // ONLY FOR DEV, will scrap db each restart
    entities: ["src/entity/*.ts"],
    subscribers: [],
    migrations: [],
})
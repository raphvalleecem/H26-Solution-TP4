import {DataSource} from "typeorm";
import {
    Boat,
    BoatClass,
    HandicapType,
    Race,
    RaceClass,
    RaceClassType,
    RaceEntry,
    RaceOutcome,
    Series,
} from "./entity/entities";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "db.sqlite",
    logging: true,
    synchronize: true,
    entities: [
        HandicapType,
        BoatClass,
        Boat,
        RaceClassType,
        RaceClass,
        Series,
        Race,
        RaceEntry,
        RaceOutcome,
    ],
    subscribers: [],
    migrations: [],
})

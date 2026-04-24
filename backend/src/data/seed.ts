import {DataSource} from "typeorm";
import {HandicapType, RaceClassType} from "../entity/entities";

export const seedHandicapType = async (dataSource: DataSource) => {
    const repository = dataSource.getRepository(HandicapType);

    const handicapTypeData: HandicapType[] = [
        {id: 1, name: 'PY'},
        {id: 2, name: 'TMF'},
    ];

    const existing = await repository.find();
    const existingById = new Set(existing.map((item) => item.id));
    const existingByName = new Set(existing.map((item) => item.name));

    const missing = handicapTypeData.filter((item) => !existingById.has(item.id) && !existingByName.has(item.name));

    if (missing.length > 0) {
        await repository.save(missing);
    }

    console.log("Seed: HandicapTypes checked!");
};

export const seedRaceClassType = async (dataSource: DataSource) => {
    const repository = dataSource.getRepository(RaceClassType);

    const raceClassTypeData: RaceClassType[] = [
        {id: 1, name: 'monotype'},
        {id: 2, name: 'handicap'},
    ];

    const existing = await repository.find();
    const existingById = new Set(existing.map((item) => item.id));
    const existingByName = new Set(existing.map((item) => item.name));

    const missing = raceClassTypeData.filter((item) => !existingById.has(item.id) && !existingByName.has(item.name));

    if (missing.length > 0) {
        await repository.save(missing);
    }

    console.log("Seed: RaceClassTypes checked!");
};
import "reflect-metadata"
import {Boat, BoatClass, HandicapType, Race, RaceClass, Series} from "../entity/entities";
import {AppDataSource} from "../data-source";

export class FetchProvider {

    //#region Boats
    public async getBoats(): Promise<Boat[]> {
        const boats = await AppDataSource.manager.find(Boat);
        return boats || [];
    }


    public async addBoat(boat: Boat): Promise<void> {
        await AppDataSource.manager.insert(Boat, boat);
        await AppDataSource.manager.save(boat);
    }

    public async getHandicapTypeById(id: number): Promise<HandicapType | null> {
        return await AppDataSource.manager.findOneBy(HandicapType, {id});
    }

    public async addBoatClass(boatClass: BoatClass): Promise<BoatClass> {
        return await AppDataSource.manager.save(BoatClass, boatClass);
    }

    public async ensureDefaultHandicapTypes(): Promise<void> {
        const requiredNames = ["PY", "TMF"];
        const handicapTypes = await AppDataSource.manager.find(HandicapType);
        const existingNames = new Set(handicapTypes.map((ht: HandicapType) => ht.name));

        const missing = requiredNames
            .filter((name) => !existingNames.has(name))
            .map((name) => {
                const handicapType = new HandicapType();
                handicapType.name = name;
                return handicapType;
            });

        if (missing.length > 0) {
            await AppDataSource.manager.save(HandicapType, missing);
        }
    }

    public async getBoatClasses(): Promise<BoatClass[]> {
        const boatClasses = await AppDataSource.manager.find(BoatClass, {
            relations: ["handicapType"],
        });
        return boatClasses || [];
    }

    //#endregion

    //#region Races
    public async getRaces(): Promise<Race[]> {
        const races = await AppDataSource.manager.find(Race, {
            relations: ["raceClass", "series"],
        });
        return races || [];
    }

    public async getRaceClassById(id: number): Promise<RaceClass | null> {
        return await AppDataSource.manager.findOneBy(RaceClass, {id});
    }

    public async getSeriesById(id: number): Promise<Series | null> {
        return await AppDataSource.manager.findOne(Series, {
            where: {id},
            relations: ["raceClass"],
        });
    }

    public async addRace(race: Race): Promise<Race> {
        return await AppDataSource.manager.save(Race, race);
    }

    //#endregion
}

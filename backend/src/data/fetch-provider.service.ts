import "reflect-metadata"
import {Boat, BoatClass, HandicapType} from "../entity/entities";
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
        const existingNames = new Set(handicapTypes.map((ht) => ht.name));

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

    //#endregion

    //#region Races



    //#endregion
}

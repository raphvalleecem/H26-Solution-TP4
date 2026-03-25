import "reflect-metadata"
import {Boat} from "../entity/entities";
import {AppDataSource} from "../data-source";

export class FetchProvider {

    //#region Stored methods
    public async getBoats(): Promise<Boat[]> {
        const boats = await AppDataSource.manager.find(Boat);
        return boats || [];
    }

    public async addBoat(boat: Boat): Promise<void> {
        await AppDataSource.manager.insert(Boat, boat);
        await AppDataSource.manager.save(boat);
    }

    //#endregion
}

import "reflect-metadata"
import {Boat} from "../entity/entities";
import {AppDataSource} from "../data-source";

export class FetchProvider {

    //#region Stored methods
    public async getBoats(): Promise<Boat[]> {
        const boats = await AppDataSource.manager.find(Boat);
        return boats || [];
    }
    //#endregion
}

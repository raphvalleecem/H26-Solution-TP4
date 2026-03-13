import "reflect-metadata"
import {Boat} from "../entity/entities";
import {AppDataSource} from "../data-source";

export class FetchProvider {

    //#region Stored methods
    public async getBoats(): Promise<Boat[]> {
        const boats = await AppDataSource.manager.find(Boat);
        return boats || [];
    }

    public async addBoat(): Promise<void> {
        let boat: Boat = new Boat();
        boat.url = "https://boats.json";
        boat.name = "Boat";
        boat.imageUrl = "https://boats.com/image.png"
        let boats: Boat[] = [boat];
        await AppDataSource.manager.insert(Boat, boats);
        await AppDataSource.manager.save(boats);
    }

    //#endregion
}

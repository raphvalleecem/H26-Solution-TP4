import "reflect-metadata"
import {
    Boat,
    BoatClass,
    HandicapType,
    Race,
    RaceClass,
    RaceClassType,
    RaceEntry,
    RaceOutcome,
    Series
} from "../entity/entities";
import {AppDataSource} from "../data-source";
import {calculateElapsedTime, calculateCorrectedTime} from "./calculation.service";

export class FetchProvider {

    //#region Boat
    public async getBoats(): Promise<Boat[]> {
        const boats = await AppDataSource.manager.find(Boat, {
            relations: ["boatClass", "boatClass.handicapType"],
        });
        return boats || [];
    }

    public async addBoat(boat: Boat): Promise<Boat> {
        return await AppDataSource.manager.save(Boat, boat);
    }

    public async updateBoat(boat: Boat): Promise<Boat> {
        return await AppDataSource.manager.save(Boat, boat);
    }

    public async deleteBoat(boat: Boat): Promise<Boat> {
        return await AppDataSource.manager.remove(Boat, boat);
    }

    public async getBoatById(id: number): Promise<Boat | null> {
        return await AppDataSource.manager.findOne(Boat, {
            where: {id},
            relations: ["boatClass", "boatClass.handicapType"],
        });
    }

    //#endregion

    //#region RaceClass

    public async getRaceClass(): Promise<RaceClass[]> {
        const raceClass = await AppDataSource.manager.find(RaceClass, {
            relations: {
                raceClassType: true,
                handicapType: true,
            },
        });
        return raceClass || [];
    }

    public async addRaceClass(raceClass: RaceClass): Promise<RaceClass> {
        return await AppDataSource.manager.save(RaceClass, raceClass);
    }

    public async updateRaceClass(raceClass: RaceClass): Promise<RaceClass> {
        return await AppDataSource.manager.save(RaceClass, raceClass);
    }

    public async deleteRaceClass(raceClass: RaceClass): Promise<RaceClass> {
        return await AppDataSource.manager.remove(RaceClass, raceClass);
    }

    public async getRaceClassById(id: number): Promise<RaceClass | null> {
        return await AppDataSource.manager.findOneBy(RaceClass, {id});
    }

    //#endregion

    //#region BoatClass

    public async getBoatClasses(): Promise<BoatClass[]> {
        const boatClasses = await AppDataSource.manager.find(BoatClass, {
            relations: ["handicapType"],
        });
        return boatClasses || [];
    }

    public async addBoatClass(boatClass: BoatClass): Promise<BoatClass> {
        return await AppDataSource.manager.save(BoatClass, boatClass);
    }

    public async updateBoatClass(boatClass: BoatClass): Promise<BoatClass> {
        return await AppDataSource.manager.save(BoatClass, boatClass);
    }

    public async deleteBoatClass(boatClass: BoatClass): Promise<BoatClass> {
        return await AppDataSource.manager.remove(BoatClass, boatClass);
    }

    public async getBoatClassById(id: number): Promise<BoatClass | null> {
        return await AppDataSource.manager.findOneBy(BoatClass, {id});
    }

    //#endregion

    //#region HandicapType

    public async getHandicapTypes(): Promise<HandicapType[]> {
        const handicapTypes = await AppDataSource.manager.find(HandicapType);
        return handicapTypes || [];
    }

    public async addHandicapType(handicapType: HandicapType): Promise<HandicapType> {
        return await AppDataSource.manager.save(HandicapType, handicapType);
    }

    public async updateHandicapType(handicapType: HandicapType): Promise<HandicapType> {
        return await AppDataSource.manager.save(HandicapType, handicapType);
    }

    public async deleteHandicapType(handicapType: HandicapType): Promise<HandicapType> {
        return await AppDataSource.manager.remove(HandicapType, handicapType);
    }

    public async getHandicapTypeById(id: number): Promise<HandicapType | null> {
        return await AppDataSource.manager.findOneBy(HandicapType, {id});
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

    //#endregion

    //#region Race
    public async getRaces(): Promise<Race[]> {
        const races = await AppDataSource.manager.find(Race, {
            relations: ["raceClass", "series"],
        });
        return races || [];
    }

    public async addRace(race: Race): Promise<Race> {
        return await AppDataSource.manager.save(Race, race);
    }

    public async updateRace(race: Race): Promise<Race> {
        return await AppDataSource.manager.save(Race, race);
    }

    public async deleteRace(race: Race): Promise<Race> {
        return await AppDataSource.manager.remove(Race, race);
    }

    public async getRaceById(id: number): Promise<Race | null> {
        return await AppDataSource.manager.findOne(Race, {
            where: {id},
            relations: ["raceClass", "series"],
        });
    }

    //#endregion

    //#region Series

    public async getSeries(): Promise<Series[]> {
        const series = await AppDataSource.manager.find(Series, {
            relations: ["raceClass", "raceClass.handicapType", "raceClass.raceClassType"],
        });
        return series || [];
    }

    public async addSeries(series: Series): Promise<Series> {
        return await AppDataSource.manager.save(Series, series);
    }

    public async updateSeries(series: Series): Promise<Series> {
        return await AppDataSource.manager.save(Series, series);
    }

    public async deleteSeries(series: Series): Promise<Series> {
        return await AppDataSource.manager.remove(Series, series);
    }

    public async getSeriesById(id: number): Promise<Series | null> {
        return await AppDataSource.manager.findOne(Series, {
            where: {id},
            relations: ["raceClass", "raceClass.handicapType", "raceClass.raceClassType"],
        });
    }

    //#endregion

    //#region RaceClassType

    public async getRaceClassTypes(): Promise<RaceClassType[]> {
        const raceClassTypes = await AppDataSource.manager.find(RaceClassType);
        return raceClassTypes || [];
    }

    public async addRaceClassType(raceClassType: RaceClassType): Promise<RaceClassType> {
        return await AppDataSource.manager.save(RaceClassType, raceClassType);
    }

    public async updateRaceClassType(raceClassType: RaceClassType): Promise<RaceClassType> {
        return await AppDataSource.manager.save(RaceClassType, raceClassType);
    }

    public async deleteRaceClassType(raceClassType: RaceClassType): Promise<RaceClassType> {
        return await AppDataSource.manager.remove(RaceClassType, raceClassType);
    }

    public async getRaceClassTypeById(id: number): Promise<RaceClassType | null> {
        return await AppDataSource.manager.findOneBy(RaceClassType, {id});
    }

    //#endregion

    //#region RaceEntry

    public async getRaceEntries(): Promise<RaceEntry[]> {
        const raceEntries = await AppDataSource.manager.find(RaceEntry, {
            relations: ["boat", "boat.boatClass", "race", "race.raceClass", "race.series"],
        });
        return raceEntries || [];
    }

    public async addRaceEntry(raceEntry: RaceEntry): Promise<RaceEntry> {
        return await AppDataSource.manager.save(RaceEntry, raceEntry);
    }

    public async updateRaceEntry(raceEntry: RaceEntry): Promise<RaceEntry> {
        return await AppDataSource.manager.save(RaceEntry, raceEntry);
    }

    public async deleteRaceEntry(raceEntry: RaceEntry): Promise<RaceEntry> {
        return await AppDataSource.manager.remove(RaceEntry, raceEntry);
    }

    public async getRaceEntryById(id: number): Promise<RaceEntry | null> {
        return await AppDataSource.manager.findOne(RaceEntry, {
            where: {id},
            relations: ["boat", "boat.boatClass", "race", "race.raceClass", "race.series"],
        });
    }

    //#endregion

    //#region RaceOutcome

    public async getRaceOutcomes(): Promise<RaceOutcome[]> {
        const raceOutcomes = await AppDataSource.manager.find(RaceOutcome, {
            relations: ["raceEntry", "raceEntry.boat", "raceEntry.boat.boatClass", "raceEntry.race", "raceEntry.race.raceClass", "raceEntry.race.raceClass.handicapType"],
        });
        return raceOutcomes || [];
    }

    public async addRaceOutcome(raceOutcome: RaceOutcome): Promise<RaceOutcome> {
        // Charger les relations nécessaires pour accéder à la course et son handicap
        const raceEntry = await AppDataSource.manager.findOne(RaceEntry, {
            where: { id: raceOutcome.raceEntry.id },
            relations: ["race", "race.raceClass", "race.raceClass.handicapType"],
        });

        // D'abord, calculer le temps écoulé (finishTime - startTime)
        if (raceEntry && raceEntry.race) {
            raceOutcome.elapsedTime = calculateElapsedTime(
                raceOutcome.finishTime,
                raceEntry.race.startTime
            );

            // Ensuite, appliquer la formule du temps corrigé UNIQUEMENT si la course a un handicap
            if (raceEntry.race.raceClass && raceEntry.race.raceClass.handicapType) {
                const raceClass = raceEntry.race.raceClass;
                const hasHandicap = raceClass.minHandicap > 0 || raceClass.maxHandicap > 0;

                // Calculer le temps corrigé SEULEMENT si un handicap est défini sur la course
                if (hasHandicap) {
                    // Prendre la valeur moyenne du handicap de la course
                    const handicapValue = (raceClass.minHandicap + raceClass.maxHandicap) / 2;
                    raceOutcome.correctedTime = calculateCorrectedTime(
                        raceOutcome.elapsedTime,
                        handicapValue
                    );
                }
            }
        }

        return await AppDataSource.manager.save(RaceOutcome, raceOutcome);
    }

    public async updateRaceOutcome(raceOutcome: RaceOutcome): Promise<RaceOutcome> {
        // Charger les relations nécessaires pour accéder à la course et son handicap
        const raceEntry = await AppDataSource.manager.findOne(RaceEntry, {
            where: { id: raceOutcome.raceEntry.id },
            relations: ["race", "race.raceClass", "race.raceClass.handicapType"],
        });

        // D'abord, calculer le temps écoulé (finishTime - startTime)
        if (raceEntry && raceEntry.race) {
            raceOutcome.elapsedTime = calculateElapsedTime(
                raceOutcome.finishTime,
                raceEntry.race.startTime
            );

            // Ensuite, appliquer la formule du temps corrigé UNIQUEMENT si la course a un handicap
            if (raceEntry.race.raceClass && raceEntry.race.raceClass.handicapType) {
                const raceClass = raceEntry.race.raceClass;
                const hasHandicap = raceClass.minHandicap > 0 || raceClass.maxHandicap > 0;

                // Recalculer le temps corrigé SEULEMENT si un handicap est défini sur la course
                if (hasHandicap) {
                    // Prendre la valeur moyenne du handicap de la course
                    const handicapValue = (raceClass.minHandicap + raceClass.maxHandicap) / 2;
                    raceOutcome.correctedTime = calculateCorrectedTime(
                        raceOutcome.elapsedTime,
                        handicapValue
                    );
                }
            }
        }

        return await AppDataSource.manager.save(RaceOutcome, raceOutcome);
    }

    public async deleteRaceOutcome(raceOutcome: RaceOutcome): Promise<RaceOutcome> {
        return await AppDataSource.manager.remove(RaceOutcome, raceOutcome);
    }

    public async getRaceOutcomeById(id: number): Promise<RaceOutcome | null> {
        return await AppDataSource.manager.findOne(RaceOutcome, {
            where: {id},
            relations: ["raceEntry", "raceEntry.boat", "raceEntry.boat.boatClass", "raceEntry.race", "raceEntry.race.raceClass", "raceEntry.race.raceClass.handicapType"],
        });
    }

    //#endregion
}

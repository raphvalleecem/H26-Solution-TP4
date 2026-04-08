import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class HandicapType {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string = "";
}

@Entity()
export class BoatClass {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string = "";

    @Column()
    handicapValue: number = 0;

    @ManyToOne(() => HandicapType, (handicapType) => handicapType.id)
    handicapType!: HandicapType;
}

@Entity()
export class Boat {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string = "";

    @Column()
    sailNumber: number = 0;

    @Column()
    helmName: string = "";

    @ManyToOne(() => BoatClass, (boatClass) => boatClass.id)
    boatClass!: BoatClass;
}

@Entity()
export class RaceClassType {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string = "";
}

@Entity()
export class RaceClass {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string = "";

    @Column()
    minHandicap: number = 0;

    @Column()
    maxHandicap: number = 0;

    @ManyToOne(() => HandicapType, (handicapType) => handicapType.id)
    handicapType!: HandicapType;

    @ManyToOne(() => RaceClassType, (raceClassType) => raceClassType.id)
    raceClassType!: RaceClassType;
}

@Entity()
export class Race {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string = "";

    @Column()
    startTime: Date = new Date();

    @Column()
    course: string = "";

    @ManyToOne(() => RaceClass, (raceClass) => raceClass.id)
    raceClass!: RaceClass;
}

@Entity()
export class RaceEntry {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Boat, (boat) => boat.id)
    boat!: Boat;

    @ManyToOne(() => Race, (race) => race.id)
    race!: Race;
}

@Entity()
export class RaceOutcome {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    result: string = "";

    @Column()
    position: number = 0;

    @Column()
    finishTime: Date = new Date();

    @Column()
    elapsedTime: number = 0;

    @Column()
    correctedTime: number = 0;

    @OneToOne(() => RaceEntry, (raceEntry) => raceEntry.id)
    raceEntry!: RaceEntry;
}
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceOutcome = exports.RaceEntry = exports.Race = exports.RaceClass = exports.RaceClassType = exports.Boat = exports.BoatClass = exports.HandicapType = void 0;
const typeorm_1 = require("typeorm");
let HandicapType = class HandicapType {
    constructor() {
        this.name = "";
    }
};
exports.HandicapType = HandicapType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HandicapType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HandicapType.prototype, "name", void 0);
exports.HandicapType = HandicapType = __decorate([
    (0, typeorm_1.Entity)()
], HandicapType);
let BoatClass = class BoatClass {
    constructor() {
        this.name = "";
        this.handicapValue = 0;
    }
};
exports.BoatClass = BoatClass;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BoatClass.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BoatClass.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BoatClass.prototype, "handicapValue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HandicapType, (handicapType) => handicapType.id),
    __metadata("design:type", HandicapType)
], BoatClass.prototype, "handicapType", void 0);
exports.BoatClass = BoatClass = __decorate([
    (0, typeorm_1.Entity)()
], BoatClass);
let Boat = class Boat {
    constructor() {
        this.name = "";
        this.sailNumber = 0;
        this.helmName = "";
    }
};
exports.Boat = Boat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Boat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Boat.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Boat.prototype, "sailNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Boat.prototype, "helmName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => BoatClass, (boatClass) => boatClass.id),
    __metadata("design:type", BoatClass)
], Boat.prototype, "boatClass", void 0);
exports.Boat = Boat = __decorate([
    (0, typeorm_1.Entity)()
], Boat);
let RaceClassType = class RaceClassType {
    constructor() {
        this.name = "";
    }
};
exports.RaceClassType = RaceClassType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RaceClassType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RaceClassType.prototype, "name", void 0);
exports.RaceClassType = RaceClassType = __decorate([
    (0, typeorm_1.Entity)()
], RaceClassType);
let RaceClass = class RaceClass {
    constructor() {
        this.name = "";
        this.minHandicap = 0;
        this.maxHandicap = 0;
    }
};
exports.RaceClass = RaceClass;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RaceClass.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RaceClass.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RaceClass.prototype, "minHandicap", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RaceClass.prototype, "maxHandicap", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HandicapType, (handicapType) => handicapType.id),
    __metadata("design:type", HandicapType)
], RaceClass.prototype, "handicapType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RaceClassType, (raceClassType) => raceClassType.id),
    __metadata("design:type", RaceClassType)
], RaceClass.prototype, "raceClassType", void 0);
exports.RaceClass = RaceClass = __decorate([
    (0, typeorm_1.Entity)()
], RaceClass);
let Race = class Race {
    constructor() {
        this.name = "";
        this.startTime = new Date();
        this.course = "";
    }
};
exports.Race = Race;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Race.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Race.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Race.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Race.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RaceClass, (raceClass) => raceClass.id),
    __metadata("design:type", RaceClass)
], Race.prototype, "raceClass", void 0);
exports.Race = Race = __decorate([
    (0, typeorm_1.Entity)()
], Race);
let RaceEntry = class RaceEntry {
};
exports.RaceEntry = RaceEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RaceEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Boat, (boat) => boat.id),
    __metadata("design:type", Boat)
], RaceEntry.prototype, "boat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Race, (race) => race.id),
    __metadata("design:type", Race)
], RaceEntry.prototype, "race", void 0);
exports.RaceEntry = RaceEntry = __decorate([
    (0, typeorm_1.Entity)()
], RaceEntry);
let RaceOutcome = class RaceOutcome {
    constructor() {
        this.result = "";
        this.position = 0;
        this.finishTime = new Date();
        this.elapsedTime = 0;
        this.correctedTime = 0;
    }
};
exports.RaceOutcome = RaceOutcome;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RaceOutcome.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RaceOutcome.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RaceOutcome.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], RaceOutcome.prototype, "finishTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RaceOutcome.prototype, "elapsedTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RaceOutcome.prototype, "correctedTime", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => RaceEntry, (raceEntry) => raceEntry.id),
    __metadata("design:type", RaceEntry)
], RaceOutcome.prototype, "raceEntry", void 0);
exports.RaceOutcome = RaceOutcome = __decorate([
    (0, typeorm_1.Entity)()
], RaceOutcome);

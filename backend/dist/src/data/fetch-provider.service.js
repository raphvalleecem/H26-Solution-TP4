"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchProvider = void 0;
require("reflect-metadata");
const entities_1 = require("../entity/entities");
const data_source_1 = require("../data-source");
class FetchProvider {
    //#region Boats
    getBoats() {
        return __awaiter(this, void 0, void 0, function* () {
            const boats = yield data_source_1.AppDataSource.manager.find(entities_1.Boat);
            return boats || [];
        });
    }
    addBoat(boat) {
        return __awaiter(this, void 0, void 0, function* () {
            yield data_source_1.AppDataSource.manager.insert(entities_1.Boat, boat);
            yield data_source_1.AppDataSource.manager.save(boat);
        });
    }
    getHandicapTypeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.AppDataSource.manager.findOneBy(entities_1.HandicapType, { id });
        });
    }
    addBoatClass(boatClass) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.AppDataSource.manager.save(entities_1.BoatClass, boatClass);
        });
    }
}
exports.FetchProvider = FetchProvider;

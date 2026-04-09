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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fetch_provider_service_1 = require("./data/fetch-provider.service");
const entities_1 = require("./entity/entities");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
let fetchProvider;
router.get('/boats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield getProvider().getBoats());
}));
router.post('/boat', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }
        let boat = new entities_1.Boat();
        boat.name = name;
        yield getProvider().addBoat(boat);
        res.status(201).json({ message: "Boat created successfully", boat });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post('/boat-class', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, handicapValue, handicapTypeId } = req.body;
        if (!name || !String(name).trim()) {
            return res.status(400).json({ error: "Name is required" });
        }
        if (handicapTypeId === undefined || handicapTypeId === null) {
            return res.status(400).json({ error: "handicapTypeId is required" });
        }
        const parsedHandicapTypeId = Number(handicapTypeId);
        const parsedHandicapValue = handicapValue === undefined ? 0 : Number(handicapValue);
        if (Number.isNaN(parsedHandicapTypeId)) {
            return res.status(400).json({ error: "handicapTypeId must be a number" });
        }
        if (Number.isNaN(parsedHandicapValue)) {
            return res.status(400).json({ error: "handicapValue must be a number" });
        }
        const handicapType = yield getProvider().getHandicapTypeById(parsedHandicapTypeId);
        if (!handicapType) {
            return res.status(404).json({ error: "HandicapType not found" });
        }
        const boatClass = new entities_1.BoatClass();
        boatClass.name = String(name).trim();
        boatClass.handicapValue = parsedHandicapValue;
        boatClass.handicapType = handicapType;
        const createdBoatClass = yield getProvider().addBoatClass(boatClass);
        res.status(201).json({ message: "BoatClass created successfully", boatClass: createdBoatClass });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
function getProvider() {
    if (fetchProvider) {
        return fetchProvider;
    }
    else {
        fetchProvider = new fetch_provider_service_1.FetchProvider();
    }
    return fetchProvider;
}
exports.default = router;

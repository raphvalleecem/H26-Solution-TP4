import {Request, Response, Router} from 'express';
import {FetchProvider} from "./data/fetch-provider.service";
import {Boat, BoatClass, Race, RaceClass} from "./entity/entities";
import multer from "multer";

const router = Router();
const upload = multer({storage: multer.memoryStorage()});
let fetchProvider: FetchProvider;

router.get('/boats', async (req: Request, res: Response) => {
    try {
        const boats = await getProvider().getBoats();
        res.json(boats);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

router.get('/race-class', async (req: Request, res: Response) => {
    try {
        const raceClass = await getProvider().getRaceClass();
        res.json(raceClass);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

router.post('/race-class', upload.none(), async (req: Request, res: Response) => {
    try {
        console.log(req.body);

        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        let raceClass: RaceClass;
        raceClass = body;

        await getProvider().addRaceClass(raceClass);

        res.status(201).json({message: "RaceClass created successfully", raceClass});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

const createBoatHandler = async (req: Request, res: Response) => {
    try {
        const {name, sailNumber, helmName, boatClassId} = req.body;

        if (!name || !String(name).trim()) {
            return res.status(400).json({error: "Name is required"});
        }

        let parsedSailNumber = 0;
        if (sailNumber !== undefined && sailNumber !== null && String(sailNumber).trim() !== "") {
            parsedSailNumber = Number(sailNumber);
            if (Number.isNaN(parsedSailNumber)) {
                return res.status(400).json({error: "sailNumber must be a number"});
            }
        }

        const boat = new Boat();
        boat.name = String(name).trim();
        boat.sailNumber = parsedSailNumber;
        boat.helmName = helmName ? String(helmName).trim() : "";

        if (boatClassId !== undefined && boatClassId !== null && String(boatClassId).trim() !== "") {
            const parsedBoatClassId = Number(boatClassId);
            if (Number.isNaN(parsedBoatClassId)) {
                return res.status(400).json({error: "boatClassId must be a number"});
            }

            const boatClass = await getProvider().getBoatClassById(parsedBoatClassId);
            if (!boatClass) {
                return res.status(404).json({error: "BoatClass not found"});
            }

            boat.boatClass = boatClass;
        }

        const createdBoat = await getProvider().addBoat(boat);
        res.status(201).json({message: "Boat created successfully", boat: createdBoat});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
};

const getBoatClassesHandler = async (req: Request, res: Response) => {
    res.json(await getProvider().getBoatClasses());
};

router.get('/boat-classes', getBoatClassesHandler);
router.get('/boat-class', getBoatClassesHandler);
router.get('/races', async (req: Request, res: Response) => {
    res.json(await getProvider().getRaces());
});

router.post('/boats', upload.none(), createBoatHandler);
router.post('/boat', upload.none(), createBoatHandler);

router.post('/boat-class', upload.none(), async (req: Request, res: Response) => {
    try {
        const {name, handicapValue, handicapTypeId} = req.body;

        if (!name || !String(name).trim()) {
            return res.status(400).json({error: "Name is required"});
        }

        if (handicapTypeId === undefined || handicapTypeId === null) {
            return res.status(400).json({error: "handicapTypeId is required"});
        }

        const parsedHandicapTypeId = Number(handicapTypeId);
        const parsedHandicapValue = handicapValue === undefined ? 0 : Number(handicapValue);

        if (Number.isNaN(parsedHandicapTypeId)) {
            return res.status(400).json({error: "handicapTypeId must be a number"});
        }

        if (Number.isNaN(parsedHandicapValue)) {
            return res.status(400).json({error: "handicapValue must be a number"});
        }

        const handicapType = await getProvider().getHandicapTypeById(parsedHandicapTypeId);

        if (!handicapType) {
            return res.status(404).json({error: "HandicapType not found"});
        }

        const boatClass = new BoatClass();
        boatClass.name = String(name).trim();
        boatClass.handicapValue = parsedHandicapValue;
        boatClass.handicapType = handicapType;

        const createdBoatClass = await getProvider().addBoatClass(boatClass);

        res.status(201).json({message: "BoatClass created successfully", boatClass: createdBoatClass});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

router.post('/race', upload.none(), async (req: Request, res: Response) => {
    try {
        const {name, startTime, course, raceClassId, seriesId} = req.body;

        if (!name || !String(name).trim()) {
            return res.status(400).json({error: "Name is required"});
        }

        if (!startTime) {
            return res.status(400).json({error: "startTime is required"});
        }

        if (!course || !String(course).trim()) {
            return res.status(400).json({error: "course is required"});
        }

        if (raceClassId === undefined || raceClassId === null) {
            return res.status(400).json({error: "raceClassId is required"});
        }

        if (seriesId === undefined || seriesId === null) {
            return res.status(400).json({error: "seriesId is required"});
        }

        const parsedStartTime = new Date(startTime);
        const parsedRaceClassId = Number(raceClassId);
        const parsedSeriesId = Number(seriesId);

        // if (Number.isNaN(parsedStartTime.getTime())) {
        //     return res.status(400).json({error: "startTime must be a valid date"});
        // }
        //
        // if (Number.isNaN(parsedRaceClassId)) {
        //     return res.status(400).json({error: "raceClassId must be a number"});
        // }
        //
        // if (Number.isNaN(parsedSeriesId)) {
        //     return res.status(400).json({error: "seriesId must be a number"});
        // }

        const raceClass = await getProvider().getRaceClassById(parsedRaceClassId);

        if (!raceClass) {
            return res.status(404).json({error: "RaceClass not found"});
        }

        // const series = await getProvider().getSeriesById(parsedSeriesId);

        // if (!series) {
        //     return res.status(404).json({error: "Series not found"});
        // }

        const race = new Race();
        race.name = String(name).trim();
        race.startTime = parsedStartTime;
        race.course = String(course).trim();
        race.raceClass = raceClass;
        // race.series = series;

        const createdRace = await getProvider().addRace(race);

        res.status(201).json({message: "Race created successfully", race: createdRace});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

function getProvider() {
    if (fetchProvider) {
        return fetchProvider;
    } else {
        fetchProvider = new FetchProvider();
    }
    return fetchProvider;
}

export default router;

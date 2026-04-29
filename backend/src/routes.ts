import {Request, Response, Router} from 'express';
import {FetchProvider} from "./data/fetch-provider.service";
import {Boat, BoatClass, Race, RaceClass, Series} from "./entity/entities";
import multer from "multer";

const router = Router();
const upload = multer({storage: multer.memoryStorage()});
let fetchProvider: FetchProvider;

//#region Race
router.get('/race', async (req: Request, res: Response) => {
    try {
        const races = await getProvider().getRaces();
        res.json(races);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
router.post('/race/create', upload.none(), async (req: Request, res: Response) => {
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
router.post('/race/update', upload.none(), async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        const race: Race = body;
        await getProvider().updateRace(race);

        res.json({message: "Race updated successfully", race});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
router.post('/race/delete', upload.none(), async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        const race: Race = body;
        await getProvider().deleteRace(race);

        res.json({message: "Race deleted successfully"});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

//#endregion

//#region Series
router.get('/series', async (req: Request, res: Response) => {
    try {
        const series = await getProvider().getSeries();
        res.json(series);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
router.post('/series/create', upload.none(), async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        const series: Series = body;
        await getProvider().addSeries(series);

        res.status(201).json({message: "Series created successfully", series});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
router.post('/series/update', upload.none(), async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        const series: Series = body;
        await getProvider().updateSeries(series);

        res.json({message: "Series updated successfully", series});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
router.post('/series/delete', upload.none(), async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        const series: Series = body;
        await getProvider().deleteSeries(series);

        res.json({message: "Series deleted successfully"});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

//#endregion

//#region Boat
router.get('/boat', async (req: Request, res: Response) => {
    try {
        const boats = await getProvider().getBoats();
        res.json(boats);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
router.post('/boat/create', upload.none(), async (req: Request, res: Response) => {
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
});
router.post('/boat/update', upload.none(), async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        const boat: Boat = body;
        await getProvider().updateBoat(boat);

        res.json({message: "Boat updated successfully", boat});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
router.post('/boat/delete', upload.none(), async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        const boat: Boat = body;
        await getProvider().deleteBoat(boat);

        res.json({message: "Boat deleted successfully"});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

//#endregion

//#region BoatClass
router.get('/boat-class', async (req: Request, res: Response) => {
    try {
        const boatClasses = await getProvider().getBoatClasses();
        res.json(boatClasses);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
router.post('/boat-class/create', upload.none(), async (req: Request, res: Response) => {
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
router.post('/boat-class/update', upload.none(), async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        const boatClass: BoatClass = body;
        await getProvider().updateBoatClass(boatClass);

        res.json({message: "BoatClass updated successfully", boatClass});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
router.post('/boat-class/delete', upload.none(), async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        const boatClass: BoatClass = body;
        await getProvider().deleteBoatClass(boatClass);

        res.json({message: "BoatClass deleted successfully"});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

router.get('/boat-class/:id', async (req: Request, res: Response) => {
    try {
        const parsedId = Number(req.params.id);

        if (Number.isNaN(parsedId)) {
            return res.status(400).json({error: "id must be a number"});
        }

        const boatClass = await getProvider().getBoatClassById(parsedId);

        if (!boatClass) {
            return res.status(404).json({error: "BoatClass not found"});
        }

        res.json(boatClass);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

//#endregion

//#region HandicapType
router.get('/handicap-type', async (req: Request, res: Response) => {
    try {
        const handicapTypes = await getProvider().getHandicapTypes();
        res.json(handicapTypes);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

//#endregion

//#region RaceClassType
router.get('/race-class-type', async (req: Request, res: Response) => {
    try {
        const raceClassTypes = await getProvider().getRaceClassTypes();
        res.json(raceClassTypes);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

//#endregion

//#region RaceClass
router.get('/race-class', async (req: Request, res: Response) => {
    try {
        const raceClass = await getProvider().getRaceClass();
        res.json(raceClass);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
router.post('/race-class/create', upload.none(), async (req: Request, res: Response) => {
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
router.post('/race-class/update', upload.none(), async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        const raceClass: RaceClass = body;
        await getProvider().updateRaceClass(raceClass);

        res.json({message: "RaceClass updated successfully", raceClass});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});
router.post('/race-class/delete', upload.none(), async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({error: "Body is required"});
        }

        const raceClass: RaceClass = body;
        await getProvider().deleteRaceClass(raceClass);

        res.json({message: "RaceClass deleted successfully"});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

//#endregion

function getProvider() {
    if (fetchProvider) {
        return fetchProvider;
    } else {
        fetchProvider = new FetchProvider();
    }
    return fetchProvider;
}

export default router;

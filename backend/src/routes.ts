import {Request, Response, Router} from 'express';
import {FetchProvider} from "./data/fetch-provider.service";
import {Boat, BoatClass} from "./entity/entities";
import multer from "multer";

const router = Router();
const upload = multer({storage: multer.memoryStorage()});
let fetchProvider: FetchProvider;

router.get('/boats', async (req: Request, res: Response) => {
    res.json(await getProvider().getBoats());
});

router.post('/boat', upload.none(), async (req: Request, res: Response) => {
    try {
        console.log(req.body);

        const {name} = req.body;

        if (!name) {
            return res.status(400).json({error: "Name is required"});
        }

        let boat: Boat = new Boat();
        boat.name = name;

        await getProvider().addBoat(boat);

        res.status(201).json({message: "Boat created successfully", boat});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

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

function getProvider() {
    if (fetchProvider) {
        return fetchProvider;
    } else {
        fetchProvider = new FetchProvider();
    }
    return fetchProvider;
}

export default router;
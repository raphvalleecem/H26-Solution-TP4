import {Request, Response, Router} from 'express';
import {FetchProvider} from "./data/fetch-provider.service";
import {Boat} from "./entity/entities";
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
        boat.imageUrl = `https://placehold.co/600x400/orange/white/?text=${encodeURIComponent(boat.name)}`;

        await getProvider().addBoat(boat);

        res.status(201).json({message: "Boat created successfully", boat});
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
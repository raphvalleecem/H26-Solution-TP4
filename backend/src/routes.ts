import {Request, Response, Router} from 'express';
import {FetchProvider} from "./data/fetch-provider.service";
import {Boat} from "./entity/entities";

const router = Router();
let fetchProvider: FetchProvider;

router.get('/boats', async (req: Request, res: Response) => {
    res.json(await getProvider().getBoats());
});

router.get('/boat', async (req: Request, res: Response) => {
    let name: string = generateBoatName();

    let boat: Boat = new Boat();
    boat.name = name;
    boat.imageUrl = "https://placehold.co/600x400/orange/white/?text=" + boat.name;

    await getProvider().addBoat(boat);
    res.json();
});

const generateBoatName = (): string => {
    const adjectives = ["Crimson", "Salty", "Gallant", "Mystic", "Golden", "Swift", "Starlight"];
    const nouns = ["Whale", "Voyager", "Drifter", "Mariner", "Wave", "Seeker", "Siren"];

    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdj} ${randomNoun}`;
};

function getProvider() {
    if (fetchProvider) {
        return fetchProvider;
    } else {
        fetchProvider = new FetchProvider();
    }
    return fetchProvider;
}

export default router;
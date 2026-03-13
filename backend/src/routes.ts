import {Request, Response, Router} from 'express';
import {FetchProvider} from "./data/fetch-provider.service";

const router = Router();
let fetchProvider: FetchProvider;

router.get('/boats', async (req: Request, res: Response) => {
    res.json(await getProvider().getBoats());
});

router.get('/test', async (req: Request, res: Response) => {
    await getProvider().addBoat()
    res.json("test");
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
import express, {Application, Request, Response} from 'express';
import router from './routes';
import cors from 'cors';
import {AppDataSource} from "./data-source";
import {FetchProvider} from "./data/fetch-provider.service";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server!');
});

app.use('/', router);

async function startServer() {
    try {
        await AppDataSource.initialize();

        const fetchProvider = new FetchProvider();
        await fetchProvider.ensureDefaultHandicapTypes();

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error during application startup:", error);
        process.exit(1);
    }
}

startServer();

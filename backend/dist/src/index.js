"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data-source");
try {
    data_source_1.AppDataSource.initialize().then(r => r);
}
catch (error) {
    console.error("Error during Data Source initialization:", error);
}
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Welcome to Express & TypeScript Server!');
});
app.use('/', routes_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

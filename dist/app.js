"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
class PasswordApp {
    app;
    constructor() {
        this.app = (0, fastify_1.default)({
            logger: true
        });
        this.Router;
    }
    Router() {
        this.app.get('/', async (req, rep) => {
            return "Ok 200";
        });
    }
    async TurnOn(port) {
        this.app.listen({ port: port }, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
        console.log("Server running...");
    }
}
const App = new PasswordApp();

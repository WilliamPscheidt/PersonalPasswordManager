import Fastify, {FastifyInstance} from "fastify";
import { PasswordController } from "./Controller/PasswordController";

class PasswordApp {
    private app: FastifyInstance;

    constructor() {

        this.app = Fastify({
            logger: true
        })

        this.Router()
        this.TurnOn(3000)
    }

    private Router () {
        new PasswordController(this.app);
    }

    private async TurnOn (port: number) {
        this.app.listen({ port: port }, (err, address) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        })
        console.log("Server running...")
    }
}

const App = new PasswordApp()

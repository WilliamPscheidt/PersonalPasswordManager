import { FastifyInstance } from "fastify";
import { PasswordRepository } from "../Repositories/PasswordRepository";
import { Cryptography } from "../Utils/Cryptograpth"
import "dotenv/config";

const passwordRepository = new PasswordRepository();
const AppKey = process.env.MASTER_KEY_SECRET;

interface PasswordRequestBody {
    masterPass: string,
    service: string,
    link: string,
    password: string
}

export class PasswordController {
    
    constructor(private app: FastifyInstance) {
        this.app.get("/api/passwords", async (request, reply) => {
            try {
                const services = await passwordRepository.findAllServices();
                return reply.status(200).send(services);
            } catch (error) {
                this.app.log.error(error);
                return reply.status(500).send({ message: "Erro ao buscar os serviços." });
            }
        });

        this.app.post<{ Body: PasswordRequestBody }>("/api/passwords", async (request, reply) => {
            const { masterPass, service, link, password } = request.body;

            try {
                if (!AppKey) {
                    this.app.log.error("MASTER_KEY_SECRET não está definida no .env");
                    return reply.status(500).send({ message: "Erro interno do servidor." });
                }
                const encryptedPassword = Cryptography.Encrypt(masterPass, password);
                const encryptedMasterKey = Cryptography.Encrypt(AppKey, masterPass);
                
                const newPassword = await passwordRepository.create({
                    masterPass: encryptedMasterKey,
                    service,
                    link,
                    password: encryptedPassword,
                });
                
                return reply.status(201).send(newPassword);
            } catch (error) {
                this.app.log.error(error);
                return reply.status(500).send({ message: "Erro ao salvar a senha." });
            }
        });

        this.app.get('/api/passwords/:id', async (request, reply) => {
            interface GetPasswordParams {
                id: string;
            }

            const { id } = request.params as GetPasswordParams;
            const { masterPass } = request.query as { masterPass: string };

            if (!id || !masterPass) {
                return reply.status(400).send({ message: "ID e masterPass são obrigatórios." });
            }
            
            try {
                if (!AppKey) {
                    this.app.log.error("MASTER_KEY_SECRET não está definida no .env");
                    return reply.status(500).send({ message: "Erro interno do servidor." });
                }
                const storedPassword = await passwordRepository.findById(id);
                
                if (!storedPassword) {
                    return reply.status(404).send({ message: "Senha não encontrada." });
                }
                
                let decryptedPassword;
                try {
                    const decryptedStoredMasterKey = Cryptography.Decrypt(AppKey, storedPassword.masterPass);

                    if (decryptedStoredMasterKey !== masterPass) {
                        return reply.status(401).send({ message: "Master Pass incorreta." });
                    }

                    decryptedPassword = Cryptography.Decrypt(masterPass, storedPassword.password);
                } catch (e) {
                    this.app.log.error(e);
                    return reply.status(401).send({ message: "Master Pass incorreta." });
                }
                
                return reply.status(200).send({ password: decryptedPassword });
            } catch (error) {
                this.app.log.error(error);
                return reply.status(500).send({ message: "Erro ao buscar a senha." });
            }
        });
    }
}
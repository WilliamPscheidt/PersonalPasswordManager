import { PrismaClient, Password } from "../generated/prisma";

const prisma = new PrismaClient();

interface CreatePasswordData {
    masterPass: string;
    service: string;
    link: string;
    password: string;
}

export class PasswordRepository {
    async create(data: CreatePasswordData): Promise<Password> {
        return prisma.password.create({
            data: {
                masterPass: data.masterPass,
                service: data.service,
                link: data.link,
                password: data.password,
            },
        });
    }

    async findAll(): Promise<Password[]> {
        return prisma.password.findMany();
    }

    async findAllServices(): Promise<{id: string, service: string, link: string}[]> {
        return prisma.password.findMany({
            select: {
                id: true,
                service: true,
                link: true,
            },
        });
    }

    async findById(id: string): Promise<Password | null> {
        return prisma.password.findUnique({
            where: {
                id: id,
            },
        });
    }
}
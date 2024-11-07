import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { Logger } from "winston";
import { TechRequest, TechResponse, TechUpdateRequest } from "../model/technology.model";
import { Technology } from "@prisma/client";
export declare class TechnologyService {
    private prismaService;
    private validationService;
    private readonly logger;
    constructor(prismaService: PrismaService, validationService: ValidationService, logger: Logger);
    checkTechExists(techName: string): Promise<Technology>;
    checkTechMustExists(techId: string): Promise<Technology>;
    create(request: TechRequest): Promise<TechResponse>;
    update(request: TechUpdateRequest): Promise<TechResponse>;
    delete(id: string): Promise<TechResponse>;
    get(id: string): Promise<TechResponse>;
    getByName(name: string): Promise<TechResponse>;
    list(): Promise<TechResponse[]>;
}
